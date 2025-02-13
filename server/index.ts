import dotenv from 'dotenv';
dotenv.config();

import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import path from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session';

// Get the directory name in a cross-platform way
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Environment variables validation
const requiredEnvVars = ['SESSION_SECRET', 'OPENAI_API_KEY'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingVars.join(', ')}.\n` +
    `Please add them to your .env file. Check .env.example for reference.`
  );
}

const app = express();

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Session configuration with error handling
try {
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    name: 'connect.sid',
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      sameSite: 'lax'
    }
  };

  if (process.env.NODE_ENV === "production") {
    app.set("trust proxy", 1);
  }

  app.use(session(sessionSettings));
  setupAuth(app);
} catch (error) {
  console.error('Failed to initialize session:', error);
  process.exit(1);
}

// Rate limiting configuration
const RATE_LIMIT = Number(process.env.RATE_LIMIT) || 100;
const RATE_WINDOW = Number(process.env.RATE_WINDOW) || 60000;
const requestCounts = new Map<string, { count: number; resetTime: number }>();

// Rate limiting middleware
app.use((req, res, next) => {
  if (!req.path.startsWith('/api/')) {
    return next();
  }

  const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() ||
    req.ip ||
    req.socket.remoteAddress ||
    'unknown';

  const now = Date.now();
  const requestData = requestCounts.get(ip) || { count: 0, resetTime: now + RATE_WINDOW };

  if (now > requestData.resetTime) {
    requestData.count = 1;
    requestData.resetTime = now + RATE_WINDOW;
  } else if (requestData.count >= RATE_LIMIT) {
    return res.status(429).json({
      error: "Too many requests",
      message: `Please try again in ${Math.ceil((requestData.resetTime - now) / 1000)} seconds`,
    });
  } else {
    requestData.count++;
  }

  requestCounts.set(ip, requestData);
  next();
});

// Register routes and create server
const server = registerRoutes(app);

// Global error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {})
  });
});

// Setup static file serving and development environment
(async () => {
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    const publicPath = path.join(__dirname, '..', 'public');
    app.use(express.static(publicPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(publicPath, 'index.html'));
    });
  }

  // Start the server
  server.listen(5000, "0.0.0.0", () => {
    log(`Server running on port 5000 (${process.env.NODE_ENV || 'development'} mode)`);
  });
})();