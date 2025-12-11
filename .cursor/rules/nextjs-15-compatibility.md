# Next.js 15 Compatibility Rules

## Critical: Route Parameters Must Be Awaited

In Next.js 15, the `params` object in dynamic routes MUST be awaited before accessing its properties.

### ❌ WRONG (causes server errors):
```typescript
export default async function Page({ params }: { params: { id: string } }) {
  const { id } = params  // ERROR: params must be awaited
  // ... rest of component
}
```

### ✅ CORRECT:
```typescript
export default async function Page({ params }: { params: { id: string } }) {
  const { id } = await params  // CORRECT: await params first
  // ... rest of component
}
```

## Error Messages to Watch For:
- `Route "/path/[param]" used 'params.param'`
- `'params' should be awaited before using its properties`
- `Server Error` in console
- 404 errors on dynamic routes

## Common Patterns:
```typescript
// Single parameter
const { id } = await params

// Multiple parameters
const { chapter, topic } = await params

// With type safety
interface PageProps {
  params: {
    chapter: string
    topic: string
  }
}

export default async function Page({ params }: PageProps) {
  const { chapter, topic } = await params
  // ... use chapter and topic
}
```

## Migration Checklist:
- [ ] Find all dynamic route pages
- [ ] Add `await` before `params` destructuring
- [ ] Test all dynamic routes
- [ ] Check for console errors
- [ ] Verify 404 errors are resolved
