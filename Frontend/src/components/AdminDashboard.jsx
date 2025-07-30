import React, { useState, useEffect } from "react";
import UsageAnalytics from "./UsageAnalytics";
import ResourceManagement from "./ResourceManagement";
import axios from "axios";
import { FiBarChart, FiUsers, FiMapPin, FiCalendar, FiSettings, FiRefreshCw, FiTrendingUp, FiHome, FiMonitor } from "react-icons/fi";

function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('overview');
    const [analyticsData, setAnalyticsData] = useState({
        totalSeats: 0,
        totalMeetingRooms: 0,
        occupancyRate: 0,
        usedResources: 0,
        totalAvailable: 0
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Get auth header
    const getAuthHeader = () => {
        const token = localStorage.getItem('token');
        return token ? { 'Authorization': `Bearer ${token}` } : {};
    };

    // Fetch analytics data for overview
    const fetchAnalyticsData = async () => {
        setLoading(true);
        setError(null);
        try {
            const today = new Date().toISOString().split('T')[0];

            // Fetch total resources
            const [seatsResponse, meetingRoomsResponse, occupancyResponse] = await Promise.all([
                axios.get('http://localhost:1005/api/seat-management', { headers: getAuthHeader() }),
                axios.get('http://localhost:1005/api/meeting-room-management', { headers: getAuthHeader() }),
                axios.get(`http://localhost:1005/api/analytics/occupancy-rate?date=${today}`, { headers: getAuthHeader() })
            ]);

            const totalSeats = seatsResponse.data.length;
            const totalMeetingRooms = meetingRoomsResponse.data.length;
            const totalAvailable = totalSeats + totalMeetingRooms;
            const occupancyRate = occupancyResponse.data.occupancyRate || 0;
            const usedResources = Math.round((occupancyRate / 100) * totalAvailable);

            setAnalyticsData({
                totalSeats,
                totalMeetingRooms,
                occupancyRate,
                usedResources,
                totalAvailable
            });
        } catch (err) {
            setError('Failed to load analytics data: ' + err.message);
            // Set default values if API fails
            setAnalyticsData({
                totalSeats: 50,
                totalMeetingRooms: 10,
                occupancyRate: 75,
                usedResources: 45,
                totalAvailable: 60
            });
        } finally {
            setLoading(false);
        }
    };

    // Load analytics data on component mount
    useEffect(() => {
        fetchAnalyticsData();
    }, []);

    const renderContent = () => {
        switch (activeTab) {
            case 'overview':
                return (
                    <div className="space-y-6">
                        {/* Header */}
                        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                            <div className="flex items-center space-x-3 mb-2">
                                <FiHome className="text-2xl text-blue-600" />
                                <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                            </div>
                            <p className="text-gray-600">Welcome to the admin dashboard. Monitor analytics and manage resources efficiently.</p>
                        </div>

                        {/* Analytics Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Total Desks</p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {loading ? '...' : analyticsData.totalSeats}
                                        </p>
                                    </div>
                                    <div className="p-3 bg-blue-100 rounded-full">
                                        <FiUsers className="text-blue-600 text-xl" />
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500 mt-2">Available desks in the office</p>
                            </div>

                            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Meeting Rooms</p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {loading ? '...' : analyticsData.totalMeetingRooms}
                                        </p>
                                    </div>
                                    <div className="p-3 bg-purple-100 rounded-full">
                                        <FiMapPin className="text-purple-600 text-xl" />
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500 mt-2">Available meeting rooms</p>
                            </div>

                            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Resources in Use</p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {loading ? '...' : analyticsData.usedResources}
                                        </p>
                                    </div>
                                    <div className="p-3 bg-green-100 rounded-full">
                                        <FiCalendar className="text-green-600 text-xl" />
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500 mt-2">Currently occupied resources</p>
                            </div>

                            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Occupancy Rate</p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {loading ? '...' : `${analyticsData.occupancyRate}%`}
                                        </p>
                                    </div>
                                    <div className="p-3 bg-orange-100 rounded-full">
                                        <FiTrendingUp className="text-orange-600 text-xl" />
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500 mt-2">Current utilization</p>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                                <FiSettings className="mr-2" />
                                Quick Actions
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <button
                                    onClick={() => setActiveTab('analytics')}
                                    className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    <FiBarChart />
                                    <span>View Detailed Analytics</span>
                                </button>
                                <button
                                    onClick={() => setActiveTab('resources')}
                                    className="flex items-center justify-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                                >
                                    <FiSettings />
                                    <span>Manage Resources</span>
                                </button>
                                <button
                                    onClick={fetchAnalyticsData}
                                    disabled={loading}
                                    className="flex items-center justify-center space-x-2 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
                                >
                                    <FiRefreshCw className={loading ? 'animate-spin' : ''} />
                                    <span>{loading ? 'Refreshing...' : 'Refresh Data'}</span>
                                </button>
                            </div>
                        </div>

                        {/* Error Display */}
                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm text-red-700 font-medium">{error}</p>
                                        <p className="text-sm text-red-600 mt-1">Showing default values. Check your backend connection.</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Recent Activity */}
                        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                                <FiMonitor className="mr-2" />
                                Recent Activity
                            </h2>
                            <div className="text-center py-8">
                                <FiBarChart className="mx-auto text-4xl text-gray-400 mb-4" />
                                <p className="text-gray-500">Recent activity will be displayed here</p>
                                <p className="text-sm text-gray-400 mt-2">Click on Analytics or Resource Management for detailed information</p>
                            </div>
                        </div>
                    </div>
                );
            case 'analytics':
                return <UsageAnalytics />;
            case 'resources':
                return <ResourceManagement />;
            default:
                return null;
        }
    };

    return (
        <div className="space-y-6">
            {/* Navigation Tabs */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex space-x-1">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`px-4 py-2 rounded-lg font-semibold transition-colors flex items-center space-x-2 ${activeTab === 'overview'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        <FiHome size={16} />
                        <span>Overview</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('analytics')}
                        className={`px-4 py-2 rounded-lg font-semibold transition-colors flex items-center space-x-2 ${activeTab === 'analytics'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        <FiBarChart size={16} />
                        <span>Analytics</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('resources')}
                        className={`px-4 py-2 rounded-lg font-semibold transition-colors flex items-center space-x-2 ${activeTab === 'resources'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        <FiSettings size={16} />
                        <span>Resource Management</span>
                    </button>
                </div>
            </div>

            {/* Content */}
            {renderContent()}
        </div>
    );
}

export default AdminDashboard; 