import { useState } from 'react';
import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import MenuSection from "@/components/menu-section";
import GallerySection from "@/components/gallery-section";
import AboutSection from "@/components/about-section";
import ReservationSection from "@/components/reservation-section";
import CustomCakesSection from "@/components/custom-cakes-section";
import ContactSection from "@/components/contact-section";
import Footer from "@/components/footer";
import FloatingWhatsApp from "@/components/floating-whatsapp";
import CartSidebar from "@/components/CartSidebar";

export default function Home() {
  const [cartOpen, setCartOpen] = useState(false);
  return (
    <div className="min-h-screen">
      <Navigation onCartClick={() => setCartOpen(true)} />
      <HeroSection />
      
      {/* Quick Info Banner */}
      <section className="bg-deep-black text-white py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between text-center md:text-left">
            <div className="flex items-center space-x-6 mb-2 md:mb-0">
              <div className="flex items-center">
                <i className="fas fa-clock text-gold mr-2"></i>
                <span className="text-sm">Ouvert tous les jours: 7h00 - 23h00</span>
              </div>
              <div className="flex items-center">
                <i className="fas fa-phone text-gold mr-2"></i>
                <span className="text-sm">+212 5 35 62 34 56</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gold text-sm font-medium">Spécial Ramadan: Menu Iftar disponible</span>
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300">
                <i className="fab fa-whatsapp mr-1"></i>
                Commander
              </button>
            </div>
          </div>
        </div>
      </section>
      
      <MenuSection />
      <GallerySection />
      <AboutSection />
      <ReservationSection />
      <CustomCakesSection />
      <ContactSection />
      <Footer />
      <FloatingWhatsApp />
      <CartSidebar open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}
