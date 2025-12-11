# Image Prompts for BhashaBoli - Google Gemini Format

## 1. Hero Student Learning
**Filename:** `hero-student-learning.jpg`
**Prompt:** Professional photo of a diverse student learning a language with a tutor via video call. Modern home office setup with laptop, good lighting, student taking notes, tutor visible on screen. Clean, bright aesthetic with natural lighting. High quality, realistic style. Aspect ratio 16:9.

## 2. Stats Background
**Filename:** `stats-background.jpg`
**Prompt:** Abstract gradient background with soft geometric shapes. Clean, modern design with subtle blue and teal gradients. Minimalist, professional aesthetic suitable for overlay text. No distracting elements. Aspect ratio 16:9.

## 3. Testimonial Avatar 1
**Filename:** `testimonial-avatar-1.jpg`
**Prompt:** Professional headshot of a young woman (25-35 years old) with a warm smile. Diverse background, modern business casual attire. Clean, bright lighting, professional photography style. Square format, centered composition.

## 4. Testimonial Avatar 2
**Filename:** `testimonial-avatar-2.jpg`
**Prompt:** Professional headshot of a young man (25-35 years old) with a confident smile. Diverse background, modern business casual attire. Clean, bright lighting, professional photography style. Square format, centered composition.

## 5. Tutor Placeholder 1
**Filename:** `tutor-placeholder-1.jpg`
**Prompt:** Professional headshot of a middle-aged woman (35-45 years old) with glasses, warm smile. Teacher/professor appearance, professional attire. Clean background, good lighting. Square format, professional photography.

## 6. Tutor Placeholder 2
**Filename:** `tutor-placeholder-2.jpg`
**Prompt:** Professional headshot of a middle-aged man (35-45 years old) with beard, friendly smile. Teacher/professor appearance, professional attire. Clean background, good lighting. Square format, professional photography.

## 7. Tutor Placeholder 3
**Filename:** `tutor-placeholder-3.jpg`
**Prompt:** Professional headshot of a young woman (25-35 years old) with curly hair, bright smile. Teacher appearance, casual professional attire. Clean background, good lighting. Square format, professional photography.

## 8. Teach Hero
**Filename:** `teach-hero.jpg`
**Prompt:** Professional photo of a tutor teaching from home office. Modern setup with laptop, good lighting, tutor engaged in video call with students. Clean, organized workspace, professional atmosphere. Aspect ratio 16:9.

## 9. Teach Benefits
**Filename:** `teach-benefits.jpg`
**Prompt:** Collage-style image showing diverse tutors from around the world teaching online. Multiple small screens showing different tutors in their home offices. Global, inclusive representation. Modern, professional aesthetic. Aspect ratio 16:9.

## 10. Business Hero
**Filename:** `business-hero.jpg`
**Prompt:** Professional corporate training session. Diverse team of business professionals in modern office setting, learning together. Clean, corporate environment, professional attire, collaborative atmosphere. Aspect ratio 16:9.

## 11. Business Case Study
**Filename:** `business-case-study.jpg`
**Prompt:** Team of diverse professionals working together on language learning project. Modern office setting, collaborative workspace, people discussing and learning. Professional, inclusive atmosphere. Aspect ratio 4:3.

## 12. Progress Dashboard
**Filename:** `progress-dashboard.jpg`
**Prompt:** Screenshot-style image of a modern learning progress dashboard. Clean interface showing charts, progress bars, learning statistics. Modern UI design, professional color scheme, educational technology aesthetic. Aspect ratio 16:9.

## 13. Progress Stats
**Filename:** `progress-stats.jpg`
**Prompt:** Infographic-style image showing learning progress statistics. Clean, modern design with charts, graphs, and educational metrics. Professional color scheme, data visualization style. Aspect ratio 16:9.

---

## Quick Copy-Paste Format for Gemini:

```
1. Professional photo of a diverse student learning a language with a tutor via video call. Modern home office setup with laptop, good lighting, student taking notes, tutor visible on screen. Clean, bright aesthetic with natural lighting. High quality, realistic style. Aspect ratio 16:9.

2. Abstract gradient background with soft geometric shapes. Clean, modern design with subtle blue and teal gradients. Minimalist, professional aesthetic suitable for overlay text. No distracting elements. Aspect ratio 16:9.

3. Professional headshot of a young woman (25-35 years old) with a warm smile. Diverse background, modern business casual attire. Clean, bright lighting, professional photography style. Square format, centered composition.

4. Professional headshot of a young man (25-35 years old) with a confident smile. Diverse background, modern business casual attire. Clean, bright lighting, professional photography style. Square format, centered composition.

5. Professional headshot of a middle-aged woman (35-45 years old) with glasses, warm smile. Teacher/professor appearance, professional attire. Clean background, good lighting. Square format, professional photography.

6. Professional headshot of a middle-aged man (35-45 years old) with beard, friendly smile. Teacher/professor appearance, professional attire. Clean background, good lighting. Square format, professional photography.

7. Professional headshot of a young woman (25-35 years old) with curly hair, bright smile. Teacher appearance, casual professional attire. Clean background, good lighting. Square format, professional photography.

8. Professional photo of a tutor teaching from home office. Modern setup with laptop, good lighting, tutor engaged in video call with students. Clean, organized workspace, professional atmosphere. Aspect ratio 16:9.

9. Collage-style image showing diverse tutors from around the world teaching online. Multiple small screens showing different tutors in their home offices. Global, inclusive representation. Modern, professional aesthetic. Aspect ratio 16:9.

10. Professional corporate training session. Diverse team of business professionals in modern office setting, learning together. Clean, corporate environment, professional attire, collaborative atmosphere. Aspect ratio 16:9.

11. Team of diverse professionals working together on language learning project. Modern office setting, collaborative workspace, people discussing and learning. Professional, inclusive atmosphere. Aspect ratio 4:3.

12. Screenshot-style image of a modern learning progress dashboard. Clean interface showing charts, progress bars, learning statistics. Modern UI design, professional color scheme, educational technology aesthetic. Aspect ratio 16:9.

13. Infographic-style image showing learning progress statistics. Clean, modern design with charts, graphs, and educational metrics. Professional color scheme, data visualization style. Aspect ratio 16:9.
```

## Usage Instructions:

1. **For Google Gemini**: Copy the "Quick Copy-Paste Format" section above
2. **Generate images**: Use each prompt individually in Gemini
3. **Save with exact filenames**: Use the filenames provided (e.g., `hero-student-learning.jpg`)
4. **Upload to R2**: Use the script `node scripts/uploadToR2.js` to upload all images
5. **Update URLs**: The script will generate `uploaded-urls.json` with public URLs

## File Structure After Generation:
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
