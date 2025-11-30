import React, { useState, useMemo } from 'react';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Utensils, 
  MessageSquare, 
  LogOut, 
  Check, 
  X, 
  TrendingUp,
  DollarSign,
  Users,
  Settings,
  Save,
  Image as ImageIcon,
  Trash2,
  PlusCircle,
  Upload,
  MailOpen,
  ChefHat,
  Info,
  Star,
  Truck
} from 'lucide-react';
import { Dish, Order, ContactMessage, PageView, OrderStatus, SiteSettings, SpecialtyItem, Review } from '../types';

interface AdminDashboardProps {
  orders: Order[];
  menuItems: Dish[];
  messages: ContactMessage[];
  reviews: Review[];
  settings: SiteSettings;
  galleryImages: string[];
  specialties: SpecialtyItem[];
  onUpdateOrderStatus: (id: string, status: OrderStatus) => void;
  onToggleAvailability: (id: string) => void;
  onUpdateSettings: (settings: SiteSettings) => void;
  onUpdateGallery: (images: string[]) => void;
  onUpdateSpecialties: (specialties: SpecialtyItem[]) => void;
  onAddDish: (dish: Dish) => void;
  onDeleteDish: (id: string) => void;
  onMarkMessageAsRead: (id: string) => void;
  onDeleteReview: (id: string) => void;
  onNavigate: (page: PageView) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  orders, 
  menuItems, 
  messages, 
  reviews,
  settings,
  galleryImages,
  specialties,
  onUpdateOrderStatus,
  onToggleAvailability,
  onUpdateSettings,
  onUpdateGallery,
  onUpdateSpecialties,
  onAddDish,
  onDeleteDish,
  onMarkMessageAsRead,
  onDeleteReview,
  onNavigate 
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'menu' | 'expertise' | 'gallery' | 'messages' | 'reviews' | 'settings'>('overview');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [localSettings, setLocalSettings] = useState<SiteSettings>(settings);
  const [newImageUrl, setNewImageUrl] = useState('');
  
  // State pour le nouveau plat
  const [showAddDishForm, setShowAddDishForm] = useState(false);
  const [newDish, setNewDish] = useState({
    name: '',
    description: '',
    image: '',
    category: 'plat' as const
  });

  // State pour nouvelle spécialité
  const [newSpecialty, setNewSpecialty] = useState({
    name: '',
    description: '',
    image: ''
  });

  // Mettre à jour les paramètres locaux si les props changent
  React.useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  // Génération des données du graphique (Mémoïsé pour éviter les re-calculs inutiles)
  const chartData = useMemo(() => {
    // Calcul du CA d'aujourd'hui réel
    const todayRevenue = orders
      .filter(o => o.status !== 'cancelled' && new Date(o.date).toDateString() === new Date().toDateString())
      .reduce((acc, curr) => acc + curr.totalPrice, 0);

    // Génération de 6 jours de fausses données historiques pour l'exemple
    const data = [];
    for (let i = 6; i > 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      // Valeur aléatoire entre 15000 et 45000 pour simuler une activité
      const simulatedValue = Math.floor(Math.random() * 30000) + 15000;
      data.push({
        label: d.toLocaleDateString('fr-FR', { weekday: 'short' }),
        value: simulatedValue
      });
    }

    // Ajout d'aujourd'hui
    data.push({
      label: new Date().toLocaleDateString('fr-FR', { weekday: 'short' }),
      value: todayRevenue > 0 ? todayRevenue : 20000 // Valeur par défaut pour ne pas avoir un graphique vide
    });

    return data;
  }, [orders]);

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

