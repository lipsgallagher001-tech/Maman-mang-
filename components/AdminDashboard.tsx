import React, { useState } from 'react';
import { LogOut } from 'lucide-react';
import { Dish, Order, ContactMessage, PageView, OrderStatus, SiteSettings, SpecialtyItem, Review } from '../types';

// Importation des sous-composants
import AdminSidebar from './admin/AdminSidebar';
import AdminOverview from './admin/AdminOverview';
import AdminOrders from './admin/AdminOrders';
import AdminMenu from './admin/AdminMenu';
import AdminExpertise from './admin/AdminExpertise';
import AdminGallery from './admin/AdminGallery';
import AdminMessages from './admin/AdminMessages';
import AdminReviews from './admin/AdminReviews';
import AdminSettings from './admin/AdminSettings';

interface AdminDashboardProps {
  orders: Order[];
  menuItems: Dish[];
  messages: ContactMessage[];
  reviews: Review[];
  settings: SiteSettings;
  galleryImages: string[];
  specialties: SpecialtyItem[];
  onUpdateOrderStatus: (id: string, status: OrderStatus) => void;
  onDeleteOrder: (id: string) => void;
  onToggleAvailability: (id: string) => void;
  onUpdateSettings: (settings: SiteSettings) => void;
  onUpdateGallery: (images: string[]) => void;
  onAddSpecialty: (specialty: Omit<SpecialtyItem, 'id'>) => void;
  onDeleteSpecialty: (id: string) => void;
  onAddDish: (dish: Dish) => void;
  onDeleteDish: (id: string) => void;
  onMarkMessageAsRead: (id: string) => void;
  onDeleteMessage: (id: string) => void;
  onDeleteReview: (id: string) => void;
  onMarkReviewAsRead: (id: string) => void;
  onNavigate: (page: PageView) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = (props) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'menu' | 'expertise' | 'gallery' | 'messages' | 'reviews' | 'settings'>('overview');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
            onClick={() => props.onNavigate('home')}
            className="mt-4 text-sm text-gray-400 hover:text-brand-brown underline"
          >
            Retour au site
          </button>
        </div>
      </div>
    );
  }

  // Calculs Stats
  const totalRevenue = props.orders.reduce((acc, order) => acc + (order.status !== 'cancelled' ? order.totalPrice : 0), 0);
  const pendingOrders = props.orders.filter(o => o.status === 'pending').length;
  const unreadMessages = props.messages.filter(m => !m.read).length;
  const unreadReviews = props.reviews.filter(r => !r.read).length;

  const averageRating = props.reviews.length > 0
    ? (props.reviews.reduce((acc, r) => acc + r.rating, 0) / props.reviews.length).toFixed(1)
    : 'N/A';

  // Plat populaire
  const dishCounts: Record<string, number> = {};
  props.orders.forEach(order => {
    dishCounts[order.dishName] = (dishCounts[order.dishName] || 0) + order.quantity;
  });
  const popularDish = Object.entries(dishCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Aucun';

  // Helpers
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

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden font-sans">

      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingOrders={pendingOrders}
        unreadMessages={unreadMessages}
        unreadReviews={unreadReviews}
        onNavigate={props.onNavigate}
      />

      <main className="flex-1 overflow-y-auto">
        <header className="bg-white shadow-sm p-6 flex justify-between items-center lg:hidden">
          <h1 className="text-xl font-bold text-brand-brown">Maman Mangé Admin</h1>
          <button onClick={() => props.onNavigate('home')} className="p-2 text-gray-500"><LogOut size={20} /></button>
        </header>

        {/* Mobile Tabs */}
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
          <button onClick={() => setActiveTab('reviews')} className={`relative px-4 py-2 rounded-full whitespace-nowrap ${activeTab === 'reviews' ? 'bg-brand-orange' : 'bg-white/10'}`}>
            Avis
            {unreadReviews > 0 && <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border border-white"></span>}
          </button>
          <button onClick={() => setActiveTab('settings')} className={`px-4 py-2 rounded-full whitespace-nowrap ${activeTab === 'settings' ? 'bg-brand-orange' : 'bg-white/10'}`}>Paramètres</button>
        </div>

        <div className="p-6 md:p-8">
          {activeTab === 'overview' && (
            <AdminOverview
              orders={props.orders}
              messages={props.messages}
              totalRevenue={totalRevenue}
              pendingOrders={pendingOrders}
              unreadMessages={unreadMessages}
              popularDish={popularDish}
              getStatusColor={getStatusColor}
              getStatusLabel={getStatusLabel}
            />
          )}

          {activeTab === 'orders' && (
            <AdminOrders
              orders={props.orders}
              onUpdateOrderStatus={props.onUpdateOrderStatus}
              onDeleteOrder={props.onDeleteOrder}
              formatDate={formatDate}
              getStatusColor={getStatusColor}
              getStatusLabel={getStatusLabel}
            />
          )}

          {activeTab === 'menu' && (
            <AdminMenu
              menuItems={props.menuItems}
              onAddDish={props.onAddDish}
              onDeleteDish={props.onDeleteDish}
              onToggleAvailability={props.onToggleAvailability}
            />
          )}

          {activeTab === 'expertise' && (
            <AdminExpertise
              specialties={props.specialties}
              onAddSpecialty={props.onAddSpecialty}
              onDeleteSpecialty={props.onDeleteSpecialty}
            />
          )}

          {activeTab === 'gallery' && (
            <AdminGallery
              galleryImages={props.galleryImages}
              onUpdateGallery={props.onUpdateGallery}
            />
          )}

          {activeTab === 'messages' && (
            <AdminMessages
              messages={props.messages}
              onMarkMessageAsRead={props.onMarkMessageAsRead}
              onDeleteMessage={props.onDeleteMessage}
              formatDate={formatDate}
            />
          )}

          {activeTab === 'reviews' && (
            <AdminReviews
              reviews={props.reviews}
              onDeleteReview={props.onDeleteReview}
              onMarkReviewAsRead={props.onMarkReviewAsRead}
              averageRating={averageRating}
            />
          )}

          {activeTab === 'settings' && (
            <AdminSettings
              settings={props.settings}
              onUpdateSettings={props.onUpdateSettings}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;