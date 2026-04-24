import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const MODEL_NAME = "llama-3.3-70b-versatile";

const generateContent = async (prompt) => {
  try {
    const response = await groq.chat.completions.create({
      model: MODEL_NAME,
      messages: [{ role: "user", content: prompt }],
    });

    return response.choices[0]?.message?.content;
  } catch (error) {
    console.error("Groq API Error:", error.message);
    throw new Error(`Groq API failed: ${error.message}`);
  }
};

export { generateContent };
