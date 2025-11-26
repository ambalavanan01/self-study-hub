-- Create table for user interests
create table if not exists user_interests (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  interest text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for user_interests
alter table user_interests enable row level security;

-- Policies for user_interests
create policy "Users can view their own interests"
  on user_interests for select
  using (auth.uid() = user_id);

create policy "Users can insert their own interests"
  on user_interests for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their own interests"
  on user_interests for delete
  using (auth.uid() = user_id);
