import { createClient } from '@supabase/supabase-js';
import { Dish, Order, ContactMessage, Review, SpecialtyItem, SiteSettings } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
    console.warn('Missing Supabase environment variables - using placeholder values');
}

// Create Supabase client with session persistence enabled
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: true, // Persist session in localStorage
        autoRefreshToken: true, // Auto-refresh tokens to maintain session
        detectSessionInUrl: false // Don't detect session from URL
    }
});

// --- Auth Functions ---

export const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    });
    if (error) throw error;
    return data;
};

export const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });
    if (error) throw error;
    return data;
};

export const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
};

export const getCurrentUser = async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session?.user ?? null;
};

// Check if an admin account already exists
export const checkAdminExists = async (): Promise<boolean> => {
    try {
        const { data, error } = await supabase.auth.admin.listUsers();
        if (error) {
            // If we can't check (permissions issue), we allow signup
            // This could happen if not using service role key
            console.warn('Unable to check existing users:', error);
            // Fallback: check if anyone is currently logged in or can login
            return false;
        }
        // Check if there are any users in the system
        return data.users && data.users.length > 0;
    } catch (error) {
        console.error('Error checking admin existence:', error);
        // Allow signup if we can't check (to avoid blocking legitimate first admin)
        return false;
    }
};

// --- Helper Functions ---

// Dishes
export const fetchDishes = async (): Promise<Dish[]> => {
    const { data, error } = await supabase
        .from('dishes')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
};

export const createDish = async (dish: Omit<Dish, 'id'>): Promise<Dish> => {
    const { data, error } = await supabase
        .from('dishes')
        .insert([dish])
        .select()
        .single();

    if (error) throw error;
    return data;
};

export const deleteDish = async (id: string): Promise<void> => {
    const { error } = await supabase.from('dishes').delete().eq('id', id);
    if (error) throw error;
};

export const updateDishAvailability = async (id: string, available: boolean): Promise<void> => {
    const { error } = await supabase.from('dishes').update({ available }).eq('id', id);
    if (error) throw error;
};

// Orders
export const fetchOrders = async (): Promise<Order[]> => {
    const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('date', { ascending: false });

    if (error) throw error;

    return (data || []).map((order: any) => ({
        ...order,
        customerName: order.customer_name,
        customerPhone: order.customer_phone,
        customerAddress: order.customer_address,
        dishName: order.dish_name,
        totalPrice: order.total_price,
        deliveryMode: order.delivery_mode,
    }));
};

export const createOrder = async (order: Omit<Order, 'id'>): Promise<Order> => {
    const dbOrder = {
        customer_name: order.customerName,
        customer_phone: order.customerPhone,
        customer_address: order.customerAddress,
        dish_name: order.dishName,
        quantity: order.quantity,
        total_price: order.totalPrice,
        status: order.status,
        delivery_mode: order.deliveryMode,
        notes: order.notes,
        date: order.date
    };

    const { data, error } = await supabase
        .from('orders')
        .insert([dbOrder])
        .select()
        .single();

    if (error) throw error;

    return {
        ...data,
        customerName: data.customer_name,
        customerPhone: data.customer_phone,
        customerAddress: data.customer_address,
        dishName: data.dish_name,
        totalPrice: data.total_price,
        deliveryMode: data.delivery_mode,
    };
};

export const updateOrderStatus = async (id: string, status: string): Promise<void> => {
    const { error } = await supabase.from('orders').update({ status }).eq('id', id);
    if (error) throw error;
};

export const deleteOrder = async (id: string): Promise<void> => {
    const { error } = await supabase.from('orders').delete().eq('id', id);
    if (error) throw error;
};

// Messages
export const fetchMessages = async (): Promise<ContactMessage[]> => {
    const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('date', { ascending: false });

    if (error) throw error;
    return data || [];
};

export const createMessage = async (message: Omit<ContactMessage, 'id' | 'read' | 'date'>): Promise<ContactMessage> => {
    const { data, error } = await supabase
        .from('messages')
        .insert([message])
        .select()
        .single();

    if (error) throw error;
    return data;
};

export const markMessageAsRead = async (id: string): Promise<void> => {
    const { error } = await supabase.from('messages').update({ read: true }).eq('id', id);
    if (error) throw error;
};

export const deleteMessage = async (id: string): Promise<void> => {
    const { error } = await supabase.from('messages').delete().eq('id', id);
    if (error) throw error;
};

// Reviews
export const fetchReviews = async (): Promise<Review[]> => {
    const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('date', { ascending: false });

    if (error) throw error;
    return data || [];
};

export const createReview = async (review: Omit<Review, 'id' | 'date'>): Promise<Review> => {
    const { data, error } = await supabase
        .from('reviews')
        .insert([review])
        .select()
        .single();

    if (error) throw error;
    return data;
};

export const deleteReview = async (id: string): Promise<void> => {
    const { error } = await supabase.from('reviews').delete().eq('id', id);
    if (error) throw error;
};

export const markReviewAsRead = async (id: string): Promise<void> => {
    const { error } = await supabase.from('reviews').update({ read: true }).eq('id', id);
    if (error) throw error;
};

