import type { Express } from "express";
import { SupabaseService } from "./services/supabase-service";
import { createExpressClient } from "./lib/supabase";
import { z } from "zod";

const supabaseService = new SupabaseService();
const supabase = createExpressClient();

// Middleware d'authentification
const authenticateUser = async (req: any, res: any, next: any) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: "Token d'authentification requis" });
    }

    const token = authHeader.substring(7);
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return res.status(401).json({ message: "Token invalide" });
    }

    // Récupérer le rôle de l'utilisateur
    const userData = await supabaseService.getUserById(user.id);
    if (!userData) {
      return res.status(401).json({ message: "Utilisateur non trouvé" });
    }

    req.user = { ...user, role: userData.role };
    next();
  } catch (error) {
    res.status(401).json({ message: "Erreur d'authentification" });
  }
};

// Middleware de vérification des rôles
const requireRole = (allowedRoles: string[]) => {
  return (req: any, res: any, next: any) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Accès non autorisé" });
    }
    next();
  };
};

// Schémas de validation
const dishTypeSchema = z.object({
  slug: z.string().min(1),
  name_fr: z.string().min(1),
  name_en: z.string().min(1),
  name_ar: z.string().min(1),
  order: z.number().int().min(0)
});

const dishSchema = z.object({
  type_id: z.number().int().positive(),
  name_fr: z.string().min(1),
  name_en: z.string().min(1),
  name_ar: z.string().min(1),
  description_fr: z.string().min(1),
  description_en: z.string().min(1),
  description_ar: z.string().min(1),
  price: z.number().int().positive(),
  img_url: z.string().optional(),
  is_active: z.boolean(),
  allergens: z.array(z.string()).optional()
});

export function registerAdminRoutes(app: Express) {
  // ===== ROUTES D'AUTHENTIFICATION =====
  app.post("/api/admin/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        return res.status(400).json({ message: error.message });
      }

      // Récupérer le rôle de l'utilisateur
      const userData = await supabaseService.getUserById(data.user.id);
      
      res.json({
        user: { ...data.user, role: userData?.role || 'viewer' },
        session: data.session
      });
    } catch (error) {
      res.status(500).json({ message: "Erreur de connexion" });
    }
  });

  app.post("/api/admin/auth/logout", async (req, res) => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      res.json({ message: "Déconnexion réussie" });
    } catch (error) {
      res.status(500).json({ message: "Erreur de déconnexion" });
    }
  });

  // ===== ROUTES PROTÉGÉES =====
  
  // Dashboard
  app.get("/api/admin/dashboard", authenticateUser, async (req, res) => {
    try {
      const stats = await supabaseService.getDashboardStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la récupération des statistiques" });
    }
  });

  // ===== GESTION DES TYPES DE PLATS =====
  app.get("/api/admin/dish-types", authenticateUser, async (req, res) => {
    try {
      const dishTypes = await supabaseService.getDishTypes();
      res.json(dishTypes);
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la récupération des types de plats" });
    }
  });

  app.post("/api/admin/dish-types", authenticateUser, requireRole(['admin', 'manager']), async (req, res) => {
    try {
      const validatedData = dishTypeSchema.parse(req.body);
      const dishType = await supabaseService.createDishType(validatedData);
      res.status(201).json(dishType);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Données invalides", errors: error.errors });
      } else {
        res.status(500).json({ message: "Erreur lors de la création du type de plat" });
      }
    }
  });

  app.put("/api/admin/dish-types/:id", authenticateUser, requireRole(['admin', 'manager']), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = dishTypeSchema.parse(req.body);
      const dishType = await supabaseService.updateDishType(id, validatedData);
      res.json(dishType);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Données invalides", errors: error.errors });
      } else {
        res.status(500).json({ message: "Erreur lors de la mise à jour du type de plat" });
      }
    }
  });

  app.delete("/api/admin/dish-types/:id", authenticateUser, requireRole(['admin']), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await supabaseService.deleteDishType(id);
      res.json({ message: "Type de plat supprimé" });
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la suppression du type de plat" });
    }
  });

  app.post("/api/admin/dish-types/reorder", authenticateUser, requireRole(['admin', 'manager']), async (req, res) => {
    try {
      const { orders } = req.body;
      await supabaseService.reorderDishTypes(orders);
      res.json({ message: "Ordre mis à jour" });
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la réorganisation" });
    }
  });

  // ===== GESTION DES PLATS =====
  app.get("/api/admin/dishes", authenticateUser, async (req, res) => {
    try {
      const typeId = req.query.type_id ? parseInt(req.query.type_id as string) : undefined;
      const dishes = await supabaseService.getDishes(typeId);
      res.json(dishes);
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la récupération des plats" });
    }
  });

  app.post("/api/admin/dishes", authenticateUser, requireRole(['admin', 'manager']), async (req, res) => {
    try {
      const validatedData = dishSchema.parse(req.body);
      const dish = await supabaseService.createDish(validatedData);
      res.status(201).json(dish);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Données invalides", errors: error.errors });
      } else {
        res.status(500).json({ message: "Erreur lors de la création du plat" });
      }
    }
  });

  app.put("/api/admin/dishes/:id", authenticateUser, requireRole(['admin', 'manager']), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = dishSchema.parse(req.body);
      const dish = await supabaseService.updateDish(id, validatedData);
      res.json(dish);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Données invalides", errors: error.errors });
      } else {
        res.status(500).json({ message: "Erreur lors de la mise à jour du plat" });
      }
    }
  });

  app.delete("/api/admin/dishes/:id", authenticateUser, requireRole(['admin']), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await supabaseService.deleteDish(id);
      res.json({ message: "Plat supprimé" });
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la suppression du plat" });
    }
  });

  // ===== GESTION DES RÉSERVATIONS =====
  app.get("/api/admin/reservations", authenticateUser, async (req, res) => {
    try {
      const reservations = await supabaseService.getReservations();
      res.json(reservations);
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la récupération des réservations" });
    }
  });

  app.put("/api/admin/reservations/:id/status", authenticateUser, requireRole(['admin', 'manager']), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      const reservation = await supabaseService.updateReservationStatus(id, status);
      res.json(reservation);
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la mise à jour du statut" });
    }
  });

  // ===== GESTION DES COMMANDES =====
  app.get("/api/admin/orders", authenticateUser, async (req, res) => {
    try {
      const orders = await supabaseService.getOrders();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la récupération des commandes" });
    }
  });

  app.put("/api/admin/orders/:id/status", authenticateUser, requireRole(['admin', 'manager']), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      const order = await supabaseService.updateOrderStatus(id, status);
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la mise à jour du statut" });
    }
  });

  // ===== GESTION DES MESSAGES =====
  app.get("/api/admin/messages", authenticateUser, async (req, res) => {
    try {
      const messages = await supabaseService.getMessages();
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la récupération des messages" });
    }
  });

  app.put("/api/admin/messages/:id/read", authenticateUser, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const message = await supabaseService.markMessageAsRead(id);
      res.json(message);
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la mise à jour du message" });
    }
  });

  // ===== GESTION DES PARAMÈTRES =====
  app.get("/api/admin/settings", authenticateUser, async (req, res) => {
    try {
      const settings = await supabaseService.getSettings();
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la récupération des paramètres" });
    }
  });

  app.put("/api/admin/settings/:key", authenticateUser, requireRole(['admin']), async (req, res) => {
    try {
      const { key } = req.params;
      const { value } = req.body;
      const setting = await supabaseService.setSetting(key, value);
      res.json(setting);
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la mise à jour du paramètre" });
    }
  });
} 