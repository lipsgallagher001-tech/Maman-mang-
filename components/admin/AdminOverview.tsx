import React, { useMemo } from 'react';
import { 
  ShoppingBag, 
  TrendingUp, 
  DollarSign, 
  Users
} from 'lucide-react';
import { Order, ContactMessage } from '../../types';

interface AdminOverviewProps {
  orders: Order[];
  messages: ContactMessage[];
  totalRevenue: number;
  pendingOrders: number;
  unreadMessages: number;
  popularDish: string;
  getStatusColor: (status: any) => string;
  getStatusLabel: (status: any) => string;
}

const AdminOverview: React.FC<AdminOverviewProps> = ({
  orders,
  messages,
  totalRevenue,
  pendingOrders,
  unreadMessages,
  popularDish,
  getStatusColor,
  getStatusLabel
}) => {

  // Génération des données du graphique (Mémoïsé)
  const chartData = useMemo(() => {
    const today = new Date();
    const data = [];

    // On génère les 7 derniers jours
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const isToday = i === 0;
      
      let dayRevenue = 0;

      if (isToday) {
         // Calcul RÉEL pour aujourd'hui basé sur les commandes
         dayRevenue = orders
          .filter(o => o.status !== 'cancelled' && new Date(o.date).toDateString() === d.toDateString())
          .reduce((acc, curr) => acc + curr.totalPrice, 0);
      } else {
         // Simulation pour les jours passés (pour l'esthétique)
         // Utilisation d'un algo pseudo-aléatoire stable basé sur la date pour éviter le scintillement
         const seed = d.getDate() + d.getMonth();
         // Valeur entre 10 000 et 40 000
         dayRevenue = 10000 + ((seed * 9999) % 30000); 
      }

      data.push({
        label: d.toLocaleDateString('fr-FR', { weekday: 'short' }),
        value: dayRevenue,
        isReal: isToday // Marqueur pour savoir si c'est une donnée réelle
      });
    }

    return data;
  }, [orders]);

  // --- Composant Graphique SVG Interne ---
  const RevenueChart = () => {
    const height = 200;
    const width = 600;
    const padding = 20;
    
    // On s'assure que maxValue n'est jamais 0 pour éviter la division par zéro
    const maxValue = Math.max(...chartData.map(d => d.value), 5000) * 1.2;
    
    const points = chartData.map((d, i) => {
      const x = (i / (chartData.length - 1)) * (width - 2 * padding) + padding;
      const y = height - ((d.value / maxValue) * (height - 2 * padding)) - padding;
      return `${x},${y}`;
    }).join(' ');

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
          
          {/* Grille */}
          {[0.25, 0.5, 0.75].map((ratio, i) => (
             <line key={i} x1={padding} y1={height - (height * ratio)} x2={width - padding} y2={height - (height * ratio)} stroke="#eee" strokeDasharray="4" />
          ))}
          
          {/* Zone remplie */}
          <polygon points={fillPoints} fill="url(#chartGradient)" />
          
          {/* Ligne */}
          <polyline points={points} fill="none" stroke="#E07A5F" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          
          {/* Points */}
          {chartData.map((d, i) => {
             const x = (i / (chartData.length - 1)) * (width - 2 * padding) + padding;
             const y = height - ((d.value / maxValue) * (height - 2 * padding)) - padding;
             return (
                <g key={i} className="group">
                   {/* Cercle : plus gros et plein si c'est aujourd'hui (donnée réelle) */}
                   <circle 
                    cx={x} 
                    cy={y} 
                    r={d.isReal ? 6 : 4} 
                    fill={d.isReal ? "#E07A5F" : "#F2CC8F"} 
                    stroke="white"
                    strokeWidth="2"
                    className="transition-all duration-300 group-hover:r-8" 
                   />
                   
                   {/* Tooltip */}
                   <g className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                      <rect x={x - 45} y={y - 45} width="90" height="35" rx="4" fill="#3D405B" />
                      <text x={x} y={y - 25} textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
                         {d.value.toLocaleString()}F
                      </text>
                      <text x={x} y={y - 13} textAnchor="middle" fill="#ccc" fontSize="10">
                         {d.isReal ? "(Auj.)" : "(Simulé)"}
                      </text>
                   </g>
                   
                   {/* Label Axe X */}
                   <text x={x} y={height - 2} textAnchor="middle" fill={d.isReal ? "#E07A5F" : "#888"} fontWeight={d.isReal ? "bold" : "normal"} fontSize="12">
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
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-brand-brown mb-6">Aperçu des Performances</h2>
      
      {/* Cartes Statuts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-green-100 text-green-600 rounded-lg"><DollarSign /></div>
            <span className="text-green-600 text-sm font-bold">+12%</span>
          </div>
          <h3 className="text-gray-500 text-sm">Chiffre d'Affaires Global</h3>
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
        <p className="text-xs text-center text-gray-400 mt-2 italic">Le point le plus à droite représente l'activité réelle d'aujourd'hui.</p>
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
  );
};

export default AdminOverview;