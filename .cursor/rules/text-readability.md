# Text Readability Rules

## High Contrast for Readability

Always ensure text has sufficient contrast against its background for accessibility and readability.

### ❌ WRONG (hard to read):
```css
/* Blue text on dark background */
.text-blue-600 {
  color: #2563eb;
}
.bg-gray-900 {
  background-color: #111827;
}
```

### ✅ CORRECT (high contrast):
```css
/* Black text on white background */
.text-black {
  color: #000000;
}
.bg-white {
  background-color: #ffffff;
}
```

## Color Combinations:
- **Best**: Black text on white background
- **Good**: Dark gray text on white background (`text-gray-900`, `text-gray-700`)
- **Avoid**: Blue text on dark backgrounds
- **Avoid**: Light text on light backgrounds

## Implementation:
```tsx
// High contrast hero text
<h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-black">
  The educational Platform to learn spoken sanskrit.
</h1>
<p className="mt-4 text-gray-700">
  Join the 100+ students that use Samskritavak...
</p>
```

## Testing Checklist:
- [ ] Text is clearly readable
- [ ] Sufficient contrast ratio
- [ ] Works on different screen sizes
- [ ] Accessible to users with visual impairments
- [ ] Test on different devices and browsers

## Common Issues:
- Blue text on dark backgrounds
- Light text on light backgrounds
- Insufficient contrast ratios
- Text blending with background images
- Poor readability on mobile devices
