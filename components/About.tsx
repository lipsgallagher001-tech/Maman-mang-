import React from 'react';

interface AboutProps {
  image?: string;
}

const About: React.FC<AboutProps> = ({ image }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-brand-cream">
      <div className="flex flex-col md:flex-col lg:flex-row items-center gap-12">
        <div className="lg:w-1/2 w-full">
          <div className="relative">
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-brand-yellow rounded-full z-0"></div>
            <img 
              src={image || "https://picsum.photos/seed/cook/600/800"} 
              alt="Maman en cuisine" 
              className="relative z-10 rounded-lg shadow-xl w-full h-[400px] md:h-[500px] object-cover"
            />
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-brand-orange rounded-full z-0 opacity-50"></div>
          </div>
        </div>
        <div className="lg:w-1/2 w-full">
          <h2 className="text-brand-orange font-bold tracking-widest uppercase mb-2">Notre Histoire</h2>
          <h3 className="text-3xl md:text-4xl font-bold text-brand-brown mb-6">Plus qu'un restaurant, une famille.</h3>
          <p className="text-lg text-gray-700 mb-6 leading-relaxed">
            Tout a commencé dans la petite cuisine de notre maison familiale. Maman cuisinait avec tant de passion que l'odeur de ses épices attirait tout le quartier. Ce qui n'était au début que des repas pour la famille est vite devenu le secret le mieux gardé de la ville.
          </p>
          <p className="text-lg text-gray-700 mb-6 leading-relaxed">
            Aujourd'hui, chez <strong>Maman Mangé</strong>, nous gardons cette même authenticité. Notre secret ? Nous cuisinons avec le cœur. Contrairement à la concurrence, nous ne faisons aucun compromis sur la qualité des ingrédients ou le temps de préparation nécessaire pour un vrai goût traditionnel.
          </p>
          <div className="flex gap-4 mt-8">
            <div className="text-center p-4 bg-white rounded-lg shadow-sm border-t-4 border-brand-green flex-1">
              <span className="block text-3xl font-bold text-brand-brown mb-1">10+</span>
              <span className="text-sm text-gray-500">Années de passion</span>
            </div>
            <div className="text-center p-4 bg-white rounded-lg shadow-sm border-t-4 border-brand-orange flex-1">
              <span className="block text-3xl font-bold text-brand-brown mb-1">100%</span>
              <span className="text-sm text-gray-500">Produits Frais</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;