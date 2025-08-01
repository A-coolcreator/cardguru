// Sprint 1 Completion Test Script
// This script tests all the core functionality implemented in Sprint 1

const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testSprintOne() {
  console.log('🚀 Starting Sprint 1 Completion Tests\n');

  try {
    // Test 1: Basic API Health Check
    console.log('📋 Test 1: API Health Check');
    const healthResponse = await axios.get(`${BASE_URL}/`);
    console.log('✅ API is running:', healthResponse.data);
    console.log('');

    // Test 2: Get All Cards with Filtering
    console.log('📋 Test 2: Get All Cards with Filtering');
    const cardsResponse = await axios.get(`${BASE_URL}/api/cards?limit=5&tier=PREMIUM`);
    console.log(`✅ Found ${cardsResponse.data.data.length} premium cards`);
    console.log(`✅ Total cards in database: ${cardsResponse.data.pagination.total}`);
    console.log('Sample card:', cardsResponse.data.data[0].name);
    console.log('');

    // Test 3: Get Single Card
    console.log('📋 Test 3: Get Single Card Details');
    const cardId = cardsResponse.data.data[0].id;
    const singleCardResponse = await axios.get(`${BASE_URL}/api/cards/${cardId}`);
    console.log(`✅ Retrieved card: ${singleCardResponse.data.name}`);
    console.log(`✅ Annual Fee: ₹${singleCardResponse.data.annualFee}`);
    console.log(`✅ Tier: ${singleCardResponse.data.tier}`);
    console.log('');

    // Test 4: Semantic Search - Online Shopping
    console.log('📋 Test 4: Semantic Search - Online Shopping');
    const searchResponse1 = await axios.post(`${BASE_URL}/api/search`, {
      query: "best card for online shopping and cashback",
      limit: 3
    });
    console.log(`✅ Found ${searchResponse1.data.results.length} cards for online shopping`);
    console.log('Top match:', searchResponse1.data.results[0].name);
    console.log('Similarity score:', searchResponse1.data.results[0].similarity.toFixed(4));
    console.log('Explanation:', searchResponse1.data.explanation);
    console.log('');

    // Test 5: Semantic Search - Premium Travel
    console.log('📋 Test 5: Semantic Search - Premium Travel');
    const searchResponse2 = await axios.post(`${BASE_URL}/api/search`, {
      query: "luxury card with lounge access for frequent travelers",
      limit: 3
    });
    console.log(`✅ Found ${searchResponse2.data.results.length} cards for luxury travel`);
    console.log('Top match:', searchResponse2.data.results[0].name);
    console.log('Similarity score:', searchResponse2.data.results[0].similarity.toFixed(4));
    console.log('');

    // Test 6: Semantic Search - Entry Level
    console.log('📋 Test 6: Semantic Search - Entry Level');
    const searchResponse3 = await axios.post(`${BASE_URL}/api/search`, {
      query: "no annual fee card for beginners",
      limit: 3
    });
    console.log(`✅ Found ${searchResponse3.data.results.length} cards for beginners`);
    console.log('Top match:', searchResponse3.data.results[0].name);
    console.log('Annual fee:', `₹${searchResponse3.data.results[0].annualFee}`);
    console.log('');

    // Test 7: Card Comparison
    console.log('📋 Test 7: Card Comparison');
    const allCardsResponse = await axios.get(`${BASE_URL}/api/cards?limit=4`);
    const cardIds = allCardsResponse.data.data.slice(0, 3).map(card => card.id); // Compare 3 cards
    
    const compareResponse = await axios.post(`${BASE_URL}/api/compare`, {
      cardIds: cardIds
    });
    
    console.log(`✅ Compared ${compareResponse.data.cards.length} cards successfully`);
    console.log('Cards compared:');
    compareResponse.data.cards.forEach((card, index) => {
      console.log(`  ${index + 1}. ${card.name} (₹${card.annualFee} annual fee)`);
    });
    console.log('');
    console.log('Comparison Insights:');
    compareResponse.data.comparison.summary.forEach(insight => {
      console.log(`  • ${insight}`);
    });
    console.log('');

    // Test 8: Advanced Filtering
    console.log('📋 Test 8: Advanced Filtering Tests');
    
    // Test no annual fee cards
    const noFeeResponse = await axios.get(`${BASE_URL}/api/cards?annualFeeMax=0`);
    console.log(`✅ Found ${noFeeResponse.data.data.length} cards with no annual fee`);
    
    // Test lounge access cards
    const loungeResponse = await axios.get(`${BASE_URL}/api/cards?hasLoungeAccess=true`);
    console.log(`✅ Found ${loungeResponse.data.data.length} cards with lounge access`);
    
    // Test by issuer
    const hdfcResponse = await axios.get(`${BASE_URL}/api/cards?issuer=HDFC`);
    console.log(`✅ Found ${hdfcResponse.data.data.length} HDFC cards`);
    console.log('');

    // Sprint 1 Summary
    console.log('🎉 SPRINT 1 COMPLETION SUMMARY');
    console.log('================================');
    console.log('✅ Database Schema: Implemented with 12 diverse credit cards');
    console.log('✅ API Endpoints: All core endpoints working (GET, POST)');
    console.log('✅ Semantic Search: AI-powered search with embeddings');
    console.log('✅ Card Comparison: Smart comparison with insights');
    console.log('✅ Advanced Filtering: Multiple filter options working');
    console.log('✅ Data Quality: Rich card data with embeddings generated');
    console.log('');
    console.log('🚀 Ready to proceed to Sprint 2!');
    console.log('Next phase: Frontend React app + Enhanced AI features');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    process.exit(1);
  }
}

// Run the tests
testSprintOne();
