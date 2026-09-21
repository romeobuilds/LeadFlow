-- LeadFlow MVP migration: profiles, leads, notes, activities + RLS + triggers
-- Run in Supabase Dashboard → SQL Editor (or `supabase db push` if using the CLI).

-- ---------------------------------------------------------------- profiles
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now()
);

-- -------------------------------------------------------------------- leads
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  email text,
  phone text,
  company text,
  value numeric(12, 2) not null default 0,
  stage text not null default 'new'
    check (stage in ('new', 'contacted', 'qualified', 'proposal', 'won', 'lost')),
  source text,
  priority text not null default 'medium'
    check (priority in ('low', 'medium', 'high')),
  expected_close date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists leads_user_id_idx on public.leads (user_id);
create index if not exists leads_stage_idx on public.leads (stage);
create index if not exists leads_created_at_idx on public.leads (created_at desc);

-- -------------------------------------------------------------------- notes
create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now()
);

create index if not exists notes_lead_id_idx on public.notes (lead_id);

-- --------------------------------------------------------------- activities
create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  type text not null
    check (type in ('created', 'stage_changed', 'note_added', 'updated')),
  description text,
  created_at timestamptz not null default now()
);

create index if not exists activities_lead_id_idx on public.activities (lead_id);

-- -------------------------------------------------------- updated_at trigger
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_leads_updated_at on public.leads;
create trigger set_leads_updated_at
  before update on public.leads
  for each row execute function public.handle_updated_at();

-- ------------------------------------------- auto-create profile on sign-up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- --------------------------------------- auto-activity on lead create/stage
create or replace function public.handle_lead_activity()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    insert into public.activities (lead_id, user_id, type, description)
    values (new.id, new.user_id, 'created', 'Lead created in ' || new.stage);
    return new;
  elsif tg_op = 'UPDATE' and old.stage is distinct from new.stage then
    insert into public.activities (lead_id, user_id, type, description)
    values (
      new.id,
      new.user_id,
      'stage_changed',
      'Moved from ' || old.stage || ' to ' || new.stage
    );
    return new;
  end if;
  return new;
end;
$$;

drop trigger if exists lead_activity_on_change on public.leads;
create trigger lead_activity_on_change
  after insert or update of stage on public.leads
  for each row execute function public.handle_lead_activity();

-- ---------------------------------------------------------------------- RLS
alter table public.profiles enable row level security;
alter table public.leads enable row level security;
alter table public.notes enable row level security;
alter table public.activities enable row level security;

-- Single-user workspace: users can only touch rows they own.
drop policy if exists "Users manage own profile" on public.profiles;
create policy "Users manage own profile"
  on public.profiles for all
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists "Users manage own leads" on public.leads;
create policy "Users manage own leads"
  on public.leads for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users manage own notes" on public.notes;
create policy "Users manage own notes"
  on public.notes for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users manage own activities" on public.activities;
create policy "Users manage own activities"
  on public.activities for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
