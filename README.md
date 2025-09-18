# Portfolio (Quinjie Benedict Capayan)

A lightweight, static portfolio showcasing projects, skills, and contact info with a glassmorphism UI and subtle canvas background effects.

- Live preview: [Portfolio | Quinjie Benedict Capayan](https://kyobii-portfolio.vercel.app/)
- Tech: HTML, CSS, JavaScript (no build step, no dependencies)

## Features
- Glassmorphism UI with accessible, responsive layout
- Particle background (noise texture + tasteful animated particles)
- Sticky, glass navbar with smooth anchor scrolling
- Typed text effects (hero title once, looping keywords, right-side lines)
- Projects grid with tech badges and hover states
- Contact section with mailto form and copy-to-clipboard
- Back-to-top button and scroll reveal animations
- Reduced motion support (prefers-reduced-motion)
- Best-effort GitHub contributions count

## Structure
- index.html — markup and small vanilla JS for UI
- style.css — theme, layout, components (glass effects)
- background-effects.js — canvas particles + noise texture
- photos/ — images (hero background, profile, project thumbnails)

## Getting Started
1) Clone or download the repository.
2) Ensure photos/ contains the referenced images:
   - photos/herobg.jpg (hero background)
   - photos/pfp.png and project thumbnails used in index.html
3) Open index.html in a browser.
   - Optional: use a static server (e.g., VS Code Live Server) for best results.

## Customization
- Background effects (background-effects.js)
  - Particle count: window.bgEffectsControl.setParticleCount(n)
  - Intensity (0–1): window.bgEffectsControl.setIntensity(level)
  - Toggle: window.bgEffectsControl.toggle(true|false)
  - Respects reduced motion automatically; pauses when tab hidden
- Typed words (hero):
  - Edit data-words on .typed-words in index.html
  - Edit data-lines on .typed-right
- Contributions count:
  - In index.html, set username in loadContribCount() script
- Contact email:
  - Mailto fallback default is capayan08@gmail.com; update in the contact form script
- Images:
  - Replace photos/* files and alt text in index.html

## Accessibility & Performance
- Honors prefers-reduced-motion
- requestAnimationFrame-driven animations; paused on tab hidden
- Keyboard-friendly links and ARIA labels on nav and controls
- Avoids heavy canvas effects; low particle count with subtle motion

## Deployment
- GitHub Pages: push to main, enable Pages (root: /)
- Netlify/Vercel: drag-and-drop or connect repo (static site)

## Notes
- No backend; the contact form opens the default mail app via mailto
- Contribution API is best-effort and may be rate-limited or unavailable
- Icons from Simple Icons CDN; Java icon from vectorlogo.zone

