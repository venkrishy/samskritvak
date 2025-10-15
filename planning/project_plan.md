# Sanskrit Learning Platform - Implementation Plan

## Database Schema (Supabase PostgreSQL)

All tables use `sanskrit_` prefix for namespace isolation.

### Core Tables

#### 1. `sanskrit_notion_data` - Static Content from Notion (multi-language ready)

```sql
CREATE TABLE sanskrit_notion_data (
  id TEXT PRIMARY KEY,                    -- Hierarchical: "1", "1.1", "1.1.1"
  level INTEGER NOT NULL,                 -- Depth: 1 (Level), 2 (Chapter), 3 (Topic)
  parent_id TEXT,                         -- Reference to parent (NULL for top-level)
  language_code TEXT NOT NULL DEFAULT 'sa', -- ISO 639-1 (e.g., 'sa' Sanskrit)
  dialect TEXT,                           -- Optional dialect tag
  title TEXT NOT NULL,
  content JSONB NOT NULL,                 -- Full Notion blocks as JSON
  order_index INTEGER NOT NULL,           -- Display order within parent
  r2_image_urls TEXT[],                   -- Cloudflare R2 public URLs for images
  r2_audio_urls TEXT[],                   -- Cloudflare R2 public URLs for teacher audio
  youtube_video_urls TEXT[],              -- YouTube embed URLs
  status TEXT DEFAULT 'draft',            -- draft, published, archived
  last_synced_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (parent_id) REFERENCES sanskrit_notion_data(id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX idx_sanskrit_notion_data_parent ON sanskrit_notion_data(parent_id);
CREATE INDEX idx_sanskrit_notion_data_level ON sanskrit_notion_data(level);
CREATE INDEX idx_sanskrit_notion_data_status ON sanskrit_notion_data(status);
CREATE INDEX idx_sanskrit_notion_data_lang_id ON sanskrit_notion_data(language_code, id);
CREATE INDEX idx_sanskrit_notion_data_order ON sanskrit_notion_data(parent_id, order_index);
```

#### 2. `sanskrit_users` - User Accounts with Roles (language preferences)

```sql
CREATE TYPE sanskrit_user_role AS ENUM ('STUDENT', 'TEACHER', 'SITE_ADMIN');

CREATE TABLE sanskrit_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_id UUID NOT NULL UNIQUE,          -- References auth.users in Supabase Auth
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  role sanskrit_user_role NOT NULL DEFAULT 'STUDENT',
  approved BOOLEAN DEFAULT FALSE,        -- Must be approved by SITE_ADMIN
  preferred_language_code TEXT DEFAULT 'sa',
  preferred_dialect TEXT,
  profile_image_url TEXT,                -- Cloudflare R2 URL for profile pic
  bio TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_login_at TIMESTAMP
);

-- Indexes
CREATE INDEX idx_sanskrit_users_role ON sanskrit_users(role);
CREATE INDEX idx_sanskrit_users_approved ON sanskrit_users(approved);
CREATE INDEX idx_sanskrit_users_email ON sanskrit_users(email);
```

#### 3. `sanskrit_teacher_students` - Teacher-Student Assignments (course language)

```sql
CREATE TABLE sanskrit_teacher_students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID NOT NULL REFERENCES sanskrit_users(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES sanskrit_users(id) ON DELETE CASCADE,
  assigned_by UUID NOT NULL REFERENCES sanskrit_users(id),  -- SITE_ADMIN who made assignment
  assigned_at TIMESTAMP DEFAULT NOW(),
  course_language_code TEXT DEFAULT 'sa',
  status TEXT DEFAULT 'active',          -- active, paused, completed
  notes TEXT,                            -- Admin notes about the assignment
  UNIQUE(teacher_id, student_id)         -- Prevent duplicate assignments
);

-- Indexes
CREATE INDEX idx_sanskrit_teacher_students_teacher ON sanskrit_teacher_students(teacher_id);
CREATE INDEX idx_sanskrit_teacher_students_student ON sanskrit_teacher_students(student_id);
CREATE INDEX idx_sanskrit_teacher_students_status ON sanskrit_teacher_students(status);
```