  const handleSubmitDish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDish.name) return;

    const dish: Dish = {
      id: Date.now().toString(),
      name: newDish.name,
      description: newDish.description,
      price: 0, // Prix par défaut à 0 car défini par le client
      image: newDish.image || 'https://picsum.photos/seed/new/400/300', // Image par défaut si vide
      category: newDish.category,
      available: true
    };

    onAddDish(dish);
    setNewDish({ name: '', description: '', image: '', category: 'plat' });
    setShowAddDishForm(false);
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

  // Calculs Stats et Notifications
  const totalRevenue = orders.reduce((acc, order) => acc + (order.status !== 'cancelled' ? order.totalPrice : 0), 0);
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const unreadMessages = messages.filter(m => !m.read).length;
  
  // Stats Avis
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) 
    : 'N/A';
  
  // Plat populaire
  const dishCounts: Record<string, number> = {};
  orders.forEach(order => {
    dishCounts[order.dishName] = (dishCounts[order.dishName] || 0) + order.quantity;
  });
  const popularDish = Object.entries(dishCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Aucun';

  // Formatage date sécurisé
  const formatDate = (date: Date | string) => {
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

  // --- Composant Graphique SVG ---
  const RevenueChart = () => {
    const height = 200;
    const width = 600;
    const padding = 20;
    
    const maxValue = Math.max(...chartData.map(d => d.value)) * 1.2; // +20% marge
    
    // Points pour la ligne
    const points = chartData.map((d, i) => {
      const x = (i / (chartData.length - 1)) * (width - 2 * padding) + padding;
      const y = height - ((d.value / maxValue) * (height - 2 * padding)) - padding;
      return `${x},${y}`;
    }).join(' ');

    // Points pour le polygone de remplissage (gradient)
    const fillPoints = `
      ${padding},${height - padding} 
      ${points} 
      ${width - padding},${height - padding}
    `;

    return (
      <div className="w-full overflow-hidden">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#E07A5F" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#E07A5F" stopOpacity="0" />
            </linearGradient>
          </defs>
          
          {/* Grille horizontale (3 lignes) */}
          {[0.25, 0.5, 0.75].map((ratio, i) => (
             <line 
                key={i}
                x1={padding} 
                y1={height - (height * ratio)} 
                x2={width - padding} 
                y2={height - (height * ratio)} 
                stroke="#eee" 
                strokeDasharray="4"
             />
          ))}

          {/* Zone remplie */}
          <polygon points={fillPoints} fill="url(#chartGradient)" />
          
          {/* Ligne principale */}
          <polyline 
            points={points} 
            fill="none" 
            stroke="#E07A5F" 
            strokeWidth="3" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
          
          {/* Points et Labels */}
          {chartData.map((d, i) => {
             const x = (i / (chartData.length - 1)) * (width - 2 * padding) + padding;
             const y = height - ((d.value / maxValue) * (height - 2 * padding)) - padding;
             return (
                <g key={i} className="group">
                   <circle cx={x} cy={y} r="4" fill="#E07A5F" className="transition-all duration-300 group-hover:r-6" />
                   {/* Tooltip au survol (CSS pur via group-hover) */}
                   <g className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                      <rect x={x - 40} y={y - 35} width="80" height="25" rx="4" fill="#3D405B" />
                      <text x={x} y={y - 18} textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
                         {d.value.toLocaleString()}F
                      </text>
                   </g>
                   {/* Label Axe X */}
                   <text x={x} y={height - 2} textAnchor="middle" fill="#888" fontSize="12">
                      {d.label}
                   </text>
                </g>
             );
          })}
        </svg>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden font-sans">
      
      {/* Sidebar */}
      <aside className="w-64 bg-brand-brown text-white hidden lg:flex flex-col">
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
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-colors relative ${activeTab === 'orders' ? 'bg-brand-orange text-white' : 'hover:bg-white/10 text-gray-300'}`}
          >
            <div className="relative">
              <ShoppingBag size={20} />
              {pendingOrders > 0 && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-brand-brown animate-pulse"></span>}
            </div>
             Commandes
            {pendingOrders > 0 && (
              <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold animate-pulse">
                {pendingOrders}
              </span>
            )}
          </button>
          <button 
            onClick={() => setActiveTab('menu')}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-colors ${activeTab === 'menu' ? 'bg-brand-orange text-white' : 'hover:bg-white/10 text-gray-300'}`}
          >
            <Utensils size={20} /> Gestion Menu
          </button>
          <button 
            onClick={() => setActiveTab('expertise')}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-colors ${activeTab === 'expertise' ? 'bg-brand-orange text-white' : 'hover:bg-white/10 text-gray-300'}`}
          >
            <ChefHat size={20} /> Savoir-Faire
          </button>
          <button 
            onClick={() => setActiveTab('gallery')}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-colors ${activeTab === 'gallery' ? 'bg-brand-orange text-white' : 'hover:bg-white/10 text-gray-300'}`}
          >
            <ImageIcon size={20} /> Galerie
          </button>
          <button 
            onClick={() => setActiveTab('messages')}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-colors relative ${activeTab === 'messages' ? 'bg-brand-orange text-white' : 'hover:bg-white/10 text-gray-300'}`}
          >
            <div className="relative">
              <MessageSquare size={20} />
              {unreadMessages > 0 && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-brand-brown"></span>}
            </div>
            Messages
            {unreadMessages > 0 && <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">{unreadMessages}</span>}
          </button>
          <button 
            onClick={() => setActiveTab('reviews')}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-colors ${activeTab === 'reviews' ? 'bg-brand-orange text-white' : 'hover:bg-white/10 text-gray-300'}`}
          >
            <Star size={20} /> Avis Clients
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
        <header className="bg-white shadow-sm p-6 flex justify-between items-center lg:hidden">
          <h1 className="text-xl font-bold text-brand-brown">Maman Mangé Admin</h1>
          <button onClick={() => onNavigate('home')} className="p-2 text-gray-500"><LogOut size={20} /></button>
        </header>

        {/* Mobile Nav Tabs */}
        <div className="lg:hidden flex overflow-x-auto bg-brand-brown text-white p-2 gap-2 sticky top-0 z-20">
          <button onClick={() => setActiveTab('overview')} className={`px-4 py-2 rounded-full whitespace-nowrap ${activeTab === 'overview' ? 'bg-brand-orange' : 'bg-white/10'}`}>Tableau</button>
          <button onClick={() => setActiveTab('orders')} className={`relative px-4 py-2 rounded-full whitespace-nowrap ${activeTab === 'orders' ? 'bg-brand-orange' : 'bg-white/10'}`}>
            Commandes
            {pendingOrders > 0 && <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border border-white animate-pulse"></span>}
          </button>
          <button onClick={() => setActiveTab('menu')} className={`px-4 py-2 rounded-full whitespace-nowrap ${activeTab === 'menu' ? 'bg-brand-orange' : 'bg-white/10'}`}>Menu</button>
          <button onClick={() => setActiveTab('expertise')} className={`px-4 py-2 rounded-full whitespace-nowrap ${activeTab === 'expertise' ? 'bg-brand-orange' : 'bg-white/10'}`}>Savoir-Faire</button>
          <button onClick={() => setActiveTab('gallery')} className={`px-4 py-2 rounded-full whitespace-nowrap ${activeTab === 'gallery' ? 'bg-brand-orange' : 'bg-white/10'}`}>Galerie</button>
          <button onClick={() => setActiveTab('messages')} className={`relative px-4 py-2 rounded-full whitespace-nowrap ${activeTab === 'messages' ? 'bg-brand-orange' : 'bg-white/10'}`}>
            Messages
            {unreadMessages > 0 && <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border border-white"></span>}
          </button>
          <button onClick={() => setActiveTab('reviews')} className={`px-4 py-2 rounded-full whitespace-nowrap ${activeTab === 'reviews' ? 'bg-brand-orange' : 'bg-white/10'}`}>Avis</button>
          <button onClick={() => setActiveTab('settings')} className={`px-4 py-2 rounded-full whitespace-nowrap ${activeTab === 'settings' ? 'bg-brand-orange' : 'bg-white/10'}`}>Paramètres</button>
        </div>

        <div className="p-6 md:p-8">
          
          {/* TAB: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-2xl font-bold text-brand-brown mb-6">Aperçu des Performances</h2>
              
              {/* Cartes Statuts */}
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
                    {pendingOrders > 0 && <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold animate-pulse">{pendingOrders}</span>}
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

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-orange-100 text-orange-600 rounded-lg"><Users /></div>
                    {unreadMessages > 0 && <span className="text-red-500 text-xs font-bold bg-red-100 px-2 py-1 rounded-full">{unreadMessages} nouveaux</span>}
                  </div>
                  <h3 className="text-gray-500 text-sm">Messages</h3>
                  <p className="text-2xl font-bold text-brand-brown">{messages.length}</p>
                </div>
              </div>

              {/* Section Graphique */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-brand-brown flex items-center gap-2">
                    <TrendingUp size={20} className="text-brand-orange" />
                    Évolution du Chiffre d'Affaires
                  </h3>
                  <div className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded border">7 derniers jours</div>
                </div>
                <div className="w-full aspect-[2/1] md:aspect-[3/1] lg:aspect-[4/1] max-h-64">
                   <RevenueChart />
                </div>
              </div>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <h3 className="font-bold text-brand-brown mb-4">Dernières Commandes</h3>
                  {orders.length === 0 ? (
                    <p className="text-gray-400 text-sm">Aucune commande pour le moment.
                    </p>
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
                  [...orders].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((order) => (
                    <div key={order.id} className={`bg-white rounded-xl shadow-sm border overflow-hidden flex flex-col md:flex-row transition-all ${order.status === 'pending' ? 'border-red-400 shadow-md ring-2 ring-red-100' : 'border-gray-100'}`}>
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
                              {order.status === 'pending' && (
                                <span className="ml-2 bg-red-500 text-white text-[10px] uppercase font-bold px-2 py-1 rounded animate-pulse">
                                  Nouveau
                                </span>
                              )}
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
                            <p className="font-medium text-brand-brown flex items-center gap-2"><Users size={14}/> {order.customerName}</p>
                            <p className="text-gray-600 ml-6">{order.customerPhone}</p>
                          </div>
                          {order.customerAddress && (
                            <div>
                              <p className="text-gray-500 mb-1">Adresse</p>
                              <p className="font-medium text-brand-brown">{order.customerAddress}</p>
                            </div>
                          )}
                          {order.notes && (
                            <div className="col-span-full border-t pt-2 mt-2">
                              <p className="text-gray-500 mb-1 text-xs">Note du client</p>
                              <p className="text-gray-700 italic">"{order.notes}"</p>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <button onClick={() => onUpdateOrderStatus(order.id, 'cooking')} className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-bold">En Cuisine</button>
                          <button onClick={() => onUpdateOrderStatus(order.id, 'ready')} className="px-4 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors text-sm font-bold">Prêt</button>
                          <button onClick={() => onUpdateOrderStatus(order.id, 'delivered')} className="px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors text-sm font-bold flex items-center gap-1"><Check size={16}/> Livré</button>
                          <button onClick={() => {
                            if (window.confirm('Annuler cette commande ?')) onUpdateOrderStatus(order.id, 'cancelled');
                          }} className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-bold ml-auto">Annuler</button>
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

              {/* Formulaire Ajout Plat */}
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
          )}

          {/* TAB: EXPERTISE (SAVOIR-FAIRE) */}
          {activeTab === 'expertise' && (
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
          )}

          {/* TAB: GALLERY */}
          {activeTab === 'gallery' && (
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
          )}

          {/* TAB: MESSAGES */}
          {activeTab === 'messages' && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-bold text-brand-brown mb-6">Messages Reçus</h2>
              <div className="space-y-4">
                {messages.length === 0 ? (
                  <p className="text-gray-500 italic">Aucun message pour le moment.</p>
                ) : (
                  messages.map((msg) => (
                    <div key={msg.id} className={`bg-white p-6 rounded-xl shadow-sm border transition-all ${!msg.read ? 'border-l-4 border-l-brand-orange ring-1 ring-orange-100 bg-orange-50/10' : 'border-gray-200'}`}>
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                           <h3 className="font-bold text-brand-brown">{msg.name}</h3>
                           {!msg.read && <span className="bg-red-500 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded">Nouveau</span>}
                        </div>
                        <span className="text-sm text-gray-400">{formatDate(msg.date)}</span>
                      </div>
                      <div className="text-sm text-gray-500 mb-2 flex flex-col sm:flex-row sm:gap-4">
                         <span><span className="font-medium text-gray-700">Tél:</span> {msg.phone}</span>
                      </div>
                      <p className="text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100 mb-3">{msg.message}</p>
                      
                      {!msg.read ? (
                        <button 
                          onClick={() => onMarkMessageAsRead(msg.id)}
                          className="text-sm text-brand-orange hover:text-brand-brown font-medium flex items-center gap-1"
                        >
                          <MailOpen size={16} /> Marquer comme lu
                        </button>
                      ) : (
                        <span className="text-xs text-green-600 flex items-center gap-1 font-medium"><Check size={14} /> Lu</span>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB: REVIEWS (AVIS) */}
          {activeTab === 'reviews' && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-bold text-brand-brown mb-6">Avis Clients</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                 <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4">
                    <div className="p-4 bg-yellow-100 text-yellow-600 rounded-full">
                       <Star size={32} className="fill-yellow-600" />
                    </div>
                    <div>
                       <p className="text-gray-500 text-sm">Note Moyenne</p>
                       <p className="text-3xl font-bold text-brand-brown">{averageRating} <span className="text-sm text-gray-400 font-normal">/ 5</span></p>
                    </div>
                 </div>
                 <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4">
                    <div className="p-4 bg-blue-100 text-blue-600 rounded-full">
                       <MessageSquare size={32} />
                    </div>
                    <div>
                       <p className="text-gray-500 text-sm">Total Avis</p>
                       <p className="text-3xl font-bold text-brand-brown">{reviews.length}</p>
                    </div>
                 </div>
              </div>

              <div className="space-y-4">
                 {reviews.length === 0 ? (
                    <p className="text-gray-500">Aucun avis pour le moment.</p>
                 ) : (
                    // Utilisation de [...reviews] pour créer une copie avant le tri, afin d'éviter la mutation directe des props
                    [...reviews].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((review) => (
                       <div key={review.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                          <div className="flex justify-between items-start mb-3">
                             <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-brand-brown text-white rounded-full flex items-center justify-center font-bold">
                                   {review.author.charAt(0)}
                                </div>
                                <div>
                                   <p className="font-bold text-brand-brown">{review.author}</p>
                                   <p className="text-xs text-gray-400">{new Date(review.date).toLocaleDateString()}</p>
                                </div>
                             </div>
                             <div className="flex gap-1">
                                {[1,2,3,4,5].map(star => (
                                   <Star key={star} size={16} className={`${star <= review.rating ? 'fill-brand-orange text-brand-orange' : 'text-gray-300'}`} />
                                ))}
                             </div>
                          </div>
                          <p className="text-gray-700 italic bg-gray-50 p-3 rounded-lg mb-4">"{review.comment}"</p>
                          <div className="flex justify-end">
                             <button 
                                type="button"
                                onClick={() => onDeleteReview(review.id)}
                                className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all font-bold text-sm"
                             >
                                <Trash2 size={16} /> Supprimer cet avis
                             </button>
                          </div>
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
                       
                       {/* Bouton doublé ici pour ergonomie */}
                       <button type="submit" className="w-full mt-8 bg-brand-brown text-white py-3 rounded-lg font-bold hover:bg-brand-orange transition-colors flex items-center justify-center gap-2">
                         <Save size={18} /> Enregistrer les réseaux sociaux
                      </button>
                    </form>
                 </div>
              </div>

            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;