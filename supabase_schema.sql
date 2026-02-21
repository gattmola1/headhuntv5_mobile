-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- ============================================================
-- TABLES
-- ============================================================

-- 1. Job Postings Table
create table if not exists public.postings (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    title text not null,
    company text not null,
    location text not null,
    salary text,
    description text
);

-- 2. Applications Table (Job Applications)
--    NOTE: ip_address is required for rate-limiting in api/apply.js
create table if not exists public.applications (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    posting_id uuid references public.postings(id) on delete set null,
    full_name text not null,
    email text not null,
    phone text,
    linkedin_url text,
    resume_url text, -- Stores the filename in the 'resumes' storage bucket
    ip_address text  -- Used for rate-limiting (max 2 apps per IP per 24h)
);

-- 3. Prospects Table (Referrals)
create table if not exists public.prospects (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    target_type text,           -- 'talent' or 'decision_maker'
    recommender_name text,
    recommender_email text,
    recommender_phone text,
    prospect_name text,
    prospect_email text,
    prospect_phone text,
    willing_to_connect boolean default false
);

-- 4. Recruiters Table (Recruiter Profiles)
create table if not exists public.recruiters (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    name text not null,
    bio text,
    highlights text,
    calendar_id text,
    slug text unique,            -- URL-friendly identifier e.g. 'john-doe'
    headshot_url text
);

-- 5. Leads Table (Candidate leads submitted via recruiter booking pages)
create table if not exists public.leads (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    recruiter_id uuid references public.recruiters(id) on delete set null,
    candidate_name text not null,
    candidate_email text,
    candidate_phone text,
    preferred_windows text       -- JSON string of availability windows
);

-- 6. Events Table (Networking / Recruiting Events)
create table if not exists public.events (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    title text not null,
    date timestamp with time zone not null,
    time_string text,            -- Human-readable time e.g. "7:00 PM CST"
    location text,
    type text,                   -- e.g. 'in-person', 'virtual'
    category text,               -- e.g. 'networking', 'workshop'
    description text,
    image_url text,
    attendees_count text,
    is_featured boolean default false,
    color text                   -- UI accent color for the event card
);

-- ============================================================
-- STORAGE BUCKET
-- ============================================================

-- Private bucket for applicant resumes
-- Access is controlled by the Admin route (supabaseAdmin) only.
insert into storage.buckets (id, name, public)
values ('resumes', 'resumes', false)
on conflict (id) do nothing;

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================
-- Strategy:
--   "Public" = the anon key can perform this action (safe for the frontend).
--   "Private" = only the authorized admin route (checkAdmin + supabaseAdmin
--               with the Service Role Key) can perform this action. The RLS
--               policy itself does NOT grant access; it relies on the Service
--               Role Key bypassing RLS entirely for admin writes.
--
-- In practice: anon key reads are permitted by policy. Admin writes use the
-- Service Role Key which bypasses RLS, so no INSERT/UPDATE/DELETE policy is
-- needed for admin-only tables — the absence of a public write policy IS the
-- restriction.
-- ============================================================

-- Enable RLS on all tables
alter table public.postings enable row level security;
alter table public.applications enable row level security;
alter table public.prospects enable row level security;
alter table public.recruiters enable row level security;
alter table public.leads enable row level security;
alter table public.events enable row level security;

-- ---- postings -----------------------------------------------
-- Public can read job listings. Only admin route can write.
create policy "postings: public select"
on public.postings for select
to public
using (true);

-- ---- events  ------------------------------------------------
-- Public can read events. Only admin route can write.
create policy "events: public select"
on public.events for select
to public
using (true);

-- ---- recruiters  --------------------------------------------
-- Public can read recruiter profiles. Only admin route can write.
create policy "recruiters: public select"
on public.recruiters for select
to public
using (true);

-- ---- applications -------------------------------------------
-- Anyone can submit an application (anon insert).
-- Only admin route can read, update, or delete.
create policy "applications: public insert"
on public.applications for insert
to public
with check (true);

-- ---- prospects ----------------------------------------------
-- Anyone can submit a referral (anon insert).
-- Only admin route can read, update, or delete.
create policy "prospects: public insert"
on public.prospects for insert
to public
with check (true);

-- ---- leads --------------------------------------------------
-- Anyone can submit a lead via a recruiter booking page (anon insert).
-- Only admin route can read, update, or delete.
create policy "leads: public insert"
on public.leads for insert
to public
with check (true);

-- ============================================================
-- STORAGE POLICIES
-- ============================================================
-- Resume uploads and downloads go through the admin route only.
-- No public access is granted. Service Role Key bypasses this.
create policy "resumes: deny public access"
on storage.objects
for all
to public
using (false);

-- ============================================================
-- NEW TABLES
-- ============================================================

-- 7. User Queries Table (chatbot messages from the About page)
create table if not exists public.user_queries (
    id          uuid default gen_random_uuid() primary key,
    created_at  timestamp with time zone default timezone('utc'::text, now()) not null,
    query_text  text not null,
    intent      text,   -- 'faq' | 'events' | 'jobs'
    matched     boolean -- true if a result was returned, false if no-match
);

alter table public.user_queries enable row level security;

-- Anyone can insert (anon POST). Admin route reads via Service Role Key.
create policy "user_queries: public insert"
on public.user_queries for insert
to public
with check (true);
