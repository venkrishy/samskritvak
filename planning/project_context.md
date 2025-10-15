# Sanskrit Learning Platform - Project Context

## What We're Building

A comprehensive spoken Sanskrit learning platform that separates static educational content (managed by volunteer teachers in Notion) from dynamic interactive features (student audio recordings, teacher feedback, progress tracking). The platform enables asynchronous audio-based communication between students and teachers, focusing on spoken language proficiency.

## Current State

- Existing React web app with hardcoded lesson content in JSX files
- Basic Notion integration reading from individual pages and syncing to local JSON cache
- Content includes: Goal and Vocabulary, Tips, Example Dialogue, Images, Quizzes
- No authentication, recording, or teacher-student interaction features yet
- No backend database or binary storage infrastructure

## Target Architecture

### Static Content Layer (Notion → Supabase → React)

**Notion**: Hierarchical pages (Level → Chapter → Topic)
- Teachers create and edit content in familiar page-based interface
- Content structure: Goal and Vocabulary, Tips, Example Dialogue, Practice exercises
- Media references: Cloudflare R2 URLs for images/audio, YouTube embeds for video

**Background Sync Script**: `scripts/syncNotionToSupabase.js`
- Traverses Notion hierarchical pages
- Extracts content blocks and media URLs
- Syncs to Supabase `sanskrit_notion_data` table with hierarchical IDs (1, 1.1, 1.1.1)
- Validates content has required fields (Goal and Vocabulary, Tips, etc.)
- Manual trigger only (to catch teacher errors before going live)

**Supabase Database**: Stores structured content
- `sanskrit_notion_data` table with hierarchical IDs
- Stores Cloudflare R2 URLs for images and teacher reference audio
- Stores YouTube embed URLs for video content
- Enables fast queries and offline capability

**React Web App**: Renders content from Supabase
- Fetches lessons from Supabase database
- Displays Cloudflare R2 images via public URLs
- Embeds YouTube videos
- Plays Cloudflare R2 audio files

### Dynamic Content Layer (Web App + Supabase + Cloudflare R2)

**User Management**
- Three roles: STUDENT, TEACHER, SITE_ADMIN
- Site admins approve teacher registrations
- Site admins assign students to teachers
- Supabase Auth for authentication

**Audio Recording & Feedback**
- Students record audio responses to lesson prompts (browser-based)
- Audio encoded at 32 kbps (parametrizable) for cost optimization
- Audio uploaded to Cloudflare R2
- Teachers review recordings and provide text + audio feedback
- Teacher feedback audio also stored in Cloudflare R2 at 32 kbps
- Asynchronous workflow (no real-time communication)

**Audio Quota System**
- Each student-teacher pair capped at 1 hour total audio (parametrizable at runtime)
- Example: Teacher can upload 30 min of feedback, student can upload 30 min of recordings
- Quota tracked in `sanskrit_audio_quotas` table
- Prevents excessive storage costs

**Progress Tracking**
- Track topic completion per student
- Track last accessed time
- Calculate completion percentage per level/chapter
- Store in `sanskrit_progress` table

### Media Storage Strategy

**Cloudflare R2 (ALL Binary Data)**
- Static images (lesson illustrations, diagrams)
- Teacher reference audio (pronunciation examples)
- Student audio recordings (lesson responses)
- Teacher feedback audio
- Cost: ~$0.015/GB storage, free egress up to 10GB/month
- S3-compatible API for easy integration
- Public URLs for static content, authenticated URLs for student/teacher audio

**YouTube (Video Content)**
- Embed links stored as text in Notion
- No hosting costs
- Teachers can link existing educational videos

**Supabase Database (Metadata Only)**
- All Cloudflare R2 URLs
- YouTube embed links
- User data, roles, assignments
- Recording metadata (duration, status, timestamps)
- Feedback metadata
- Progress tracking data
- No binary data stored in Supabase

