import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiEdit, FiTrash2, FiPlus, FiSearch, FiFilter, FiX, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

const API_BASE_URL = 'http://localhost:1005/api';

// Custom Popup Component
const Popup = ({ isOpen, onClose, title, message, type = 'info', onConfirm }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 transform transition-all">
                <div className="flex items-center justify-between p-6 border-b">
                    <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <FiX size={20} />
                    </button>
                </div>
                <div className="p-6">
                    <p className="text-gray-700 mb-6">{message}</p>
                    <div className="flex justify-end space-x-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => {
                                onConfirm();
                                onClose();
                            }}
                            className={`px-4 py-2 text-white rounded-lg transition-colors ${type === 'danger'
                                ? 'bg-red-600 hover:bg-red-700'
                                : 'bg-blue-600 hover:bg-blue-700'
                                }`}
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Custom Notification Component
const Notification = ({ message, type = 'success', isVisible, onClose }) => {
    if (!isVisible) return null;

    const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';
    const icon = type === 'success' ? <FiCheckCircle size={20} /> : <FiAlertCircle size={20} />;

    return (
        <div className={`fixed top-4 right-4 ${bgColor} text-white px-6 py-4 rounded-lg shadow-lg z-50 transform transition-all duration-300 flex items-center space-x-3`}>
            {icon}
            <span className="font-medium">{message}</span>
            <button
                onClick={onClose}
                className="ml-2 hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-colors"
            >
                <FiX size={16} />
            </button>
        </div>
    );
};

