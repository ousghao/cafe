import { useCart } from './CartContext';
import { useState, Dispatch, SetStateAction } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { createClient } from '@/lib/supabase';
import { useCustomToast } from '@/hooks/use-custom-toast';
import Portal from '@/components/ui/Portal';

interface CheckoutModalProps {
  open: boolean;
  onClose: () => void;
  items: { id: number; name: string; price: number; img_url?: string; quantity: number }[];
  total: number;
  deliveryType: 'home' | 'restaurant';
  setDeliveryType: Dispatch<SetStateAction<'home' | 'restaurant'>>;
  form: {
    full_name: string;
    phone: string;
    email: string;
    address: string;
    table_number: string;
    reservation_time: string;
  };
  setForm: Dispatch<SetStateAction<{
    full_name: string;
    phone: string;
    email: string;
    address: string;
    table_number: string;
    reservation_time: string;
  }>>;
  loading: boolean;
  success: boolean;
  error: string;
  confirmOrder: () => void;
  resetForm: () => void;
  showSummary: boolean;
  setShowSummary: Dispatch<SetStateAction<boolean>>;
}

function CheckoutModal({ open, onClose, items, total, deliveryType, setDeliveryType, form, setForm, loading, success, error, confirmOrder, resetForm, showSummary, setShowSummary }: CheckoutModalProps) {
  if (!open) return null;
  return (
    <Portal>
      <div className="fixed inset-0 z-[1300] flex items-center justify-center bg-black/40">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-auto max-h-[90vh] overflow-y-auto relative animate-in zoom-in-95 duration-300">
          <Button variant="ghost" className="absolute top-2 right-2" onClick={resetForm}><X className="h-5 w-5" /></Button>
          {success ? (
            <div className="text-center p-8">
              <h3 className="text-xl font-bold mb-4 text-green-600">Commande envoyée !</h3>
              <p className="mb-4">Merci pour votre commande. Nous vous contacterons rapidement pour la confirmation.</p>
              <Button onClick={resetForm}>Fermer</Button>
            </div>
          ) : showSummary ? (
            <div className="space-y-4 p-8">
              <h3 className="text-xl font-bold mb-4">Récapitulatif de votre commande</h3>
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2">Articles commandés :</h4>
                <div className="space-y-2">
                  {items.map(item => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>{item.name} x{item.quantity}</span>
                      <span>{item.price * item.quantity} DH</span>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-2 mt-2 flex justify-between font-semibold">
                  <span>Total</span>
                  <span>{total} DH</span>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => setShowSummary(false)} className="flex-1">
                  Modifier
                </Button>
                <Button onClick={confirmOrder} className="flex-1 bg-teal hover:bg-teal-600 text-white" disabled={loading}>
                  {loading ? 'Envoi...' : 'Confirmer la commande'}
                </Button>
              </div>
              {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
            </div>
          ) : (
            <form onSubmit={e => { e.preventDefault(); setShowSummary(true); }} className="space-y-4 p-8">
              <h3 className="text-xl font-bold mb-4">Valider la commande</h3>
              <div>
                <label className="block font-medium mb-2">Mode de commande *</label>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input 
                      type="radio" 
                      name="deliveryType" 
                      value="home" 
                      checked={deliveryType === 'home'}
                      onChange={(e) => setDeliveryType(e.target.value as 'home' | 'restaurant')}
                      className="text-teal"
                    />
                    <span>Livraison à domicile</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input 
                      type="radio" 
                      name="deliveryType" 
                      value="restaurant" 
                      checked={deliveryType === 'restaurant'}
                      onChange={(e) => setDeliveryType(e.target.value as 'home' | 'restaurant')}
                      className="text-teal"
                    />
                    <span>Consommation sur place</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block font-medium mb-1">Nom complet *</label>
                <input type="text" required className="w-full border rounded p-2" value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))} />
              </div>
              <div>
                <label className="block font-medium mb-1">Téléphone *</label>
                <input type="tel" required className="w-full border rounded p-2" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
              </div>
              <div>
                <label className="block font-medium mb-1">Email</label>
                <input type="email" className="w-full border rounded p-2" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
              </div>
              {deliveryType === 'home' && (
                <div>
                  <label className="block font-medium mb-1">Adresse de livraison *</label>
                  <input type="text" required className="w-full border rounded p-2" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} />
                </div>
              )}
              {deliveryType === 'restaurant' && (
                <>
                  <div>
                    <label className="block font-medium mb-1">Numéro de table *</label>
                    <input type="text" required className="w-full border rounded p-2" placeholder="ex: Table 5" value={form.table_number} onChange={e => setForm(f => ({ ...f, table_number: e.target.value }))} />
                  </div>
                  <div>
                    <label className="block font-medium mb-1">Heure de réservation *</label>
                    <input type="time" required className="w-full border rounded p-2" value={form.reservation_time} onChange={e => setForm(f => ({ ...f, reservation_time: e.target.value }))} />
                  </div>
                </>
              )}
              <Button type="submit" className="w-full bg-teal hover:bg-teal-600 text-white mt-2">
                Voir le récapitulatif
              </Button>
              {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
            </form>
          )}
        </div>
      </div>
    </Portal>
  );
}

