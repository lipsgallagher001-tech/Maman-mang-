import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Utensils, 
  MessageSquare, 
  LogOut, 
  Check, 
  X, 
  Clock, 
  Truck,
  TrendingUp,
  DollarSign,
  Users,
  Settings,
  Save,
  Image as ImageIcon,
  Trash2,
  PlusCircle
} from 'lucide-react';
import { Dish, Order, ContactMessage, PageView, OrderStatus, SiteSettings } from '../types';

interface AdminDashboardProps {
  orders: Order[];
  menuItems: Dish[];
  messages: ContactMessage[];
  settings: SiteSettings;
  galleryImages: string[];
  onUpdateOrderStatus: (id: string, status: OrderStatus) => void;
  onToggleAvailability: (id: string) => void;
  onUpdateSettings: (settings: SiteSettings) => void;
  onUpdateGallery: (images: string[]) => void;
  onNavigate: (page: PageView) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  orders, 
  menuItems, 
  messages, 
  settings,
  galleryImages,
  onUpdateOrderStatus,
  onToggleAvailability,
  onUpdateSettings,
  onUpdateGallery,
  onNavigate 
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'menu' | 'messages' | 'settings' | 'gallery'>('overview');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [localSettings, setLocalSettings] = useState<SiteSettings>(settings);
  const [newImageUrl, setNewImageUrl] = useState('');

  // Mettre à jour les paramètres locaux si les props changent
  React.useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(localSettings);
    alert('Paramètres mis à jour avec succès !');
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

