# Project: TRAVELLINIWITHUS Enterprise Site Refinement

## Architecture

- React 19 + TypeScript + Vite 6 + Tailwind CSS 4
- Centralized Traveler Tools & Utilities (`src/utils/geo.ts`, `src/utils/share.ts`, `src/utils/affiliate.ts`)
- Key Public Pages: Homepage, Posto, Destinazione, Esplora, Mappa, Chi Siamo, Collaborazioni, Media Kit, Risorse.
- High-Risk Files (MUST NOT BE MODIFIED): `server.ts`, `firestore.rules`, `src/config/admin.ts`.

## Milestones

| #   | Name                                       | Scope                                                                                                                 | Dependencies | Status |
| --- | ------------------------------------------ | --------------------------------------------------------------------------------------------------------------------- | ------------ | ------ |
| M1  | Interactive Traveler Tools & Integrations  | Geolocation Haversine, Google Maps, Google Business Profile, Web Share API, Centralized Affiliate Tracking            | none         | DONE   |
| M2  | Enterprise UI/UX & Editorial Refinement    | 9 Key Pages refinement (Homepage, Posto, Destinazione, Esplora, Mappa, Chi Siamo, Collaborazioni, Media Kit, Risorse) | M1           | DONE   |
| M3  | Quality, Performance & Security Compliance | `typecheck`, `audit:ui`, WCAG AA, 375px responsive check, high-risk file verification                                 | M1, M2       | DONE   |

## Interface Contracts

### Traveler Tools (`src/utils/geo.ts`, `src/utils/share.ts`, `src/utils/affiliate.ts`)

- `calculateHaversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number` (returns distance in km)
- `getUserLocation(): Promise<{ latitude: number; longitude: number }>`
- `getGoogleMapsDirectionsUrl(destination: { lat: number; lng: number; address?: string }): string`
- `shareContent(data: { title: string; text?: string; url: string }): Promise<boolean>`
- `trackAffiliateClick(partner: string, originalUrl: string, campaign?: string): string`

## Code Layout

- `src/components/`: Reusable UI components
- `src/pages/`: Page views
- `src/utils/`: Pure utilities & calculation tools
- `src/hooks/`: React custom hooks
