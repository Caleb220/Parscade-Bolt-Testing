# Parscade Design System

## Overview

The Parscade Design System provides a cohesive, scalable foundation for building consistent user interfaces across the platform. It emphasizes professionalism, clarity, and subtle elegance.

## Color Palette

### Primary Colors

- **Blue 500**: `#0ea5e9` - Primary brand color
- **Blue 600**: `#0284c7` - Primary hover state
- **Blue 700**: `#0369a1` - Primary active state

### Secondary Colors

- **Slate 500**: `#64748b` - Secondary text and elements
- **Slate 600**: `#475569` - Secondary hover state
- **Slate 700**: `#334155` - Secondary active state

### Status Colors

- **Success**: `#22c55e` (Emerald 500)
- **Warning**: `#f59e0b` (Amber 500)
- **Error**: `#ef4444` (Red 500)
- **Processing**: `#0ea5e9` (Blue 500)

## Typography

### Font Stack

- **Primary**: Inter, system-ui, sans-serif
- **Display**: Inter, system-ui, sans-serif
- **Monospace**: JetBrains Mono, Fira Code, monospace

### Font Weights

- **Light**: 300
- **Normal**: 400
- **Medium**: 500
- **Semibold**: 600
- **Bold**: 700

### Scale

- **xs**: 0.75rem (12px)
- **sm**: 0.875rem (14px)
- **base**: 1rem (16px)
- **lg**: 1.125rem (18px)
- **xl**: 1.25rem (20px)
- **2xl**: 1.5rem (24px)

## Spacing System

Based on 8px grid system:

- **1**: 0.25rem (4px)
- **2**: 0.5rem (8px)
- **3**: 0.75rem (12px)
- **4**: 1rem (16px)
- **6**: 1.5rem (24px)
- **8**: 2rem (32px)
- **12**: 3rem (48px)
- **16**: 4rem (64px)

## Components

### ParscadeCard

Professional card component with variants:

- **default**: Clean white background with subtle border
- **elevated**: Enhanced shadow for prominence
- **glass**: Backdrop blur effect for modern feel
- **gradient**: Subtle gradient background

```tsx
<ParscadeCard variant="elevated" hover>
  <div className="p-6">Content</div>
</ParscadeCard>
```

### ParscadeButton

Branded button with consistent styling:

- **primary**: Blue gradient with white text
- **secondary**: Slate gradient with dark text
- **outline**: Border with transparent background
- **ghost**: Minimal styling for subtle actions

```tsx
<ParscadeButton variant="primary" size="md" glow>
  Action
</ParscadeButton>
```

### ParscadeStatusBadge

Status indicators with consistent styling:

- **pending**: Amber colors
- **processing**: Blue colors with animation
- **completed**: Emerald colors
- **failed**: Red colors
- **cancelled**: Slate colors

```tsx
<ParscadeStatusBadge status="processing" animated />
```

## Shadows

### Parscade Shadow System

- **parscade**: `0 4px 20px rgba(14, 165, 233, 0.08)`
- **parscade-lg**: `0 10px 40px rgba(14, 165, 233, 0.12)`
- **parscade-glow**: `0 0 20px rgba(14, 165, 233, 0.2)`

## Animations

### Timing

- **Fast**: 150ms - Micro-interactions
- **Normal**: 250ms - Standard transitions
- **Slow**: 350ms - Complex animations

### Easing

- **Default**: `cubic-bezier(0.4, 0, 0.2, 1)`
- **Parscade**: `cubic-bezier(0.25, 0.46, 0.45, 0.94)` - Subtle bounce

### Common Patterns

```tsx
// Fade in up
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.4 }}

// Scale in
initial={{ opacity: 0, scale: 0.95 }}
animate={{ opacity: 1, scale: 1 }}
transition={{ duration: 0.3 }}

// Hover lift
whileHover={{ y: -2, scale: 1.01 }}
```

## Feature Module System

### Module Structure

Each feature module should follow this structure:

```
src/features/[feature-name]/
├── components/
├── hooks/
├── pages/
├── services/
├── types/
└── index.ts
```

### Access Control

Use `FeatureGate` component for role/tier-based access:

```tsx
<FeatureGate featureId="analytics">
  <AnalyticsComponent />
</FeatureGate>
```

### Navigation Integration

Add new features to `navigationStructure` in theme.ts:

```tsx
{
  id: 'new-feature',
  label: 'New Feature',
  path: '/dashboard/new-feature',
  icon: 'IconName',
  tier: 'pro' // Optional
}
```

## Best Practices

### Component Design

1. Use semantic HTML elements
2. Include proper ARIA labels
3. Support keyboard navigation
4. Provide loading and error states
5. Use consistent spacing and typography

### Performance

1. Use `React.memo` for expensive components
2. Implement proper key props for lists
3. Lazy load heavy components
4. Optimize animations for 60fps

### Accessibility

1. Maintain 4.5:1 color contrast ratio
2. Support reduced motion preferences
3. Include focus indicators
4. Use semantic markup

### State Management

1. Use React Query for server state
2. Keep local state minimal
3. Use context for shared UI state
4. Implement proper error boundaries

## Extension Guidelines

### Adding New Features

1. Create feature module in `src/features/`
2. Add navigation entry to theme configuration
3. Implement access control if needed
4. Follow component design patterns
5. Add comprehensive error handling

### Styling Guidelines

1. Use Parscade design tokens
2. Follow 8px spacing grid
3. Use consistent border radius (lg = 0.75rem)
4. Apply proper shadows for depth
5. Maintain color harmony

### Testing Strategy

1. Unit tests for business logic
2. Integration tests for API calls
3. Visual regression tests for UI
4. Accessibility testing with tools
5. Performance monitoring

This design system ensures consistency, scalability, and maintainability as Parscade grows.
