import React, { useState } from 'react';
import { X, Minus, Plus, MapPin, Phone, User, CheckCircle, Edit3 } from 'lucide-react';
import { Dish, Order } from '../types';

interface OrderModalProps {
  dish: Dish;
  onClose: () => void;
  onConfirmOrder: (order: Order) => void;
}

const OrderModal: React.FC<OrderModalProps> = ({ dish, onClose, onConfirmOrder }) => {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [quantity, setQuantity] = useState(1);
  const [deliveryMode, setDeliveryMode] = useState<'pickup' | 'delivery'>('delivery');
  const [customPrice, setCustomPrice] = useState<string>(dish.price.toString());
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    notes: ''
  });

  const handleQuantityChange = (delta: number) => {
    const newQty = quantity + delta;
    if (newQty >= 1) {
      setQuantity(newQty);
      setCustomPrice((dish.price * newQty).toString());
    }
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    setCustomPrice(val);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newOrder: Order = {
      id: Date.now().toString(),
      customerName: formData.name,
      customerPhone: formData.phone,
      customerAddress: deliveryMode === 'delivery' ? formData.address : undefined,
      dishName: dish.name,
      quantity: quantity,
      totalPrice: parseInt(customPrice || '0'),
      status: 'pending',
      date: new Date(),
      deliveryMode: deliveryMode,
      notes: formData.notes
    };

    onConfirmOrder(newOrder);
    setStep('success');
    
    setTimeout(() => {
      onClose();
    }, 3000);
  };

  if (step === 'success') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center animate-bounce-in shadow-2xl">
          <div className="w-16 h-16 bg-green-100 text-brand-green rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={40} />
          </div>
          <h3 className="text-2xl font-bold text-brand-brown mb-2">Commande Reçue !</h3>
          <p className="text-gray-600 mb-2">
            Merci {formData.name}.
          </p>
          <p className="text-sm text-gray-500 bg-gray-100 p-2 rounded mb-4">
            Maman va vérifier votre offre de {parseInt(customPrice || '0').toLocaleString()} FCFA et vous contacter au {formData.phone}.
          </p>
          <button 
            onClick={onClose}
            className="mt-4 bg-brand-brown text-white px-6 py-2 rounded-lg hover:bg-brand-orange transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh] animate-fade-in-up">
        
        <div className="relative h-32 bg-brand-brown shrink-0">
          <img 
            src={dish.image} 
            alt={dish.name} 
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
            <h2 className="text-2xl font-bold text-white shadow-black drop-shadow-md">{dish.name}</h2>
          </div>
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full transition-colors backdrop-blur-md"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="bg-brand-cream/30 p-4 rounded-xl border border-brand-orange/10">
              <div className="flex items-end justify-between mb-2">
                <span className="text-sm font-medium text-gray-500">Quantité</span>
                <span className="text-sm font-medium text-gray-500 flex items-center gap-1">
                  Votre Prix (FCFA) <Edit3 size={12} />
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button 
                    type="button"
                    onClick={() => handleQuantityChange(-1)}
                    className="w-10 h-10 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-brand-orange hover:text-white hover:border-brand-orange transition-colors"
                  >
                    <Minus size={18} />
                  </button>
                  <span className="text-xl font-bold w-8 text-center">{quantity}</span>
                  <button 
                    type="button"
                    onClick={() => handleQuantityChange(1)}
                    className="w-10 h-10 rounded-full bg-brand-brown text-white flex items-center justify-center hover:bg-brand-orange transition-colors"
                  >
                    <Plus size={18} />
                  </button>
                </div>
                
                <div className="relative">
                  <input
                    type="text"
                    value={customPrice}
                    onChange={handlePriceChange}
                    className="text-2xl font-bold text-brand-orange text-right w-32 bg-transparent border-b-2 border-brand-orange/20 focus:border-brand-orange outline-none transition-colors p-1"
                  />
                </div>
              </div>
              <p className="text-xs text-right text-gray-400 mt-1">Prix suggéré : {(dish.price * quantity).toLocaleString()} FCFA</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDeliveryMode('delivery')}
                className={`p-3 rounded-lg border-2 text-center font-medium transition-all ${
                  deliveryMode === 'delivery' 
                    ? 'border-brand-orange bg-brand-orange/5 text-brand-orange' 
                    : 'border-gray-200 text-gray-500 hover:border-gray-300'
                }`}
              >
                Livraison
              </button>
              <button
                type="button"
                onClick={() => setDeliveryMode('pickup')}
                className={`p-3 rounded-lg border-2 text-center font-medium transition-all ${
                  deliveryMode === 'pickup' 
                    ? 'border-brand-orange bg-brand-orange/5 text-brand-orange' 
                    : 'border-gray-200 text-gray-500 hover:border-gray-300'
                }`}
              >
                À emporter
              </button>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <User className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  required
                  type="text"
                  placeholder="Votre Nom"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition-all"
                />
              </div>

              <div className="relative">
                <Phone className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  required
                  type="tel"
                  placeholder="Votre Téléphone"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition-all"
                />
              </div>

              {deliveryMode === 'delivery' && (
                <div className="relative animate-fade-in">
                  <MapPin className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    required
                    type="text"
                    placeholder="Adresse de livraison"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition-all"
                  />
                </div>
              )}

              <div>
                <textarea
                  rows={2}
                  placeholder="Instructions spéciales..."
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition-all resize-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-brand-green text-white font-bold py-4 rounded-xl hover:bg-brand-brown hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-brand-green/20 flex flex-col items-center leading-tight"
            >
              <span>Valider la commande</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OrderModal;