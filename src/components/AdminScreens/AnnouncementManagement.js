import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../Context/AuthContext';
import axios from 'axios';
import AnnouncementTable from './AnnouncementTable';
import AnnouncementModal from './AnnouncementModal';

const AnnouncementManagement = () => {
    const { config } = useContext(AuthContext);
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('create'); // 'create', 'edit', 'view'
    const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

    useEffect(() => {
        fetchAnnouncements();
    }, [currentPage, searchTerm, statusFilter]);

    const fetchAnnouncements = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                page: currentPage,
                ...(searchTerm && { search: searchTerm }),
                ...(statusFilter && { status: statusFilter })
            });
            
            const { data } = await axios.get(`/admin/announcements?${params}`, config);
            setAnnouncements(data.data);
            setTotalPages(data.pages);
            setError('');
        } catch (error) {
            setError('Failed to fetch announcements');
            console.error('Error fetching announcements:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const handleStatusFilter = (e) => {
        setStatusFilter(e.target.value);
        setCurrentPage(1);
    };

    const handleCreateAnnouncement = () => {
        setModalMode('create');
        setSelectedAnnouncement(null);
        setShowModal(true);
    };

    const handleEditAnnouncement = (announcement) => {
        setModalMode('edit');
        setSelectedAnnouncement(announcement);
        setShowModal(true);
    };

    const handleViewAnnouncement = (announcement) => {
        setModalMode('view');
        setSelectedAnnouncement(announcement);
        setShowModal(true);
    };

    const handleDeleteAnnouncement = async (announcementId) => {
        if (!window.confirm('Are you sure you want to delete this announcement? This action cannot be undone.')) {
            return;
        }

        try {
            await axios.delete(`/admin/announcements/${announcementId}`, config);
            fetchAnnouncements(); // Refresh the list
            alert('Announcement deleted successfully');
        } catch (error) {
            alert('Failed to delete announcement');
            console.error('Error deleting announcement:', error);
        }
    };

    const handleModalClose = () => {
        setShowModal(false);
        setSelectedAnnouncement(null);
    };

    const handleModalSuccess = () => {
        setShowModal(false);
        setSelectedAnnouncement(null);
        fetchAnnouncements(); // Refresh the list
    };

    const getStats = () => {
        const total = announcements.length;
        const active = announcements.filter(a => a.isActive).length;
        const inactive = announcements.filter(a => !a.isActive).length;
        const expiring = announcements.filter(a => a.expiresAt && new Date(a.expiresAt) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)).length; // Expiring in 7 days

        return { total, active, inactive, expiring };
    };

    const stats = getStats();

    return (
        <div className="space-y-6">
            {/* Header Section with Stats */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Announcement Management</h2>
                        <p className="mt-1 text-gray-600">Create and manage platform announcements</p>
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-primary-600">{stats.total}</div>
                            <div className="text-sm text-gray-500">Total</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
                            <div className="text-sm text-gray-500">Active</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-gray-600">{stats.inactive}</div>
                            <div className="text-sm text-gray-500">Inactive</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-orange-600">{stats.expiring}</div>
                            <div className="text-sm text-gray-500">Expiring Soon</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Controls Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex flex-col sm:flex-row gap-4 flex-1">
                        {/* Search */}
                        <div className="relative flex-1 max-w-md">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                placeholder="Search announcements..."
                                value={searchTerm}
                                onChange={handleSearch}
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            />
                        </div>

                        {/* Status Filter */}
                        <select
                            value={statusFilter}
                            onChange={handleStatusFilter}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        >
                            <option value="">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>

                    {/* Create Button */}
                    <button
                        onClick={handleCreateAnnouncement}
                        className="inline-flex items-center px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors duration-200"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Create Announcement
                    </button>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex">
                        <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div className="ml-3">
                            <p className="text-sm text-red-800">{error}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Announcements Table */}
            <AnnouncementTable
                announcements={announcements}
                loading={loading}
                onEdit={handleEditAnnouncement}
                onView={handleViewAnnouncement}
                onDelete={handleDeleteAnnouncement}
            />

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-700">
                                Page <span className="font-medium">{currentPage}</span> of{' '}
                                <span className="font-medium">{totalPages}</span>
                            </span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                            >
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                Previous
                            </button>
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                            >
                                Next
                                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <AnnouncementModal
                    mode={modalMode}
                    announcement={selectedAnnouncement}
                    onClose={handleModalClose}
                    onSuccess={handleModalSuccess}
                />
            )}
        </div>
    );
};

export default AnnouncementManagement;
