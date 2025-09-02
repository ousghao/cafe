import express, { type Express } from "express";
import path from "path";
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function serveStatic(app: Express) {
  // In production build, dist/index.js is at the root, so public files are in ./public
  const distPath = path.resolve(path.dirname(__filename), "public");
  
  console.log(`[static] Looking for static files at: ${distPath}`);
  
  if (!existsSync(distPath)) {
    console.error(`[static] Static files directory not found: ${distPath}`);
    console.log(`[static] Current directory: ${__dirname}`);
    console.log(`[static] Files in current directory:`, require('fs').readdirSync(__dirname));
    return;
  }

  // Serve static files from the public directory
  app.use(express.static(distPath));
  console.log(`[static] Serving static files from: ${distPath}`);

  // Handle SPA routing - serve index.html for non-API routes
  app.get("*", (req, res, next) => {
    // Skip API routes
    if (req.path.startsWith("/api")) {
      return next();
    }
    
    const indexPath = path.join(distPath, "index.html");
    if (existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).send("Static files not found");
    }
  });
}
