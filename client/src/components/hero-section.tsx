import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/use-language";
import { ChevronDown, Utensils, Calendar } from "lucide-react";

export default function HeroSection() {
  const { t } = useLanguage();

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat" 
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&h=1080')"
        }}
      />
      <div className="absolute inset-0 hero-gradient" />
      
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold mb-6 animate-fade-in">
          <span className="text-gold">Assouan</span> Fès
        </h1>
        <p className="text-xl md:text-2xl lg:text-3xl mb-4 animate-slide-up opacity-90">
          {t('hero.tagline')}
        </p>
        <p className="text-lg md:text-xl mb-8 animate-slide-up opacity-80 max-w-2xl mx-auto">
          {t('hero.description')}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
          <Button 
            className="bg-gold hover:bg-gold text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            onClick={() => scrollToSection('#menu')}
          >
            <Utensils className="mr-2 h-5 w-5" />
            {t('hero.viewMenu')}
          </Button>
          <Button 
            variant="outline"
            className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105"
            onClick={() => scrollToSection('#reservation')}
          >
            <Calendar className="mr-2 h-5 w-5" />
            {t('hero.bookTable')}
          </Button>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
        <ChevronDown className="h-8 w-8 opacity-70" />
      </div>
    </section>
  );
}
