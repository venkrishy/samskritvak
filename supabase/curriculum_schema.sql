-- Drop existing lessons schema and create new curriculum-based schema
-- This matches the CSV structure with 14 columns

-- Drop existing tables that will be replaced
DROP TABLE IF EXISTS public.lesson_meta_links CASCADE;
DROP TABLE IF EXISTS public.lesson_revisions CASCADE;
DROP TABLE IF EXISTS public.lessons CASCADE;

-- Create new curriculum table matching CSV structure
CREATE TABLE public.curriculum (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chapter_order INTEGER NOT NULL,
  chapter_title TEXT NOT NULL,
  topic_order TEXT NOT NULL,
  topic_title TEXT NOT NULL,
  topic_description TEXT,
  topic_details TEXT,
  explanation TEXT,
  example TEXT,
  example_tips TEXT,
  dialogue TEXT,
  image_alt TEXT,
  image_name TEXT,
  image_url TEXT,
  image_prompt TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for efficient querying
CREATE INDEX idx_curriculum_chapter_order ON public.curriculum(chapter_order);
CREATE INDEX idx_curriculum_topic_order ON public.curriculum(topic_order);
CREATE INDEX idx_curriculum_chapter_topic ON public.curriculum(chapter_order, topic_order);

-- Enable RLS
ALTER TABLE public.curriculum ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY curriculum_public_read
  ON public.curriculum
  FOR SELECT
  USING (true);

-- Create policy for authenticated users to read
CREATE POLICY curriculum_authenticated_read
  ON public.curriculum
  FOR SELECT
  TO authenticated
  USING (true);

-- Create policy for teachers/admins to manage content
CREATE POLICY curriculum_teacher_manage
  ON public.curriculum
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() 
      AND p.role IN ('teacher', 'admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() 
      AND p.role IN ('teacher', 'admin')
    )
  );

-- Create a view for easy chapter/topic navigation
CREATE VIEW public.curriculum_navigation AS
SELECT 
  chapter_order,
  chapter_title,
  topic_order,
  topic_title,
  topic_description,
  image_name,
  image_url
FROM public.curriculum
ORDER BY chapter_order, topic_order;

-- Grant permissions
GRANT SELECT ON public.curriculum TO anon;
GRANT SELECT ON public.curriculum TO authenticated;
GRANT ALL ON public.curriculum TO authenticated;
GRANT SELECT ON public.curriculum_navigation TO anon;
GRANT SELECT ON public.curriculum_navigation TO authenticated;

-- Create a function to get lessons by chapter
CREATE OR REPLACE FUNCTION public.get_lessons_by_chapter(chapter_num INTEGER)
RETURNS TABLE (
  id UUID,
  chapter_order INTEGER,
  chapter_title TEXT,
  topic_order TEXT,
  topic_title TEXT,
  topic_description TEXT,
  topic_details TEXT,
  explanation TEXT,
  example TEXT,
  example_tips TEXT,
  dialogue TEXT,
  image_alt TEXT,
  image_name TEXT,
  image_url TEXT,
  image_prompt TEXT
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 
    c.id,
    c.chapter_order,
    c.chapter_title,
    c.topic_order,
    c.topic_title,
    c.topic_description,
    c.topic_details,
    c.explanation,
    c.example,
    c.example_tips,
    c.dialogue,
    c.image_alt,
    c.image_name,
    c.image_url,
    c.image_prompt
  FROM public.curriculum c
  WHERE c.chapter_order = chapter_num
  ORDER BY c.topic_order;
$$;

-- Create a function to get a specific lesson
CREATE OR REPLACE FUNCTION public.get_lesson(chapter_num INTEGER, topic_num TEXT)
RETURNS TABLE (
  id UUID,
  chapter_order INTEGER,
  chapter_title TEXT,
  topic_order TEXT,
  topic_title TEXT,
  topic_description TEXT,
  topic_details TEXT,
  explanation TEXT,
  example TEXT,
  example_tips TEXT,
  dialogue TEXT,
  image_alt TEXT,
  image_name TEXT,
  image_url TEXT,
  image_prompt TEXT
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 
    c.id,
    c.chapter_order,
    c.chapter_title,
    c.topic_order,
    c.topic_title,
    c.topic_description,
    c.topic_details,
    c.explanation,
    c.example,
    c.example_tips,
    c.dialogue,
    c.image_alt,
    c.image_name,
    c.image_url,
    c.image_prompt
  FROM public.curriculum c
  WHERE c.chapter_order = chapter_num 
    AND c.topic_order = topic_num
  LIMIT 1;
$$;

-- Create a function to get all chapters
CREATE OR REPLACE FUNCTION public.get_all_chapters()
RETURNS TABLE (
  chapter_order INTEGER,
  chapter_title TEXT,
  topic_count BIGINT
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 
    c.chapter_order,
    c.chapter_title,
    COUNT(*) as topic_count
  FROM public.curriculum c
  GROUP BY c.chapter_order, c.chapter_title
  ORDER BY c.chapter_order;
$$;

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION public.get_lessons_by_chapter(INTEGER) TO anon;
GRANT EXECUTE ON FUNCTION public.get_lessons_by_chapter(INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_lesson(INTEGER, TEXT) TO anon;
GRANT EXECUTE ON FUNCTION public.get_lesson(INTEGER, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_all_chapters() TO anon;
GRANT EXECUTE ON FUNCTION public.get_all_chapters() TO authenticated;