#### 4. `sanskrit_recordings` - Student Audio Recordings

```sql
CREATE TYPE sanskrit_recording_type AS ENUM ('STRUCTURED_EXERCISE', 'OPEN_PRACTICE');
CREATE TYPE sanskrit_recording_status AS ENUM ('PENDING', 'REVIEWED', 'ARCHIVED');

CREATE TABLE sanskrit_recordings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES sanskrit_users(id) ON DELETE CASCADE,
  teacher_id UUID NOT NULL REFERENCES sanskrit_users(id) ON DELETE CASCADE,
  topic_id TEXT NOT NULL REFERENCES sanskrit_notion_data(id),
  recording_type sanskrit_recording_type NOT NULL DEFAULT 'STRUCTURED_EXERCISE',
  audio_url TEXT NOT NULL,               -- Cloudflare R2 URL
  audio_duration_seconds INTEGER NOT NULL,  -- For quota tracking
  audio_size_bytes INTEGER NOT NULL,     -- For storage monitoring
  prompt_text TEXT,                      -- The exercise prompt student was responding to
  student_notes TEXT,                    -- Optional notes from student
  status sanskrit_recording_status DEFAULT 'PENDING',
  created_at TIMESTAMP DEFAULT NOW(),
  reviewed_at TIMESTAMP,
  metadata JSONB                         -- Flexible field for additional data
);

-- Indexes
CREATE INDEX idx_sanskrit_recordings_student ON sanskrit_recordings(student_id);
CREATE INDEX idx_sanskrit_recordings_teacher ON sanskrit_recordings(teacher_id);
CREATE INDEX idx_sanskrit_recordings_topic ON sanskrit_recordings(topic_id);
CREATE INDEX idx_sanskrit_recordings_status ON sanskrit_recordings(status);
CREATE INDEX idx_sanskrit_recordings_created ON sanskrit_recordings(created_at DESC);
```

#### 5. `sanskrit_feedback` - Teacher Feedback on Recordings

```sql
CREATE TABLE sanskrit_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recording_id UUID NOT NULL REFERENCES sanskrit_recordings(id) ON DELETE CASCADE,
  teacher_id UUID NOT NULL REFERENCES sanskrit_users(id) ON DELETE CASCADE,
  feedback_text TEXT NOT NULL,           -- Written feedback
  feedback_audio_url TEXT,               -- Cloudflare R2 URL for audio feedback (optional)
  audio_duration_seconds INTEGER,        -- For quota tracking
  audio_size_bytes INTEGER,              -- For storage monitoring
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),  -- Optional 1-5 rating
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_sanskrit_feedback_recording ON sanskrit_feedback(recording_id);
CREATE INDEX idx_sanskrit_feedback_teacher ON sanskrit_feedback(teacher_id);
CREATE INDEX idx_sanskrit_feedback_created ON sanskrit_feedback(created_at DESC);
```

#### 6. `sanskrit_progress` - Student Progress Tracking

```sql
CREATE TABLE sanskrit_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES sanskrit_users(id) ON DELETE CASCADE,
  topic_id TEXT NOT NULL REFERENCES sanskrit_notion_data(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT FALSE,
  completion_percentage INTEGER DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
  last_accessed_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  time_spent_seconds INTEGER DEFAULT 0,  -- Total time spent on topic
  UNIQUE(student_id, topic_id)           -- One progress record per student per topic
);

-- Indexes
CREATE INDEX idx_sanskrit_progress_student ON sanskrit_progress(student_id);
CREATE INDEX idx_sanskrit_progress_topic ON sanskrit_progress(topic_id);
CREATE INDEX idx_sanskrit_progress_completed ON sanskrit_progress(completed);
CREATE INDEX idx_sanskrit_progress_last_accessed ON sanskrit_progress(last_accessed_at DESC);
```

