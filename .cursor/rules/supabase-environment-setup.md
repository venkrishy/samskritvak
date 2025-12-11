# Supabase Environment Setup Rules

## Environment Variables Must Be in Next.js App Directory

When working with Next.js apps in subdirectories (like `/next`), environment variables must be in the Next.js app directory, not the parent project.

### ❌ WRONG:
- Environment variables in parent project root
- Missing `.env.local` in Next.js app directory
- Using parent project's environment variables

### ✅ CORRECT:
- Copy `.env.local` to Next.js app directory: `cp /parent/.env.local /next/.env.local`
- Environment variables accessible to Next.js app
- Restart dev server after adding environment variables

## Required Environment Variables:
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key

# R2 (if using)
R2_BUCKET=your-bucket-name
R2_PUBLIC_BASE_URL=https://your-domain.com
R2_ENDPOINT=https://your-account-id.r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=your-access-key
R2_SECRET_ACCESS_KEY=your-secret-key
```

## Error Handling for Missing Environment Variables:
```typescript
// Check if environment variables are available
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) {
  console.error('Supabase environment variables not found')
  // Handle gracefully - don't crash the app
  return
}
```

## Common Errors:
- `supabaseKey is required`
- `Supabase environment variables not found`
- Blank table of contents
- Client-side Supabase errors

## Setup Checklist:
- [ ] Copy `.env.local` to Next.js app directory
- [ ] Verify environment variables are loaded
- [ ] Add error handling for missing variables
- [ ] Test Supabase client initialization
- [ ] Restart dev server after changes
