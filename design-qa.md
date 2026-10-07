# Design QA — Tour detail and offer detail

**References supplied by the user:**
- Tour detail page screenshot: `/tmp/codex-clipboard-0dd9f3c4-b451-4809-a141-d2d338a75846.png` (shown resized by the chat client).
- Written page requirements: `/home/mustapha/.codex/attachments/7a99eb33-0535-45a5-adfe-fcbf2012de14/Pasted text.txt`.

**Implementation:** `src/components/tour-detail/TourExperiencePage.tsx` is shared by direct tour details and selected-offer details. Supporting components are `TourBookingBar.tsx`, `TourBookingContext.tsx`, `ItineraryExplorer.tsx`, `PlacesCarousel.tsx`, `StaySwitcher.tsx`, and `ChooseDateButton.tsx`. Tour-specific route data and validation live in `src/data/static/tour-catalog.ts`, `src/types/tour-catalog.ts`, and `scripts/validate-catalog.mjs`.

**Implemented:** Responsive detail page with a 320px desktop hero, localized title/price and booking bar, route-map/intro split, keyboard-accessible itinerary explorer, included/not-included lists, visited-place cards, tier-specific accommodation cards, important information, FAQs and similar tours. The requested palette and 1200px content width are applied. Footer now has the existing coastal photo under a dark overlay, brand/social strip, link columns, newsletter entry, and payment marks. Route/photo paths are replaceable constants and reuse assets already in `public/images`.

**Visual QA status:** No implementation screenshot was captured. The local Next server could not bind to `127.0.0.1:3000` (`listen EPERM`), and the production build cannot load the installed SWC native binding. Without a running local page, the supplied design cannot be compared to the rendered implementation at desktop or mobile widths. The layout, visual spacing, responsive behavior, and browser interactions therefore remain unverified. The repository has no exact blue-door, destination-set, hotel, or beach/palm photos; the current implementation uses the available local Morocco photos and neutral fallbacks. Catalog accommodation entries are marked provisional and no hotel ratings or false star scores are displayed.

**Automated checks:**
- TypeScript: passed (`npx tsc --noEmit --pretty false`).
- Catalog validation: passed (13 tour records, localized content, layouts, and pricing rules).
- Contrast script: passed (6.43:1 white on forest; 8.19:1 primary green on black).
- `git diff --check`: passed.
- Build: blocked by missing `./swc.linux-x64-gnu.node` native binding.
- Link crawler: unavailable because no local server could start.
- Browser/curl checks: not run because the local server could not bind.

**Checklist:**
- [x] Share one page implementation for direct and selected-offer details.
- [x] Localize page copy and retain typed tour and booking links.
- [x] Add route places and meal types to multi-day tour data and validation.
- [x] Keep two vehicle choices on service offer details.
- [x] Apply the current tour-detail color tokens and responsive section layouts.
- [ ] Capture and inspect screenshots at desktop and mobile sizes.
- [ ] Verify visual interactions in a browser.

**Final result: blocked.** The requested implementation is in place and source-level checks pass, but visual/browser QA remains blocked by the build binding and local socket restrictions. The tour image assets and accuracy of catalog itinerary/stay content also need a visual/content review in the running app.
