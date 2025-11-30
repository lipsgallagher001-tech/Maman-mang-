import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Menu from './components/Menu';
import About from './components/About';
import Services from './components/Services';
import Gallery from './components/Gallery';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AdminDashboard from './components/AdminDashboard';
import Reviews from './components/Reviews';
import { PageView, Dish, Order, ContactMessage, Review, SiteSettings, OrderStatus, SpecialtyItem } from './types';

// Données initiales du menu déplacées ici pour être modifiables
const INITIAL_MENU: Dish[] = [
  {
    id: '1',
    name: 'Pâte Rouge & Poulet',
    description: 'Une délicieuse pâte de maïs à la tomate (Akoumé), servie avec une sauce graine riche et du poulet braisé.',
    price: 3500,
    category: 'plat',
    image: 'https://picsum.photos/seed/pate/400/300',
    available: true
  },
  {
    id: '2',
    name: 'Foufou Royal',
    description: 'Igname pilée onctueuse accompagnée de sa sauce claire au poisson frais et épices du village.',
    price: 4000,
    category: 'plat',
    image: 'https://picsum.photos/seed/foufou/400/300',
    available: true
  },
  {
    id: '3',
    name: 'Koliko & Brochettes',
    description: 'Frites d\'igname croustillantes servies avec des brochettes de boeuf marinées et du piment noir.',
    price: 2500,
    category: 'plat',
    image: 'https://picsum.photos/seed/koliko/400/300',
    available: true
  },
  {
    id: '4',
    name: 'Pinon au Porc',
    description: 'Pâte de gari assaisonnée et cuisinée avec des morceaux de porc frits. Un classique savoureux.',
    price: 3000,
    category: 'plat',
    image: 'https://picsum.photos/seed/pinon/400/300',
    available: true
  },
  {
    id: '5',
    name: 'Riz Gras Africain',
    description: 'Riz cuit dans un bouillon de légumes et viande, parfumé et coloré, servi avec salade.',
    price: 2000,
    category: 'plat',
    image: 'https://picsum.photos/seed/riz/400/300',
    available: true
  },
  {
    id: '6',
    name: 'Akpan Nature',
    description: 'Yaourt de maïs fermenté rafraîchissant, servi avec du lait et des glaçons. Idéal comme dessert.',
    price: 500,
    category: 'dessert',
    image: 'https://picsum.photos/seed/akpan/400/300',
    available: true
  }
];

const INITIAL_SPECIALTIES: SpecialtyItem[] = [
  {
    id: '1',
    name: "Djenkoumé (Pâte rouge)",
    description: "La spécialité de la maison. Une pâte de maïs à la tomate savoureuse accompagnée de poulet frit.",
    image: "https://picsum.photos/seed/djenkoume/400/300"
  },
  {
    id: '2',
    name: "Ayimolou (Riz & Haricot)",
    description: "Le plat du peuple, sublimé par Maman avec un piment noir dont elle seule a le secret.",
    image: "https://picsum.photos/seed/ayimolou/400/300"
  },
  {
    id: '3',
    name: "Foufou & Sauce Claire",
    description: "De l'igname pilée à la main, servie avec une sauce légère au poisson frais.",
    image: "https://picsum.photos/seed/foufou/400/300"
  },
  {
    id: '4',
    name: "Ablo & Poisson",
    description: "Petites galettes de riz fermenté cuites à la vapeur, servies avec une sauce tomate pimentée.",
    image: "https://picsum.photos/seed/ablo/400/300"
  },
  {
    id: '5',
    name: "Gboma Dessi",
    description: "Sauce épinard riche en viande de boeuf et crevettes, accompagnée de pâte blanche.",
    image: "https://picsum.photos/seed/gboma/400/300"
  },
  {
    id: '6',
    name: "Kom & Piment Noir",
    description: "Pâte de maïs fermentée (Kenkey) avec des sardines frites et du piment shito.",
    image: "https://picsum.photos/seed/kom/400/300"
  }
];

const INITIAL_REVIEWS: Review[] = [
  {
    id: '1',
    author: 'Koffi A.',
    rating: 5,
    comment: 'Le foufou était incroyable, exactement comme au village. Je recommande vivement !',
    date: new Date('2023-10-15')
  },
  {
    id: '2',
    author: 'Sarah M.',
    rating: 4,
    comment: 'Très bon accueil et les plats sont copieux. Le piment noir est une tuerie.',
    date: new Date('2023-10-18')
  },
  {
    id: '3',
    author: 'Jean-Pierre',
    rating: 5,
    comment: 'Maman Mangé porte bien son nom. On sent l\'amour dans la cuisine. Livraison rapide.',
    date: new Date('2023-10-20')
  }
];

const INITIAL_SETTINGS: SiteSettings = {
  phoneNumber: '+228 90 00 00 00',
  address: 'Quartier du Bonheur, Rue de la Paix, Lomé',
  openingHoursWeek: 'Lundi - Samedi : 11h00 - 22h00',
  openingHoursSunday: 'Dimanche : 12h00 - 20h00',
  socialLinks: {
    facebook: '#',
    instagram: '#',
    twitter: '#'
  },
  aboutImage: 'https://picsum.photos/seed/cook/600/800'
};

const INITIAL_GALLERY_IMAGES = [
  'https://picsum.photos/seed/food1/500/500',
  'https://picsum.photos/seed/food2/500/500',
  'https://picsum.photos/seed/food3/500/500',
  'https://picsum.photos/seed/restaurant1/500/500',
  'https://picsum.photos/seed/food4/500/500',
  'https://picsum.photos/seed/people/500/500',
];

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageView>('home');
  
  // États partagés
  const [menuItems, setMenuItems] = useState<Dish[]>(INITIAL_MENU);
  const [orders, setOrders] = useState<Order[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(INITIAL_SETTINGS);
  const [galleryImages, setGalleryImages] = useState<string[]>(INITIAL_GALLERY_IMAGES);
  const [specialties, setSpecialties] = useState<SpecialtyItem[]>(INITIAL_SPECIALTIES);

  // Actions pour le Dashboard
  const toggleDishAvailability = (id: string) => {
    setMenuItems(prev => prev.map(item => 
      item.id === id ? { ...item, available: !item.available } : item
    ));
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status } : order
    ));
  };

  const handleDeleteOrder = (id: string) => {
    setOrders(prev => prev.filter(order => order.id !== id));
  };

  const updateSiteSettings = (newSettings: SiteSettings) => {
    setSiteSettings(newSettings);
  };

  const updateGalleryImages = (newImages: string[]) => {
    setGalleryImages(newImages);
  };

  const updateSpecialties = (newSpecialties: SpecialtyItem[]) => {
    setSpecialties(newSpecialties);
  };

  const handleAddDish = (newDish: Dish) => {
    setMenuItems(prev => [newDish, ...prev]);
  };

  const handleDeleteDish = (id: string) => {
    setMenuItems(prev => prev.filter(item => item.id !== id));
  };

  const handleMarkMessageAsRead = (id: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === id ? { ...msg, read: true } : msg
    ));
  };

  const handleDeleteMessage = (id: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== id));
  };
  
  const handleDeleteReview = (id: string) => {
    setReviews(prev => prev.filter(review => review.id !== id));
  };

  // Actions pour le Site Public
  const handleAddOrder = (newOrder: Order) => {
    setOrders(prev => [newOrder, ...prev]);
  };

  const handleAddMessage = (msg: ContactMessage) => {
    setMessages(prev => [msg, ...prev]);
  };

  const handleAddReview = (review: Review) => {
    setReviews(prev => [review, ...prev]);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <>
            <Hero onNavigate={setCurrentPage} />
            <Menu menuItems={menuItems} onAddOrder={handleAddOrder} />
            <Services specialties={specialties} />
            <About image={siteSettings.aboutImage} />
            <Gallery images={galleryImages} />
            <Reviews reviews={reviews} onAddReview={handleAddReview} />
            <Contact onSendMessage={handleAddMessage} settings={siteSettings} />
          </>
        );
      case 'menu':
        return <Menu menuItems={menuItems} onAddOrder={handleAddOrder} />;
      case 'about':
        return <About image={siteSettings.aboutImage} />;
      case 'services':
        return <Services specialties={specialties} />;
      case 'gallery':
        return <Gallery images={galleryImages} />;
      case 'reviews':
        return <Reviews reviews={reviews} onAddReview={handleAddReview} />;
      case 'contact':
        return <Contact onSendMessage={handleAddMessage} settings={siteSettings} />;
      case 'admin':
        return (
          <AdminDashboard 
            orders={orders} 
            menuItems={menuItems}
            messages={messages}
            reviews={reviews}
            settings={siteSettings}
            galleryImages={galleryImages}
            specialties={specialties}
            onUpdateOrderStatus={updateOrderStatus}
            onDeleteOrder={handleDeleteOrder}
            onToggleAvailability={toggleDishAvailability}
            onUpdateSettings={updateSiteSettings}
            onUpdateGallery={updateGalleryImages}
            onUpdateSpecialties={updateSpecialties}
            onAddDish={handleAddDish}
            onDeleteDish={handleDeleteDish}
            onMarkMessageAsRead={handleMarkMessageAsRead}
            onDeleteMessage={handleDeleteMessage}
            onDeleteReview={handleDeleteReview}
            onNavigate={setCurrentPage}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-brand-cream font-sans text-brand-brown selection:bg-brand-orange selection:text-white">
      {currentPage !== 'admin' && (
        <Navbar 
          currentPage={currentPage} 
          onNavigate={setCurrentPage} 
          phoneNumber={siteSettings.phoneNumber}
        />
      )}
      
      <main className="animate-fade-in">
        {renderPage()}
      </main>

      {currentPage !== 'admin' && (
        <Footer 
          onNavigate={setCurrentPage} 
          settings={siteSettings}
        />
      )}
    </div>
  );
};

export default App;