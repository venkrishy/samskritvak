# Sanskrit Learning Platform - Project Plan

## 📚 Documentation

This project has comprehensive planning documentation organized in the `planning/` folder:

### **[Project Context](./planning/project_context.md)**
Complete overview of what we're building, current state, target architecture, and key decisions:
- What We're Building
- Current State & Target Architecture
- Media Storage Strategy (Cloudflare R2 for ALL binary data)
- Success Criteria for MVP
- Key Architectural Decisions
- Cost Estimation
- Technology Stack

### **[Implementation Plan](./planning/project_plan.md)**
Detailed technical implementation plan with complete database schema and step-by-step guide:
- Complete Database Schema (all tables with `sanskrit_` prefix)
- Row Level Security Policies
- Phase 1: Notion to Supabase Sync
- Phase 2: Cloudflare R2 Setup
- Phase 3: Web Application Features
- Phase 4: Migration & Deployment
- Phase 5: Future Enhancements

### External Feedback Incorporated

We integrated insights from `grok_feedback.md`:
- Multi-language readiness via `language_code` and optional `dialect`
- Notion template gallery and content creator checklist
- Quota flexibility (per-language/course overrides)
- Low-bandwidth test matrix and E2E throttling scenarios
- Audio encoder fallback (FFmpeg.js) when MediaRecorder lacks Opus support
- MVP Extensions and Future Enhancements tracked in planning docs

## 🎯 Quick Summary

**Goal:** Build a hybrid Sanskrit learning platform where:
- **Static content** (lessons, vocabulary) is managed by teachers in Notion
- **Dynamic content** (audio recordings, feedback) is managed in the web app
- **All binary data** (images, audio) is stored in Cloudflare R2
- **Metadata** is stored in Supabase PostgreSQL

**Key Features:**
- ✅ Teachers create content in Notion (no coding required)
- ✅ Background sync from Notion to Supabase
- ✅ Students record audio responses to lessons
- ✅ Teachers provide audio + text feedback
- ✅ Audio quota system (1 hour per student-teacher pair)
- ✅ Low-fidelity audio encoding (32 kbps) for cost optimization
- ✅ Role-based access (STUDENT, TEACHER, SITE_ADMIN)
- ✅ Progress tracking per student

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    STATIC CONTENT FLOW                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Notion Pages (Teachers edit)                              │
│         ↓                                                   │
│  Background Sync Script (Manual trigger)                   │
│         ↓                                                   │
│  Supabase `sanskrit_notion_data` table                     │
│         ↓                                                   │
│  React Web App (Students view)                             │
│                                                             │
│  Cloudflare R2: Images, Teacher Audio (public URLs)        │
│  YouTube: Video embeds (URLs stored in Notion)             │
│                                                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    DYNAMIC CONTENT FLOW                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Student records audio → Cloudflare R2 (32 kbps)          │
│                      → Supabase `sanskrit_recordings`      │
│         ↓                                                   │
│  Teacher reviews recording                                  │
│         ↓                                                   │
│  Teacher provides feedback → Cloudflare R2 (32 kbps)      │
│                           → Supabase `sanskrit_feedback`   │
│         ↓                                                   │
│  Student views feedback                                     │
│                                                             │
│  Audio Quota: Tracked in `sanskrit_audio_quotas`          │
│               (1 hour total per student-teacher pair)      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 📊 Database Tables (All with `sanskrit_` prefix)

1. **`sanskrit_notion_data`** - Static content from Notion
2. **`sanskrit_users`** - User accounts with roles
3. **`sanskrit_teacher_students`** - Teacher-student assignments
4. **`sanskrit_recordings`** - Student audio recordings metadata
5. **`sanskrit_feedback`** - Teacher feedback metadata
6. **`sanskrit_progress`** - Student progress tracking
7. **`sanskrit_audio_quotas`** - Audio usage per student-teacher pair
8. **`sanskrit_system_config`** - Runtime configuration
9. **`sanskrit_flashcards`** - Vocabulary flashcards (future)
10. **`sanskrit_flashcard_progress`** - Flashcard mastery (future)

