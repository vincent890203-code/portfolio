-- 自訂事件表(自建觀測)。在 Supabase SQL Editor 貼上執行。
-- 匿名訪客只能「寫入」事件(收集數據);只有登入的你能讀(在 /admin 儀表板看)。

create table if not exists events (
  id         bigint generated always as identity primary key,
  type       text not null,               -- page_view / post_read / graph_node_click ...
  path       text,
  meta       jsonb default '{}',
  referrer   text,
  ua         text,
  created_at timestamptz default now()
);
create index if not exists events_created_idx on events(created_at);
create index if not exists events_type_idx on events(type);

alter table events enable row level security;

-- 匿名:只能 INSERT(寫事件),不能讀。
drop policy if exists anon_insert_events on events;
create policy anon_insert_events on events for insert to anon with check (true);

-- 擁有者(登入的你):可讀寫全部。
drop policy if exists owner_all_events on events;
create policy owner_all_events on events for all to authenticated using (true) with check (true);