**Audio Quality & Quota Specifications**
- Encoding: 32 kbps (low fidelity, sufficient for speech)
- Parametrizable at runtime via environment variables
- Quota: 1 hour total per student-teacher pair (parametrizable)
- Quota tracking: Real-time calculation of total duration
- Quota enforcement: Block uploads when limit reached

## Success Criteria for MVP

### Static Content Features
- ✅ Teachers can create/edit lessons in Notion hierarchical pages without touching code
- ✅ Teachers can upload images/audio to Cloudflare R2 and reference URLs in Notion
- ✅ Background sync script successfully migrates Notion content to Supabase
- ✅ Web app renders lessons from Supabase with Cloudflare R2 images and YouTube embeds
- ✅ Content validation ensures minimum quality standards (required fields present)

### Dynamic Features
- ✅ Students can record audio responses to lesson prompts
- ✅ Audio uploads to Cloudflare R2 at 32 kbps
- ✅ Teachers can review assigned students' recordings
- ✅ Teachers can provide text and audio feedback
- ✅ Students can view their recordings with teacher feedback
- ✅ Audio quota system prevents excessive storage usage

### User Management
- ✅ Site admin can approve/reject teacher registrations
- ✅ Site admin can assign students to teachers
- ✅ Role-based access control (STUDENT, TEACHER, SITE_ADMIN)

## Key Architectural Decisions

### Why Notion hierarchical pages instead of databases initially?

- Teachers are comfortable with page creation (natural workflow)
- Visual hierarchy is clear and intuitive
- Can later convert to databases if needed via script
- Lower barrier to entry for volunteer content creators

### Why sync to Supabase instead of fetching from Notion directly?

- **Performance**: Faster response times (no Notion API rate limits)
- **Reliability**: Offline capability, no dependency on Notion API uptime
- **Functionality**: Can add relational data (user progress, recordings)
- **Queries**: Enables complex queries (filter by level, search, etc.)
- **Cost**: No API call costs after sync

### Why Cloudflare R2 for all binary storage?

- **Cost-effective**: $0.015/GB storage (vs $0.021/GB for AWS S3)
- **Free egress**: Up to 10GB/month free bandwidth (S3 charges $0.09/GB)
- **S3-compatible**: Easy integration with existing libraries
- **Centralized**: All media in one place for easier management
- **No Supabase Storage costs**: Supabase charges separately for storage
- **Low-fidelity audio**: 32 kbps encoding minimizes storage needs
- **Quota system**: 1 hour cap per student-teacher pair prevents runaway costs

### Why hierarchical IDs (1, 1.1, 1.1.1)?

- **Easy querying**: `WHERE id LIKE '1.%'` for all content under Level 1
- **Natural ordering**: `ORDER BY id ASC` gives correct sequence
- **Human-readable**: Structure is immediately clear from ID
- **No complex joins**: Can traverse hierarchy without recursive queries
- **Flexible**: Easy to add new levels or reorder content

### Why 32 kbps audio encoding?

- **Speech clarity**: Sufficient quality for language learning (human speech is ~8-16 kHz)
- **Cost savings**: 8x smaller than 256 kbps (music quality)
- **Example**: 1 hour at 32 kbps = ~14 MB vs 1 hour at 256 kbps = ~115 MB
- **Parametrizable**: Can increase if needed via environment variable

### Why 1 hour audio quota per student-teacher pair?

- **Cost control**: Prevents excessive storage usage
- **Sufficient for MVP**: 30 min student + 30 min teacher = good asynchronous interaction
- **Parametrizable**: Can increase for paid plans or as budget allows
- **Fair usage**: Encourages focused, high-quality recordings

### Why manual sync instead of real-time?

- **Quality control**: Admins can review content before it goes live
- **Error catching**: Validates content structure before students see it
- **Cost savings**: No webhook infrastructure needed
- **Simplicity**: No complex real-time synchronization logic
- **Teacher workflow**: Teachers can make multiple edits, then request sync when ready