See [Implementation Plan](./planning/project_plan.md) for complete schema with all fields and indexes.

## 💾 Storage Strategy

**Cloudflare R2 (ALL Binary Data):**
- Static images and teacher reference audio (public URLs)
- Student recordings (private, presigned URLs)
- Teacher feedback audio (private, presigned URLs)
- Profile pictures (public URLs)
- Cost: ~$0.015/GB storage, free egress up to 10GB/month

**Supabase Database (Metadata Only):**
- All R2 URLs
- User data, roles, assignments
- Recording metadata (duration, status, timestamps)
- Progress tracking
- No binary data stored

**YouTube (Video Embeds):**
- Links stored in Notion
- Free hosting

## 🔊 Audio Specifications

- **Encoding:** 32 kbps (low fidelity, sufficient for speech)
- **Format:** WebM with Opus codec
- **Quota:** 1 hour total per student-teacher pair
- **Parametrizable:** Via environment variables
- **Example:** 1 hour at 32 kbps = ~14 MB

## 🚀 Current Status

### ✅ Completed
- Basic React web app with hardcoded content
- Notion integration (reading individual pages)
- Local JSON cache sync

### 🔄 In Progress
- Comprehensive planning documentation (this file + planning folder)

### 📋 Next Steps
1. Set up Supabase project and create all tables
2. Set up Cloudflare R2 buckets
3. Build Notion to Supabase sync script
4. Update frontend to read from Supabase
5. Implement authentication and user management
6. Build audio recording and feedback features

## 💡 Monetization, MVP Extensions, Future Enhancements

Detailed strategies and feature ideas are tracked in `planning/project_context.md` and `planning/project_plan.md`:
- Monetization: Freemium, teacher upgrades, institutional plans, one-time packs, sponsorships
- MVP extensions: pronunciation heatmaps, echo prompts, role-play templates
- Future: AI conversation simulator, peer sessions, dialect drift detector, voice journaling, community audio library

## 🎓 For Developers

**Getting Started:**
1. Read [Project Context](./planning/project_context.md) to understand the architecture
2. Review [Implementation Plan](./planning/project_plan.md) for technical details
3. Set up environment variables (see `.env.example`)
4. Follow migration steps in Phase 4 of the implementation plan

**Key Commands:**
```bash
npm run sync-notion              # Sync content from Notion to Supabase
npm run dev                      # Start development server
npm run test                     # Run unit tests
npm run test:e2e                # Run E2E tests
```

## 📝 For Content Creators (Teachers)

See `docs/teacher-guide.md` (to be created) for:
- How to create lessons in Notion
- How to upload images/audio to Cloudflare R2
- How to structure content properly
- How to request a sync

## 🔐 For Site Admins

See `docs/admin-guide.md` (to be created) for:
- How to approve teachers
- How to assign students to teachers
- How to monitor storage usage
- How to trigger manual syncs
- How to configure audio quotas

## 💰 Cost Estimation

**MVP (100 students, 10 teachers):**
- Cloudflare R2: ~$0.02/month
- Supabase: $0/month (free tier)
- Notion: $0/month (free plan)
- YouTube: $0/month
- **Total: ~$0.02/month**

**Scale (1,000 students, 100 teachers):**
- Cloudflare R2: ~$0.21/month
- Supabase: ~$25/month (Pro plan)
- **Total: ~$25/month**

See [Project Context](./planning/project_context.md) for detailed cost breakdown.

## 📞 Support

For questions or issues:
- Technical issues: Check [Implementation Plan](./planning/project_plan.md)
- Architecture questions: Check [Project Context](./planning/project_context.md)
- Content creation: See `docs/teacher-guide.md`
- User management: See `docs/admin-guide.md`

