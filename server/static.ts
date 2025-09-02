import express, { type Express } from "express";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function serveStatic(app: Express) {
  const distPath = path.join(__dirname, "../dist/public");
  
  // Serve static files from the dist/public directory
  app.use(express.static(distPath));

  // Handle SPA routing - serve index.html for non-API routes
  app.get("*", (req, res, next) => {
    // Skip API routes
    if (req.path.startsWith("/api")) {
      return next();
    }
    
    const indexPath = path.join(distPath, "index.html");
    res.sendFile(indexPath);
  });
}
