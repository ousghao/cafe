import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { createClient, DishType, Dish } from '@/lib/supabase';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function MenuPage() {
  const [dishTypes, setDishTypes] = useState<DishType[]>([]);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);

  // States pour CRUD
  const [openTypeModal, setOpenTypeModal] = useState(false);
  const [editType, setEditType] = useState<DishType | null>(null);
  const [typeName, setTypeName] = useState('');
  const [typeSlug, setTypeSlug] = useState('');
  const [typeNameEn, setTypeNameEn] = useState('');
  const [typeNameAr, setTypeNameAr] = useState('');

  const [openDishModal, setOpenDishModal] = useState(false);
  const [editDish, setEditDish] = useState<Dish | null>(null);
  const [dishName, setDishName] = useState('');
  const [dishNameEn, setDishNameEn] = useState('');
  const [dishNameAr, setDishNameAr] = useState('');
  const [dishDescFr, setDishDescFr] = useState('');
  const [dishDescEn, setDishDescEn] = useState('');
  const [dishDescAr, setDishDescAr] = useState('');
  const [dishPrice, setDishPrice] = useState('');
  const [dishTypeId, setDishTypeId] = useState<number | ''>('');
  const [dishActive, setDishActive] = useState(true);
  const [dishImgUrl, setDishImgUrl] = useState('');

  const [deleteTypeId, setDeleteTypeId] = useState<number | null>(null);
  const [deleteDishId, setDeleteDishId] = useState<number | null>(null);

  const supabase = createClient();

  const fetchMenu = async () => {
    setLoading(true);
    const { data: types } = await supabase
      .from('dish_types')
      .select('*')
      .order('order', { ascending: true });
    const { data: dishesData } = await supabase
      .from('dishes')
      .select('*')
      .order('created_at', { ascending: false });
    setDishTypes(types as DishType[] ?? []);
    setDishes(dishesData as Dish[] ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchMenu(); }, []);

  // Handlers Types de plats
  const handleOpenTypeModal = (type?: DishType) => {
    setEditType(type || null);
    setTypeName(type?.name_fr || '');
    setTypeSlug(type?.slug || '');
    setTypeNameEn(type?.name_en || '');
    setTypeNameAr(type?.name_ar || '');
    setOpenTypeModal(true);
  };
  const handleSaveType = async () => {
    if (!typeName || !typeNameEn || !typeNameAr || !typeSlug) {
      alert('Tous les champs sont obligatoires pour le type de plat.');
      return;
    }
    let error = null;
    if (editType) {
      const { error: err } = await supabase.from('dish_types').update({ name_fr: typeName, name_en: typeNameEn, name_ar: typeNameAr, slug: typeSlug }).eq('id', editType.id);
      error = err;
    } else {
      const { error: err } = await supabase.from('dish_types').insert({ name_fr: typeName, name_en: typeNameEn, name_ar: typeNameAr, slug: typeSlug });
      error = err;
    }
    if (error) {
      alert('Erreur lors de l\'ajout du type : ' + error.message);
      return;
    }
    setOpenTypeModal(false);
    setEditType(null);
    setTypeName('');
    setTypeSlug('');
    setTypeNameEn('');
    setTypeNameAr('');
    fetchMenu();
  };
  const handleDeleteType = async () => {
    if (deleteTypeId) {
      await supabase.from('dish_types').delete().eq('id', deleteTypeId);
      setDeleteTypeId(null);
      fetchMenu();
    }
  };

  // Handlers Plats
  const handleOpenDishModal = (dish?: Dish) => {
    setEditDish(dish || null);
    setDishName(dish?.name_fr || '');
    setDishNameEn(dish?.name_en || '');
    setDishNameAr(dish?.name_ar || '');
    setDishDescFr(dish?.description_fr || '');
    setDishDescEn(dish?.description_en || '');
    setDishDescAr(dish?.description_ar || '');
    setDishPrice(dish?.price?.toString() || '');
    setDishTypeId(dish?.type_id || (dishTypes[0]?.id ?? ''));
    setDishActive(dish?.is_active ?? true);
    setDishImgUrl(dish?.img_url || '');
    setOpenDishModal(true);
  };
  const handleSaveDish = async () => {
    if (!dishName || !dishNameEn || !dishNameAr || !dishDescFr || !dishDescEn || !dishDescAr || !dishPrice || !dishTypeId) {
      alert('Tous les champs sont obligatoires pour le plat.');
      return;
    }
    const payload = {
      name_fr: dishName,
      name_en: dishNameEn,
      name_ar: dishNameAr,
      description_fr: dishDescFr,
      description_en: dishDescEn,
      description_ar: dishDescAr,
      price: Number(dishPrice),
      type_id: dishTypeId,
      is_active: dishActive,
      img_url: dishImgUrl,
    };
    let error = null;
    if (editDish) {
      const { error: err } = await supabase.from('dishes').update(payload).eq('id', editDish.id);
      error = err;
    } else {
      const { error: err } = await supabase.from('dishes').insert(payload);
      error = err;
    }
    if (error) {
      alert('Erreur lors de l\'ajout du plat : ' + error.message);
      return;
    }
    setOpenDishModal(false);
    setEditDish(null);
    setDishName('');
    setDishNameEn('');
    setDishNameAr('');
    setDishDescFr('');
    setDishDescEn('');
    setDishDescAr('');
    setDishPrice('');
    setDishTypeId('');
    setDishActive(true);
    setDishImgUrl('');
    fetchMenu();
  };
  const handleDeleteDish = async () => {
    if (deleteDishId) {
      await supabase.from('dishes').delete().eq('id', deleteDishId);
      setDeleteDishId(null);
      fetchMenu();
    }
  };

  // Statistiques dynamiques
  const activeDishes = dishes.filter(d => d.is_active).length;
  const typesCount = dishTypes.length;
  const totalViews = dishes.reduce((sum, d) => sum + (d.view_count || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion du Menu</h1>
          <p className="text-gray-600">Gérer les types de plats et les plats</p>
        </div>
        <div className="flex space-x-2">
          <Button className="bg-teal hover:bg-teal-600" onClick={() => handleOpenDishModal()}>
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un Plat
          </Button>
          <Button variant="outline" onClick={() => handleOpenTypeModal()}>
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un Type
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Types de plats */}
        <Card>
          <CardHeader>
            <CardTitle>Types de Plats</CardTitle>
            <CardDescription>
              Catégories du menu (drag & drop pour réorganiser)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center text-gray-500">Chargement...</div>
            ) : (
              <div className="space-y-2">
                {dishTypes.length === 0 && (
                  <div className="text-center text-gray-500">Aucun type de plat trouvé.</div>
                )}
                {dishTypes.map((type) => (
                  <div key={type.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span>{type.name_fr}</span>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => handleOpenTypeModal(type)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600" onClick={() => setDeleteTypeId(type.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Plats */}
        <Card>
          <CardHeader>
            <CardTitle>Plats</CardTitle>
            <CardDescription>
              Liste des plats disponibles
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center text-gray-500">Chargement...</div>
            ) : (
              <div className="space-y-2">
                {dishes.length === 0 && (
                  <div className="text-center text-gray-500">Aucun plat trouvé.</div>
                )}
                {dishes.map((dish) => (
                  <div key={dish.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium">{dish.name_fr}</div>
                      <div className="text-sm text-gray-500">{dish.price} MAD</div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm">
                        {dish.is_active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleOpenDishModal(dish)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600" onClick={() => setDeleteDishId(dish.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Statistiques du Menu</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-teal">{activeDishes}</div>
              <div className="text-sm text-gray-500">Plats Actifs</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-500">{typesCount}</div>
              <div className="text-sm text-gray-500">Types de Plats</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-500">{totalViews}</div>
              <div className="text-sm text-gray-500">Vues Total</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modal Type de plat */}
      <Dialog open={openTypeModal} onOpenChange={setOpenTypeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editType ? 'Modifier le type de plat' : 'Ajouter un type de plat'}</DialogTitle>
            <DialogDescription>
              {editType ? 'Modifiez les informations du type de plat.' : 'Ajoutez un nouveau type de plat.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Nom (français)</Label>
              <Input value={typeName} onChange={e => setTypeName(e.target.value)} />
            </div>
            <div>
              <Label>Slug</Label>
              <Input value={typeSlug} onChange={e => setTypeSlug(e.target.value)} />
            </div>
            <div>
              <Label>Nom (anglais)</Label>
              <Input value={typeNameEn} onChange={e => setTypeNameEn(e.target.value)} />
            </div>
            <div>
              <Label>Nom (arabe)</Label>
              <Input value={typeNameAr} onChange={e => setTypeNameAr(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSaveType}>{editType ? 'Enregistrer' : 'Ajouter'}</Button>
            <DialogClose asChild>
              <Button variant="outline">Annuler</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation suppression type */}
      <Dialog open={!!deleteTypeId} onOpenChange={v => !v && setDeleteTypeId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer le type de plat ?</DialogTitle>
            <DialogDescription>Cette action est irréversible.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="destructive" onClick={handleDeleteType}>Supprimer</Button>
            <DialogClose asChild>
              <Button variant="outline">Annuler</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Plat */}
      <Dialog open={openDishModal} onOpenChange={setOpenDishModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editDish ? 'Modifier le plat' : 'Ajouter un plat'}</DialogTitle>
            <DialogDescription>
              {editDish ? 'Modifiez les informations du plat.' : 'Ajoutez un nouveau plat.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Nom (français)</Label>
              <Input value={dishName} onChange={e => setDishName(e.target.value)} />
            </div>
            <div>
              <Label>Nom (anglais)</Label>
              <Input value={dishNameEn} onChange={e => setDishNameEn(e.target.value)} />
            </div>
            <div>
              <Label>Nom (arabe)</Label>
              <Input value={dishNameAr} onChange={e => setDishNameAr(e.target.value)} />
            </div>
            <div>
              <Label>Description (français)</Label>
              <Input value={dishDescFr} onChange={e => setDishDescFr(e.target.value)} />
            </div>
            <div>
              <Label>Description (anglais)</Label>
              <Input value={dishDescEn} onChange={e => setDishDescEn(e.target.value)} />
            </div>
            <div>
              <Label>Description (arabe)</Label>
              <Input value={dishDescAr} onChange={e => setDishDescAr(e.target.value)} />
            </div>
            <div>
              <Label>Prix (MAD)</Label>
              <Input type="number" value={dishPrice} onChange={e => setDishPrice(e.target.value)} />
            </div>
            <div>
              <Label>Type de plat</Label>
              <select className="w-full border rounded p-2" value={dishTypeId} onChange={e => setDishTypeId(Number(e.target.value))}>
                {dishTypes.map(type => (
                  <option key={type.id} value={type.id}>{type.name_fr}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" checked={dishActive} onChange={e => setDishActive(e.target.checked)} id="active" />
              <Label htmlFor="active">Actif</Label>
            </div>
            <div>
              <Label>URL de la photo</Label>
              <Input value={dishImgUrl} onChange={e => setDishImgUrl(e.target.value)} placeholder="https://..." />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSaveDish}>{editDish ? 'Enregistrer' : 'Ajouter'}</Button>
            <DialogClose asChild>
              <Button variant="outline">Annuler</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation suppression plat */}
      <Dialog open={!!deleteDishId} onOpenChange={v => !v && setDeleteDishId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer le plat ?</DialogTitle>
            <DialogDescription>Cette action est irréversible.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="destructive" onClick={handleDeleteDish}>Supprimer</Button>
            <DialogClose asChild>
              <Button variant="outline">Annuler</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 