// Specialties
export const fetchSpecialties = async (): Promise<SpecialtyItem[]> => {
    const { data, error } = await supabase.from('specialties').select('*');
    if (error) throw error;
    return data || [];
};

export const createSpecialty = async (specialty: Omit<SpecialtyItem, 'id'>): Promise<SpecialtyItem> => {
    const { data, error } = await supabase
        .from('specialties')
        .insert([specialty])
        .select()
        .single();

    if (error) throw error;
    return data;
};

export const deleteSpecialty = async (id: string): Promise<void> => {
    const { error } = await supabase.from('specialties').delete().eq('id', id);
    if (error) throw error;
};

// Legacy function - kept for compatibility but now uses insert
export const updateSpecialties = async (specialties: SpecialtyItem[]): Promise<void> => {
    const { error } = await supabase.from('specialties').upsert(specialties);
    if (error) throw error;
};

// Settings
export const fetchSettings = async (): Promise<SiteSettings | null> => {
    const { data, error } = await supabase.from('site_settings').select('*').single();
    if (error || !data) return null;

    return {
        phoneNumber: data.phone_number,
        address: data.address,
        openingHoursWeek: data.opening_hours_week,
        openingHoursSunday: data.opening_hours_sunday,
        socialLinks: {
            facebook: data.social_facebook,
            instagram: data.social_instagram,
            twitter: data.social_twitter
        },
        aboutImage: data.about_image
    };
};

export const updateSettings = async (settings: SiteSettings): Promise<void> => {
    const dbSettings = {
        phone_number: settings.phoneNumber,
        address: settings.address,
        opening_hours_week: settings.openingHoursWeek,
        opening_hours_sunday: settings.openingHoursSunday,
        social_facebook: settings.socialLinks.facebook,
        social_instagram: settings.socialLinks.instagram,
        social_twitter: settings.socialLinks.twitter,
        about_image: settings.aboutImage
    };

    const { error } = await supabase.from('site_settings').update(dbSettings).neq('id', '00000000-0000-0000-0000-000000000000');
    if (error) throw error;
};

// Gallery Images
export const fetchGalleryImages = async (): Promise<string[]> => {
    const { data, error } = await supabase
        .from('gallery_images')
        .select('url')
        .order('display_order', { ascending: true });

    if (error) throw error;
    return (data || []).map(item => item.url);
};

export const addGalleryImage = async (url: string): Promise<string> => {
    // Get the highest display_order to append new image at the end
    const { data, error } = await supabase
        .from('gallery_images')
        .select('display_order')
        .order('display_order', { ascending: false })
        .limit(1);

    const nextOrder = data && data.length > 0 ? data[0].display_order + 1 : 1;

    const { error: insertError } = await supabase
        .from('gallery_images')
        .insert([{ url, display_order: nextOrder }]);

    if (insertError) throw insertError;
    return url;
};

export const deleteGalleryImage = async (url: string): Promise<void> => {
    const { error } = await supabase
        .from('gallery_images')
        .delete()
        .eq('url', url);

    if (error) throw error;
};

// --- Real-time Subscriptions ---

export const subscribeToOrders = (
    onInsert: (order: Order) => void,
    onUpdate: (order: Order) => void,
    onDelete: (id: string) => void
) => {
    const channel = supabase
        .channel('orders-changes')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'orders' }, (payload) => {
            const data = payload.new as any;
            const order: Order = {
                ...data,
                customerName: data.customer_name,
                customerPhone: data.customer_phone,
                customerAddress: data.customer_address,
                dishName: data.dish_name,
                totalPrice: data.total_price,
                deliveryMode: data.delivery_mode,
            };
            onInsert(order);
        })
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'orders' }, (payload) => {
            const data = payload.new as any;
            const order: Order = {
                ...data,
                customerName: data.customer_name,
                customerPhone: data.customer_phone,
                customerAddress: data.customer_address,
                dishName: data.dish_name,
                totalPrice: data.total_price,
                deliveryMode: data.delivery_mode,
            };
            onUpdate(order);
        })
        .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'orders' }, (payload) => {
            onDelete(payload.old.id);
        })
        .subscribe();

    return channel;
};

export const subscribeToMessages = (
    onInsert: (message: ContactMessage) => void,
    onUpdate: (message: ContactMessage) => void,
    onDelete: (id: string) => void
) => {
    const channel = supabase
        .channel('messages-changes')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
            onInsert(payload.new as ContactMessage);
        })
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'messages' }, (payload) => {
            onUpdate(payload.new as ContactMessage);
        })
        .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'messages' }, (payload) => {
            onDelete(payload.old.id);
        })
        .subscribe();

    return channel;
};

export const subscribeToReviews = (
    onInsert: (review: Review) => void,
    onUpdate: (review: Review) => void,
    onDelete: (id: string) => void
) => {
    const channel = supabase
        .channel('reviews-changes')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'reviews' }, (payload) => {
            onInsert(payload.new as Review);
        })
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'reviews' }, (payload) => {
            onUpdate(payload.new as Review);
        })
        .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'reviews' }, (payload) => {
            onDelete(payload.old.id);
        })
        .subscribe();

    return channel;
};
