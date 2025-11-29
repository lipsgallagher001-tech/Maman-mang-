import React from 'react';

interface GalleryProps {
  images: string[];
}

const Gallery: React.FC<GalleryProps> = ({ images }) => {
  return (
    <div className="py-16 bg-brand-brown text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">La Galerie Gourmande</h2>
          <p className="mt-4 text-brand-cream/80">Un avant-goût visuel de ce qui vous attend.</p>
        </div>
        
        {images.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((img, idx) => (
              <div key={idx} className="relative group overflow-hidden rounded-lg aspect-square">
                <img 
                  src={img} 
                  alt={`Galerie ${idx + 1}`} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
              </div>
            ))}
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