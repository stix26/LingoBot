import { messages, type Message, type InsertMessage, users, type User, type InsertUser, type AvatarCustomization } from "@shared/schema";
import { pool, db } from "./db";
import { eq } from "drizzle-orm";
import session from "express-session";
import createMemoryStore from "memorystore";
import connectPgSimple from "connect-pg-simple";
import crypto from "node:crypto";

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
  private nextUserId = 1;
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new MemoryStore({
      checkPeriod: 3600000, // 1h
      max: 100, // maximum number of sessions to store
      dispose: (key) => {
        console.log(`Session expired: ${key}`);
      }
    });
  }

  async getMessages(): Promise<Message[]> {
    return this.messages;
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const message: Message = {
      id: crypto.randomUUID(),
      content: insertMessage.content,
      metadata: insertMessage.metadata || { role: "user" },
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

export class PgStorage implements IStorage {
  sessionStore: session.Store;
  private db: NonNullable<typeof db>;

  constructor() {
    if (!pool || !db) throw new Error("Postgres not initialized");
    const PgSession = connectPgSimple(session);
    this.sessionStore = new PgSession({ pool });
    this.db = db;
  }

  async getMessages(): Promise<Message[]> {
    return this.db.select().from(messages).orderBy(messages.createdAt);
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const [message] = await this.db
      .insert(messages)
      .values({ content: insertMessage.content, metadata: insertMessage.metadata })
      .returning();
    return message;
  }

  async clearMessages(): Promise<void> {
    await this.db.delete(messages);
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await this.db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await this.db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await this.db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUserAvatar(userId: number, settings: AvatarCustomization): Promise<User> {
    const [user] = await this.db
      .update(users)
      .set({ avatarSettings: settings })
      .where(eq(users.id, userId))
      .returning();
    if (!user) throw new Error('User not found');
    return user;
  }
}

export const storage: IStorage = process.env.DATABASE_URL ? new PgStorage() : new MemStorage();
