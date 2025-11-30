import React, { useState } from 'react';
import { Check, Upload, Trash2 } from 'lucide-react';
import { SpecialtyItem } from '../../types';

interface AdminExpertiseProps {
  specialties: SpecialtyItem[];
  onUpdateSpecialties: (specialties: SpecialtyItem[]) => void;
}

const AdminExpertise: React.FC<AdminExpertiseProps> = ({ specialties, onUpdateSpecialties }) => {
  const [newSpecialty, setNewSpecialty] = useState({
    name: '',
    description: '',
    image: ''
  });

  const handleSpecialtyImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewSpecialty(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddSpecialty = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSpecialty.name) {
      const specialty: SpecialtyItem = {
        id: Date.now().toString(),
        name: newSpecialty.name,
        description: newSpecialty.description,
        image: newSpecialty.image || 'https://picsum.photos/seed/specialty/400/300'
      };
      onUpdateSpecialties([...specialties, specialty]);
      setNewSpecialty({ name: '', description: '', image: '' });
    }
  };

  const handleRemoveSpecialty = (id: string) => {
    onUpdateSpecialties(specialties.filter(s => s.id !== id));
  };

  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold text-brand-brown mb-6">Gestion du Savoir-Faire Culinaire</h2>

      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 mb-8">
          <h3 className="font-bold text-lg mb-4 text-brand-brown">Ajouter une spécialité</h3>
          <form onSubmit={handleAddSpecialty} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom du plat</label>
                  <input 
                    required
                    type="text" 
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-brand-orange outline-none"
                    value={newSpecialty.name}
                    onChange={(e) => setNewSpecialty({...newSpecialty, name: e.target.value})}
                  />
               </div>
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Courte description</label>
                  <input 
                    required
                    type="text" 
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-brand-orange outline-none"
                    value={newSpecialty.description}
                    onChange={(e) => setNewSpecialty({...newSpecialty, description: e.target.value})}
                  />
               </div>
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                  <div className="relative border border-gray-300 rounded bg-gray-50 hover:bg-gray-100 cursor-pointer h-[42px] flex items-center justify-center overflow-hidden">
                     <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleSpecialtyImageUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                     />
                     {newSpecialty.image ? (
                        <span className="text-green-600 text-sm font-bold flex items-center gap-1"><Check size={14}/> Image chargée</span>
                     ) : (
                        <span className="text-gray-500 text-sm flex items-center gap-1"><Upload size={14}/> Choisir photo</span>
                     )}
                  </div>
               </div>
            </div>
            <button type="submit" className="w-full bg-brand-brown text-white py-2 rounded font-bold hover:bg-brand-orange transition-colors">
               Ajouter cette spécialité
            </button>
          </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {specialties.map((item) => (
          <div key={item.id} className="bg-white rounded-xl shadow-sm border overflow-hidden group">
            <div className="h-40 overflow-hidden relative">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              <button 
                 onClick={() => handleRemoveSpecialty(item.id)}
                 className="absolute top-2 right-2 p-2 bg-white/80 hover:bg-red-500 hover:text-white rounded-full text-red-500 transition-colors shadow-sm opacity-0 group-hover:opacity-100"
              >
                 <Trash2 size={16} />
              </button>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-brand-brown">{item.name}</h3>
              <p className="text-sm text-gray-600 mt-1">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminExpertise;