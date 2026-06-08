# Admin Dashboard Design Guide

## 🎨 Design System

### Color Palette

#### Primary Colors
- **Cyan**: `#00d9ff` - Main accent color for interactive elements
- **Cyan Dark**: `#0099b3` - Darker variant for hover states
- **Dark Background**: `#0f1419` - Primary background
- **Card Background**: `#1a1f2e` - Secondary background for cards

#### Status Colors
- **Blue**: `#3b82f6` - Information/Primary actions
- **Purple**: `#8b5cf6` - Secondary actions
- **Green**: `#10b981` - Success/Positive states
- **Orange**: `#f59e0b` - Warning states
- **Red**: `#ef4444` - Error/Danger states

#### Text Colors
- **Primary Text**: `#f0f4f8` - Main text color
- **Muted Text**: `#a0aec0` - Secondary text, labels

### Typography

```css
Font Family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif

Headings:
- H1: 1.8rem, weight 800, letter-spacing -0.5px
- H3: 1.05rem, weight 700, letter-spacing -0.3px

Body:
- Regular: 0.85rem, weight 500
- Labels: 0.75rem, weight 700, uppercase
- Muted: 0.9rem, weight 500, color: var(--text-muted)
```

### Spacing System

```css
Base Unit: 4px

Padding:
- xs: 4px
- sm: 8px
- md: 12px
- lg: 16px
- xl: 20px
- 2xl: 24px
- 3xl: 28px
- 4xl: 32px

Gap:
- Cards Grid: 20px
- Section Grid: 24px
- Sidebar Items: 4px margin-bottom
```

### Border Radius

```css
- Small: 8px (buttons, inputs)
- Medium: 12px (cards, badges)
- Large: 16px (section cards)
- Full: 50% (avatars, badges)
```

### Shadows

```css
--shadow-sm: 0 2px 8px rgba(0,0,0,0.2)
--shadow-md: 0 8px 24px rgba(0,0,0,0.3)
--shadow-lg: 0 16px 40px rgba(0,0,0,0.4)

Glow Effects:
- Cyan Glow: 0 0 20px rgba(0, 217, 255, 0.2)
- Hover Glow: 0 0 25px rgba(0, 217, 255, 0.3)
```

## 🏗️ Component Specifications

### Summary Cards
- **Height**: Auto (content-based)
- **Padding**: 24px
- **Border**: 1px solid var(--border-light)
- **Border Radius**: 16px
- **Top Border**: 4px gradient (color-coded)
- **Hover Effect**: translateY(-6px), enhanced glow
- **Backdrop**: blur(10px)

### Mini Cards
- **Padding**: 20px 16px
- **Border Radius**: 14px
- **Text Align**: center
- **Hover Effect**: translateY(-4px), subtle glow

### Section Cards
- **Padding**: 28px
- **Border Radius**: 16px
- **Header Border**: 1px solid var(--border) (bottom)
- **Hover Effect**: Border color change, subtle shadow

### Data Tables
- **Header Background**: rgba(0, 0, 0, 0.2)
- **Row Hover**: rgba(0, 217, 255, 0.05)
- **Cell Padding**: 14px 16px
- **Border**: 1px solid var(--border)

### Badges
- **Padding**: 4px 12px
- **Border Radius**: 20px
- **Font Size**: 0.7rem
- **Font Weight**: 700
- **Border**: 1px solid (color-specific)
- **Background**: Semi-transparent (0.2 opacity)

### Sidebar
- **Width**: 260px
- **Background**: Linear gradient (180deg)
- **Backdrop**: blur(10px)
- **Logo Padding**: 28px 24px
- **Nav Padding**: 20px 12px

### Top Bar
- **Height**: 72px
- **Padding**: 0 28px
- **Background**: Linear gradient with backdrop blur
- **Search Bar**: 180px width, rounded 12px

## 🎯 Interaction Patterns

