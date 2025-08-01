import * as express from "express";
import { PrismaClient } from "@prisma/client";
import { embedQuery, embedText, cosineSimilarity } from "./pgvector/embed";

const app = express();
app.use(express.json());

// Enable CORS for frontend
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5174');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

const prisma = new PrismaClient();

app.get("/", (req, res) => {
  res.send("CardGuru API is running");
});

app.get("/api/cards", async (req, res) => {
  try {
    const {
      issuer,
      network,
      tier,
      tags,
      annualFeeMin,
      annualFeeMax,
      hasLoungeAccess,
      hasFuelSurcharge,
      minCreditScore,
      maxCreditScore,
      limit = "50",
      offset = "0"
    } = req.query;

    // Build filter conditions
    const where: any = {};

    // Basic filters
    if (issuer) where.issuer = issuer;
    if (network) where.network = network;
    if (tier) where.tier = tier;

    // Annual fee range
    if (annualFeeMin || annualFeeMax) {
      where.annualFee = {};
      if (annualFeeMin) where.annualFee.gte = parseInt(annualFeeMin as string);
      if (annualFeeMax) where.annualFee.lte = parseInt(annualFeeMax as string);
    }

    // Credit score range
    if (minCreditScore || maxCreditScore) {
      where.eligibilityMinCreditScore = {};
      if (minCreditScore) where.eligibilityMinCreditScore.gte = parseInt(minCreditScore as string);
      if (maxCreditScore) where.eligibilityMinCreditScore.lte = parseInt(maxCreditScore as string);
    }

    // Lounge access filter
    if (hasLoungeAccess === "true") {
      where.loungeDomesticVisits = { gt: 0 };
    }

    // Fuel surcharge filter
    if (hasFuelSurcharge === "true") {
      where.fuelSurchargePercentage = { gt: 0 };
    }

    // Tags filter (array contains)
    if (tags) {
      const tagArray = Array.isArray(tags) ? tags : [tags];
      where.tags = { hasSome: tagArray };
    }

    const cards = await prisma.creditCard.findMany({
      where,
      take: parseInt(limit as string),
      skip: parseInt(offset as string),
      orderBy: { name: "asc" }
    });

    // Get total count for pagination
    const totalCount = await prisma.creditCard.count({ where });

    res.json({
      data: cards,
      pagination: {
        total: totalCount,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
        hasMore: parseInt(offset as string) + parseInt(limit as string) < totalCount
      }
    });
  } catch (err) {
    console.error("Error fetching cards:", err);
    res.status(500).json({ error: "Failed to fetch cards" });
  }
});

app.get("/api/cards/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    const card = await prisma.creditCard.findUnique({
      where: { id }
    });

    if (!card) {
      return res.status(404).json({ error: "Card not found" });
    }

    res.json(card);
  } catch (err) {
    console.error("Error fetching card:", err);
    res.status(500).json({ error: "Failed to fetch card" });
  }
});

app.post("/api/search", async (req, res) => {
  try {
    const { query, limit = 5 } = req.body;

    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: "Query is required and must be a string" });
    }

    // Generate embedding for the query
    const queryEmbedding = await embedQuery(query);

    // Get all cards with embeddings
    const allCards = await prisma.creditCard.findMany();

    // Filter cards that have embeddings
    const cardsWithEmbeddings = allCards.filter(card => 
      card.embedding && Array.isArray(card.embedding) && card.embedding.length > 0
    );

    if (cardsWithEmbeddings.length === 0) {
      return res.json({
        query,
        results: [],
        explanation: "No cards have embeddings generated yet. Please run the seed script to generate embeddings.",
        totalFound: 0
      });
    }

    // Calculate similarity scores
    const cardsWithScores = cardsWithEmbeddings.map(card => ({
      ...card,
      similarity: cosineSimilarity(queryEmbedding, card.embedding as number[])
    }));

    console.log("Query Embedding:", queryEmbedding);
    console.log("Cards with Scores:", cardsWithScores);

    // Sort by similarity score (highest first)
    cardsWithScores.sort((a, b) => b.similarity - a.similarity);

    // Take top N results
    const topCards = cardsWithScores.slice(0, limit);

    // Generate explanation for why these cards match
    const explanation = generateSearchExplanation(query, topCards);

    res.json({
      query,
      results: topCards.map(card => ({
        ...card,
        similarity: card.similarity
      })),
      explanation,
      totalFound: topCards.length
    });

  } catch (err) {
    console.error("Error in semantic search:", err);
    res.status(500).json({ error: "Failed to perform search" });
  }
});

function generateSearchExplanation(query: string, cards: any[]): string {
  if (cards.length === 0) {
    return "No cards found matching your query.";
  }

  const cardNames = cards.map(card => card.name).join(", ");
  const topCard = cards[0];
  
  let explanation = `Found ${cards.length} cards matching "${query}": ${cardNames}. `;
  
  // Add specific details about the top match
  if (topCard.tags.includes('lounge') && query.toLowerCase().includes('lounge')) {
    explanation += `Top match ${topCard.name} offers ${topCard.loungeDomesticVisits} domestic lounge visits per year. `;
  }
  
  if (topCard.tier === 'PREMIUM' && query.toLowerCase().includes('premium')) {
    explanation += `${topCard.name} is a premium card with high rewards and exclusive benefits. `;
  }
  
  if (topCard.annualFee === 0 && query.toLowerCase().includes('no fee')) {
    explanation += `${topCard.name} has no annual fee, making it great for first-time users. `;
  }

  return explanation;
}

