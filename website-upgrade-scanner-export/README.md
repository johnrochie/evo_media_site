# 🌐 Website Upgrade Scanner

**Lead Generation Dashboard for Evolution Media €500 Website Business**

## 🎯 What It Does

Scans business websites and identifies those that need upgrades, generating qualified leads for Evolution Media's €500 website automation service.

## ⚡ Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start the scanner
npm start

# 3. Open dashboard
# Go to: http://localhost:4005
```

## 📊 Dashboard Features

- **Real-time website analysis** (0-15 score)
- **Automatic lead generation** for websites scoring <10
- **CSV export** for outreach campaigns
- **Revenue calculator** (€500 per lead)
- **Clean, professional interface**

## 🔧 How It Works

1. **Enter any business website URL**
2. **Scanner analyzes:**
   - HTTPS/SSL security
   - Mobile responsiveness
   - Modern frameworks
   - Contact information
   - Page performance
3. **Scores website 0-15** (higher = better)
4. **Websites scoring <10** become Evolution Media leads
5. **Export leads** and contact for €500 website upgrades

## 💰 Business Value

- **Each lead = €500 revenue opportunity**
- **Automated lead generation** for Evolution Media
- **Prioritized outreach** (HIGH/MEDIUM/LOW)
- **Direct integration** with €500 website business model

## 🎮 Try It Now

After starting the server, open http://localhost:4005 and try:

1. **Travel Bug:** https://travelbug-v1.vercel.app
2. **Rei Bridal:** https://reibridal-v1.vercel.app
3. **Any local business website**

## 📁 Files

- `server.js` - Main server (port 4005)
- `public/` - Dashboard frontend
- `package.json` - Dependencies
- `INSTALL.md` - Complete installation guide
- `install.sh` - One-line installer

## 🔁 Batch mode (Lead Discovery integration)

Runs the whole candidate list from the Lead Discovery engine
(`scripts/lead-discovery/candidates.json`, Prompt 1) through the scorer.

```bash
# from website-upgrade-scanner-export/
npm run analyse:batch -- ../scripts/lead-discovery/candidates.json -v
# -> ../scripts/lead-discovery/candidates.enriched.json
```

Options: `--out <file>`, `--concurrency <n>` (default 3), `--delay <ms>`,
`--timeout <ms>`, `--retries <n>`, `--limit <n>`, `--render` (headless browser
for JS-only sites), `-v`.

Each candidate gains an `analysis` block: `score`, `scorePct`, `band`
(`high`/`medium`/`low`), `needsUpgrade`, `reachable`, and a `criteria[]` array
(the key reasons behind the score) for the CRM step. A single unreachable site
is logged and skipped — the run always completes.

Same thing over HTTP:

```
POST /api/batch-analyze   { "candidates": [ { "url": "..." }, ... ] }
POST /api/analyze         { "url": "..." }          # unchanged single-URL
POST /api/bulk-analyze    { "websites": [ ... ] }   # legacy shape, no longer capped at 20
```

See `CODE-REVIEW.md` for the scoring-reliability fixes. Run the checks with
`npm run test:analyzer`.

### SSRF protection

Every fetch (single, bulk, batch, CLI) is guarded by `ssrf.js`: `localhost`,
private/reserved IPv4+IPv6 ranges, and cloud-metadata addresses are rejected —
on the initial URL **and every redirect hop**. Blocked targets come back as
`reachable: false`, `blocked: true`, `band: "blocked"`, `error: "ESSRFBLOCKED"`
(distinct from "site is down").

To scan a known-safe internal/staging host, set `SSRF_ALLOWED_HOSTS` (comma-
separated hostnames/IPs). Leave it unset in production.

## 🚀 Production Ready

```bash
# Use PM2 for production
npm install -g pm2
pm2 start server.js --name "website-scanner"
pm2 save
pm2 startup
```

## 📞 Support

Check `scanner.log` for error details or open an issue.

---

**Generate €500 Evolution Media leads with every scan!**
