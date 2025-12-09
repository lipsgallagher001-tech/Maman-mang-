-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Dishes Table
create table public.dishes (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  price numeric not null,
  image text,
  category text check (category in ('plat', 'dessert', 'boisson')),
  available boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Orders Table
create table public.orders (
  id uuid default uuid_generate_v4() primary key,
  customer_name text not null,
  customer_phone text not null,
  customer_address text,
  dish_name text not null,
  quantity integer not null,
  total_price numeric not null,
  status text check (status in ('pending', 'cooking', 'ready', 'delivered', 'cancelled')) default 'pending',
  delivery_mode text check (delivery_mode in ('pickup', 'delivery')),
  notes text,
  date timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Messages Table
create table public.messages (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  phone text not null,
  message text not null,
  read boolean default false,
  date timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Reviews Table
create table public.reviews (
  id uuid default uuid_generate_v4() primary key,
  author text not null,
  rating integer check (rating >= 1 and rating <= 5),
  comment text,
  date timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Specialties Table
create table public.specialties (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  image text
);

-- 6. Site Settings Table (Singleton)
create table public.site_settings (
  id uuid default uuid_generate_v4() primary key,
  phone_number text,
  address text,
  opening_hours_week text,
  opening_hours_sunday text,
  social_facebook text,
  social_instagram text,
  social_twitter text,
  about_image text
);

-- Insert default settings
insert into public.site_settings (phone_number, address, opening_hours_week, opening_hours_sunday, social_facebook, social_instagram, social_twitter, about_image)
values ('+228 90 00 00 00', 'Quartier du Bonheur, Rue de la Paix, Lomé', 'Lundi - Samedi : 11h00 - 22h00', 'Dimanche : 12h00 - 20h00', '#', '#', '#', 'https://picsum.photos/seed/cook/600/800');

-- Enable Row Level Security (RLS) - Optional for now, but good practice
alter table public.dishes enable row level security;
alter table public.orders enable row level security;
alter table public.messages enable row level security;
alter table public.reviews enable row level security;
alter table public.specialties enable row level security;
alter table public.site_settings enable row level security;

-- Create policies to allow public access (for simplicity in this demo)
-- WARNING: In a real app, you would restrict write access to authenticated admins
create policy "Public Read Dishes" on public.dishes for select using (true);
create policy "Public Read Specialties" on public.specialties for select using (true);
create policy "Public Read Reviews" on public.reviews for select using (true);
create policy "Public Read Settings" on public.site_settings for select using (true);

-- Allow anyone to create orders and messages
create policy "Public Create Orders" on public.orders for insert with check (true);
create policy "Public Create Messages" on public.messages for insert with check (true);
create policy "Public Create Reviews" on public.reviews for insert with check (true);

-- Allow all access for now (Development Mode)
create policy "Enable all access for dishes" on public.dishes for all using (true);
create policy "Enable all access for orders" on public.orders for all using (true);
create policy "Enable all access for messages" on public.messages for all using (true);
create policy "Enable all access for reviews" on public.reviews for all using (true);
create policy "Enable all access for specialties" on public.specialties for all using (true);
create policy "Enable all access for settings" on public.site_settings for all using (true);
