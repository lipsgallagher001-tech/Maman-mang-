import React from 'react';
import { MailOpen, Check, Trash2 } from 'lucide-react';
import { ContactMessage } from '../../types';

interface AdminMessagesProps {
  messages: ContactMessage[];
  onMarkMessageAsRead: (id: string) => void;
  onDeleteMessage: (id: string) => void;
  formatDate: (date: Date | string) => string;
}

const AdminMessages: React.FC<AdminMessagesProps> = ({ 
  messages, 
  onMarkMessageAsRead, 
  onDeleteMessage, 
  formatDate 
}) => {
  return (
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
                <div className="flex items-center gap-3">
                   <span className="text-sm text-gray-400">{formatDate(msg.date)}</span>
                   <button 
                      onClick={() => onDeleteMessage(msg.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-1"
                      title="Supprimer le message"
                   >
                      <Trash2 size={16} />
                   </button>
                </div>
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
  );
};

export default AdminMessages;