app.post("/api/compare", async (req, res) => {
  try {
    const { cardIds } = req.body;

    if (!cardIds || !Array.isArray(cardIds) || cardIds.length < 2) {
      return res.status(400).json({ 
        error: "cardIds is required and must be an array with at least 2 card IDs" 
      });
    }

    if (cardIds.length > 5) {
      return res.status(400).json({ 
        error: "Maximum 5 cards can be compared at once" 
      });
    }

    // Get all requested cards
    const cards = await prisma.creditCard.findMany({
      where: {
        id: { in: cardIds }
      }
    });

    if (cards.length !== cardIds.length) {
      const foundIds = cards.map(card => card.id);
      const missingIds = cardIds.filter(id => !foundIds.includes(id));
      return res.status(404).json({ 
        error: `Cards not found: ${missingIds.join(", ")}` 
      });
    }

    // Generate comparison insights
    const comparison = generateComparisonInsights(cards);

    res.json({
      cards,
      comparison,
      comparedAt: new Date().toISOString()
    });

  } catch (err) {
    console.error("Error in card comparison:", err);
    res.status(500).json({ error: "Failed to compare cards" });
  }
});

function generateComparisonInsights(cards: any[]) {
  const insights = {
    lowestAnnualFee: null as any,
    highestRewards: null as any,
    bestLoungeAccess: null as any,
    mostAffordable: null as any,
    summary: [] as string[]
  };

  // Find lowest annual fee
  insights.lowestAnnualFee = cards.reduce((min, card) => 
    card.annualFee < min.annualFee ? card : min
  );

  // Find highest rewards (based on dining rewards as a proxy)
  insights.highestRewards = cards.reduce((max, card) => {
    const cardDiningRate = card.rewardsRates?.dining || 0;
    const maxDiningRate = max.rewardsRates?.dining || 0;
    return cardDiningRate > maxDiningRate ? card : max;
  });

  // Find best lounge access
  insights.bestLoungeAccess = cards.reduce((max, card) => 
    (card.loungeDomesticVisits || 0) > (max.loungeDomesticVisits || 0) ? card : max
  );

  // Find most affordable (lowest income requirement)
  insights.mostAffordable = cards.reduce((min, card) => 
    card.eligibilityMinMonthlyIncome < min.eligibilityMinMonthlyIncome ? card : min
  );

  // Generate summary points
  insights.summary.push(`${insights.lowestAnnualFee.name} has the lowest annual fee at ₹${insights.lowestAnnualFee.annualFee}`);
  insights.summary.push(`${insights.highestRewards.name} offers the highest dining rewards at ${insights.highestRewards.rewardsRates?.dining || 0}%`);
  
  if (insights.bestLoungeAccess.loungeDomesticVisits > 0) {
    insights.summary.push(`${insights.bestLoungeAccess.name} provides the best lounge access with ${insights.bestLoungeAccess.loungeDomesticVisits} domestic visits`);
  }
  
  insights.summary.push(`${insights.mostAffordable.name} has the lowest income requirement at ₹${insights.mostAffordable.eligibilityMinMonthlyIncome.toLocaleString()}`);

  return insights;
}

app.post("/api/generate-embeddings", async (req, res) => {
  try {
    console.log("Starting embedding generation for all cards...");
    
    // Get all cards without embeddings or with empty embeddings
    const allCards = await prisma.creditCard.findMany();
    const cardsNeedingEmbeddings = allCards.filter(card => 
      !card.embedding || !Array.isArray(card.embedding) || card.embedding.length === 0
    );

    console.log(`Found ${cardsNeedingEmbeddings.length} cards needing embeddings out of ${allCards.length} total cards`);

    const results = {
      total: allCards.length,
      processed: 0,
      successful: 0,
      failed: 0,
      errors: [] as string[]
    };

    for (const card of cardsNeedingEmbeddings) {
      try {
        const fullText = `${card.name}. ${card.description}. Issuer: ${card.issuer}, Tier: ${card.tier}, Tags: ${card.tags.join(", ")}, Perks: ${card.additionalPerks.join(", ")}`;
        const embedding = await embedText(fullText);

        await prisma.creditCard.update({
          where: { id: card.id },
          data: { embedding }
        });

        results.processed++;
        results.successful++;
        console.log(`✅ Generated embedding for: ${card.name}`);
        
        // Add a small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (err) {
        results.processed++;
        results.failed++;
        const errorMsg = `Failed to generate embedding for ${card.name}: ${err}`;
        results.errors.push(errorMsg);
        console.error(`❌ ${errorMsg}`);
      }
    }

    res.json({
      message: "Embedding generation completed",
      results,
      timestamp: new Date().toISOString()
    });

  } catch (err) {
    console.error("Error in embedding generation:", err);
    res.status(500).json({ error: "Failed to generate embeddings" });
  }
});

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
