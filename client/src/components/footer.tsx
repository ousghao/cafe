import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/hooks/use-language";

export default function Footer() {
  const { t } = useLanguage();

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-deep-black text-white py-16">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="text-3xl font-serif font-bold mb-4">
              <span className="text-gold">Assouan</span> Fès
            </div>
            <p className="text-gray-400 mb-6">
              {t('footer.tagline')}
            </p>
            <div className="flex space-x-4">
              <Button 
                size="icon"
                className="w-10 h-10 bg-gold hover:bg-gold rounded-full transition-colors duration-300"
              >
                <i className="fab fa-facebook-f text-sm"></i>
              </Button>
              <Button 
                size="icon"
                className="w-10 h-10 bg-gold hover:bg-gold rounded-full transition-colors duration-300"
              >
                <i className="fab fa-instagram text-sm"></i>
              </Button>
              <Button 
                size="icon"
                className="w-10 h-10 bg-gold hover:bg-gold rounded-full transition-colors duration-300"
              >
                <i className="fab fa-whatsapp text-sm"></i>
              </Button>
            </div>
          </div>
          
          {/* Navigation Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gold">{t('footer.navigation')}</h3>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => scrollToSection('#home')}
                  className="text-gray-400 hover:text-white transition-colors duration-300 text-left"
                >
                  {t('nav.home')}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('#menu')}
                  className="text-gray-400 hover:text-white transition-colors duration-300 text-left"
                >
                  {t('nav.menu')}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('#gallery')}
                  className="text-gray-400 hover:text-white transition-colors duration-300 text-left"
                >
                  {t('nav.gallery')}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('#about')}
                  className="text-gray-400 hover:text-white transition-colors duration-300 text-left"
                >
                  {t('nav.about')}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('#contact')}
                  className="text-gray-400 hover:text-white transition-colors duration-300 text-left"
                >
                  {t('nav.contact')}
                </button>
              </li>
            </ul>
          </div>
          
          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gold">{t('footer.services')}</h3>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => scrollToSection('#reservation')}
                  className="text-gray-400 hover:text-white transition-colors duration-300 text-left"
                >
                  {t('footer.reservation')}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('#custom-cakes')}
                  className="text-gray-400 hover:text-white transition-colors duration-300 text-left"
                >
                  {t('footer.customCakes')}
                </button>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                  {t('footer.delivery')}
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                  {t('footer.privateEvents')}
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                  {t('footer.catering')}
                </a>
              </li>
            </ul>
          </div>
          
          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gold">{t('footer.newsletter')}</h3>
            <p className="text-gray-400 mb-4 text-sm">{t('footer.newsletterDescription')}</p>
            <div className="space-y-3">
              <Input 
                type="email"
                placeholder={t('footer.emailPlaceholder')}
                className="bg-gray-800 border-gray-600 text-white focus:border-gold"
              />
              <Button className="w-full bg-gold hover:bg-gold text-white rounded-lg font-medium transition-colors duration-300">
                {t('footer.subscribe')}
              </Button>
            </div>
          </div>
        </div>
        
        {/* Bottom Footer */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              {t('footer.copyright')}
            </div>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                {t('footer.legal')}
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                {t('footer.privacy')}
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                {t('footer.terms')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
