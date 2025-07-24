import axios from 'axios';
const API_URL = 'http://localhost:9090/analytics';

// Fetch total resources (seats + meeting rooms)
export const fetchTotalResources = async () => {
  try {
    const response = await axios.get(`${API_URL}/total-resources`);
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
    const response = await axios.get(`${API_URL}/top-used`, {
      params: { date },
    });
    return response.data; // { "Seat: A101": X, "Room: MR1": Y, ... }
  } catch (error) {
    console.error('Error fetching top used:', error.message);
    throw new Error('Failed to fetch top used');
  }
};

// Fetch suggested best days
export const fetchSuggestedBestDays = async () => {
  try {
    const response = await axios.get(`${API_URL}/suggestions/best-days`);
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
    });
    return response.data; // Blob for CSV file
  } catch (error) {
    console.error('Error downloading CSV:', error.message);
    throw new Error('Failed to download CSV');
  }
};

// Send CSV report via email
export const sendReportEmail = async (date, email) => {
  try {
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      throw new Error('Invalid date format. Use YYYY-MM-DD.');
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error('Invalid email address.');
    }
    const response = await axios.post(`${API_URL}/send-report`, null, {
      params: { date, email },
      timeout: 10000,
    });
    return response.data;
  } catch (error) {
  console.error('Error sending report email:', {
    message: error.message,
    status: error.response?.status,
    data: error.response?.data,
  });

  // Custom message if backend sends a plain string
  if (error.response?.status === 400 && typeof error.response?.data === 'string') {
    throw new Error(error.response.data); // "No bookings found for <date>"
  }

  if (error.response?.status === 405) {
    throw new Error('Method not allowed. Ensure the request uses POST.');
  }

  // Generic fallback
  throw new Error(error.response?.data?.message || error.message || 'Failed to send report email');

  
}

};
