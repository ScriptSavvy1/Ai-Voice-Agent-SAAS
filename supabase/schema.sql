-- ============================================================
-- AI Voice Agent SaaS — Supabase Database Schema
-- ============================================================

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- ─── 1. BUSINESSES ──────────────────────────────────────────
create table public.businesses (
  id            uuid primary key default uuid_generate_v4(),
  owner_id      uuid not null references auth.users(id) on delete cascade,
  name          text not null,
  industry      text not null default 'general',
  description   text,
  phone         text,
  email         text,
  address       text,
  city          text,
  country       text default 'Somalia',
  business_hours jsonb default '[
    {"day": "Monday",    "open": "08:00", "close": "17:00", "is_open": true},
    {"day": "Tuesday",   "open": "08:00", "close": "17:00", "is_open": true},
    {"day": "Wednesday", "open": "08:00", "close": "17:00", "is_open": true},
    {"day": "Thursday",  "open": "08:00", "close": "17:00", "is_open": true},
    {"day": "Friday",    "open": "08:00", "close": "17:00", "is_open": true},
    {"day": "Saturday",  "open": "09:00", "close": "13:00", "is_open": true},
    {"day": "Sunday",    "open": "00:00", "close": "00:00", "is_open": false}
  ]'::jsonb,
  timezone      text default 'Africa/Mogadishu',
  logo_url      text,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- ─── 2. SERVICES ────────────────────────────────────────────
create table public.services (
  id               uuid primary key default uuid_generate_v4(),
  business_id      uuid not null references public.businesses(id) on delete cascade,
  name             text not null,
  name_somali      text,
  description      text,
  description_somali text,
  price            decimal(10,2),
  duration_minutes integer default 30,
  is_active        boolean default true,
  sort_order       integer default 0,
  created_at       timestamptz default now(),
  updated_at       timestamptz default now()
);

