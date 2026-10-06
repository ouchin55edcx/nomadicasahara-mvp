# Nomadica Sahara

## Route map

All public routes are localized under `/en`, `/es`, or `/pt`. The localized pathnames are configured in `src/i18n/routing.ts`; typed route builders live in `src/lib/hrefs.ts`.

| Route (canonical pattern) | Purpose | Indexable | Who links to it |
| --- | --- | --- | --- |
| `/{locale}/` | Home | Yes | Logo, home navigation |
| `/{locale}/tours` (`/excursiones`, `/passeios`) | All tours and query filters | Yes | Home, category and destination pages, breadcrumbs, nav |
| `/{locale}/tours/category/[category]` | Desert, Saïdia Beach, Private Tours, Transfers, Dinner Shows, Hammam & Spa, Multi-Day Tours | Yes | Header/footer navigation, home, listing shortcuts |
| `/{locale}/tours/city/[city]` | Agafay, Zagora, Merzouga, Marrakech | Yes | Desert dropdown, home and all-tours destination shortcuts |
| `/{locale}/tours/[slug]` | Detail for tours without offer tiers; Saïdia quote requests | Yes | `tourHref()` from cards and rows, similar tours |
| `/{locale}/tours/[slug]/offers` | Compare offers for tours with tiers | Yes | `tourHref()` from cards and rows, similar tours |
| `/{locale}/tours/[slug]/offers/[offer]` | Selected offer details; canonical is the offers page | Yes (canonicalized) | Offer comparison page |
| `/{locale}/about` | About Nomadica Sahara | Yes | Footer |
| `/{locale}/contact` | Contact | Yes | Footer, legal/help pages, quote requests |
| `/{locale}/help` | Help | Yes | Footer |
| `/{locale}/terms` | Booking terms | Yes | Footer and booking consent |
| `/{locale}/privacy` | Privacy information | Yes | Footer and booking consent |
| `/{locale}/book/[offerId]` (`/reservar/[offerId]` in es/pt) | Private booking request | No | Offer detail pages |
| `/{locale}/book/[offerId]/confirmation` (`/reservar/[offerId]/confirmacion` in es; `.../confirmacao` in pt) | Booking request confirmation | No | Booking request form |

All tour cards and list rows use `tourHref()` from `src/lib/hrefs.ts`. It sends tours with offers to the offer comparison page and tours without offers to the tour detail page. Quote-only tours link to their detail page, whose next step is a contact request. Booking and confirmation URLs are built by `bookHref()` and `confirmationHref()`.

The public sitemap includes only the home, tours listing, categories, destinations, information pages, and each tour's canonical public page. It excludes booking pages, offer-detail pages, and legacy redirect sources.

## Validation

Run `npm run check-links` against a running local server. Set `BASE_URL` to use another local origin. The crawler starts at `/en`, `/es`, and `/pt`, checks internal links to depth 3, and rejects links to removed hotel and checkout routes.

## Legacy route policy

Old city and category links permanently redirect to the corresponding tour category or destination. Old hotel paths and `/booking/checkout` have no redirect and return 404. Legacy detail and summary URLs redirect to a matching tour only where a matching catalog record is clear; otherwise they use the corresponding destination or the all-tours page.
