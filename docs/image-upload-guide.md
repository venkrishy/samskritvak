# Image Upload to R2 and Supabase Integration Guide

## 🎯 **Complete Image Management System**

This guide shows you how to upload images to Cloudflare R2, store metadata in Supabase, and display them dynamically in your BhashaBoli application.

## 📋 **Prerequisites**

### **1. Environment Variables**
Make sure your `.env.local` file contains:

```bash
# Cloudflare R2 Configuration
R2_ENDPOINT=https://your-account-id.r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=your-access-key
R2_SECRET_ACCESS_KEY=your-secret-key
R2_BUCKET=your-bucket-name
R2_PUBLIC_BASE_URL=https://your-bucket.your-domain.com

# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### **2. Database Setup**
Run the Supabase migration to create the `site_images` table:

```sql
-- This is already created in: supabase/migrations/20251017_site_images_table.sql
```

## 🚀 **Step-by-Step Upload Process**

### **Step 1: Prepare Your Images**
1. Place all images in `/public/images/` folder
2. Ensure images are properly named (e.g., `hero-student-learning.jpg`)
3. Supported formats: JPG, PNG, GIF, SVG, WebP

### **Step 2: Run the Upload Script**
```bash
npm run upload-images
```

This will:
- ✅ Upload all images to Cloudflare R2
- ✅ Store metadata in Supabase database
- ✅ Generate public URLs
- ✅ Create a results report

### **Step 3: Verify Upload**
Check the generated `upload-results.json` file for:
- Successful uploads
- Public URLs
- Database records
- Any errors

## 🗄️ **Database Schema**

### **`site_images` Table Structure:**
```sql
CREATE TABLE public.site_images (
  id UUID PRIMARY KEY,
  filename TEXT NOT NULL,           -- e.g., "hero-student-learning.jpg"
  original_filename TEXT NOT NULL,   -- Original filename
  url TEXT NOT NULL,                -- R2 public URL
  category TEXT NOT NULL,           -- hero, avatar, tutor, background, etc.
  page TEXT NOT NULL,               -- homepage, tutors, teach, business, etc.
  alt_text TEXT,                    -- Alt text for accessibility
  description TEXT,                 -- Image description
  file_size INTEGER,                -- File size in bytes
  mime_type TEXT,                   -- image/jpeg, image/png, etc.
  is_active BOOLEAN DEFAULT TRUE,   -- Enable/disable images
  created_at TIMESTAMPTZ,           -- Upload timestamp
  updated_at TIMESTAMPTZ            -- Last modified
);
```

## 🎨 **Image Categories and Usage**

### **Hero Images**
- **Category:** `hero`
- **Pages:** `homepage`, `teach`, `business`, `proven-progress`
- **Usage:** Main banner images

### **Tutor Avatars**
- **Category:** `tutor`
- **Pages:** `tutors`
- **Usage:** Tutor profile photos

### **Testimonial Avatars**
- **Category:** `avatar`
- **Pages:** `homepage`
- **Usage:** Customer testimonial photos

### **Background Images**
- **Category:** `background`
- **Pages:** `homepage`
- **Usage:** Section backgrounds

### **Illustrations**
- **Category:** `illustration`
- **Pages:** `teach`, `business`
- **Usage:** Feature illustrations

## 🔧 **Using Images in Components**

### **1. Homepage Hero Image**
```javascript
// Automatically loads from database
const heroImg = await ImageService.getHeroImage('homepage')
setHeroImage(heroImg.url)
```

### **2. Tutor Avatars**
```javascript
// Load tutor avatars from database
const tutorAvatars = await ImageService.getTutorAvatars()
```

### **3. Testimonial Avatars**
```javascript
// Load testimonial avatars
const avatars = await ImageService.getTestimonialAvatars()
```

## 📊 **Image Service API**

### **Get All Images**
```javascript
const images = await ImageService.getAllImages()
```

### **Get Images by Category**
```javascript
const heroImages = await ImageService.getImagesByCategory('hero')
```

### **Get Images by Page**
```javascript
const homepageImages = await ImageService.getImagesByPage('homepage')
```

### **Get Specific Image**
```javascript
const image = await ImageService.getImageByFilename('hero-student-learning.jpg')
```

## 🎯 **Admin Panel Integration**

### **View All Images**
Access: http://localhost:3001/admin
- Navigate to "Images" tab (when implemented)
- View all uploaded images
- Edit metadata
- Enable/disable images

### **Image Management Features**
- ✅ Upload new images
- ✅ Edit image metadata
- ✅ Delete images
- ✅ Enable/disable images
- ✅ View usage statistics

## 🔄 **Dynamic Image Loading**

### **Component Integration**
Your components now automatically:
1. **Load images from database** instead of static files
2. **Fallback to local images** if database fails
3. **Update in real-time** when you change images
4. **Support multiple formats** and sizes

### **Example: Homepage Hero**
```javascript
// Before: Static image
heroImage="/images/hero-student-learning.jpg"

// After: Dynamic from database
const heroImg = await ImageService.getHeroImage('homepage')
heroImage={heroImg.url}
```

## 🚨 **Troubleshooting**

### **Common Issues:**

#### **1. R2 Upload Fails**
- Check R2 credentials in `.env.local`
- Verify bucket permissions
- Ensure images exist in `/public/images/`

#### **2. Database Connection Fails**
- Verify Supabase credentials
- Check if `site_images` table exists
- Run database migrations

#### **3. Images Not Loading**
- Check R2 public URLs
- Verify image metadata in database
- Check browser console for errors

### **Debug Commands:**
```bash
# Check environment variables
node -e "console.log(process.env.R2_ENDPOINT)"

# Test Supabase connection
node -e "import('./src/services/imageService.js').then(m => m.ImageService.getAllImages())"

# Verify image files
ls -la public/images/
```

## 📈 **Performance Optimization**

### **Image Optimization:**
- ✅ **Compress images** before upload
- ✅ **Use appropriate formats** (WebP for photos, SVG for icons)
- ✅ **Optimize file sizes** (aim for <500KB per image)
- ✅ **Use responsive images** for different screen sizes

### **Caching Strategy:**
- ✅ **R2 CDN** for fast global delivery
- ✅ **Browser caching** with proper headers
- ✅ **Database caching** for metadata

## 🎉 **Success Checklist**

After running the upload process, verify:

- ✅ **Images uploaded to R2** (check Cloudflare dashboard)
- ✅ **Metadata stored in Supabase** (check database)
- ✅ **Public URLs working** (test in browser)
- ✅ **Components loading images** (check application)
- ✅ **Fallbacks working** (test with database offline)

## 📞 **Support**

If you encounter issues:

1. **Check the logs** in `upload-results.json`
2. **Verify environment variables** are correct
3. **Test R2 and Supabase connections** separately
4. **Check browser console** for JavaScript errors

---

**Your images are now fully integrated with R2 and Supabase!** 🎉

