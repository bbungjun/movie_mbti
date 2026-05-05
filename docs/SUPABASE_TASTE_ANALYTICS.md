# Supabase Taste Analytics

Run this SQL in the Supabase SQL editor before enabling result collection.

```sql
create table if not exists public.taste_results (
  id text primary key,
  session_id text not null,
  mbti_code text not null,
  axis_results jsonb not null,
  top_traits text[] not null default '{}',
  skipped_content_ids text[] not null default '{}',
  recommended_content_ids text[] not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists public.taste_ratings (
  id bigint generated always as identity primary key,
  result_id text not null references public.taste_results(id) on delete cascade,
  session_id text not null,
  content_id text not null,
  rating numeric not null check (rating >= 1 and rating <= 5),
  created_at timestamptz not null default now()
);

create index if not exists taste_results_mbti_code_idx
  on public.taste_results (mbti_code);

create index if not exists taste_results_created_at_idx
  on public.taste_results (created_at);

create index if not exists taste_ratings_content_id_idx
  on public.taste_ratings (content_id);

create index if not exists taste_ratings_result_id_idx
  on public.taste_ratings (result_id);
```

Recommended environment variables:

```txt
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

`SUPABASE_SERVICE_ROLE_KEY` should only exist on the server or deployment
environment. If you do not add it, inserts depend on your Supabase RLS policy for
the anon key.

Example analysis queries:

```sql
-- MBTI distribution
select mbti_code, count(*) as total
from public.taste_results
group by mbti_code
order by total desc;

-- Average rating by content
select content_id, count(*) as votes, round(avg(rating), 2) as average_rating
from public.taste_ratings
group by content_id
order by average_rating desc, votes desc;

-- Content preferences by MBTI code
select
  tr.mbti_code,
  rt.content_id,
  count(*) as votes,
  round(avg(rt.rating), 2) as average_rating
from public.taste_ratings rt
join public.taste_results tr on tr.id = rt.result_id
group by tr.mbti_code, rt.content_id
order by tr.mbti_code, average_rating desc, votes desc;
```
