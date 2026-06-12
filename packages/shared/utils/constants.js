export const APP_NAME = 'Shree Jinalaya';
export const APP_TAGLINE = 'Ahimsa · Anekanta · Aparigraha';
export const TEMPLE_FULL_NAME = 'Shree Mahavir Jain Derasar';
export const TEMPLE_GREETING = 'Jai Jinendra';

export const CURRENCY = '₹';

export const formatCurrency = (n) =>
  `${CURRENCY}${Number(n).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

export const formatDate = (d, opts = { day: '2-digit', month: 'short', year: 'numeric' }) =>
  new Date(d).toLocaleDateString('en-IN', opts);

export const formatTime = (d) =>
  new Date(d).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

// Inline SVG placeholder shown when an image fails to load (e.g. a dead URL).
// Uses the standard `data:image/svg+xml,` form (the non-standard `;utf8,`
// variant fails to render in some browsers, leaving a broken-image glyph).
export const IMG_FALLBACK =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300">' +
      '<rect width="100%" height="100%" fill="#f3ede2"/>' +
      '<g fill="#c8102e" opacity="0.45"><circle cx="200" cy="118" r="34"/>' +
      '<path d="M118 224l52-62 42 47 30-34 40 49z"/></g>' +
      '<text x="50%" y="272" text-anchor="middle" fill="#9a8f80" font-family="sans-serif" font-size="15">Image unavailable</text>' +
    '</svg>',
  );

// Attach to <img onError={onImgError}> to swap a broken image for the placeholder.
export function onImgError(e) {
  if (e.currentTarget.dataset.fallback) return; // avoid loops
  e.currentTarget.dataset.fallback = '1';
  e.currentTarget.src = IMG_FALLBACK;
}

export const STATUS_COLORS = {
  active: 'success',
  completed: 'success',
  paid: 'success',
  confirmed: 'success',
  approved: 'success',
  pending: 'warning',
  processing: 'warning',
  upcoming: 'info',
  cancelled: 'danger',
  failed: 'danger',
  rejected: 'danger',
  draft: 'info',
};

export const DONATION_TYPES = [
  'Gyan Daan (Knowledge)',
  'Aushadh Daan (Medicine)',
  'Abhay Daan (Fearlessness)',
  'Anukampa Daan (Compassion)',
  'Sadharmik Bhakti',
  'Derasar Renovation',
  'Snatra Pooja Sponsorship',
  'Bhojanshala (Food Hall)',
  'Jeev Daya (Animal Welfare)',
  'Anonymous Daan',
];

export const EXPENSE_CATEGORIES = [
  'Utilities',
  'Marble & Maintenance',
  'Priest Honorarium',
  'Pooja Materials',
  'Decoration & Aangi',
  'Bhojanshala Supplies',
  'Repairs',
  'Books & Sahitya',
  'Other',
];

export const INCOME_CATEGORIES = [
  'Hall Rental',
  'Bhojanshala Income',
  'Dharmashala (Guest Rooms)',
  'Sahitya Bhandar (Books)',
  'Panjarapole (Goshala)',
  'Parking Fees',
  'FD / Bank Interest',
  'Donation Box (Bhandar)',
  'Government Grant',
  'Other',
];

export const POOJA_TYPES = [
  'Snatra Pooja',
  'Panch Kalyanak Pooja',
  'Ashta Prakari Pooja',
  'Antaraay Karm Pooja',
  '99 Yatra Pooja',
  'Navpad Oli',
  'Bhaktamar Pooja',
  'Naming Ceremony',
  'Snatak (Anniversary)',
  'Pratishtha Mahotsav',
];

export const PAYMENT_METHODS = ['UPI', 'Card', 'Cash', 'Bank Transfer', 'Cheque'];

// Temple places / properties that income, donations, expenses and events are
// all categorised by — and that reports break down by.
export const PROPERTY_CATEGORIES = ['Jain Mandir', 'Gunfa', 'Hall', 'Commercial Properties'];
// Legacy alias (the events module shipped with this name first).
export const EVENT_CATEGORIES = PROPERTY_CATEGORIES;

// Default Event Type options (admin-managed via Settings → Dropdown Options;
// these are the fallback used before the dynamic list loads).
export const EVENT_TYPES = ['Festival', 'Pooja', 'Discourse', 'Seva', 'Wedding', 'Community'];

export const TIRTHANKARS = [
  'Shree Adinath (Rishabhdev)',
  'Shree Ajitnath',
  'Shree Sambhavnath',
  'Shree Abhinandannath',
  'Shree Sumatinath',
  'Shree Padmaprabhu',
  'Shree Suparshvanath',
  'Shree Chandraprabhu',
  'Shree Suvidhinath',
  'Shree Shitalnath',
  'Shree Shreyansnath',
  'Shree Vasupujya',
  'Shree Vimalnath',
  'Shree Anantnath',
  'Shree Dharmanath',
  'Shree Shantinath',
  'Shree Kunthunath',
  'Shree Aranath',
  'Shree Mallinath',
  'Shree Munisuvratswami',
  'Shree Naminath',
  'Shree Neminath',
  'Shree Parshvanath',
  'Shree Mahavir Swami',
];
