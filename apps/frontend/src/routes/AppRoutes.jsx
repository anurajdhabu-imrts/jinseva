import { Routes, Route, Navigate } from 'react-router-dom';

// ── Layouts ──
import PublicLayout from '@web/layouts/PublicLayout';
import AdminLayout  from '@dashboard/layouts/AdminLayout';
import AuthLayout   from '@dashboard/layouts/AuthLayout';
import ProtectedRoute from './ProtectedRoute';

// ── Public website ──
import Home          from '@web/pages/Home';
import About         from '@web/pages/About';
import Festivals     from '@web/pages/Festivals';
import PublicGallery from '@web/pages/PublicGallery';
import Contact       from '@web/pages/Contact';

// ── Auth ──
import Login           from '@dashboard/pages/auth/Login';
import Register        from '@dashboard/pages/auth/Register';
import ForgotPassword  from '@dashboard/pages/auth/ForgotPassword';
import OtpVerification from '@dashboard/pages/auth/OtpVerification';
import ResetPassword   from '@dashboard/pages/auth/ResetPassword';

// ── Dashboard overview ──
import Dashboard from '@dashboard/pages/overview/Dashboard';

// ── Events ──
import EventList      from '@dashboard/pages/events/EventList';
import EventCreate    from '@dashboard/pages/events/EventCreate';
import EventDetails   from '@dashboard/pages/events/EventDetails';
import EventEdit      from '@dashboard/pages/events/EventEdit';
import EventGallery   from '@dashboard/pages/events/EventGallery';
import EventAnalytics from '@dashboard/pages/events/EventAnalytics';

// ── Donations ──
import DonationList       from '@dashboard/pages/donations/DonationList';
import AddDonation        from '@dashboard/pages/donations/AddDonation';
import DonationDetails    from '@dashboard/pages/donations/DonationDetails';
import DonorProfile       from '@dashboard/pages/donations/DonorProfile';
import Receipt            from '@dashboard/pages/donations/Receipt';
import DonationAnalytics  from '@dashboard/pages/donations/DonationAnalytics';

// ── Expenses ──
import ExpenseList       from '@dashboard/pages/expenses/ExpenseList';
import AddExpense        from '@dashboard/pages/expenses/AddExpense';
import ExpenseCategories from '@dashboard/pages/expenses/ExpenseCategories';

// ── Income ──
import IncomeList       from '@dashboard/pages/income/IncomeList';
import AddIncome        from '@dashboard/pages/income/AddIncome';
import IncomeCategories from '@dashboard/pages/income/IncomeCategories';

// ── Bookings ──
import BookingList    from '@dashboard/pages/bookings/BookingList';
import PoojaBooking   from '@dashboard/pages/bookings/PoojaBooking';
import HallCalendar   from '@dashboard/pages/bookings/HallCalendar';
import BookingDetails from '@dashboard/pages/bookings/BookingDetails';

// ── Inventory ──
import InventoryList from '@dashboard/pages/inventory/InventoryList';
import AddInventory  from '@dashboard/pages/inventory/AddInventory';
import Suppliers     from '@dashboard/pages/inventory/Suppliers';

// ── Staff ──
import StaffList         from '@dashboard/pages/staff/StaffList';
import StaffProfile      from '@dashboard/pages/staff/StaffProfile';
import Attendance        from '@dashboard/pages/staff/Attendance';
import Salary            from '@dashboard/pages/staff/Salary';
import VolunteerRegister from '@dashboard/pages/staff/VolunteerRegister';

// ── Devotee Portal ──
import UserDashboard     from '@dashboard/pages/user/UserDashboard';
import DonationHistory   from '@dashboard/pages/user/DonationHistory';
import BookingHistory    from '@dashboard/pages/user/BookingHistory';
import ProfileSettings   from '@dashboard/pages/user/ProfileSettings';
import MembershipCard    from '@dashboard/pages/user/MembershipCard';
import UserNotifications from '@dashboard/pages/user/UserNotifications';

// ── Communication ──
import Announcement       from '@dashboard/pages/communication/Announcement';
import Templates          from '@dashboard/pages/communication/Templates';
import NotificationCenter from '@dashboard/pages/communication/NotificationCenter';
import GreetingCards      from '@dashboard/pages/communication/GreetingCards';

// ── Reports ──
import Reports          from '@dashboard/pages/reports/Reports';
import RevenueAnalytics from '@dashboard/pages/reports/RevenueAnalytics';
import ExpenseAnalytics from '@dashboard/pages/reports/ExpenseAnalytics';
import EventPerformance from '@dashboard/pages/reports/EventPerformance';

// ── Media ──
import PhotoGallery from '@dashboard/pages/media/PhotoGallery';
import VideoGallery from '@dashboard/pages/media/VideoGallery';
import MediaUpload  from '@dashboard/pages/media/MediaUpload';

// ── Settings ──
import TempleInfo from '@dashboard/pages/settings/TempleInfo';
import UserRoles  from '@dashboard/pages/settings/UserRoles';
import RoleEdit   from '@dashboard/pages/settings/RoleEdit';
import Users      from '@dashboard/pages/settings/Users';
import UserEdit   from '@dashboard/pages/settings/UserEdit';

