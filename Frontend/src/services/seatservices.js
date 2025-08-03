const BASE_URL = 'http://localhost:1005/api/seats';

// 🔐 Helper to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// ✅ Get all available seats
export const getAvailableSeats = async () => {
  const res = await fetch(`${BASE_URL}/available`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch available seats');
  return res.json();
};

// ✅ Get all seats (no filters)
export const getAllSeats = async () => {
  const res = await fetch(`${BASE_URL}/all`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch all seats');
  return res.json();
};

// ✅ Get filtered seats by location/building/floor/segment
export const getFilteredSeats = async ({ location, building, floor, segment }) => {
  const queryParams = new URLSearchParams();

  if (location) queryParams.append('location', location);
  if (building) queryParams.append('building', building);
  if (floor) queryParams.append('floor', floor);
  if (segment) queryParams.append('segment', segment);

  const res = await fetch(`${BASE_URL}?${queryParams.toString()}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!res.ok) throw new Error('Failed to fetch filtered seats');
  return res.json();
};
