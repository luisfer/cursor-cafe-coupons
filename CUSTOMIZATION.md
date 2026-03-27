# Customizing coupons (for humans and agents)

This file is **machine-readable context**: clone the repo, skim this file, then edit JSON or use the web UI.

## What to edit

| Goal | Where |
|------|--------|
| Edit menu, venue, dates, motto | **JSON** in [`configs/`](./configs) or **Save Config** in the web UI |
| Print-ready HTML | `npm run cli -- <config.json> [output.html]` (see below) |

## Minimal JSON shape

Copy [`configs/example.json`](./configs/example.json). The important fields:

- **`venue`** — `name`, optional `logo` (URL or base64), `wifi`
- **`event.date`** — e.g. `DD.MM.YYYY`
- **`menu`** — array of `{ "name": string, "temps": ["hot"] | ["iced"] | ["hot","iced"] }`. Use `"kind": "section"` with `"temps": []` for category headings (e.g. "Coffee", "Non-Coffee").
- **`options`** — `footerNote`, `motto` (tagline on the branded footer bar; empty string `""` hides it), `beanChoices`, `milkChoices`, `menuTitle`, `showCouponNumber`
- **`print.couponsPerPage`** — `"auto"` (picks 9, 6, or 3 per landscape A4 from menu size) or a fixed `1`–`9`
- **`theme`** — `headerBg` / `headerText` (defaults match Cursor warm brown `#14120b` / `#edecec`)

## CLI

```bash
npm run cli -- configs/example.json coupons.html
npm run cli -- --preset classic coupons.html
npm run cli -- --list-presets
```

## Schema

Validate JSON against [`configs/schema.json`](./configs/schema.json) in your editor or tooling.

## Web UI

- `npm run dev` → **http://localhost:3000** — live preview, logo upload, **Print** / **Save HTML**.
