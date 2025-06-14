import OpenAI from "openai";
import { type ChatSettings } from "@shared/schema";
import dotenv from "dotenv";

// Ensure environment variables are loaded when this module is imported.
dotenv.config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  throw new Error(
    "OPENAI_API_KEY environment variable is missing. Please add it to your .env file.\n" +
    "Get your API key from https://platform.openai.com/account/api-keys"
  );
}

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

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
    const modePrompt = MODE_PROMPTS[settings.mode] || MODE_PROMPTS.general;
    const enhancedMessages = [
      { role: "system" as const, content: `${modePrompt}\n\n${settings.systemPrompt}` },
      ...messages
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: enhancedMessages,
      temperature: settings.temperature,
      max_tokens: 2000,
    });

    return response.choices[0].message.content || "I couldn't generate a response.";
  } catch (error: any) {
    console.error("OpenAI API error:", error);
    if (error.code === 'ETIMEDOUT' || error.code === 'ECONNRESET') {
      return "I'm having trouble connecting to my brain. Please try again.";
    }
    if (error.response?.status === 429) {
      return "I'm a bit overwhelmed right now. Please try again in a moment.";
    }
    return "I encountered an error while processing your request. Please try again.";
  }
}

export async function generateConversationStarters(messageHistory: { role: "user" | "assistant" | "system"; content: string }[]): Promise<string[]> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "Based on the conversation history, suggest 3 engaging follow-up questions or conversation starters. Return them in a JSON array format. Make suggestions relevant, thought-provoking, and contextual to the ongoing discussion. If there's no history, provide general interesting topics.",
        },
        ...messageHistory.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        {
          role: "user",
          content: "Generate 3 conversation starters based on our chat.",
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return result.starters || [];
  } catch (error) {
    console.error("Failed to generate conversation starters:", error);
    return [
      "Tell me more about your interests.",
      "What's your opinion on AI technology?",
      "What would you like to learn about today?",
    ];
  }
}

export { analyzeSentiment as analyzeMessageSentiment };
export { generateConversationStarters as generateSuggestions };
