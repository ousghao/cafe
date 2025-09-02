import type { Express } from "express";
import { createServer, type Server } from "http";
import { SupabaseService } from "./services/supabase-service";
import { insertReservationSchema, insertCustomCakeInquirySchema, insertContactMessageSchema } from "@shared/schema";
import { z } from "zod";
import { testDatabaseConnection } from "./database-check";
import 'dotenv/config';

const supabaseService = new SupabaseService();

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint
  app.get("/api/health", async (req, res) => {
    try {
      const dbConnected = await testDatabaseConnection();
      res.json({
        status: "ok",
        timestamp: new Date().toISOString(),
        database: dbConnected ? "connected" : "disconnected",
        environment: process.env.NODE_ENV || "unknown"
      });
    } catch (error) {
      res.status(500).json({
        status: "error", 
        database: "error",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Debug endpoint to check users table
  app.get("/api/debug/users", async (req, res) => {
    try {
      const { data: users, error } = await supabaseService['supabase']
        .from('users')
        .select('id, email, role, created_at')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      res.json({ users });
    } catch (error) {
      res.status(500).json({
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Menu endpoints
  app.get("/api/menu", async (req, res) => {
    try {
      const { category } = req.query;
      let dishes: any[] = [];
      
      if (category && typeof category === 'string') {
        // Récupérer d'abord le type de plat par slug
        const dishTypes = await supabaseService.getDishTypes();
        const dishType = dishTypes.find(dt => dt.slug === category);
        if (dishType) {
          dishes = await supabaseService.getDishes(dishType.id);
        }
      } else {
        dishes = await supabaseService.getDishes();
      }
      
      res.json(dishes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch menu items" });
    }
  });

  // Vérification de disponibilité des réservations
  app.post("/api/reservations/check", async (req, res) => {
    try {
      const { date, time } = req.body;
      const availability = await supabaseService.checkReservationAvailability(date, time);
      res.json(availability);
    } catch (error) {
      res.status(500).json({ message: "Failed to check availability" });
    }
  });

  // Reservation endpoints
  app.post("/api/reservations", async (req, res) => {
    try {
      const validatedData = insertReservationSchema.parse(req.body);
      
      // Vérifier la disponibilité
      const availability = await supabaseService.checkReservationAvailability(
        validatedData.date, 
        validatedData.time
      );
      
      // Adapter les données pour le nouveau schéma Supabase
      const supabaseReservation = {
        full_name: validatedData.name,
        phone: validatedData.phone,
        email: validatedData.email,
        date: validatedData.date,
        time: validatedData.time,
        persons: validatedData.guests,
        notes: validatedData.notes,
        status: availability.available ? 'pending' : 'waitlist'
      };
      
      const reservation = await supabaseService.createReservation(supabaseReservation);
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
      const reservations = await supabaseService.getReservations();
      res.json(reservations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reservations" });
    }
  });

  // Custom cake inquiry endpoints
  app.post("/api/custom-cakes", async (req, res) => {
    try {
      const validatedData = insertCustomCakeInquirySchema.parse(req.body);
      
      // Adapter les données pour le nouveau schéma Supabase
      const supabaseOrder = {
        full_name: validatedData.name,
        email: validatedData.email || '',
        phone: validatedData.phone,
        type_event: validatedData.eventType,
        persons: validatedData.guestCount,
        date_needed: validatedData.eventDate,
        budget: validatedData.budget,
        description: validatedData.description,
        img_refs: validatedData.inspirationPhotos
      };
      
      const inquiry = await supabaseService.createOrder(supabaseOrder);
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
      const inquiries = await supabaseService.getOrders();
      res.json(inquiries);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch custom cake inquiries" });
    }
  });

  // Contact message endpoints
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactMessageSchema.parse(req.body);
      
      // Adapter les données pour le nouveau schéma Supabase
      const supabaseMessage = {
        full_name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone,
        subject: validatedData.subject,
        message: validatedData.message
      };
      
      const message = await supabaseService.createMessage(supabaseMessage);
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
      const messages = await supabaseService.getMessages();
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch contact messages" });
    }
  });

  // Importer et enregistrer les routes d'administration
  const { registerAdminRoutes } = await import('./admin-routes');
  registerAdminRoutes(app);

  const httpServer = createServer(app);
  return httpServer;
}
