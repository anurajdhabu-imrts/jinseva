// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  Thin API client for the RBAC backend (auth + users + roles).
//  Every call returns plain data (response.data.data / .user) so the
//  pages can use it directly. Errors bubble up as axios errors —
//  catch them in the page and surface err.response.data.message.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
import api, { TOKEN_KEY, API_BASE } from './api';

// Resolve a media URL: uploaded files come back as "/uploads/..." (relative to
// the API origin); external media is already an absolute URL.
const FILES_BASE = API_BASE.replace(/\/api\/?$/, '');
export function resolveMedia(url) {
  if (!url) return '';
  return url.startsWith('/uploads') ? FILES_BASE + url : url;
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

// Pull a human-readable message out of an axios error.
export function apiError(err) {
  return (
    err?.response?.data?.message ||
    err?.message ||
    'Something went wrong. Please try again.'
  );
}

// ── Auth ─────────────────────────────────────────────────────────
export const authApi = {
  async login(email, password) {
    const { data } = await api.post('/auth/login', { email, password });
    setToken(data.token);
    return data.user; // hydrated: { id, name, email, roleId, role, roleName, permissions, ... }
  },
  async register(payload) {
    // Self-registration does NOT log the user in — the account stays pending
    // admin approval. Returns { success, pending, message }.
    const { data } = await api.post('/auth/register', payload);
    return data;
  },
  async me() {
    const { data } = await api.get('/auth/me');
    return data.user;
  },
};

// ── Roles ────────────────────────────────────────────────────────
export const rolesApi = {
  async list() {
    const { data } = await api.get('/roles');
    return data.data; // [{ id, name, description, color, system, permissionIds, userCount }]
  },
  async get(id) {
    const { data } = await api.get(`/roles/${id}`);
    return data.data;
  },
  async permissionCatalog() {
    const { data } = await api.get('/roles/permissions');
    return data.data; // { groups, all }
  },
  async create(payload) {
    const { data } = await api.post('/roles', payload);
    return data.data;
  },
  async update(id, payload) {
    const { data } = await api.put(`/roles/${id}`, payload);
    return data.data;
  },
  async remove(id) {
    await api.delete(`/roles/${id}`);
  },
};

// ── Users ────────────────────────────────────────────────────────
export const usersApi = {
  async list(params = {}) {
    const { data } = await api.get('/users', { params });
    return data.data; // [{ id, name, email, roleId, role, roleName, status, ... }]
  },
  async get(id) {
    const { data } = await api.get(`/users/${id}`);
    return data.data;
  },
  async create(payload) {
    const { data } = await api.post('/users', payload);
    return data.data;
  },
  async update(id, payload) {
    const { data } = await api.put(`/users/${id}`, payload);
    return data.data;
  },
  async remove(id) {
    await api.delete(`/users/${id}`);
  },
};

// ── Events (+ event-wise donations) ──────────────────────────────
export const eventsApi = {
  async list(params = {}) {
    const { data } = await api.get('/events', { params });
    return data.data; // [{ id, title, type, date, ..., budget, raised }]
  },
  async get(id) {
    const { data } = await api.get(`/events/${id}`);
    return data.data;
  },
  async analytics() {
    const { data } = await api.get('/events/analytics');
    return data.data; // { totalEvents, totalRaised, totalAttendees, byEvent }
  },
  async create(payload) {
    const { data } = await api.post('/events', payload);
    return data.data;
  },
  async update(id, payload) {
    const { data } = await api.put(`/events/${id}`, payload);
    return data.data;
  },
  async remove(id) {
    await api.delete(`/events/${id}`);
  },
  // Event-wise donations
  async donations(id) {
    const { data } = await api.get(`/events/${id}/donations`);
    return data; // { count, total, event, data: [...] }
  },
  async addDonation(id, payload) {
    const { data } = await api.post(`/events/${id}/donations`, payload);
    return data.data;
  },
  async removeDonation(id, donId) {
    await api.delete(`/events/${id}/donations/${donId}`);
  },
  // Event-wise expenses
  async expenses(id) {
    const { data } = await api.get(`/events/${id}/expenses`);
    return data; // { count, total, data: [...] }
  },
  async addExpense(id, payload) {
    const { data } = await api.post(`/events/${id}/expenses`, payload);
    return data.data;
  },
  async removeExpense(id, expId) {
    await api.delete(`/events/${id}/expenses/${expId}`);
  },
};

// ── Donations ────────────────────────────────────────────────────
export const donationsApi = {
  async list(params = {}) {
    const { data } = await api.get('/donations', { params });
    return data.data;
  },
  async get(id) {
    const { data } = await api.get(`/donations/${id}`);
    return data.data;
  },
  async analytics() {
    const { data } = await api.get('/donations/analytics');
    return data.data; // { totalAmount, count, byType, byMethod, byStatus, monthly }
  },
  async create(payload) {
    const { data } = await api.post('/donations', payload);
    return data.data;
  },
  async update(id, payload) {
    const { data } = await api.put(`/donations/${id}`, payload);
    return data.data;
  },
  async remove(id) {
    await api.delete(`/donations/${id}`);
  },
  async emailReceipt(id, to) {
    const { data } = await api.post(`/donations/${id}/email-receipt`, to ? { to } : {});
    return data; // { success, message }
  },
};

// ── Income ───────────────────────────────────────────────────────
export const incomeApi = {
  async list(params = {}) {
    const { data } = await api.get('/income', { params });
    return data.data;
  },
  async get(id) {
    const { data } = await api.get(`/income/${id}`);
    return data.data;
  },
  async categories() {
    const { data } = await api.get('/income/categories');
    return data.data; // [{ name, total, count }]
  },
  async analytics() {
    const { data } = await api.get('/income/analytics');
    return data.data; // { totalAmount, count, byCategory, byMethod, monthly }
  },
  async create(payload) {
    const { data } = await api.post('/income', payload);
    return data.data;
  },
  async update(id, payload) {
    const { data } = await api.put(`/income/${id}`, payload);
    return data.data;
  },
  async remove(id) {
    await api.delete(`/income/${id}`);
  },
};

// ── Expenses (+ categories) ──────────────────────────────────────
export const expensesApi = {
  async list(params = {}) {
    const { data } = await api.get('/expenses', { params });
    return data.data;
  },
  async get(id) {
    const { data } = await api.get(`/expenses/${id}`);
    return data.data;
  },
  async analytics() {
    const { data } = await api.get('/expenses/analytics');
    return data.data; // { totalAmount, count, byCategory, byMethod, monthly }
  },
  async create(payload) {
    const { data } = await api.post('/expenses', payload);
    return data.data;
  },
  async update(id, payload) {
    const { data } = await api.put(`/expenses/${id}`, payload);
    return data.data;
  },
  async remove(id) {
    await api.delete(`/expenses/${id}`);
  },
  // Categories
  async categories() {
    const { data } = await api.get('/expenses/categories');
    return data.data; // [{ id, name, description, color, monthlyBudget, count, total }]
  },
  async createCategory(payload) {
    const { data } = await api.post('/expenses/categories', payload);
    return data.data;
  },
  async updateCategory(id, payload) {
    const { data } = await api.put(`/expenses/categories/${id}`, payload);
    return data.data;
  },
  async removeCategory(id) {
    await api.delete(`/expenses/categories/${id}`);
  },
};

// ── Bookings (pooja + hall) ──────────────────────────────────────
export const bookingsApi = {
  async list(params = {}) {
    const { data } = await api.get('/bookings', { params });
    return data.data;
  },
  async get(id) {
    const { data } = await api.get(`/bookings/${id}`);
    return data.data;
  },
  async analytics() {
    const { data } = await api.get('/bookings/analytics');
    return data.data; // { totalAmount, count, byStatus, byType }
  },
  async create(payload) {
    const { data } = await api.post('/bookings', payload);
    return data.data;
  },
  async update(id, payload) {
    const { data } = await api.put(`/bookings/${id}`, payload);
    return data.data;
  },
  async remove(id) {
    await api.delete(`/bookings/${id}`);
  },
};

// ── Inventory (+ suppliers) ──────────────────────────────────────
export const inventoryApi = {
  async list(params = {}) {
    const { data } = await api.get('/inventory', { params });
    return data.data;
  },
  async get(id) {
    const { data } = await api.get(`/inventory/${id}`);
    return data.data;
  },
  async analytics() {
    const { data } = await api.get('/inventory/analytics');
    return data.data; // { totalItems, totalValue, lowStockCount, lowStock, byCategory }
  },
  async create(payload) {
    const { data } = await api.post('/inventory', payload);
    return data.data;
  },
  async update(id, payload) {
    const { data } = await api.put(`/inventory/${id}`, payload);
    return data.data;
  },
  async restock(id, payload) {
    const { data } = await api.post(`/inventory/${id}/restock`, payload);
    return data.data;
  },
  async remove(id) {
    await api.delete(`/inventory/${id}`);
  },
  // Suppliers
  async suppliers() {
    const { data } = await api.get('/inventory/suppliers');
    return data.data; // [{ id, name, category, phone, email, rating, status, orders, itemCount }]
  },
  async createSupplier(payload) {
    const { data } = await api.post('/inventory/suppliers', payload);
    return data.data;
  },
  async updateSupplier(id, payload) {
    const { data } = await api.put(`/inventory/suppliers/${id}`, payload);
    return data.data;
  },
  async removeSupplier(id) {
    await api.delete(`/inventory/suppliers/${id}`);
  },
};

// ── Dashboard overview ───────────────────────────────────────────
export const dashboardApi = {
  async overview() {
    const { data } = await api.get('/dashboard/overview');
    return data.data; // { stats, monthlyIncomeExpense, donationCategories, eventRevenue, recentTransactions, upcomingEvents, notifications, activitySummary }
  },
};

// ── Staff & Volunteers ───────────────────────────────────────────
export const staffApi = {
  async list(params = {}) {
    const { data } = await api.get('/staff', { params });
    return data.data;
  },
  async get(id) {
    const { data } = await api.get(`/staff/${id}`);
    return data.data;
  },
  async create(payload) {
    const { data } = await api.post('/staff', payload);
    return data.data;
  },
  async update(id, payload) {
    const { data } = await api.put(`/staff/${id}`, payload);
    return data.data;
  },
  async remove(id) {
    await api.delete(`/staff/${id}`);
  },
  // Volunteers
  async volunteers() {
    const { data } = await api.get('/staff/volunteers');
    return data.data;
  },
  async createVolunteer(payload) {
    const { data } = await api.post('/staff/volunteers', payload);
    return data.data;
  },
  async updateVolunteer(id, payload) {
    const { data } = await api.put(`/staff/volunteers/${id}`, payload);
    return data.data;
  },
  async removeVolunteer(id) {
    await api.delete(`/staff/volunteers/${id}`);
  },
  // Attendance
  async attendance(date) {
    const { data } = await api.get('/staff/attendance', { params: date ? { date } : {} });
    return data; // { date, summary, data }
  },
  async markAttendance(payload) {
    const { data } = await api.post('/staff/attendance/mark', payload);
    return data;
  },
  // Salary / payroll
  async salary() {
    const { data } = await api.get('/staff/salary');
    return data; // { data, totalPayroll, paidCount, pendingCount }
  },
  async processPayroll() {
    const { data } = await api.post('/staff/salary/process');
    return data;
  },
};

// ── Communication Hub ────────────────────────────────────────────
export const communicationApi = {
  async announcements() {
    const { data } = await api.get('/communication/announcements');
    return data; // { count, totalSent, openRate, data }
  },
  async createAnnouncement(payload) {
    const { data } = await api.post('/communication/announcements', payload);
    return data; // { data, emailed, note }
  },
  async testEmail(to) {
    const { data } = await api.post('/communication/test-email', { to });
    return data; // { success, message }
  },
  async removeAnnouncement(id) {
    await api.delete(`/communication/announcements/${id}`);
  },
  async templates() {
    const { data } = await api.get('/communication/templates');
    return data.data;
  },
  async createTemplate(payload) {
    const { data } = await api.post('/communication/templates', payload);
    return data.data;
  },
  async updateTemplate(id, payload) {
    const { data } = await api.put(`/communication/templates/${id}`, payload);
    return data.data;
  },
  async removeTemplate(id) {
    await api.delete(`/communication/templates/${id}`);
  },
};

// ── Devotee Portal (current user's own data) ─────────────────────
export const meApi = {
  async summary() {
    const { data } = await api.get('/me/summary');
    return data.data;
  },
  async donations() {
    const { data } = await api.get('/me/donations');
    return data; // { count, total, data }
  },
  async bookings() {
    const { data } = await api.get('/me/bookings');
    return data; // { count, data }
  },
  async updateProfile(payload) {
    const { data } = await api.put('/me/profile', payload);
    return data.user;
  },
  async changePassword(currentPassword, newPassword) {
    const { data } = await api.post('/me/change-password', { currentPassword, newPassword });
    return data; // { success, message }
  },
};

// ── Reports & Analytics ──────────────────────────────────────────
export const reportsApi = {
  async summary() {
    const { data } = await api.get('/reports/summary');
    return data.data; // { totalRevenue, totalExpenses, netSurplus, eventsHosted, monthly, eventRevenue }
  },
  async revenue() {
    const { data } = await api.get('/reports/revenue');
    return data.data; // { totalRevenue, donations, poojaFees, miscIncome, monthly, byCategory }
  },
  async expense() {
    const { data } = await api.get('/reports/expense');
    return data.data; // { totalExpense, avgMonthly, transactions, vendors, byCategory, monthly }
  },
  async events() {
    const { data } = await api.get('/reports/events');
    return data.data; // { byEvent, count, totalRaised, totalAttendees, bestEvent, bestEventRaised }
  },
  async byProperty() {
    const { data } = await api.get('/reports/by-property');
    return data.data; // { rows:[{property,donations,income,revenue,expenses,net,color}], totals }
  },
};

// ── Public (unauthenticated) — marketing website ─────────────────
export const publicApi = {
  async festivals() {
    const { data } = await api.get('/public/festivals');
    return data.data; // [{ id, title, type, category, date, time, location, description, image }]
  },
  async gallery() {
    const { data } = await api.get('/public/gallery');
    return data.data; // [{ id, src, caption, category, url, ... }]
  },
  async contact(payload) {
    const { data } = await api.post('/public/contact', payload);
    return data; // { success, message, note }
  },
};

// ── Media (photos & videos) ──────────────────────────────────────
export const mediaApi = {
  async list(params = {}) {
    const { data } = await api.get('/media', { params });
    return data.data;
  },
  async categories() {
    const { data } = await api.get('/media/categories');
    return data.data;
  },
  async create(payload) {
    const { data } = await api.post('/media', payload);
    return data.data;
  },
  async upload(files, category = 'Uncategorized') {
    const fd = new FormData();
    Array.from(files).forEach((f) => fd.append('files', f));
    fd.append('category', category);
    // The api interceptor strips the JSON Content-Type for FormData so the
    // browser adds the multipart boundary itself.
    const { data } = await api.post('/media/upload', fd);
    return data; // { count, data }
  },
  // Upload a single image (e.g. an event banner) and get back its URL only.
  async uploadFile(file) {
    const fd = new FormData();
    fd.append('file', file);
    const { data } = await api.post('/media/file', fd);
    return data.url; // "/uploads/<file>"
  },
  async remove(id) {
    await api.delete(`/media/${id}`);
  },
};
