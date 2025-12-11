-- Enums
create type role as enum ('student','teacher','admin');
create type lesson_status as enum ('draft','published');
create type moderation_status as enum ('submitted','approved','rejected','published');

-- Profiles
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  display_name text,
  role role not null default 'student',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists profiles_role_idx on public.profiles(role);

-- Lessons
create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  lesson_id text not null unique,
  language text not null default 'sanskrit',
  level text not null,
  chapter_number int not null,
  slug text not null,
  title text not null,
  goal_vocabulary_md text,
  examples_md text,
  tips_md text,
  dialogue_md text,
  image_url text,
  status lesson_status not null default 'draft',
  "order" int not null default 0,
  quiz_json jsonb,
  quiz_version int not null default 0,
  created_by uuid references public.profiles(id),
  updated_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists lessons_level_chapter_idx on public.lessons(level, chapter_number);
create index if not exists lessons_status_idx on public.lessons(status);
create unique index if not exists lessons_chapter_slug_uq on public.lessons(chapter_number, slug);

-- Lesson Revisions
create table if not exists public.lesson_revisions (
  id bigserial primary key,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  editor_id uuid references public.profiles(id),
  snapshot jsonb not null,
  commit_message text not null default '',
  created_at timestamptz not null default now()
);
create index if not exists lesson_revisions_lesson_idx on public.lesson_revisions(lesson_id);

-- Parsed meta links from markdown fences (optional fast lookup)
create table if not exists public.lesson_meta_links (
  id bigserial primary key,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  type text not null check (type in ('youtube','audio','quiz','flashcards','roleplay','storybook','link')),
  label text,
  url text not null,
  created_at timestamptz not null default now()
);
create index if not exists lesson_meta_links_lesson_idx on public.lesson_meta_links(lesson_id);

-- Community resources
create table if not exists public.flashcard_sets (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  language text,
  level text,
  author_id uuid references public.profiles(id),
  status moderation_status not null default 'submitted',
  visibility text not null default 'draft' check (visibility in ('draft','published','private')),
  like_count int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.flashcards (
  id uuid primary key default gen_random_uuid(),
  set_id uuid not null references public.flashcard_sets(id) on delete cascade,
  front_md text not null,
  back_md text not null,
  image_url text,
  audio_url text,
  "order" int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists flashcards_set_idx on public.flashcards(set_id);

create table if not exists public.roleplays (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description_md text,
  language text,
  level text,
  author_id uuid references public.profiles(id),
  status moderation_status not null default 'submitted',
  visibility text not null default 'draft' check (visibility in ('draft','published','private')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.roleplay_lines (
  id uuid primary key default gen_random_uuid(),
  roleplay_id uuid not null references public.roleplays(id) on delete cascade,
  speaker text,
  line_md text not null,
  audio_url text,
  "order" int not null default 0
);
create index if not exists roleplay_lines_roleplay_idx on public.roleplay_lines(roleplay_id);

create table if not exists public.community_quizzes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description_md text,
  author_id uuid references public.profiles(id),
  status moderation_status not null default 'submitted',
  visibility text not null default 'draft' check (visibility in ('draft','published','private')),
  questions_json jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.storybooks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description_md text,
  language text,
  level text,
  author_id uuid references public.profiles(id),
  status moderation_status not null default 'submitted',
  visibility text not null default 'draft' check (visibility in ('draft','published','private')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.storybook_pages (
  id uuid primary key default gen_random_uuid(),
  storybook_id uuid not null references public.storybooks(id) on delete cascade,
  image_url text,
  caption_en_md text,
  "order" int not null default 0
);
create index if not exists storybook_pages_storybook_idx on public.storybook_pages(storybook_id);

-- Link resources to lessons
create table if not exists public.lesson_resources (
  id bigserial primary key,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  resource_type text not null check (resource_type in ('flashcard_set','roleplay','community_quiz','storybook')),
  resource_id uuid not null,
  "order" int not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists lesson_resources_lesson_idx on public.lesson_resources(lesson_id);

-- RLS policies (sketch; adjust in Supabase SQL editor)
alter table public.profiles enable row level security;
alter table public.lessons enable row level security;
alter table public.lesson_revisions enable row level security;
alter table public.lesson_meta_links enable row level security;
alter table public.flashcard_sets enable row level security;
alter table public.flashcards enable row level security;
alter table public.roleplays enable row level security;
alter table public.roleplay_lines enable row level security;
alter table public.community_quizzes enable row level security;
alter table public.storybooks enable row level security;
alter table public.storybook_pages enable row level security;
alter table public.lesson_resources enable row level security;

-- Example policies (implement in Supabase with auth.uid())
-- Public read of published lessons
-- create policy lessons_public_read on public.lessons for select using (status = 'published');
-- Teacher read/write
-- create policy lessons_teacher_rw on public.lessons for all using (
--   exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('teacher','admin'))
-- ) with check (
--   exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('teacher','admin'))
-- );




