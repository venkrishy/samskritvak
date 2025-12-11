# BhashaBoli Admin Configuration Guide

## 🎯 **Admin Control Panel**

Access your admin panel at: **http://localhost:3001/admin**

## 📋 **What You Can Control**

### **1. Tutor Management**
- **Add/Edit/Delete Tutors**: Control all tutor profiles
- **Names**: Change "Sarah Johnson", "Carlos Rodriguez", etc.
- **Languages**: Modify which languages each tutor teaches
- **Rates**: Set hourly rates for each tutor
- **Bios**: Update tutor descriptions and experience
- **Photos**: Change profile pictures
- **Certifications**: Add/remove tutor qualifications

### **2. Language Support**
- **Add Languages**: Add new languages to teach
- **Remove Languages**: Remove languages from the platform
- **Language Flags**: Update country flags for languages
- **Interface Languages**: Control which languages the site supports

### **3. Site Content**
- **Site Name**: Change "BhashaBoli" to your brand
- **Taglines**: Update hero section text
- **Descriptions**: Modify site descriptions
- **Contact Info**: Update email, phone, address
- **Business Hours**: Set support hours

### **4. Currency & Pricing**
- **Supported Currencies**: Add/remove currencies (USD, EUR, GBP, etc.)
- **Exchange Rates**: Update currency conversion rates
- **Pricing Display**: Control how prices are shown

### **5. Content Management**
- **FAQ Questions**: Add/edit frequently asked questions
- **Testimonials**: Update student testimonials
- **Stats**: Modify platform statistics
- **Benefits**: Update tutor benefits and features

## 🔧 **Configuration File**

All settings are controlled in: `/src/config/siteConfig.js`

### **Key Sections:**

```javascript
// Site Branding
siteName: "BhashaBoli",
siteTagline: "Learn faster with your best language tutor",

// Tutor Data
sampleTutors: [
  {
    full_name: 'Sarah Johnson',  // ← Change this
    languages_taught: ['English', 'Spanish'],  // ← Modify languages
    hourly_rate_usd: 25,  // ← Set rates
    bio: 'Native English speaker...',  // ← Update bio
  }
],

// Supported Languages
supportedLanguages: [
  { code: 'en', name: 'English', flag: '🇺🇸' },  // ← Add/remove languages
],

// Site Statistics
stats: [
  { number: '100,000+', label: 'Experienced tutors' },  // ← Update stats
]
```

## 🚀 **How to Make Changes**

### **Method 1: Admin Panel (Recommended)**
1. Go to http://localhost:3001/admin
2. Use the tabbed interface to manage different sections
3. Changes are applied immediately

### **Method 2: Direct File Editing**
1. Open `/src/config/siteConfig.js`
2. Modify the configuration object
3. Save the file
4. Changes appear immediately in the browser

## 📝 **Common Customizations**

### **Change Tutor Names:**
```javascript
// In siteConfig.js
sampleTutors: [
  {
    full_name: 'Your Tutor Name',  // ← Change this
    // ... rest of config
  }
]
```

### **Add New Language:**
```javascript
supportedLanguages: [
  // ... existing languages
  { code: 'sw', name: 'Swahili', flag: '🇰🇪' },  // ← Add new language
]
```

### **Update Site Branding:**
```javascript
siteName: "Your Platform Name",
siteTagline: "Your custom tagline",
siteDescription: "Your platform description",
```

### **Modify Tutor Rates:**
```javascript
sampleTutors: [
  {
    hourly_rate_usd: 30,  // ← Change rate
    // ... rest of config
  }
]
```

## 🔄 **Real-time Updates**

- **No Restart Required**: Changes appear immediately
- **Hot Reload**: Browser updates automatically
- **Live Preview**: See changes instantly

## 🎨 **Customization Examples**

### **Example 1: Change All Tutor Names**
```javascript
sampleTutors: [
  {
    full_name: 'Dr. Emily Watson',
    languages_taught: ['English', 'French'],
    hourly_rate_usd: 35,
    bio: 'PhD in Linguistics with 10 years experience...',
  },
  {
    full_name: 'Prof. Ahmed Hassan',
    languages_taught: ['Arabic', 'English'],
    hourly_rate_usd: 28,
    bio: 'Native Arabic speaker, expert in business Arabic...',
  }
]
```

### **Example 2: Add New Language Support**
```javascript
supportedLanguages: [
  // ... existing languages
  { code: 'th', name: 'Thai', flag: '🇹🇭' },
  { code: 'vi', name: 'Vietnamese', flag: '🇻🇳' },
  { code: 'tr', name: 'Turkish', flag: '🇹🇷' },
]
```

### **Example 3: Update Site Content**
```javascript
siteName: "LinguaLearn",
siteTagline: "Master any language with expert tutors",
siteDescription: "Connect with native speakers and certified teachers for personalized language learning.",
```

## 🛡️ **Security Note**

The admin panel is currently accessible to anyone. In production, you should:
1. Add authentication/authorization
2. Restrict access to admin users only
3. Add role-based permissions

## 📞 **Support**

For questions about configuration:
1. Check the configuration file comments
2. Review the admin panel interface
3. Test changes in development first

---

**Happy Customizing!** 🎉

