import { useLanguage } from "@/hooks/use-language";
import { Award } from "lucide-react";

export default function AboutSection() {
  const { t } = useLanguage();

  return (
    <section id="about" className="py-16 lg:py-24 bg-gray-50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <h2 className="text-4xl lg:text-5xl font-serif font-bold text-deep-black mb-6">
              {t('about.title')} <span className="text-teal">{t('about.titleHighlight')}</span>
            </h2>
            <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
              <p>
                {t('about.paragraph1')}
              </p>
              <p>
                {t('about.paragraph2')}
              </p>
              <p>
                {t('about.paragraph3')}
              </p>
            </div>
            
            {/* Key Numbers */}
            <div className="grid grid-cols-3 gap-6 mt-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-teal">33</div>
                <div className="text-sm text-gray-600 font-medium">{t('about.yearsExperience')}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-teal">1000+</div>
                <div className="text-sm text-gray-600 font-medium">{t('about.customCakes')}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-teal">15</div>
                <div className="text-sm text-gray-600 font-medium">{t('about.teamMembers')}</div>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1000"
              alt={t('about.imageAlt')}
              className="rounded-xl shadow-2xl w-full h-auto"
            />
            
            {/* Floating Card */}
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-xl max-w-xs">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-teal rounded-full flex items-center justify-center">
                  <Award className="text-white h-6 w-6" />
                </div>
                <div>
                  <div className="font-semibold text-deep-black">{t('about.certifiedQuality')}</div>
                  <div className="text-sm text-gray-600">{t('about.tourismMinistry')}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
