create policy if not exists lessons_public_read
  on public.lessons
  for select
  using (status = 'published');

create policy if not exists lesson_meta_links_public_read
  on public.lesson_meta_links
  for select
  using (
    exists (
      select 1 from public.lessons l
      where l.id = lesson_id and l.status = 'published'
    )
  );