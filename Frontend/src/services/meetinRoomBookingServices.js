const BASE_URL = 'http://localhost:8080/api/meeting-bookings';

//Get all meeting room bookings
export const getAllMeetingBookings = async () => {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error('Failed to fetch meeting bookings');
  return res.json();
};

//Book a meeting room
export const bookMeetingRoom = async (bookingData) => {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(bookingData),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || 'Failed to book meeting room');
  }

  return res.json();
};

//Cancel a meeting booking
export const cancelMeetingBooking = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || 'Failed to cancel meeting room booking');
  }
};

// Get 1-hour time slots for a specific meeting room on a date
export const getTimeSlotsForMeetingRoom = async (meetingRoomId, date) => {
  const res = await fetch(`${BASE_URL}/room/${meetingRoomId}/timeslots?date=${date}`);
  if (!res.ok) throw new Error('Failed to fetch meeting room time slots');
  return res.json();
};
