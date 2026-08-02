# n8n-nodes-rankparse

An [n8n](https://n8n.io) community node for [RankParse](https://rankparse.com) — a cheap, agent-friendly SEO data API built on Common Crawl data (backlinks, domain authority, tech stack, page SEO, site health, and more).

This is a declarative-style node: every operation maps directly to one RankParse REST endpoint, documented in [`crawlgraph/rankparse-api/api/openapi.yaml`](../rankparse-api/api/openapi.yaml).

## Installation

Follow the [n8n community node installation guide](https://docs.n8n.io/integrations/community-nodes/installation/gui-install/) and install `n8n-nodes-rankparse`.

If installing manually:

```bash
npm install n8n-nodes-rankparse
```

## Credentials

This node uses the **RankParse API** credential type: a single API key, sent as the `X-API-Key` header on every request.

1. Get a key from your [RankParse dashboard](https://rankparse.com/dashboard/keys) (starts with `rp_`).
2. In n8n, create a new **RankParse API** credential and paste the key in.
3. Click **Test** — this hits the free `GET /v1/credits` endpoint to confirm the key is valid without spending credits.

## Credit costs

Every RankParse call except the Dashboard group and the v1 stub endpoints deducts credits from your account balance. Costs shown below are per call, verified against the live API (`crawlgraph/rankparse-api/api/src/index.ts`) — **not** the older/lower estimates that circulate elsewhere:

| Resource | Operation | Credits |
|---|---|---|
| Link Graph | Backlinks | 2 (3 with Score enabled) |
| Link Graph | Referring Domains | 2 (3 with Score enabled) |
| Link Graph | Outbound Links, Anchor Text | 2 |
| Link Graph | Link Intersect | 5 |
| Link Graph | Link Velocity, New Links, Lost Links | 0 (v1 stubs, see below) |
| Domain Intelligence | Domain Authority | 1 |
| Domain Intelligence | Domain Rank | 2 |
| Domain Intelligence | Domain Overlap, Similar Domains, Competitor Gap | 5 |
| Domain Intelligence | Link Audit | **8** |
| Domain Intelligence | Site Explorer | 10 |
| Page / Site | Page SEO | **3** |
| Page / Site | Page Performance | 3 (charged only if the PageSpeed Insights call succeeds) |
| Page / Site | Tech Stack, Site Health, Sitemap, Crawl History, Top Pages | 2 |
| Page / Site | Schema Markup, Internal Links | 0 (v1 stubs, see below) |
| Batch | Batch Backlinks | 2 per successfully queried domain |
| Dashboard | all operations | 0 |

## V1 stub endpoints

`Link Velocity`, `New Links`, `Lost Links`, `Schema Markup`, and `Internal Links` are live in the API but not yet computing real data — they return `{ status: "not_yet_available", reason: "..." }` at zero credit cost. They're included here so workflows built against them today keep working once RankParse ships the underlying computation.

## Pagination

RankParse's list endpoints accept `limit` (max 1000, or a lower endpoint-specific cap — e.g. Similar Domains caps at 100) but **do not** support `offset`-based paging, except for two operations: **Usage** (Dashboard) and **Internal Links** (Page/Site, a stub today). Only those two expose an Offset field. For every other list endpoint, `limit` is the only way to control result size — there's no way to fetch a second page of the same query.

## Usage examples

**Link Graph** — Find who links to a competitor:
`Resource: Link Graph` → `Operation: Backlinks` → `Domain: competitor.com` → `Limit: 50`

**Domain Intelligence** — Find link-building gaps vs. a competitor:
`Resource: Domain Intelligence` → `Operation: Competitor Gap` → `Domain: yoursite.com` → `Vs: competitor.com`

**Page / Site** — Audit a landing page before publishing:
`Resource: Page / Site` → `Operation: Page SEO` → `URL: https://yoursite.com/new-page`

**Batch** — Backlink counts for a list of prospects:
`Resource: Batch` → `Operation: Batch Backlinks` → `Domains: a.com,b.com,c.com`

**Dashboard** — Check remaining credits before a bulk run:
`Resource: Dashboard` → `Operation: Get Credit Balance`

## Response shape

RankParse wraps every payload in an envelope (`{ data, credits_used, credits_remaining, ... }`). This node unwraps the primary payload (`data`, or `keys`/`usage`/`tiers` for the matching Dashboard operations) into n8n items automatically — one item per row for list endpoints, one item for object endpoints. The one exception is **Link Audit**, whose response has no `data` wrapper at all; it's passed through as a single item unmodified.

## Resources

- [RankParse API docs](https://rankparse.com/docs)
- [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)

## License

[MIT](LICENSE.md)
