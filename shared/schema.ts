import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const menuItems = pgTable("menu_items", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  nameEn: text("name_en").notNull(),
  nameAr: text("name_ar").notNull(),
  description: text("description").notNull(),
  descriptionEn: text("description_en").notNull(),
  descriptionAr: text("description_ar").notNull(),
  price: integer("price").notNull(), // Price in dirhams
  category: text("category").notNull(),
  imageUrl: text("image_url"),
  available: boolean("available").default(true),
  allergens: json("allergens").$type<string[]>(),
});

export const reservations = pgTable("reservations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  date: text("date").notNull(),
  time: text("time").notNull(),
  guests: integer("guests").notNull(),
  preference: text("preference"),
  notes: text("notes"),
  status: text("status").default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const customCakeInquiries = pgTable("custom_cake_inquiries", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  eventType: text("event_type").notNull(),
  eventDate: text("event_date").notNull(),
  guestCount: integer("guest_count").notNull(),
  budget: text("budget"),
  description: text("description").notNull(),
  inspirationPhotos: json("inspiration_photos").$type<string[]>(),
  status: text("status").default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  status: text("status").default("unread"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertMenuItemSchema = createInsertSchema(menuItems).omit({
  id: true,
});

export const insertReservationSchema = createInsertSchema(reservations).omit({
  id: true,
  status: true,
  createdAt: true,
});

export const insertCustomCakeInquirySchema = createInsertSchema(customCakeInquiries).omit({
  id: true,
  status: true,
  createdAt: true,
});

export const insertContactMessageSchema = createInsertSchema(contactMessages).omit({
  id: true,
  status: true,
  createdAt: true,
});

// Types
export type MenuItem = typeof menuItems.$inferSelect;
export type InsertMenuItem = z.infer<typeof insertMenuItemSchema>;
export type Reservation = typeof reservations.$inferSelect;
export type InsertReservation = z.infer<typeof insertReservationSchema>;
export type CustomCakeInquiry = typeof customCakeInquiries.$inferSelect;
export type InsertCustomCakeInquiry = z.infer<typeof insertCustomCakeInquirySchema>;
export type ContactMessage = typeof contactMessages.$inferSelect;
export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;
