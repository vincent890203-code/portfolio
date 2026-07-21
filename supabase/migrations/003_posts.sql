-- 部落格文章表(後台管理)。在 Supabase SQL Editor 貼上執行。
-- 公開站只讀 status='published';草稿只有登入的你看得到。上下架 = 切 status。

create table if not exists posts (
  id         uuid primary key default gen_random_uuid(),
  slug       text unique not null,
  title      text not null,
  date       date not null default current_date,
  summary    text default '',
  tags       text[] default '{}',
  body       text default '',            -- markdown 正文
  status     text not null default 'draft' check (status in ('draft','published')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists posts_status_date_idx on posts(status, date desc);

alter table posts enable row level security;

drop policy if exists public_read_published_posts on posts;
create policy public_read_published_posts on posts
  for select to anon using (status = 'published');

drop policy if exists owner_all_posts on posts;
create policy owner_all_posts on posts
  for all to authenticated using (true) with check (true);
