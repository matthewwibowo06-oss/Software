# Hero - Fast Internet for Rural Indonesia
## Design Philosophy

### **Design Approach: Modern Connectivity**

**Design Movement:** Contemporary tech + Indonesian warmth — a blend of sleek, minimalist digital interfaces with organic, human-centered elements that reflect Indonesia's vibrant culture.

**Core Principles:**
1. **Clarity through simplicity** — Clean layouts that guide users toward checking coverage and applying for service without friction
2. **Trust through transparency** — Visual hierarchy and honest communication about what Hero offers (no fiber required, local support)
3. **Speed & responsiveness** — The interface itself feels fast, reflecting the promise of fast internet
4. **Accessibility for all** — Rural users may have varying digital literacy; design must be intuitive and forgiving

**Color Philosophy:**
- **Primary: Vibrant Orange (#FF6B35)** — Energy, connectivity, warmth. Signals action and optimism. Unmistakably Hero's brand color.
- **Secondary: Deep Navy (#1A3A52)** — Trust, stability, professionalism. Grounds the design and provides contrast.
- **Accent: Bright Cyan (#00D4FF)** — Modern tech, speed, signal strength. Used for highlights and interactive states.
- **Neutrals: Off-white (#F8F9FA) and Charcoal (#2C3E50)** — Readability and breathing room.
- **Emotional warmth:** Subtle warm grays and earth tones in backgrounds and illustrations to reflect Indonesian landscape.

**Layout Paradigm:**
- Asymmetric, flowing layout with diagonal transitions between sections
- Hero section dominates with a strong visual (generated image of rural landscape + connectivity)
- Staggered content blocks with alternating left/right alignment to create visual rhythm
- Organic wave dividers between sections (not rigid straight lines)
- Mobile-first responsive design with full-width sections on small screens

**Signature Elements:**
1. **Signal Strength Motif** — Subtle animated signal bars appear throughout (hero section, package cards, testimonials)
2. **Organic Shapes** — Rounded corners, blob-like elements, and flowing dividers reflect connectivity and fluidity
3. **Illustrated Icons** — Custom, warm-toned icons for features (no generic flat icons)

**Interaction Philosophy:**
- Smooth, purposeful animations (no jank, no excessive motion)
- Hover effects on cards and buttons that feel responsive and alive
- Micro-interactions: buttons scale on press, coverage checker provides immediate visual feedback
- Scroll reveals: sections fade in as user scrolls, creating a sense of discovery

**Animation Guidelines:**
- Button press: `scale(0.97)` with 160ms ease-out
- Card hover: Subtle lift effect (transform: translateY(-4px)) with 200ms ease-out
- Section entrance: Fade-in + slight slide-up over 500ms with staggered children
- Smooth scroll behavior throughout
- Respect `prefers-reduced-motion` for accessibility

**Typography System:**
- **Display Font:** Poppins (bold, 700) — Headlines, hero text. Modern, friendly, energetic.
- **Body Font:** Inter (400, 500, 600) — Body copy, labels, descriptions. Clean and readable.
- **Hierarchy:**
  - H1: Poppins 48px/600 (desktop), 32px (mobile) — Hero headline
  - H2: Poppins 36px/600 (desktop), 24px (mobile) — Section titles
  - H3: Poppins 24px/600 — Card titles
  - Body: Inter 16px/400 — Main text
  - Small: Inter 14px/400 — Captions, labels

**Brand Essence:**
*"Fast, reliable internet for rural Indonesia—no fiber, no hassle, just connection."*

**Personality:** Energetic, trustworthy, accessible, locally grounded.

**Brand Voice:**
- Headlines: Direct, optimistic, action-oriented. Examples: "Check Your Coverage Now" / "Fast Internet, No Fiber Required"
- CTAs: Clear and urgent without being pushy. Examples: "Check Coverage" / "Apply Now" / "Join the Waitlist"
- Microcopy: Friendly, supportive tone. Examples: "Enter your address to see if you're covered" / "Local support, always here to help"
- Ban: Avoid corporate jargon, generic tech speak, or overly formal language.

**Wordmark & Logo:**
- **Logo Concept:** A bold, geometric symbol combining a signal wave and a map pin (representing location + connectivity). No text, just the mark. Warm orange (#FF6B35) on transparent background.
- **Usage:** Header nav, favicon, testimonial avatars background.

**Signature Brand Color:** Vibrant Orange (#FF6B35) — unmistakably Hero's color, used for primary CTAs, highlights, and brand touchpoints.

---

## Implementation Notes
- Generate hero background image: rural Indonesian landscape with subtle connectivity visualization
- Use wave dividers between sections to create organic flow
- Ensure all interactive elements (buttons, form inputs) feel responsive and alive
- Mobile-first approach: test on small screens first, scale up
- Accessibility: WCAG AA compliance, keyboard navigation, sufficient color contrast
