---
name: dynamic-dropdowns
description: How the admin-managed dynamic dropdown (lookups) system works and how to add a new one
metadata:
  type: project
---

Four dropdowns are admin-managed via **Settings → Dropdown Options** (`/settings/options`): Event Type (`event_type`), Property / Place (`property`), Purpose (`donation_purpose`), Payment Method (`payment_method`). Options are stored in the backend and editable in the UI; the old hardcoded constants remain only as fallbacks.

**Backend** (`apps/backend`):
- `app/models/lookup.py` — `Lookup` table: `category`, `label`, `sort_order`, `active`.
- `app/api/routes/lookups.py` — `CATEGORIES` dict defines each manageable dropdown's key, display label and default seed values. `seed_lookups(db)` runs on startup (`main.py` `on_startup`) and idempotently seeds any empty category. Routes: `GET /lookups` (grouped), `GET /lookups/categories`, `POST/PATCH/DELETE` (gated by `settings.update`; reads need only auth).

**Frontend**:
- `packages/shared/context/LookupContext.jsx` — `LookupProvider` (mounted in `main.jsx` inside AuthProvider) loads all options and refetches when the user changes. Consume with `useLookups(category, fallback)` → array of labels; `useLookupAdmin()` → `{ data, refresh }` for the management page.
- `apps/frontend/src/dashboard/pages/settings/DropdownOptions.jsx` — the management UI.
- Categories: `event_type`, `property`, `donation_purpose`, `payment_method`, `income_category`.
- Forms wired: EventCreate, EventEdit (event_type, property), AddDonation (donation_purpose, property, payment_method), AddIncome (income_category, property, payment_method).
- `IncomeCategories.jsx` (Income → Categories) manages the `income_category` lookup (add/rename/delete) and merges income totals from `incomeApi.analytics().byCategory` for the per-category stats. The old backend `INCOME_CATEGORIES` constant in `income.py` is now just a derived-stats fallback, not the source of truth.

**To add a NEW managed dropdown:** add an entry to `CATEGORIES` in `lookups.py` (key + label + defaults), restart backend (auto-seeds), then in the form replace the hardcoded `options={CONST}` with `const x = useLookups('your_key', CONST)` and `options={x}`. No DB migration needed (auto `create_all`).

NOT yet wired (still use constants directly): list-page filters, AddExpense (expense category uses a separate real `ExpenseCategory` backend model, not lookups), booking forms, EventDetails donation modal. Wire them the same way if needed. See [[dashboard-warm-theme]] for the unrelated theming system.
