/** Static sample data for the public partner dashboard preview. */
export const adminMockStats = {
  activeTreks: 12,
  bookingsToday: 8,
  walkInsToday: 2,
  pendingBookings: 3,
  monthlyRevenue: 18450,
};

export const adminMockRevenue = [
  {label: "Mon", value: 1840},
  {label: "Tue", value: 2360},
  {label: "Wed", value: 1920},
  {label: "Thu", value: 3140},
  {label: "Fri", value: 2780},
  {label: "Sat", value: 3620},
  {label: "Sun", value: 2790},
];

export const adminMockBookings = [
  {id: "demo-booking-1", tourist_name: "Sofia Martin", trek_date: "2026-10-08", source: "website", status: "confirmed", payment_status: "paid", treks: {title: "Agafay Desert Sunset Tour"}},
  {id: "demo-booking-2", tourist_name: "Daniel Costa", trek_date: "2026-10-08", source: "walkin", status: "pending", payment_status: "pending", treks: {title: "Marrakech Medina Food Walk"}},
  {id: "demo-booking-3", tourist_name: "Amira Haddad", trek_date: "2026-10-09", source: "website", status: "confirmed", payment_status: "paid", treks: {title: "Atlas Mountains Day Trip"}},
  {id: "demo-booking-4", tourist_name: "Lucas Silva", trek_date: "2026-10-10", source: "website", status: "pending", payment_status: "pending", treks: {title: "Merzouga Desert Circuit"}},
];

export const adminMockTasks = [
  {title: "3 bookings need confirmation", detail: "Review new reservations", href: "/partner/booking", urgent: true},
  {title: "2 reviews need moderation", detail: "Check recent traveler feedback", href: "/partner/reviews", urgent: false},
  {title: "12 experiences are published", detail: "Your current public catalogue", href: "/partner/treks", urgent: false},
];
