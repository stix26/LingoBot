import { messages, type Message, type InsertMessage, users, type User, type InsertUser, type AvatarCustomization } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  getMessages(): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  clearMessages(): Promise<void>;
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserAvatar(userId: number, settings: AvatarCustomization): Promise<User>;
  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private messages: Message[] = [];
  private users: User[] = [];
  private nextMessageId = 1;
  private nextUserId = 1;
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new MemoryStore({
      checkPeriod: 3600000, // 1h
      stale: true,
      dispose: (key) => {
        console.log(`Cleaning up expired session: ${key}`);
      }
    });

    // Cleanup old messages periodically
    setInterval(() => {
      const oneHourAgo = new Date(Date.now() - 3600000);
      this.messages = this.messages.filter(msg => msg.createdAt > oneHourAgo);
    }, 3600000);
  }

  async getMessages(): Promise<Message[]> {
    return this.messages;
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const message: Message = {
      id: this.nextMessageId++,
      content: insertMessage.content,
      metadata: insertMessage.metadata || { role: "user", sentiment: 0 },
      createdAt: new Date(),
    };
    this.messages.push(message);
    return message;
  }

  async clearMessages(): Promise<void> {
    this.messages = [];
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.find(user => user.id === id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return this.users.find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = {
      id: this.nextUserId++,
      username: insertUser.username,
      password: insertUser.password,
      avatarSettings: {
        primaryColor: "hsl(142 76% 36%)",
        secondaryColor: "hsl(142 76% 46%)",
        shape: "circle",
        style: "minimal",
        animation: "bounce"
      },
      createdAt: new Date()
    };
    this.users.push(user);
    return user;
  }

  async updateUserAvatar(userId: number, settings: AvatarCustomization): Promise<User> {
    const userIndex = this.users.findIndex(user => user.id === userId);
    if (userIndex === -1) {
      throw new Error("User not found");
    }
    this.users[userIndex] = {
      ...this.users[userIndex],
      avatarSettings: settings
    };
    return this.users[userIndex];
  }
}

export const storage = new MemStorage();