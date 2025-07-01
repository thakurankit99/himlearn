import React, { useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../../Context/AuthContext';
import axios from 'axios';

const AnnouncementModal = ({ mode, announcement, onClose, onSuccess }) => {
    const { config } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        visibility: 'public',
        isActive: true,
        expiresAt: '',
        expiresTime: '23:59'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const isMounted = useRef(true);

    useEffect(() => {
        // Set isMounted to true when component mounts
        isMounted.current = true;
        
        if (mode === 'edit' && announcement) {
            setFormData({
                title: announcement.title || '',
                content: announcement.content || '',
                visibility: announcement.visibility || 'public',
                isActive: announcement.isActive !== undefined ? announcement.isActive : true,
                expiresAt: announcement.expiresAt ? new Date(announcement.expiresAt).toISOString().split('T')[0] : '',
                expiresTime: announcement.expiresTime || '23:59'
            });
        } else if (mode === 'view' && announcement) {
            setFormData({
                title: announcement.title || '',
                content: announcement.content || '',
                visibility: announcement.visibility || 'public',
                isActive: announcement.isActive !== undefined ? announcement.isActive : true,
                expiresAt: announcement.expiresAt ? new Date(announcement.expiresAt).toISOString().split('T')[0] : '',
                expiresTime: announcement.expiresTime || '23:59'
            });
        }
        
        // Cleanup function to set isMounted to false when unmounting
        return () => {
            isMounted.current = false;
        };
    }, [mode, announcement]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const submitData = {
                ...formData,
                expiresAt: formData.expiresAt || null
            };

            if (mode === 'create') {
                await axios.post('/admin/announcements', submitData, config);
            } else if (mode === 'edit') {
                await axios.put(`/admin/announcements/${announcement._id}`, submitData, config);
            }

            onSuccess();
        } catch (error) {
            // Only update state if component is still mounted
            if (isMounted.current) {
                setError(error.response?.data?.message || 'An error occurred');
            }
        } finally {
            // Only update state if component is still mounted
            if (isMounted.current) {
                setLoading(false);
            }
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const isReadOnly = mode === 'view';
    const title = mode === 'create' ? 'Create Announcement' : 
                  mode === 'edit' ? 'Edit Announcement' : 'View Announcement';

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-10 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-lg bg-white max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="p-6">
                    {error && (
                        <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
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

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Title *
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                required
                                disabled={isReadOnly}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50 disabled:text-gray-500"
                                placeholder="Enter announcement title"
                            />
                        </div>

                        {/* Content */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Content *
                            </label>
                            <textarea
                                name="content"
                                value={formData.content}
                                onChange={handleInputChange}
                                required
                                disabled={isReadOnly}
                                rows={6}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50 disabled:text-gray-500"
                                placeholder="Enter announcement content"
                            />
                        </div>

                        {/* Visibility */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Visibility
                            </label>
                            <select
                                name="visibility"
                                value={formData.visibility}
                                onChange={handleInputChange}
                                disabled={isReadOnly}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50 disabled:text-gray-500"
                            >
                                <option value="public">Public (Everyone can see)</option>
                                <option value="users">Users Only (Registered users only)</option>
                            </select>
                            <p className="mt-1 text-sm text-gray-500">
                                Choose who can see this announcement
                            </p>
                        </div>

                        {/* Expiration Date and Time */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Expiration Date (Optional)
                                </label>
                                <input
                                    type="date"
                                    name="expiresAt"
                                    value={formData.expiresAt}
                                    onChange={handleInputChange}
                                    disabled={isReadOnly}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50 disabled:text-gray-500"
                                />
                                <p className="mt-1 text-sm text-gray-500">
                                    Leave empty for no expiration
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Expiration Time
                                </label>
                                <input
                                    type="time"
                                    name="expiresTime"
                                    value={formData.expiresTime}
                                    onChange={handleInputChange}
                                    disabled={isReadOnly || !formData.expiresAt}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50 disabled:text-gray-500"
                                />
                                <p className="mt-1 text-sm text-gray-500">
                                    Time when announcement expires
                                </p>
                            </div>
                        </div>

                        {/* Active Status */}
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                name="isActive"
                                checked={formData.isActive}
                                onChange={handleInputChange}
                                disabled={isReadOnly}
                                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded disabled:opacity-50"
                            />
                            <label className="ml-2 block text-sm text-gray-700">
                                Active (visible to users)
                            </label>
                        </div>

                        {/* View Mode Additional Info */}
                        {mode === 'view' && announcement && (
                            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                                <h4 className="font-medium text-gray-900">Additional Information</h4>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-gray-500">Created:</span>
                                        <span className="ml-2 text-gray-900">{formatDate(announcement.createdAt)}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">Updated:</span>
                                        <span className="ml-2 text-gray-900">{formatDate(announcement.updatedAt)}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">Total Reads:</span>
                                        <span className="ml-2 text-gray-900">{announcement.totalReads || 0}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">Author:</span>
                                        <span className="ml-2 text-gray-900">{announcement.author?.username || 'Admin'}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Buttons */}
                        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors duration-200"
                            >
                                {isReadOnly ? 'Close' : 'Cancel'}
                            </button>
                            {!isReadOnly && (
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                >
                                    {loading ? 'Saving...' : (mode === 'create' ? 'Create' : 'Update')}
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AnnouncementModal;
