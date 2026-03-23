# MKM Competitor Analysis Tools

Strategic competitive intelligence dashboard for MKM Design Group.

## Features

- **Competitor Scorecard** — 10-category ratings, SWOT analysis, comparison view
- **Website X-Ray Vision** — Deep website audits across structure, content, portfolio, SEO
- **Content Engine** — Publishing cadence, social strategy, niche positioning analysis

## Tech Stack

- React 18
- Vite
- Cloud storage via `window.storage` API

## Local Development

```bash
npm install
npm run dev
```

## Deployment

Deployed to Vercel. Any changes pushed to `main` branch automatically deploy.

## Data Storage

Uses `window.storage` for persistent, shared cloud storage. All competitor data and images are accessible to anyone with the link.