### Hover States
```css
Cards:
- Transform: translateY(-6px) for summary cards, translateY(-4px) for mini cards
- Border Color: rgba(0, 217, 255, 0.3)
- Box Shadow: Enhanced glow effect

Navigation Items:
- Background: rgba(0, 217, 255, 0.08)
- Transform: translateX(4px)
- Color: var(--text)

Buttons/Links:
- Color: var(--cyan)
- Background: rgba(0, 217, 255, 0.1)
```

### Focus States
```css
Inputs/Selects:
- Border Color: var(--cyan)
- Background: rgba(37, 45, 61, 0.9)
- Box Shadow: 0 0 20px rgba(0, 217, 255, 0.2)
```

### Active States
```css
Navigation:
- Background: Linear gradient with glow
- Color: var(--cyan)
- Left Border: 3px gradient
- Font Weight: 600
```

## 📱 Responsive Breakpoints

```css
Desktop: 1024px+
- Full sidebar visible
- 2-column grid layouts
- Full search bar visible

Tablet: 768px - 1024px
- Single column layouts
- Sidebar visible
- Optimized spacing

Mobile: < 768px
- Sidebar hidden (toggle with menu button)
- Single column layouts
- Optimized touch targets
- Reduced padding

Small Mobile: < 480px
- Single column cards
- Stacked controls
- Minimal padding
```

## 🎬 Animations

### Fade In
```css
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}
Duration: 0.3s ease-in
```

### Pulse (Notification Dot)
```css
@keyframes pulse {
    0%, 100% { box-shadow: 0 0 8px rgba(239, 68, 68, 0.5); }
    50% { box-shadow: 0 0 16px rgba(239, 68, 68, 0.8); }
}
Duration: 2s infinite
```

### Transitions
- Default: 0.25s cubic-bezier(0.4, 0, 0.2, 1)
- Hover: 0.3s cubic-bezier(0.4, 0, 0.2, 1)
- Bar Fill: 1s cubic-bezier(0.4, 0, 0.2, 1)

## 🔧 Customization Guide

### Changing Primary Color
Replace all instances of `--cyan: #00d9ff` with your color:
```css
:root {
    --cyan: #YOUR_COLOR;
    --cyan-dark: #DARKER_VARIANT;
}
```

### Adjusting Sidebar Width
```css
:root {
    --sidebar-w: 260px; /* Change this value */
}
```

### Modifying Card Spacing
```css
.cards-grid {
    gap: 20px; /* Adjust gap between cards */
}
```

### Changing Backdrop Blur
```css
.sidebar, .topbar, .section-card {
    backdrop-filter: blur(10px); /* Adjust blur amount */
}
```

## ✅ Best Practices

1. **Consistency**: Use CSS variables for all colors and spacing
2. **Accessibility**: Maintain sufficient color contrast ratios
3. **Performance**: Use GPU-accelerated properties (transform, opacity)
4. **Responsiveness**: Test on multiple screen sizes
5. **Animations**: Keep animations subtle and purposeful
6. **Typography**: Maintain proper hierarchy with font weights
7. **Spacing**: Use consistent spacing throughout
8. **Borders**: Use semi-transparent borders for depth

## 🚀 Performance Tips

- Use `transform` and `opacity` for animations (GPU accelerated)
- Avoid animating `width` and `height` (use `transform: scale()` instead)
- Use `will-change` sparingly for frequently animated elements
- Minimize repaints with efficient selectors
- Use `backdrop-filter` judiciously (can impact performance)

## 📋 Accessibility Checklist

- ✅ Sufficient color contrast (WCAG AA standard)
- ✅ Semantic HTML structure
- ✅ Proper heading hierarchy
- ✅ Focus states visible
- ✅ Keyboard navigation support
- ✅ ARIA labels where needed
- ✅ Readable font sizes
- ✅ Touch-friendly targets (min 44px)

---

**Last Updated**: 2025-05-15
**Version**: 1.0
