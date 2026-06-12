---
name: dashboard-warm-theme
description: How the dashboard's warm monochrome palette is themed separately from the public site
metadata:
  type: project
---

The dashboard uses a STRICT 4-color palette — every shade resolves to exactly #FFFDF1 cream, #FFCE99 peach, #FF9644 orange, or #562F00 brown (no in-between tones) — while the **public website keeps the Jain flag palette**. This is achieved with **CSS-variable-based color ramps**, not separate Tailwind configs.

Tier rule inside `.dashboard-theme`: 50→cream, 100-300→peach, 400-600→orange, 700-950→brown (ink/surface families shift 50-100→cream). White surfaces (`bg-white`) become cream via a tokenized `white`. Status colors (green/red) intentionally collapse into the palette (full monochrome).

**How it works:**
- `apps/frontend/tailwind.config.js` — color ramps (jain-yellow→`--jy`, jain-red→`--jr`, jain-green→`--jg`, jain-black→`--jk`, jain-white→`--jw`, sand→`--sd`, plus Tailwind defaults `neutral`→`--nt`, `rose`→`--rs`, `emerald`→`--em`, `amber`→`--am`, `sky`→`--sk`, `violet`→`--vi`, `teal`→`--tl`, `pink`→`--pk`, `orange`→`--or`, and `white`→`--wt`) emit `rgb(var(--xx-NN) / <alpha-value>)` instead of static hex. Built via the `ramp()` helper.
- Recharts/receipt colors were hardcoded hex (not class-based) so the scope couldn't reach them — they were bulk-remapped to palette hex directly in `apps/frontend/src/dashboard/**` (yellow→#FF9644, red/black/gray→#562F00, green→#FFCE99, etc.). New charts must use palette hex.
- The multicolor `JainFlagStripe` ribbon was removed from `AdminLayout`/`AuthLayout` (off-palette). The `JainFlagBadge` brand logo on the auth screen still contains flag colors.
- `apps/frontend/src/index.css` — global `:root` sets every `--xx-NN` channel to the **original** palette value (so the public site renders unchanged). The `.dashboard-theme` scope overrides them: accents (yellow/red/green/rose) → orange, ink/neutral → brown, cream/sand → cream. Full monochrome — status green/red intentionally collapse into the warm palette.
- The flat-gradient enforcement layer (which `!important`-forces Jain hex on `bg-gradient-*`) has `.dashboard-theme`-scoped overrides re-forcing orange; `.gradient-text` likewise.
- `.dashboard-theme` is applied on the root div of `AdminLayout.jsx` and `AuthLayout.jsx` only.

**To add a color or new family to the dashboard theme:** add the family to the config as a `ramp()`, define its global `--xx-*` defaults in `:root`, and add the warm override under `.dashboard-theme`. Don't hardcode hex in components — use the tokens so the scope can repaint them.

Note: cards stay literal `bg-white` (white on cream page is intentional). The 1px `JainFlagStripe` ribbon at the top of dashboard layouts keeps real flag colors as a brand identity marker.
