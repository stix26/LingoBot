import dotenv from 'dotenv';
dotenv.config();

import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name in a cross-platform way
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Environment variables validation
const requiredEnvVars = ['SESSION_SECRET', 'OPENAI_API_KEY'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingVars.join(', ')}.\n` +
    `Please add them to your .env file. Check .env.example for reference.\n\n` +
    `Required Environment Variables:\n` +
    `- OPENAI_API_KEY: Get from https://platform.openai.com/account/api-keys\n` +
    `- SESSION_SECRET: Generate using: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"\n` +
    `- DATABASE_URL: PostgreSQL connection string (format: postgresql://user:password@host:port/database)\n\n` +
    `Create a .env file in the same directory as the executable with these variables.`
  );
}

// Rate limiting configuration with proper type casting
const RATE_LIMIT = Number(process.env.RATE_LIMIT) || 20; // Reduced to 20 requests per window
const RATE_WINDOW = Number(process.env.RATE_WINDOW) || 60000; // 1 minute in ms

// Enhanced rate limiter with proper typing
const requestCounts = new Map<string, { count: number; resetTime: number }>();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Set trust proxy to work with Replit's proxy
app.set('trust proxy', 1);

// Clear messages on server start
(async () => {
  try {
    await storage.clearMessages();
    log("Chat history cleared on server start");
  } catch (error) {
    console.error("Failed to clear chat history:", error);
  }
})();

// Enhanced rate limiting middleware with better IP handling and error messages
app.use((req, res, next) => {
  // Skip rate limiting for static assets and non-API routes
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
    const retryAfter = Math.ceil((requestData.resetTime - now) / 1000);
    return res.status(429).json({
      error: "Too many requests",
      message: `Please try again in ${retryAfter} seconds`,
      retryAfter
    });
  } else {
    requestData.count++;
  }

  requestCounts.set(ip, requestData);
  next();
});

// Enhanced logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        // Safely stringify JSON response, excluding sensitive data
        const safeResponse = { ...capturedJsonResponse };
        delete safeResponse.password;
        delete safeResponse.token;
        logLine += ` :: ${JSON.stringify(safeResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

setupAuth(app);

(async () => {
  const server = registerRoutes(app);

  // Enhanced global error handler with better security
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    // Log error details but exclude sensitive information
    console.error('Error details:', {
      status,
      message,
      path: _req.path,
      method: _req.method,
      timestamp: new Date().toISOString(),
      ...(app.get('env') === 'development' ? { stack: err.stack } : {})
    });

    // Don't send stack traces to client in production
    const errorResponse = {
      message: status === 500 ? "Internal Server Error" : message,
      ...(app.get('env') === 'development' ? { stack: err.stack } : {})
    };

    res.status(status).json(errorResponse);
  });

  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    // Use path.join for cross-platform compatibility
    const publicPath = path.join(__dirname, '..', 'public');
    app.use(express.static(publicPath));

    // Serve index.html for all routes in production
    app.get('*', (req, res) => {
      res.sendFile(path.join(publicPath, 'index.html'));
    });
  }

  const startServer = async (initialPort: number) => {
    const findAvailablePort = async (port: number): Promise<number> => {
      try {
        await new Promise((resolve, reject) => {
          server.once('error', (err: any) => {
            if (err.code === 'EADDRINUSE') {
              server.close();
              resolve(findAvailablePort(port + 1));
            } else {
              reject(err);
            }
          });
          server.listen(port, "0.0.0.0", () => {
            server.removeAllListeners('error');
            resolve(port);
          });
        });
        return port;
      } catch (err) {
        if (port > initialPort + 10) {
          throw new Error('No available ports found');
        }
        return findAvailablePort(port + 1);
      }
    };

    try {
      const port = await findAvailablePort(initialPort);
      log(`serving on port ${port}`);
    } catch (err) {
      console.error('Failed to start server:', err);
      process.exit(1);
    }
  };

  startServer(5000);
})();