-- ─── 3. FAQS ────────────────────────────────────────────────
create table public.faqs (
  id              uuid primary key default uuid_generate_v4(),
  business_id     uuid not null references public.businesses(id) on delete cascade,
  question        text not null,
  question_somali text,
  answer          text not null,
  answer_somali   text,
  category        text default 'general',
  sort_order      integer default 0,
  is_active       boolean default true,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

-- ─── 4. AGENTS ──────────────────────────────────────────────
create table public.agents (
  id                       uuid primary key default uuid_generate_v4(),
  business_id              uuid not null references public.businesses(id) on delete cascade,
  name                     text not null default 'AI Receptionist',
  voice_id                 text default 'alloy',
  personality              text default 'professional',
  system_prompt            text,
  somali_system_prompt     text,
  greeting_message         text default 'Hello! How can I help you today?',
  greeting_message_somali  text default 'Asalaamu calaykum! Sideen kuu caawin karaa maanta?',
  is_active                boolean default true,
  model                    text default 'gpt-4o-realtime-preview',
  created_at               timestamptz default now(),
  updated_at               timestamptz default now()
);

-- ─── 5. APPOINTMENTS ────────────────────────────────────────
create table public.appointments (
  id              uuid primary key default uuid_generate_v4(),
  business_id     uuid not null references public.businesses(id) on delete cascade,
  customer_name   text not null,
  customer_phone  text,
  customer_email  text,
  service_id      uuid references public.services(id) on delete set null,
  date            date not null,
  time_slot       text not null,
  status          text not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled', 'completed')),
  notes           text,
  conversation_id uuid,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

-- ─── 6. CONVERSATIONS ──────────────────────────────────────
create table public.conversations (
  id                   uuid primary key default uuid_generate_v4(),
  business_id          uuid not null references public.businesses(id) on delete cascade,
  agent_id             uuid references public.agents(id) on delete set null,
  customer_identifier  text,
  transcript           jsonb default '[]'::jsonb,
  summary              text,
  sentiment            text default 'neutral' check (sentiment in ('positive', 'neutral', 'negative')),
  duration_seconds     integer default 0,
  language             text default 'so',
  appointment_booked   boolean default false,
  created_at           timestamptz default now()
);

-- ─── 7. WIDGETS ─────────────────────────────────────────────
create table public.widgets (
  id                    uuid primary key default uuid_generate_v4(),
  business_id           uuid not null references public.businesses(id) on delete cascade,
  position              text default 'bottom-right' check (position in ('bottom-right', 'bottom-left')),
  primary_color         text default '#22c55e',
  greeting_text         text default 'Talk to AI',
  greeting_text_somali  text default 'La hadal AI-ga',
  is_active             boolean default true,
  allowed_domains       text[] default '{}',
  created_at            timestamptz default now(),
  updated_at            timestamptz default now()
);

-- ─── INDEXES ────────────────────────────────────────────────
create index idx_businesses_owner on public.businesses(owner_id);
create index idx_services_business on public.services(business_id);
create index idx_faqs_business on public.faqs(business_id);
create index idx_agents_business on public.agents(business_id);
create index idx_appointments_business on public.appointments(business_id);
create index idx_appointments_date on public.appointments(date);
create index idx_appointments_status on public.appointments(status);
create index idx_conversations_business on public.conversations(business_id);
create index idx_conversations_created on public.conversations(created_at);
create index idx_widgets_business on public.widgets(business_id);

-- ─── ROW LEVEL SECURITY ────────────────────────────────────
alter table public.businesses enable row level security;
alter table public.services enable row level security;
alter table public.faqs enable row level security;
alter table public.agents enable row level security;
alter table public.appointments enable row level security;
alter table public.conversations enable row level security;
alter table public.widgets enable row level security;

-- Businesses: owners can CRUD their own
create policy "Users can view own business" on public.businesses
  for select using (auth.uid() = owner_id);
create policy "Users can insert own business" on public.businesses
  for insert with check (auth.uid() = owner_id);
create policy "Users can update own business" on public.businesses
  for update using (auth.uid() = owner_id);
create policy "Users can delete own business" on public.businesses
  for delete using (auth.uid() = owner_id);

-- Services: business owners can CRUD
create policy "Owners can manage services" on public.services
  for all using (
    business_id in (select id from public.businesses where owner_id = auth.uid())
  );
-- Public read for widget API (via service role)
create policy "Public can read active services" on public.services
  for select using (is_active = true);

-- FAQs: business owners can CRUD
create policy "Owners can manage faqs" on public.faqs
  for all using (
    business_id in (select id from public.businesses where owner_id = auth.uid())
  );
create policy "Public can read active faqs" on public.faqs
  for select using (is_active = true);

-- Agents: business owners can CRUD
create policy "Owners can manage agents" on public.agents
  for all using (
    business_id in (select id from public.businesses where owner_id = auth.uid())
  );
create policy "Public can read active agents" on public.agents
  for select using (is_active = true);

-- Appointments: business owners can CRUD
create policy "Owners can manage appointments" on public.appointments
  for all using (
    business_id in (select id from public.businesses where owner_id = auth.uid())
  );
-- Allow inserts from widget (service role handles this)
create policy "Service role can insert appointments" on public.appointments
  for insert with check (true);

-- Conversations: business owners can view
create policy "Owners can manage conversations" on public.conversations
  for all using (
    business_id in (select id from public.businesses where owner_id = auth.uid())
  );
create policy "Service role can insert conversations" on public.conversations
  for insert with check (true);

-- Widgets: business owners can CRUD
create policy "Owners can manage widgets" on public.widgets
  for all using (
    business_id in (select id from public.businesses where owner_id = auth.uid())
  );
create policy "Public can read active widgets" on public.widgets
  for select using (is_active = true);

-- ─── UPDATED_AT TRIGGER ────────────────────────────────────
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_updated_at before update on public.businesses
  for each row execute function public.handle_updated_at();
create trigger set_updated_at before update on public.services
  for each row execute function public.handle_updated_at();
create trigger set_updated_at before update on public.faqs
  for each row execute function public.handle_updated_at();
create trigger set_updated_at before update on public.agents
  for each row execute function public.handle_updated_at();
create trigger set_updated_at before update on public.appointments
  for each row execute function public.handle_updated_at();
create trigger set_updated_at before update on public.widgets
  for each row execute function public.handle_updated_at();
