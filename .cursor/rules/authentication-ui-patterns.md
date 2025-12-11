# Authentication UI Patterns

## User Avatar and Dropdown Implementation

### Avatar Design:
- Use blue background (`bg-blue-600`) for authenticated state
- White text for contrast
- Include dropdown arrow indicator
- Hover states for interactivity

### Dropdown Menu:
```typescript
<div className="relative group">
  <button className="flex items-center gap-2 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">
    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
      <span className="text-sm font-medium text-white">V</span>
    </div>
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  </button>
  
  {/* Dropdown menu */}
  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
    <div className="py-1">
      <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
        <div className="font-medium">User Name</div>
        <div className="text-gray-500">user@email.com</div>
      </div>
      <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Account preferences</a>
      <a href="/" className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100">Log out</a>
    </div>
  </div>
</div>
```

## Logout Functionality:
- Always redirect to home page (`href="/"`)
- Use red color for logout link (`text-red-600`)
- Provide clear visual feedback

## Common Issues:
- Dropdown not appearing on hover
- Logout not working (wrong href)
- Avatar not showing user state
- Missing transition animations

## Testing Checklist:
- [ ] Avatar appears with correct styling
- [ ] Dropdown shows on hover
- [ ] User info displays correctly
- [ ] Logout redirects to home page
- [ ] Smooth transitions work
- [ ] Mobile responsiveness
