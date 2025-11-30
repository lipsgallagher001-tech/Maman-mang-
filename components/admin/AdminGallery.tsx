import React, { useState } from 'react';
import { Upload, Trash2 } from 'lucide-react';

interface AdminGalleryProps {
  galleryImages: string[];
  onUpdateGallery: (images: string[]) => void;
}

const AdminGallery: React.FC<AdminGalleryProps> = ({ galleryImages, onUpdateGallery }) => {
  const [newImageUrl, setNewImageUrl] = useState('');

  const handleGalleryFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddImage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newImageUrl.trim()) {
      onUpdateGallery([...galleryImages, newImageUrl.trim()]);
      setNewImageUrl('');
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    const newImages = galleryImages.filter((_, index) => index !== indexToRemove);
    onUpdateGallery(newImages);
  };

  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold text-brand-brown mb-6">Gestion de la Galerie</h2>
      
      <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
        <h3 className="font-bold mb-4">Ajouter une nouvelle image</h3>
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors cursor-pointer relative">
            <input 
               type="file" 
               accept="image/*"
               onChange={handleGalleryFileUpload}
               className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <Upload className="text-gray-400 mb-2" size={48} />
            <p className="text-lg font-medium text-gray-600">Glissez une image ou cliquez pour parcourir</p>
            <p className="text-sm text-gray-400 mt-1">PNG, JPG jusqu'à 5MB</p>
        </div>
        {newImageUrl && (
           <div className="mt-4 flex items-center gap-4 bg-green-50 p-4 rounded-lg border border-green-200">
              <img src={newImageUrl} alt="Preview" className="w-16 h-16 rounded object-cover" />
              <div className="flex-1">
                 <p className="text-green-800 font-medium">Image prête à être ajoutée</p>
              </div>
              <button onClick={handleAddImage} className="bg-green-600 text-white px-4 py-2 rounded font-bold hover:bg-green-700">Confirmer l'ajout</button>
           </div>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {galleryImages.map((img, idx) => (
          <div key={idx} className="relative group rounded-lg overflow-hidden aspect-square border shadow-sm">
            <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button 
                onClick={() => handleRemoveImage(idx)}
                className="bg-red-500 text-white p-3 rounded-full hover:bg-red-600 transition-colors"
              >
                <Trash2 size={24} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminGallery;