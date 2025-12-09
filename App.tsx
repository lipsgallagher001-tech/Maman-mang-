import React, { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
// Lazy load components for better performance
const Hero = lazy(() => import('./components/Hero'));
const Menu = lazy(() => import('./components/Menu'));
const About = lazy(() => import('./components/About'));
const Services = lazy(() => import('./components/Services'));
const Gallery = lazy(() => import('./components/Gallery'));
const Contact = lazy(() => import('./components/Contact'));
const AdminDashboard = lazy(() => import('./components/AdminDashboard'));
const Reviews = lazy(() => import('./components/Reviews'));
const Login = lazy(() => import('./components/Login'));
const Signup = lazy(() => import('./components/Signup'));
import { PageView, Dish, Order, ContactMessage, Review, SiteSettings, OrderStatus, SpecialtyItem } from './types';
import {
  fetchDishes, createDish, deleteDish, updateDishAvailability,
  fetchOrders, createOrder, updateOrderStatus, deleteOrder,
  fetchMessages, createMessage, markMessageAsRead, deleteMessage,
  fetchReviews, createReview, deleteReview,
  fetchSpecialties, createSpecialty, deleteSpecialty,
  fetchSettings, updateSettings,
  fetchGalleryImages, addGalleryImage, deleteGalleryImage,
  getCurrentUser, signOut,
  subscribeToOrders, subscribeToMessages, subscribeToReviews
} from './services/supabase';

// Fallback initial data
const INITIAL_SETTINGS: SiteSettings = {
  phoneNumber: '+228 90 00 00 00',
  address: 'Quartier du Bonheur, Rue de la Paix, Lomé',
  openingHoursWeek: 'Lundi - Samedi : 11h00 - 22h00',
  openingHoursSunday: 'Dimanche : 12h00 - 20h00',
  socialLinks: { facebook: '#', instagram: '#', twitter: '#' },
  aboutImage: 'https://picsum.photos/seed/cook/600/800'
};

// Component wrapper that provides navigation
const HomePage: React.FC<any> = ({ menuItems, handleAddOrder, specialties, siteSettings, galleryImages, reviews, handleAddReview, handleAddMessage }) => {
  const navigate = useNavigate();
  return (
    <>
      <Hero onNavigate={(page) => navigate(page === 'home' ? '/' : `/${page}`)} />
      <Menu menuItems={menuItems} onAddOrder={handleAddOrder} />
      <Services specialties={specialties} />
      <About image={siteSettings.aboutImage} />
      <Gallery images={galleryImages} />
      <Reviews reviews={reviews} onAddReview={handleAddReview} />
      <Contact onSendMessage={handleAddMessage} settings={siteSettings} />
    </>
  );
};

// Protected route wrapper for admin
const ProtectedAdminRoute: React.FC<{ user: any; isLoading: boolean; children: React.ReactNode }> = ({ user, isLoading, children }) => {
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center text-brand-brown">Vérification...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Admin Dashboard Wrapper with logout redirect
const AdminDashboardWrapper: React.FC<any> = (props) => {
  const navigate = useNavigate();

  const handleLogoutWithRedirect = async () => {
    await props.onLogout();
    navigate('/');
  };

  return (
    <AdminDashboard
      {...props}
      onLogout={handleLogoutWithRedirect}
      onNavigate={(page: PageView) => navigate(page === 'home' ? '/' : `/${page}`)}
    />
  );
};

// Layout wrapper
const LayoutWrapper: React.FC<{ children: React.ReactNode; showNavFooter: boolean; siteSettings: SiteSettings; currentPage?: PageView }> = ({ children, showNavFooter, siteSettings, currentPage = 'home' }) => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-brand-cream font-sans text-brand-brown selection:bg-brand-orange selection:text-white">
      {showNavFooter && (
        <Navbar
          currentPage={currentPage}
          onNavigate={(page) => navigate(page === 'home' ? '/' : `/${page}`)}
          phoneNumber={siteSettings.phoneNumber}
        />
      )}

      <main className="animate-fade-in">
        {children}
      </main>

      {showNavFooter && (
        <Footer
          onNavigate={(page) => navigate(page === 'home' ? '/' : `/${page}`)}
          settings={siteSettings}
        />
      )}
    </div>
  );
};

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  const [menuItems, setMenuItems] = useState<Dish[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(INITIAL_SETTINGS);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [specialties, setSpecialties] = useState<SpecialtyItem[]>([]);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);

      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error("Erreur lors de la récupération de l'utilisateur:", error);
      }

      // Load each data type independently with error handling
      try {
        const dishesData = await fetchDishes();
        setMenuItems(dishesData);
      } catch (error) {
        console.error("Erreur lors du chargement des plats:", error);
      }

      try {
        const ordersData = await fetchOrders();
        setOrders(ordersData);
      } catch (error) {
        console.error("Erreur lors du chargement des commandes:", error);
      }

      try {
        const messagesData = await fetchMessages();
        setMessages(messagesData);
      } catch (error) {
        console.error("Erreur lors du chargement des messages:", error);
      }

      try {
        const reviewsData = await fetchReviews();
        setReviews(reviewsData);
      } catch (error) {
        console.error("Erreur lors du chargement des avis:", error);
      }

      try {
        const specialtiesData = await fetchSpecialties();
        setSpecialties(specialtiesData);
      } catch (error) {
        console.error("Erreur lors du chargement des spécialités:", error);
      }

      try {
        const settingsData = await fetchSettings();
        if (settingsData) setSiteSettings(settingsData);
      } catch (error) {
        console.error("Erreur lors du chargement des paramètres:", error);
      }

      try {
        const galleryData = await fetchGalleryImages();
        setGalleryImages(galleryData);
      } catch (error) {
        console.error("Erreur lors du chargement de la galerie:", error);
      }

      setIsLoading(false);
    };

    loadData();
  }, []);

  // Real-time subscriptions
  useEffect(() => {
    // Subscribe to orders changes
    const ordersChannel = subscribeToOrders(
      (newOrder) => {
        // On INSERT: add new order to the top of the list
        setOrders(prev => [newOrder, ...prev]);
      },
      (updatedOrder) => {
        // On UPDATE: update the order in the list
        setOrders(prev => prev.map(order => order.id === updatedOrder.id ? updatedOrder : order));
      },
      (deletedId) => {
        // On DELETE: remove the order from the list
        setOrders(prev => prev.filter(order => order.id !== deletedId));
      }
    );

    // Subscribe to messages changes
    const messagesChannel = subscribeToMessages(
      (newMessage) => {
        // On INSERT: add new message to the top of the list
        setMessages(prev => [newMessage, ...prev]);
      },
      (updatedMessage) => {
        // On UPDATE: update the message in the list
        setMessages(prev => prev.map(msg => msg.id === updatedMessage.id ? updatedMessage : msg));
      },
      (deletedId) => {
        // On DELETE: remove the message from the list
        setMessages(prev => prev.filter(msg => msg.id !== deletedId));
      }
    );

    // Subscribe to reviews changes
    const reviewsChannel = subscribeToReviews(
      (newReview) => {
        // On INSERT: add new review to the top of the list
        setReviews(prev => [newReview, ...prev]);
      },
      (updatedReview) => {
        // On UPDATE: update the review in the list
        setReviews(prev => prev.map(review => review.id === updatedReview.id ? updatedReview : review));
      },
      (deletedId) => {
        // On DELETE: remove the review from the list
        setReviews(prev => prev.filter(review => review.id !== deletedId));
      }
    );

    // Cleanup function: unsubscribe when component unmounts
    return () => {
      ordersChannel.unsubscribe();
      messagesChannel.unsubscribe();
      reviewsChannel.unsubscribe();
    };
  }, []);

  const toggleDishAvailability = async (id: string) => {
    const item = menuItems.find(i => i.id === id);
    if (!item) return;
    try {
      await updateDishAvailability(id, !item.available);
      setMenuItems(prev => prev.map(i => i.id === id ? { ...i, available: !i.available } : i));
    } catch (error) {
      console.error("Error updating availability:", error);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      await updateOrderStatus(orderId, status);
      setOrders(prev => prev.map(order => order.id === orderId ? { ...order, status } : order));
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const handleDeleteOrder = async (id: string) => {
    try {
      await deleteOrder(id);
      setOrders(prev => prev.filter(order => order.id !== id));
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  const handleUpdateSiteSettings = async (newSettings: SiteSettings) => {
    try {
      await updateSettings(newSettings);
      setSiteSettings(newSettings);
    } catch (error) {
      console.error("Error updating settings:", error);
    }
  };

  const updateGalleryImages = async (newImages: string[]) => {
    // Déterminer les images ajoutées et supprimées
    const added = newImages.filter(img => !galleryImages.includes(img));
    const removed = galleryImages.filter(img => !newImages.includes(img));

    try {
      // Ajouter les nouvelles images
      for (const url of added) {
        await addGalleryImage(url);
      }

      // Supprimer les images retirées
      for (const url of removed) {
        try {
          await deleteGalleryImage(url);
        } catch (deleteError) {
          console.warn("Failed to delete image from database, but continuing:", deleteError);
          // Continue with other deletions even if one fails
        }
      }

      // Mettre à jour l'état local
      setGalleryImages(newImages);
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la galerie:", error);
      alert("Erreur lors de la mise à jour de la galerie: " + (error as Error).message);
    }
  };

  const handleAddSpecialty = async (specialty: Omit<SpecialtyItem, 'id'>) => {
    try {
      const createdSpecialty = await createSpecialty(specialty);
      setSpecialties(prev => [...prev, createdSpecialty]);
    } catch (error) {
      console.error("Error adding specialty:", error);
      alert("Erreur lors de l'ajout de la spécialité");
    }
  };

  const handleDeleteSpecialty = async (id: string) => {
    try {
      await deleteSpecialty(id);
      setSpecialties(prev => prev.filter(s => s.id !== id));
    } catch (error) {
      console.error("Error deleting specialty:", error);
      alert("Erreur lors de la suppression");
    }
  };

  const handleAddDish = async (newDish: Dish) => {
    try {
      const { id, ...dishData } = newDish;
      const createdDish = await createDish(dishData);
      setMenuItems(prev => [createdDish, ...prev]);
    } catch (error) {
      console.error("Error adding dish:", error);
    }
  };

  const handleDeleteDish = async (id: string) => {
    try {
      await deleteDish(id);
      setMenuItems(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error("Error deleting dish:", error);
    }
  };

  const handleMarkMessageAsRead = async (id: string) => {
    try {
      await markMessageAsRead(id);
      setMessages(prev => prev.map(msg => msg.id === id ? { ...msg, read: true } : msg));
    } catch (error) {
      console.error("Error marking message as read:", error);
    }
  };

  const handleDeleteMessage = async (id: string) => {
    try {
      await deleteMessage(id);
      setMessages(prev => prev.filter(msg => msg.id !== id));
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  const handleDeleteReview = async (id: string) => {
    try {
      await deleteReview(id);
      setReviews(prev => prev.filter(review => review.id !== id));
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      setUser(null);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleLoginSuccess = async () => {
    const currentUser = await getCurrentUser();
    setUser(currentUser);
  };

  const handleAddOrder = async (newOrder: Order) => {
    try {
      const { id, ...orderData } = newOrder;
      const createdOrder = await createOrder(orderData);
      setOrders(prev => [createdOrder, ...prev]);
      alert("Commande passée avec succès !");
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Erreur lors de la commande. Veuillez réessayer.");
    }
  };

  const handleAddMessage = async (msg: ContactMessage) => {
    try {
      const { id, read, date, ...msgData } = msg;
      const createdMsg = await createMessage(msgData);
      setMessages(prev => [createdMsg, ...prev]);
      alert("Message envoyé !");
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Erreur lors de l'envoi du message.");
    }
  };

  const handleAddReview = async (review: Review) => {
    try {
      const { id, date, ...reviewData } = review;
      const createdReview = await createReview(reviewData);
      setReviews(prev => [createdReview, ...prev]);
    } catch (error) {
      console.error("Error adding review:", error);
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center text-brand-brown">Chargement...</div>;
  }

  return (
    <BrowserRouter>
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-brand-cream">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-brand-orange mb-4"></div>
            <p className="text-brand-brown text-xl font-bold">Chargement...</p>
          </div>
        </div>
      }>
        <Routes>
          <Route path="/" element={
            <LayoutWrapper showNavFooter={true} siteSettings={siteSettings} currentPage="home">
              <HomePage
                menuItems={menuItems}
                handleAddOrder={handleAddOrder}
                specialties={specialties}
                siteSettings={siteSettings}
                galleryImages={galleryImages}
                reviews={reviews}
                handleAddReview={handleAddReview}
                handleAddMessage={handleAddMessage}
              />
            </LayoutWrapper>
          } />

          <Route path="/menu" element={
            <LayoutWrapper showNavFooter={true} siteSettings={siteSettings} currentPage="menu">
              <Menu menuItems={menuItems} onAddOrder={handleAddOrder} />
            </LayoutWrapper>
          } />

          <Route path="/about" element={
            <LayoutWrapper showNavFooter={true} siteSettings={siteSettings} currentPage="about">
              <About image={siteSettings.aboutImage} />
            </LayoutWrapper>
          } />

          <Route path="/services" element={
            <LayoutWrapper showNavFooter={true} siteSettings={siteSettings} currentPage="services">
              <Services specialties={specialties} />
            </LayoutWrapper>
          } />

          <Route path="/gallery" element={
            <LayoutWrapper showNavFooter={true} siteSettings={siteSettings} currentPage="gallery">
              <Gallery images={galleryImages} />
            </LayoutWrapper>
          } />

          <Route path="/reviews" element={
            <LayoutWrapper showNavFooter={true} siteSettings={siteSettings} currentPage="reviews">
              <Reviews reviews={reviews} onAddReview={handleAddReview} />
            </LayoutWrapper>
          } />

          <Route path="/contact" element={
            <LayoutWrapper showNavFooter={true} siteSettings={siteSettings} currentPage="contact">
              <Contact onSendMessage={handleAddMessage} settings={siteSettings} />
            </LayoutWrapper>
          } />

          <Route path="/login" element={
            <LayoutWrapper showNavFooter={false} siteSettings={siteSettings}>
              <Login onNavigate={(page) => { }} onLoginSuccess={handleLoginSuccess} />
            </LayoutWrapper>
          } />

          <Route path="/signup" element={
            <LayoutWrapper showNavFooter={false} siteSettings={siteSettings}>
              <Signup onNavigate={(page) => { }} onSignupSuccess={() => { }} />
            </LayoutWrapper>
          } />

          <Route path="/admin" element={
            <LayoutWrapper showNavFooter={false} siteSettings={siteSettings}>
              <ProtectedAdminRoute user={user} isLoading={isLoading}>
                <AdminDashboardWrapper
                  orders={orders}
                  menuItems={menuItems}
                  messages={messages}
                  reviews={reviews}
                  settings={siteSettings}
                  galleryImages={galleryImages}
                  specialties={specialties}
                  onUpdateOrderStatus={handleUpdateOrderStatus}
                  onDeleteOrder={handleDeleteOrder}
                  onToggleAvailability={toggleDishAvailability}
                  onUpdateSettings={handleUpdateSiteSettings}
                  onUpdateGallery={updateGalleryImages}
                  onAddSpecialty={handleAddSpecialty}
                  onDeleteSpecialty={handleDeleteSpecialty}
                  onAddDish={handleAddDish}
                  onDeleteDish={handleDeleteDish}
                  onMarkMessageAsRead={handleMarkMessageAsRead}
                  onDeleteMessage={handleDeleteMessage}
                  onDeleteReview={handleDeleteReview}
                  onLogout={handleLogout}
                />
              </ProtectedAdminRoute>
            </LayoutWrapper>
          } />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;