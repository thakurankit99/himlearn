import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../Context/AuthContext';
import axios from 'axios';
import UserTable from './UserTable';
import UserModal from './UserModal';

const UserManagement = () => {
    const { config, activeUser } = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('create'); // 'create', 'edit', 'view'
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, [currentPage, searchTerm]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(
                `/admin/users?page=${currentPage}&search=${searchTerm}`,
                config
            );
            setUsers(data.data);
            setTotalPages(data.pages);
            setError('');
        } catch (error) {
            setError('Failed to fetch users');
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const handleCreateUser = () => {
        setModalMode('create');
        setSelectedUser(null);
        setShowModal(true);
    };

    const handleEditUser = (user) => {
        // Prevent editing current admin user
        if (user._id === activeUser._id) {
            alert('You cannot edit your own account from the admin panel.');
            return;
        }
        setModalMode('edit');
        setSelectedUser(user);
        setShowModal(true);
    };

    const handleViewUser = (user) => {
        // Prevent viewing current admin user
        if (user._id === activeUser._id) {
            alert('You cannot view your own account details from the admin panel.');
            return;
        }
        setModalMode('view');
        setSelectedUser(user);
        setShowModal(true);
    };

    const handleDeleteUser = async (userId) => {
        // Prevent deleting current admin user
        if (userId === activeUser._id) {
            alert('You cannot delete your own account. This action is not allowed for security reasons.');
            return;
        }

        if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            return;
        }

        try {
            await axios.delete(`/admin/users/${userId}`, config);
            fetchUsers(); // Refresh the list
            alert('User deleted successfully');
        } catch (error) {
            alert('Failed to delete user');
            console.error('Error deleting user:', error);
        }
    };

    const handleModalClose = () => {
        setShowModal(false);
        setSelectedUser(null);
    };

    const handleModalSuccess = () => {
        setShowModal(false);
        setSelectedUser(null);
        fetchUsers(); // Refresh the list
    };

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
                        <p className="mt-1 text-gray-600">Manage platform users and their permissions</p>
                    </div>
                    <button
                        onClick={handleCreateUser}
                        className="inline-flex items-center px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors duration-200"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Add New User
                    </button>
                </div>
            </div>

            {/* Search and Controls */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <label htmlFor="search" className="sr-only">Search users</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <input
                                id="search"
                                type="text"
                                placeholder="Search users by username..."
                                value={searchTerm}
                                onChange={handleSearch}
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 text-sm"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-red-800">{error}</p>
                        </div>
                    </div>
                </div>
            )}

            <UserTable
                users={users}
                loading={loading}
                onEdit={handleEditUser}
                onView={handleViewUser}
                onDelete={handleDeleteUser}
            />

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

            {showModal && (
                <UserModal
                    mode={modalMode}
                    user={selectedUser}
                    onClose={handleModalClose}
                    onSuccess={handleModalSuccess}
                />
            )}
        </div>
    );
};

export default UserManagement;
