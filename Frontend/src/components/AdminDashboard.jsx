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
                axios.get(`http://localhost:1005/analytics/occupancy-rate?date=${today}`, { headers: getAuthHeader() })
            ]);

            const totalSeats = seatsResponse.data.length;
            const totalMeetingRooms = meetingRoomsResponse.data.length;
            const totalAvailable = totalSeats + totalMeetingRooms;
            
            // Parse occupancy rate properly - handle both string and number formats
            let occupancyRate = 0;
            if (occupancyResponse.data.occupancyRate) {
                if (typeof occupancyResponse.data.occupancyRate === 'string') {
                    // Remove % and parse as float
                    occupancyRate = parseFloat(occupancyResponse.data.occupancyRate.replace('%', '')) || 0;
                } else {
                    occupancyRate = parseFloat(occupancyResponse.data.occupancyRate) || 0;
                }
            }
            
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
                        {/* Analytics Overview */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                                <div className="flex items-center">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <FiMapPin className="text-blue-600 text-xl" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600">Total Seats</p>
                                        <p className="text-2xl font-bold text-gray-900">{analyticsData.totalSeats}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                                <div className="flex items-center">
                                    <div className="p-2 bg-green-100 rounded-lg">
                                        <FiCalendar className="text-green-600 text-xl" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600">Meeting Rooms</p>
                                        <p className="text-2xl font-bold text-gray-900">{analyticsData.totalMeetingRooms}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                                <div className="flex items-center">
                                    <div className="p-2 bg-yellow-100 rounded-lg">
                                        <FiTrendingUp className="text-yellow-600 text-xl" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600">Occupancy Rate</p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {isNaN(analyticsData.occupancyRate) ? 0 : analyticsData.occupancyRate}%
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                                <div className="flex items-center">
                                    <div className="p-2 bg-purple-100 rounded-lg">
                                        <FiUsers className="text-purple-600 text-xl" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600">Used Resources</p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {isNaN(analyticsData.usedResources) ? 0 : analyticsData.usedResources}
                                        </p>
                                    </div>
                                </div>
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
                                    className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <FiBarChart className="mr-2 text-blue-600" />
                                    <span>View Analytics</span>
                                </button>
                                <button
                                    onClick={() => setActiveTab('resources')}
                                    className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <FiMapPin className="mr-2 text-green-600" />
                                    <span>Manage Resources</span>
                                </button>
                                <button
                                    onClick={fetchAnalyticsData}
                                    className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <FiRefreshCw className="mr-2 text-purple-600" />
                                    <span>Refresh Data</span>
                                </button>
                            </div>
                        </div>

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
            {/* Header */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                        <p className="text-gray-600 mt-1">Manage your workspace booking system</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        {loading && (
                            <div className="flex items-center text-blue-600">
                                <FiRefreshCw className="animate-spin mr-2" />
                                <span className="text-sm">Loading...</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-red-800">{error}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Navigation Tabs */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="border-b border-gray-200">
                    <nav className="flex space-x-8 px-6">
                        <button
                            onClick={() => setActiveTab('overview')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'overview'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            <FiHome className="inline mr-2" />
                            Overview
                        </button>
                        <button
                            onClick={() => setActiveTab('analytics')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'analytics'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            <FiBarChart className="inline mr-2" />
                            Analytics
                        </button>
                        <button
                            onClick={() => setActiveTab('resources')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'resources'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            <FiMapPin className="inline mr-2" />
                            Resource Management
                        </button>
                    </nav>
                </div>
            </div>

            {/* Content */}
            {renderContent()}
        </div>
    );
}

export default AdminDashboard; 