const BASE_URL = 'http://localhost:1005/api/meeting-rooms';

// 🔐 Helper to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// ✅ Get all meeting rooms
export const getAllMeetingRooms = async () => {
  const res = await fetch(`${BASE_URL}/all`, {
    method: 'GET',
    headers: getAuthHeaders(),
    credentials: 'include', // optional if using cookies, can remove if not
  });

  if (!res.ok) throw new Error('Failed to fetch all meeting rooms');
  return res.json();
};

// ✅ Get filtered meeting rooms (by location/building/floor)
export const getFilteredMeetingRooms = async ({ location, building, floor }) => {
  const queryParams = new URLSearchParams();
  if (location) queryParams.append('location', location);
  if (building) queryParams.append('building', building);
  if (floor) queryParams.append('floor', floor);

  const res = await fetch(`${BASE_URL}?${queryParams.toString()}`, {
    method: 'GET',
    headers: getAuthHeaders(),
    credentials: 'include',
  });

  if (!res.ok) throw new Error('Failed to fetch filtered meeting rooms');
  return res.json();
};
