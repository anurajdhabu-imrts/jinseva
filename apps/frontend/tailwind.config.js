/** @type {import('tailwindcss').Config} */
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  Jain Flag Color System — Panch Parmeshthi
//  White  → Arihants     #ffffff
//  Red    → Siddhas      #c8102e
//  Yellow → Acharyas     #ffc01e / #d68500
//  Green  → Upadhyays    #00843d / #054624
//  Black  → Sadhus       #1a1b22
//
//  Existing palette aliases (saffron, maroon, gold, forest, ink, cream,
//  terracotta) are remapped to the Jain flag tones so every pre-existing
//  component renders in the Jain palette automatically.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//
// ── Tokens are CSS-variable based so a scope (e.g. `.dashboard-theme`) can
//    repaint the whole UI by overriding the channel variables in index.css.
//    Global variable values keep the original Jain flag palette, so the public
//    website is unchanged; the dashboard overrides them to a warm palette.
const SH = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
const ramp = (prefix, shades = SH, def) => {
  const o = Object.fromEntries(
    shades.map((s) => [s, `rgb(var(--${prefix}-${s}) / <alpha-value>)`]),
  );
  if (def != null) o.DEFAULT = `rgb(var(--${prefix}-${def}) / <alpha-value>)`;
  return o;
};
const SH10 = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];

const jainYellow = ramp('jy', SH, 400);
const jainRed    = ramp('jr', SH, 600);
const jainGreen  = ramp('jg', SH, 600);
const jainBlack  = ramp('jk', SH, 900);
const jainWhite  = ramp('jw', SH10, 50);
const sandRamp   = ramp('sd', SH10);
const neutralRamp = ramp('nt', SH);
const roseRamp    = ramp('rs', SH);
// Remaining Tailwind-default families used by dashboard badges/charts — made
// themeable so the dashboard scope collapses them into the warm palette.
const emeraldRamp = ramp('em', SH);
const amberRamp   = ramp('am', SH);
const skyRamp     = ramp('sk', SH);
const violetRamp  = ramp('vi', SH);
const tealRamp    = ramp('tl', SH);
const pinkRamp    = ramp('pk', SH);
const orangeRamp  = ramp('or', SH);

