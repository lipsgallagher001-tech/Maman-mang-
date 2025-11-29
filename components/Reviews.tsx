import React, { useState } from 'react';
import { Star, MessageCircle, User, Send, ChevronLeft, ChevronRight } from 'lucide-react';
import { Review } from '../types';

interface ReviewsProps {
  reviews: Review[];
  onAddReview: (review: Review) => void;
}

const ITEMS_PER_PAGE = 3;

const Reviews: React.FC<ReviewsProps> = ({ reviews, onAddReview }) => {
  const [formData, setFormData] = useState({
    name: '',
    rating: 5,
    comment: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [startIndex, setStartIndex] = useState(0);

  // Calcul de la note moyenne
  const averageRating = reviews.length > 0
    ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1)
    : '5.0';

  // Tri des avis (du plus récent au plus ancien)
  const sortedReviews = [...reviews].sort((a, b) => b.date.getTime() - a.date.getTime());

  // Pagination
  const visibleReviews = sortedReviews.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const hasNext = startIndex + ITEMS_PER_PAGE < sortedReviews.length;
  const hasPrev = startIndex > 0;

  const handleNext = () => {
    if (hasNext) setStartIndex(prev => prev + ITEMS_PER_PAGE);
  };

  const handlePrev = () => {
    if (hasPrev) setStartIndex(prev => prev - ITEMS_PER_PAGE);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newReview: Review = {
      id: Date.now().toString(),
      author: formData.name,
      rating: formData.rating,
      comment: formData.comment,
      date: new Date()
    };
    onAddReview(newReview);
    setSubmitted(true);
    setFormData({ name: '', rating: 5, comment: '' });
    // Revenir à la première page pour voir son avis
    setStartIndex(0);
    
    setTimeout(() => setSubmitted(false), 5000);
  };

  const renderStars = (rating: number, interactive = false) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && setFormData({ ...formData, rating: star })}
            className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}`}
          >
            <Star 
              size={interactive ? 24 : 16} 
              className={`${star <= rating ? 'fill-brand-orange text-brand-orange' : 'text-gray-300'}`} 
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-brown mb-4">Le Livre d'Or</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
            Découvrez ce que nos clients disent de la cuisine de Maman.
          </p>
          <div className="inline-flex items-center gap-4 bg-brand-cream px-6 py-3 rounded-full shadow-sm">
            <span className="text-4xl font-bold text-brand-brown">{averageRating}</span>
            <div>
              <div className="flex gap-1 mb-1">
                {[1, 2, 3, 4, 5].map(i => (
                  <Star key={i} size={20} className="fill-brand-orange text-brand-orange" />
                ))}
              </div>
              <span className="text-sm text-gray-500">{reviews.length} avis vérifiés</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Reviews List */}
          <div className="lg:col-span-2 flex flex-col justify-between">
            <div className="space-y-6">
              {visibleReviews.length === 0 ? (
                 <div className="p-8 text-center text-gray-500 border border-dashed rounded-xl">
                   Soyez le premier à laisser un avis !
                 </div>
              ) : (
                visibleReviews.map((review) => (
                  <div key={review.id} className="bg-gray-50 p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow animate-fade-in">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-brand-brown/10 rounded-full flex items-center justify-center text-brand-brown font-bold">
                          {review.author.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-bold text-brand-brown">{review.author}</h4>
                          <p className="text-xs text-gray-500">{new Date(review.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      {renderStars(review.rating)}
                    </div>
                    <p className="text-gray-700 leading-relaxed italic">"{review.comment}"</p>
                  </div>
                ))
              )}
            </div>

            {/* Pagination Controls */}
            {reviews.length > ITEMS_PER_PAGE && (
              <div className="flex items-center justify-center gap-4 mt-8 pt-4 border-t border-gray-100">
                <button 
                  onClick={handlePrev}
                  disabled={!hasPrev}
                  className={`p-2 rounded-full border transition-all ${
                    hasPrev 
                      ? 'bg-white border-brand-orange text-brand-orange hover:bg-brand-orange hover:text-white shadow-sm' 
                      : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <ChevronLeft size={24} />
                </button>
                <span className="text-sm text-gray-500 font-medium">
                  {startIndex + 1} - {Math.min(startIndex + ITEMS_PER_PAGE, reviews.length)} sur {reviews.length}
                </span>
                <button 
                  onClick={handleNext}
                  disabled={!hasNext}
                  className={`p-2 rounded-full border transition-all ${
                    hasNext 
                      ? 'bg-white border-brand-orange text-brand-orange hover:bg-brand-orange hover:text-white shadow-sm' 
                      : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <ChevronRight size={24} />
                </button>
              </div>
            )}
          </div>

          {/* Form Section */}
          <div className="lg:col-span-1">
            <div className="bg-brand-brown text-white p-8 rounded-2xl shadow-xl sticky top-24">
              <div className="flex items-center gap-3 mb-6">
                <MessageCircle className="text-brand-orange" size={28} />
                <h3 className="text-2xl font-bold">Laissez un avis</h3>
              </div>
              
              {submitted ? (
                <div className="bg-green-500/20 border border-green-500 text-green-100 p-4 rounded-lg text-center animate-fade-in">
                  <p className="font-bold">Merci !</p>
                  <p className="text-sm">Votre avis a été ajouté avec succès.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-brand-cream/80 mb-2">Votre note</label>
                    <div className="bg-white/10 p-3 rounded-lg inline-block">
                      {renderStars(formData.rating, true)}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-brand-cream/80 mb-2">Votre nom</label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 text-gray-400" size={18} />
                      <input 
                        required
                        type="text" 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:bg-white/20 focus:border-brand-orange transition-all"
                        placeholder="Comment vous appelez-vous ?"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-brand-cream/80 mb-2">Votre commentaire</label>
                    <textarea 
                      required
                      rows={4}
                      value={formData.comment}
                      onChange={(e) => setFormData({...formData, comment: e.target.value})}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:bg-white/20 focus:border-brand-orange transition-all resize-none"
                      placeholder="Qu'avez-vous pensé de notre cuisine ?"
                    ></textarea>
                  </div>

                  <button 
                    type="submit" 
                    className="w-full bg-brand-orange text-white py-3 rounded-lg font-bold hover:bg-white hover:text-brand-brown transition-all duration-300 flex items-center justify-center gap-2 shadow-lg"
                  >
                    Publier mon avis <Send size={18} />
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Reviews;