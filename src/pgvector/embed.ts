
import { HfInference } from "@huggingface/inference";

const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY!;
const HF_MODEL_ID = "sentence-transformers/all-MiniLM-L6-v2";

const inference = new HfInference(HUGGINGFACE_API_KEY);

export async function embedText(text: string): Promise<number[]> {
  try {
    const result = await inference.featureExtraction({
      model: HF_MODEL_ID,
      inputs: text,
    });

    if (
      !result ||
      !Array.isArray(result) ||
      (Array.isArray(result) && typeof result[0] === 'number' && typeof result[0][0] === 'number')
    ) {
      throw new Error('Invalid embedding format');
    }

    if (typeof result[0] === 'number') {
      return result as number[];
    }
    
    return result[0] as number[];

  } catch (error) {
    console.error("❌ Error generating embedding:", error);
    throw error;
  }
}


export async function embedQuery(query: string): Promise<number[]> {
  return embedText(query);
}

export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error('Vectors must have the same length');
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}
