import React from 'react';
import { Star, MessageSquare, Trash2 } from 'lucide-react';
import { Review } from '../../types';

interface AdminReviewsProps {
   reviews: Review[];
   onDeleteReview: (id: string) => void;
   onMarkReviewAsRead: (id: string) => void;
   averageRating: string;
}

const AdminReviews: React.FC<AdminReviewsProps> = ({ reviews, onDeleteReview, onMarkReviewAsRead, averageRating }) => {
   return (
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
               [...reviews].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((review) => (
                  <div key={review.id} className={`bg-white p-6 rounded-xl shadow-sm border ${review.read ? 'border-gray-200' : 'border-brand-orange ring-1 ring-brand-orange'}`}>
                     <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 bg-brand-brown text-white rounded-full flex items-center justify-center font-bold">
                              {review.author.charAt(0)}
                           </div>
                           <div>
                              <p className="font-bold text-brand-brown flex items-center gap-2">
                                 {review.author}
                                 {!review.read && <span className="bg-brand-orange text-white text-xs px-2 py-0.5 rounded-full">Nouveau</span>}
                              </p>
                              <p className="text-xs text-gray-400">{new Date(review.date).toLocaleDateString()}</p>
                           </div>
                        </div>
                        <div className="flex gap-1">
                           {[1, 2, 3, 4, 5].map(star => (
                              <Star key={star} size={16} className={`${star <= review.rating ? 'fill-brand-orange text-brand-orange' : 'text-gray-300'}`} />
                           ))}
                        </div>
                     </div>
                     <p className="text-gray-700 italic bg-gray-50 p-3 rounded-lg mb-4">"{review.comment}"</p>
                     <div className="flex justify-end gap-2">
                        {!review.read && (
                           <button
                              type="button"
                              onClick={() => onMarkReviewAsRead(review.id)}
                              className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all font-bold text-sm"
                           >
                              Marquer comme lu
                           </button>
                        )}
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
   );
};

export default AdminReviews;