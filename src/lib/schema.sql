-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- SERVICES TABLE
create table public.services (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  price text,
  icon text,
  image_url text,
  category text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.services enable row level security;
create policy "Allow public read access" on public.services for select using (true);
create policy "Allow authenticated insert" on public.services for insert with check (auth.role() = 'authenticated');
create policy "Allow authenticated update" on public.services for update using (auth.role() = 'authenticated');

-- PRODUCTS TABLE
create table public.products (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  category text not null, -- 'Wash', 'Treatments', 'Styling', 'Tools'
  price text,
  image_url text,
  description text,
  is_featured boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.products enable row level security;
create policy "Allow public read access" on public.products for select using (true);
create policy "Allow authenticated insert" on public.products for insert with check (auth.role() = 'authenticated');
create policy "Allow authenticated update" on public.products for update using (auth.role() = 'authenticated');

-- FAQS TABLE
create table public.faqs (
  id uuid default uuid_generate_v4() primary key,
  question text not null,
  answer text not null,
  display_order integer,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.faqs enable row level security;
create policy "Allow public read access" on public.faqs for select using (true);
create policy "Allow authenticated insert" on public.faqs for insert with check (auth.role() = 'authenticated');
create policy "Allow authenticated update" on public.faqs for update using (auth.role() = 'authenticated');

-- GALLERY TABLE
create table public.gallery (
  id uuid default uuid_generate_v4() primary key,
  image_url text not null,
  caption text,
  display_order integer,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.gallery enable row level security;
create policy "Allow public read access" on public.gallery for select using (true);
create policy "Allow authenticated insert" on public.gallery for insert with check (auth.role() = 'authenticated');
create policy "Allow authenticated update" on public.gallery for update using (auth.role() = 'authenticated');
