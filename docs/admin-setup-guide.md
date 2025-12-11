# Admin Panel Setup Guide

## 🎯 **Enhanced Admin Panel with Role-Based Access Control**

Your BhashaBoli admin panel now features:
- ✅ **Role-based access control** (SITE_ADMIN only)
- ✅ **Currency management** with Indian Rupee support
- ✅ **Distinct dark theme** with purple/blue gradient
- ✅ **Dashboard with statistics**
- ✅ **Secure authorization**

## 🔐 **Setting Up SITE_ADMIN Role**

### **Step 1: Access Supabase Dashboard**
1. Go to your Supabase project dashboard
2. Navigate to **Authentication** → **Users**
3. Find your user account (or create one if needed)

### **Step 2: Update User Role in Database**
Run this SQL in your Supabase SQL Editor:

```sql
-- Update your user's role to SITE_ADMIN
UPDATE public.profiles 
SET role = 'SITE_ADMIN' 
WHERE id = 'your-user-id-here';

-- Verify the update
SELECT id, email, role FROM public.profiles WHERE role = 'SITE_ADMIN';
```

### **Step 3: Alternative - Direct Database Update**
If you know your user ID, you can also run:

```sql
-- Replace 'your-user-id' with your actual Supabase user ID
UPDATE public.profiles 
SET role = 'SITE_ADMIN' 
WHERE id = 'your-user-id';
```

## 🎨 **New Admin Panel Features**

### **1. Dashboard Tab**
- **Statistics Cards**: Total tutors, currencies, site health
- **Quick Actions**: Direct links to manage currencies and tutors
- **Real-time Data**: Live currency count and system status

### **2. Currencies Tab**
- **Add New Currency**: Complete form with all fields
- **Currency List**: View all supported currencies
- **Enable/Disable**: Toggle currency availability
- **Delete Currency**: Remove currencies you don't need

### **3. Enhanced Security**
- **Role Verification**: Checks SITE_ADMIN role on load
- **Automatic Redirect**: Non-authorized users redirected to home
- **Session Management**: Tracks admin activity

## 💰 **Currency Management**

### **Default Currencies Included:**
- 🇺🇸 **USD** - US Dollar ($)
- 🇪🇺 **EUR** - Euro (€)
- 🇬🇧 **GBP** - British Pound (£)
- 🇮🇳 **INR** - Indian Rupee (₹) ← **New!**
- 🇧🇷 **BRL** - Brazilian Real (R$)
- 🇵🇱 **PLN** - Polish Zloty (zł)
- 🇺🇦 **UAH** - Ukrainian Hryvnia (₴)

### **Adding Indian Rupee:**
The Indian Rupee is already included with:
- **Code**: INR
- **Symbol**: ₹
- **Flag**: 🇮🇳
- **Exchange Rate**: 83.0000 (base USD)
- **Display Order**: 4

### **Currency Fields:**
- **Code**: 3-letter currency code (INR, USD, etc.)
- **Name**: Full currency name (Indian Rupee)
- **Symbol**: Currency symbol (₹, $, €)
- **Flag Emoji**: Country flag emoji (🇮🇳)
- **Exchange Rate**: Rate against USD
- **Display Order**: Sort order in dropdowns
- **Active Status**: Enable/disable currency

## 🎨 **New Dark Theme Design**

### **Color Scheme:**
- **Background**: Purple to blue gradient (`from-purple-900 via-blue-900 to-indigo-900`)
- **Cards**: Semi-transparent white (`bg-white/10`)
- **Borders**: Subtle white borders (`border-white/20`)
- **Text**: White text with blue accents
- **Buttons**: Color-coded by function

### **Visual Elements:**
- **Header**: Dark header with user info and role display
- **Navigation**: Glass-morphism tab navigation
- **Forms**: Dark-themed inputs with white text
- **Cards**: Backdrop blur effects for modern look

## 🚀 **Accessing the Admin Panel**

### **URL**: http://localhost:3001/admin

### **Requirements:**
1. **Must be logged in** to your Supabase account
2. **Must have SITE_ADMIN role** in the database
3. **Must have proper permissions** in Supabase

### **What Happens If Not Authorized:**
- **Not logged in**: Redirected to homepage
- **Wrong role**: "Access Denied" screen with error message
- **Database error**: Redirected to homepage with error logged

## 🔧 **Database Schema Updates**

### **New Tables Created:**
1. **`currencies`** - Currency management
2. **`admin_sessions`** - Admin activity tracking

### **Updated Tables:**
1. **`profiles`** - Added SITE_ADMIN role support

### **Migration Files:**
- `supabase/migrations/20251017_admin_roles_currencies.sql`

## 📊 **Admin Panel Features**

### **Dashboard Tab:**
- Total tutors count
- Supported currencies count
- Site health status
- Quick action buttons

### **Currencies Tab:**
- Add new currency form
- List all currencies with flags
- Enable/disable currencies
- Delete currencies
- Real-time updates

### **Tutors Tab:**
- Add new tutor form
- Manage existing tutors
- Dark-themed form inputs

### **Languages Tab:**
- Placeholder for future language management

### **Settings Tab:**
- Placeholder for system settings

## 🛡️ **Security Features**

### **Role-Based Access:**
```javascript
// Checks user role on every page load
const { data: profile } = await supabase
  .from('profiles')
  .select('role')
  .eq('id', user.id)
  .single()

if (profile.role !== 'SITE_ADMIN') {
  // Redirect to home with error
}
```

### **Database Security:**
- **RLS Policies**: Only SITE_ADMIN can manage currencies
- **Session Tracking**: Admin activity logged
- **Automatic Logout**: Sessions expire after 24 hours

## 🎯 **Testing Your Setup**

### **1. Test Authorization:**
1. Login to your account
2. Visit http://localhost:3001/admin
3. Should see admin panel (not access denied)

### **2. Test Currency Management:**
1. Go to "Currencies" tab
2. Try adding a new currency
3. Check if it appears in the list
4. Test enable/disable functionality

### **3. Test Dashboard:**
1. Go to "Dashboard" tab
2. Verify statistics are displayed
3. Test quick action buttons

## 🚨 **Troubleshooting**

### **"Access Denied" Error:**
1. Check if you're logged in
2. Verify your role in Supabase database
3. Run the SQL update command above

### **Currency Not Saving:**
1. Check Supabase connection
2. Verify RLS policies are enabled
3. Check browser console for errors

### **Styling Issues:**
1. Clear browser cache
2. Restart development server
3. Check for CSS conflicts

## 🎉 **Success Checklist**

After setup, you should have:
- ✅ **Admin panel accessible** at `/admin`
- ✅ **SITE_ADMIN role** assigned to your user
- ✅ **Currency management** working
- ✅ **Dark theme** applied throughout
- ✅ **Role-based security** active
- ✅ **Indian Rupee** available in currencies

Your enhanced admin panel is now ready for managing your BhashaBoli platform! 🚀

