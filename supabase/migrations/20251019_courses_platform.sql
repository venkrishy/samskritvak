-- TattvaJnana Course Platform Database Schema
-- Migration: 20251019_courses_platform.sql

-- Create Courses Table
CREATE TABLE public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  language TEXT NOT NULL DEFAULT 'sanskrit',
  thumbnail_url TEXT,
  preview_video_url TEXT,
  instructor_id UUID REFERENCES public.profiles(id),
  price_usd DECIMAL(10,2) NOT NULL DEFAULT 0,
  lemon_squeezy_product_id TEXT,
  lemon_squeezy_variant_id TEXT,
  is_published BOOLEAN DEFAULT false,
  is_waitlist BOOLEAN DEFAULT false,
  waitlist_description TEXT,
  total_chapters INTEGER DEFAULT 0,
  total_lessons INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Course Chapters Table
CREATE TABLE public.course_chapters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  chapter_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  is_free BOOLEAN DEFAULT false,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Course Lessons Table
CREATE TABLE public.course_lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chapter_id UUID REFERENCES public.course_chapters(id) ON DELETE CASCADE,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  lesson_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  content_type TEXT CHECK (content_type IN ('video', 'text', 'quiz', 'live', 'document')),
  content_url TEXT,
  google_doc_url TEXT,
  duration_minutes INTEGER,
  is_free BOOLEAN DEFAULT false,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Course Enrollments Table
CREATE TABLE public.course_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  last_accessed_at TIMESTAMPTZ,
  progress_percentage DECIMAL(5,2) DEFAULT 0,
  UNIQUE(user_id, course_id)
);

-- Create Course Payments Table
CREATE TABLE public.course_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id),
  course_id UUID REFERENCES public.courses(id),
  lemon_squeezy_order_id TEXT UNIQUE,
  amount_usd DECIMAL(10,2),
  status TEXT CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  payment_date TIMESTAMPTZ DEFAULT NOW()
);

-- Create Course Waitlist Table
CREATE TABLE public.course_waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  course_slug TEXT NOT NULL,
  name TEXT,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  notified BOOLEAN DEFAULT false
);

-- Create Live Sessions Table
CREATE TABLE public.live_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES public.courses(id),
  lesson_id UUID REFERENCES public.course_lessons(id),
  instructor_id UUID REFERENCES public.profiles(id),
  title TEXT NOT NULL,
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  meeting_url TEXT,
  whiteboard_url TEXT,
  status TEXT CHECK (status IN ('scheduled', 'live', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Lesson Progress Table
CREATE TABLE public.lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES public.course_lessons(id) ON DELETE CASCADE,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT false,
  progress_percentage DECIMAL(5,2) DEFAULT 0,
  time_spent_minutes INTEGER DEFAULT 0,
  last_accessed_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  UNIQUE(user_id, lesson_id)
);

-- Create Indexes for Performance
CREATE INDEX idx_courses_slug ON public.courses(slug);
CREATE INDEX idx_courses_language ON public.courses(language);
CREATE INDEX idx_courses_published ON public.courses(is_published);
CREATE INDEX idx_courses_waitlist ON public.courses(is_waitlist);

CREATE INDEX idx_course_chapters_course_id ON public.course_chapters(course_id);
CREATE INDEX idx_course_chapters_order ON public.course_chapters(course_id, order_index);

CREATE INDEX idx_course_lessons_course_id ON public.course_lessons(course_id);
CREATE INDEX idx_course_lessons_chapter_id ON public.course_lessons(chapter_id);
CREATE INDEX idx_course_lessons_order ON public.course_lessons(course_id, order_index);

CREATE INDEX idx_course_enrollments_user_id ON public.course_enrollments(user_id);
CREATE INDEX idx_course_enrollments_course_id ON public.course_enrollments(course_id);

CREATE INDEX idx_course_payments_user_id ON public.course_payments(user_id);
CREATE INDEX idx_course_payments_course_id ON public.course_payments(course_id);
CREATE INDEX idx_course_payments_status ON public.course_payments(status);

CREATE INDEX idx_course_waitlist_course_slug ON public.course_waitlist(course_slug);
CREATE INDEX idx_course_waitlist_email ON public.course_waitlist(email);

CREATE INDEX idx_live_sessions_course_id ON public.live_sessions(course_id);
CREATE INDEX idx_live_sessions_instructor_id ON public.live_sessions(instructor_id);
CREATE INDEX idx_live_sessions_scheduled ON public.live_sessions(scheduled_at);

CREATE INDEX idx_lesson_progress_user_id ON public.lesson_progress(user_id);
CREATE INDEX idx_lesson_progress_course_id ON public.lesson_progress(course_id);
CREATE INDEX idx_lesson_progress_lesson_id ON public.lesson_progress(lesson_id);

-- Enable Row Level Security
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_waitlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.live_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Courses
CREATE POLICY courses_public_read ON public.courses
  FOR SELECT USING (is_published = true);

CREATE POLICY courses_authenticated_read ON public.courses
  FOR SELECT TO authenticated USING (true);

CREATE POLICY courses_teacher_manage ON public.courses
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() 
      AND p.role IN ('teacher', 'admin')
    )
  );

-- RLS Policies for Course Chapters
CREATE POLICY course_chapters_public_read ON public.course_chapters
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.courses c 
      WHERE c.id = course_id 
      AND c.is_published = true
    )
  );

