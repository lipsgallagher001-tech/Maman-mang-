import React from 'react';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Utensils, 
  MessageSquare, 
  LogOut, 
  Settings,
  Image as ImageIcon,
  ChefHat,
  Star
} from 'lucide-react';
import { PageView } from '../../types';

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  pendingOrders: number;
  unreadMessages: number;
  onNavigate: (page: PageView) => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ 
  activeTab, 
  setActiveTab, 
  pendingOrders, 
  unreadMessages, 
  onNavigate 
}) => {
  return (
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
  );
};

export default AdminSidebar;