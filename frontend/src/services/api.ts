import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface CreditCard {
  id: string;
  name: string;
  issuer: string;
  network: string;
  tier: string;
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
  embedding?: number[];
  similarity?: number;
}

export interface ApiResponse<T> {
  data: T;
  pagination?: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

export interface SearchResponse {
  query: string;
  results: CreditCard[];
  explanation: string;
  totalFound: number;
}

export interface ComparisonResponse {
  cards: CreditCard[];
  comparison: {
    lowestAnnualFee: CreditCard;
    highestRewards: CreditCard;
    bestLoungeAccess: CreditCard;
    mostAffordable: CreditCard;
    summary: string[];
  };
  comparedAt: string;
}

// API Functions
export const cardApi = {
  // Get all cards with optional filters
  getCards: async (params?: {
    limit?: number;
    offset?: number;
    issuer?: string;
    tier?: string;
    annualFeeMin?: number;
    annualFeeMax?: number;
    hasLoungeAccess?: boolean;
    tags?: string[];
  }): Promise<ApiResponse<CreditCard[]>> => {
    const response = await api.get('/cards', { params });
    return response.data;
  },

  // Get single card by ID
  getCard: async (id: string): Promise<CreditCard> => {
    const response = await api.get(`/cards/${id}`);
    return response.data;
  },

  // Semantic search
  search: async (query: string, limit = 5): Promise<SearchResponse> => {
    const response = await api.post('/search', { query, limit });
    return response.data;
  },

  // Compare cards
  compare: async (cardIds: string[]): Promise<ComparisonResponse> => {
    const response = await api.post('/compare', { cardIds });
    return response.data;
  },

  // Generate embeddings (utility)
  generateEmbeddings: async () => {
    const response = await api.post('/generate-embeddings');
    return response.data;
  },
};

export default api;
