import React from 'react';

const AnnouncementTable = ({ announcements, loading, onEdit, onView, onDelete }) => {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatTime = (timeString) => {
        if (!timeString) return '';
        const [hours, minutes] = timeString.split(':');
        const hour12 = hours % 12 || 12;
        const ampm = hours >= 12 ? 'PM' : 'AM';
        return `${hour12}:${minutes} ${ampm}`;
    };

    const getStatusBadge = (isActive) => {
        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}>
                {isActive ? 'Active' : 'Inactive'}
            </span>
        );
    };

    const getVisibilityBadge = (visibility) => {
        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                visibility === 'public' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
            }`}>
                {visibility === 'public' ? 'Public' : 'Users Only'}
            </span>
        );
    };

    const truncateText = (text, maxLength = 100) => {
        if (!text) return '';
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    };

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                <div className="flex flex-col items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                    <p className="mt-4 text-gray-600">Loading announcements...</p>
                </div>
            </div>
        );
    }

    if (announcements.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                <div className="text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No announcements found</h3>
                    <p className="mt-1 text-sm text-gray-500">Get started by creating a new announcement.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Announcement
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Created
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Expires
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Reads
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {announcements.map(announcement => (
                            <tr key={announcement._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <div className="flex items-start space-x-4">
                                        <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                                            </svg>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-medium text-gray-900 truncate">
                                                {truncateText(announcement.title, 50)}
                                            </h4>
                                            <p className="text-sm text-gray-500 mt-1">
                                                {truncateText(announcement.content, 80)}
                                            </p>
                                            <div className="mt-2 text-xs text-gray-400">
                                                By {announcement.author?.username || 'Admin'}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="space-y-2">
                                        {getStatusBadge(announcement.isActive)}
                                        {getVisibilityBadge(announcement.visibility)}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{formatDate(announcement.createdAt)}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {announcement.expiresAt ? (
                                        <div>
                                            <div className="text-sm text-gray-900">{formatDate(announcement.expiresAt)}</div>
                                            {announcement.expiresTime && (
                                                <div className="text-xs text-gray-500">
                                                    at {formatTime(announcement.expiresTime)}
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <span className="text-sm text-gray-500">Never</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{announcement.totalReads || 0}</div>
                                    <div className="text-xs text-gray-500">total reads</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => onView(announcement)}
                                            className="text-primary-600 hover:text-primary-900 transition-colors duration-200"
                                            title="View Details"
                                        >
                                            View
                                        </button>
                                        <button
                                            onClick={() => onEdit(announcement)}
                                            className="text-indigo-600 hover:text-indigo-900 transition-colors duration-200"
                                            title="Edit Announcement"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => onDelete(announcement._id)}
                                            className="text-red-600 hover:text-red-900 transition-colors duration-200"
                                            title="Delete Announcement"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AnnouncementTable;
