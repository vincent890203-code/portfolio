-- 電子報訂閱者表。在 Supabase SQL Editor 貼上執行。
-- 匿名訪客只能「寫入」(訂閱);只有登入的你能讀名單。

create table if not exists subscribers (
  id         uuid primary key default gen_random_uuid(),
  email      text unique not null,
  source     text default 'site',      -- 從哪訂閱的(blog / homepage…)
  status     text not null default 'active' check (status in ('active','unsubscribed')),
  created_at timestamptz default now()
);
create index if not exists subscribers_created_idx on subscribers(created_at desc);

alter table subscribers enable row level security;

-- 匿名:只能 INSERT(訂閱),不能讀名單。
drop policy if exists anon_subscribe on subscribers;
create policy anon_subscribe on subscribers for insert to anon with check (true);

-- 擁有者:可讀寫全部。
drop policy if exists owner_all_subscribers on subscribers;
create policy owner_all_subscribers on subscribers for all to authenticated using (true) with check (true);
