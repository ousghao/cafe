import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertReservationSchema, insertCustomCakeInquirySchema, insertContactMessageSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Menu endpoints
  app.get("/api/menu", async (req, res) => {
    try {
      const { category } = req.query;
      let menuItems;
      
      if (category && typeof category === 'string') {
        menuItems = await storage.getMenuItemsByCategory(category);
      } else {
        menuItems = await storage.getMenuItems();
      }
      
      res.json(menuItems);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch menu items" });
    }
  });

  // Reservation endpoints
  app.post("/api/reservations", async (req, res) => {
    try {
      const validatedData = insertReservationSchema.parse(req.body);
      const reservation = await storage.createReservation(validatedData);
      res.status(201).json(reservation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid reservation data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create reservation" });
      }
    }
  });

  app.get("/api/reservations", async (req, res) => {
    try {
      const reservations = await storage.getReservations();
      res.json(reservations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reservations" });
    }
  });

  // Custom cake inquiry endpoints
  app.post("/api/custom-cakes", async (req, res) => {
    try {
      const validatedData = insertCustomCakeInquirySchema.parse(req.body);
      const inquiry = await storage.createCustomCakeInquiry(validatedData);
      res.status(201).json(inquiry);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid inquiry data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create custom cake inquiry" });
      }
    }
  });

  app.get("/api/custom-cakes", async (req, res) => {
    try {
      const inquiries = await storage.getCustomCakeInquiries();
      res.json(inquiries);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch custom cake inquiries" });
    }
  });

  // Contact message endpoints
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactMessageSchema.parse(req.body);
      const message = await storage.createContactMessage(validatedData);
      res.status(201).json(message);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid contact data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to send contact message" });
      }
    }
  });

  app.get("/api/contact", async (req, res) => {
    try {
      const messages = await storage.getContactMessages();
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch contact messages" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
