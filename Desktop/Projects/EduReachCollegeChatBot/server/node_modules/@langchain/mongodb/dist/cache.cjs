const require_rolldown_runtime = require('./_virtual/rolldown_runtime.cjs');
const __langchain_core_caches = require_rolldown_runtime.__toESM(require("@langchain/core/caches"));

//#region src/cache.ts
var MongoDBCache = class extends __langchain_core_caches.BaseCache {
	collection;
	PROMPT = "prompt";
	LLM = "llm";
	RETURN_VAL = "return_val";
	constructor({ collection }) {
		super();
		this.collection = collection;
	}
	async lookup(prompt, llmKey) {
		const doc = await this.collection.findOne({
			[this.PROMPT]: { $eq: prompt },
			[this.LLM]: { $eq: llmKey }
		});
		if (!doc?.[this.RETURN_VAL]) return null;
		try {
			const arr = JSON.parse(doc[this.RETURN_VAL]);
			return arr.map((g) => (0, __langchain_core_caches.deserializeStoredGeneration)(JSON.parse(g)));
		} catch {
			return null;
		}
	}
	async update(prompt, llmKey, generations) {
		const serialized = JSON.stringify(generations.map((g) => JSON.stringify((0, __langchain_core_caches.serializeGeneration)(g))));
		await this.collection.updateOne({
			[this.PROMPT]: prompt,
			[this.LLM]: llmKey
		}, { $set: { [this.RETURN_VAL]: serialized } }, { upsert: true });
	}
	async clear(filter = {}) {
		await this.collection.deleteMany(filter);
	}
};
var MongoDBAtlasSemanticCache = class MongoDBAtlasSemanticCache extends __langchain_core_caches.BaseCache {
	collection;
	embeddingModel;
	indexName;
	scoreThreshold;
	waitUntilReady;
	constructor(collection, embeddingModel, options = {}) {
		super();
		this.collection = collection;
		this.embeddingModel = embeddingModel;
		this.indexName = options.indexName ?? "default";
		this.scoreThreshold = options.scoreThreshold ?? null;
		this.waitUntilReady = options.waitUntilReady ?? null;
	}
	async lookup(prompt, llmString) {
		const embedding = MongoDBAtlasSemanticCache.fixArrayPrecision(await this.getEmbedding(prompt));
		const searchQuery = {
			queryVector: embedding,
			index: this.indexName,
			path: "embedding",
			limit: 1,
			numCandidates: 20
		};
		const searchResponse = await this.collection.aggregate([
			{ $vectorSearch: searchQuery },
			{ $set: { score: { $meta: "vectorSearchScore" } } },
			{ $match: { llm_string: MongoDBAtlasSemanticCache.extractModelName(llmString ?? "") } },
			{ $limit: 1 }
		]).toArray();
		if (searchResponse.length === 0 || this.scoreThreshold !== null && searchResponse[0].score < this.scoreThreshold) return null;
		return searchResponse[0].return_val;
	}
	async update(prompt, llmString, returnVal) {
		const embedding = await this.getEmbedding(prompt);
		await this.collection.insertOne({
			prompt,
			llm_string: MongoDBAtlasSemanticCache.extractModelName(llmString),
			return_val: returnVal,
			embedding
		});
		if (this.waitUntilReady) await new Promise((resolve) => {
			setTimeout(resolve, this.waitUntilReady * 1e3);
		});
	}
	async getEmbedding(text) {
		return await this.embeddingModel.embedQuery(text);
	}
	async clear(filters = {}) {
		await this.collection.deleteMany(filters);
	}
	static extractModelName(llmString) {
		let safeLLMString = "unknown_model";
		const match = llmString.match(/(?:^|,)model_name:"([^"]+)"|(?:^|,)model:"([^"]+)"/);
		if (match) safeLLMString = match[1] ?? match[2];
		return safeLLMString;
	}
	static fixArrayPrecision(array) {
		if (!Array.isArray(array)) {
			console.error("fixArrayPrecision received an invalid input:", array);
			return [];
		}
		return array.map((value) => Number.isInteger(value) ? value + 1e-15 : value);
	}
};

//#endregion
exports.MongoDBAtlasSemanticCache = MongoDBAtlasSemanticCache;
exports.MongoDBCache = MongoDBCache;
//# sourceMappingURL=cache.cjs.map