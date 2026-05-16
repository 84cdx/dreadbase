# DREADBASE 🌑

> A high-performance, dark-minimalist media dossier (in the style of Letterboxd & Hacker Terminals) for movies, video games, and log reports.

![Dreadbase Dashboard Screenshot](./public/image/Screenshot_531.png)

DREADBASE is an immersive archival system built for performance, modern architecture, and an uncompromising design featuring Cyberpunk/Noir aesthetics.

## 🚀 Tech Stack & Architecture

*   **Framework:** Next.js 15/16 (App Router, React 19)
    *   *Architecture Focus:* Server-Side Rendering (SSR), progressive streaming, and asynchronous resolution of dynamic routes (`const { slug } = await params;`).
*   **Backend & Auth:** Supabase (PostgreSQL)
    *   Integration via `@supabase/ssr` for user authentication and protected system areas (Vault).
*   **Styling:** Tailwind CSS
    *   Custom dark theme system with deep black Noir elements and high-contrast UI components.
*   **External APIs (Server-side isolated):**
    *   **TMDB API:** Aggregation of movie data via REST (`src/lib/tmdb.ts`).
    *   **IGDB API:** Aggregation of gaming data via POST requests using Twitch OAuth validation (`src/lib/igdb.ts`).

## ✨ Core Features

*   **Dynamic News & Dossier System:**
    *   Full-width, immersive layouts for reports with a smooth fade-to-black backdrop.
    *   Multimedia integration (responsive YouTube trailers via `aspect-video`) and intelligent cross-linking in the footer to increase user retention.
*   **Global Live Search (Debounced):**
    *   Real-time search (debounced to 600–1000ms) combining results from different API interfaces.
    *   UI/UX optimization: Eliminated uncontrolled page scrolling using CSS `overscroll-behavior: contain` (Scroll Chaining Fix).
*   **Asynchronous Streaming & High Performance:**
    *   Maximized performance using Next.js Suspense and Skeletons for incremental streaming of page sections.
    *   Automated Hero Banner Carousel (10s interval) with a synchronized global progress bar in the navigation.

    ![Dreadbase Vault Screenshot](./public/image/Screenshot_532.png)

## 🛠️ Solved Engineering Challenges

*   **UX/UI Refinement & Design Consistency:**
    *   Mobile-first usability improved by transforming rigid elements into clickable teaser panels with larger hit areas.
    *   High-contrast components, such as the `[ OPEN_FILE ]` label, which undergoes a complete color inversion (`group-hover`) to provide clear visual cues without clunky standard buttons.
*   **Production Deployment & Cross-Origin Auth:**
    *   Seamless Vercel deployment with dynamic URL detection for the OAuth flow (`process.env.NEXT_PUBLIC_VERCEL_URL`) in the Auth Callback Handler, fixing localhost routing issues.
*   **Hydration Mismatch Fixes:**
    *   Resolved critical SSR rendering conflicts in the `RootLayout` (caused by client-side browser extensions like Grammarly/translators) through targeted use of `suppressHydrationWarning`.
*   **Accessibility (a11y) & Semantic HTML:**
    *   Strict semantic HTML5 landmarks (`<main>`), correct language attributes (`<html lang="en">`), and resolved WAI-ARIA conflicts for warning-free Vercel builds.

## ⚙️ Local Development

1. Clone the repository
2. Install dependencies: `npm install`
3. Configure environment variables in `.env.local` (Supabase, TMDB, IGDB)
4. Start the development server: `npm run dev`
5. Open [http://localhost:3000](http://localhost:3000) in your browser.
