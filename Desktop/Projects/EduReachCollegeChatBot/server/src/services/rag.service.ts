import path from "node:path";
import { fileURLToPath } from "node:url";
import { MongoClient } from "mongodb";
import { createAgent, tool } from "langchain";
import {
  ChatGoogleGenerativeAI,
  GoogleGenerativeAIEmbeddings,
} from "@langchain/google-genai";
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { TextLoader } from "@langchain/classic/document_loaders/fs/text";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { z } from "zod";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// MongoDB connection for vector search
let mongoClient: MongoClient;
let vectorStore: MongoDBAtlasVectorSearch;
let llm: ChatGoogleGenerativeAI;
let embeddings: GoogleGenerativeAIEmbeddings;

// Initialize the knowledge base
export const initializeKnowledgeBase = async (): Promise<void> => {
  try {
    // Connect to MongoDB
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
      throw new Error("MONGODB_URI is not defined");
    }

    const googleApiKey = process.env.GOOGLE_API_KEY;
    if (!googleApiKey) {
      throw new Error("GOOGLE_API_KEY is not defined");
    }

    mongoClient = new MongoClient(mongoURI);
    await mongoClient.connect();

    const db = mongoClient.db("edureach_chatbot");
    const collection = db.collection("knowledge_base");

    // Check if data already exists
    const count = await collection.countDocuments();
    if (count > 0) {
      console.log("Knowledge base already initialized, skipping...");
    } else {
      console.log("Initializing knowledge base...");

      // Load and split documents
      const knowledgePath = path.join(__dirname, "../../knowledge-base/edureach-knowledge.txt");
      const loader = new TextLoader(knowledgePath);
      const docs = await loader.load();

      const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
      });

      const splitDocs = await textSplitter.splitDocuments(docs);

      // Initialize embeddings and LLM
      embeddings = new GoogleGenerativeAIEmbeddings({
        apiKey: googleApiKey,
        modelName: "embedding-001",
      });

      llm = new ChatGoogleGenerativeAI({
        apiKey: googleApiKey,
        model: "gemini-1.5-flash",
        temperature: 0.3,
      });

      // Create vector store
      vectorStore = new MongoDBAtlasVectorSearch(embeddings, {
        collection,
        indexName: "vector_index",
        textKey: "text",
        embeddingKey: "embedding",
      });

      // Add documents to vector store
      await vectorStore.addDocuments(splitDocs);
      console.log(`Added ${splitDocs.length} document chunks to knowledge base`);
    }

    // Initialize components if not already done
    if (!embeddings) {
      embeddings = new GoogleGenerativeAIEmbeddings({
        apiKey: googleApiKey,
        modelName: "embedding-001",
      });
    }

    if (!llm) {
      llm = new ChatGoogleGenerativeAI({
        apiKey: googleApiKey,
        model: "gemini-1.5-flash",
        temperature: 0.3,
      });
    }

    if (!vectorStore) {
      const db = mongoClient.db("edureach_chatbot");
      const collection = db.collection("knowledge_base");
      vectorStore = new MongoDBAtlasVectorSearch(embeddings, {
        collection,
        indexName: "vector_index",
        textKey: "text",
        embeddingKey: "embedding",
      });
    }

  } catch (error) {
    console.error("Error initializing knowledge base:", error);
    throw error;
  }
};

// Get RAG response for a user query
export const getRAGResponse = async (query: string): Promise<string> => {
  try {
    if (!vectorStore || !llm) {
      throw new Error("Knowledge base not initialized");
    }

    // Search for relevant documents
    const relevantDocs = await vectorStore.similaritySearch(query, 3);

    // Prepare context from relevant documents
    const context = relevantDocs.map(doc => doc.pageContent).join("\n\n");

    // Create prompt for the LLM
    const prompt = `You are a helpful assistant for EduReach College. Use the following context to answer the user's question accurately and helpfully. If the information is not in the context, say you don't have that information.

Context:
${context}

Question: ${query}

Answer:`;

    // Generate response
    const response = await llm.invoke(prompt);

    return response.content as string;
  } catch (error) {
    console.error("Error getting RAG response:", error);
    return "I'm sorry, I encountered an error while processing your question. Please try again.";
  }
};