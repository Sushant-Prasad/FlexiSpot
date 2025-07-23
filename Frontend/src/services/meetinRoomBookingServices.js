const BASE_URL = 'http://localhost:8080/api/meeting-bookings';

// ✅ Get all meeting room bookings
export const getAllMeetingBookings = async () => {
  const res = await fetch(BASE_URL, {
    method: 'GET',
    //credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to fetch meeting bookings');
  return res.json();
};

// ✅ Book a meeting room
export const bookMeetingRoom = async (bookingData) => {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    //credentials: 'include',
    body: JSON.stringify(bookingData),
  });
  if (!res.ok) throw new Error('Failed to book meeting room');
  return res.json();
};

// ✅ Cancel a meeting booking
export const cancelMeetingBooking = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
    //credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to cancel meeting room booking');
};
