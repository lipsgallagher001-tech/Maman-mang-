import React from 'react';
import { PageView } from '../types';
import { ArrowRight } from 'lucide-react';

interface HeroProps {
  onNavigate: (page: PageView) => void;
}

const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  return (
    <div className="relative bg-brand-brown text-white overflow-hidden">
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1604328698692-f76ea9498e76?q=80&w=1920&auto=format&fit=crop" 
          alt="Femme africaine cuisinant avec joie" 
          className="w-full h-full object-cover opacity-40"
        />
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          Bienvenue chez <span className="text-brand-orange">Maman Mangé</span>
        </h1>
        <p className="text-xl md:text-2xl text-brand-cream max-w-3xl mb-10 font-light">
          La vraie cuisine africaine, authentique et généreuse. 
          <br className="hidden md:block" /> 
          Le goût unique qui nous distingue de tous les autres.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <button 
            onClick={() => onNavigate('menu')}
            className="bg-brand-orange text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-brand-cream hover:text-brand-brown transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:scale-105"
          >
            Commander Maintenant <ArrowRight size={20} />
          </button>
          <button 
            onClick={() => onNavigate('about')}
            className="bg-transparent border-2 border-brand-cream text-brand-cream px-8 py-4 rounded-full font-bold text-lg hover:bg-white/10 transition-all duration-300"
          >
            Notre Histoire
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;