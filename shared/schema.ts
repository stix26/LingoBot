import { pgTable, text, serial, timestamp, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { sql } from "drizzle-orm";

export const messageMetadataSchema = z.object({
  sentiment: z.number().optional(),
  role: z.enum(["user", "assistant", "system"])
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const messages = pgTable("messages", {
  id: integer("id").primaryKey().default(sql`gen_random_uuid()`),
  content: text("content").notNull(),
  metadata: jsonb("metadata").$type<z.infer<typeof messageMetadataSchema>>().notNull().default({ role: "user" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true
});

export const insertMessageSchema = createInsertSchema(messages, {
  content: z.string().min(1, "Message cannot be empty"),
  metadata: messageMetadataSchema
});

export const chatSettings = z.object({
  temperature: z.number().min(0).max(2),
  systemPrompt: z.string().optional(),
  mode: z.enum(["general", "code_assistant", "analyst"]).default("general")
});

export const chatSettingsSchema = chatSettings;

export type ChatSettings = z.infer<typeof chatSettings>;
export type Message = typeof messages.$inferSelect;
export type MessageMetadata = z.infer<typeof messageMetadataSchema>;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;