#### 7. `sanskrit_audio_quotas` - Audio Usage Tracking per Student-Teacher Pair

```sql
CREATE TABLE sanskrit_audio_quotas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID NOT NULL REFERENCES sanskrit_users(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES sanskrit_users(id) ON DELETE CASCADE,
  quota_seconds INTEGER NOT NULL DEFAULT 3600,  -- 1 hour = 3600 seconds (parametrizable)
  student_used_seconds INTEGER DEFAULT 0,
  teacher_used_seconds INTEGER DEFAULT 0,
  total_used_seconds INTEGER GENERATED ALWAYS AS (student_used_seconds + teacher_used_seconds) STORED,
  remaining_seconds INTEGER GENERATED ALWAYS AS (quota_seconds - (student_used_seconds + teacher_used_seconds)) STORED,
  last_reset_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(teacher_id, student_id)
);

-- Indexes
CREATE INDEX idx_sanskrit_audio_quotas_teacher ON sanskrit_audio_quotas(teacher_id);
CREATE INDEX idx_sanskrit_audio_quotas_student ON sanskrit_audio_quotas(student_id);
CREATE INDEX idx_sanskrit_audio_quotas_remaining ON sanskrit_audio_quotas(remaining_seconds);
```

### Supporting Tables

#### 8. `sanskrit_system_config` - Runtime Configuration

```sql
CREATE TABLE sanskrit_system_config (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  description TEXT,
  updated_at TIMESTAMP DEFAULT NOW(),
  updated_by UUID REFERENCES sanskrit_users(id)
);

-- Initial configuration values
INSERT INTO sanskrit_system_config (key, value, description) VALUES
  ('audio_bitrate_kbps', '32', 'Audio encoding bitrate in kbps'),
  ('audio_quota_seconds', '3600', 'Default audio quota per student-teacher pair in seconds'),
  ('audio_quota_seconds_per_language', '{"sa":3600}', 'JSON map of per-language quotas'),
  ('max_recording_duration_seconds', '600', 'Maximum single recording duration (10 minutes)'),
  ('require_teacher_approval', 'true', 'Whether new teachers need admin approval');
```

#### 9. `sanskrit_flashcards` - Vocabulary Flashcards (Future)

```sql
CREATE TABLE sanskrit_flashcards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id TEXT NOT NULL REFERENCES sanskrit_notion_data(id) ON DELETE CASCADE,
  sanskrit_word TEXT NOT NULL,
  english_translation TEXT NOT NULL,
  transliteration TEXT,
  example_sentence TEXT,
  audio_url TEXT,                        -- Cloudflare R2 URL for pronunciation
  image_url TEXT,                        -- Cloudflare R2 URL for visual aid
  difficulty_level INTEGER DEFAULT 1,    -- 1-5
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_sanskrit_flashcards_topic ON sanskrit_flashcards(topic_id);
```

#### 10. `sanskrit_flashcard_progress` - Student Flashcard Mastery (Future)

```sql
CREATE TABLE sanskrit_flashcard_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES sanskrit_users(id) ON DELETE CASCADE,
  flashcard_id UUID NOT NULL REFERENCES sanskrit_flashcards(id) ON DELETE CASCADE,
  mastery_level INTEGER DEFAULT 0,       -- 0-5, spaced repetition level
  correct_count INTEGER DEFAULT 0,
  incorrect_count INTEGER DEFAULT 0,
  last_reviewed_at TIMESTAMP,
  next_review_at TIMESTAMP,              -- Spaced repetition scheduling
  UNIQUE(student_id, flashcard_id)
);

CREATE INDEX idx_sanskrit_flashcard_progress_student ON sanskrit_flashcard_progress(student_id);
CREATE INDEX idx_sanskrit_flashcard_progress_next_review ON sanskrit_flashcard_progress(next_review_at);
```