## Technology Stack

### Frontend
- React 18 (existing)
- Vite (existing)
- TailwindCSS (existing)
- React Router (existing)
- MediaRecorder API for audio recording

### Backend
- Supabase (PostgreSQL database, authentication)
- Cloudflare R2 (binary storage)
- Notion API (content management)

### Services
- Notion: Content creation and management
- Cloudflare R2: Binary storage (images, audio)
- YouTube: Video hosting (embeds)
- Supabase Auth: User authentication
- Supabase Database: Metadata and relational data

## Cost Estimation (MVP with 100 students, 10 teachers)

### Cloudflare R2
- Storage: 100 students × 1 hour × 14 MB/hour = 1.4 GB = $0.02/month
- Bandwidth: 10 GB free/month (sufficient for MVP)
- **Total: ~$0.02/month**

### Supabase
- Free tier: 500 MB database, 2 GB bandwidth, 50,000 monthly active users
- Should be sufficient for MVP
- **Total: $0/month (free tier)**

### Notion
- Free plan: Sufficient for content management
- **Total: $0/month**

### YouTube
- Free hosting for video embeds
- **Total: $0/month**

**MVP Total Cost: ~$0.02/month** (essentially free)

**Scale to 1,000 students:**
- R2 Storage: 14 GB = $0.21/month
- R2 Bandwidth: ~20 GB = $0 (under free tier)
- Supabase: ~$25/month (Pro plan for more database storage)
- **Total: ~$25/month**

## Risk Mitigation

### Storage Cost Overruns
- Audio quota system (1 hour cap)
- Low-fidelity encoding (32 kbps)
- Parametrizable limits (can reduce if needed)
- Monitoring dashboard for storage usage

### Content Quality Issues
- Manual sync with validation
- Required fields enforcement
- URL validation (check R2 URLs are accessible)
- Admin review before content goes live

### Scalability Concerns
- Cloudflare R2 scales automatically
- Supabase Pro plan handles 100,000+ users
- Static content served from database (no API bottlenecks)
- Audio uploads are asynchronous (no real-time constraints)

### Teacher Onboarding Complexity
- Notion is familiar to most users
- Step-by-step guide for R2 upload and URL copying
- Template pages for consistent structure
- Admin support for first few lessons

## External Feedback Incorporated (Grok)

The following refinements were integrated from `grok_feedback.md`:
- Multi-language readiness: future-proof via `language_code` and optional `dialect` fields in content and user prefs (see plan).
- Standardized content creation: Notion template gallery and a content creator checklist to ensure speaking-first materials.
- Quota flexibility: runtime-configurable per language/course overrides.
- Low-bandwidth focus: add test matrix and E2E throttling scenarios.
- Encoder fallback: FFmpeg.js path where MediaRecorder+Opus is unavailable.

## MVP Extensions (from feedback)

- Pronunciation heatmaps: store phoneme/feature scores in `sanskrit_recordings.metadata` for teacher visualization.
- Echo prompts: timed call-and-response using R2 audio prompts; track time spent in `sanskrit_progress`.
- Role-play templates: paired recordings for dialogue practice; captured in templates and checklist.

## Future Enhancements (roadmap, not committed yet)

- AI conversation simulator with short, capped sessions; temporary R2 assets.
- Peer matching and tandem practice (deferred schema `sanskrit_peer_sessions`).
- Dialect drift detector leveraging community audio packs and on-device models.
- Voice journaling with weekly summaries and suggested prompts.
- Community audio library with rating and curation toggled via `sanskrit_system_config`.

## Monetization Notes (tracked in plan)

- Freemium: base quota and volunteer feedback free; premium adds quotas, AI tools, priority matching.
- Teacher upgrades: analytics, branding, bulk quotas.
- Institutional: admin tooling and white-label.
- One-time: dialect packs, premium prompt packs; sponsorships/affiliates optional.

See `planning/project_plan.md` for technical details and schema updates.

