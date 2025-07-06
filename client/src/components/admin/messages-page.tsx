import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Mail, Phone, Clock, Check } from 'lucide-react';
import { createClient, Message } from '@/lib/supabase';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  // States pour CRUD
  const [openModal, setOpenModal] = useState(false);
  const [editMessage, setEditMessage] = useState<Message | null>(null);
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    is_read: false,
  });
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const supabase = createClient();

  const fetchMessages = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false });
    setMessages(data as Message[] ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchMessages(); }, []);

  // Handlers
  const handleOpenModal = (m?: Message) => {
    setEditMessage(m || null);
    setForm(m ? {
      full_name: m.full_name,
      email: m.email,
      phone: m.phone || '',
      subject: m.subject,
      message: m.message,
      is_read: m.is_read,
    } : {
      full_name: '', email: '', phone: '', subject: '', message: '', is_read: false,
    });
    setOpenModal(true);
  };
  const handleSave = async () => {
    if (editMessage) {
      await supabase.from('messages').update(form).eq('id', editMessage.id);
    } else {
      await supabase.from('messages').insert(form);
    }
    setOpenModal(false);
    setEditMessage(null);
    fetchMessages();
  };
  const handleDelete = async () => {
    if (deleteId) {
      await supabase.from('messages').delete().eq('id', deleteId);
      setDeleteId(null);
      fetchMessages();
    }
  };
  const handleRead = async (id: number, is_read: boolean) => {
    await supabase.from('messages').update({ is_read }).eq('id', id);
    fetchMessages();
  };
  const handleMarkAllRead = async () => {
    await supabase.from('messages').update({ is_read: true }).neq('is_read', true);
    fetchMessages();
  };

  // Statistiques dynamiques
  const unread = messages.filter(m => !m.is_read).length;
  const read = messages.filter(m => m.is_read).length;
  const total = messages.length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Messages de Contact</h1>
          <p className="text-gray-600">Gérer les demandes et questions des clients</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleMarkAllRead}>Marquer tout comme lu</Button>
          <Button variant="outline" onClick={() => handleOpenModal()}>Ajouter</Button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Mail className="h-5 w-5 text-blue-500" />
              <div>
                <div className="text-2xl font-bold">{unread}</div>
                <div className="text-sm text-gray-500">Non lus</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Check className="h-5 w-5 text-green-500" />
              <div>
                <div className="text-2xl font-bold">{read}</div>
                <div className="text-sm text-gray-500">Lus</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-orange-500" />
              <div>
                <div className="text-2xl font-bold">{total}</div>
                <div className="text-sm text-gray-500">Total</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des messages */}
      <Card>
        <CardHeader>
          <CardTitle>Messages Récents</CardTitle>
          <CardDescription>
            Répondre aux demandes des clients
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center text-gray-500">Chargement...</div>
          ) : (
            <div className="space-y-4">
              {messages.length === 0 && (
                <div className="text-center text-gray-500">Aucun message trouvé.</div>
              )}
              {messages.map((m) => (
                <div key={m.id} className={`flex items-start justify-between p-4 border rounded-lg ${!m.is_read ? 'bg-blue-50' : ''}`}>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div>
                        <div className="font-medium">{m.subject}</div>
                        <div className="text-sm text-gray-500">{m.email}</div>
                      </div>
                      {!m.is_read && <Badge variant="secondary">Non lu</Badge>}
                      {m.is_read && <Badge variant="default" className="bg-green-600">Lu</Badge>}
                    </div>
                    <div className="mt-2 text-sm text-gray-600">
                      <span className="font-medium">Sujet:</span> {m.subject}
                    </div>
                    <div className="mt-1 text-sm text-gray-500">
                      <Phone className="inline mr-1 h-3 w-3" />
                      {m.phone} • 
                      <Clock className="inline ml-2 mr-1 h-3 w-3" />
                      {new Date(m.created_at).toLocaleString()}
                    </div>
                    <div className="mt-3 text-sm text-gray-700 bg-white p-3 rounded border">
                      <span className="font-medium">Message:</span><br />
                      {m.message}
                    </div>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    {!m.is_read && (
                      <Button size="sm" className="bg-teal hover:bg-teal-600" onClick={() => handleRead(m.id, true)}>
                        <Check className="mr-1 h-4 w-4" />
                        Marquer lu
                      </Button>
                    )}
                    {m.is_read && (
                      <Button size="sm" variant="outline" onClick={() => handleRead(m.id, false)}>
                        Marquer non lu
                      </Button>
                    )}
                    <Button size="sm" variant="outline" onClick={() => handleOpenModal(m)}>
                      Modifier
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-600" onClick={() => setDeleteId(m.id)}>
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
            <DialogTitle>{editMessage ? 'Modifier le message' : 'Ajouter un message'}</DialogTitle>
            <DialogDescription>
              {editMessage ? 'Modifiez le message.' : 'Ajoutez un nouveau message.'}
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
              <Label>Sujet</Label>
              <Input value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} />
            </div>
            <div>
              <Label>Message</Label>
              <Input value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} />
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" checked={form.is_read} onChange={e => setForm(f => ({ ...f, is_read: e.target.checked }))} id="is_read" />
              <Label htmlFor="is_read">Lu</Label>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSave}>{editMessage ? 'Enregistrer' : 'Ajouter'}</Button>
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
            <DialogTitle>Supprimer le message ?</DialogTitle>
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