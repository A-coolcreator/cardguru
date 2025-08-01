import { PrismaClient } from "@prisma/client";
import { embedText } from "../pgvector/embed";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

interface CardData {
  name: string;
  issuer: "HDFC" | "AXIS" | "ICICI" | "SBI" | "KOTAK" | "OTHER";
  network: "VISA" | "MASTERCARD" | "RUPAY";
  tier: "ENTRY" | "MID" | "PREMIUM";
  annualFee: number;
  feeWaiverThreshold?: number;
  feeWaiver: boolean;
  rewardsRates: Record<string, number>;
  fuelSurchargePercentage?: number;
  fuelSurchargeMaxCap?: number;
  loungeDomesticVisits?: number;
  loungeInternationalVisits?: number;
  loungeMinSpendPerQuarter?: number;
  welcomeOffer?: string;
  eligibilityMinMonthlyIncome: number;
  eligibilityMinCreditScore: number;
  eligibilityNri: boolean;
  additionalPerks: string[];
  tags: string[];
  description: string;
  applyLink: string;
  logoUrl?: string;
}

async function generateCardEmbedding(card: CardData): Promise<number[]> {
  const fullText = `${card.name}. ${card.description}. Issuer: ${card.issuer}, Tier: ${card.tier}, Tags: ${card.tags.join(", ")}, Perks: ${card.additionalPerks.join(", ")}`;
  return await embedText(fullText);
}

async function main() {
  const jsonPath = path.join(__dirname, "cards.json");
  const raw = fs.readFileSync(jsonPath, "utf-8");
  const cards: CardData[] = JSON.parse(raw);

  for (const card of cards) {
    try {
      const embedding = await generateCardEmbedding(card);

      await prisma.creditCard.create({
        data: {
          name: card.name,
          issuer: card.issuer,
          network: card.network,
          tier: card.tier,
          annualFee: card.annualFee,
          feeWaiverThreshold: card.feeWaiverThreshold,
          feeWaiver: card.feeWaiver,
          rewardsRates: card.rewardsRates,
          fuelSurchargePercentage: card.fuelSurchargePercentage,
          fuelSurchargeMaxCap: card.fuelSurchargeMaxCap,
          loungeDomesticVisits: card.loungeDomesticVisits,
          loungeInternationalVisits: card.loungeInternationalVisits,
          loungeMinSpendPerQuarter: card.loungeMinSpendPerQuarter,
          welcomeOffer: card.welcomeOffer,
          eligibilityMinMonthlyIncome: card.eligibilityMinMonthlyIncome,
          eligibilityMinCreditScore: card.eligibilityMinCreditScore,
          eligibilityNri: card.eligibilityNri,
          additionalPerks: card.additionalPerks,
          tags: card.tags,
          description: card.description,
          embedding: embedding,
          applyLink: card.applyLink,
          logoUrl: card.logoUrl,
        },
      });

      console.log(`✅ Inserted card with embedding: ${card.name}`);
    } catch (err) {
      console.error(`❌ Failed to insert card ${card.name}:`, err);
    }
  }
}

// Function to update existing cards with embeddings
async function updateExistingCardsWithEmbeddings() {
  try {
    const allCards = await prisma.creditCard.findMany();
    const cardsWithoutEmbeddings = allCards.filter(card => 
      !card.embedding || card.embedding.length === 0
    );

    console.log(`Found ${cardsWithoutEmbeddings.length} cards without embeddings`);

    for (const card of cardsWithoutEmbeddings) {
      try {
        const fullText = `${card.name}. ${card.description}. Issuer: ${card.issuer}, Tier: ${card.tier}, Tags: ${card.tags.join(", ")}, Perks: ${card.additionalPerks.join(", ")}`;
        const embedding = await embedText(fullText);

        await prisma.creditCard.update({
          where: { id: card.id },
          data: { embedding }
        });

        console.log(`✅ Updated embedding for: ${card.name}`);
      } catch (err) {
        console.error(`❌ Failed to update embedding for ${card.name}:`, err);
      }
    }
  } catch (err) {
    console.error("❌ Error updating embeddings:", err);
  }
}

// Check if we should update existing cards or create new ones
const shouldUpdateExisting = process.argv.includes('--update-embeddings');

if (shouldUpdateExisting) {
  updateExistingCardsWithEmbeddings()
    .catch((e) => {
      console.error("❌ Update embeddings error:", e);
      process.exit(1);
    })
    .finally(() => prisma.$disconnect());
} else {
  main()
    .catch((e) => {
      console.error("❌ Seed error:", e);
      process.exit(1);
    })
    .finally(() => prisma.$disconnect());
}
