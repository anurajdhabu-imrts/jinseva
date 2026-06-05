// Public-facing mock data for the website.

export const heroSlides = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1669153619514-54609a2fdcde?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    eyebrow: 'Est. 1924 · Walkeshwar, Mumbai',
    title: 'A Century of Devotion',
    accent: 'and Dharma',
    subtitle: 'Welcome to Shree Mahavir Jain Derasar — where the eternal teachings of the 24 Tirthankars guide our daily lives.',
    primaryCta: { label: 'Plan a Visit', to: '/contact' },
    secondaryCta: { label: 'Daily Aaradhana', to: '/festivals' },
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=1920',
    eyebrow: 'Mahaparvas',
    title: 'Paryushan',
    accent: 'awaits us',
    subtitle: '8 days of forgiveness, tapasya and self-introspection. Join the sangh for the most sacred festival of the year.',
    primaryCta: { label: 'Festival Calendar', to: '/festivals' },
    secondaryCta: { label: 'Plan your visit', to: '/contact' },
  },
];

export const sevaServices = [
  { id: 1, icon: '🪷', title: 'Snatra Pooja',          desc: 'Ceremonial abhishek with kesar, chandan, dudh and pure jal — performed at sunrise.',                cta: 'Book Pooja' },
  { id: 2, icon: '🍱', title: 'Bhojanshala',            desc: 'Sadharmik vatsalya kitchen serving 500+ devotees daily with pure sattvik bhojan.',                  cta: 'Sponsor a meal' },
  { id: 3, icon: '🐄', title: 'Jeev Daya',              desc: 'Active panjarapole rescuing cows, birds and helpless animals — a living embodiment of ahimsa.',     cta: 'Support animals' },
  { id: 4, icon: '☸️', title: 'Aaradhana',              desc: 'Pratikraman, samayik, ayambil oli — structured aaradhana for every level of seeker.',                cta: 'Daily schedule' },
  { id: 5, icon: '🎓', title: 'Pathshala',              desc: 'Free Sunday classes for children on Jain dharma, sutras, navkar mantra and stavan singing.',         cta: 'Enroll your child' },
];

export const aboutHighlights = [
  { icon: '🏛️', n: '100+', l: 'Years of Heritage' },
  { icon: '🙏', n: '8.9K+', l: 'Devotee Family' },
  { icon: '🪷', n: '24',    l: 'Tirthankars Honored' },
  { icon: '🍱', n: '2.4K+', l: 'Meals Served Daily' },
];

export const newsArticles = [
  { id: 1, title: 'Centenary Renovation of Garbhgruha Begins', excerpt: 'Marble polishing and gold-leaf restoration work has begun on the inner sanctum to mark our 100-year milestone.', date: '2026-05-22', image: 'https://images.unsplash.com/photo-1568438350562-2cae6d394ad0?w=800', author: 'Sangh Committee' },
  { id: 2, title: 'New Pathshala Wing Inaugurated',             excerpt: 'A dedicated 3-classroom wing for our Sunday pathshala was opened with the blessings of Acharya Vimal Surishwarji.',      date: '2026-05-15', image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=800', author: 'Education Committee' },
  { id: 3, title: '50,000 Devotees Joined Last Paryushan',      excerpt: 'Our Paryushan Mahaparva drew record participation with sangh members from 14 countries joining the bhakti.',           date: '2026-05-02', image: 'https://images.unsplash.com/photo-1599627388842-0e94f5d04c0d?w=800', author: 'Festival Committee' },
];

export const faqs = [
  { q: 'What time does the derasar open?',                       a: 'The derasar is open from 5:30 AM to 9:00 PM with a midday break between 12:30 PM and 3:30 PM. Please dress modestly when visiting.' },
  { q: 'How can I book a personal pooja?',                       a: 'Devotees can book any pooja (Snatra, Ashta Prakari, Panch Kalyanak etc.) through the Devotee Portal after creating an account, or by calling our sangh office.' },
  { q: 'Are non-Jains welcome at the derasar?',                   a: 'Yes, anyone with reverence and respect is welcome. We request that visitors maintain silence in the garbhgruha and follow basic darshan etiquette.' },
  { q: 'How can I volunteer?',                                     a: 'We have active volunteer groups for events, bhojanshala, aangi, library and pathshala. Register through our Devotee Portal under "Volunteer".' },
];

// Next major event for the countdown
export const nextMajorEvent = {
  title: 'Paryushan Mahaparva',
  subtitle: 'The Festival of Forgiveness',
  date: '2026-08-30T05:00:00',
  location: 'Main Derasar Complex',
  description: '8 days of fasting, pratikraman, swadhyay and bhakti culminating in Samvatsari — the holiest day of the Jain calendar.',
  image: 'https://images.unsplash.com/photo-1582558508092-c7a39fd14d05?w=1600',
};
