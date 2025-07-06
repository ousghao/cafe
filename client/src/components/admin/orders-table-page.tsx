import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { createClient } from '@/lib/supabase';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function OrdersTablePage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [detailOrder, setDetailOrder] = useState<any | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const supabase = createClient();

  const getStatusBadge = (status: string) => {
    let color = 'bg-gray-300 text-gray-800';
    let label = status;
    switch (status) {
      case 'pending':
      case 'en attente':
        color = 'bg-yellow-400 text-yellow-900'; label = 'En attente'; break;
      case 'delivered':
      case 'livree':
        color = 'bg-green-500 text-white'; label = 'Livrée'; break;
      case 'cancelled':
      case 'annulée':
        color = 'bg-red-500 text-white'; label = 'Annulée'; break;
      case 'new':
        color = 'bg-blue-500 text-white'; label = 'Nouvelle'; break;
      default:
        color = 'bg-gray-300 text-gray-800'; label = status;
    }
    return <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${color}`}>{label}</span>;
  };

  const fetchOrders = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('customer_orders')
      .select('*')
      .eq('delivery_type', 'table')
      .order('created_at', { ascending: false });
    setOrders(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleOpenDetail = (order: any) => {
    setDetailOrder(order);
    setDetailOpen(true);
  };
  const handleChangeStatus = async (id: number, status: string) => {
    await supabase.from('customer_orders').update({ status }).eq('id', id);
    setDetailOpen(false);
    fetchOrders();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Commandes à Table</h1>
          <p className="text-gray-600">Commandes passées pour service à table (avec numéro de table)</p>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Commandes Récentes (à Table)</CardTitle>
          <CardDescription>
            Gérer les commandes à table
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center text-gray-500">Chargement...</div>
          ) : (
            <div className="space-y-4">
              {orders.length === 0 && (
                <div className="text-center text-gray-500">Aucune commande trouvée.</div>
              )}
              {orders.map((o) => (
                <div key={o.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg gap-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-1">
                      <div className="font-medium text-lg text-teal-700">{o.full_name}</div>
                      {getStatusBadge(o.status || 'En attente')}
                    </div>
                    <div className="text-sm text-gray-500 mb-1">{o.email} • {o.phone}</div>
                    <div className="text-sm text-gray-500 mb-1">Numéro de table : <span className="font-semibold text-teal-700">{o.table_number || '-'}</span></div>
                    <div className="text-sm text-gray-700 mb-1">
                      <span className="font-medium">Articles :</span>
                      <ul className="list-disc ml-6 mt-1">
                        {Array.isArray(o.items) ? o.items.map((item: any, idx: number) => (
                          <li key={idx} className="flex justify-between">
                            <span>{item.name} x{item.quantity}</span>
                            <span className="text-teal-700 font-semibold">{item.price} DH</span>
                          </li>
                        )) : null}
                      </ul>
                    </div>
                    <div className="text-sm text-gray-700 mt-2">
                      <span className="font-semibold">Total :</span> <span className="text-lg text-teal-700 font-bold">{o.total_price} DH</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 min-w-[120px] mt-2 md:mt-0">
                    <Button size="sm" variant="outline" className="w-full" onClick={() => handleOpenDetail(o)}>Voir détails</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      {/* Modal Détails Commande */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Détails de la commande à table</DialogTitle>
          </DialogHeader>
          {detailOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="mb-2"><span className="font-semibold">Nom :</span> {detailOrder.full_name}</div>
                  <div className="mb-2"><span className="font-semibold">Email :</span> {detailOrder.email}</div>
                  <div className="mb-2"><span className="font-semibold">Téléphone :</span> {detailOrder.phone}</div>
                  <div className="mb-2"><span className="font-semibold">Numéro de table :</span> <span className="font-bold text-teal-700">{detailOrder.table_number || '-'}</span></div>
                </div>
                <div className="flex flex-col items-start gap-2">
                  <div><span className="font-semibold">Statut :</span> {getStatusBadge(detailOrder.status)}</div>
                  <div><span className="font-semibold">Total :</span> <span className="text-lg text-teal-700 font-bold">{detailOrder.total_price} DH</span></div>
                </div>
              </div>
              <div>
                <span className="font-semibold">Articles :</span>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  {Array.isArray(detailOrder.items) ? detailOrder.items.map((item: any, idx: number) => (
                    <li key={idx} className="flex justify-between items-center">
                      <span>{item.name} x{item.quantity}</span>
                      <span className="text-teal-700 font-semibold">{item.price} DH</span>
                    </li>
                  )) : null}
                </ul>
              </div>
              <div className="flex gap-3 mt-6 justify-end">
                <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white px-4" onClick={() => handleChangeStatus(detailOrder.id, 'delivered')}>Livrer</Button>
                <Button size="sm" className="bg-yellow-500 hover:bg-yellow-600 text-white px-4" onClick={() => handleChangeStatus(detailOrder.id, 'pending')}>En attente</Button>
                <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white px-4" onClick={() => handleChangeStatus(detailOrder.id, 'cancelled')}>Annuler</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 