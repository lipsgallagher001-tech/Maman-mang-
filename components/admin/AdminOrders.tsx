import React from 'react';
import { ShoppingBag, Truck, Users, Check, Trash2 } from 'lucide-react';
import { Order, OrderStatus } from '../../types';

interface AdminOrdersProps {
  orders: Order[];
  onUpdateOrderStatus: (id: string, status: OrderStatus) => void;
  onDeleteOrder: (id: string) => void;
  formatDate: (date: Date | string) => string;
  getStatusColor: (status: OrderStatus) => string;
  getStatusLabel: (status: OrderStatus) => string;
}

const AdminOrders: React.FC<AdminOrdersProps> = ({ 
  orders, 
  onUpdateOrderStatus, 
  onDeleteOrder,
  formatDate, 
  getStatusColor, 
  getStatusLabel 
}) => {
  return (
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
                  
                  <div className="text-right flex flex-col items-end">
                    <p className="text-sm text-gray-500">Prix Proposé</p>
                    <p className="text-2xl font-bold text-brand-green mb-2">{order.totalPrice.toLocaleString()} FCFA</p>
                    {/* Bouton de suppression pour les commandes terminées */}
                    {(order.status === 'delivered' || order.status === 'cancelled') && (
                      <button 
                        onClick={() => onDeleteOrder(order.id)}
                        className="text-red-400 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors"
                        title="Supprimer l'historique de cette commande"
                      >
                        <Trash2 size={20} />
                      </button>
                    )}
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
                    onUpdateOrderStatus(order.id, 'cancelled');
                  }} className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-bold ml-auto">Annuler</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminOrders;