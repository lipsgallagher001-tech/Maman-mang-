import React from 'react';
import { Truck, UtensilsCrossed, CalendarClock, ChefHat } from 'lucide-react';
import { ServiceItem, SpecialtyItem } from '../types';

interface ServicesProps {
  specialties?: SpecialtyItem[];
}

const Services: React.FC<ServicesProps> = ({ specialties = [] }) => {
  const services: ServiceItem[] = [
    {
      title: "Livraison Express",
      description: "Plus besoin de vous déplacer. Nous livrons vos plats chauds directement chez vous ou au bureau, dans tout le périmètre de la ville.",
      icon: <Truck size={40} className="text-brand-orange" />
    },
    {
      title: "Repas sur Place",
      description: "Profitez de notre cadre chaleureux et convivial pour déguster vos plats préférés seul, en famille ou entre amis.",
      icon: <UtensilsCrossed size={40} className="text-brand-green" />
    },
    {
      title: "Service Traiteur",
      description: "Pour vos mariages, baptêmes ou anniversaires, Maman Mangé s'occupe de régaler vos invités avec des buffets africains copieux.",
      icon: <CalendarClock size={40} className="text-brand-brown" />
    }
  ];

  return (
    <div className="bg-white">
      {/* Section Services Généraux */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-brown">Nos Services</h2>
            <p className="mt-4 text-xl text-gray-500">Nous sommes là pour satisfaire vos envies, où que vous soyez.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {services.map((service, index) => (
              <div key={index} className="bg-brand-cream/30 p-8 rounded-2xl hover:bg-brand-cream transition-colors duration-300 border border-transparent hover:border-brand-orange/20 text-center flex flex-col items-center">
                <div className="mb-6 p-4 bg-white rounded-full shadow-md">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-brand-brown mb-4">{service.title}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section Répertoire Culinaire */}
      <div className="bg-brand-brown text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-10 justify-center md:justify-start">
            <div className="p-3 bg-brand-orange rounded-full">
              <ChefHat size={32} />
            </div>
            <div>
              <h2 className="text-3xl font-bold">Notre Savoir-Faire Culinaire</h2>
              <p className="text-brand-cream/80 mt-1">Voici les plats que Maman prépare avec passion pour vos événements.</p>
            </div>
          </div>

          {specialties && specialties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {specialties.map((item) => (
                <div key={item.id} className="bg-white text-brand-brown rounded-xl overflow-hidden shadow-lg group hover:-translate-y-2 transition-all duration-300">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-xl mb-2 text-brand-orange">{item.name}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
             <div className="text-center py-10 text-brand-cream/60">
                Aucune spécialité ajoutée pour le moment.
             </div>
          )}
          
          <div className="mt-12 text-center bg-white/10 p-6 rounded-xl border border-white/20">
            <p className="text-lg">
              Vous souhaitez commander l'un de ces plats pour une occasion spéciale ? 
              <span className="block mt-2 font-bold text-brand-orange">Contactez-nous pour un devis traiteur !</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;