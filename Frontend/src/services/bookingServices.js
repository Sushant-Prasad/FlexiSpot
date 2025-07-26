const BASE_URL = 'http://localhost:8080/api/bookings';

//Get 30-minute time slots for a seat on a specific date
export const getTimeSlotsForSeat = async (seatId, date) => {
  const res = await fetch(`${BASE_URL}/seat/${seatId}/timeslots?date=${date}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    console.error(`GET /seat/${seatId}/timeslots failed:`, res.status, await res.text());
    throw new Error('Failed to fetch time slots for seat');
  }

  return res.json(); //return List<TimeSlotStatus>
};

//Book a seat
export const bookSeat = async (bookingData) => {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(bookingData),
  });

  if (!res.ok) {
    console.error(`POST /bookings failed:`, res.status, await res.text());
    throw new Error('Failed to book seat');
  }

  return res.json();
};

//Cancel a booking
export const cancelBooking = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    console.error(`DELETE /bookings/${id} failed:`, res.status, await res.text());
    throw new Error('Failed to cancel booking');
  }
};

//Get all bookings
export const getAllBookings = async () => {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error('Failed to fetch bookings');
  return res.json();
};

