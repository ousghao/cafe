import { useEffect, useState } from "react";
import { createClient, Dish, DishType } from '@/lib/supabase';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/hooks/use-language";
import { Download, X, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useCart } from './CartContext';

const categories = [
  { id: "all", labelKey: "menu.categories.all" },
  { id: "breakfast", labelKey: "menu.categories.breakfast" },
  { id: "drinks", labelKey: "menu.categories.drinks" },
  { id: "juices", labelKey: "menu.categories.juices" },
  { id: "viennoiserie", labelKey: "menu.categories.viennoiserie" },
  { id: "savory", labelKey: "menu.categories.savory" },
  { id: "desserts", labelKey: "menu.categories.desserts" },
];

export default function MenuSection() {
  const [activeCategory, setActiveCategory] = useState("all");
  const { language, t } = useLanguage();
  const [dishTypes, setDishTypes] = useState<DishType[]>([]);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);
  const [topDishes, setTopDishes] = useState<Dish[]>([]);
  const [selectedItem, setSelectedItem] = useState<Dish | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [downloading, setDownloading] = useState(false);
  const { addItem } = useCart();

  useEffect(() => {
    const fetchMenu = async () => {
      setLoading(true);
      const supabase = createClient();
      const { data: types } = await supabase.from('dish_types').select('*').order('order', { ascending: true });
      const { data: dishesData } = await supabase.from('dishes').select('*').eq('is_active', true).order('created_at', { ascending: false });
      const { data: top } = await supabase.from('dishes').select('*').order('view_count', { ascending: false }).limit(5);
      setDishTypes(types as DishType[] ?? []);
      setDishes(dishesData as Dish[] ?? []);
      setTopDishes(top as Dish[] ?? []);
      setLoading(false);
    };
    fetchMenu();
  }, []);

  const filteredItems = dishes.filter(item => 
    activeCategory === "all" || dishTypes.find(type => type.id === item.type_id)?.slug === activeCategory
  );

  const getItemName = (item: Dish) => {
    switch (language) {
      case 'ar': return item.name_ar;
      case 'en': return item.name_en;
      default: return item.name_fr;
    }
  };

  const getItemDescription = (item: Dish) => {
    switch (language) {
      case 'ar': return item.description_ar;
      case 'en': return item.description_en;
      default: return item.description_fr;
    }
  };

  const getItemImages = (item: Dish) => {
    const images = [];
    if (item.img_url) images.push(item.img_url);
    // Si on a d'autres images dans la base de données, on peut les ajouter ici
    // Par exemple: if (item.img_url_2) images.push(item.img_url_2);
    return images;
  };

  const openItemModal = (item: Dish) => {
    setSelectedItem(item);
    setCurrentImageIndex(0);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedItem(null);
    setCurrentImageIndex(0);
  };

  const handleAddToCart = (item: Dish) => {
    addItem({ 
      id: item.id, 
      name: getItemName(item), 
      price: item.price, 
      img_url: item.img_url 
    });
    closeModal();
  };

  const nextImage = (images: string[]) => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (images: string[]) => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const downloadMenuPDF = async () => {
    setDownloading(true);
    try {
      // Créer le contenu HTML du menu
      const menuContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Menu - Assouan Fès</title>
          <style>
            body {
              font-family: 'Arial', sans-serif;
              margin: 0;
              padding: 20px;
              background: #f8f9fa;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              padding: 20px;
              background: linear-gradient(135deg, #0f766e, #14b8a6);
              color: white;
              border-radius: 10px;
            }
            .header h1 {
              margin: 0;
              font-size: 2.5em;
              font-weight: bold;
            }
            .header p {
              margin: 10px 0 0 0;
              font-size: 1.2em;
              opacity: 0.9;
            }
            .category {
              margin-bottom: 30px;
              background: white;
              border-radius: 10px;
              overflow: hidden;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .category-title {
              background: #0f766e;
              color: white;
              padding: 15px 20px;
              font-size: 1.5em;
              font-weight: bold;
              margin: 0;
            }
            .dish {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              padding: 15px 20px;
              border-bottom: 1px solid #e5e7eb;
            }
            .dish:last-child {
              border-bottom: none;
            }
            .dish-info {
              flex: 1;
            }
            .dish-name {
              font-size: 1.2em;
              font-weight: bold;
              color: #1f2937;
              margin-bottom: 5px;
            }
            .dish-description {
              color: #6b7280;
              font-size: 0.9em;
              line-height: 1.4;
              margin-bottom: 8px;
            }
            .dish-allergens {
              display: flex;
              flex-wrap: wrap;
              gap: 5px;
            }
            .allergen {
              background: #fef2f2;
              color: #dc2626;
              padding: 2px 8px;
              border-radius: 12px;
              font-size: 0.7em;
              font-weight: bold;
            }
            .dish-price {
              font-size: 1.3em;
              font-weight: bold;
              color: #0f766e;
              margin-left: 20px;
              white-space: nowrap;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              padding: 20px;
              background: #1f2937;
              color: white;
              border-radius: 10px;
            }
            .footer h3 {
              margin: 0 0 10px 0;
              color: #14b8a6;
            }
            .footer p {
              margin: 5px 0;
              font-size: 0.9em;
            }
            @media print {
              body { background: white; }
              .header, .category, .footer { box-shadow: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🍽️ Assouan Fès</h1>
            <p>Découvrez notre cuisine authentique et raffinée</p>
          </div>
          
          ${dishTypes.map(type => {
            const typeDishes = dishes.filter(dish => dish.type_id === type.id);
            if (typeDishes.length === 0) return '';
            
            return `
              <div class="category">
                <h2 class="category-title">${type.name_fr}</h2>
                ${typeDishes.map(dish => `
                  <div class="dish">
                    <div class="dish-info">
                      <div class="dish-name">${getItemName(dish)}</div>
                      <div class="dish-description">${getItemDescription(dish)}</div>
                      ${dish.allergens && dish.allergens.length > 0 ? `
                        <div class="dish-allergens">
                          ${dish.allergens.map(allergen => `
                            <span class="allergen">${allergen}</span>
                          `).join('')}
                        </div>
                      ` : ''}
                    </div>
                    <div class="dish-price">${dish.price} DH</div>
                  </div>
                `).join('')}
              </div>
            `;
          }).join('')}
          
          <div class="footer">
            <h3>📞 Contactez-nous</h3>
            <p>📍 123 Rue Hassan II, Fès, Maroc</p>
            <p>📱 +212 5 35 XX XX XX</p>
            <p>✉️ contact@assouanfes.com</p>
            <p>🌐 www.assouanfes.com</p>
          </div>
        </body>
        </html>
      `;

      // Créer un blob avec le contenu HTML
      const blob = new Blob([menuContent], { type: 'text/html' });
      
      // Créer un lien de téléchargement
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `menu-assouan-fes-${new Date().toISOString().split('T')[0]}.html`;
      
      // Déclencher le téléchargement
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Nettoyer l'URL
      window.URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
      alert('Erreur lors du téléchargement du menu. Veuillez réessayer.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <section id="menu" className="py-16 lg:py-24 bg-gray-50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-serif font-bold text-deep-black mb-4">
            {t('menu.title')} <span className="text-teal">{t('menu.titleHighlight')}</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('menu.description')}
          </p>
        </div>
        
        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <Button
            key="all"
            variant={activeCategory === "all" ? "default" : "outline"}
            className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${activeCategory === "all" ? 'bg-teal text-white hover:bg-teal' : 'bg-white hover:bg-teal hover:text-white text-gray-700'}`}
            onClick={() => setActiveCategory("all")}
          >
            {t('menu.categories.all')}
          </Button>
          {dishTypes.map((type) => (
            <Button
              key={type.slug}
              variant={activeCategory === type.slug ? "default" : "outline"}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${activeCategory === type.slug ? 'bg-teal text-white hover:bg-teal' : 'bg-white hover:bg-teal hover:text-white text-gray-700'}`}
              onClick={() => setActiveCategory(type.slug)}
            >
              {type.name_fr}
            </Button>
          ))}
        </div>
        
        {/* Menu Items Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <div className="w-full h-48 bg-gray-200 animate-pulse" />
                <CardContent className="p-6">
                  <div className="h-6 bg-gray-200 rounded mb-2 animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded mb-4 animate-pulse" />
                  <div className="flex justify-between items-center">
                    <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
                    <div className="h-10 w-24 bg-gray-200 rounded animate-pulse" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item) => (
              <Card 
                key={item.id} 
                className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
                onClick={() => openItemModal(item)}
              >
                <img 
                  src={item.img_url || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400'} 
                  alt={getItemName(item)}
                  className="w-full h-48 object-cover"
                />
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-deep-black mb-2">
                    {getItemName(item)}
                  </h3>
                  <p className="text-gray-600 mb-4 text-sm line-clamp-2">
                    {getItemDescription(item)}
                  </p>
                  {item.allergens && item.allergens.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {item.allergens.map((allergen) => (
                        <Badge key={allergen} variant="secondary" className="text-xs">
                          {allergen}
                        </Badge>
                      ))}
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-teal">
                      {item.price} DH
                    </span>
                    <Button
                      className="bg-teal hover:bg-teal text-white px-4 py-2 rounded-full font-medium transition-colors duration-300"
                      onClick={(e) => {
                        e.stopPropagation();
                        addItem({ id: item.id, name: getItemName(item), price: item.price, img_url: item.img_url });
                      }}
                    >
                      {t('menu.order')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        
        {/* Plats populaires */}
        {topDishes.length > 0 && (
          <div className="mt-16">
            <h3 className="text-2xl font-bold mb-4 text-center text-teal">{t('Our Popular Dishes')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {topDishes.map((dish) => (
                <Card 
                  key={dish.id} 
                  className="overflow-hidden border-2 border-teal cursor-pointer hover:shadow-xl transition-all duration-300"
                  onClick={() => openItemModal(dish)}
                >
                  <img src={dish.img_url || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400'} alt={getItemName(dish)} className="w-full h-40 object-cover" />
                  <CardContent className="p-4">
                    <h4 className="text-lg font-semibold text-deep-black mb-1">{getItemName(dish)}</h4>
                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">{getItemDescription(dish)}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-teal font-bold flex items-center">
                        <Star className="h-4 w-4 mr-1 fill-current" />
                        {dish.view_count} vues
                      </span>
                      <Button
                        size="sm"
                        className="bg-teal hover:bg-teal text-white px-3 py-1 rounded-full text-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          addItem({ id: dish.id, name: getItemName(dish), price: dish.price, img_url: dish.img_url });
                        }}
                      >
                        {t('menu.order')}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
        
        {/* Menu Download */}
        <div className="text-center mt-12">
          <Button 
            className="bg-deep-black hover:bg-gray-800 text-white px-8 py-4 rounded-full font-medium text-lg transition-all duration-300 transform hover:scale-105"
            onClick={downloadMenuPDF}
            disabled={downloading}
          >
            <Download className="mr-2 h-5 w-5" />
            {downloading ? 'Téléchargement...' : t('menu.downloadPdf')}
          </Button>
        </div>
      </div>

      {/* Item Detail Modal with Animations */}
      {modalOpen && selectedItem && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in duration-300"
          onClick={closeModal}
        >
          <div 
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              {(() => {
                const images = getItemImages(selectedItem);
                return (
                  <>
                    <img 
                      src={images[currentImageIndex] || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400'} 
                      alt={getItemName(selectedItem)}
                      className="w-full h-64 object-cover rounded-t-lg transition-all duration-300"
                    />
                    
                    {/* Navigation arrows for multiple images */}
                    {images.length > 1 && (
                      <>
                        <Button
                          variant="ghost"
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full w-10 h-10 p-0"
                          onClick={() => prevImage(images)}
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </Button>
                        <Button
                          variant="ghost"
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full w-10 h-10 p-0"
                          onClick={() => nextImage(images)}
                        >
                          <ChevronRight className="h-5 w-5" />
                        </Button>
                        
                        {/* Image indicators */}
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                          {images.map((_, index) => (
                            <button
                              key={index}
                              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                index === currentImageIndex 
                                  ? 'bg-white scale-125' 
                                  : 'bg-white/50 hover:bg-white/75'
                              }`}
                              onClick={() => setCurrentImageIndex(index)}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </>
                );
              })()}
              
              <Button
                variant="ghost"
                className="absolute top-4 right-4 bg-white/80 hover:bg-white text-gray-800 rounded-full w-10 h-10 p-0 transition-all duration-300 hover:scale-110"
                onClick={closeModal}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-deep-black">
                  {getItemName(selectedItem)}
                </h2>
                <span className="text-3xl font-bold text-teal">
                  {selectedItem.price} DH
                </span>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed">
                  {getItemDescription(selectedItem)}
                </p>
              </div>

              {selectedItem.allergens && selectedItem.allergens.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Allergènes</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedItem.allergens.map((allergen) => (
                      <Badge key={allergen} variant="secondary" className="bg-red-100 text-red-800">
                        {allergen}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex space-x-4">
                <Button
                  className="flex-1 bg-teal hover:bg-teal-600 text-white py-3 text-lg font-medium transition-all duration-300 hover:scale-105"
                  onClick={() => handleAddToCart(selectedItem)}
                >
                  Ajouter au panier
                </Button>
                <Button
                  variant="outline"
                  className="px-6 py-3 transition-all duration-300 hover:scale-105"
                  onClick={closeModal}
                >
                  Fermer
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