## Row Level Security (RLS) Policies

### `sanskrit_users`

```sql
-- Enable RLS
ALTER TABLE sanskrit_users ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile
CREATE POLICY "Users can read own profile"
  ON sanskrit_users FOR SELECT
  USING (auth.uid() = auth_id);

-- Users can update their own profile (except role and approved status)
CREATE POLICY "Users can update own profile"
  ON sanskrit_users FOR UPDATE
  USING (auth.uid() = auth_id);

-- SITE_ADMIN can read all profiles
CREATE POLICY "Admins can read all profiles"
  ON sanskrit_users FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM sanskrit_users
      WHERE auth_id = auth.uid() AND role = 'SITE_ADMIN'
    )
  );

-- SITE_ADMIN can update any profile
CREATE POLICY "Admins can update any profile"
  ON sanskrit_users FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM sanskrit_users
      WHERE auth_id = auth.uid() AND role = 'SITE_ADMIN'
    )
  );

-- Teachers can read their assigned students
CREATE POLICY "Teachers can read assigned students"
  ON sanskrit_users FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM sanskrit_teacher_students ts
      JOIN sanskrit_users u ON u.id = ts.teacher_id
      WHERE u.auth_id = auth.uid() AND ts.student_id = sanskrit_users.id
    )
  );
```

### `sanskrit_recordings`

```sql
ALTER TABLE sanskrit_recordings ENABLE ROW LEVEL SECURITY;

-- Students can read and create their own recordings
CREATE POLICY "Students can manage own recordings"
  ON sanskrit_recordings FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM sanskrit_users
      WHERE auth_id = auth.uid() AND id = student_id
    )
  );

-- Teachers can read recordings from assigned students
CREATE POLICY "Teachers can read assigned student recordings"
  ON sanskrit_recordings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM sanskrit_users
      WHERE auth_id = auth.uid() AND id = teacher_id
    )
  );

-- Admins can read all recordings
CREATE POLICY "Admins can read all recordings"
  ON sanskrit_recordings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM sanskrit_users
      WHERE auth_id = auth.uid() AND role = 'SITE_ADMIN'
    )
  );
```

### `sanskrit_feedback`

```sql
ALTER TABLE sanskrit_feedback ENABLE ROW LEVEL SECURITY;

-- Students can read feedback on their recordings
CREATE POLICY "Students can read own feedback"
  ON sanskrit_feedback FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM sanskrit_recordings r
      JOIN sanskrit_users u ON u.id = r.student_id
      WHERE u.auth_id = auth.uid() AND r.id = recording_id
    )
  );

-- Teachers can manage feedback they created
CREATE POLICY "Teachers can manage own feedback"
  ON sanskrit_feedback FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM sanskrit_users
      WHERE auth_id = auth.uid() AND id = teacher_id
    )
  );
```

## Phase 1: Notion to Supabase Sync

### 1.1 Notion Setup

**Create Hierarchical Page Structure:**
```
Sanskrit Lessons (root page)
├── Level 1: Beginner (id: "1")
│   ├── Chapter 1.1: Greetings and Identity (id: "1.1")
│   │   ├── Topic 1.1.1: Basic Greetings (id: "1.1.1")
│   │   ├── Topic 1.1.2: Introducing Yourself (id: "1.1.2")
│   │   └── Topic 1.1.3: Asking Names (id: "1.1.3")
│   └── Chapter 1.2: Basic Conversations (id: "1.2")
│       └── Topic 1.2.1: Yes and No (id: "1.2.1")
└── Level 2: Intermediate (id: "2")
    └── Chapter 2.1: Advanced Grammar (id: "2.1")
```

**Content Structure per Topic Page:**
- Heading 1: Topic Title
- Heading 2: Goal and Vocabulary
  - Paragraph: Description
  - Bullet list: Vocabulary items
