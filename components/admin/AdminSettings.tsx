import React, { useState, useEffect } from 'react';
import { Save, Upload, Info } from 'lucide-react';
import { SiteSettings } from '../../types';

interface AdminSettingsProps {
  settings: SiteSettings;
  onUpdateSettings: (settings: SiteSettings) => void;
}

const AdminSettings: React.FC<AdminSettingsProps> = ({ settings, onUpdateSettings }) => {
  const [localSettings, setLocalSettings] = useState<SiteSettings>(settings);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(localSettings);
    alert('Paramètres mis à jour avec succès !');
  };

  const handleAboutImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLocalSettings(prev => ({ ...prev, aboutImage: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold text-brand-brown mb-6">Informations du Restaurant</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         {/* COLONNE GAUCHE: Info Générales */}
         <div className="space-y-8">
            <form onSubmit={handleSaveSettings} className="bg-white p-6 rounded-xl shadow-md space-y-6">
              
              <div>
                <h3 className="text-brand-orange font-bold border-b pb-2 mb-4">Image "Notre Histoire"</h3>
                {localSettings.aboutImage && (
                  <div className="mb-4 h-40 overflow-hidden rounded-lg border border-gray-200 relative">
                     <img src={localSettings.aboutImage} alt="About" className="w-full h-full object-cover" />
                     <div className="absolute inset-0 bg-black/20"></div>
                  </div>
                )}
                <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50 cursor-pointer">
                   <input 
                     type="file" 
                     accept="image/*"
                     onChange={handleAboutImageUpload}
                     className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                   />
                   <p className="text-sm text-gray-500 flex items-center justify-center gap-2"><Upload size={16}/> Changer la photo</p>
                </div>
              </div>

              <div>
                <h3 className="text-brand-orange font-bold border-b pb-2 mb-4">Coordonnées</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Numéro de Téléphone</label>
                    <input 
                      type="text" 
                      className="w-full p-2 bg-gray-50 border border-gray-200 rounded focus:ring-1 focus:ring-brand-orange outline-none"
                      value={localSettings.phoneNumber}
                      onChange={(e) => setLocalSettings({...localSettings, phoneNumber: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Adresse</label>
                    <input 
                      type="text" 
                      className="w-full p-2 bg-gray-50 border border-gray-200 rounded focus:ring-1 focus:ring-brand-orange outline-none"
                      value={localSettings.address}
                      onChange={(e) => setLocalSettings({...localSettings, address: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-brand-orange font-bold border-b pb-2 mb-4">Horaires d'Ouverture</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Semaine (Lun-Sam)</label>
                    <input 
                      type="text" 
                      className="w-full p-2 bg-gray-50 border border-gray-200 rounded focus:ring-1 focus:ring-brand-orange outline-none"
                      value={localSettings.openingHoursWeek}
                      onChange={(e) => setLocalSettings({...localSettings, openingHoursWeek: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Dimanche</label>
                    <input 
                      type="text" 
                      className="w-full p-2 bg-gray-50 border border-gray-200 rounded focus:ring-1 focus:ring-brand-orange outline-none"
                      value={localSettings.openingHoursSunday}
                      onChange={(e) => setLocalSettings({...localSettings, openingHoursSunday: e.target.value})}
                    />
                  </div>
                </div>
              </div>
              
              <button type="submit" className="w-full bg-brand-green text-white py-3 rounded-lg font-bold hover:bg-brand-brown transition-colors flex items-center justify-center gap-2">
                 <Save size={18} /> Enregistrer les modifications
              </button>
            </form>
         </div>

         {/* COLONNE DROITE: Réseaux Sociaux */}
         <div className="space-y-8">
            <form onSubmit={handleSaveSettings} className="bg-white p-6 rounded-xl shadow-md h-full">
               <h3 className="text-brand-orange font-bold border-b pb-2 mb-6">Réseaux Sociaux</h3>
               <div className="space-y-4">
                  <div>
                     <label className="block text-xs font-bold text-gray-500 mb-1">Lien Facebook</label>
                     <input 
                        type="text" 
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded focus:ring-1 focus:ring-brand-orange outline-none"
                        value={localSettings.socialLinks.facebook}
                        onChange={(e) => setLocalSettings({...localSettings, socialLinks: {...localSettings.socialLinks, facebook: e.target.value}})}
                     />
                  </div>
                  <div>
                     <label className="block text-xs font-bold text-gray-500 mb-1">Lien Instagram</label>
                     <input 
                        type="text" 
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded focus:ring-1 focus:ring-brand-orange outline-none"
                        value={localSettings.socialLinks.instagram}
                        onChange={(e) => setLocalSettings({...localSettings, socialLinks: {...localSettings.socialLinks, instagram: e.target.value}})}
                     />
                  </div>
                  <div>
                     <label className="block text-xs font-bold text-gray-500 mb-1">Lien Twitter / X</label>
                     <input 
                        type="text" 
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded focus:ring-1 focus:ring-brand-orange outline-none"
                        value={localSettings.socialLinks.twitter}
                        onChange={(e) => setLocalSettings({...localSettings, socialLinks: {...localSettings.socialLinks, twitter: e.target.value}})}
                     />
                  </div>
               </div>
               <div className="mt-8 p-4 bg-brand-cream/30 rounded-lg text-sm text-gray-500 border border-brand-orange/10">
                  <p className="flex items-center gap-2"><Info size={16} /> Ces liens apparaîtront dans le pied de page du site.</p>
               </div>
               
               <button type="submit" className="w-full mt-8 bg-brand-brown text-white py-3 rounded-lg font-bold hover:bg-brand-orange transition-colors flex items-center justify-center gap-2">
                 <Save size={18} /> Enregistrer les réseaux sociaux
              </button>
            </form>
         </div>
      </div>

    </div>
  );
};

export default AdminSettings;