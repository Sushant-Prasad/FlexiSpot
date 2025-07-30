import React, { useState, useEffect } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    BarElement,
} from "chart.js";
import { Line, Doughnut, Bar } from "react-chartjs-2";
import {
    fetchTotalResources,
    fetchMonthlyUsageHeatmap,
    fetchOccupancyRate,
    fetchPeakHours,
    fetchTopUsed,
    fetchSuggestedBestDays,
    fetchInactiveUsers,
    downloadSummaryCSV,
} from "../services/AnalyticsAPI";
import { UserIcon } from "@heroicons/react/20/solid";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

// Helper to generate calendar data for a month
function generateCalendarData(month, heatmapData) {
    const [year, monthNum] = month.split("-").map(Number);
    const date = new Date(year, monthNum - 1, 1);
    const days = [];
    const firstDayOfWeek = date.getDay();
    const daysInMonth = new Date(year, monthNum, 0).getDate();

    for (let i = 0; i < firstDayOfWeek; i++) {
        days.push({ date: null, count: 0 });
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${monthNum.toString().padStart(2, "0")}-${day
            .toString()
            .padStart(2, "0")}`;
        days.push({ date: dateStr, count: heatmapData[dateStr] || 0 });
    }

    const weeks = [];
    for (let i = 0; i < days.length; i += 7) {
        weeks.push(days.slice(i, i + 7));
    }
    return weeks;
}

// Helper to get heatmap color
function getHeatColor(count) {
    if (count === 0) return "bg-gray-200";
    if (count <= 5) return "bg-green-200";
    if (count <= 10) return "bg-green-400";
    if (count <= 20) return "bg-green-600";
    return "bg-green-800";
}

function UsageAnalytics() {
    // const [month, setMonth] = useState("2025-07");
    // const [selectedDate, setSelectedDate] = useState("2025-07-23");
    // const [sinceDate, setSinceDate] = useState("2025-07-01");
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");

    const [month, setMonth] = useState(`${yyyy}-${mm}`);
    const [selectedDate, setSelectedDate] = useState(`${yyyy}-${mm}-${dd}`);
    const [sinceDate, setSinceDate] = useState(`${yyyy}-${mm}-01`);

    const [heatmapData, setHeatmapData] = useState({});
    const [occupancyRate, setOccupancyRate] = useState({});
    const [peakHours, setPeakHours] = useState({});
    const [topUsed, setTopUsed] = useState({});
    const [suggestedBestDays, setSuggestedBestDays] = useState({});
    const [inactiveUsers, setInactiveUsers] = useState({});
    const [totalResources, setTotalResources] = useState({
        totalSeats: 0,
        totalMeetingRooms: 0,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null); // Added state
    const [sending, setSending] = useState(false); // <-- NEW STATE

    // Fetch all data
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            setError(null);
            try {
                const [totalRes, heatmap, occRate, peaks, top, bestDays, inactive] =
                    await Promise.all([
                        fetchTotalResources(),
                        fetchMonthlyUsageHeatmap(month),
                        fetchOccupancyRate(selectedDate),
                        fetchPeakHours(selectedDate),
                        fetchTopUsed(selectedDate),
                        fetchSuggestedBestDays(),
                        fetchInactiveUsers(sinceDate),
                    ]);
                setTotalResources(totalRes);
                setHeatmapData(heatmap.heatmap || {});
                setOccupancyRate(occRate);
                setPeakHours(peaks);
                setTopUsed(top);
                setSuggestedBestDays(bestDays);
                setInactiveUsers(inactive);
            } catch (err) {
                setError(
                    "Failed to load data. Ensure the backend is running and CORS is configured."
                );
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [month, selectedDate, sinceDate]);

    // Handle CSV download
    const handleDownloadCSV = async () => {
        if (!selectedDate || !/^\d{4}-\d{2}-\d{2}$/.test(selectedDate)) {
            setError("Please select a valid date.");
            return;
        }
        setSending(true);
        setError(null);
        try {
            const blob = await downloadSummaryCSV(selectedDate);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `usage-summary-${selectedDate}.csv`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            setSuccess("CSV downloaded successfully!");
        } catch (err) {
            setError(err.message || "Failed to download CSV.");
        } finally {
            setSending(false);
        }
    };

    // Prepare calendar data for heatmap
    const calendarWeeks = generateCalendarData(month, heatmapData);

    // Prepare peak hours chart data
    const hours = Array.from(
        { length: 24 },
        (_, i) => `${i.toString().padStart(2, "0")}:00`
    );
    const peakHourCounts = hours.map((hour) => {
        const count = peakHours.peakHours?.includes(hour)
            ? peakHours.maxBookings || 0
            : 0;
        return count;
    });

    const peakHoursData = {
        labels: hours,
        datasets: [
            {
                label: "Bookings per Hour",
                data: peakHourCounts,
                backgroundColor: "#2563eb",
                borderColor: "#1e40af",
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { display: false },
            title: { display: false },
        },
        scales: {
            y: { beginAtZero: true, ticks: { stepSize: 1 } },
            x: { ticks: { maxRotation: 45, minRotation: 45 } },
        },
    };

    // Calculate occupancy metrics
    const totalAvailable =
        totalResources.totalSeats + totalResources.totalMeetingRooms;
    const usedResources = heatmapData[selectedDate] || 0;

    return (
        <div className="p-6 max-w-7xl mx-auto bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold text-blue-800 mb-8">
                Usage Analytics Dashboard
            </h1>

            {/* Input Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <label className="font-semibold text-gray-700 block mb-2">
                        Select Month
                    </label>
                    <input
                        type="month"
                        value={month}
                        onChange={(e) => setMonth(e.target.value)}
                        className="border rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500 transition"
                    />
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <label className="font-semibold text-gray-700 block mb-2">
                        Select Date
                    </label>
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="border rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500 transition"
                    />
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <label className="font-semibold text-gray-700 block mb-2">
                        Inactive Since
                    </label>
                    <input
                        type="date"
                        value={sinceDate}
                        onChange={(e) => setSinceDate(e.target.value)}
                        className="border rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500 transition"
                    />
                </div>
            </div>

            {/* Loading and Error States */}
            {loading && (
                <div className="text-center text-gray-600 bg-white p-4 rounded-lg shadow-md mb-8">
                    Loading data...
                </div>
            )}
            {error && (
                <div className="bg-red-100 border-l-4 border-red-500 p-4 mb-8 rounded-lg">
                    <p className="text-red-700 font-semibold">{error}</p>
                    <p className="text-red-600 text-sm">
                        Ensure the backend server is running at http://localhost:1005 and
                        CORS is configured.
                    </p>
                </div>
            )}

            {success && (
                <div className="bg-green-100 border-l-4 border-green-500 p-4 mb-8 rounded-lg">
                    <div className="flex items-center">
                        <span className="text-green-700 font-semibold">{success}</span>
                    </div>
                </div>
            )}

            {/* Occupancy Rate Card */}
            <div className="mb-8 bg-gradient-to-r from-blue-600 to-blue-400 text-white p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold mb-4">
                    Occupancy for {selectedDate}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                        <p className="text-sm text-blue-100">Total Available</p>
                        <p className="text-2xl font-bold">{totalAvailable}</p>
                        <p className="text-sm text-blue-200">Seats + Meeting Rooms</p>
                    </div>
                    <div>
                        <p className="text-sm text-blue-100">Used Resources</p>
                        <p className="text-2xl font-bold">{usedResources}</p>
                        <p className="text-sm text-blue-200">Booked Today</p>
                    </div>
                    <div>
                        <p className="text-sm text-blue-100">Occupancy Rate</p>
                        <p className="text-2xl font-bold">
                            {occupancyRate.occupancyRate || "N/A"}
                        </p>
                        <p className="text-sm text-blue-200">Percentage</p>
                    </div>
                </div>
            </div>

            {/* LeetCode-Style Monthly Usage Heatmap */}
            <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-blue-800 mb-4">
                    Monthly Usage Heatmap
                </h2>
                <div className="grid grid-cols-7 gap-1 w-full max-w-md mx-auto">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, i) => (
                        <div
                            key={i}
                            className="text-center text-xs font-semibold text-gray-600"
                        >
                            {day}
                        </div>
                    ))}
                    {calendarWeeks.map((week, weekIndex) =>
                        week.map((day, dayIndex) => (
                            <div
                                key={`${weekIndex}-${dayIndex}`}
                                className={`w-10 h-10 ${day.date ? getHeatColor(day.count) : "bg-gray-50"
                                    } rounded-md flex items-center justify-center text-xs text-gray-800 hover:scale-105 transition-transform duration-200`}
                                title={day.date ? `${day.date}: ${day.count} bookings` : ""}
                            >
                                {day.date && day.date.split("-")[2]}
                            </div>
                        ))
                    )}
                </div>
                <div className="mt-4 flex gap-2 text-sm justify-center">
                    <span className="text-gray-600">Less</span>
                    <div className="w-4 h-4 bg-gray-200 rounded-sm"></div>
                    <div className="w-4 h-4 bg-green-200 rounded-sm"></div>
                    <div className="w-4 h-4 bg-green-400 rounded-sm"></div>
                    <div className="w-4 h-4 bg-green-600 rounded-sm"></div>
                    <div className="w-4 h-4 bg-green-800 rounded-sm"></div>
                    <span className="text-gray-600">More</span>
                </div>
            </div>

            {/* Peak Hours Chart */}
            <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-blue-800 mb-4">
                    Peak Hours for {selectedDate}
                </h2>
                <Bar data={peakHoursData} options={chartOptions} height={100} />
            </div>

            {/* Top Used Desks/Rooms Table */}
            <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-blue-800 mb-4">
                    Top Used Desks/Rooms for {selectedDate}
                </h2>
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-blue-100">
                                <th className="p-3 text-left text-sm font-semibold text-blue-800 border-b">
                                    Resource
                                </th>
                                <th className="p-3 text-left text-sm font-semibold text-blue-800 border-b">
                                    Bookings
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(topUsed)
                                .slice(0, 5)
                                .map(([resource, count], i) => (
                                    <tr
                                        key={i}
                                        className={`border-b hover:bg-blue-50 transition-colors ${i % 2 === 0 ? "bg-gray-50" : "bg-white"
                                            }`}
                                    >
                                        <td className="p-3 text-gray-800">{resource}</td>
                                        <td className="p-3 text-gray-800">{count}</td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Suggested Best Days */}
            <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-blue-800 mb-4">
                    Suggested Best Days (Least Crowded)
                </h2>
                <div className="flex flex-wrap gap-3">
                    {suggestedBestDays.suggestedDays?.map((day, i) => (
                        <span
                            key={i}
                            className={`inline-block px-4 py-2 rounded-full text-sm font-semibold text-gray-800 ${i === 0
                                ? "bg-green-200/50 hover:bg-green-300/60 border border-green-300"
                                : "bg-orange-200/50 hover:bg-orange-300/60 border border-orange-300"
                                } transition-colors`}
                        >
                            {day}
                        </span>
                    ))}
                </div>
                <p className="text-gray-600 text-sm mt-2">
                    Based on: {suggestedBestDays.basedOn || "N/A"}
                </p>
            </div>

            {/* Inactive Users */}
            <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-blue-800 mb-4">
                    Inactive Users Since {inactiveUsers.inactiveSince}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {inactiveUsers.inactiveUsers?.slice(0, 5).map((user, i) => (
                        <div
                            key={i}
                            className="flex items-center p-4 bg-gray-100 rounded-lg hover:shadow-md transition-shadow"
                        >
                            <UserIcon className="h-8 w-8 text-blue-500 mr-3" />
                            <span className="text-gray-800 font-medium">{user}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="sticky bottom-0 bg-gray-50 p-6 border-t border-gray-200">
                <div className="flex justify-center max-w-3xl mx-auto">
                    <div className="w-full max-w-xs">
                        <button
                            onClick={handleDownloadCSV}
                            disabled={sending}
                            className={`bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-lg hover:from-green-700 hover:to-green-800 w-full font-semibold transition-all text-sm ${sending ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {sending ? "Downloading..." : "Download CSV Report"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UsageAnalytics;