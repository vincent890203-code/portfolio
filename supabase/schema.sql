-- 第二大腦 · Supabase schema
-- 在 Supabase Dashboard → SQL Editor 貼上執行即可建立。
-- 設計原則:公開站(anon)只讀 status='published';所有寫入限 authenticated(你本人)。
-- Python 管線用 service-role key 批次寫 draft;只有你在 /admin 審核後才 publish。

-- ── 擴充 ────────────────────────────────────────────────
create extension if not exists vector;

-- ── 知識圖譜節點 ────────────────────────────────────────
create table if not exists cards (
  id          text primary key,               -- 沿用 Heptabase card id(可追溯來源)
  title       text not null,
  summary     text,                           -- 去識別化後的摘要
  body        text,                           -- 去識別化後的正文(Phase 4 RAG 用)
  note_type   text not null default 'literature',  -- 分類結果(卡片盒類型)
  category    text,                           -- 架構主題(design-pattern / architecture-style…)
  section     text,
  degree      int default 0,
  gaps        jsonb default '[]',             -- 缺口分析結果
  focus_score real default 0,
  status      text not null default 'draft'
                check (status in ('draft','approved','published')),
  whiteboard  text,                           -- 來自哪張白板
  meta        jsonb default '{}',
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- ── 連線 ───────────────────────────────────────────────
create table if not exists edges (
  id      bigint generated always as identity primary key,
  src     text references cards(id) on delete cascade,
  dst     text references cards(id) on delete cascade,
  rel     text default 'connection',
  two_way boolean default false,
  label   text
);
create index if not exists edges_src_idx on edges(src);
create index if not exists edges_dst_idx on edges(dst);

-- ── 設定(你的控制面:白板、去識別化詞、門檻、分類覆寫)──
create table if not exists config (
  key        text primary key,               -- 'deid_terms' | 'whiteboards' | 'thresholds' | 'note_overrides'
  value      jsonb not null,
  updated_at timestamptz default now()
);

-- ── 每次同步/分析的稽核紀錄 ─────────────────────────────
create table if not exists analysis_runs (
  id          bigint generated always as identity primary key,
  kind        text,                           -- 'import' | 'classify' | 'gap' | 'embed'
  stats       jsonb,
  started_at  timestamptz default now(),
  finished_at timestamptz
);

-- ── Embeddings(Phase 4 RAG)─────────────────────────────
create table if not exists embeddings (
  card_id   text references cards(id) on delete cascade,
  chunk_idx int,
  content   text,
  embedding vector(1536),                     -- 依 embedding 模型維度調整
  primary key (card_id, chunk_idx)
);
create index if not exists embeddings_hnsw on embeddings using hnsw (embedding vector_cosine_ops);

-- ── Row Level Security ─────────────────────────────────
alter table cards         enable row level security;
alter table edges         enable row level security;
alter table config        enable row level security;
alter table analysis_runs enable row level security;
alter table embeddings    enable row level security;

-- 公開(anon):只讀 published 卡片,以及其相關連線。config / runs / embeddings 完全不對外。
drop policy if exists public_read_published_cards on cards;
create policy public_read_published_cards on cards
  for select to anon using (status = 'published');

drop policy if exists public_read_edges on edges;
create policy public_read_edges on edges
  for select to anon using (
    exists (select 1 from cards c where c.id = edges.src and c.status = 'published')
    and exists (select 1 from cards c where c.id = edges.dst and c.status = 'published')
  );

-- 擁有者(authenticated = 你):全部可讀寫。
drop policy if exists owner_all_cards on cards;
create policy owner_all_cards on cards for all to authenticated using (true) with check (true);
drop policy if exists owner_all_edges on edges;
create policy owner_all_edges on edges for all to authenticated using (true) with check (true);
drop policy if exists owner_all_config on config;
create policy owner_all_config on config for all to authenticated using (true) with check (true);
drop policy if exists owner_all_runs on analysis_runs;
create policy owner_all_runs on analysis_runs for all to authenticated using (true) with check (true);
drop policy if exists owner_all_embeddings on embeddings;
create policy owner_all_embeddings on embeddings for all to authenticated using (true) with check (true);
