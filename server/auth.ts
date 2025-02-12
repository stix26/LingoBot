import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { User as SelectUser } from "@shared/schema";

declare global {
  namespace Express {
    interface User extends SelectUser {}
  }
}

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

export function setupAuth(app: Express) {
  const sessionSettings: session.SessionOptions = {
    secret: process.env.REPL_ID!,
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      secure: app.get("env") === "production",
      httpOnly: true,
      maxAge: 1 * 60 * 60 * 1000, // 1 hour
      sameSite: 'lax'
    },
    name: 'sess', // Change session cookie name
    rolling: true, // Refresh session with each request
  };

  if (app.get("env") === "production") {
    app.set("trust proxy", 1);
    sessionSettings.cookie!.secure = true;
  }

  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        console.log(`[Auth Debug] Login attempt for username: ${username}`);
        const user = await storage.getUserByUsername(username);

        if (!user) {
          console.log(`[Auth Debug] User not found: ${username}`);
          return done(null, false, { message: "Invalid username or password" });
        }

        const isValid = await comparePasswords(password, user.password);
        console.log(`[Auth Debug] Password validation result: ${isValid}`);

        if (!isValid) {
          return done(null, false, { message: "Invalid username or password" });
        }
        return done(null, user);
      } catch (error) {
        console.error("[Auth Debug] Error in auth strategy:", error);
        return done(error);
      }
    }),
  );

  passport.serializeUser((user, done) => done(null, user.id));

  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      if (!user) {
        return done(null, false);
      }
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  app.post("/api/register", async (req, res, next) => {
    try {
      console.log("[Auth Debug] Registration attempt:", {
        username: req.body.username,
        hasPassword: !!req.body.password
      });

      const existingUser = await storage.getUserByUsername(req.body.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      const hashedPassword = await hashPassword(req.body.password);
      console.log("[Auth Debug] Password hashed successfully");

      const user = await storage.createUser({
        ...req.body,
        password: hashedPassword,
      });

      console.log("[Auth Debug] User created successfully:", {
        id: user.id,
        username: user.username
      });

      req.login(user, (err) => {
        if (err) return next(err);
        res.status(201).json(user);
      });
    } catch (error) {
      console.error("[Auth Debug] Registration error:", error);
      next(error);
    }
  });

  app.post("/api/login", (req, res, next) => {
    // Clear any existing session
    req.logout((err) => {
      if (err) return next(err);

      passport.authenticate("local", (err, user, info) => {
        if (err) return next(err);
        if (!user) {
          return res.status(401).json({ message: info?.message || "Authentication failed" });
        }
        req.login(user, (err) => {
          if (err) return next(err);
          // Set a new session
          req.session.regenerate((err) => {
            if (err) return next(err);
            res.status(200).json(user);
          });
        });
      })(req, res, next);
    });
  });

  app.post("/api/logout", (req, res, next) => {
    const sessionID = req.sessionID; // Store session ID before clearing

    req.logout((err) => {
      if (err) return next(err);

      // Force session destruction
      req.session.destroy((err) => {
        if (err) return next(err);

        // Clear session from store
        storage.sessionStore.destroy(sessionID, (err) => {
          if (err) console.error('Error destroying session in store:', err);
          res.clearCookie('sess').sendStatus(200);
        });
      });
    });
  });

  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) {
      // Clear any lingering cookies on authentication failure
      res.clearCookie('sess');
      return res.sendStatus(401);
    }
    res.json(req.user);
  });
}