  // Simuler un login très simple
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-brand-brown flex items-center justify-center p-4">
        <div className="bg-white rounded-xl p-8 w-full max-w-md shadow-2xl text-center">
          <div className="w-20 h-20 bg-brand-orange rounded-full flex items-center justify-center mx-auto mb-6 text-white font-bold text-3xl">M</div>
          <h2 className="text-2xl font-bold text-brand-brown mb-2">Espace Maman Mangé</h2>
          <p className="text-gray-500 mb-8">Veuillez vous connecter pour gérer le restaurant.</p>
          <button 
            onClick={() => setIsLoggedIn(true)}
            className="w-full bg-brand-green text-white py-3 rounded-lg font-bold hover:bg-brand-brown transition-colors"
          >
            Connexion Administrateur
          </button>
          <button 
            onClick={() => onNavigate('home')}
            className="mt-4 text-sm text-gray-400 hover:text-brand-brown underline"
          >
            Retour au site
          </button>
        </div>
      </div>
    );
  }

  // Calculs Stats
  const totalRevenue = orders.reduce((acc, order) => acc + (order.status !== 'cancelled' ? order.totalPrice : 0), 0);
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  
  // Plat populaire
  const dishCounts: Record<string, number> = {};
  orders.forEach(order => {
    dishCounts[order.dishName] = (dishCounts[order.dishName] || 0) + order.quantity;
  });
  const popularDish = Object.entries(dishCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Aucun';

  // Formatage date
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cooking': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'ready': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return 'En Attente';
      case 'cooking': return 'En Cuisine';
      case 'ready': return 'Prêt';
      case 'delivered': return 'Livré';
      case 'cancelled': return 'Annulé';
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden font-sans">
      
      {/* Sidebar */}
      <aside className="w-64 bg-brand-brown text-white hidden md:flex flex-col">
        <div className="p-6 flex items-center gap-3 border-b border-white/10">
          <div className="w-10 h-10 bg-brand-orange rounded-full flex items-center justify-center font-bold text-white">M</div>
          <span className="font-bold text-xl">Admin Panel</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-colors ${activeTab === 'overview' ? 'bg-brand-orange text-white' : 'hover:bg-white/10 text-gray-300'}`}
          >
            <LayoutDashboard size={20} /> Tableau de bord
          </button>
          <button 
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-colors ${activeTab === 'orders' ? 'bg-brand-orange text-white' : 'hover:bg-white/10 text-gray-300'}`}
          >
            <ShoppingBag size={20} /> 
            Commandes
            {pendingOrders > 0 && <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">{pendingOrders}</span>}
          </button>
          <button 
            onClick={() => setActiveTab('menu')}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-colors ${activeTab === 'menu' ? 'bg-brand-orange text-white' : 'hover:bg-white/10 text-gray-300'}`}
          >
            <Utensils size={20} /> Gestion Menu
          </button>
          <button 
            onClick={() => setActiveTab('gallery')}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-colors ${activeTab === 'gallery' ? 'bg-brand-orange text-white' : 'hover:bg-white/10 text-gray-300'}`}
          >
            <ImageIcon size={20} /> Galerie
          </button>
          <button 
            onClick={() => setActiveTab('messages')}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-colors ${activeTab === 'messages' ? 'bg-brand-orange text-white' : 'hover:bg-white/10 text-gray-300'}`}
          >
            <MessageSquare size={20} /> Messages
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-colors ${activeTab === 'settings' ? 'bg-brand-orange text-white' : 'hover:bg-white/10 text-gray-300'}`}
          >
            <Settings size={20} /> Paramètres
          </button>
        </nav>

        <div className="p-4 border-t border-white/10">
          <button 
            onClick={() => onNavigate('home')}
            className="flex items-center gap-3 w-full px-4 py-3 text-red-300 hover:text-red-100 transition-colors"
          >
            <LogOut size={20} /> Déconnexion
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white shadow-sm p-6 flex justify-between items-center md:hidden">
          <h1 className="text-xl font-bold text-brand-brown">Maman Mangé Admin</h1>
          <button onClick={() => onNavigate('home')} className="p-2 text-gray-500"><LogOut size={20} /></button>
        </header>

        {/* Mobile Nav Tabs */}
        <div className="md:hidden flex overflow-x-auto bg-brand-brown text-white p-2 gap-2 sticky top-0 z-20">
          <button onClick={() => setActiveTab('overview')} className={`px-4 py-2 rounded-full whitespace-nowrap ${activeTab === 'overview' ? 'bg-brand-orange' : 'bg-white/10'}`}>Tableau</button>
          <button onClick={() => setActiveTab('orders')} className={`px-4 py-2 rounded-full whitespace-nowrap ${activeTab === 'orders' ? 'bg-brand-orange' : 'bg-white/10'}`}>Commandes</button>
          <button onClick={() => setActiveTab('gallery')} className={`px-4 py-2 rounded-full whitespace-nowrap ${activeTab === 'gallery' ? 'bg-brand-orange' : 'bg-white/10'}`}>Galerie</button>
          <button onClick={() => setActiveTab('settings')} className={`px-4 py-2 rounded-full whitespace-nowrap ${activeTab === 'settings' ? 'bg-brand-orange' : 'bg-white/10'}`}>Paramètres</button>
        </div>

        <div className="p-6 md:p-8">
          
          {/* TAB: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-2xl font-bold text-brand-brown mb-6">Aperçu des Performances</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-green-100 text-green-600 rounded-lg"><DollarSign /></div>
                    <span className="text-green-600 text-sm font-bold">+12%</span>
                  </div>
                  <h3 className="text-gray-500 text-sm">Chiffre d'Affaires</h3>
                  <p className="text-2xl font-bold text-brand-brown">{totalRevenue.toLocaleString()} FCFA</p>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-lg"><ShoppingBag /></div>
                  </div>
                  <h3 className="text-gray-500 text-sm">Commandes Totales</h3>
                  <p className="text-2xl font-bold text-brand-brown">{orders.length}</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-purple-100 text-purple-600 rounded-lg"><TrendingUp /></div>
                  </div>
                  <h3 className="text-gray-500 text-sm">Plat Populaire</h3>
                  <p className="text-xl font-bold text-brand-brown truncate">{popularDish}</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-orange-100 text-orange-600 rounded-lg"><Users /></div>
                  </div>
                  <h3 className="text-gray-500 text-sm">Messages</h3>
                  <p className="text-2xl font-bold text-brand-brown">{messages.length}</p>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <h3 className="font-bold text-brand-brown mb-4">Dernières Commandes</h3>
                  {orders.length === 0 ? (
                    <p className="text-gray-400 text-sm">Aucune commande pour le moment.</p>
                  ) : (
                    <div className="space-y-4">
                      {orders.slice(0, 5).map(order => (
                        <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-brand-cream flex items-center justify-center text-brand-brown font-bold text-xs">
                              {order.customerName.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-sm text-brand-brown">{order.customerName}</p>
                              <p className="text-xs text-gray-500">{order.dishName} x{order.quantity}</p>
                            </div>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs font-bold ${getStatusColor(order.status)}`}>
                            {getStatusLabel(order.status)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB: ORDERS */}
          {activeTab === 'orders' && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-bold text-brand-brown mb-6">Gestion des Commandes</h2>
              
              <div className="space-y-4">
                {orders.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-xl">
                    <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">En attente de la première commande...</p>
                  </div>
                ) : (
                  orders.sort((a,b) => b.date.getTime() - a.date.getTime()).map((order) => (
                    <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row">
                      <div className={`w-full md:w-2 bg-${order.status === 'pending' ? 'yellow' : order.status === 'delivered' ? 'green' : 'gray'}-500`}></div>
                      
                      <div className="p-6 flex-1">
                        <div className="flex flex-col md:flex-row justify-between md:items-start gap-4 mb-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-bold text-lg text-brand-brown">#{order.id.slice(-4)}</span>
                              <span className="text-sm text-gray-400">• {formatDate(order.date)}</span>
                              <span className={`px-2 py-0.5 rounded text-xs font-bold ml-2 ${getStatusColor(order.status)}`}>
                                {getStatusLabel(order.status)}
                              </span>
                            </div>
                            <h3 className="font-bold text-xl">{order.dishName} <span className="text-brand-orange">x{order.quantity}</span></h3>
                            <p className="text-gray-600 text-sm mt-1 flex items-center gap-1">
                              {order.deliveryMode === 'delivery' ? <Truck size={14} /> : <ShoppingBag size={14} />}
                              {order.deliveryMode === 'delivery' ? 'Livraison à domicile' : 'À emporter'}
                            </p>
                          </div>
                          
                          <div className="text-right">
                            <p className="text-sm text-gray-500">Prix Proposé</p>
                            <p className="text-2xl font-bold text-brand-green">{order.totalPrice.toLocaleString()} FCFA</p>
                          </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg mb-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500 mb-1">Client</p>
                            <p className="font-medium flex items-center gap-2"><Users size={14} /> {order.customerName}</p>
                            <p className="font-medium text-brand-orange flex items-center gap-2 mt-1"><Clock size={14} /> {order.customerPhone}</p>
                          </div>
                          {order.deliveryMode === 'delivery' && (
                            <div>
                              <p className="text-gray-500 mb-1">Adresse</p>
                              <p className="font-medium">{order.customerAddress}</p>
                            </div>
                          )}
                          {order.notes && (
                            <div className="col-span-full border-t border-gray-200 pt-2 mt-2">
                              <p className="text-gray-500 mb-1">Note du client</p>
                              <p className="italic text-gray-700">"{order.notes}"</p>
                            </div>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-3 pt-2 border-t border-gray-100">
                          {order.status === 'pending' && (
                            <>
                              <button 
                                onClick={() => onUpdateOrderStatus(order.id, 'cooking')}
                                className="flex-1 bg-brand-green text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                              >
                                <Check size={18} /> Accepter & Cuisiner
                              </button>
                              <button 
                                onClick={() => onUpdateOrderStatus(order.id, 'cancelled')}
                                className="flex-1 bg-red-100 text-red-600 py-2 px-4 rounded-lg font-medium hover:bg-red-200 transition-colors flex items-center justify-center gap-2"
                              >
                                <X size={18} /> Refuser
                              </button>
                            </>
                          )}
                          {order.status === 'cooking' && (
                            <button 
                              onClick={() => onUpdateOrderStatus(order.id, 'ready')}
                              className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-600 transition-colors"
                            >
                              Marquer comme Prêt
                            </button>
                          )}
                          {order.status === 'ready' && (
                            <button 
                              onClick={() => onUpdateOrderStatus(order.id, 'delivered')}
                              className="flex-1 bg-brand-brown text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-800 transition-colors"
                            >
                              Marquer comme Livré/Terminé
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB: MENU */}
          {activeTab === 'menu' && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-bold text-brand-brown mb-6">Disponibilité du Menu</h2>
              <p className="text-gray-500 mb-8">Activez ou désactivez les plats selon ce qui reste en cuisine.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {menuItems.map((item) => (
                  <div key={item.id} className={`bg-white rounded-xl shadow-sm border-2 overflow-hidden transition-all ${item.available ? 'border-transparent' : 'border-gray-200 opacity-75 grayscale'}`}>
                    <div className="h-40 relative">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      <div className="absolute top-2 right-2">
                        <button 
                          onClick={() => onToggleAvailability(item.id)}
                          className={`px-4 py-1.5 rounded-full text-sm font-bold shadow-md transition-colors ${item.available ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}
                        >
                          {item.available ? 'DISPONIBLE' : 'ÉPUISÉ'}
                        </button>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-lg text-brand-brown">{item.name}</h3>
                      <p className="text-brand-orange font-bold">{item.price} FCFA</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

           {/* TAB: GALERIE */}
           {activeTab === 'gallery' && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-bold text-brand-brown mb-6">Gestion de la Galerie</h2>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
                <h3 className="text-lg font-bold text-brand-orange mb-4">Ajouter une image</h3>
                <form onSubmit={handleAddImage} className="flex gap-4">
                  <input 
                    type="text" 
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="URL de l'image (https://...)"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:outline-none"
                  />
                  <button 
                    type="submit"
                    className="bg-brand-green text-white px-6 py-2 rounded-lg font-bold hover:bg-brand-brown transition-colors flex items-center gap-2"
                  >
                    <PlusCircle size={20} /> Ajouter
                  </button>
                </form>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {galleryImages.map((img, idx) => (
                  <div key={idx} className="relative group rounded-lg overflow-hidden aspect-square border-2 border-transparent hover:border-red-400">
                    <img src={img} alt={`Galerie ${idx}`} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button 
                        onClick={() => handleRemoveImage(idx)}
                        className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                        title="Supprimer l'image"
                      >
                        <Trash2 size={24} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: MESSAGES */}
          {activeTab === 'messages' && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-bold text-brand-brown mb-6">Messages Reçus</h2>
              
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 divide-y divide-gray-100">
                {messages.length === 0 ? (
                  <div className="p-12 text-center text-gray-500">Aucun message pour le moment.</div>
                ) : (
                  messages.map((msg) => (
                    <div key={msg.id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-brand-brown">{msg.name}</h3>
                        <span className="text-xs text-gray-400">{new Date(msg.date).toLocaleDateString()}</span>
                      </div>
                      <p className="text-sm text-brand-orange mb-2">{msg.phone}</p>
                      <p className="text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100">"{msg.message}"</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-bold text-brand-brown mb-6">Informations du Restaurant</h2>
              
              <form onSubmit={handleSaveSettings} className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 space-y-6 max-w-2xl">
                
                <div>
                  <h3 className="text-lg font-bold text-brand-orange mb-4 border-b pb-2">Coordonnées</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Numéro de Téléphone</label>
                      <input 
                        type="text" 
                        value={localSettings.phoneNumber}
                        onChange={(e) => setLocalSettings({...localSettings, phoneNumber: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                      <input 
                        type="text" 
                        value={localSettings.address}
                        onChange={(e) => setLocalSettings({...localSettings, address: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-brand-orange mb-4 border-b pb-2">Horaires d'Ouverture</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Semaine (Lun-Sam)</label>
                      <input 
                        type="text" 
                        value={localSettings.openingHoursWeek}
                        onChange={(e) => setLocalSettings({...localSettings, openingHoursWeek: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Dimanche</label>
                      <input 
                        type="text" 
                        value={localSettings.openingHoursSunday}
                        onChange={(e) => setLocalSettings({...localSettings, openingHoursSunday: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-brand-orange mb-4 border-b pb-2">Réseaux Sociaux</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Lien Facebook</label>
                      <input 
                        type="text" 
                        value={localSettings.socialLinks.facebook}
                        onChange={(e) => setLocalSettings({
                          ...localSettings, 
                          socialLinks: {...localSettings.socialLinks, facebook: e.target.value}
                        })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:outline-none"
                        placeholder="https://facebook.com/..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Lien Instagram</label>
                      <input 
                        type="text" 
                        value={localSettings.socialLinks.instagram}
                        onChange={(e) => setLocalSettings({
                          ...localSettings, 
                          socialLinks: {...localSettings.socialLinks, instagram: e.target.value}
                        })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:outline-none"
                        placeholder="https://instagram.com/..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Lien Twitter / X</label>
                      <input 
                        type="text" 
                        value={localSettings.socialLinks.twitter}
                        onChange={(e) => setLocalSettings({
                          ...localSettings, 
                          socialLinks: {...localSettings.socialLinks, twitter: e.target.value}
                        })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:outline-none"
                        placeholder="https://twitter.com/..."
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <button 
                    type="submit" 
                    className="w-full bg-brand-green text-white py-3 rounded-lg font-bold hover:bg-brand-brown transition-colors flex items-center justify-center gap-2"
                  >
                    <Save size={20} /> Enregistrer les modifications
                  </button>
                </div>

              </form>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;