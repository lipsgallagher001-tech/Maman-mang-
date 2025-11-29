import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import { ContactMessage, SiteSettings } from '../types';

interface ContactProps {
  onSendMessage: (msg: ContactMessage) => void;
  settings?: SiteSettings;
}

const Contact: React.FC<ContactProps> = ({ onSendMessage, settings }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  // Valeurs par défaut si settings n'est pas fourni (fallback)
  const phone = settings?.phoneNumber || "+228 90 00 00 00";
  const address = settings?.address || "Quartier du Bonheur, Rue de la Paix, Lomé";
  const hoursWeek = settings?.openingHoursWeek || "Lundi - Samedi : 11h00 - 22h00";
  const hoursSunday = settings?.openingHoursSunday || "Dimanche : 12h00 - 20h00";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newMessage: ContactMessage = {
      id: Date.now().toString(),
      name: formData.name,
      phone: formData.phone,
      message: formData.message,
      date: new Date(),
      read: false
    };
    onSendMessage(newMessage);
    setSubmitted(true);
    setFormData({ name: '', phone: '', message: '' });
    
    // Reset message success après 5 secondes
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="py-16 bg-brand-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Info Section */}
          <div>
            <h2 className="text-3xl font-bold text-brand-brown mb-6">Contactez-nous</h2>
            <p className="text-gray-600 mb-8">
              Une question ? Une grosse commande ? N'hésitez pas à nous appeler ou à passer nous voir. Maman est toujours contente de voir de nouveaux visages.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-brand-orange/10 text-brand-orange rounded-lg">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-brand-brown">Notre Adresse</h4>
                  <p className="text-gray-600">{address}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-brand-orange/10 text-brand-orange rounded-lg">
                  <Phone size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-brand-brown">Téléphone & WhatsApp</h4>
                  <p className="text-gray-600">{phone}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-brand-orange/10 text-brand-orange rounded-lg">
                  <Clock size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-brand-brown">Horaires d'ouverture</h4>
                  <p className="text-gray-600">{hoursWeek}</p>
                  <p className="text-gray-600">{hoursSunday}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="bg-white p-8 rounded-2xl shadow-lg relative overflow-hidden">
            {submitted && (
              <div className="absolute inset-0 bg-white/95 flex items-center justify-center z-10 animate-fade-in">
                <div className="text-center p-6">
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-brand-brown">Message Envoyé !</h3>
                  <p className="text-gray-500 mt-2">Maman vous répondra très vite.</p>
                </div>
              </div>
            )}
            
            <h3 className="text-xl font-bold text-brand-brown mb-6">Envoyez-nous un message</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                  <input 
                    required
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none" 
                    placeholder="Votre nom" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                  <input 
                    required
                    type="tel" 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none" 
                    placeholder="Votre numéro" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea 
                  required
                  rows={4} 
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none" 
                  placeholder="Comment pouvons-nous vous aider ?"
                ></textarea>
              </div>
              <button 
                type="submit" 
                className="w-full bg-brand-brown text-white py-3 rounded-lg font-bold hover:bg-brand-green transition-colors flex items-center justify-center gap-2"
              >
                Envoyer le message <Send size={18} />
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Contact;