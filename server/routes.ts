import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateChatResponse } from "./lib/openai";
import { insertMessageSchema, chatSettingsSchema } from "@shared/schema";

export function registerRoutes(app: Express): Server {
  app.get("/api/messages", async (_req, res) => {
    const messages = await storage.getMessages();
    res.json(messages);
  });

  app.post("/api/messages", async (req, res) => {
    const parseResult = insertMessageSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ message: "Invalid message format" });
    }

    const message = await storage.addMessage(parseResult.data);

    if (message.role === "user") {
      const settings = req.body.settings;
      const settingsResult = chatSettingsSchema.safeParse(settings);
      if (!settingsResult.success) {
        return res.status(400).json({ message: "Invalid settings" });
      }

      const messages = await storage.getMessages();
      const formattedMessages = [
        { role: "system" as const, content: settings.systemPrompt },
        ...messages.map(m => ({
          role: m.role as "user" | "assistant",
          content: m.content
        }))
      ];

      try {
        const aiResponse = await generateChatResponse(
          formattedMessages,
          settings.temperature
        );
        const aiMessage = await storage.addMessage({
          content: aiResponse,
          role: "assistant"
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