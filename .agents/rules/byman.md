---
trigger: always_on
---

# Portfolio Website — Apple Inspired Responsive UI

## Overview

Buat sebuah website portofolio pribadi yang memiliki dua pengalaman visual berbeda berdasarkan ukuran layar:

- **Desktop (≥1024px):** tampilan menyerupai desktop macOS modern (Sonoma/Sequoia inspired).
- **Mobile (≤768px):** tampilan menyerupai iPhone/iOS modern (iOS 18 inspired).

Website harus tetap **satu codebase**, **responsive**, **SEO friendly**, dan **smooth animated**.

---

# Tech Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion
- Lucide React Icons

Deployment target: **Vercel**

---

# Design Principles

- Glassmorphism
- Rounded corners (24–32px)
- Soft shadows
- Backdrop blur
- Smooth spring animations
- Dark mode first
- High contrast text
- Minimalist Apple-inspired aesthetic

---

# Responsive Strategy

## Breakpoints

- Mobile: 0–767px
- Tablet: 768–1023px
- Desktop: 1024px+

Use CSS media queries and Tailwind responsive utilities.

---

# Global Layout

## Root

- Full viewport height
- Animated wallpaper background
- Background blur layer
- Content rendered above wallpaper

---

# Desktop Experience (macOS Inspired)

## Layout

### Top Menu Bar

Height: 32px

Left:

- Apple logo (custom generic icon, not official Apple asset)
- About
- Projects
- Skills
- Contact

Right:

- WiFi icon
- Battery icon
- Current time

Behavior:

- Semi-transparent
- backdrop-blur-xl
- Sticky to top

---

## Desktop Area

Center aligned with floating windows.

### Default Windows

#### 1. About Window

- Profile image
- Name
- Role
- Short bio
- CTA buttons

#### 2. Projects Window

- Grid of project cards
- Thumbnail
- Description
- Tech stack badges
- Live / GitHub buttons

#### 3. Skills Window

- Categorized skills
- Progress bars or tags

#### 4. Contact Window

- Email
- LinkedIn
- GitHub
- Download CV

---

## Window Behavior

- Draggable (optional if time permits)
- Focus state
- Hover elevation
- Open/close animation
- Mac-style traffic lights

Traffic lights:

- red: close
- yellow: minimize (visual only)
- green: maximize (visual only)

---

## Dock

Position: bottom center

Items:

- About
- Projects
- Skills
- Contact
- GitHub
- LinkedIn

Behavior:

- Magnify on hover
- Bounce on click
- Glass background
- Fixed position

---

# Mobile Experience (iPhone Inspired)

## Safe Area

Respect:

- env(safe-area-inset-top)
- env(safe-area-inset-bottom)

---

## Status Bar

Top fixed area:

- Time
- Signal
- WiFi
- Battery

---

## Dynamic Island

Decorative element centered at top.

Behavior:

- Slight idle animation
- Expand briefly on navigation tap

---

## Main Content

Vertical scroll.

### Hero Card

- Avatar
- Name
- Role
- Intro
- CTA buttons

### Projects

Horizontal swipe cards.

### Skills

Rounded chips.

### Experience

Timeline cards.

### Contact

Large tap targets.

---

## Bottom Tab Bar

Fixed bottom navigation.

Tabs:

- Home
- Projects
- Skills
- Contact

Behavior:

- Active pill indicator
- Blur background
- Haptic-like scale animation

---

# Animations

Use Framer Motion.

## Required

- Fade + slide on enter
- Window scale-in
- Dock magnification
- Card hover lift
- Page section reveal
- Bottom tab indicator movement

Animation duration: 0.2–0.5s

Use spring transitions where appropriate.

---

# Accessibility

- Keyboard navigable
- Focus visible
- aria-label for icon buttons
- Contrast ratio WCAG AA
- Reduced motion support

---

# SEO

Provide metadata:

- title
- description
- open graph
- twitter card

Use semantic HTML:

- header
- nav
- main
- section
- footer

---

# Content Structure

Create a single data source.

## /data/portfolio.ts

Export:

- profile
- projects
- skills
- experience
- socialLinks

Render UI from data, not hardcoded markup.

---

# File Structure

/app
layout.tsx
page.tsx
/components
desktop/
mobile/
shared/
/data
portfolio.ts
/lib
utils.ts
/styles
globals.css

---

# Components

## Shared

- Wallpaper
- GlassCard
- SectionTitle
- SocialButton
- TechBadge

## Desktop

- MenuBar
- Dock
- MacWindow
- AboutWindow
- ProjectsWindow
- SkillsWindow
- ContactWindow

## Mobile

