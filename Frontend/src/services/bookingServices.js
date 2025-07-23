const BASE_URL = 'http://localhost:8080/api/bookings';

// ✅ 1. Get all bookings
export const getAllBookings = async () => {
  const res = await fetch(BASE_URL, {
    method: 'GET',
    // Remove credentials unless you're using sessions or cookies
    // credentials: 'include',
  });
  if (!res.ok) {
    console.error(`GET /bookings failed:`, res.status, await res.text());
    throw new Error('Failed to fetch bookings');
  }
  return res.json();
};

// ✅ 2. Book a seat
export const bookSeat = async (bookingData) => {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    // Only use credentials: 'include' if needed for session/cookie auth
    // credentials: 'include',
    body: JSON.stringify(bookingData),
  });
  if (!res.ok) {
    console.error(`POST /bookings failed:`, res.status, await res.text());
    throw new Error('Failed to book seat');
  }
  return res.json();
};

// ✅ 3. Cancel a booking
export const cancelBooking = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
    // credentials: 'include',
  });
  if (!res.ok) {
    console.error(`DELETE /bookings/${id} failed:`, res.status, await res.text());
    throw new Error('Failed to cancel booking');
  }
};

// ✅ 4. Get available seats on a specific date
export const getAvailableSeatsByDate = async (date) => {
  const res = await fetch(`${BASE_URL}/available-seats?date=${date}`, {
    method: 'GET',
    // credentials: 'include',
  });
  if (!res.ok) {
    console.error(`GET /available-seats failed:`, res.status, await res.text());
    throw new Error('Failed to fetch available seats');
  }
  return res.json();
};
