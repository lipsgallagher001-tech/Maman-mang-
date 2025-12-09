import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface GalleryProps {
  images: string[];
}

const IMAGES_PER_VIEW = 3;

const Gallery: React.FC<GalleryProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Calculer le nombre maximum d'images visibles
  const visibleImages = images.slice(currentIndex, currentIndex + IMAGES_PER_VIEW);

  // Navigation
  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex + IMAGES_PER_VIEW < images.length;

  const handlePrev = () => {
    if (canGoPrev) {
      setCurrentIndex(prev => Math.max(0, prev - IMAGES_PER_VIEW));
    }
  };

  const handleNext = () => {
    if (canGoNext) {
      setCurrentIndex(prev => Math.min(images.length - IMAGES_PER_VIEW, prev + IMAGES_PER_VIEW));
    }
  };

  return (
    <div className="py-16 bg-brand-brown text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">La Galerie Gourmande</h2>
          <p className="mt-4 text-brand-cream/80">Un avant-goût visuel de ce qui vous attend.</p>
        </div>

        {images.length > 0 ? (
          <div className="relative">
            {/* Grid pour 3 colonnes */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {visibleImages.map((img, idx) => (
                <div key={currentIndex + idx} className="relative group overflow-hidden rounded-lg aspect-square animate-fade-in">
                  <img
                    src={img}
                    alt={`Galerie ${currentIndex + idx + 1}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                </div>
              ))}
            </div>

            {/* Flèches de navigation */}
            {images.length > IMAGES_PER_VIEW && (
              <div className="flex items-center justify-center gap-4 mt-8">
                <button
                  onClick={handlePrev}
                  disabled={!canGoPrev}
                  className={`p-3 rounded-full border-2 transition-all ${canGoPrev
                      ? 'border-brand-orange text-brand-orange hover:bg-brand-orange hover:text-white'
                      : 'border-gray-600 text-gray-600 cursor-not-allowed'
                    }`}
                  aria-label="Photos précédentes"
                >
                  <ChevronLeft size={24} />
                </button>

                <span className="text-brand-cream/80 text-sm font-medium">
                  {Math.floor(currentIndex / IMAGES_PER_VIEW) + 1} / {Math.ceil(images.length / IMAGES_PER_VIEW)}
                </span>

                <button
                  onClick={handleNext}
                  disabled={!canGoNext}
                  className={`p-3 rounded-full border-2 transition-all ${canGoNext
                      ? 'border-brand-orange text-brand-orange hover:bg-brand-orange hover:text-white'
                      : 'border-gray-600 text-gray-600 cursor-not-allowed'
                    }`}
                  aria-label="Photos suivantes"
                >
                  <ChevronRight size={24} />
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center text-brand-cream/50 py-12">
            Aucune photo pour le moment.
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;