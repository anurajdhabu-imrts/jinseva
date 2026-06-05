// Centralized endpoint map - wire up to api.js when backend is ready.
export const endpoints = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    forgot: '/auth/forgot-password',
    verifyOtp: '/auth/verify-otp',
    reset: '/auth/reset-password',
    me: '/auth/me',
  },
  donations: {
    list: '/donations',
    create: '/donations',
    detail: (id) => `/donations/${id}`,
    analytics: '/donations/analytics',
  },
  events: {
    list: '/events',
    create: '/events',
    detail: (id) => `/events/${id}`,
  },
  expenses: {
    list: '/expenses',
    create: '/expenses',
    detail: (id) => `/expenses/${id}`,
    categories: '/expenses/categories',
  },
  bookings: {
    list: '/bookings',
    create: '/bookings',
    detail: (id) => `/bookings/${id}`,
  },
  inventory: {
    list: '/inventory',
    create: '/inventory',
    detail: (id) => `/inventory/${id}`,
    suppliers: '/inventory/suppliers',
  },
  staff: {
    list: '/staff',
    detail: (id) => `/staff/${id}`,
    attendance: '/staff/attendance',
    salary: '/staff/salary',
  },
  volunteers: {
    list: '/volunteers',
    create: '/volunteers',
  },
  communication: {
    announcements: '/communication/announcements',
    templates: '/communication/templates',
    send: '/communication/send',
  },
  reports: {
    revenue: '/reports/revenue',
    expense: '/reports/expense',
    event: '/reports/event',
  },
  media: {
    upload: '/media/upload',
    list: '/media',
  },
  settings: {
    temple: '/settings/temple',
    payment: '/settings/payment',
    notifications: '/settings/notifications',
    roles: '/settings/roles',
  },
};
