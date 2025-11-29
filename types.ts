import React from 'react';

export interface Dish {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'plat' | 'dessert' | 'boisson';
  available: boolean; // Nouveau champ pour gérer le stock/disponibilité
}

export type PageView = 'home' | 'menu' | 'about' | 'services' | 'gallery' | 'contact' | 'reviews' | 'admin';

export interface ServiceItem {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export type OrderStatus = 'pending' | 'cooking' | 'ready' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerAddress?: string;
  dishName: string;
  quantity: number;
  totalPrice: number; // Prix final accepté/proposé
  status: OrderStatus;
  date: Date;
  deliveryMode: 'pickup' | 'delivery';
  notes?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  phone: string;
  message: string;
  date: Date;
  read: boolean;
}

export interface Review {
  id: string;
  author: string;
  rating: number; // 1 à 5
  comment: string;
  date: Date;
}

export interface SiteSettings {
  phoneNumber: string;
  address: string;
  openingHoursWeek: string;
  openingHoursSunday: string;
  socialLinks: {
    facebook: string;
    instagram: string;
    twitter: string;
  };
}