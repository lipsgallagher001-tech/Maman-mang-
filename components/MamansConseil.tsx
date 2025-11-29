import React, { useState } from 'react';
import { Sparkles, ChefHat, Send } from 'lucide-react';
import { getDishRecommendation } from '../services/geminiService';
import { Dish } from '../types';

interface MamansConseilProps {
  menu: Dish[];
}

const MamansConseil: React.FC<MamansConseilProps> = ({ menu }) => {
  const [input, setInput] = useState('');
  const [recommendation, setRecommendation] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAskMaman = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    setRecommendation('');
    
    const response = await getDishRecommendation(input, menu);
    
    setRecommendation(response);
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-brand-orange/20 max-w-2xl mx-auto my-12">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 bg-brand-orange rounded-full text-white">
          <ChefHat size={24} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-brand-brown">Le Conseil de Maman</h3>
          <p className="text-sm text-gray-500">Vous ne savez pas quoi choisir ? Demandez-moi !</p>
        </div>
      </div>

      <div className="bg-brand-cream/50 p-4 rounded-lg mb-4 min-h-[80px] flex items-center justify-center">
        {loading ? (
          <div className="flex items-center gap-2 text-brand-orange animate-pulse">
            <Sparkles size={18} />
            <span>Maman réfléchit à la meilleure recette pour vous...</span>
          </div>
        ) : recommendation ? (
          <p className="text-brand-brown font-medium italic text-center">"{recommendation}"</p>
        ) : (
          <p className="text-gray-400 text-center text-sm">"Dites-moi ce qui vous ferait plaisir (ex: j'ai très faim, je veux du piment, quelque chose de léger...)"</p>
        )}
      </div>

      <form onSubmit={handleAskMaman} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ex: J'ai envie de quelque chose d'épicé..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="bg-brand-brown text-white px-6 py-2 rounded-lg hover:bg-brand-green transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          <Send size={18} />
          <span className="hidden sm:inline">Demander</span>
        </button>
      </form>
    </div>
  );
};

export default MamansConseil;