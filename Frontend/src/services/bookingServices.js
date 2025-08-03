const BASE_URL = 'http://localhost:1005/api/bookings';

// Helper to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Get 30-minute time slots for a seat on a specific date
export const getTimeSlotsForSeat = async (seatId, date) => {
  const res = await fetch(`${BASE_URL}/seat/${seatId}/timeslots?date=${date}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    console.error(`GET /seat/${seatId}/timeslots failed:`, res.status, await res.text());
    throw new Error('Failed to fetch time slots for seat');
  }

  return res.json(); // return List<TimeSlotStatus>
};

// Book a seat
export const bookSeat = async (bookingData) => {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(bookingData),
  });

  if (!res.ok) {
    console.error(`POST /bookings failed:`, res.status, await res.text());
    throw new Error('Failed to book seat');
  }

  return res.json();
};

// Cancel a booking
export const cancelBooking = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    console.error(`DELETE /bookings/${id} failed:`, res.status, await res.text());
    throw new Error('Failed to cancel booking');
  }
};

// Get all bookings
export const getAllBookings = async () => {
  const res = await fetch(BASE_URL, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    console.error(`GET /bookings failed:`, res.status, await res.text());
    throw new Error('Failed to fetch bookings');
  }

  return res.json();
};
