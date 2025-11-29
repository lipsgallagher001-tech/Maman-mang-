import React from 'react';
import { Facebook, Instagram, Twitter, Lock } from 'lucide-react';
import { PageView, SiteSettings } from '../types';

interface FooterProps {
  onNavigate?: (page: PageView) => void;
  settings?: SiteSettings;
}

const Footer: React.FC<FooterProps> = ({ onNavigate, settings }) => {
  return (
    <footer className="bg-brand-brown text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">Maman Mangé</h3>
            <p className="text-brand-cream/70 text-sm leading-relaxed">
              Le goût de l'authenticité. Nous servons la meilleure cuisine africaine de la ville avec amour et tradition.
            </p>
          </div>
          <div className="text-center md:text-left">
            <h4 className="font-bold text-lg mb-4 text-brand-orange">Liens Rapides</h4>
            <ul className="space-y-2 text-sm text-brand-cream/70">
              <li><button onClick={() => onNavigate?.('menu')} className="hover:text-white transition-colors">Menu</button></li>
              <li><button onClick={() => onNavigate?.('about')} className="hover:text-white transition-colors">À Propos</button></li>
              <li><button onClick={() => onNavigate?.('services')} className="hover:text-white transition-colors">Services</button></li>
              <li><button onClick={() => onNavigate?.('reviews')} className="hover:text-white transition-colors">Avis Clients</button></li>
              <li><button onClick={() => onNavigate?.('contact')} className="hover:text-white transition-colors">Contact</button></li>
            </ul>
          </div>
          <div className="text-center md:text-right">
            <h4 className="font-bold text-lg mb-4 text-brand-orange">Suivez-nous</h4>
            <div className="flex justify-center md:justify-end space-x-4">
              <a href={settings?.socialLinks.facebook || "#"} target="_blank" rel="noopener noreferrer" className="hover:text-brand-orange transition-colors"><Facebook /></a>
              <a href={settings?.socialLinks.instagram || "#"} target="_blank" rel="noopener noreferrer" className="hover:text-brand-orange transition-colors"><Instagram /></a>
              <a href={settings?.socialLinks.twitter || "#"} target="_blank" rel="noopener noreferrer" className="hover:text-brand-orange transition-colors"><Twitter /></a>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-brand-cream/50 gap-4">
          <p>&copy; {new Date().getFullYear()} Maman Mangé. Tous droits réservés.</p>
          <button 
            onClick={() => onNavigate?.('admin')}
            className="flex items-center gap-1 hover:text-brand-orange transition-colors opacity-60 hover:opacity-100"
          >
            <Lock size={12} /> Espace Pro
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;