- Heading 2: Tips
  - Paragraph: Tips text
- Heading 2: Example Dialogue
  - Paragraph: Dialogue text
- Image blocks (with URLs to Cloudflare R2)
- Audio embeds (URLs to Cloudflare R2)
- Video embeds (YouTube links)

### 1.2 Background Sync Script

**File:** `scripts/syncNotionToSupabase.js`

**Functionality:**
1. Traverse Notion page hierarchy starting from root
2. For each page:
   - Extract title and hierarchical ID (from page property or generate)
   - Extract all content blocks (headings, paragraphs, lists, images, etc.)
   - Parse Cloudflare R2 URLs from image and audio blocks
   - Parse YouTube URLs from video embeds
   - Validate required sections exist (Goal and Vocabulary, Tips)
   - Determine level (1, 2, or 3) and parent_id
3. Upsert into `sanskrit_notion_data` table
4. Generate sync report (successes, errors, warnings)

**Validation Rules:**
- Topic pages (level 3) must have "Goal and Vocabulary" section
- Topic pages must have "Tips" section
- All R2 URLs must be accessible (HTTP HEAD request returns 200)
- YouTube URLs must match valid format
- No broken parent_id references

**Usage:**
```bash
npm run sync-notion
```

### 1.3 Content Validation Tests

**File:** `tests/notion-sync.test.js`

**Test Cases:**
- Verify hierarchical IDs are correct (1, 1.1, 1.1.1)
- Verify parent_id references are valid
- Verify required sections exist for all topics
- Verify all R2 URLs are accessible
- Verify YouTube URLs are valid
- Verify no duplicate IDs
- Verify order_index is sequential

## Phase 2: Cloudflare R2 Setup

### 2.1 R2 Bucket Structure

**Buckets:**
- `sanskrit-static-content` - Images and teacher reference audio (public)
- `sanskrit-student-recordings` - Student audio recordings (private)
- `sanskrit-teacher-feedback` - Teacher feedback audio (private)
- `sanskrit-user-profiles` - Profile pictures (public)

**Folder Structure in `sanskrit-static-content`:**
```
/images/
  /levels/
    /level-1/
  /chapters/
    /chapter-1-1/
  /topics/
    /topic-1-1-1/
/audio/
  /pronunciations/
    /topic-1-1-1/
```

**Folder Structure in `sanskrit-student-recordings`:**
```
/student-{student-id}/
  /recording-{recording-id}.webm
```

**Folder Structure in `sanskrit-teacher-feedback`:**
```
/teacher-{teacher-id}/
  /feedback-{feedback-id}.webm
```

### 2.2 R2 Access Configuration

**Public Bucket (sanskrit-static-content):**
- Enable public access for read-only
- Generate public URL pattern: `https://pub-xyz.r2.dev/sanskrit-static-content/{path}`

**Private Buckets:**
- Require signed URLs for access
- Generate presigned URLs on-demand (valid for 1 hour)
- Use S3-compatible API with AWS SDK

### 2.3 Audio Upload Service

**File:** `src/services/cloudflareR2Service.js`

**Functions:**
- `uploadStaticImage(file, path)` - Upload image to static bucket
- `uploadStudentRecording(audioBlob, studentId, recordingId)` - Upload at 32 kbps
- `uploadTeacherFeedback(audioBlob, teacherId, feedbackId)` - Upload at 32 kbps
- `generatePresignedUrl(bucket, key, expiresIn)` - Generate signed URL
- `deleteFile(bucket, key)` - Delete file when record is deleted

**Audio Encoding:**
- Primary: Browser MediaRecorder API with codec: `audio/webm;codecs=opus`
- Fallback: FFmpeg.js client-side transcode to 32 kbps when Opus unsupported
- Bitrate: 32000 (32 kbps) — parametrizable via `VITE_AUDIO_BITRATE`
- Strategy: `VITE_AUDIO_ENCODER_STRATEGY=auto|mediarecorder|ffmpeg`

