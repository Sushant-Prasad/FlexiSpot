import axios from 'axios';
const API_URL = 'http://localhost:1005/analytics';

// Helper to get auth header
const authHeader = () => {
  const token = localStorage.getItem('token');
  
  // Temporarily remove validation to see if that's causing the issue
  if (!token) {
    console.error('Debug - No token found!');
    return {};
  }
  
  return {
    'Authorization': 'Bearer ' + token
  };
};

// Test authentication
export const testAuth = async () => {
  try {
    const headers = authHeader();
    
    const response = await axios.get(`${API_URL}/test-auth`, {
      headers: headers
    });
    return response.data;
  } catch (error) {
    console.error('Debug - Auth test failed:', error.response?.status, error.response?.data);
    throw new Error('Authentication test failed');
  }
};

// Fetch total resources (seats + meeting rooms)
export const fetchTotalResources = async () => {
  try {
    const response = await axios.get(`${API_URL}/total-resources`, {
      headers: authHeader()
    });
    return response.data; // { totalSeats: X, totalMeetingRooms: Y }
  } catch (error) {
    console.error('Error fetching total resources:', error.message);
    throw new Error('Failed to fetch total resources');
  }
};

// Fetch monthly usage heatmap
export const fetchMonthlyUsageHeatmap = async (month) => {
  try {
    const response = await axios.get(`${API_URL}/monthly-usage-heatmap`, {
      params: { month },
      headers: authHeader()
    });
    return response.data; // { heatmap: { "2025-07-01": 0, ... }, month: "2025-07" }
  } catch (error) {
    console.error('Error fetching monthly usage heatmap:', error.message);
    throw new Error('Failed to fetch monthly usage heatmap');
  }
};

// Fetch occupancy rate for a date
export const fetchOccupancyRate = async (date) => {
  try {
    const response = await axios.get(`${API_URL}/occupancy-rate`, {
      params: { date },
      headers: authHeader()
    });
    return response.data; // { date: "2025-07-23", occupancyRate: "XX.XX%" }
  } catch (error) {
    console.error('Error fetching occupancy rate:', error.message);
    throw new Error('Failed to fetch occupancy rate');
  }
};

// Fetch peak hours for a date
export const fetchPeakHours = async (date) => {
  try {
    const response = await axios.get(`${API_URL}/peak-hours`, {
      params: { date },
      headers: authHeader()
    });
    return response.data; // { date: "2025-07-23", peakHours: ["XX:00", ...], maxBookings: X }
  } catch (error) {
    console.error('Error fetching peak hours:', error.message);
    throw new Error('Failed to fetch peak hours');
  }
};

// Fetch top used seats/rooms for a date
export const fetchTopUsed = async (date) => {
  try {
    const headers = authHeader();
    
    const response = await axios.get(`${API_URL}/top-used`, {
      params: { date },
      headers: headers
    });
    return response.data; // { "Seat: A101": X, "Room: MR1": Y, ... }
  } catch (error) {
    console.error('Debug - Error details:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      headers: error.response?.headers
    });
    console.error('Error fetching top used:', error.message);
    throw new Error('Failed to fetch top used');
  }
};

// Fetch suggested best days
export const fetchSuggestedBestDays = async () => {
  try {
    const response = await axios.get(`${API_URL}/suggestions/best-days`, {
      headers: authHeader()
    });
    return response.data; // { suggestedDays: ["MONDAY", ...], basedOn: "Last 30 days" }
  } catch (error) {
    console.error('Error fetching suggested best days:', error.message);
    throw new Error('Failed to fetch suggested best days');
  }
};

// Fetch inactive users
export const fetchInactiveUsers = async (since) => {
  try {
    const response = await axios.get(`${API_URL}/user-inactive`, {
      params: { since },
      headers: authHeader()
    });
    return response.data; // { inactiveSince, inactiveUsers: [...] }
  } catch (error) {
    console.error('Error fetching inactive users:', error.message);
    throw new Error('Failed to fetch inactive users');
  }
};

// Download CSV summary
export const downloadSummaryCSV = async (date) => {
  try {
    const response = await axios.get(`${API_URL}/export-summary-csv`, {
      params: { date },
      responseType: 'blob',
      headers: authHeader()
    });
    return response.data; // Blob for CSV file
  } catch (error) {
    console.error('Error downloading CSV:', error.message);
    throw new Error('Failed to download CSV');
  }
};