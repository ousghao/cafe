import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X, Clock, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { createClient, Reservation } from '@/lib/supabase';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  // States pour CRUD
  const [openModal, setOpenModal] = useState(false);
  const [editReservation, setEditReservation] = useState<Reservation | null>(null);
  const [form, setForm] = useState({
    full_name: '',
    phone: '',
    email: '',
    date: '',
    time: '',
    persons: 1,
    notes: '',
    status: 'pending',
  });
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const supabase = createClient();

  const fetchReservations = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('reservations')
      .select('*')
      .order('created_at', { ascending: false });
    setReservations(data as Reservation[] ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchReservations(); }, []);

  // Handlers
  const handleOpenModal = (r?: Reservation) => {
    setEditReservation(r || null);
    setForm(r ? {
      full_name: r.full_name,
      phone: r.phone,
      email: r.email || '',
      date: r.date,
      time: r.time,
      persons: r.persons,
      notes: r.notes || '',
      status: r.status,
    } : {
      full_name: '', phone: '', email: '', date: '', time: '', persons: 1, notes: '', status: 'pending',
    });
    setOpenModal(true);
  };
  const handleSave = async () => {
    if (editReservation) {
      await supabase.from('reservations').update(form).eq('id', editReservation.id);
    } else {
      await supabase.from('reservations').insert(form);
    }
    setOpenModal(false);
    setEditReservation(null);
    fetchReservations();
  };
  const handleDelete = async () => {
    if (deleteId) {
      await supabase.from('reservations').delete().eq('id', deleteId);
      setDeleteId(null);
      fetchReservations();
    }
  };
  const handleStatus = async (id: number, status: string) => {
    await supabase.from('reservations').update({ status }).eq('id', id);
    fetchReservations();
  };

  // Statistiques dynamiques
  const pending = reservations.filter(r => r.status === 'pending').length;
  const confirmed = reservations.filter(r => r.status === 'confirmed').length;
  const cancelled = reservations.filter(r => r.status === 'cancelled').length;
  const totalPeople = reservations.reduce((sum, r) => sum + (r.persons || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Réservations</h1>
          <p className="text-gray-600">Gérer les réservations de tables</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => handleOpenModal()}>Ajouter</Button>
          <Button variant="outline">Filtrer</Button>
          <Button variant="outline">Exporter</Button>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-orange-500" />
              <div>
                <div className="text-2xl font-bold">{pending}</div>
                <div className="text-sm text-gray-500">En attente</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Check className="h-5 w-5 text-green-500" />
              <div>
                <div className="text-2xl font-bold">{confirmed}</div>
                <div className="text-sm text-gray-500">Confirmées</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <X className="h-5 w-5 text-red-500" />
              <div>
                <div className="text-2xl font-bold">{cancelled}</div>
                <div className="text-sm text-gray-500">Annulées</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-500" />
              <div>
                <div className="text-2xl font-bold">{totalPeople}</div>
                <div className="text-sm text-gray-500">Personnes</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des réservations */}
      <Card>
        <CardHeader>
          <CardTitle>Réservations Récentes</CardTitle>
          <CardDescription>
            Gérer et traiter les demandes de réservation
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center text-gray-500">Chargement...</div>
          ) : (
            <div className="space-y-4">
              {reservations.length === 0 && (
                <div className="text-center text-gray-500">Aucune réservation trouvée.</div>
              )}
              {reservations.map((r) => (
                <div key={r.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div>
                        <div className="font-medium">{r.full_name}</div>
                        <div className="text-sm text-gray-500">{r.email}</div>
                      </div>
                      {r.status === 'pending' && <Badge variant="secondary">En attente</Badge>}
                      {r.status === 'confirmed' && <Badge variant="default" className="bg-green-600">Confirmée</Badge>}
                      {r.status === 'cancelled' && <Badge variant="destructive">Annulée</Badge>}
                      {r.status === 'waitlist' && <Badge variant="outline" className="text-orange-600 border-orange-600">Liste d'attente</Badge>}
                    </div>
                    <div className="mt-2 text-sm text-gray-600">
                      <span className="font-medium">Date:</span> {r.date} •
                      <span className="font-medium ml-2">Heure:</span> {r.time} •
                      <span className="font-medium ml-2">Personnes:</span> {r.persons}
                    </div>
                    <div className="mt-1 text-sm text-gray-500">
                      Téléphone: {r.phone}
                    </div>
                    {r.notes && (
                      <div className="mt-1 text-sm text-orange-600">Note: {r.notes}</div>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleStatus(r.id, 'confirmed')} disabled={r.status === 'confirmed'}>
                      <Check className="mr-1 h-4 w-4" />
                      Confirmer
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-600" onClick={() => handleStatus(r.id, 'cancelled')} disabled={r.status === 'cancelled'}>
                      <X className="mr-1 h-4 w-4" />
                      Refuser
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleOpenModal(r)}>
                      Modifier
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-600" onClick={() => setDeleteId(r.id)}>
                      Supprimer
                    </Button>
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
            <DialogTitle>{editReservation ? 'Modifier la réservation' : 'Ajouter une réservation'}</DialogTitle>
            <DialogDescription>
              {editReservation ? 'Modifiez les informations de la réservation.' : 'Ajoutez une nouvelle réservation.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Nom complet</Label>
              <Input value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))} />
            </div>
            <div>
              <Label>Téléphone</Label>
              <Input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
            </div>
            <div>
              <Label>Email</Label>
              <Input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            </div>
            <div className="flex space-x-2">
              <div className="flex-1">
                <Label>Date</Label>
                <Input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
              </div>
              <div className="flex-1">
                <Label>Heure</Label>
                <Input type="time" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} />
              </div>
              <div className="flex-1">
                <Label>Personnes</Label>
                <Input type="number" min={1} value={form.persons} onChange={e => setForm(f => ({ ...f, persons: Number(e.target.value) }))} />
              </div>
            </div>
            <div>
              <Label>Notes</Label>
              <Input value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
            </div>
            <div>
              <Label>Statut</Label>
              <select className="w-full border rounded p-2" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                <option value="pending">En attente</option>
                <option value="confirmed">Confirmée</option>
                <option value="cancelled">Annulée</option>
                <option value="waitlist">Liste d'attente</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSave}>{editReservation ? 'Enregistrer' : 'Ajouter'}</Button>
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
            <DialogTitle>Supprimer la réservation ?</DialogTitle>
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
    </div>
  );
} 