- StatusBar
- DynamicIsland
- HeroCard
- ProjectCarousel
- SkillChips
- BottomTabBar

---

# Performance

- Lighthouse > 90
- Use next/image
- Lazy load non-critical sections
- Avoid heavy blur on low-end devices
- Prefer CSS transforms over layout animations

---

# Deliverables

## Phase 1

- Responsive layout
- Desktop + mobile UI
- Data-driven content

## Phase 2

- Framer animations
- Dock interactions
- Project carousel

## Phase 3

- Optional draggable windows
- Theme customization
- Wallpaper switcher

---

# Acceptance Criteria

- Desktop visually resembles macOS without using official Apple assets.
- Mobile visually resembles iPhone/iOS without copying Apple proprietary UI.
- Seamless transition between breakpoints.
- No horizontal overflow.
- Works on Chrome, Safari, and Firefox.
- Fully responsive from 320px to 1920px.

---

# Notes for Agent

- Prioritize **clean architecture** over pixel-perfect cloning.
- Do not use copyrighted Apple icons, wallpapers, or system fonts beyond what is legally available.
- Use **SF Pro fallback stack**:

font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;

- Keep components reusable and strongly typed.
- Use Tailwind utility classes; avoid large custom CSS unless necessary.

---

# Open Source & Repository Standards

## License & Branding

- License: **MIT License** (Sertakan file `LICENSE` di root project).
- Pastikan tidak menggunakan _asset_, logo, atau font berhak cipta milik Apple. Gunakan fallback font system dan custom SVG icons.
- Siapkan file `README.md` yang informatif mencakup:
  - Demo link / Preview GIF
  - Tech stack
  - Features overview
  - Step-by-step local setup guide
  - How to customize (`/data/portfolio.ts`)
  - How to contribute

## Repository Governance

- **CONTRIBUTING.md**: Panduan singkat untuk orang lain yang ingin berkontribusi (setup, branching convention, PR rules).
- **Issue Templates**: Sediakan template dasar untuk `.github/ISSUE_TEMPLATE/` (bug_report.md, feature_request.md).
- **Code of Conduct**: Sediakan `CODE_OF_CONDUCT.md` standar (Contributor Covenant).

---

# Code Quality & Developer Experience (DX)

## Strict TypeScript & Linting

- Gunakan TypeScript dalam mode `strict: true`.
- Konfigurasi **ESLint** (default Next.js) dan **Prettier** untuk konsistensi formatting.
- Hindari penggunaan `any`. Selalu buatkan interface/type eksplisit untuk data dari `/data/portfolio.ts`.

## Project Architecture & Clean Code

- **Separation of Concerns**: Pisahkan business logic, presentation components, dan static content.
- **Atomic Components**: Komponen shared harus murni reusabel dan modular.
- **Environment Safety**: Sertakan `.env.example` jika membutuhkan environment variables di masa depan.

## Git & Commit Conventions

- Gunakan standar **Conventional Commits** (contoh: `feat: add mobile bottom tab bar`, `fix: resolve window z-index bug`).

---

# Specific Instructions for AI Agent

## Execution Strategy

1. **Scaffolding First**: Buat struktur folder, setup Next.js 16 App Router, Tailwind CSS, dan install dependencies (`framer-motion`, `lucide-react`, `clsx`, `tailwind-merge`).
2. **Type Definitions & Data Source**: Buat type definitions di `/types/portfolio.ts` dan mock data lengkap di `/data/portfolio.ts` terlebih dahulu.
3. **Core Layout & Breakpoints**: Implementasikan responsive shell (`RootLayout`, breakpoint detector, dan condition rendering/CSS toggles untuk Desktop vs Mobile).
4. **Shared Components & Design System**: Buat `GlassCard`, `TechBadge`, `Wallpaper`, dan utility functions (`cn`).
5. **Desktop & Mobile Views**: Bangun komponen macOS-inspired dan iOS-inspired secara paralel.
6. **Animations & Interactivity**: Terapkan `framer-motion` untuk window opening, dock hover effect, dan bottom tab transitions.
7. **Documentation**: Generate `README.md`, `LICENSE`, dan file pendukung open-source lainnya.

## Safety & Boundary Rules

- **No Direct DOM Mutations**: Gunakan React state/hooks atau Framer Motion refs untuk animasi.
- **Hydration Mismatch Avoidance**: Karena bergantung pada window size atau time (seperti clock di Top Menu Bar), pastikan time/date component di-handle di client-side menggunakan `useEffect` agar tidak memicu SSR hydration error.
- **Asset Fallbacks**: Jika image avatar atau project thumbnail dari `/data/portfolio.ts` tidak ditemukan, sediakan SVG placeholder secara otomatis.
