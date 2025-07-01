import React, { useContext } from 'react';
import { getUserPhotoUrl, handleImageError } from '../../utils/imageUtils';
import { AuthContext } from '../../Context/AuthContext';

const UserTable = ({ users, loading, onEdit, onView, onDelete }) => {
    const { activeUser } = useContext(AuthContext);
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getRoleBadge = (role) => {
        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                role === 'admin'
                    ? 'bg-purple-100 text-purple-800'
                    : 'bg-gray-100 text-gray-800'
            }`}>
                {role === 'admin' ? 'Admin' : 'User'}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                <div className="flex flex-col items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                    <p className="mt-4 text-gray-600">Loading users...</p>
                </div>
            </div>
        );
    }

    if (users.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                <div className="text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
                    <p className="mt-1 text-sm text-gray-500">Try adjusting your search criteria.</p>
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
                                User
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Email
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Role
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Joined
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Reading List
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {users.map(user => (
                            <tr key={user._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10">
                                            <img
                                                src={getUserPhotoUrl(user.photo)}
                                                alt={user.username}
                                                className="h-10 w-10 rounded-full object-cover"
                                                onError={(e) => handleImageError(e, 'user')}
                                            />
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">{user.username}</div>
                                            <div className="text-sm text-gray-500">ID: {user._id.slice(-6)}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{user.email}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {getRoleBadge(user.role)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {formatDate(user.createdAt)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {user.readListLength || 0} stories
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div className="flex space-x-2">
                                        {user._id === activeUser._id ? (
                                            // Current admin user - show disabled state
                                            <>
                                                <span className="text-gray-400 cursor-not-allowed" title="Cannot view your own account">
                                                    View
                                                </span>
                                                <span className="text-gray-400 cursor-not-allowed" title="Cannot edit your own account">
                                                    Edit
                                                </span>
                                                <span className="text-gray-400 cursor-not-allowed" title="Cannot delete your own account">
                                                    Delete
                                                </span>
                                                <div className="ml-2">
                                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                                        </svg>
                                                        You
                                                    </span>
                                                </div>
                                            </>
                                        ) : (
                                            // Other users - show normal actions
                                            <>
                                                <button
                                                    onClick={() => onView(user)}
                                                    className="text-primary-600 hover:text-primary-900 transition-colors duration-200"
                                                    title="View Details"
                                                >
                                                    View
                                                </button>
                                                <button
                                                    onClick={() => onEdit(user)}
                                                    className="text-indigo-600 hover:text-indigo-900 transition-colors duration-200"
                                                    title="Edit User"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => onDelete(user._id)}
                                                    className="text-red-600 hover:text-red-900 transition-colors duration-200"
                                                    title="Delete User"
                                                >
                                                    Delete
                                                </button>
                                            </>
                                        )}
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

export default UserTable;