export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
    // The shared UI library (Select, Input, Button, …) lives here — it MUST be
    // scanned or classes used only in shared components (e.g. the Select's
    // `right-3.5` arrow position and `appearance-none`) never get generated.
    '../../packages/shared/**/*.{js,jsx,ts,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // ── Jain flag canonical names ─────────────────────────────
        'jain-yellow': jainYellow,
        'jain-red':    jainRed,
        'jain-green':  jainGreen,
        'jain-black':  jainBlack,
        'jain-white':  jainWhite,

        // ── Legacy aliases remapped to Jain flag tones ─────────────
        // Every existing `bg-saffron-*`, `bg-maroon-*`, `bg-gold-*`,
        // `bg-forest-*`, `bg-ink-*`, `bg-cream-*` now renders as the
        // Jain palette automatically — no component edits needed.
        saffron:    jainYellow,
        gold:       jainYellow,
        maroon:     jainRed,
        terracotta: jainRed,
        forest:     jainGreen,
        ink:        jainBlack,
        cream:      jainWhite,

        // Sandalwood neutral kept for warm accents
        sand: sandRamp,

        // Tailwind defaults made themeable so the dashboard scope can warm
        // body text, badges, charts and destructive actions. Global values
        // match Tailwind's originals, so the public site is unaffected.
        neutral: neutralRamp,
        rose:    roseRamp,
        emerald: emeraldRamp,
        amber:   amberRamp,
        sky:     skyRamp,
        violet:  violetRamp,
        teal:    tealRamp,
        pink:    pinkRamp,
        orange:  orangeRamp,
        // White surfaces become cream inside `.dashboard-theme`.
        white:   'rgb(var(--wt) / <alpha-value>)',

        primary: jainYellow,
      },

      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        display: ['"Cormorant Garamond"', '"Playfair Display"', 'serif'],
      },

      fontSize: {
        'display-2xl': ['clamp(3.5rem, 7vw, 7rem)',   { lineHeight: '0.95', letterSpacing: '-0.03em' }],
        'display-xl':  ['clamp(2.75rem, 5.5vw, 5rem)', { lineHeight: '1.0',  letterSpacing: '-0.025em' }],
        'display-lg':  ['clamp(2.25rem, 4.5vw, 4rem)', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'display-md':  ['clamp(1.75rem, 3.5vw, 3rem)', { lineHeight: '1.1',  letterSpacing: '-0.015em' }],
      },

      boxShadow: {
        soft:          '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        glow:          '0 0 30px -5px rgba(255, 192, 30, 0.45)',
        'glow-gold':   '0 0 30px -5px rgba(255, 192, 30, 0.45)',
        'glow-red':    '0 0 30px -5px rgba(200, 16, 46, 0.45)',
        'glow-green':  '0 0 30px -5px rgba(0, 132, 61, 0.4)',
        card:          '0 4px 20px -2px rgba(0, 0, 0, 0.06)',
        'card-dark':   '0 4px 20px -2px rgba(0, 0, 0, 0.4)',
        'card-hover':  '0 20px 50px -12px rgba(0, 0, 0, 0.18)',
      },

      backgroundImage: {
        // The literal 5-color Jain flag — the only "gradient" we keep, since
        // it represents the actual flag visual identity (5 stripes, not a
        // gradient blend).
        'jain-flag':   'linear-gradient(180deg, #ffffff 0%, #ffffff 20%, #c8102e 20%, #c8102e 40%, #ffc01e 40%, #ffc01e 60%, #00843d 60%, #00843d 80%, #1a1b22 80%, #1a1b22 100%)',
        'jain-flag-h': 'linear-gradient(90deg, #ffffff 0%, #ffffff 20%, #c8102e 20%, #c8102e 40%, #ffc01e 40%, #ffc01e 60%, #00843d 60%, #00843d 80%, #1a1b22 80%, #1a1b22 100%)',

        // All other "gradients" are now flat Jain flag colors — single-color
        // linear-gradients which browsers render as solid backgrounds.
        'jain-warm':   'linear-gradient(0deg, #c8102e, #c8102e)',     // solid Jain red
        'jain-cool':   'linear-gradient(0deg, #054624, #054624)',     // solid Jain green
        'jain-divine': 'linear-gradient(0deg, #c8102e, #c8102e)',     // solid Jain red
        'jain-sun':    'linear-gradient(0deg, #ffc01e, #ffc01e)',     // solid Jain yellow
        'jain-paper':  'linear-gradient(0deg, #ffffff, #ffffff)',     // solid white

        'gradient-spiritual': 'linear-gradient(0deg, #c8102e, #c8102e)',
        'gradient-gold':      'linear-gradient(0deg, #ffc01e, #ffc01e)',
        'gradient-terracotta':'linear-gradient(0deg, #c8102e, #c8102e)',
        'gradient-sunset':    'linear-gradient(0deg, #c8102e, #c8102e)',
        'gradient-divine':    'linear-gradient(0deg, #ffffff, #ffffff)',
        'gradient-card':      'linear-gradient(0deg, #ffffff, #ffffff)',
        'gradient-cream':     'linear-gradient(0deg, #ffffff, #ffffff)',

        'mandala': "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffc01e' fill-opacity='0.08'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        'lotus-dots': "radial-gradient(circle, rgba(200,16,46,0.15) 1px, transparent 1px)",
      },

      backgroundSize: {
        'dots-sm': '20px 20px',
        'dots-md': '32px 32px',
      },

      animation: {
        'fade-in':       'fadeIn 0.5s ease-in-out',
        'slide-up':      'slideUp 0.4s ease-out',
        'slide-down':    'slideDown 0.4s ease-out',
        'slide-in-left': 'slideInLeft 0.4s ease-out',
        'slide-in-right':'slideInRight 0.4s ease-out',
        'scale-in':      'scaleIn 0.3s ease-out',
        'float':         'float 3s ease-in-out infinite',
        'pulse-slow':    'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer':       'shimmer 2s linear infinite',
        'spin-slow':     'spin 5s linear infinite',
        'spin-very-slow':'spin 30s linear infinite',
        'marquee':       'marquee 30s linear infinite',
      },
      keyframes: {
        fadeIn:       { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        slideUp:      { '0%': { transform: 'translateY(20px)', opacity: 0 }, '100%': { transform: 'translateY(0)', opacity: 1 } },
        slideDown:    { '0%': { transform: 'translateY(-20px)', opacity: 0 }, '100%': { transform: 'translateY(0)', opacity: 1 } },
        slideInLeft:  { '0%': { transform: 'translateX(-20px)', opacity: 0 }, '100%': { transform: 'translateX(0)', opacity: 1 } },
        slideInRight: { '0%': { transform: 'translateX(20px)', opacity: 0 }, '100%': { transform: 'translateX(0)', opacity: 1 } },
        scaleIn:      { '0%': { transform: 'scale(0.95)', opacity: 0 }, '100%': { transform: 'scale(1)', opacity: 1 } },
        float:        { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-8px)' } },
        shimmer:      { '0%': { backgroundPosition: '-1000px 0' }, '100%': { backgroundPosition: '1000px 0' } },
        marquee:      { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
      },
    },
  },
  plugins: [],
};
