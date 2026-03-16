import { Collection, Document } from "mongodb";
import { EmbeddingsInterface } from "@langchain/core/embeddings";
import { BaseCache } from "@langchain/core/caches";
import { Generation } from "@langchain/core/outputs";

//#region src/cache.d.ts
interface MongoDBCacheArgs {
  collection: Collection<Document>;
}
declare class MongoDBCache extends BaseCache {
  private collection;
  private PROMPT;
  private LLM;
  private RETURN_VAL;
  constructor({
    collection
  }: MongoDBCacheArgs);
  lookup(prompt: string, llmKey: string): Promise<Generation[] | null>;
  update(prompt: string, llmKey: string, generations: Generation[]): Promise<void>;
  clear(filter?: Record<string, unknown>): Promise<void>;
}
interface MongoDBAtlasSemanticCacheArgs {
  collection: Collection<Document>;
  embeddings: EmbeddingsInterface;
  indexName?: string;
  scoreThreshold?: number;
  waitUntilReady?: number;
}
declare class MongoDBAtlasSemanticCache extends BaseCache {
  private collection;
  private embeddingModel;
  private indexName;
  private scoreThreshold;
  private waitUntilReady;
  constructor(collection: Collection<Document>, embeddingModel: EmbeddingsInterface, options?: {
    indexName?: string;
    scoreThreshold?: number | null;
    waitUntilReady?: number | null;
  });
  lookup(prompt: string, llmString: string): Promise<Generation[] | null>;
  update(prompt: string, llmString: string, returnVal: Generation[]): Promise<void>;
  getEmbedding(text: string): Promise<number[]>;
  clear(filters?: Record<string, unknown>): Promise<void>;
  static extractModelName(llmString: string): string;
  static fixArrayPrecision(array: number[]): number[];
}
//#endregion
export { MongoDBAtlasSemanticCache, MongoDBAtlasSemanticCacheArgs, MongoDBCache, MongoDBCacheArgs };
//# sourceMappingURL=cache.d.cts.map