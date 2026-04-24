import { generateContent } from '../config/gemini.config.js';

export const askGemini = async (prompt, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await generateContent(prompt);

      if (!response) {
        throw new Error('Groq returned an empty response');
      }

      return response;
    } catch (error) {
      console.error(`Groq attempt ${i + 1} failed:`, error.message);

      if (i === retries - 1) {
        throw new Error('The AI service is currently unavailable. Please try again later.');
      }

      console.log(`Retrying in 2 seconds... (${i + 1}/${retries})`);
      await new Promise((res) => setTimeout(res, 2000));
    }
  }
};
