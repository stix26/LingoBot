import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateChatResponse, analyzeMessageSentiment, detectMessageType } from "./lib/openai";
import { insertMessageSchema, chatSettingsSchema } from "@shared/schema";

export function registerRoutes(app: Express): Server {
  app.get("/api/messages", async (_req, res) => {
    const messages = await storage.getMessages();
    res.json(messages);
  });

  app.post("/api/messages", async (req, res) => {
    console.log('Received message request:', req.body);
    const parseResult = insertMessageSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ message: "Invalid message format" });
    }

    // Detect message type and analyze sentiment for user messages
    let messageType = "general";
    let metadata = {};

    if (parseResult.data.role === "user") {
      try {
        const [type, sentiment] = await Promise.all([
          detectMessageType(parseResult.data.content),
          analyzeMessageSentiment(parseResult.data.content)
        ]);
        messageType = type;
        metadata = { sentiment };
      } catch (error) {
        console.error("Error analyzing message:", error);
      }
    }

    const message = await storage.addMessage({
      ...parseResult.data,
      type: messageType,
      metadata
    });

    if (message.role === "user") {
      const settings = req.body.settings;
      const settingsResult = chatSettingsSchema.safeParse(settings);
      if (!settingsResult.success) {
        return res.status(400).json({ message: "Invalid settings" });
      }

      const messages = await storage.getMessages();
      const formattedMessages = messages.map(m => ({
        role: m.role as "user" | "assistant" | "system",
        content: m.content
      }));

      try {
        const aiResponse = await generateChatResponse(
          formattedMessages,
          settings
        );

        const aiMessage = await storage.addMessage({
          content: aiResponse,
          role: "assistant",
          type: messageType,
          metadata: { context: "Response to user query" }
        });

        res.json({ userMessage: message, aiMessage });
      } catch (error) {
        res.status(500).json({ message: "Failed to generate AI response" });
      }
    } else {
      res.json({ userMessage: message });
    }
  });

  app.post("/api/messages/clear", async (_req, res) => {
    await storage.clearMessages();
    res.json({ message: "Chat history cleared" });
  });

  const httpServer = createServer(app);
  return httpServer;
}