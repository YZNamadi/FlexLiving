# Flex Living – Developer Assessment

A Reviews Dashboard and Property Review Display for Flex Living. Managers can assess per‑property performance, filter/sort guest feedback, spot trends, and select reviews to show publicly.

## Tech Stack
- Frontend: Vite, React, TypeScript, Tailwind, shadcn/ui
- Backend: Next.js API routes (Node)

## Quick Start
Backend (API):
```sh
cd ../
npm install
npm run dev   # http://localhost:3000
```

Frontend:
```sh
cd frontend
npm install
npm run dev   # http://localhost:8080
```

Proxy: frontend forwards `/api/*` to `http://localhost:3000`.

## Core API
- `GET /api/reviews/hostaway` – returns normalized reviews and per‑listing aggregates
  - Review fields: `id, listingName, type, status, channel, rating10, rating5, text, categories, submittedAt, guestName, approved`
  - Aggregates: `{ [listingName]: { totalReviews, avg10, avg5, categoryAverages } }`
- `GET /api/reviews/approved` – returns `{ approvedIds }`
- `POST /api/reviews/approved` – body `{ id, approved }`, persists selection
- `GET /api/reviews/google?placeId=...` – optional; returns normalized Google reviews if `GOOGLE_API_KEY` is set

## UI Features
- Manager Dashboard: filters (channel, rating, date, text), sorting, approve toggle, per‑property stats
- Property Page: Flex Living layout, shows only manager‑approved reviews

## Design & Logic Decisions
- Ratings normalized to 10‑point internally; converted to 5‑star for UI consistency
- Categories aggregated per listing to highlight cleanliness/communication/location trends
- Approvals stored server‑side (`data/approved_reviews.json`) for simple persistence in assessment scope
- Vite dev proxy used for smooth local development against Next API

## Google Reviews (Exploration)
- Basic integration implemented and safe‑gated; returns disabled unless `GOOGLE_API_KEY` and a valid `placeId` are provided

## Notes
- Hostaway data is mocked (as sandbox contains no reviews)
- Codebase organized for clarity and direct assessment execution