CREATE POLICY course_chapters_teacher_manage ON public.course_chapters
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() 
      AND p.role IN ('teacher', 'admin')
    )
  );

-- RLS Policies for Course Lessons
CREATE POLICY course_lessons_public_read ON public.course_lessons
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.courses c 
      WHERE c.id = course_id 
      AND c.is_published = true
    )
  );

CREATE POLICY course_lessons_teacher_manage ON public.course_lessons
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() 
      AND p.role IN ('teacher', 'admin')
    )
  );

-- RLS Policies for Enrollments
CREATE POLICY course_enrollments_user_read ON public.course_enrollments
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY course_enrollments_user_manage ON public.course_enrollments
  FOR ALL TO authenticated
  USING (user_id = auth.uid());

-- RLS Policies for Payments
CREATE POLICY course_payments_user_read ON public.course_payments
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- RLS Policies for Waitlist
CREATE POLICY course_waitlist_public_insert ON public.course_waitlist
  FOR INSERT WITH CHECK (true);

CREATE POLICY course_waitlist_admin_read ON public.course_waitlist
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() 
      AND p.role = 'admin'
    )
  );

-- RLS Policies for Live Sessions
CREATE POLICY live_sessions_authenticated_read ON public.live_sessions
  FOR SELECT TO authenticated USING (true);

CREATE POLICY live_sessions_teacher_manage ON public.live_sessions
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() 
      AND p.role IN ('teacher', 'admin')
    )
  );

-- RLS Policies for Lesson Progress
CREATE POLICY lesson_progress_user_manage ON public.lesson_progress
  FOR ALL TO authenticated
  USING (user_id = auth.uid());

-- Grant Permissions
GRANT SELECT ON public.courses TO anon;
GRANT SELECT ON public.courses TO authenticated;
GRANT ALL ON public.courses TO authenticated;

GRANT SELECT ON public.course_chapters TO anon;
GRANT SELECT ON public.course_chapters TO authenticated;
GRANT ALL ON public.course_chapters TO authenticated;

GRANT SELECT ON public.course_lessons TO anon;
GRANT SELECT ON public.course_lessons TO authenticated;
GRANT ALL ON public.course_lessons TO authenticated;

GRANT ALL ON public.course_enrollments TO authenticated;
GRANT ALL ON public.course_payments TO authenticated;
GRANT INSERT ON public.course_waitlist TO anon;
GRANT ALL ON public.course_waitlist TO authenticated;
GRANT ALL ON public.live_sessions TO authenticated;
GRANT ALL ON public.lesson_progress TO authenticated;

-- Create Helper Functions
CREATE OR REPLACE FUNCTION public.get_course_by_slug(course_slug TEXT)
RETURNS TABLE (
  id UUID,
  slug TEXT,
  title TEXT,
  subtitle TEXT,
  description TEXT,
  language TEXT,
  thumbnail_url TEXT,
  preview_video_url TEXT,
  instructor_id UUID,
  price_usd DECIMAL(10,2),
  is_published BOOLEAN,
  is_waitlist BOOLEAN,
  waitlist_description TEXT,
  total_chapters INTEGER,
  total_lessons INTEGER
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 
    c.id,
    c.slug,
    c.title,
    c.subtitle,
    c.description,
    c.language,
    c.thumbnail_url,
    c.preview_video_url,
    c.instructor_id,
    c.price_usd,
    c.is_published,
    c.is_waitlist,
    c.waitlist_description,
    c.total_chapters,
    c.total_lessons
  FROM public.courses c
  WHERE c.slug = course_slug;
$$;

CREATE OR REPLACE FUNCTION public.get_course_curriculum(course_uuid UUID)
RETURNS TABLE (
  chapter_id UUID,
  chapter_number INTEGER,
  chapter_title TEXT,
  chapter_description TEXT,
  chapter_is_free BOOLEAN,
  lesson_id UUID,
  lesson_number INTEGER,
  lesson_title TEXT,
  lesson_content_type TEXT,
  lesson_is_free BOOLEAN,
  lesson_order_index INTEGER
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 
    cc.id as chapter_id,
    cc.chapter_number,
    cc.title as chapter_title,
    cc.description as chapter_description,
    cc.is_free as chapter_is_free,
    cl.id as lesson_id,
    cl.lesson_number,
    cl.title as lesson_title,
    cl.content_type as lesson_content_type,
    cl.is_free as lesson_is_free,
    cl.order_index as lesson_order_index
  FROM public.course_chapters cc
  LEFT JOIN public.course_lessons cl ON cc.id = cl.chapter_id
  WHERE cc.course_id = course_uuid
  ORDER BY cc.order_index, cl.order_index;
$$;

CREATE OR REPLACE FUNCTION public.check_user_enrollment(user_uuid UUID, course_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.course_enrollments 
    WHERE user_id = user_uuid AND course_id = course_uuid
  );
$$;

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION public.get_course_by_slug(TEXT) TO anon;
GRANT EXECUTE ON FUNCTION public.get_course_by_slug(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_course_curriculum(UUID) TO anon;
GRANT EXECUTE ON FUNCTION public.get_course_curriculum(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.check_user_enrollment(UUID, UUID) TO authenticated;




