import { pgTable, text, serial, integer, boolean, timestamp, json, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Table des types de plats
export const dishTypes = pgTable("dish_types", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name_fr: text("name_fr").notNull(),
  name_en: text("name_en").notNull(),
  name_ar: text("name_ar").notNull(),
  order: integer("order").notNull().default(0),
  created_at: timestamp("created_at").defaultNow(),
});

// Table des plats
export const dishes = pgTable("dishes", {
  id: serial("id").primaryKey(),
  type_id: integer("type_id").references(() => dishTypes.id).notNull(),
  name_fr: text("name_fr").notNull(),
  name_en: text("name_en").notNull(),
  name_ar: text("name_ar").notNull(),
  description_fr: text("description_fr").notNull(),
  description_en: text("description_en").notNull(),
  description_ar: text("description_ar").notNull(),
  price: integer("price").notNull(), // Prix en dirhams
  img_url: text("img_url"),
  is_active: boolean("is_active").default(true),
  allergens: json("allergens").$type<string[]>(),
  view_count: integer("view_count").default(0),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Table des réservations (mise à jour)
export const reservations = pgTable("reservations", {
  id: serial("id").primaryKey(),
  full_name: text("full_name").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  date: text("date").notNull(),
  time: text("time").notNull(),
  persons: integer("persons").notNull(),
  notes: text("notes"),
  status: text("status").default("pending"), // pending, confirmed, cancelled, waitlist
  created_at: timestamp("created_at").defaultNow(),
});

// Table des commandes personnalisées (mise à jour)
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  full_name: text("full_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  type_event: text("type_event").notNull(),
  persons: integer("persons").notNull(),
  date_needed: text("date_needed").notNull(),
  budget: text("budget"),
  description: text("description").notNull(),
  img_refs: json("img_refs").$type<string[]>(),
  status: text("status").default("new"), // new, in_progress, completed, cancelled
  created_at: timestamp("created_at").defaultNow(),
});

// Table des messages de contact (mise à jour)
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  full_name: text("full_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  is_read: boolean("is_read").default(false),
  created_at: timestamp("created_at").defaultNow(),
});

// Table des paramètres
export const settings = pgTable("settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Table des utilisateurs (pour l'authentification)
export const users = pgTable("users", {
  id: uuid("id").primaryKey(),
  email: text("email").notNull().unique(),
  role: text("role").default("viewer"), // admin, manager, viewer
  created_at: timestamp("created_at").defaultNow(),
});

// Schémas d'insertion
export const insertDishTypeSchema = createInsertSchema(dishTypes).omit({
  id: true,
  created_at: true,
});

export const insertDishSchema = createInsertSchema(dishes).omit({
  id: true,
  view_count: true,
  created_at: true,
  updated_at: true,
});

export const insertReservationSchema = createInsertSchema(reservations).omit({
  id: true,
  status: true,
  created_at: true,
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  status: true,
  created_at: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  is_read: true,
  created_at: true,
});

export const insertSettingSchema = createInsertSchema(settings).omit({
  created_at: true,
  updated_at: true,
});

// Types TypeScript
export type DishType = typeof dishTypes.$inferSelect;
export type InsertDishType = z.infer<typeof insertDishTypeSchema>;
export type Dish = typeof dishes.$inferSelect;
export type InsertDish = z.infer<typeof insertDishSchema>;
export type Reservation = typeof reservations.$inferSelect;
export type InsertReservation = z.infer<typeof insertReservationSchema>;
export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Setting = typeof settings.$inferSelect;
export type InsertSetting = z.infer<typeof insertSettingSchema>;
export type User = typeof users.$inferSelect; 