## Phase 3: Web Application Features

### 3.1 Authentication & User Management

**File:** `src/hooks/useAuth.js`

**Functions:**
- `useAuth()` - Get current user, role, and auth state
- `signUp(email, password, fullName, role)` - Register new user
- `signIn(email, password)` - Login
- `signOut()` - Logout
- `requireRole(role)` - HOC to protect routes by role

**File:** `src/components/AdminPanel.jsx`

**Features:**
- List pending teacher approvals
- Approve/reject teachers
- Assign students to teachers
- View system statistics (user counts, storage usage)

### 3.2 Content Rendering

**File:** `src/hooks/useSupabaseLesson.js`

**Replaces:** `src/hooks/useLesson.js`

**Functionality:**
- Fetch lesson from `sanskrit_notion_data` by id
- Fetch children (e.g., all topics under a chapter)
- Parse content JSONB into renderable components

**File:** `src/components/SupabaseContentRenderer.jsx`

**Features:**
- Render Notion blocks as React components
- Display Cloudflare R2 images with lazy loading
- Embed YouTube videos with iframe
- Display audio players for R2 audio URLs
- Handle nested content structures

### 3.3 Audio Recording

**File:** `src/components/AudioRecorder.jsx`

**Features:**
- Record audio using MediaRecorder API
- Waveform visualization during recording
- Play back before submission
- Show duration and estimated file size
- Check quota before allowing recording
- Upload to Cloudflare R2 at 32 kbps
- Save metadata to `sanskrit_recordings` table

**File:** `src/hooks/useAudioQuota.js`

**Functions:**
- `useAudioQuota(studentId, teacherId)` - Get quota status
- `checkQuotaAvailable(durationSeconds)` - Check if upload allowed
- `updateQuota(recordingId, durationSeconds)` - Update after upload

### 3.4 Teacher Dashboard

**File:** `src/components/TeacherDashboard.jsx`

**Features:**
- List assigned students
- View pending recordings by student
- Filter by topic, date, status
- Audio player for each recording
- Text feedback input
- Audio feedback recording
- Submit feedback (updates `sanskrit_recordings.status` to 'REVIEWED')

### 3.5 Student Feedback View

**File:** `src/components/StudentFeedbackView.jsx`

**Features:**
- List all recordings with status badges (pending/reviewed)
- Side-by-side audio players (student recording + teacher feedback)
- Display teacher text feedback
- Show rating if provided
- Re-record option (creates new recording)

### 3.6 Progress Tracking

**File:** `src/components/ProgressTracker.jsx`

**Features:**
- Display completion percentage by level, chapter, topic
- Visual progress bars
- Last accessed timestamps
- Mark topic as completed button
- Calculate time spent on each topic

## Phase 4: Migration & Deployment

### 4.1 Migration Steps

1. **Set up Supabase project**
   - Create new project
   - Run all table creation scripts
   - Set up RLS policies
   - Configure authentication providers

2. **Set up Cloudflare R2**
   - Create buckets
   - Configure public access for static bucket
   - Generate API tokens
   - Test upload/download with sample files

3. **Migrate existing content to Notion**
   - Create hierarchical page structure
   - Upload images/audio to R2, copy URLs
   - Add R2 URLs to Notion pages
   - Add YouTube embeds

4. **Run initial sync**
   - Execute `npm run sync-notion`
   - Verify data in Supabase
   - Check validation report
   - Fix any errors

5. **Update frontend**
   - Replace `useLesson` with `useSupabaseLesson`
   - Test rendering with synced data
   - Verify images, audio, video all display correctly

6. **Deploy authentication**
   - Set up Supabase Auth
   - Create initial SITE_ADMIN account
   - Test login/logout flows

