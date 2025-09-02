import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { ensureDatabaseReady } from "./database-check";
import 'dotenv/config';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Simple log function
const log = (message: string) => {
  const now = new Date().toLocaleTimeString();
  console.log(`${now} [express] ${message}`);
};

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
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  try {
    // Check database connection before starting server
    await ensureDatabaseReady();
    
    const server = await registerRoutes(app);

    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      console.error("Express error:", err);
      res.status(status).json({ message });
    });

    // ALWAYS serve the app on port 5000
    // this serves both the API and the client.
    // It is the only port that is not firewalled.
    const port = 5000;

    // importantly only setup vite in development and after
    // setting up all the other routes so the catch-all route
    // doesn't interfere with the other routes
    if (app.get("env") === "development") {
      const { setupVite } = await import("./vite");
      await setupVite(app, server);
    } else {
      try {
        const { serveStatic } = await import("./static");
        serveStatic(app);
      } catch (error) {
        console.error("Error setting up static file serving:", error);
        // Fallback: serve a simple response
        app.get("*", (req, res) => {
          if (!req.path.startsWith("/api")) {
            res.send("Application is running but static files could not be served.");
          }
        });
      }
    }

    server.listen(port, () => {
      log(`serving on port ${port}`);
    });

    // Handle process termination gracefully
    process.on('SIGTERM', () => {
      console.log('SIGTERM received, shutting down gracefully');
      server.close(() => {
        console.log('Process terminated');
      });
    });

    process.on('SIGINT', () => {
      console.log('SIGINT received, shutting down gracefully');
      server.close(() => {
        console.log('Process terminated');
      });
    });

  } catch (error) {
    console.error("Fatal error starting server:", error);
    process.exit(1);
  }
})();
