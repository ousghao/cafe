import { createBrowserClient } from '@supabase/ssr'

export const createClient = () => {
  return createBrowserClient(
    import.meta.env.VITE_SUPABASE_URL!,
    import.meta.env.VITE_SUPABASE_ANON_KEY!
  )
}

// Types pour les rôles utilisateur
export type UserRole = 'admin' | 'manager' | 'viewer'

export interface User {
  id: string
  email: string
  role: UserRole
  created_at: string
}

// Types pour les données de l'application
export interface DishType {
  id: number
  slug: string
  name_fr: string
  name_en: string
  name_ar: string
  order: number
  created_at: string
}

export interface Dish {
  id: number
  type_id: number
  name_fr: string
  name_en: string
  name_ar: string
  description_fr: string
  description_en: string
  description_ar: string
  price: number
  img_url?: string
  is_active: boolean
  allergens?: string[]
  view_count: number
  created_at: string
  updated_at: string
}

export interface Reservation {
  id: number
  full_name: string
  phone: string
  email?: string
  date: string
  time: string
  persons: number
  notes?: string
  status: 'pending' | 'confirmed' | 'cancelled' | 'waitlist'
  created_at: string
}

export interface Order {
  id: number
  full_name: string
  email: string
  phone: string
  type_event: string
  persons: number
  date_needed: string
  budget?: string
  description: string
  img_refs?: string[]
  status: 'new' | 'in_progress' | 'completed' | 'cancelled'
  created_at: string
}

export interface Message {
  id: number
  full_name: string
  email: string
  phone?: string
  subject: string
  message: string
  is_read: boolean
  created_at: string
}

export interface Setting {
  key: string
  value: string
  created_at: string
  updated_at: string
} 