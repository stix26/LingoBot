import { pgTable, text, serial, timestamp, integer, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  role: text("role", { enum: ["user", "assistant", "system"] }).notNull(),
  type: text("type", { enum: ["general", "code", "analysis"] }).default("general"),
  metadata: json("metadata").$type<{
    sentiment?: { score: number; confidence: number };
    codeLanguage?: string;
    context?: string;
  }>(),
  userId: integer("user_id").references(() => users.id),
  timestamp: timestamp("timestamp").defaultNow().notNull()
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true
});

export const insertMessageSchema = createInsertSchema(messages).pick({
  content: true,
  role: true,
  type: true,
  metadata: true
});

export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export const chatSettingsSchema = z.object({
  model: z.enum(["gpt-4o"]),
  temperature: z.number().min(0).max(2),
  systemPrompt: z.string().min(1),
  mode: z.enum(["general", "code_assistant", "analyst"]).default("general")
});

export type ChatSettings = z.infer<typeof chatSettingsSchema>;