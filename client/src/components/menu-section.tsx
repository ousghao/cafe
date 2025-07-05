import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/hooks/use-language";
import { Download } from "lucide-react";
import type { MenuItem } from "@shared/schema";

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

  const { data: menuItems, isLoading } = useQuery<MenuItem[]>({
    queryKey: ["/api/menu"],
  });

  const filteredItems = menuItems?.filter(item => 
    activeCategory === "all" || item.category === activeCategory
  ) || [];

  const getItemName = (item: MenuItem) => {
    switch (language) {
      case 'ar': return item.nameAr;
      case 'en': return item.nameEn;
      default: return item.name;
    }
  };

  const getItemDescription = (item: MenuItem) => {
    switch (language) {
      case 'ar': return item.descriptionAr;
      case 'en': return item.descriptionEn;
      default: return item.description;
    }
  };

  return (
    <section id="menu" className="py-16 lg:py-24 bg-gray-50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-serif font-bold text-deep-black mb-4">
            {t('menu.title')} <span className="text-gold">{t('menu.titleHighlight')}</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('menu.description')}
          </p>
        </div>
        
        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? "default" : "outline"}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                activeCategory === category.id 
                  ? 'bg-gold text-white hover:bg-gold'
                  : 'bg-white hover:bg-gold hover:text-white text-gray-700'
              }`}
              onClick={() => setActiveCategory(category.id)}
            >
              {t(category.labelKey)}
            </Button>
          ))}
        </div>
        
        {/* Menu Items Grid */}
        {isLoading ? (
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
              <Card key={item.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <img 
                  src={item.imageUrl || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400'} 
                  alt={getItemName(item)}
                  className="w-full h-48 object-cover"
                />
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-deep-black mb-2">
                    {getItemName(item)}
                  </h3>
                  <p className="text-gray-600 mb-4 text-sm">
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
                    <span className="text-2xl font-bold text-gold">
                      {item.price} DH
                    </span>
                    <Button className="bg-gold hover:bg-gold text-white px-4 py-2 rounded-full font-medium transition-colors duration-300">
                      {t('menu.order')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        
        {/* Menu Download */}
        <div className="text-center mt-12">
          <Button className="bg-deep-black hover:bg-gray-800 text-white px-8 py-4 rounded-full font-medium text-lg transition-all duration-300 transform hover:scale-105">
            <Download className="mr-2 h-5 w-5" />
            {t('menu.downloadPdf')}
          </Button>
        </div>
      </div>
    </section>
  );
}
