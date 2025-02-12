import { messages, type Message, type InsertMessage, users, type User, type InsertUser } from "@shared/schema";
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
      checkPeriod: 86400000,
    });
  }

  async getMessages(): Promise<Message[]> {
    return this.messages;
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const message: Message = {
      id: this.nextMessageId++,
      content: insertMessage.content,
      metadata: insertMessage.metadata || {},
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
      createdAt: new Date()
    };
    this.users.push(user);
    return user;
  }
}

export const storage = new MemStorage();