create table if not exists public.portfolios (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  template_id text not null,
  title text not null,
  slug text not null unique,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  content jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now()
);

alter table public.portfolios enable row level security;
alter table public.contact_messages enable row level security;

create policy "Users can read their own portfolios"
  on public.portfolios for select
  using (auth.uid() = user_id or (status = 'published' and user_id is not null));

create policy "Users can create their own portfolios"
  on public.portfolios for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own portfolios"
  on public.portfolios for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own portfolios"
  on public.portfolios for delete
  using (auth.uid() = user_id);

create policy "Anyone can submit contact messages"
  on public.contact_messages for insert
  with check (true);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists portfolios_set_updated_at on public.portfolios;
create trigger portfolios_set_updated_at
before update on public.portfolios
for each row execute function public.set_updated_at();
