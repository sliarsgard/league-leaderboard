create table public.test (
  id uuid primary key default uuid_generate_v4(),
  name text not null
);