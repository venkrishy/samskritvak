-- User Progress and Activity Tracking Schema
-- This schema enables tracking user progress, dashboard functionality, and "Continue where I left off"

-- Create user_progress table to track lesson completion and current position
CREATE TABLE IF NOT EXISTS public.user_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  chapter_number INT NOT NULL,
  topic_number TEXT NOT NULL,
  is_completed BOOLEAN DEFAULT FALSE,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ NULL,
  last_accessed_at TIMESTAMPTZ DEFAULT NOW(),
  time_spent_seconds INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Ensure one progress record per user per topic
  UNIQUE(user_id, chapter_number, topic_number)
);

-- Create user_activity table to track user actions and recent activity
CREATE TABLE IF NOT EXISTS public.user_activity (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL CHECK (activity_type IN (
    'lesson_started', 
    'lesson_completed', 
    'lesson_accessed',
    'chapter_started',
    'chapter_completed',
    'dashboard_accessed',
    'profile_updated'
  )),
  chapter_number INT NULL,
  topic_number TEXT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user_preferences table for account settings
CREATE TABLE IF NOT EXISTS public.user_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  display_name TEXT,
  preferred_language TEXT DEFAULT 'en',
  notifications_enabled BOOLEAN DEFAULT TRUE,
  email_notifications BOOLEAN DEFAULT TRUE,
  progress_reminders BOOLEAN DEFAULT TRUE,
  theme_preference TEXT DEFAULT 'light' CHECK (theme_preference IN ('light', 'dark', 'auto')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON public.user_progress (user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_chapter_topic ON public.user_progress (chapter_number, topic_number);
CREATE INDEX IF NOT EXISTS idx_user_progress_last_accessed ON public.user_progress (last_accessed_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_activity_user_id ON public.user_activity (user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_created_at ON public.user_activity (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_activity_type ON public.user_activity (activity_type);

-- Enable Row Level Security
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_progress
CREATE POLICY "Users can view their own progress" ON public.user_progress 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress" ON public.user_progress 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress" ON public.user_progress 
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own progress" ON public.user_progress 
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for user_activity
CREATE POLICY "Users can view their own activity" ON public.user_activity 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own activity" ON public.user_activity 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for user_preferences
CREATE POLICY "Users can view their own preferences" ON public.user_preferences 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own preferences" ON public.user_preferences 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences" ON public.user_preferences 
  FOR UPDATE USING (auth.uid() = user_id);

-- Helper functions for progress tracking
CREATE OR REPLACE FUNCTION public.get_user_progress(user_uuid UUID)
RETURNS TABLE (
  chapter_number INT,
  topic_number TEXT,
  is_completed BOOLEAN,
  last_accessed_at TIMESTAMPTZ,
  time_spent_seconds INT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    up.chapter_number,
    up.topic_number,
    up.is_completed,
    up.last_accessed_at,
    up.time_spent_seconds
  FROM public.user_progress up
  WHERE up.user_id = user_uuid
  ORDER BY up.last_accessed_at DESC;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_user_dashboard_stats(user_uuid UUID)
RETURNS TABLE (
  total_lessons BIGINT,
  completed_lessons BIGINT,
  current_chapter INT,
  current_topic TEXT,
  total_time_spent BIGINT,
  streak_days INT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  WITH user_stats AS (
    SELECT 
      COUNT(*) as total_lessons,
      COUNT(*) FILTER (WHERE is_completed = true) as completed_lessons,
      MAX(chapter_number) FILTER (WHERE is_completed = true) as current_chapter,
      MAX(topic_number) FILTER (WHERE is_completed = true) as current_topic,
      COALESCE(SUM(time_spent_seconds), 0) as total_time_spent
    FROM public.user_progress
    WHERE user_id = user_uuid
  ),
  streak_data AS (
    SELECT COUNT(DISTINCT DATE(completed_at)) as streak_days
    FROM public.user_progress
    WHERE user_id = user_uuid 
      AND is_completed = true 
      AND completed_at >= CURRENT_DATE - INTERVAL '30 days'
  )
  SELECT 
    us.total_lessons,
    us.completed_lessons,
    us.current_chapter,
    us.current_topic,
    us.total_time_spent,
    sd.streak_days
  FROM user_stats us, streak_data sd;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_recent_activity(user_uuid UUID, limit_count INT DEFAULT 10)
RETURNS TABLE (
  activity_type TEXT,
  chapter_number INT,
  topic_number TEXT,
  created_at TIMESTAMPTZ,
  metadata JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ua.activity_type,
    ua.chapter_number,
    ua.topic_number,
    ua.created_at,
    ua.metadata
  FROM public.user_activity ua
  WHERE ua.user_id = user_uuid
  ORDER BY ua.created_at DESC
  LIMIT limit_count;
END;
$$;

-- Function to update user progress
CREATE OR REPLACE FUNCTION public.update_user_progress(
  user_uuid UUID,
  chapter_num INT,
  topic_num TEXT,
  is_comp BOOLEAN DEFAULT FALSE,
  time_spent INT DEFAULT 0
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.user_progress (
    user_id, 
    chapter_number, 
    topic_number, 
    is_completed, 
    last_accessed_at,
    time_spent_seconds,
    completed_at
  ) VALUES (
    user_uuid,
    chapter_num,
    topic_num,
    is_comp,
    NOW(),
    time_spent,
    CASE WHEN is_comp THEN NOW() ELSE NULL END
  )
  ON CONFLICT (user_id, chapter_number, topic_number)
  DO UPDATE SET
    is_completed = EXCLUDED.is_completed,
    last_accessed_at = NOW(),
    time_spent_seconds = user_progress.time_spent_seconds + EXCLUDED.time_spent_seconds,
    completed_at = CASE 
      WHEN EXCLUDED.is_completed AND user_progress.completed_at IS NULL THEN NOW()
      ELSE user_progress.completed_at
    END,
    updated_at = NOW();
    
  -- Log activity
  INSERT INTO public.user_activity (
    user_id,
    activity_type,
    chapter_number,
    topic_number,
    metadata
  ) VALUES (
    user_uuid,
    CASE WHEN is_comp THEN 'lesson_completed' ELSE 'lesson_accessed' END,
    chapter_num,
    topic_num,
    jsonb_build_object('time_spent', time_spent, 'is_completed', is_comp)
  );
END;
$$;

