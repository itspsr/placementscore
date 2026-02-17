-- Supabase Migration / SQL Schema

-- 1. Users table (handled by Supabase Auth mostly, but we can have a profile)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  full_name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Resumes table
create table if not exists public.resumes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete set null,
  filename text not null,
  original_text text,
  score float,
  plan_id text check (plan_id in ('free', 'base', 'growth', 'expert')),
  analysis_json jsonb,
  is_paid boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Payments table
create table if not exists public.payments (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id),
  resume_id uuid references public.resumes(id),
  plan_id text,
  razorpay_order_id text,
  razorpay_payment_id text,
  status text check (status in ('pending', 'captured', 'failed')),
  amount float,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Blogs table (AI Generated)
create table if not exists public.blogs (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text unique not null,
  meta_description text,
  content text not null,
  keywords text,
  cluster text,
  faq_schema text,
  source text,
  published boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS (Row Level Security) - Basic setup
alter table public.resumes enable row level security;
create policy "Users can view their own resumes" on public.resumes for select using (auth.uid() = user_id);

alter table public.blogs enable row level security;
create policy "Anyone can read published blogs" on public.blogs for select using (published = true);
