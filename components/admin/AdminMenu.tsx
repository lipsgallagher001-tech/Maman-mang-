import React, { useState } from 'react';
import { X, PlusCircle, Trash2, Check, Upload } from 'lucide-react';
import { Dish } from '../../types';

interface AdminMenuProps {
  menuItems: Dish[];
  onAddDish: (dish: Dish) => void;
  onDeleteDish: (id: string) => void;
  onToggleAvailability: (id: string) => void;
}

const AdminMenu: React.FC<AdminMenuProps> = ({ menuItems, onAddDish, onDeleteDish, onToggleAvailability }) => {
  const [showAddDishForm, setShowAddDishForm] = useState(false);
  const [newDish, setNewDish] = useState({
    name: '',
    description: '',
    image: '',
    category: 'plat' as const
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewDish(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitDish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDish.name) return;

    const dish: Dish = {
      id: Date.now().toString(),
      name: newDish.name,
      description: newDish.description,
      price: 0,
      image: newDish.image || 'https://picsum.photos/seed/new/400/300',
      category: newDish.category,
      available: true
    };

    onAddDish(dish);
    setNewDish({ name: '', description: '', image: '', category: 'plat' });
    setShowAddDishForm(false);
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-brand-brown">Gestion du Menu</h2>
        <button 
          onClick={() => setShowAddDishForm(!showAddDishForm)}
          className="bg-brand-orange text-white px-4 py-2 rounded-lg font-bold hover:bg-brand-brown transition-colors flex items-center gap-2 shadow-lg"
        >
          {showAddDishForm ? <X size={20} /> : <PlusCircle size={20} />}
          {showAddDishForm ? 'Fermer' : 'Nouveau Plat'}
        </button>
      </div>

      {showAddDishForm && (
        <div className="bg-white p-6 rounded-xl shadow-md border border-brand-orange mb-8 animate-fade-in-up">
          <h3 className="font-bold text-lg mb-4 text-brand-orange">Ajouter un plat au menu</h3>
          <form onSubmit={handleSubmitDish} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom du plat</label>
                  <input 
                    required
                    type="text" 
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-brand-orange outline-none"
                    value={newDish.name}
                    onChange={(e) => setNewDish({...newDish, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                  <select 
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-brand-orange outline-none"
                    value={newDish.category}
                    onChange={(e) => setNewDish({...newDish, category: e.target.value as any})}
                  >
                    <option value="plat">Plat Principal</option>
                    <option value="dessert">Dessert / Boisson</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea 
                    required
                    rows={3}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-brand-orange outline-none"
                    value={newDish.description}
                    onChange={(e) => setNewDish({...newDish, description: e.target.value})}
                  />
                </div>
              </div>

              <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Image du plat</label>
                 <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors cursor-pointer relative">
                    <input 
                       type="file" 
                       accept="image/*"
                       onChange={handleImageUpload}
                       className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    {newDish.image ? (
                       <img src={newDish.image} alt="Preview" className="h-40 w-full object-cover rounded-md" />
                    ) : (
                       <>
                          <Upload className="text-gray-400 mb-2" size={32} />
                          <p className="text-sm text-gray-500">Cliquez pour télécharger une photo</p>
                       </>
                    )}
                 </div>
              </div>
            </div>
            <div className="flex justify-end pt-4">
              <button type="submit" className="bg-brand-green text-white px-8 py-3 rounded-lg font-bold hover:bg-brand-brown transition-colors">
                Enregistrer le plat
              </button>
            </div>
          </form>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.map((item) => (
          <div key={item.id} className={`bg-white rounded-xl shadow-sm border p-4 flex flex-col gap-4 transition-all ${!item.available ? 'opacity-75 grayscale bg-gray-50' : ''}`}>
            <div className="flex gap-4">
              <img src={item.image} alt={item.name} className="w-20 h-20 rounded-lg object-cover bg-gray-200" />
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-brand-brown">{item.name}</h3>
                  <span className="text-xs px-2 py-1 bg-gray-100 rounded text-gray-500 uppercase">{item.category}</span>
                </div>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{item.description}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 pt-2 border-t">
              <button 
                onClick={() => onToggleAvailability(item.id)}
                className={`flex-1 py-2 rounded-lg font-bold text-sm transition-colors flex items-center justify-center gap-2 ${
                  item.available 
                    ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                    : 'bg-red-100 text-red-700 hover:bg-red-200'
                }`}
              >
                {item.available ? <><Check size={16} /> DISPONIBLE</> : <><X size={16} /> ÉPUISÉ</>}
              </button>
              <button 
                type="button"
                onClick={() => onDeleteDish(item.id)}
                className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 hover:text-red-700 transition-colors"
                title="Supprimer définitivement"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminMenu;