// Static sample data for the Jain temple management system. No backend required.

export const dashboardStats = {
  totalDonations: 4825670,
  totalExpenses: 1842300,
  upcomingEvents: 12,
  registeredDevotees: 8945,
  donationGrowth: 12.4,
  expenseGrowth: -3.2,
  eventsGrowth: 8.0,
  devoteesGrowth: 5.6,
};

export const monthlyIncomeExpense = [
  { month: 'Jan', income: 320000, expense: 145000 },
  { month: 'Feb', income: 285000, expense: 132000 },
  { month: 'Mar', income: 410000, expense: 168000 },
  { month: 'Apr', income: 392000, expense: 155000 },
  { month: 'May', income: 465000, expense: 178000 },
  { month: 'Jun', income: 520000, expense: 195000 },
  { month: 'Jul', income: 488000, expense: 182000 },
  { month: 'Aug', income: 545000, expense: 210000 },
  { month: 'Sep', income: 612000, expense: 235000 },
  { month: 'Oct', income: 580000, expense: 198000 },
  { month: 'Nov', income: 498000, expense: 175000 },
  { month: 'Dec', income: 712000, expense: 268000 },
];

export const donationCategories = [
  { name: 'Bhojanshala', value: 1850000, color: '#ffc01e' }, // Jain yellow
  { name: 'Gyan Daan',   value: 1245000, color: '#c8102e' }, // Jain red
  { name: 'Renovation',  value: 875000,  color: '#00843d' }, // Jain green
  { name: 'Snatra Pooja',value: 540000,  color: '#1a1b22' }, // Jain black
  { name: 'Jeev Daya',   value: 315670,  color: '#d68500' }, // Deep gold
];

export const eventRevenue = [
  { event: 'Paryushan',         revenue: 1240000, attendees: 4200 },
  { event: 'Mahavir Jayanti',   revenue: 850000,  attendees: 2400 },
  { event: 'Das Lakshan',       revenue: 620000,  attendees: 1800 },
  { event: 'Kshamavani',        revenue: 485000,  attendees: 1500 },
  { event: 'Navpad Oli',        revenue: 380000,  attendees: 1200 },
  { event: 'Diwali (Nirvana)',  revenue: 295000,  attendees: 950 },
];

export const recentTransactions = [
  { id: 'TXN-9821', donor: 'Anjali Shah',     type: 'Bhojanshala',  amount: 11000, method: 'UPI',           date: '2026-05-27T10:30:00', status: 'paid' },
  { id: 'TXN-9820', donor: 'Rajesh Mehta',     type: 'Gyan Daan',    amount: 5100,  method: 'Card',          date: '2026-05-27T09:15:00', status: 'paid' },
  { id: 'TXN-9819', donor: 'Priya Jain',        type: 'Renovation',   amount: 25000, method: 'Bank Transfer', date: '2026-05-26T18:45:00', status: 'paid' },
  { id: 'TXN-9818', donor: 'Vikram Doshi',     type: 'Snatra Pooja', amount: 2100,  method: 'UPI',           date: '2026-05-26T16:20:00', status: 'paid' },
  { id: 'TXN-9817', donor: 'Anonymous',         type: 'Anukampa',     amount: 501,   method: 'Cash',          date: '2026-05-26T11:00:00', status: 'paid' },
  { id: 'TXN-9816', donor: 'Sunita Sanghvi',   type: 'Bhojanshala',  amount: 7500,  method: 'UPI',           date: '2026-05-25T15:30:00', status: 'paid' },
  { id: 'TXN-9815', donor: 'Mohan Bhansali',    type: 'Jeev Daya',    amount: 15000, method: 'Card',          date: '2026-05-25T10:00:00', status: 'pending' },
];

