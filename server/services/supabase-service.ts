import { createExpressClient } from '../lib/supabase';
import { 
  DishType, InsertDishType, Dish, InsertDish,
  Reservation, InsertReservation, Order, InsertOrder,
  Message, InsertMessage, Setting, InsertSetting, User
} from '@shared/supabase-schema';

export class SupabaseService {
  private supabase;

  constructor() {
    this.supabase = createExpressClient();
  }

  // ===== GESTION DES TYPES DE PLATS =====
  async getDishTypes(): Promise<DishType[]> {
    const { data, error } = await this.supabase
      .from('dish_types')
      .select('*')
      .order('order', { ascending: true });
    
    if (error) throw error;
    return data || [];
  }

  async createDishType(dishType: InsertDishType): Promise<DishType> {
    const { data, error } = await this.supabase
      .from('dish_types')
      .insert(dishType)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateDishType(id: number, updates: Partial<InsertDishType>): Promise<DishType> {
    const { data, error } = await this.supabase
      .from('dish_types')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async deleteDishType(id: number): Promise<void> {
    const { error } = await this.supabase
      .from('dish_types')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  async reorderDishTypes(orders: { id: number; order: number }[]): Promise<void> {
    const { error } = await this.supabase.rpc('reorder_dish_types', { orders });
    if (error) throw error;
  }

  // ===== GESTION DES PLATS =====
  async getDishes(typeId?: number): Promise<Dish[]> {
    let query = this.supabase
      .from('dishes')
      .select(`
        *,
        dish_types (
          id,
          slug,
          name_fr,
          name_en,
          name_ar
        )
      `)
      .order('created_at', { ascending: false });

    if (typeId) {
      query = query.eq('type_id', typeId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  async createDish(dish: InsertDish): Promise<Dish> {
    const { data, error } = await this.supabase
      .from('dishes')
      .insert(dish)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateDish(id: number, updates: Partial<InsertDish>): Promise<Dish> {
    const { data, error } = await this.supabase
      .from('dishes')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async deleteDish(id: number): Promise<void> {
    const { error } = await this.supabase
      .from('dishes')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  async incrementViewCount(id: number): Promise<void> {
    // Récupérer d'abord le plat actuel
    const { data: dish, error: fetchError } = await this.supabase
      .from('dishes')
      .select('view_count')
      .eq('id', id)
      .single();
    
    if (fetchError) throw fetchError;
    
    // Mettre à jour avec le nouveau compteur
    const { error: updateError } = await this.supabase
      .from('dishes')
      .update({ view_count: (dish?.view_count || 0) + 1 })
      .eq('id', id);
    
    if (updateError) throw updateError;
  }

  // ===== GESTION DES RÉSERVATIONS =====
  async getReservations(): Promise<Reservation[]> {
    const { data, error } = await this.supabase
      .from('reservations')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  async createReservation(reservation: InsertReservation): Promise<Reservation> {
    const { data, error } = await this.supabase
      .from('reservations')
      .insert(reservation)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateReservationStatus(id: number, status: string): Promise<Reservation> {
    const { data, error } = await this.supabase
      .from('reservations')
      .update({ status })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async checkReservationAvailability(date: string, time: string): Promise<{ available: boolean; currentCount: number; maxCapacity: number }> {
    // Récupérer la capacité maximale
    const { data: setting } = await this.supabase
      .from('settings')
      .select('value')
      .eq('key', 'max_capacity')
      .single();
    
    const maxCapacity = setting ? parseInt(setting.value) : 50;
    
    // Compter les réservations existantes
    const { data: reservations, error } = await this.supabase
      .from('reservations')
      .select('persons')
      .eq('date', date)
      .eq('time', time)
      .eq('status', 'confirmed');
    
    if (error) throw error;
    
    const currentCount = reservations?.reduce((sum, r) => sum + r.persons, 0) || 0;
    const available = currentCount < maxCapacity;
    
    return { available, currentCount, maxCapacity };
  }

  // ===== GESTION DES COMMANDES =====
  async getOrders(): Promise<Order[]> {
    const { data, error } = await this.supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const { data, error } = await this.supabase
      .from('orders')
      .insert(order)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateOrderStatus(id: number, status: string): Promise<Order> {
    const { data, error } = await this.supabase
      .from('orders')
      .update({ status })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // ===== GESTION DES MESSAGES =====
  async getMessages(): Promise<Message[]> {
    const { data, error } = await this.supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const { data, error } = await this.supabase
      .from('messages')
      .insert(message)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async markMessageAsRead(id: number): Promise<Message> {
    const { data, error } = await this.supabase
      .from('messages')
      .update({ is_read: true })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // ===== GESTION DES PARAMÈTRES =====
  async getSettings(): Promise<Setting[]> {
    const { data, error } = await this.supabase
      .from('settings')
      .select('*');
    
    if (error) throw error;
    return data || [];
  }

  async getSetting(key: string): Promise<string | null> {
    const { data, error } = await this.supabase
      .from('settings')
      .select('value')
      .eq('key', key)
      .single();
    
    if (error) throw error;
    return data?.value || null;
  }

  async setSetting(key: string, value: string): Promise<Setting> {
    const { data, error } = await this.supabase
      .from('settings')
      .upsert({ key, value, updated_at: new Date().toISOString() })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // ===== GESTION DES UTILISATEURS =====
  async getUserById(id: string): Promise<User | null> {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    
    if (error) throw error;
    return data;
  }

  async createUser(user: { id: string; email: string; role?: string }): Promise<User> {
    const { data, error } = await this.supabase
      .from('users')
      .insert(user)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // ===== STATISTIQUES =====
  async getDashboardStats() {
    const today = new Date().toISOString().split('T')[0];
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    // Réservations aujourd'hui
    const { data: todayReservations } = await this.supabase
      .from('reservations')
      .select('*')
      .gte('date', today);

    // Réservations cette semaine
    const { data: weekReservations } = await this.supabase
      .from('reservations')
      .select('*')
      .gte('date', weekAgo);

    // Commandes en attente
    const { data: pendingOrders } = await this.supabase
      .from('orders')
      .select('*')
      .eq('status', 'new');

    // Messages non lus
    const { data: unreadMessages } = await this.supabase
      .from('messages')
      .select('*')
      .eq('is_read', false);

    // Top 5 plats les plus consultés
    const { data: topDishes } = await this.supabase
      .from('dishes')
      .select('name_fr, view_count')
      .order('view_count', { ascending: false })
      .limit(5);

    return {
      todayReservations: todayReservations?.length || 0,
      weekReservations: weekReservations?.length || 0,
      pendingOrders: pendingOrders?.length || 0,
      unreadMessages: unreadMessages?.length || 0,
      topDishes: topDishes || []
    };
  }
} 