7. **Gradual feature rollout**
   - Week 1: Static content rendering
   - Week 2: User registration and role assignment
   - Week 3: Audio recording for students
   - Week 4: Teacher feedback system
   - Week 5: Progress tracking

### 4.2 Testing Strategy

**Unit Tests:**
- Sync script (parse Notion pages correctly)
- Content validation (required fields present)
- Audio quota calculations
- URL generation (R2 presigned URLs)

**Integration Tests:**
- Full sync from Notion to Supabase
- Audio upload to R2 and metadata to Supabase
- Feedback submission flow
- Progress tracking updates

**E2E Tests (Playwright):**
- Student records audio and submits
- Teacher views recording and provides feedback
- Student views feedback
- Admin approves teacher and assigns student
- Simulated 2G/3G throttled uploads; ensure retries and timeouts are user-friendly

## Phase 5: Future Enhancements

### 5.1 Dynamic Flashcards

- Auto-generate flashcards from vocabulary sections
- Spaced repetition algorithm
- Track mastery per student
- Mobile-friendly swipe interface

### 5.2 Dynamic Quizzes

- Generate quizzes from content
- Multiple choice, fill-in-blank, audio response
- Adaptive difficulty
- Store results in Supabase

### 5.3 Analytics Dashboard

- Teacher analytics: Student progress, engagement, common mistakes
- Student analytics: Time spent, completion rate, strengths/weaknesses
- Admin analytics: Platform usage, storage costs, user growth

### 5.4 Mobile App

- React Native app for iOS/Android
- Offline mode for static content
- Push notifications for new feedback
- Native audio recording

### 5.5 Real-time Features

- Live pronunciation check (speech-to-text + feedback)
- Video calls with teachers (optional upgrade)
- Real-time chat for quick questions

## Files to Create

### Scripts
- `scripts/syncNotionToSupabase.js` - Background sync from Notion to Supabase
- `scripts/uploadToR2.js` - Helper script for bulk R2 uploads
- `scripts/generateHierarchicalIds.js` - Generate IDs for existing Notion pages

### Services
- `src/services/supabaseClient.js` - Supabase initialization
- `src/services/cloudflareR2Service.js` - R2 upload/download/delete
- `src/services/audioEncoder.js` - Audio encoding at 32 kbps

### Hooks
- `src/hooks/useSupabaseLesson.js` - Fetch lessons from Supabase
- `src/hooks/useAuth.js` - Authentication and role checking
- `src/hooks/useRecordings.js` - Fetch/manage recordings
- `src/hooks/useFeedback.js` - Fetch/manage feedback
- `src/hooks/useAudioQuota.js` - Check and update audio quotas
- `src/hooks/useProgress.js` - Track student progress

### Components
- `src/components/SupabaseContentRenderer.jsx` - Render Notion content
- `src/components/AudioRecorder.jsx` - Record and upload audio
- `src/components/AudioPlayer.jsx` - Play audio with controls
- `src/components/TeacherDashboard.jsx` - Teacher review interface
- `src/components/StudentFeedbackView.jsx` - Student feedback view
- `src/components/AdminPanel.jsx` - Admin user management
- `src/components/ProgressTracker.jsx` - Display student progress
- `src/components/QuotaDisplay.jsx` - Show audio quota usage

### Tests
- `tests/notion-sync.test.js` - Test sync script
- `tests/audio-quota.test.js` - Test quota calculations
- `tests/content-validation.test.js` - Test content structure
- `tests/e2e/recording-feedback.test.js` - E2E test for core workflow
- `tests/e2e/admin-management.test.js` - E2E test for admin features

### Configuration
- `.env.local` - Environment variables for Supabase, R2, Notion
- `supabase/migrations/` - SQL migration files for database schema

### Documentation
- `docs/teacher-guide.md` - Guide for creating content in Notion
- `docs/r2-upload-guide.md` - Guide for uploading media to R2
- `docs/admin-guide.md` - Guide for site admins
- `docs/api-reference.md` - API documentation for services