import NotFound from '@dashboard/pages/NotFound';

export default function AppRoutes() {
  return (
    <Routes>
      {/* ━━━ PUBLIC WEBSITE ━━━ */}
      <Route element={<PublicLayout />}>
        <Route path="/"          element={<Home />} />
        <Route path="/about"     element={<About />} />
        <Route path="/festivals" element={<Festivals />} />
        <Route path="/gallery"   element={<PublicGallery />} />
        <Route path="/contact"   element={<Contact />} />
      </Route>

      {/* ━━━ AUTH ━━━ */}
      <Route path="/auth" element={<AuthLayout />}>
        <Route index element={<Navigate to="login" replace />} />
        <Route path="login"           element={<Login />} />
        <Route path="register"        element={<Register />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="otp"             element={<OtpVerification />} />
        <Route path="reset-password"  element={<ResetPassword />} />
      </Route>

      {/* ━━━ DASHBOARD + DEVOTEE PORTAL (auth required) ━━━ */}
      <Route element={<ProtectedRoute />}>
      <Route element={<AdminLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Events */}
        <Route path="/events"           element={<EventList />} />
        <Route path="/events/create"    element={<EventCreate />} />
        <Route path="/events/analytics" element={<EventAnalytics />} />
        <Route path="/events/gallery"   element={<EventGallery />} />
        <Route path="/events/:id/edit"  element={<EventEdit />} />
        <Route path="/events/:id"       element={<EventDetails />} />

        {/* Donations */}
        <Route path="/donations"            element={<DonationList />} />
        <Route path="/donations/new"         element={<AddDonation />} />
        <Route path="/donations/analytics"   element={<DonationAnalytics />} />
        <Route path="/donations/receipt/:id" element={<Receipt />} />
        <Route path="/donations/donor/:id"   element={<DonorProfile />} />
        <Route path="/donations/:id"         element={<DonationDetails />} />

        {/* Expenses */}
        <Route path="/expenses"            element={<ExpenseList />} />
        <Route path="/expenses/new"         element={<AddExpense />} />
        <Route path="/expenses/categories"  element={<ExpenseCategories />} />

        {/* Income */}
        <Route path="/income"            element={<IncomeList />} />
        <Route path="/income/new"         element={<AddIncome />} />
        <Route path="/income/categories"  element={<IncomeCategories />} />

        {/* Bookings */}
        <Route path="/bookings"            element={<BookingList />} />
        <Route path="/bookings/new"         element={<PoojaBooking />} />
        <Route path="/bookings/calendar"    element={<HallCalendar />} />
        <Route path="/bookings/:id"         element={<BookingDetails />} />

        {/* Inventory */}
        <Route path="/inventory"           element={<InventoryList />} />
        <Route path="/inventory/new"        element={<AddInventory />} />
        <Route path="/inventory/suppliers"  element={<Suppliers />} />

        {/* Staff */}
        <Route path="/staff"                element={<StaffList />} />
        <Route path="/staff/attendance"     element={<Attendance />} />
        <Route path="/staff/salary"         element={<Salary />} />
        <Route path="/staff/volunteers"     element={<VolunteerRegister />} />
        <Route path="/staff/:id"            element={<StaffProfile />} />

        {/* Devotee Portal */}
        <Route path="/user"                element={<UserDashboard />} />
        <Route path="/user/donations"       element={<DonationHistory />} />
        <Route path="/user/bookings"        element={<BookingHistory />} />
        <Route path="/user/profile"         element={<ProfileSettings />} />
        <Route path="/user/membership"      element={<MembershipCard />} />
        <Route path="/user/notifications"   element={<UserNotifications />} />

        {/* Communication */}
        <Route path="/communication"               element={<Announcement />} />
        <Route path="/communication/templates"     element={<Templates />} />
        <Route path="/communication/notifications" element={<NotificationCenter />} />
        <Route path="/communication/greetings"     element={<GreetingCards />} />

        {/* Reports */}
        <Route path="/reports"          element={<Reports />} />
        <Route path="/reports/revenue"   element={<RevenueAnalytics />} />
        <Route path="/reports/expense"   element={<ExpenseAnalytics />} />
        <Route path="/reports/events"    element={<EventPerformance />} />

        {/* Media */}
        <Route path="/media"         element={<PhotoGallery />} />
        <Route path="/media/videos"   element={<VideoGallery />} />
        <Route path="/media/upload"   element={<MediaUpload />} />

        {/* Settings */}
        <Route path="/settings"            element={<TempleInfo />} />
        <Route path="/settings/roles"      element={<UserRoles />} />
        <Route path="/settings/roles/new"  element={<RoleEdit />} />
        <Route path="/settings/roles/:id"  element={<RoleEdit />} />
        <Route path="/settings/users"      element={<Users />} />
        <Route path="/settings/users/new"  element={<UserEdit />} />
        <Route path="/settings/users/:id"  element={<UserEdit />} />
      </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