export const upcomingEvents = [
  { id: 1, title: 'Pratahkal Snatra Pooja',  date: '2026-05-29', time: '06:30', location: 'Mool Nayak Garbhgruha', attendees: 250, type: 'Daily Pooja', status: 'upcoming', image: 'https://images.unsplash.com/photo-1582558508092-c7a39fd14d05?w=800' },
  { id: 2, title: 'Snatra Mahapooja',         date: '2026-05-31', time: '08:00', location: 'Rangmandap',          attendees: 400, type: 'Pooja',       status: 'upcoming', image: 'https://images.unsplash.com/photo-1518152006812-edab29b069ac?w=800' },
  { id: 3, title: 'Sadharmik Vatsalya',       date: '2026-06-02', time: '12:00', location: 'Bhojanshala',          attendees: 500, type: 'Seva',        status: 'upcoming', image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=800' },
  { id: 4, title: 'Pravachan by Acharya ji', date: '2026-06-04', time: '17:00', location: 'Upashraya Hall',       attendees: 350, type: 'Pravachan',   status: 'upcoming', image: 'https://images.unsplash.com/photo-1604608672516-f1b9b1e5e7e9?w=800' },
  { id: 5, title: 'Pratikraman',              date: '2026-06-06', time: '19:00', location: 'Upashraya',            attendees: 120, type: 'Aaradhana',   status: 'upcoming', image: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=800' },
];

export const notifications = [
  { id: 1, type: 'donation', title: 'New donation received',  message: '₹25,000 from Priya Jain for renovation',   time: '2 min ago', read: false },
  { id: 2, type: 'event',    title: 'Pooja reminder',          message: 'Snatra Pooja starts in 2 hours',            time: '15 min ago', read: false },
  { id: 3, type: 'booking',  title: 'New pooja booking',        message: 'Ashta Prakari Pooja booked for May 31',    time: '1 hour ago', read: false },
  { id: 4, type: 'inventory',title: 'Low stock alert',           message: 'Chandan (sandalwood) below threshold',     time: '3 hours ago', read: true },
  { id: 5, type: 'staff',    title: 'Staff attendance',          message: '3 staff members on leave today',           time: '5 hours ago', read: true },
  { id: 6, type: 'message',  title: 'New devotee message',       message: 'Inquiry about Paryushan arrangements',     time: 'Yesterday',  read: true },
];

export const activitySummary = [
  { label: 'Daily Poojas',       value: 142,  growth: 4.2 },
  { label: 'Pooja Bookings',     value: 38,   growth: 12.0 },
  { label: 'Bhojanshala Served', value: 2450, growth: 8.5 },
  { label: 'Active Volunteers',  value: 67,   growth: -2.1 },
];

export const eventsList = [
  { id: 'EVT-101', title: 'Paryushan Mahaparva',         date: '2026-08-30', time: '04:00', endTime: '23:00', location: 'Main Derasar Complex', type: 'Mahaparva',     status: 'upcoming',  attendees: 3500, budget: 450000, raised: 320000, description: '8-day festival of forgiveness, tapasya and self-discipline culminating in Samvatsari Pratikraman.',   organizer: 'Acharya Shree Vimal Surishwar', image: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=1200' },
  { id: 'EVT-102', title: 'Mahavir Janma Kalyanak',      date: '2026-04-15', time: '06:00', endTime: '21:00', location: 'Rangmandap',          type: 'Janma Kalyanak', status: 'upcoming',  attendees: 2200, budget: 280000, raised: 215000, description: 'Birth celebration of Bhagwan Mahavir with Snatra Mahapooja, jhanki and pravachan.',                    organizer: 'Sangh Committee',              image: 'https://images.unsplash.com/photo-1604608672516-f1b9b1e5e7e9?w=1200' },
  { id: 'EVT-103', title: 'Aayambil Oli',                  date: '2026-05-29', time: '07:00', endTime: '20:00', location: 'Upashraya Hall',     type: 'Tapasya',         status: 'upcoming',  attendees: 450,  budget: 35000,  raised: 28000,  description: '9-day spiritual fasting period dedicated to the Navpad — Arihant, Siddha and other parmesthi padas.',  organizer: 'Tapasvi Group',                image: 'https://images.unsplash.com/photo-1518152006812-edab29b069ac?w=1200' },
  { id: 'EVT-104', title: 'Das Lakshan Parva',             date: '2026-09-10', time: '00:00', endTime: '23:59', location: 'Entire Derasar',     type: 'Mahaparva',     status: 'upcoming',  attendees: 5000, budget: 850000, raised: 412000, description: '10 virtues celebration with daily pravachans, vidhan poojas and community vatsalya.',                  organizer: 'Festival Committee',             image: 'https://images.unsplash.com/photo-1582558508092-c7a39fd14d05?w=1200' },
  { id: 'EVT-105', title: 'Diwali Nirvana Mahotsav',       date: '2025-11-12', time: '17:30', endTime: '22:00', location: 'Mool Nayak Garbhgruha',type: 'Mahaparva',     status: 'completed', attendees: 2800, budget: 380000, raised: 425000, description: 'Bhagwan Mahavir\'s nirvana anniversary observed with deep darshan, laxmi pujan and gyan utsav.',     organizer: 'Festival Committee',             image: 'https://images.unsplash.com/photo-1604608672516-f1b9b1e5e7e9?w=1200' },
  { id: 'EVT-106', title: 'Snatra Mahapooja',              date: '2026-05-31', time: '08:00', endTime: '11:00', location: 'Rangmandap',          type: 'Pooja',         status: 'upcoming',  attendees: 400,  budget: 15000,  raised: 12000,  description: 'Ceremonial abhishek of Mool Nayak Tirthankar with milk, water, kesar and chandan.',                  organizer: 'Pooja Committee',                image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=1200' },
];

export const donationsList = [
  { id: 'DON-2401', donor: 'Anjali Shah',       email: 'anjali@email.com',   phone: '+91-98765-43210', type: 'Bhojanshala',  amount: 11000, method: 'UPI',           date: '2026-05-27', status: 'paid',    purpose: 'Monthly Sadharmik Vatsalya',   receipt: 'R-2401', anonymous: false },
  { id: 'DON-2402', donor: 'Rajesh Mehta',       email: 'rajesh@email.com',   phone: '+91-98123-45678', type: 'Gyan Daan',    amount: 5100,  method: 'Card',          date: '2026-05-27', status: 'paid',    purpose: 'Jain Aagam library',           receipt: 'R-2402', anonymous: false },
  { id: 'DON-2403', donor: 'Priya Jain',          email: 'priya@email.com',    phone: '+91-99876-54321', type: 'Renovation',   amount: 25000, method: 'Bank Transfer', date: '2026-05-26', status: 'paid',    purpose: 'Garbhgruha Renovation',         receipt: 'R-2403', anonymous: false },
  { id: 'DON-2404', donor: 'Vikram Doshi',       email: 'vikram@email.com',   phone: '+91-98555-12345', type: 'Snatra Pooja', amount: 2100,  method: 'UPI',           date: '2026-05-26', status: 'paid',    purpose: 'Birthday Snatra Pooja',         receipt: 'R-2404', anonymous: false },
  { id: 'DON-2405', donor: 'Anonymous',           email: '-',                  phone: '-',                 type: 'Anukampa',     amount: 501,   method: 'Cash',          date: '2026-05-26', status: 'paid',    purpose: 'Anonymous Daan',                receipt: 'R-2405', anonymous: true },
  { id: 'DON-2406', donor: 'Sunita Sanghvi',     email: 'sunita@email.com',   phone: '+91-97654-32109', type: 'Bhojanshala',  amount: 7500,  method: 'UPI',           date: '2026-05-25', status: 'paid',    purpose: 'Weekly Sadharmik Bhakti',       receipt: 'R-2406', anonymous: false },
  { id: 'DON-2407', donor: 'Mohan Bhansali',      email: 'mohan@email.com',    phone: '+91-98111-22233', type: 'Jeev Daya',    amount: 15000, method: 'Card',          date: '2026-05-25', status: 'pending', purpose: 'Panjarapole Goshala support',    receipt: 'R-2407', anonymous: false },
  { id: 'DON-2408', donor: 'Lakshmi Bhandari',  email: 'lakshmi@email.com',  phone: '+91-98777-66554', type: 'Renovation',   amount: 50000, method: 'Bank Transfer', date: '2026-05-24', status: 'paid',    purpose: 'Shikhar (spire) restoration',   receipt: 'R-2408', anonymous: false },
  { id: 'DON-2409', donor: 'Kirti Parekh',       email: 'kirti@email.com',    phone: '+91-99888-77665', type: 'Snatra Pooja', amount: 9000,  method: 'UPI',           date: '2026-05-24', status: 'paid',    purpose: 'Paryushan sponsorship',          receipt: 'R-2409', anonymous: false },
  { id: 'DON-2410', donor: 'Geetha Kothari',     email: 'geetha@email.com',   phone: '+91-98321-65478', type: 'Bhojanshala',  amount: 3100,  method: 'UPI',           date: '2026-05-23', status: 'paid',    purpose: 'Anniversary Vatsalya',           receipt: 'R-2410', anonymous: false },
];

export const expensesList = [
  { id: 'EXP-1101', category: 'Utilities',          description: 'Electricity bill - May 2026',           amount: 28500,  vendor: 'MSEB',                date: '2026-05-26', method: 'Bank Transfer', status: 'paid',    bill: 'invoice-may.pdf' },
  { id: 'EXP-1102', category: 'Pooja Materials',    description: 'Kesar, chandan, badam, kalash items',  amount: 12300,  vendor: 'Jain Pooja Bhandar',  date: '2026-05-25', method: 'Cash',           status: 'paid',    bill: 'pooja-supply.jpg' },
  { id: 'EXP-1103', category: 'Priest Honorarium', description: 'Pujari & manager salaries May',         amount: 185000, vendor: 'Staff Payroll',       date: '2026-05-24', method: 'Bank Transfer', status: 'paid',    bill: 'payroll.pdf' },
  { id: 'EXP-1104', category: 'Bhojanshala Supplies',description: 'Rice, dal, vegetables (sattvik)',     amount: 42000,  vendor: 'Shudh Bhandar',       date: '2026-05-23', method: 'UPI',            status: 'paid',    bill: 'food-bill.pdf' },
  { id: 'EXP-1105', category: 'Marble & Maintenance',description: 'Marble polishing - Garbhgruha',       amount: 65000,  vendor: 'Stone Care Ltd',      date: '2026-05-22', method: 'Cheque',         status: 'pending', bill: 'quote.pdf' },
  { id: 'EXP-1106', category: 'Decoration & Aangi',  description: 'Aangi flowers & ornaments',           amount: 18500,  vendor: 'Phoolwala',           date: '2026-05-21', method: 'Cash',           status: 'paid',    bill: 'flowers.jpg' },
  { id: 'EXP-1107', category: 'Repairs',              description: 'Sound system repair',                 amount: 8500,   vendor: 'Sound Solutions',     date: '2026-05-20', method: 'UPI',            status: 'paid',    bill: 'repair.pdf' },
  { id: 'EXP-1108', category: 'Books & Sahitya',     description: 'Aagam Sutra & Stavan books',         amount: 15000,  vendor: 'Jain Sahitya Mandir', date: '2026-05-19', method: 'Bank Transfer', status: 'paid',    bill: 'print.pdf' },
];

export const bookingsList = [
  { id: 'BK-501', devotee: 'Suresh Sanghvi',  pooja: 'Snatra Pooja',          date: '2026-05-31', time: '08:00', priest: 'Pandit Mehta',     amount: 5100,  status: 'confirmed', phone: '+91-98765-12345', notes: 'For wedding anniversary' },
  { id: 'BK-502', devotee: 'Ramesh Doshi',    pooja: 'Panch Kalyanak Pooja',  date: '2026-05-30', time: '09:30', priest: 'Pandit Shah',      amount: 11000, status: 'confirmed', phone: '+91-98555-66677', notes: 'Housewarming' },
  { id: 'BK-503', devotee: 'Meena Kothari',  pooja: 'Ashta Prakari Pooja',   date: '2026-06-01', time: '07:00', priest: 'Pandit Mehta',     amount: 3100,  status: 'pending',    phone: '+91-98222-11122', notes: 'Friday weekly pooja' },
  { id: 'BK-504', devotee: 'Arjun Bhansali',  pooja: 'Naming Ceremony',       date: '2026-06-12', time: '10:00', priest: 'Pandit Shah',      amount: 5100,  status: 'confirmed', phone: '+91-98777-33344', notes: 'Baby naming - 12 day' },
  { id: 'BK-505', devotee: 'Kavita Jain',     pooja: 'Snatak (Anniversary)',  date: '2026-06-05', time: '11:00', priest: 'Pandit Mehta',     amount: 4100,  status: 'confirmed', phone: '+91-98444-55566', notes: '25th wedding anniversary' },
  { id: 'BK-506', devotee: 'Hari Parekh',     pooja: 'Antaraay Karm Pooja',   date: '2026-06-08', time: '08:00', priest: 'Pandit Shah',      amount: 7500,  status: 'pending',    phone: '+91-98888-99000', notes: 'Family welfare' },
  { id: 'BK-507', devotee: 'Lakshmi Mehta',   pooja: '99 Yatra Pooja',         date: '2026-05-28', time: '06:00', priest: 'Pandit Mehta',     amount: 2100,  status: 'confirmed', phone: '+91-98123-78945', notes: 'Birthday' },
  { id: 'BK-508', devotee: 'Anonymous',        pooja: 'Snatra Pooja',           date: '2026-05-27', time: '17:00', priest: 'Any',              amount: 251,   status: 'cancelled', phone: '+91-98000-11000', notes: '-' },
];

// Event-wise donation records — used by the Donations tab on EventDetails
export const eventDonations = [
  // EVT-101 — Paryushan Mahaparva
  { id: 'EDN-001', eventId: 'EVT-101', donor: 'Lakshmi Bhandari', amount: 75000, method: 'Bank Transfer', date: '2026-05-22', message: 'For Samvatsari arrangements',           anonymous: false },
  { id: 'EDN-002', eventId: 'EVT-101', donor: 'Anjali Shah',       amount: 51000, method: 'UPI',           date: '2026-05-21', message: 'Sponsor full Paryushan pravachan',      anonymous: false },
  { id: 'EDN-003', eventId: 'EVT-101', donor: 'Priya Jain',        amount: 50000, method: 'Bank Transfer', date: '2026-05-20', message: '',                                       anonymous: false },
  { id: 'EDN-004', eventId: 'EVT-101', donor: 'Rajesh Mehta',      amount: 33000, method: 'Card',          date: '2026-05-19', message: '',                                       anonymous: false },
  { id: 'EDN-005', eventId: 'EVT-101', donor: 'Anonymous',          amount: 25000, method: 'UPI',           date: '2026-05-18', message: 'Anonymous daan',                         anonymous: true  },
  { id: 'EDN-006', eventId: 'EVT-101', donor: 'Sunita Sanghvi',    amount: 25000, method: 'UPI',           date: '2026-05-17', message: '',                                       anonymous: false },
  { id: 'EDN-007', eventId: 'EVT-101', donor: 'Mohan Bhansali',    amount: 21000, method: 'Card',          date: '2026-05-16', message: '',                                       anonymous: false },
  { id: 'EDN-008', eventId: 'EVT-101', donor: 'Vikram Doshi',      amount: 25000, method: 'UPI',           date: '2026-05-15', message: 'Sponsor one day vatsalya',              anonymous: false },
  { id: 'EDN-009', eventId: 'EVT-101', donor: 'Kirti Parekh',      amount: 15000, method: 'UPI',           date: '2026-05-14', message: '',                                       anonymous: false },

  // EVT-102 — Mahavir Janma Kalyanak
  { id: 'EDN-101', eventId: 'EVT-102', donor: 'Priya Jain',        amount: 51000, method: 'Bank Transfer', date: '2026-04-12', message: 'For Snatra Mahapooja kit',               anonymous: false },
  { id: 'EDN-102', eventId: 'EVT-102', donor: 'Lakshmi Bhandari',  amount: 50000, method: 'Bank Transfer', date: '2026-04-10', message: '',                                       anonymous: false },
  { id: 'EDN-103', eventId: 'EVT-102', donor: 'Kirti Parekh',      amount: 25000, method: 'UPI',           date: '2026-04-10', message: 'Aangi sponsorship',                       anonymous: false },
  { id: 'EDN-104', eventId: 'EVT-102', donor: 'Anjali Shah',       amount: 25000, method: 'UPI',           date: '2026-04-09', message: '',                                       anonymous: false },
  { id: 'EDN-105', eventId: 'EVT-102', donor: 'Anonymous',          amount: 21000, method: 'Cash',          date: '2026-04-08', message: '',                                       anonymous: true  },
  { id: 'EDN-106', eventId: 'EVT-102', donor: 'Rajesh Mehta',      amount: 15000, method: 'Card',          date: '2026-04-07', message: '',                                       anonymous: false },
  { id: 'EDN-107', eventId: 'EVT-102', donor: 'Sunita Sanghvi',    amount: 13000, method: 'UPI',           date: '2026-04-05', message: '',                                       anonymous: false },
  { id: 'EDN-108', eventId: 'EVT-102', donor: 'Hari Parekh',        amount: 15000, method: 'UPI',           date: '2026-04-04', message: '',                                       anonymous: false },

  // EVT-103 — Aayambil Oli
  { id: 'EDN-201', eventId: 'EVT-103', donor: 'Meena Kothari',     amount: 11000, method: 'UPI',           date: '2026-05-25', message: 'Navpad sponsorship',                     anonymous: false },
  { id: 'EDN-202', eventId: 'EVT-103', donor: 'Sneha Shah',         amount: 5100,  method: 'UPI',           date: '2026-05-24', message: '',                                       anonymous: false },
  { id: 'EDN-203', eventId: 'EVT-103', donor: 'Arvind Doshi',      amount: 5100,  method: 'Card',          date: '2026-05-23', message: '',                                       anonymous: false },
  { id: 'EDN-204', eventId: 'EVT-103', donor: 'Anonymous',          amount: 5000,  method: 'Cash',          date: '2026-05-22', message: '',                                       anonymous: true  },
  { id: 'EDN-205', eventId: 'EVT-103', donor: 'Pooja Jain',         amount: 1800,  method: 'UPI',           date: '2026-05-21', message: '',                                       anonymous: false },

  // EVT-104 — Das Lakshan Parva
  { id: 'EDN-301', eventId: 'EVT-104', donor: 'Lakshmi Bhandari',  amount: 100000,method: 'Bank Transfer', date: '2026-05-15', message: 'Lead sponsor for 10-day parva',          anonymous: false },
  { id: 'EDN-302', eventId: 'EVT-104', donor: 'Priya Jain',        amount: 75000, method: 'Bank Transfer', date: '2026-05-12', message: '',                                       anonymous: false },
  { id: 'EDN-303', eventId: 'EVT-104', donor: 'Kirti Parekh',      amount: 51000, method: 'UPI',           date: '2026-05-10', message: 'Daily vatsalya sponsor',                  anonymous: false },
  { id: 'EDN-304', eventId: 'EVT-104', donor: 'Rajesh Mehta',      amount: 51000, method: 'Card',          date: '2026-05-09', message: '',                                       anonymous: false },
  { id: 'EDN-305', eventId: 'EVT-104', donor: 'Anjali Shah',       amount: 50000, method: 'UPI',           date: '2026-05-08', message: '',                                       anonymous: false },
  { id: 'EDN-306', eventId: 'EVT-104', donor: 'Anonymous',          amount: 35000, method: 'Cash',          date: '2026-05-07', message: '',                                       anonymous: true  },
  { id: 'EDN-307', eventId: 'EVT-104', donor: 'Mohan Bhansali',    amount: 25000, method: 'UPI',           date: '2026-05-06', message: 'For pravachan arrangements',              anonymous: false },
  { id: 'EDN-308', eventId: 'EVT-104', donor: 'Geetha Kothari',    amount: 25000, method: 'UPI',           date: '2026-05-05', message: '',                                       anonymous: false },

  // EVT-105 — Diwali Nirvana Mahotsav (completed)
  { id: 'EDN-401', eventId: 'EVT-105', donor: 'Lakshmi Bhandari',  amount: 101000,method: 'Bank Transfer', date: '2025-11-05', message: 'Diwali grand sponsor',                    anonymous: false },
  { id: 'EDN-402', eventId: 'EVT-105', donor: 'Priya Jain',        amount: 75000, method: 'Bank Transfer', date: '2025-11-04', message: '',                                       anonymous: false },
  { id: 'EDN-403', eventId: 'EVT-105', donor: 'Anonymous',          amount: 51000, method: 'Cash',          date: '2025-11-03', message: '',                                       anonymous: true  },
  { id: 'EDN-404', eventId: 'EVT-105', donor: 'Kirti Parekh',      amount: 51000, method: 'UPI',           date: '2025-11-02', message: '',                                       anonymous: false },
  { id: 'EDN-405', eventId: 'EVT-105', donor: 'Anjali Shah',       amount: 50000, method: 'UPI',           date: '2025-11-01', message: '',                                       anonymous: false },
  { id: 'EDN-406', eventId: 'EVT-105', donor: 'Rajesh Mehta',      amount: 51000, method: 'Card',          date: '2025-10-30', message: '',                                       anonymous: false },
  { id: 'EDN-407', eventId: 'EVT-105', donor: 'Sunita Sanghvi',    amount: 25000, method: 'UPI',           date: '2025-10-28', message: '',                                       anonymous: false },
  { id: 'EDN-408', eventId: 'EVT-105', donor: 'Mohan Bhansali',    amount: 21000, method: 'Card',          date: '2025-10-27', message: '',                                       anonymous: false },

  // EVT-106 — Snatra Mahapooja
  { id: 'EDN-501', eventId: 'EVT-106', donor: 'Suresh Sanghvi',   amount: 5100,  method: 'UPI',           date: '2026-05-26', message: 'Sponsor pooja kit',                       anonymous: false },
  { id: 'EDN-502', eventId: 'EVT-106', donor: 'Meena Kothari',    amount: 5100,  method: 'UPI',           date: '2026-05-25', message: '',                                       anonymous: false },
  { id: 'EDN-503', eventId: 'EVT-106', donor: 'Anonymous',         amount: 2100,  method: 'Cash',          date: '2026-05-24', message: '',                                       anonymous: true  },
];

// Non-donation income — hall rental, bhojanshala, dharmashala, sahitya, panjarapole, parking, FD interest, bhandar.
export const incomeList = [
  { id: 'INC-1001', category: 'Hall Rental',              description: 'Marriage hall — Shah family wedding',       source: 'Hiren Shah',           amount: 51000, method: 'Bank Transfer', date: '2026-05-26', status: 'paid',    receipt: 'inv-shah.pdf' },
  { id: 'INC-1002', category: 'Hall Rental',              description: 'Satsang hall — 2-day discourse booking',     source: 'Jain Mahila Mandal',   amount: 21000, method: 'UPI',           date: '2026-05-25', status: 'paid',    receipt: 'inv-mahila.pdf' },
  { id: 'INC-1003', category: 'Bhojanshala Income',       description: 'Daily devotee meal tokens — week',           source: 'Bhojanshala counter',  amount: 18500, method: 'Cash',          date: '2026-05-24', status: 'paid',    receipt: 'bh-week21.pdf' },
  { id: 'INC-1004', category: 'Dharmashala (Guest Rooms)',description: '4-night guest room — Bhansali family',       source: 'Mohan Bhansali',       amount: 8800,  method: 'UPI',           date: '2026-05-24', status: 'paid',    receipt: 'gr-bhansali.pdf' },
  { id: 'INC-1005', category: 'Sahitya Bhandar (Books)',  description: 'Jain Aagam sutra book sales — month',        source: 'Library counter',      amount: 12400, method: 'Cash',          date: '2026-05-23', status: 'paid',    receipt: 'lib-may.pdf' },
  { id: 'INC-1006', category: 'Panjarapole (Goshala)',    description: 'Cow ghee + milk sales — week',                source: 'Goshala outlet',       amount: 14600, method: 'UPI',           date: '2026-05-22', status: 'paid',    receipt: 'go-week21.pdf' },
  { id: 'INC-1007', category: 'Parking Fees',              description: 'Paryushan event parking collection',          source: 'Parking gate',         amount: 9200,  method: 'Cash',          date: '2026-05-21', status: 'paid',    receipt: 'park-pary.pdf' },
  { id: 'INC-1008', category: 'FD / Bank Interest',        description: 'Quarterly interest — SBI FD account',         source: 'State Bank of India',  amount: 68000, method: 'Bank Transfer', date: '2026-05-20', status: 'paid',    receipt: 'fd-q1.pdf' },
  { id: 'INC-1009', category: 'Donation Box (Bhandar)',    description: 'Mool Nayak donation box collection',          source: 'Garbhgruha bhandar',   amount: 23500, method: 'Cash',          date: '2026-05-19', status: 'paid',    receipt: 'bh-mn.pdf' },
  { id: 'INC-1010', category: 'Hall Rental',              description: 'Vatsalya hall — birthday function',            source: 'Doshi family',         amount: 11000, method: 'UPI',           date: '2026-05-18', status: 'paid',    receipt: 'inv-doshi.pdf' },
  { id: 'INC-1011', category: 'Hall Rental',              description: 'Marriage hall advance — wedding 12-Jun',      source: 'Sanghvi family',       amount: 25000, method: 'Bank Transfer', date: '2026-05-17', status: 'pending', receipt: 'adv-sanghvi.pdf' },
  { id: 'INC-1012', category: 'Dharmashala (Guest Rooms)',description: '2-night guest stay — Jain family',           source: 'Kothari family',       amount: 4400,  method: 'UPI',           date: '2026-05-16', status: 'paid',    receipt: 'gr-kothari.pdf' },
  { id: 'INC-1013', category: 'Sahitya Bhandar (Books)',  description: 'Stavan & sutra book sales — week',           source: 'Library counter',      amount: 6800,  method: 'Cash',          date: '2026-05-15', status: 'paid',    receipt: 'lib-w20.pdf' },
  { id: 'INC-1014', category: 'Government Grant',          description: 'Annual heritage maintenance grant',           source: 'State Govt. Trust',    amount: 250000,method: 'Bank Transfer', date: '2026-05-12', status: 'paid',    receipt: 'gov-grant-2026.pdf' },
  { id: 'INC-1015', category: 'Panjarapole (Goshala)',    description: 'Bulk gaay ghee order — wholesale',            source: 'Shudh Bhandar',        amount: 28000, method: 'Bank Transfer', date: '2026-05-10', status: 'paid',    receipt: 'go-bulk.pdf' },
  { id: 'INC-1016', category: 'Other',                     description: 'Pravachan recording royalty',                  source: 'Jain TV channel',      amount: 15000, method: 'Bank Transfer', date: '2026-05-08', status: 'paid',    receipt: 'misc-tv.pdf' },
];

// Monthly income trend by category — used by charts on income/reports pages.
export const monthlyIncomeStream = [
  { month: 'Jan', hall:  85000, bhojanshala: 32000, dharmashala: 22000, sahitya: 14000, panjarapole: 38000, others: 95000 },
  { month: 'Feb', hall:  72000, bhojanshala: 28000, dharmashala: 18000, sahitya: 11000, panjarapole: 41000, others: 88000 },
  { month: 'Mar', hall: 145000, bhojanshala: 38000, dharmashala: 35000, sahitya: 16000, panjarapole: 44000, others: 120000 },
  { month: 'Apr', hall: 162000, bhojanshala: 42000, dharmashala: 42000, sahitya: 18000, panjarapole: 39000, others: 115000 },
  { month: 'May', hall: 178000, bhojanshala: 51000, dharmashala: 38000, sahitya: 19000, panjarapole: 42000, others: 285000 },
  { month: 'Jun', hall: 195000, bhojanshala: 48000, dharmashala: 45000, sahitya: 22000, panjarapole: 46000, others: 125000 },
];


export const inventoryList = [
  { id: 'INV-301', item: 'Kesar (Saffron)',       category: 'Pooja Materials', quantity: 0.8,   unit: 'kg',   minStock: 1.5,  supplier: 'Jain Pooja Bhandar',  lastRestock: '2026-05-10', costPerUnit: 250000 },
  { id: 'INV-302', item: 'Chandan (Sandalwood)',  category: 'Pooja Materials', quantity: 5,     unit: 'kg',   minStock: 8,    supplier: 'Sandal Mart',         lastRestock: '2026-04-28', costPerUnit: 2400 },
  { id: 'INV-303', item: 'Marigold Flowers',       category: 'Aangi',            quantity: 8,     unit: 'kg',   minStock: 15,   supplier: 'Phoolwala',           lastRestock: '2026-05-25', costPerUnit: 120 },
  { id: 'INV-304', item: 'Coconut',                  category: 'Pooja Materials', quantity: 180,   unit: 'pcs',  minStock: 100,  supplier: 'Local Market',        lastRestock: '2026-05-22', costPerUnit: 35 },
  { id: 'INV-305', item: 'Basmati Rice',             category: 'Bhojanshala',     quantity: 250,   unit: 'kg',   minStock: 200,  supplier: 'Shudh Bhandar',       lastRestock: '2026-05-20', costPerUnit: 85 },
  { id: 'INV-306', item: 'Toor Dal',                 category: 'Bhojanshala',     quantity: 75,    unit: 'kg',   minStock: 100,  supplier: 'Shudh Bhandar',       lastRestock: '2026-05-18', costPerUnit: 145 },
  { id: 'INV-307', item: 'Diyas (Ghee lamps)',     category: 'Pooja Materials', quantity: 850,   unit: 'pcs',  minStock: 200,  supplier: 'Jain Pooja Bhandar',  lastRestock: '2026-05-12', costPerUnit: 25 },
  { id: 'INV-308', item: 'Badam (Almonds)',         category: 'Pooja Materials', quantity: 12,    unit: 'kg',   minStock: 10,   supplier: 'Dry Fruit Bhandar',   lastRestock: '2026-05-08', costPerUnit: 950 },
  { id: 'INV-309', item: 'Kumkum',                    category: 'Pooja Materials', quantity: 20,    unit: 'kg',   minStock: 10,   supplier: 'Jain Pooja Bhandar',  lastRestock: '2026-05-08', costPerUnit: 320 },
  { id: 'INV-310', item: 'Vaaskhep (Pooja powder)', category: 'Pooja Materials', quantity: 35,    unit: 'pkt',  minStock: 50,   supplier: 'Jain Pooja Bhandar',  lastRestock: '2026-05-02', costPerUnit: 65 },
];

export const staffList = [
  { id: 'STF-01', name: 'Pandit Suresh Mehta',     role: 'Head Pujari',         department: 'Religious',  joinDate: '2018-04-10', phone: '+91-98765-00001', email: 'suresh@derasar.org', salary: 45000, status: 'active', avatar: 'https://ui-avatars.com/api/?name=Suresh+Mehta&background=c64607&color=fff' },
  { id: 'STF-02', name: 'Pandit Vinod Shah',        role: 'Senior Pujari',        department: 'Religious',  joinDate: '2019-08-15', phone: '+91-98765-00002', email: 'vinod@derasar.org',  salary: 38000, status: 'active', avatar: 'https://ui-avatars.com/api/?name=Vinod+Shah&background=ecaa07&color=fff' },
  { id: 'STF-03', name: 'Pandit Ramesh Doshi',     role: 'Assistant Pujari',     department: 'Religious',  joinDate: '2020-11-20', phone: '+91-98765-00003', email: 'ramesh@derasar.org', salary: 28000, status: 'active', avatar: 'https://ui-avatars.com/api/?name=Ramesh+Doshi&background=dc5757&color=fff' },
  { id: 'STF-04', name: 'Kamala Bhandari',          role: 'Bhojanshala Manager',  department: 'Operations', joinDate: '2017-02-08', phone: '+91-98765-00004', email: 'kamala@derasar.org', salary: 22000, status: 'active', avatar: 'https://ui-avatars.com/api/?name=Kamala+Bhandari&background=ff7e0e&color=fff' },
  { id: 'STF-05', name: 'Ganesh Sanghvi',           role: 'Security Head',         department: 'Security',   joinDate: '2019-05-12', phone: '+91-98765-00005', email: 'ganesh@derasar.org', salary: 25000, status: 'active', avatar: 'https://ui-avatars.com/api/?name=Ganesh+Sanghvi&background=722929&color=fff' },
  { id: 'STF-06', name: 'Lakshmi Bai',              role: 'Cleaner',              department: 'Operations', joinDate: '2021-09-25', phone: '+91-98765-00006', email: 'lakshmi@derasar.org', salary: 12000, status: 'active', avatar: 'https://ui-avatars.com/api/?name=Lakshmi+Bai&background=ff9c3e&color=fff' },
  { id: 'STF-07', name: 'Anil Kothari',              role: 'Accountant',           department: 'Admin',      joinDate: '2018-07-30', phone: '+91-98765-00007', email: 'anil@derasar.org',   salary: 35000, status: 'active', avatar: 'https://ui-avatars.com/api/?name=Anil+Kothari&background=86470d&color=fff' },
  { id: 'STF-08', name: 'Rekha Parekh',              role: 'Receptionist',         department: 'Admin',      joinDate: '2022-03-14', phone: '+91-98765-00008', email: 'rekha@derasar.org',  salary: 18000, status: 'leave',  avatar: 'https://ui-avatars.com/api/?name=Rekha+Parekh&background=fcc31c&color=fff' },
];

export const volunteersList = [
  { id: 'VOL-01', name: 'Sneha Shah',     area: 'Bhojanshala',     hours: 45, joined: '2025-01-15', phone: '+91-98700-11111' },
  { id: 'VOL-02', name: 'Arvind Doshi',   area: 'Aangi & Decoration', hours: 32, joined: '2025-03-22', phone: '+91-98700-22222' },
  { id: 'VOL-03', name: 'Pooja Jain',      area: 'Events',           hours: 58, joined: '2024-11-08', phone: '+91-98700-33333' },
  { id: 'VOL-04', name: 'Rohit Mehta',     area: 'Cleaning Seva',    hours: 28, joined: '2025-04-10', phone: '+91-98700-44444' },
  { id: 'VOL-05', name: 'Divya Bhansali',  area: 'Information Desk', hours: 41, joined: '2024-12-01', phone: '+91-98700-55555' },
];

export const galleryImages = [
  { id: 1, src: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=800', caption: 'Mool Nayak Darshan',     category: 'Daily Darshan', eventId: null },
  { id: 2, src: 'https://images.unsplash.com/photo-1604608672516-f1b9b1e5e7e9?w=800', caption: 'Diwali Nirvana Mahotsav',category: 'Mahaparvas', eventId: 'EVT-105' },
  { id: 3, src: 'https://images.unsplash.com/photo-1582558508092-c7a39fd14d05?w=800', caption: 'Pratahkal Snatra',       category: 'Daily Darshan', eventId: null },
  { id: 4, src: 'https://images.unsplash.com/photo-1518152006812-edab29b069ac?w=800', caption: 'Mahavir Jayanti',         category: 'Mahaparvas', eventId: 'EVT-102' },
  { id: 5, src: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=800', caption: 'Sadharmik Vatsalya',      category: 'Seva', eventId: null },
  { id: 6, src: 'https://images.unsplash.com/photo-1568438350562-2cae6d394ad0?w=800', caption: 'Shikhar Architecture',    category: 'Architecture', eventId: null },
  { id: 7, src: 'https://images.unsplash.com/photo-1583935767017-9a48f9b876a0?w=800', caption: 'Stavan Sandhya',           category: 'Events', eventId: 'EVT-106' },
  { id: 8, src: 'https://images.unsplash.com/photo-1599627388842-0e94f5d04c0d?w=800', caption: 'Paryushan Bhakti',         category: 'Mahaparvas', eventId: 'EVT-101' },
  { id: 9, src: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800', caption: 'Pratahkal Aarti',          category: 'Daily Darshan', eventId: null },
  { id: 10, src: 'https://images.unsplash.com/photo-1591777334964-301b6a2d3a26?w=800', caption: 'Derasar Garden',           category: 'Architecture', eventId: null },
  { id: 11, src: 'https://images.unsplash.com/photo-1561361398-a4b2cba8e7d6?w=800', caption: 'Snatak Ceremony',           category: 'Events', eventId: 'EVT-102' },
  { id: 12, src: 'https://images.unsplash.com/photo-1602516961822-b6dffa739bbf?w=800', caption: 'Aayambil Tapasya',         category: 'Mahaparvas', eventId: 'EVT-103' },
];

export const announcements = [
  { id: 1, title: 'Paryushan Mahaparva 2026',     date: '2026-08-30', audience: 'All Devotees', channel: 'Email + SMS', sent: 8945, opens: 6420, status: 'sent' },
  { id: 2, title: 'Sadharmik Vatsalya invite',     date: '2026-05-25', audience: 'Members',      channel: 'Email',        sent: 3200, opens: 2150, status: 'sent' },
  { id: 3, title: 'Garbhgruha Renovation Update',  date: '2026-05-20', audience: 'Donors',       channel: 'Email + SMS', sent: 1450, opens: 1180, status: 'sent' },
  { id: 4, title: 'Sunday Pravachan Schedule',     date: '2026-05-31', audience: 'All',          channel: 'SMS',          sent: 0,    opens: 0,    status: 'scheduled' },
];

export const messageTemplates = [
  { id: 1, name: 'Donation Receipt',       type: 'Email', subject: 'Thank you for your donation',     usageCount: 1842, lastUsed: '2026-05-27' },
  { id: 2, name: 'Booking Confirmation',   type: 'SMS',   subject: 'Your pooja booking confirmed',     usageCount: 562,  lastUsed: '2026-05-27' },
  { id: 3, name: 'Event Reminder',          type: 'Email', subject: 'Upcoming derasar event',          usageCount: 124,  lastUsed: '2026-05-26' },
  { id: 4, name: 'Birthday Greeting',       type: 'SMS',   subject: 'Birthday blessings from derasar', usageCount: 2890, lastUsed: '2026-05-27' },
  { id: 5, name: 'Kshamavani Greeting',     type: 'Email', subject: 'Micchami Dukkadam',                usageCount: 88,   lastUsed: '2026-05-12' },
];

export const calendarDays = (() => {
  const today = new Date('2026-05-28');
  const month = today.getMonth();
  const year = today.getFullYear();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    const events = [];
    if (d === 28) events.push({ title: 'Sandhya Aarti', type: 'ritual' });
    if (d === 29) events.push({ title: 'Snatra Pooja', type: 'pooja' });
    if (d === 30) events.push({ title: 'Panch Kalyanak', type: 'pooja' });
    if (d === 31) events.push({ title: 'Snatra Mahapooja', type: 'event' });
    days.push({ date: d, events, isToday: d === 28 });
  }
  return days;
})();

// Public-facing website data
export const publicFestivals = [
  { id: 1, name: 'Mahavir Janma Kalyanak', date: '2026-04-15', desc: 'Birth celebration of the 24th Tirthankar, Bhagwan Mahavir, with Snatra Mahapooja, jhanki and grand pravachan.', icon: '🪷', gradient: 'from-saffron-500 to-maroon-600' },
  { id: 2, name: 'Paryushan Mahaparva',    date: '2026-08-30', desc: '8-day festival of forgiveness, tapasya and self-introspection ending with Samvatsari Pratikraman.',           icon: '🕊️', gradient: 'from-rose-500 to-maroon-700' },
  { id: 3, name: 'Das Lakshan Parva',       date: '2026-09-10', desc: '10 days celebrating the dasha dharma — Uttam Kshama, Mardav, Aarjava, Shaucha and the noble virtues.',           icon: '🌟', gradient: 'from-gold-400 to-saffron-600' },
  { id: 4, name: 'Diwali Nirvana Mahotsav', date: '2026-11-12', desc: 'Bhagwan Mahavir\'s nirvana observed with deep darshan, laxmi pujan and gyan utsav.',                              icon: '🪔', gradient: 'from-amber-500 to-rose-700' },
  { id: 5, name: 'Aayambil Oli',             date: '2026-05-29', desc: '9-day spiritual fasting dedicated to the Navpad — Arihant, Siddha, Aacharya, Upadhyay, Sadhu, and beyond.',     icon: '☸️', gradient: 'from-violet-400 to-violet-700' },
  { id: 6, name: 'Kshamavani Parva',         date: '2026-09-08', desc: 'Day of forgiveness. Devotees exchange "Micchami Dukkadam" — may all my wrongs be forgiven.',                    icon: '🙏', gradient: 'from-emerald-400 to-emerald-700' },
];

export const dailySchedule = [
  { time: '05:30 AM',           name: 'Mangal Aarti',        desc: 'Opening of the garbhgruha doors with the first aarti of the day' },
  { time: '06:30 AM',           name: 'Pratahkal Snatra',    desc: 'Ceremonial abhishek of Mool Nayak Tirthankar' },
  { time: '08:00 AM',           name: 'Ashta Prakari Pooja', desc: 'Eight-fold offering pooja by devotees' },
  { time: '12:00 PM',           name: 'Rajbhog Aarti',       desc: 'Midday aarti and bhog' },
  { time: '04:00 PM',           name: 'Pravachan',           desc: 'Religious discourse by Acharya Maharaj' },
  { time: '07:00 PM',           name: 'Sandhya Aarti',       desc: 'Evening aarti and stavan' },
  { time: '08:00 PM',           name: 'Pratikraman',         desc: 'Daily atonement ritual at the upashraya' },
];

export const trustees = [
  { name: 'Shri Manharbhai Shah',     role: 'President',          since: 2015, avatar: 'https://ui-avatars.com/api/?name=Manhar+Shah&background=c64607&color=fff' },
  { name: 'Shrimati Hansaben Doshi', role: 'Vice President',     since: 2017, avatar: 'https://ui-avatars.com/api/?name=Hansa+Doshi&background=ecaa07&color=fff' },
  { name: 'Shri Bhupendra Mehta',    role: 'Treasurer',          since: 2018, avatar: 'https://ui-avatars.com/api/?name=Bhupendra+Mehta&background=dc5757&color=fff' },
  { name: 'Shri Dilip Bhandari',     role: 'Secretary',          since: 2019, avatar: 'https://ui-avatars.com/api/?name=Dilip+Bhandari&background=ff7e0e&color=fff' },
];

export const testimonials = [
  { name: 'Anjali Shah',     city: 'Mumbai',     text: 'The Snatra Pooja at this derasar gave me a peace I have not felt anywhere else. The arrangements are flawless and reverent.', avatar: 'https://ui-avatars.com/api/?name=Anjali+Shah&background=ff7e0e&color=fff' },
  { name: 'Rajesh Mehta',    city: 'Ahmedabad',  text: 'Paryushan here is an experience every Jain should witness once in a lifetime. The acharya\'s pravachans are deeply moving.',  avatar: 'https://ui-avatars.com/api/?name=Rajesh+Mehta&background=c64607&color=fff' },
  { name: 'Priya Jain',       city: 'Bengaluru',  text: 'I have been donating online for years and the digital receipts arrive within minutes. Such a beautifully run derasar.',    avatar: 'https://ui-avatars.com/api/?name=Priya+Jain&background=ecaa07&color=fff' },
];
