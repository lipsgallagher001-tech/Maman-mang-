import React from 'react';
import { LayoutDashboard, ShoppingBag, Utensils, MessageSquare, LogOut, Settings, Image, Star, ChefHat } from 'lucide-react';
import { PageView } from '../../types';

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  pendingOrders: number;
  unreadMessages: number;
  unreadReviews: number;
  onNavigate: (page: PageView) => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  setActiveTab,
  pendingOrders,
  unreadMessages,
  unreadReviews,
  onNavigate
}) => {
  const menuItems = [
    { id: 'overview', label: 'Tableau de bord', icon: LayoutDashboard },
    { id: 'orders', label: 'Commandes', icon: ShoppingBag, count: pendingOrders },
    { id: 'menu', label: 'Menu', icon: Utensils },
    { id: 'expertise', label: 'Savoir-Faire', icon: ChefHat },
    { id: 'gallery', label: 'Galerie', icon: Image },
    { id: 'messages', label: 'Messages', icon: MessageSquare, count: unreadMessages },
    { id: 'reviews', label: 'Avis Clients', icon: Star, count: unreadReviews },
    { id: 'settings', label: 'Paramètres', icon: Settings },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-brand-brown text-white h-screen sticky top-0">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-brand-orange">Maman Mangé</h1>
        <p className="text-sm text-gray-400">Administration</p>
      </div>

      <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${activeTab === item.id ? 'bg-brand-orange text-white' : 'text-gray-300 hover:bg-white/10'
              }`}
          >
            <div className="flex items-center gap-3">
              <item.icon size={20} />
              <span>{item.label}</span>
            </div>
            {item.count !== undefined && item.count > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                {item.count}
              </span>
            )}
          </button>
        ))}
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