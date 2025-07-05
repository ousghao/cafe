import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/use-language";
import { Instagram } from "lucide-react";

const galleryImages = [
  {
    src: "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    alt: "Restaurant interior",
    altKey: "gallery.interior"
  },
  {
    src: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    alt: "Restaurant terrace",
    altKey: "gallery.terrace"
  },
  {
    src: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    alt: "Signature cake",
    altKey: "gallery.cake"
  },
  {
    src: "https://images.unsplash.com/photo-1486427944299-d1955d23e34d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    alt: "Pastry display",
    altKey: "gallery.pastries"
  },
  {
    src: "https://images.unsplash.com/photo-1551024601-bec78aea704b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    alt: "Moroccan breakfast",
    altKey: "gallery.breakfast"
  },
  {
    src: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    alt: "Chef at work",
    altKey: "gallery.chef"
  }
];

export default function GallerySection() {
  const { t } = useLanguage();
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  return (
    <section id="gallery" className="py-16 lg:py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-serif font-bold text-deep-black mb-4">
            <span className="text-gold">{t('gallery.title')}</span> {t('gallery.subtitle')}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('gallery.description')}
          </p>
        </div>
        
        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryImages.map((image, index) => (
            <Dialog key={index}>
              <DialogTrigger asChild>
                <div 
                  className="group cursor-pointer overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  onClick={() => setSelectedImage(index)}
                >
                  <img 
                    src={image.src}
                    alt={t(image.altKey)}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-4xl w-full p-0">
                <img 
                  src={image.src}
                  alt={t(image.altKey)}
                  className="w-full h-auto max-h-[80vh] object-contain"
                />
              </DialogContent>
            </Dialog>
          ))}
        </div>
        
        {/* Instagram Feed */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-serif font-semibold text-deep-black mb-6">
            {t('gallery.followUs')} <span className="text-gold">Instagram</span>
          </h3>
          <p className="text-gray-600 mb-8">
            @assouanfes - {t('gallery.instagramDescription')}
          </p>
          <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-4 rounded-full font-medium text-lg transition-all duration-300 transform hover:scale-105">
            <Instagram className="mr-2 h-5 w-5" />
            {t('gallery.viewInstagram')}
          </Button>
        </div>
      </div>
    </section>
  );
}
