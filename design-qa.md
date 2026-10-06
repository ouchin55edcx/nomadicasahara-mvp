# Design QA — Tour offers comparison

**References supplied by the user:**
- Full package-comparison page: `/tmp/codex-clipboard-0526b451-6ad0-4842-bd79-200c454b886f.png` (1366 × 3700 px).
- Single package layout: `/tmp/codex-clipboard-f24b3df5-ebcd-4eec-9051-5755991d1a4b.png` (181 × 586 px).

**Implementation:** `src/components/tour-detail/OffersComparisonPage.tsx` and `src/components/tour-detail/OffersComparisonClient.tsx`; pricing continues through `src/lib/pricing.ts` into details and booking.

**Implemented structure:** localized tour title and trip facts, gallery hero, day/step strip, three aligned Economic/Standard/Premium package columns, tier-specific stay rows for circuits, travel style, included features, optional airport transfers, differences toggle, comparison table, collapsed day outline, FAQ, similar trips, and mobile tier tabs with a bottom booking bar. Flight rows, standalone hotel inventory, promotional badges, and account/financing/coupon content are excluded.

**Interaction checks:** date and traveler selectors and transfer radio groups update query state; details and booking links carry date/travelers/transfers; a shared pricing function computes the page and booking summary total. Pricing examples pass the added script. Reduced-motion scrolling uses `auto` when the preference is enabled.

**Responsive/visual preview:** not verified. A browser-rendered screenshot could not be captured because Next build cannot load its SWC binding in this environment. The package fails while validating its native-binding cache root under `/home/mustapha/.cache`; attempts with a private `/tmp` cache and temporary materialization still hit the same permission validation. `check-links` also cannot connect to a running local server. No visual claim is made for 375, 768, or 1280 px, or for keyboard interaction in a browser.

**Checklist:**
- [x] Use the reference page structure and single-package section order.
- [x] Keep the three offer tiers, Morocco services, and localized links.
- [x] Match offer details and booking totals via shared pricing logic.
- [x] Add catalog validation, price examples, and contrast checks.
- [ ] Capture desktop/mobile screenshots and inspect overflow, card alignment, and keyboard behavior.

**Result:** implementation complete; visual/runtime browser verification blocked by the environment.
