import OpenAI from "openai";
import { type ChatSettings } from "@shared/schema";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY environment variable is required");
}

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const MODE_PROMPTS = {
  general: "You are a helpful AI assistant. Provide clear, accurate, and engaging responses. Feel free to use markdown for better formatting.",
  code_assistant: "You are an expert programming assistant. Explain code clearly, suggest improvements, and use markdown code blocks with appropriate language tags. Focus on best practices and maintainable code.",
  analyst: "You are an analytical assistant. Provide detailed analysis with supporting data when possible. Use markdown tables and lists to organize information. Consider multiple perspectives and provide evidence-based conclusions."
};

export async function analyzeSentiment(text: string): Promise<number> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a sentiment analysis expert. Analyze the sentiment of the text and provide a rating from -1 (negative) to 1 (positive). Return only the number.",
        },
        {
          role: "user",
          content: text,
        },
      ],
      temperature: 0.3,
      max_tokens: 10,
    });

    const sentiment = parseFloat(response.choices[0].message.content?.trim() || "0");
    return Math.max(-1, Math.min(1, sentiment)); // Ensure value is between -1 and 1
  } catch (error) {
    console.error("Failed to analyze sentiment:", error);
    return 0; // Return neutral sentiment on error
  }
}

export async function detectMessageType(content: string): Promise<"general" | "code" | "analysis"> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: "Analyze the text and return JSON with type: either 'general', 'code' (if it contains or asks about code), or 'analysis' (if it requires data analysis or detailed explanation)."
      },
      { role: "user", content }
    ],
    response_format: { type: "json_object" }
  });

  const result = JSON.parse(response.choices[0].message.content || "{}");
  return result.type || "general";
}

export async function generateChatResponse(
  messages: { role: "user" | "assistant" | "system"; content: string }[],
  settings: ChatSettings
): Promise<string> {
  try {
    // Enhance system prompt based on mode
    const modePrompt = MODE_PROMPTS[settings.mode] || MODE_PROMPTS.general;
    const enhancedMessages = [
      { role: "system" as const, content: `${modePrompt}\n\n${settings.systemPrompt}` },
      ...messages
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: enhancedMessages,
      temperature: settings.temperature,
    });

    return response.choices[0].message.content || "I couldn't generate a response.";
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw new Error("Failed to generate response");
  }
}

export { analyzeSentiment as analyzeMessageSentiment };