# Admin Profile Setup Guide

## 🎯 **Goal: Create SITE_ADMIN Profile for venkrishy@gmail.com**

You need to create a profile entry in the `profiles` table with the `SITE_ADMIN` role so you can access the admin panel.

## 🔍 **Step 1: Check if User Exists**

Go to your **Supabase Dashboard** → **SQL Editor** and run:

```sql
SELECT id, email, created_at 
FROM auth.users 
WHERE email = 'venkrishy@gmail.com';
```

### **If User EXISTS:**
- Copy the `id` from the result
- Go to Step 2

### **If User DOESN'T EXIST:**
- You need to sign up first at your app
- Or create the user manually in Supabase

## 👤 **Step 2: Create Admin Profile**

Run this SQL in your **Supabase SQL Editor**:

```sql
INSERT INTO public.profiles (
  id,
  email,
  full_name,
  role,
  created_at,
  updated_at
) VALUES (
  'YOUR_USER_ID_HERE', -- Replace with actual user ID from Step 1
  'venkrishy@gmail.com',
  'Venky Admin',
  'SITE_ADMIN',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  updated_at = NOW();
```

## ✅ **Step 3: Verify Profile Created**

Run this to confirm:

```sql
SELECT id, email, full_name, role, created_at 
FROM public.profiles 
WHERE email = 'venkrishy@gmail.com';
```

You should see:
- `email`: venkrishy@gmail.com
- `role`: SITE_ADMIN
- `full_name`: Venky Admin

## 🚀 **Step 4: Test Admin Access**

1. **Login** to your app with venkrishy@gmail.com
2. **Visit**: http://localhost:3003/admin
3. **Should see**: Admin panel with dark theme
4. **If access denied**: Check the profile was created correctly

## 🛠️ **Alternative: Use the Script**

If you prefer, you can run the Node.js script:

```bash
node scripts/seed-admin-profile.js
```

This will:
- Try to find your user automatically
- Create the profile with SITE_ADMIN role
- Provide manual steps if it fails

## 🚨 **Troubleshooting**

### **"Access Denied" Error:**
1. Check if profile exists: `SELECT * FROM profiles WHERE email = 'venkrishy@gmail.com';`
2. Verify role is SITE_ADMIN: `SELECT role FROM profiles WHERE email = 'venkrishy@gmail.com';`
3. Make sure you're logged in with the correct email

### **"User Not Found" Error:**
1. Sign up at your app first: http://localhost:3003
2. Use the email: venkrishy@gmail.com
3. Then run the profile creation SQL

### **Database Connection Issues:**
1. Check your Supabase credentials in `.env.local`
2. Verify the database is accessible
3. Check if RLS policies are blocking the operation

## 🎉 **Success Checklist**

After setup, you should have:
- ✅ **Profile created** in `profiles` table
- ✅ **Role set** to `SITE_ADMIN`
- ✅ **Admin panel accessible** at `/admin`
- ✅ **Currency management** working
- ✅ **Dark theme** admin interface

## 📞 **Quick Test**

Once everything is set up:

1. **Login**: http://localhost:3003 (with venkrishy@gmail.com)
2. **Admin Panel**: http://localhost:3003/admin
3. **Should see**: Purple/blue gradient admin interface
4. **Test**: Try adding a currency in the "Currencies" tab

Your BhashaBoli admin panel is ready! 🚀
