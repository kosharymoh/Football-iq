# FOOTBALL IQ

A responsive Next.js football intelligence dashboard with server-side football-data.org integration and an optional AI analyst endpoint.

## Important coverage note

This is a functional foundation, not a claim that one API contains every country, division, player, manager or historical record. The UI only displays records returned by the configured provider. A worldwide database requires multiple licensed providers plus historical datasets and a normalization layer.

## Run locally

1. Install Node.js 20 or newer.
2. Extract this project.
3. In the project folder run `npm install`.
4. Copy `.env.example` to `.env.local`.
5. Add your football-data.org API token to `FOOTBALL_DATA_TOKEN`.
6. Optional: configure `AI_API_KEY`, `AI_BASE_URL` and `AI_MODEL`.
7. Run `npm run dev` and open `http://localhost:3000`.

## Current working features

- Responsive dashboard and mobile navigation.
- Live provider-backed fixtures/results for a selected date.
- Provider-backed competition directory and local search.
- Competition top-scorers endpoint for supported competition IDs.
- Server-side API token handling; keys are never sent to the browser.
- Optional AI analyst using an OpenAI-compatible chat-completions endpoint.
- Explicit loading, empty, retry and provider-error states.
- No hardcoded live scores or fabricated player statistics.

## Data provider

The first adapter uses football-data.org API v4. Coverage and endpoints depend on your account plan and the provider's current catalogue/limits. Read its terms and register at https://www.football-data.org/.

The API route is deliberately server-side. Do not put provider tokens in client-side code or commit `.env.local`.

## Expanding toward global coverage

Recommended next engineering stages:

1. Add provider adapters for additional licensed services (for example API-SPORTS or another provider whose licence and coverage meet your requirements).
2. Normalize provider-specific entities into canonical `Person`, `Player`, `Manager`, `Club`, `NationalTeam`, `Competition`, `Season`, `Fixture`, `Appearance` and `Statistic` records.
3. Add PostgreSQL and migrations, provider source IDs, provenance, timestamps and conflict resolution.
4. Add licensed historical datasets and Wikimedia Commons image metadata/attribution; never scrape or reuse images without checking licence terms.
5. Build player, manager, club and national-team pages from normalized records.
6. Build predictions only after collecting sufficient historical match data. Calibrate probabilities and evaluate them out-of-sample; show uncertainty and sample size.
7. Ground AI answers in retrieved records and cite the underlying sources in the interface.

## API routes

- `GET /api/football?resource=matches&dateFrom=YYYY-MM-DD&dateTo=YYYY-MM-DD`
- `GET /api/football?resource=competitions`
- `GET /api/football?resource=standings&id=PL`
- `GET /api/football?resource=scorers&id=PL`
- `GET /api/football?resource=teams&id=57`
- `POST /api/assistant` with `{ "question": "..." }`

Provider plan limits may restrict access. Errors are returned explicitly rather than replaced with made-up data.
