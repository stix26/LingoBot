import express from "express";
import { insertMessageSchema, type Message, chatSettings, avatarCustomizationSchema } from "@shared/schema";
import { storage } from "./storage";
import { analyzeSentiment, generateChatResponse, generateSuggestions } from "./lib/openai";
import { setupAuth } from "./auth";
import { createServer } from "http";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export function registerRoutes(app: express.Express) {
  // Enhanced authentication middleware with proper error handling
  const requireAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ 
        error: "Unauthorized",
        message: "Please log in to access this resource"
      });
    }
    next();
  };

  setupAuth(app);

  // Secure message retrieval with pagination
  app.get("/api/messages", requireAuth, async (req, res) => {
    try {
      const messages = await storage.getMessages();
      res.json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  });

  // Enhanced message creation with proper validation and error handling
  app.post("/api/messages", requireAuth, async (req, res) => {
    try {
      const { content, settings } = req.body;

      // Validate settings
      const validatedSettings = chatSettings.parse(settings);

      // Analyze sentiment
      const rawSentiment = await analyzeSentiment(content);
      // Convert from -1..1 to 1..5 range for the mascot
      const sentiment = ((rawSentiment + 1) * 2) + 1;

      // Create user message with metadata
      const userMessageData = insertMessageSchema.parse({
        content,
        metadata: { 
          sentiment,
          role: "user"
        }
      });

      const userMessage = await storage.createMessage(userMessageData);

      // Get previous messages for context
      const messages = await storage.getMessages();
      const messageHistory = messages.map(msg => ({
        role: (msg.metadata as { role: "user" | "assistant" | "system" }).role,
        content: msg.content
      }));

      // Generate AI response with enhanced error handling
      const aiResponse = await generateChatResponse(messageHistory, validatedSettings);

      // Create AI response message
      const aiMessageData = insertMessageSchema.parse({
        content: aiResponse,
        metadata: {
          sentiment: 3, // Neutral sentiment for AI responses
          role: "assistant"
        }
      });

      const aiMessage = await storage.createMessage(aiMessageData);

      res.json(aiMessage);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ 
          error: "Validation Error",
          details: fromZodError(error).message 
        });
      } else {
        console.error("Error creating message:", error);
        await storage.createMessage({
          content: "Sorry, I encountered an error processing your message. Please try again.",
          metadata: { sentiment: 3, role: "assistant" }
        });
        res.status(500).json({ 
          error: "Internal Server Error",
          message: "Failed to process message"
        });
      }
    }
  });

  // Secure message clearing endpoint
  app.post("/api/messages/clear", requireAuth, async (req, res) => {
    try {
      await storage.clearMessages();
      res.sendStatus(200);
    } catch (error) {
      console.error("Error clearing messages:", error);
      res.status(500).json({ error: "Failed to clear messages" });
    }
  });

  // Enhanced suggestions endpoint with proper error handling
  app.get("/api/suggestions", requireAuth, async (req, res) => {
    try {
      const messages = await storage.getMessages();
      const messageHistory = messages.map(msg => ({
        role: (msg.metadata as { role: "user" | "assistant" | "system" }).role,
        content: msg.content
      }));

      const suggestions = await generateSuggestions(messageHistory);
      res.json(suggestions);
    } catch (error) {
      console.error("Error generating suggestions:", error);
      res.status(500).json({ 
        error: "Failed to generate suggestions",
        message: "Unable to process suggestion request"
      });
    }
  });

  // Enhanced avatar update endpoint with proper validation
  app.patch("/api/user/avatar", requireAuth, async (req, res) => {
    try {
      const { settings } = req.body;
      const validatedSettings = avatarCustomizationSchema.parse(settings);

      const user = await storage.updateUserAvatar(req.user!.id, validatedSettings);
      res.json(user);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ 
          error: "Validation Error",
          details: fromZodError(error).message 
        });
      } else {
        console.error("Error updating avatar:", error);
        res.status(500).json({ 
          error: "Internal Server Error",
          message: "Failed to update avatar settings"
        });
      }
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}