const ResourceManagement = () => {
    const [activeTab, setActiveTab] = useState('seats');
    const [seats, setSeats] = useState([]);
    const [meetingRooms, setMeetingRooms] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // Form states
    const [showForm, setShowForm] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({
        code: '',
        location: '',
        building: '',
        floor: '',
        segment: '',
        isAvailable: true,
        deskId: ''
    });

    // Filter states
    const [filters, setFilters] = useState({
        location: '',
        building: '',
        floor: '',
        segment: ''
    });
    const [showFilters, setShowFilters] = useState(false);

    // Popup states
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [notification, setNotification] = useState({
        message: '',
        type: 'success',
        isVisible: false
    });

    // Get auth header
    const getAuthHeader = () => {
        const token = localStorage.getItem('token');
        return token ? { 'Authorization': `Bearer ${token}` } : {};
    };

    // Show notification
    const showNotification = (message, type = 'success') => {
        setNotification({
            message,
            type,
            isVisible: true
        });

        // Auto-hide after 3 seconds
        setTimeout(() => {
            setNotification(prev => ({ ...prev, isVisible: false }));
        }, 3000);
    };

    // Load data
    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            if (activeTab === 'seats') {
                const response = await axios.get(`${API_BASE_URL}/seat-management`, {
                    headers: getAuthHeader()
                });
                setSeats(response.data);
            } else {
                const response = await axios.get(`${API_BASE_URL}/meeting-room-management`, {
                    headers: getAuthHeader()
                });
                setMeetingRooms(response.data);
            }
        } catch (err) {
            setError('Failed to load data: ' + err.message);
            showNotification('Failed to load data', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Apply filters
    const applyFilters = async () => {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams();
            Object.keys(filters).forEach(key => {
                if (filters[key]) params.append(key, filters[key]);
            });

            if (activeTab === 'seats') {
                const response = await axios.get(`${API_BASE_URL}/seat-management/filter?${params}`, {
                    headers: getAuthHeader()
                });
                setSeats(response.data);
            } else {
                const response = await axios.get(`${API_BASE_URL}/meeting-room-management/filter?${params}`, {
                    headers: getAuthHeader()
                });
                setMeetingRooms(response.data);
            }
        } catch (err) {
            setError('Failed to apply filters: ' + err.message);
            showNotification('Failed to apply filters', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Reset form
    const resetForm = () => {
        setFormData({
            code: '',
            location: '',
            building: '',
            floor: '',
            segment: '',
            isAvailable: true,
            deskId: ''
        });
        setEditingItem(null);
    };

    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const endpoint = activeTab === 'seats' ? '/seat-management' : '/meeting-room-management';
            const data = activeTab === 'seats' ? formData : {
                roomCode: formData.code,
                location: formData.location,
                building: formData.building,
                floor: formData.floor,
                isAvailable: formData.isAvailable
            };

            if (editingItem) {
                await axios.put(`${API_BASE_URL}${endpoint}/${editingItem.id}`, data, {
                    headers: getAuthHeader()
                });
                showNotification('Updated successfully!');
            } else {
                await axios.post(`${API_BASE_URL}${endpoint}`, data, {
                    headers: getAuthHeader()
                });
                showNotification('Created successfully!');
            }

            setShowForm(false);
            resetForm();
            loadData();
        } catch (err) {
            setError(err.response?.data || err.message);
            showNotification(err.response?.data || err.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    // Handle edit
    const handleEdit = (item) => {
        setEditingItem(item);
        setFormData({
            code: activeTab === 'seats' ? item.code : item.roomCode,
            location: item.location,
            building: item.building,
            floor: item.floor,
            segment: item.segment || '',
            isAvailable: item.isAvailable,
            deskId: item.deskId || ''
        });
        setShowForm(true);
    };

    // Handle delete confirmation
    const handleDeleteConfirm = async () => {
        setLoading(true);
        setError(null);
        try {
            const endpoint = activeTab === 'seats' ? '/seat-management' : '/meeting-room-management';
            await axios.delete(`${API_BASE_URL}${endpoint}/${itemToDelete.id}`, {
                headers: getAuthHeader()
            });
            showNotification('Deleted successfully!');
            loadData();
        } catch (err) {
            setError('Failed to delete: ' + err.message);
            showNotification('Failed to delete', 'error');
        } finally {
            setLoading(false);
            setItemToDelete(null);
        }
    };

    // Handle delete
    const handleDelete = (item) => {
        setItemToDelete(item);
        setShowDeletePopup(true);
    };

    // Handle availability toggle
    const handleAvailabilityToggle = async (id, currentStatus) => {
        setLoading(true);
        setError(null);
        try {
            const endpoint = activeTab === 'seats' ? '/seat-management' : '/meeting-room-management';
            await axios.patch(`${API_BASE_URL}${endpoint}/${id}/availability?isAvailable=${!currentStatus}`, null, {
                headers: getAuthHeader()
            });
            showNotification('Availability updated!');
            loadData();
        } catch (err) {
            setError('Failed to update availability: ' + err.message);
            showNotification('Failed to update availability', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Load data on component mount and tab change
    useEffect(() => {
        loadData();
    }, [activeTab]);

    const currentData = activeTab === 'seats' ? seats : meetingRooms;

    return (
        <div className="p-6 max-w-7xl mx-auto bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold text-blue-800 mb-8">
                Resource Management
            </h1>

            {/* Notification */}
            <Notification
                message={notification.message}
                type={notification.type}
                isVisible={notification.isVisible}
                onClose={() => setNotification(prev => ({ ...prev, isVisible: false }))}
            />

            {/* Delete Confirmation Popup */}
            <Popup
                isOpen={showDeletePopup}
                onClose={() => {
                    setShowDeletePopup(false);
                    setItemToDelete(null);
                }}
                title="Confirm Delete"
                message={`Are you sure you want to delete this ${activeTab === 'seats' ? 'desk' : 'meeting room'}? This action cannot be undone.`}
                type="danger"
                onConfirm={handleDeleteConfirm}
            />

            {/* Success/Error Messages */}
            {success && (
                <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
                    {success}
                </div>
            )}
            {error && (
                <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                </div>
            )}

            {/* Tabs */}
            <div className="flex space-x-1 mb-6">
                <button
                    onClick={() => setActiveTab('seats')}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors ${activeTab === 'seats'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                        }`}
                >
                    Desks ({seats.length})
                </button>
                <button
                    onClick={() => setActiveTab('meeting-rooms')}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors ${activeTab === 'meeting-rooms'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                        }`}
                >
                    Meeting Rooms ({meetingRooms.length})
                </button>
            </div>

            {/* Controls */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex space-x-4">
                    <button
                        onClick={() => {
                            resetForm();
                            setShowForm(true);
                        }}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                    >
                        <FiPlus />
                        <span>Add New {activeTab === 'seats' ? 'Desk' : 'Meeting Room'}</span>
                    </button>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
                    >
                        <FiFilter />
                        <span>Filters</span>
                    </button>
                </div>
                <button
                    onClick={loadData}
                    disabled={loading}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                    {loading ? 'Loading...' : 'Refresh'}
                </button>
            </div>

            {/* Filters */}
            {showFilters && (
                <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                    <h3 className="font-semibold mb-3">Filters</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <input
                            type="text"
                            placeholder="Location"
                            value={filters.location}
                            onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                            className="border rounded px-3 py-2"
                        />
                        <input
                            type="text"
                            placeholder="Building"
                            value={filters.building}
                            onChange={(e) => setFilters({ ...filters, building: e.target.value })}
                            className="border rounded px-3 py-2"
                        />
                        <input
                            type="text"
                            placeholder="Floor"
                            value={filters.floor}
                            onChange={(e) => setFilters({ ...filters, floor: e.target.value })}
                            className="border rounded px-3 py-2"
                        />
                        {activeTab === 'seats' && (
                            <input
                                type="text"
                                placeholder="Segment"
                                value={filters.segment}
                                onChange={(e) => setFilters({ ...filters, segment: e.target.value })}
                                className="border rounded px-3 py-2"
                            />
                        )}
                    </div>
                    <div className="flex space-x-2 mt-3">
                        <button
                            onClick={applyFilters}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            Apply Filters
                        </button>
                        <button
                            onClick={() => {
                                setFilters({ location: '', building: '', floor: '', segment: '' });
                                loadData();
                            }}
                            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                        >
                            Clear Filters
                        </button>
                    </div>
                </div>
            )}

            {/* Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
                        <h2 className="text-xl font-semibold mb-4">
                            {editingItem ? 'Edit' : 'Add'} {activeTab === 'seats' ? 'Desk' : 'Meeting Room'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    {activeTab === 'seats' ? 'Desk Code' : 'Room Code'}
                                </label>
                                <input
                                    type="text"
                                    value={formData.code}
                                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                    className="w-full border rounded px-3 py-2"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Location</label>
                                <input
                                    type="text"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    className="w-full border rounded px-3 py-2"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Building</label>
                                <input
                                    type="text"
                                    value={formData.building}
                                    onChange={(e) => setFormData({ ...formData, building: e.target.value })}
                                    className="w-full border rounded px-3 py-2"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Floor</label>
                                <input
                                    type="text"
                                    value={formData.floor}
                                    onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                                    className="w-full border rounded px-3 py-2"
                                    required
                                />
                            </div>
                            {activeTab === 'seats' && (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Segment</label>
                                        <input
                                            type="text"
                                            value={formData.segment}
                                            onChange={(e) => setFormData({ ...formData, segment: e.target.value })}
                                            className="w-full border rounded px-3 py-2"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Desk ID</label>
                                        <input
                                            type="text"
                                            value={formData.deskId}
                                            onChange={(e) => setFormData({ ...formData, deskId: e.target.value })}
                                            className="w-full border rounded px-3 py-2"
                                            required
                                        />
                                    </div>
                                </>
                            )}
                            <div>
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={formData.isAvailable}
                                        onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                                        className="mr-2"
                                    />
                                    <span className="text-sm font-medium">Available</span>
                                </label>
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {loading ? 'Saving...' : (editingItem ? 'Update' : 'Create')}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowForm(false);
                                        resetForm();
                                    }}
                                    className="flex-1 bg-gray-600 text-white py-2 rounded hover:bg-gray-700"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Data Table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    {activeTab === 'seats' ? 'Desk Code' : 'Room Code'}
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Location
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Building
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Floor
                                </th>
                                {activeTab === 'seats' && (
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Segment
                                    </th>
                                )}
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {currentData.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {activeTab === 'seats' ? item.code : item.roomCode}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {item.location}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {item.building}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {item.floor}
                                    </td>
                                    {activeTab === 'seats' && (
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {item.segment}
                                        </td>
                                    )}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button
                                            onClick={() => handleAvailabilityToggle(item.id, item.isAvailable)}
                                            className={`px-2 py-1 text-xs font-semibold rounded-full ${item.isAvailable
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                                }`}
                                        >
                                            {item.isAvailable ? 'Available' : 'Unavailable'}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleEdit(item)}
                                                className="text-blue-600 hover:text-blue-900"
                                            >
                                                <FiEdit />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                <FiTrash2 />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {currentData.length === 0 && !loading && (
                    <div className="text-center py-8 text-gray-500">
                        No {activeTab === 'seats' ? 'desks' : 'meeting rooms'} found.
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResourceManagement; 