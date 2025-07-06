import React, { useState } from "react";
import { useLanguage } from "@/hooks/use-language";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, ShoppingCart } from "lucide-react";
import { useCart } from './CartContext';

export default function Navigation({ onCartClick }: { onCartClick?: () => void }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const { items } = useCart();
  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);

  // Handle scroll effect
  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: "#home", label: "nav.home" },
    { href: "#menu", label: "nav.menu" },
    { href: "#gallery", label: "nav.gallery" },
    { href: "#about", label: "nav.about" },
    { href: "#contact", label: "nav.contact" },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'glass-effect shadow-lg' : 'glass-effect'
    }`}>
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <div className="flex items-center">
            <div className="text-2xl lg:text-3xl font-serif font-bold text-deep-black">
              <span className="text-teal">Assouan</span> Fès
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollToSection(link.href)}
                className="text-gray-700 hover:text-teal transition-colors duration-300 font-medium"
              >
                {t(link.label)}
              </button>
            ))}
          </div>
          
          {/* Language Switcher & CTA & Cart */}
          <div className="hidden lg:flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm">
              <button 
                className={`font-medium transition-colors ${
                  language === 'fr' ? 'text-teal' : 'text-gray-500 hover:text-teal'
                }`}
                onClick={() => setLanguage('fr')}
              >
                🇫🇷 FR
              </button>
              <span className="text-gray-300">|</span>
              <button 
                className={`transition-colors ${
                  language === 'en' ? 'text-teal font-medium' : 'text-gray-500 hover:text-teal'
                }`}
                onClick={() => setLanguage('en')}
              >
                🇬🇧 EN
              </button>
              <span className="text-gray-300">|</span>
              <button 
                className={`transition-colors ${
                  language === 'ar' ? 'text-teal font-medium' : 'text-gray-500 hover:text-teal'
                }`}
                onClick={() => setLanguage('ar')}
              >
                🇲🇦 AR
              </button>
            </div>
            <Button 
              className="bg-teal hover:bg-teal text-white px-6 py-2 rounded-full font-medium transition-all duration-300 transform hover:scale-105"
              onClick={() => scrollToSection('#reservation')}
            >
              {t('nav.reserve')}
            </Button>
            <Button
              variant="outline"
              className="relative border-teal text-teal hover:bg-teal hover:text-white px-5 py-2 rounded-xl font-medium flex items-center gap-2"
              onClick={onCartClick}
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              Panier
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-teal text-white rounded-full text-xs font-bold px-2 py-0.5 shadow-md border-2 border-white">
                  {cartCount}
                </span>
              )}
            </Button>
          </div>
          
          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col space-y-4 mt-8">
                {navLinks.map((link) => (
                  <button
                    key={link.href}
                    onClick={() => scrollToSection(link.href)}
                    className="text-left text-gray-700 hover:text-gold transition-colors font-medium py-2"
                  >
                    {t(link.label)}
                  </button>
                ))}
                <div className="flex items-center space-x-4 pt-4 border-t">
                  <div className="flex items-center space-x-2 text-sm">
                    <button 
                      className={`font-medium ${language === 'fr' ? 'text-gold' : 'text-gray-500'}`}
                      onClick={() => setLanguage('fr')}
                    >
                      🇫🇷 FR
                    </button>
                    <button 
                      className={`${language === 'en' ? 'text-gold font-medium' : 'text-gray-500'}`}
                      onClick={() => setLanguage('en')}
                    >
                      🇬🇧 EN
                    </button>
                    <button 
                      className={`${language === 'ar' ? 'text-gold font-medium' : 'text-gray-500'}`}
                      onClick={() => setLanguage('ar')}
                    >
                      🇲🇦 AR
                    </button>
                  </div>
                </div>
                <Button 
                  className="bg-gold text-white px-6 py-2 rounded-full font-medium mt-4"
                  onClick={() => scrollToSection('#reservation')}
                >
                  {t('nav.reserve')}
                </Button>
                <Button
                  variant="outline"
                  className="relative border-teal text-teal mt-2 flex items-center gap-2 px-5 py-2 rounded-xl font-medium"
                  onClick={onCartClick}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Panier
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-teal text-white rounded-full text-xs font-bold px-2 py-0.5 shadow-md border-2 border-white">
                      {cartCount}
                    </span>
                  )}
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
