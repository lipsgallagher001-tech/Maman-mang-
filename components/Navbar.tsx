import React, { useState } from 'react';
import { Menu, X, Phone } from 'lucide-react';
import { PageView } from '../types';

interface NavbarProps {
  currentPage: PageView;
  onNavigate: (page: PageView) => void;
  phoneNumber?: string;
}

const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate, phoneNumber = "+228 90 00 00 00" }) => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems: { id: PageView; label: string }[] = [
    { id: 'home', label: 'Accueil' },
    { id: 'menu', label: 'Menu' },
    { id: 'about', label: 'À propos' },
    { id: 'services', label: 'Services' },
    { id: 'gallery', label: 'Galerie' },
    { id: 'reviews', label: 'Avis' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNav = (page: PageView) => {
    onNavigate(page);
    setIsOpen(false);
  };

  return (
    <nav className="bg-brand-brown text-brand-cream sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div 
            className="flex-shrink-0 cursor-pointer flex items-center gap-2" 
            onClick={() => handleNav('home')}
          >
            <div className="w-10 h-10 bg-brand-orange rounded-full flex items-center justify-center font-bold text-xl text-white">
              M
            </div>
            <span className="font-bold text-2xl tracking-wider">Maman Mangé</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    currentPage === item.id
                      ? 'bg-brand-orange text-white'
                      : 'hover:bg-brand-green hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-brand-cream hover:bg-brand-orange focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-brand-brown pb-4 px-2 pt-2 shadow-xl">
          <div className="space-y-1 sm:px-3">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                  currentPage === item.id
                    ? 'bg-brand-orange text-white'
                    : 'text-brand-cream hover:bg-brand-green'
                }`}
              >
                {item.label}
              </button>
            ))}
            <a 
              href={`tel:${phoneNumber.replace(/\s/g, '')}`}
              className="flex items-center gap-2 w-full px-3 py-2 mt-4 text-base font-medium text-brand-brown bg-brand-yellow rounded-md"
            >
              <Phone size={18} />
              Commander par Tél
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;