-- Profiles table (extends auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  plan text default 'free' check (plan in ('free', 'premium')),
  stripe_customer_id text,
  created_at timestamptz default now()
);

-- Goals
create table public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  type text not null check (type in ('save', 'debt', 'invest', 'custom')),
  title text not null,
  target_amount numeric,
  target_date date,
  monthly_contribution numeric,
  status text default 'active' check (status in ('active', 'completed', 'paused')),
  created_at timestamptz default now()
);

-- Accounts
create table public.accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  plaid_account_id text,
  name text not null,
  type text check (type in ('checking', 'savings', 'credit', 'investment')),
  current_balance numeric default 0,
  institution_name text,
  last_synced_at timestamptz
);

-- Transactions
create table public.transactions (
  id uuid primary key default gen_random_uuid(),
  account_id uuid references public.accounts(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  plaid_transaction_id text unique,
  amount numeric not null,
  category text,
  merchant_name text,
  description text,
  date date not null,
  is_recurring boolean default false
);

-- AI-generated plans
create table public.plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  summary text,
  recommendations jsonb,
  raw_ai_response text,
  created_at timestamptz default now()
);

-- Agent actions (premium)
create table public.agent_actions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  action_type text check (action_type in ('savings_transfer', 'debt_payment', 'rebalance_suggestion')),
  description text,
  status text default 'pending' check (status in ('pending', 'executed', 'failed')),
  executed_at timestamptz,
  metadata jsonb
);

-- Affiliate recommendations
create table public.recommendations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  product_type text check (product_type in ('credit_card', 'loan', 'investment', 'insurance')),
  product_name text,
  rationale text,
  affiliate_url text,
  commission_min numeric,
  commission_max numeric,
  clicked_at timestamptz,
  converted_at timestamptz,
  shown_at timestamptz default now()
);

-- -----------------------------------------------
-- Row Level Security
-- -----------------------------------------------

alter table public.profiles enable row level security;
alter table public.goals enable row level security;
alter table public.accounts enable row level security;
alter table public.transactions enable row level security;
alter table public.plans enable row level security;
alter table public.agent_actions enable row level security;
alter table public.recommendations enable row level security;

-- Profiles: users can only see/edit their own
create policy "profiles: own row" on public.profiles
  for all using (auth.uid() = id);

-- Goals
create policy "goals: own rows" on public.goals
  for all using (auth.uid() = user_id);

-- Accounts
create policy "accounts: own rows" on public.accounts
  for all using (auth.uid() = user_id);

-- Transactions
create policy "transactions: own rows" on public.transactions
  for all using (auth.uid() = user_id);

-- Plans
create policy "plans: own rows" on public.plans
  for all using (auth.uid() = user_id);

-- Agent actions
create policy "agent_actions: own rows" on public.agent_actions
  for all using (auth.uid() = user_id);

-- Recommendations
create policy "recommendations: own rows" on public.recommendations
  for all using (auth.uid() = user_id);

-- -----------------------------------------------
-- Auto-create profile on signup
-- -----------------------------------------------

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
