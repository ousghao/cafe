import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Calendar, 
  Package, 
  MessageSquare, 
  TrendingUp,
  Users,
  Clock
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { createClient } from '@/lib/supabase';

interface DashboardStats {
  todayReservations: number;
  weekReservations: number;
  totalReservations: number;
  pendingOrders: number;
  unreadMessages: number;
  topDishes: Array<{ name_fr: string; view_count: number }>;
  topOrderedDishes: Array<{ name: string; count: number }>;
}

interface DashboardPageProps {
  onPageChange: (page: string) => void;
}

export default function DashboardPage({ onPageChange }: DashboardPageProps) {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      const supabase = createClient();
      const today = new Date();
      const todayStr = today.toISOString().slice(0, 10);
      const weekAgo = new Date();
      weekAgo.setDate(today.getDate() - 7);
      const weekAgoStr = weekAgo.toISOString().slice(0, 10);

      try {
        // Réservations aujourd'hui (date au format texte)
        const todayRes = await supabase
          .from('reservations')
          .select('*', { count: 'exact', head: true })
          .eq('date', todayStr);
        console.log('todayReservations:', todayRes);
        if (todayRes.error) throw todayRes.error;
        // Réservations cette semaine
        const weekRes = await supabase
          .from('reservations')
          .select('*', { count: 'exact', head: true })
          .gte('date', weekAgoStr)
          .lte('date', todayStr);
        console.log('weekReservations:', weekRes);
        if (weekRes.error) throw weekRes.error;
        // Total de réservations (toutes dates)
        const totalRes = await supabase
          .from('reservations')
          .select('*', { count: 'exact', head: true });
        console.log('totalReservations:', totalRes);
        if (totalRes.error) throw totalRes.error;
        // Commandes en attente (status = 'pending')
        const pendingOrdersRes = await supabase
          .from('customer_orders')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'pending');
        console.log('pendingOrders:', pendingOrdersRes);
        if (pendingOrdersRes.error) throw pendingOrdersRes.error;
        // Messages non lus
        const unreadMessagesRes = await supabase
          .from('messages')
          .select('*', { count: 'exact', head: true })
          .eq('is_read', false);
        console.log('unreadMessages:', unreadMessagesRes);
        if (unreadMessagesRes.error) throw unreadMessagesRes.error;
        // Top 5 plats les plus consultés
        const topDishesRes = await supabase
          .from('dishes')
          .select('name_fr,view_count')
          .order('view_count', { ascending: false })
          .limit(5);
        console.log('topDishes:', topDishesRes);
        if (topDishesRes.error) throw topDishesRes.error;
        // Top 5 plats les plus commandés
        const allOrdersRes = await supabase
          .from('customer_orders')
          .select('items');
        console.log('allOrders (for most ordered dishes):', allOrdersRes);
        if (allOrdersRes.error) throw allOrdersRes.error;
        // Compter les plats les plus commandés
        const dishCount: Record<string, { name: string; count: number }> = {};
        if (Array.isArray(allOrdersRes.data)) {
          allOrdersRes.data.forEach((order: any) => {
            if (Array.isArray(order.items)) {
              order.items.forEach((item: any) => {
                if (item && item.name) {
                  if (!dishCount[item.name]) {
                    dishCount[item.name] = { name: item.name, count: 0 };
                  }
                  dishCount[item.name].count += item.quantity ? Number(item.quantity) : 1;
                }
              });
            }
          });
        }
        const topOrderedDishes = Object.values(dishCount)
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);
        setStats({
          todayReservations: todayRes.count || 0,
          weekReservations: weekRes.count || 0,
          totalReservations: totalRes.count || 0,
          pendingOrders: pendingOrdersRes.count || 0,
          unreadMessages: unreadMessagesRes.count || 0,
          topDishes: topDishesRes.data as any[] || [],
          topOrderedDishes,
        });
      } catch (err: any) {
        setError(err.message || 'Erreur lors de la récupération des statistiques.');
        setStats(null);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 font-semibold mt-8">
        Erreur : {error}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center text-gray-500">
        Impossible de charger les statistiques
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
        <p className="text-gray-600">Vue d'ensemble de l'activité du restaurant</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Réservations Aujourd'hui</CardTitle>
            <Calendar className="h-4 w-4 text-teal" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayReservations}</div>
            <p className="text-xs text-muted-foreground">
              {stats.weekReservations} cette semaine
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Commandes en Attente</CardTitle>
            <Package className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingOrders}</div>
            <p className="text-xs text-muted-foreground">
              Nécessitent une attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages Non Lus</CardTitle>
            <MessageSquare className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.unreadMessages}</div>
            <p className="text-xs text-muted-foreground">
              Requièrent une réponse
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Plats Populaires</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.topDishes.length > 0 ? stats.topDishes[0]?.view_count || 0 : 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Vues du plat le plus consulté
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Widget debug : total réservations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Réservations (debug)</CardTitle>
            <Calendar className="h-4 w-4 text-teal" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalReservations}</div>
            <p className="text-xs text-muted-foreground">
              Toutes dates confondues
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Graphique des plats populaires */}
      {stats.topDishes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Top 5 des Plats les Plus Consultés</CardTitle>
            <CardDescription>
              Nombre de vues par plat
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.topDishes}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name_fr" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  fontSize={12}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="view_count" fill="#2A9CA3" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Graphique des plats les plus commandés */}
      {stats.topOrderedDishes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Top 5 des Plats les Plus Commandés</CardTitle>
            <CardDescription>
              Nombre de commandes par plat
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.topOrderedDishes}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  fontSize={12}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#FFB300" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Actions rapides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => onPageChange('reservations')}
        >
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5 text-teal" />
              Gérer les Réservations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Voir et gérer toutes les réservations
            </p>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => onPageChange('orders')}
        >
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="mr-2 h-5 w-5 text-orange-500" />
              Traiter les Commandes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Gérer les commandes personnalisées
            </p>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => onPageChange('messages')}
        >
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="mr-2 h-5 w-5 text-blue-500" />
              Messages Récents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Répondre aux messages clients
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 