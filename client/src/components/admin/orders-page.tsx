import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Package, Clock, CheckCircle, XCircle, Download } from 'lucide-react';
import { createClient } from '@/lib/supabase';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // States pour CRUD
  const [openModal, setOpenModal] = useState(false);
  const [editOrder, setEditOrder] = useState<any | null>(null);
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    type_event: '',
    persons: 1,
    date_needed: '',
    budget: '',
    description: '',
    status: 'new',
  });
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // Nouveau state pour le modal de détails
  const [detailOrder, setDetailOrder] = useState<any | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  // State pour le filtre
  const [filter, setFilter] = useState<'all' | 'home' | 'restaurant'>('all');

  const supabase = createClient();

  const fetchOrders = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('customer_orders')
      .select('*')
      .order('created_at', { ascending: false });
    setOrders(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchOrders(); }, []);

  // Filtrage des commandes selon le filtre sélectionné
  const filteredOrders = orders.filter(o =>
    filter === 'all' ? true : o.delivery_type === filter
  );

  // Handlers
  const handleOpenModal = (o?: any) => {
    setEditOrder(o || null);
    setForm(o ? {
      full_name: o.full_name,
      email: o.email,
      phone: o.phone,
      type_event: o.type_event,
      persons: o.persons,
      date_needed: o.date_needed,
      budget: o.budget || '',
      description: o.description,
      status: o.status,
    } : {
      full_name: '', email: '', phone: '', type_event: '', persons: 1, date_needed: '', budget: '', description: '', status: 'new',
    });
    setOpenModal(true);
  };
  const handleSave = async () => {
    if (editOrder) {
      await supabase.from('orders').update(form).eq('id', editOrder.id);
    } else {
      await supabase.from('orders').insert(form);
    }
    setOpenModal(false);
    setEditOrder(null);
    fetchOrders();
  };
  const handleDelete = async () => {
    if (deleteId) {
      await supabase.from('orders').delete().eq('id', deleteId);
      setDeleteId(null);
      fetchOrders();
    }
  };
  const handleStatus = async (id: number, status: string) => {
    await supabase.from('orders').update({ status }).eq('id', id);
    fetchOrders();
  };

  // Handler pour ouvrir le modal de détails
  const handleOpenDetail = (order: any) => {
    setDetailOrder(order);
    setDetailOpen(true);
  };
  // Handler pour changer le statut
  const handleChangeStatus = async (id: number, status: string) => {
    await supabase.from('customer_orders').update({ status }).eq('id', id);
    setDetailOpen(false);
    fetchOrders();
  };

  // Statistiques dynamiques
  const totalCount = orders.length;
  const totalAmount = orders.reduce((sum, o) => sum + (o.total_price || 0), 0);

  // Helper pour badge de statut coloré
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Commandes Clients</h1>
          <p className="text-gray-600">Toutes les commandes passées par les clients via le panier</p>
        </div>
        <div className="flex space-x-2">
          <Button variant={filter === 'all' ? 'default' : 'outline'} onClick={() => setFilter('all')}>Toutes</Button>
          <Button variant={filter === 'home' ? 'default' : 'outline'} onClick={() => setFilter('home')}>À domicile</Button>
          <Button variant={filter === 'restaurant' ? 'default' : 'outline'} onClick={() => setFilter('restaurant')}>À table</Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exporter CSV
          </Button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Package className="h-5 w-5 text-teal" />
              <div>
                <div className="text-2xl font-bold">{totalCount}</div>
                <div className="text-sm text-gray-500">Commandes</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <div className="text-2xl font-bold">{totalAmount} DH</div>
                <div className="text-sm text-gray-500">Montant total</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des commandes */}
      <Card>
        <CardHeader>
          <CardTitle>Commandes Récentes</CardTitle>
          <CardDescription>
            Gérer les commandes passées par les clients
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center text-gray-500">Chargement...</div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.length === 0 && (
                <div className="text-center text-gray-500">Aucune commande trouvée.</div>
              )}
              {filteredOrders.map((o) => (
                <div key={o.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg gap-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-1">
                      <div className="font-medium text-lg text-teal-700">{o.full_name}</div>
                      {getStatusBadge(o.status || 'En attente')}
                      {o.delivery_type === 'home' && (
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold">Domicile</span>
                      )}
                      {o.delivery_type === 'restaurant' && (
                        <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-semibold">Table {o.table_number || '-'}</span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500 mb-1">{o.email} • {o.phone}</div>
                    <div className="text-sm text-gray-500 mb-1">
                      {/* Adresse ou numéro de table selon le type de commande */}
                      {o.delivery_type === 'home' && (
                        <div className="text-sm text-gray-500 mb-1">Adresse : {o.address}</div>
                      )}
                      {o.delivery_type === 'restaurant' && (
                        <div className="text-sm text-gray-500 mb-1">Table : <span className="text-teal-700 font-semibold">{o.table_number || '-'}</span></div>
                      )}
                    </div>
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

      {/* Modal Ajout/Modification */}
      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editOrder ? 'Modifier la commande' : 'Ajouter une commande'}</DialogTitle>
            <DialogDescription>
              {editOrder ? 'Modifiez les informations de la commande.' : 'Ajoutez une nouvelle commande.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Nom complet</Label>
              <Input value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))} />
            </div>
            <div>
              <Label>Email</Label>
              <Input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            </div>
            <div>
              <Label>Téléphone</Label>
              <Input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
            </div>
            <div>
              <Label>Type d'événement</Label>
              <Input value={form.type_event} onChange={e => setForm(f => ({ ...f, type_event: e.target.value }))} />
            </div>
            <div className="flex space-x-2">
              <div className="flex-1">
                <Label>Date</Label>
                <Input type="date" value={form.date_needed} onChange={e => setForm(f => ({ ...f, date_needed: e.target.value }))} />
              </div>
              <div className="flex-1">
                <Label>Personnes</Label>
                <Input type="number" min={1} value={form.persons} onChange={e => setForm(f => ({ ...f, persons: Number(e.target.value) }))} />
              </div>
            </div>
            <div>
              <Label>Budget</Label>
              <Input value={form.budget} onChange={e => setForm(f => ({ ...f, budget: e.target.value }))} />
            </div>
            <div>
              <Label>Description</Label>
              <Input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
            </div>
            <div>
              <Label>Statut</Label>
              <select className="w-full border rounded p-2" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                <option value="new">Nouvelle</option>
                <option value="in_progress">En cours</option>
                <option value="completed">Terminée</option>
                <option value="cancelled">Annulée</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSave}>{editOrder ? 'Enregistrer' : 'Ajouter'}</Button>
            <DialogClose asChild>
              <Button variant="outline">Annuler</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation suppression */}
      <Dialog open={!!deleteId} onOpenChange={v => !v && setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer la commande ?</DialogTitle>
            <DialogDescription>Cette action est irréversible.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="destructive" onClick={handleDelete}>Supprimer</Button>
            <DialogClose asChild>
              <Button variant="outline">Annuler</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Détails Commande */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Détails de la commande</DialogTitle>
          </DialogHeader>
          {detailOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="mb-2"><span className="font-semibold">Nom :</span> {detailOrder.full_name}</div>
                  <div className="mb-2"><span className="font-semibold">Email :</span> {detailOrder.email}</div>
                  <div className="mb-2"><span className="font-semibold">Téléphone :</span> {detailOrder.phone}</div>
                  <div className="mb-2"><span className="font-semibold">Adresse :</span> {detailOrder.address}</div>
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