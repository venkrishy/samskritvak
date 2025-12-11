# Environment Variables Setup Guide

## 🚨 **Error: "supabaseKey is required"**

This error occurs because your Supabase environment variables are not configured. Here's how to fix it:

## 🔧 **Step 1: Create .env.local File**

Create a file called `.env.local` in your project root with these variables:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=your-supabase-url-here
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key-here

# Cloudflare R2 Configuration (optional - for image uploads)
R2_ENDPOINT=https://your-account-id.r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=your-access-key
R2_SECRET_ACCESS_KEY=your-secret-key
R2_BUCKET=your-bucket-name
R2_PUBLIC_BASE_URL=https://your-bucket.your-domain.com
```

## 🔍 **Step 2: Get Your Supabase Credentials**

### **From Supabase Dashboard:**
1. Go to your Supabase project dashboard
2. Click on **Settings** → **API**
3. Copy the following values:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** key → `VITE_SUPABASE_ANON_KEY`

### **Example .env.local:**
```bash
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 🚀 **Step 3: Restart Development Server**

After creating the `.env.local` file:

```bash
# Stop the current server (Ctrl+C)
# Then restart
npm run dev
```

## ✅ **Step 4: Verify Setup**

Check if the environment variables are loaded:

```bash
# In your terminal, run:
node -e "console.log('VITE_SUPABASE_URL:', process.env.VITE_SUPABASE_URL)"
```

You should see your Supabase URL printed.

## 🛠️ **Alternative: Quick Fix**

If you want to test without Supabase for now, you can modify the service to handle missing credentials:

### **Update ImageAssetsService.js:**
```javascript
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key'

if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('placeholder')) {
  console.warn('Supabase credentials not configured. Using local images.')
  // Return empty arrays to trigger fallbacks
}
```

## 🔒 **Security Notes**

### **✅ Do:**
- Add `.env.local` to `.gitignore` (already done)
- Never commit environment variables to git
- Use different keys for development/production

### **❌ Don't:**
- Put real credentials in code
- Commit `.env.local` to git
- Share your Supabase keys publicly

## 🎯 **Quick Test**

Once you've set up the `.env.local` file:

1. **Restart the dev server**: `npm run dev`
2. **Visit homepage**: http://localhost:3003
3. **Check console**: Should see no Supabase errors
4. **Test database images**: Visit tutors page to see if database images load

## 🚨 **Troubleshooting**

### **Still Getting Errors?**
1. **Check file name**: Must be exactly `.env.local`
2. **Check location**: Must be in project root (same level as package.json)
3. **Restart server**: Environment variables only load on startup
4. **Check syntax**: No spaces around `=` in .env.local

### **Database Connection Issues?**
1. **Verify Supabase URL**: Should start with `https://`
2. **Verify anon key**: Should be a long JWT token
3. **Check Supabase project**: Make sure it's active
4. **Check RLS policies**: Make sure they allow public access

## 📞 **Need Help?**

If you're still having issues:

1. **Check Supabase dashboard** - Is your project active?
2. **Verify credentials** - Copy-paste from Supabase dashboard
3. **Test connection** - Try the Supabase test in your dashboard
4. **Check console** - Look for specific error messages

Your BhashaBoli platform will work perfectly once the environment variables are configured! 🚀
