# Image Prompts for BhashaBoli Public Pages

This document contains detailed prompts for generating all images needed for the Preply-inspired public pages.

## Image Specifications

- **Format**: JPG or PNG
- **Quality**: High resolution (1920x1080 or higher)
- **Style**: Modern, professional, diverse representation
- **Color Palette**: Clean whites, subtle grays, accent blues/teals
- **Aspect Ratios**: 16:9 for hero images, 1:1 for avatars, 4:3 for cards

## Required Images

### 1. Hero Student Learning (`hero-student-learning.jpg`)
**Prompt**: "Professional photo of a diverse student learning a language with a tutor via video call. Modern home office setup with laptop, good lighting, student taking notes, tutor visible on screen. Clean, bright aesthetic with natural lighting. High quality, realistic style."

**Usage**: Homepage hero section
**Aspect Ratio**: 16:9

### 2. Stats Background (`stats-background.jpg`)
**Prompt**: "Abstract gradient background with soft geometric shapes. Clean, modern design with subtle blue and teal gradients. Minimalist, professional aesthetic suitable for overlay text. No distracting elements."

**Usage**: Stats section background
**Aspect Ratio**: 16:9

### 3. Testimonial Avatar 1 (`testimonial-avatar-1.jpg`)
**Prompt**: "Professional headshot of a young woman (25-35 years old) with a warm smile. Diverse background, modern business casual attire. Clean, bright lighting, professional photography style. Square format, centered composition."

**Usage**: Student testimonial
**Aspect Ratio**: 1:1

### 4. Testimonial Avatar 2 (`testimonial-avatar-2.jpg`)
**Prompt**: "Professional headshot of a young man (25-35 years old) with a confident smile. Diverse background, modern business casual attire. Clean, bright lighting, professional photography style. Square format, centered composition."

**Usage**: Student testimonial
**Aspect Ratio**: 1:1

### 5. Tutor Placeholder 1 (`tutor-placeholder-1.jpg`)
**Prompt**: "Professional headshot of a middle-aged woman (35-45 years old) with glasses, warm smile. Teacher/professor appearance, professional attire. Clean background, good lighting. Square format, professional photography."

**Usage**: Default tutor avatar
**Aspect Ratio**: 1:1

### 6. Tutor Placeholder 2 (`tutor-placeholder-2.jpg`)
**Prompt**: "Professional headshot of a middle-aged man (35-45 years old) with beard, friendly smile. Teacher/professor appearance, professional attire. Clean background, good lighting. Square format, professional photography."

**Usage**: Default tutor avatar
**Aspect Ratio**: 1:1

### 7. Tutor Placeholder 3 (`tutor-placeholder-3.jpg`)
**Prompt**: "Professional headshot of a young woman (25-35 years old) with curly hair, bright smile. Teacher appearance, casual professional attire. Clean background, good lighting. Square format, professional photography."

**Usage**: Default tutor avatar
**Aspect Ratio**: 1:1

### 8. Teach Hero (`teach-hero.jpg`)
**Prompt**: "Professional photo of a tutor teaching from home office. Modern setup with laptop, good lighting, tutor engaged in video call with students. Clean, organized workspace, professional atmosphere. 16:9 aspect ratio."

**Usage**: Become a Tutor page hero
**Aspect Ratio**: 16:9

### 9. Teach Benefits (`teach-benefits.jpg`)
**Prompt**: "Collage-style image showing diverse tutors from around the world teaching online. Multiple small screens showing different tutors in their home offices. Global, inclusive representation. Modern, professional aesthetic."

**Usage**: Teaching benefits section
**Aspect Ratio**: 16:9

### 10. Business Hero (`business-hero.jpg`)
**Prompt**: "Professional corporate training session. Diverse team of business professionals in modern office setting, learning together. Clean, corporate environment, professional attire, collaborative atmosphere."

**Usage**: For Business page hero
**Aspect Ratio**: 16:9

### 11. Business Case Study (`business-case-study.jpg`)
**Prompt**: "Team of diverse professionals working together on language learning project. Modern office setting, collaborative workspace, people discussing and learning. Professional, inclusive atmosphere."

**Usage**: Business case studies section
**Aspect Ratio**: 4:3

### 12. Progress Dashboard (`progress-dashboard.jpg`)
**Prompt**: "Screenshot-style image of a modern learning progress dashboard. Clean interface showing charts, progress bars, learning statistics. Modern UI design, professional color scheme, educational technology aesthetic."

**Usage**: Proven Progress page
**Aspect Ratio**: 16:9

### 13. Progress Stats (`progress-stats.jpg`)
**Prompt**: "Infographic-style image showing learning progress statistics. Clean, modern design with charts, graphs, and educational metrics. Professional color scheme, data visualization style."

**Usage**: Progress statistics section
**Aspect Ratio**: 16:9

## Upload Instructions

1. Generate all images using the prompts above
2. Save them in `/public/images/` directory with the exact filenames specified
3. Run the upload script: `node scripts/uploadToR2.js`
4. The script will upload all images to Cloudflare R2 and generate a `uploaded-urls.json` file with the public URLs

## File Structure
```
public/images/
├── hero-student-learning.jpg
├── stats-background.jpg
├── testimonial-avatar-1.jpg
├── testimonial-avatar-2.jpg
├── tutor-placeholder-1.jpg
├── tutor-placeholder-2.jpg
├── tutor-placeholder-3.jpg
├── teach-hero.jpg
├── teach-benefits.jpg
├── business-hero.jpg
├── business-case-study.jpg
├── progress-dashboard.jpg
├── progress-stats.jpg
└── uploaded-urls.json (generated after upload)
```

