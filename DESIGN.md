# Design System: Vel Tech Campus Events
**Project ID:** 8930453190395835520

## 1. Visual Theme & Atmosphere
A clean, professional, and trustworthy university event platform. Inspired by Vel Tech's institutional identity — deep navy blue and rich crimson red accents. The design feels official yet modern, like a polished internal tool that students and staff actually want to use. Light mode primary, with warm whites and soft grays for readability.

## 2. Color Palette & Roles
- **Vel Tech Navy** (#1B2A4A) — Primary brand color, navbar, headers, sidebar backgrounds
- **Vel Tech Crimson** (#C62828) — Accent color, CTA buttons, highlights, badges, inspired by Vel Tech logo red
- **Clean White** (#FFFFFF) — Page backgrounds, card surfaces
- **Soft Gray** (#F5F7FA) — Section backgrounds, alternate rows
- **Charcoal** (#1F2937) — Primary body text
- **Slate Gray** (#6B7280) — Secondary text, labels, placeholders
- **Light Border** (#E5E7EB) — Card borders, dividers, input borders
- **Success Green** (#16A34A) — Success toasts, confirmed status, available spots
- **Warning Amber** (#F59E0B) — Warning states, limited spots, pending status
- **Danger Red** (#DC2626) — Delete actions, errors, cancelled status
- **Soft Blue** (#EFF6FF) — Info backgrounds, selected row highlights

## 3. Typography Rules
- **Font Family:** "Inter" — clean, professional sans-serif
- **Headings (H1):** 28-32px, font-weight 700, Charcoal
- **Headings (H2):** 22-24px, font-weight 600, Charcoal
- **Body:** 15-16px, font-weight 400, line-height 1.6, Charcoal
- **Labels:** 13-14px, font-weight 500, Slate Gray, sometimes uppercase
- **Button Text:** 14-15px, font-weight 600

## 4. Component Stylings
* **Buttons:**
  - Primary: Vel Tech Crimson (#C62828) solid fill, white text, rounded (8px), hover darkens
  - Secondary: White with Navy border, Navy text, rounded (8px), hover fills with navy
  - Ghost: Transparent with underline on hover
* **Cards:**
  - Clean White background, 1px Light Border, rounded (12px), subtle shadow (0 2px 8px rgba(0,0,0,0.06))
  - Hover: slightly elevated shadow
* **Inputs/Forms:**
  - White background, 1px Light Border, rounded (8px)
  - Focus: Vel Tech Navy border with subtle blue ring
  - Labels above inputs in Slate Gray, 13px
* **Badges/Pills:**
  - Small rounded pills (full radius) with semi-transparent backgrounds
  - Workshop=Blue, Seminar=Purple, Hackathon=Green, Cultural=Orange, Sports=Red, Guest Lecture=Teal
* **Tables:**
  - Clean header with Soft Gray background, alternating row colors, hover highlight in Soft Blue
* **Toasts:**
  - Bottom-right positioned, success green / error red, with icon and auto-dismiss
* **Navigation:**
  - Fixed top bar, Vel Tech Navy background, white text, Crimson active indicator

## 5. Layout Principles
- **Max Width:** 1200px container, centered
- **Grid:** Event cards in 3-column grid (desktop), 2 (tablet), 1 (mobile)
- **Spacing:** 16px, 24px, 32px consistent padding
- **Navbar height:** 64px
- **Admin sidebar:** 240px fixed width

## 6. Design System Notes for Stitch Generation
**DESIGN SYSTEM (REQUIRED):**
- Platform: Web, Desktop-first, responsive
- Theme: Light mode, clean professional university style
- Background: Clean White (#FFFFFF), section alternate Soft Gray (#F5F7FA)
- Navbar: Vel Tech Navy (#1B2A4A) background, white text
- Primary Accent: Vel Tech Crimson (#C62828) for CTAs and important actions
- Secondary: Vel Tech Navy (#1B2A4A) for headers and structure
- Text Primary: Charcoal (#1F2937)
- Text Secondary: Slate Gray (#6B7280)
- Borders: Light Gray (#E5E7EB)
- Cards: White, 1px border, rounded (12px), subtle shadow
- Buttons: Crimson primary, Navy secondary, rounded (8px)
- Inputs: White, bordered, rounded (8px), blue focus ring
- Font: Inter
- Status badges: Green=confirmed, Amber=pending, Red=cancelled
