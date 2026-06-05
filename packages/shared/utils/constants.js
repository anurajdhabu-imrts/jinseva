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
