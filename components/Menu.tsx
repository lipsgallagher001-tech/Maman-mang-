import React, { useState } from 'react';
import { Dish, Order } from '../types';
import MamansConseil from './MamansConseil';
import OrderModal from './OrderModal';

interface MenuProps {
  menuItems: Dish[];
  onAddOrder: (order: Order) => void;
}

const Menu: React.FC<MenuProps> = ({ menuItems, onAddOrder }) => {
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);

  // Filtrer uniquement les plats disponibles pour les clients
  const availableItems = menuItems.filter(item => item.available);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-brand-brown mb-4">Menu du Jour</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Cuisinés ce matin même avec des produits frais du marché. Voici ce que Maman a préparé pour vous aujourd'hui.
        </p>
      </div>

      <MamansConseil menu={availableItems} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {availableItems.map((item) => (
          <div key={item.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full animate-fade-in">
            <div className="h-48 overflow-hidden relative group">
              <img 
                src={item.image} 
                alt={item.name} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-brand-brown mb-2">{item.name}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{item.description}</p>
              </div>
              <button 
                onClick={() => setSelectedDish(item)}
                className="w-full mt-4 bg-brand-green text-white py-2 rounded-lg hover:bg-brand-brown transition-colors font-medium shadow-md hover:shadow-lg transform active:scale-95 transition-all"
              >
                Commander
              </button>
            </div>
          </div>
        ))}
        
        {availableItems.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500 bg-white rounded-lg border-2 border-dashed border-gray-300">
            <p className="text-xl">Tout a été dévoré ! Maman retourne en cuisine pour demain.</p>
          </div>
        )}
      </div>

      {selectedDish && (
        <OrderModal 
          dish={selectedDish} 
          onClose={() => setSelectedDish(null)}
          onConfirmOrder={onAddOrder}
        />
      )}
    </div>
  );
};

export default Menu;