export default function CartSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { items, removeItem, updateQuantity, total, clearCart } = useCart();
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [checkoutItems, setCheckoutItems] = useState<typeof items>([]);
  const [deliveryType, setDeliveryType] = useState<'home' | 'restaurant'>('home');
  const [form, setForm] = useState({ 
    full_name: '', 
    phone: '', 
    email: '', 
    address: '',
    table_number: '',
    reservation_time: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [showSummary, setShowSummary] = useState(false);
  const { success: showSuccess, error: showError } = useCustomToast();

  const handleOrder = () => {
    setCheckoutItems(items);
    setCheckoutModalOpen(true);
    onClose();
  };

  const confirmOrder = async () => {
    setLoading(true);
    setError('');
    try {
      const supabase = createClient();
      const { error } = await supabase.from('customer_orders').insert({
        full_name: form.full_name,
        phone: form.phone,
        email: form.email,
        delivery_type: deliveryType,
        address: deliveryType === 'home' ? form.address : null,
        table_number: deliveryType === 'restaurant' ? form.table_number : null,
        reservation_time: deliveryType === 'restaurant' ? form.reservation_time : null,
        items: checkoutItems.map(i => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity })),
        total_price: checkoutItems.reduce((sum, i) => sum + i.price * i.quantity, 0),
        status: 'pending',
      });
      if (error) {
        console.error('Supabase error:', error);
        throw new Error(error.message || 'Erreur inconnue Supabase');
      }
      setSuccess(true);
      clearCart();
      showSuccess(
        'Commande envoyée !',
        'Merci pour votre commande. Nous vous contacterons rapidement pour la confirmation.'
      );
    } catch (err: any) {
      const errorMessage = err?.message || "Erreur lors de l'envoi de la commande. Veuillez réessayer.";
      setError(errorMessage);
      showError(
        'Erreur de commande',
        errorMessage
      );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCheckoutModalOpen(false);
    setShowSummary(false);
    setSuccess(false);
    setError('');
    setForm({ full_name: '', phone: '', email: '', address: '', table_number: '', reservation_time: '' });
    setDeliveryType('home');
    setCheckoutItems([]);
  };

  return (
    <>
      <Portal>
        <div
          className={`fixed top-0 right-0 h-full w-full sm:w-[420px] md:w-[480px] max-w-md bg-white shadow-xl z-[1200] transform transition-transform duration-300
            ${open ? 'translate-x-0' : 'translate-x-full'}
            ${typeof window !== 'undefined' && window.innerWidth < 640 ? 'rounded-t-3xl' : 'rounded-l-3xl'}
            backdrop-blur-md border-l border-gray-200 flex flex-col`}
          style={{
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
            transition: 'all 0.3s cubic-bezier(.4,0,.2,1)',
          }}
        >
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <h2 className="text-2xl font-bold tracking-tight text-deep-black">Votre Panier</h2>
            <Button variant="ghost" onClick={onClose} className="rounded-full p-2 hover:bg-gray-100">
              <X className="h-6 w-6" />
            </Button>
          </div>
          <div className="flex-1 flex flex-col p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
            {items.length === 0 ? (
              <div className="text-center text-gray-400 mt-16 text-lg">Votre panier est vide.</div>
            ) : (
              <div className="space-y-4">
                {items.map(item => (
                  <div key={item.id} className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <div className="flex items-center space-x-3">
                      <img src={item.img_url} alt={item.name} className="w-14 h-14 object-cover rounded-lg border border-gray-100" />
                      <div>
                        <div className="font-semibold text-gray-900 text-base">{item.name}</div>
                        <div className="text-xs text-gray-500">{item.price} DH</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="number" min={1} value={item.quantity} onChange={e => updateQuantity(item.id, Number(e.target.value))} className="w-14 border rounded-lg p-1 text-center text-base focus:ring-2 focus:ring-teal-200" />
                      <Button size="icon" variant="outline" className="text-red-600 rounded-full hover:bg-red-50" onClick={() => removeItem(item.id)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-8 border-t border-gray-100 pt-6">
              <div className="flex justify-between items-center font-bold text-xl mb-4">
                <span>Total</span>
                <span className="text-teal">{total} DH</span>
              </div>
              <div className="flex flex-col gap-3 mt-2">
                <Button
                  className="w-full bg-teal hover:bg-teal-600 text-white text-lg py-3 rounded-2xl shadow-md transition-all"
                  disabled={items.length === 0}
                  onClick={handleOrder}
                >
                  Commander
                </Button>
                <Button
                  variant="outline"
                  className="w-full rounded-2xl text-base border-gray-200 hover:bg-gray-50"
                  onClick={clearCart}
                  disabled={items.length === 0}
                >
                  Vider
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Portal>
      <CheckoutModal
        open={checkoutModalOpen}
        onClose={resetForm}
        items={checkoutItems}
        total={checkoutItems.reduce((sum, i) => sum + i.price * i.quantity, 0)}
        deliveryType={deliveryType}
        setDeliveryType={setDeliveryType}
        form={form}
        setForm={setForm}
        loading={loading}
        success={success}
        error={error}
        confirmOrder={confirmOrder}
        resetForm={resetForm}
        showSummary={showSummary}
        setShowSummary={setShowSummary}
      />
    </>
  );
} 