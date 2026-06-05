# Scripts

One-off utility scripts (DB seeding, migrations, deploy helpers).

| Script | What it does |
| --- | --- |
| `seed-db.js` | Seeds MongoDB with sample devotees, donations and events for local dev |

## Usage

```bash
node scripts/seed-db.js              # seed dev database
node scripts/seed-db.js --reset      # drop + reseed
```

Make sure `apps/backend/.env` is set up first so `MONGO_URI` resolves.
