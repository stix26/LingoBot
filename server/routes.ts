import express from "express";
import { insertMessageSchema, type Message, chatSettings } from "@shared/schema";
import { storage } from "./storage";
import { analyzeSentiment } from "./lib/openai";
import { setupAuth } from "./auth";
import { createServer } from "http";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export function registerRoutes(app: express.Express) {
  // Authentication middleware for protected routes
  const requireAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    next();
  };

  setupAuth(app);

  app.get("/api/messages", requireAuth, async (req, res) => {
    const messages = await storage.getMessages();
    res.json(messages);
  });

  app.post("/api/messages", requireAuth, async (req, res) => {
    try {
      const { content, settings } = req.body;

      // Validate settings
      const validatedSettings = chatSettings.parse(settings);

      // Analyze sentiment
      const rawSentiment = await analyzeSentiment(content);
      // Convert from -1..1 to 1..5 range for the mascot
      const sentiment = ((rawSentiment + 1) * 2) + 1;

      // Create message with metadata
      const messageData = insertMessageSchema.parse({
        content,
        metadata: { 
          sentiment,
          role: "user"
        }
      });

      const message = await storage.createMessage(messageData);
      res.json(message);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ error: fromZodError(error).message });
      } else {
        console.error("Error creating message:", error);
        res.status(500).json({ error: "Failed to create message" });
      }
    }
  });

  app.post("/api/messages/clear", requireAuth, async (req, res) => {
    await storage.clearMessages();
    res.sendStatus(200);
  });

  const httpServer = createServer(app);
  return httpServer;
}