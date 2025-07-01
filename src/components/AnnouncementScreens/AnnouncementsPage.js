import React, { useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiBell, FiClock, FiUser, FiCheckCircle } from 'react-icons/fi';
import { useAnnouncements } from '../../Context/AnnouncementContext';
import { AuthContext } from '../../Context/AuthContext';
import Loader from '../GeneralScreens/Loader';

const AnnouncementsPage = () => {
    const {
        announcements,
        loading,
        markAsRead,
        markAllAsRead,
        unreadCount
    } = useAnnouncements();
    const { activeUser } = useContext(AuthContext);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
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

    const handleAnnouncementClick = (announcement) => {
        if (activeUser && !announcement.isRead) {
            markAsRead(announcement._id);
        }
    };

    if (loading) {
        return <Loader />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 left-0 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
                <div className="absolute top-0 right-0 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
            </div>

            <div className="relative max-w-4xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <Link 
                        to="/" 
                        className="inline-flex items-center px-4 py-2 text-gray-600 hover:text-purple-600 transition-colors duration-200 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm hover:shadow-md"
                    >
                        <FiArrowLeft className="w-5 h-5 mr-2" />
                        Back to Home
                    </Link>
                    
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center">
                            <FiBell className="w-8 h-8 mr-3 text-purple-600" />
                            Announcements
                        </h1>
                        <p className="text-gray-600">Stay updated with the latest news and updates</p>
                    </div>
                    
                    <div className="w-32"></div> {/* Spacer for centering */}
                </div>

                {/* Actions Bar */}
                {activeUser && unreadCount > 0 && (
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-4 mb-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <div className="w-3 h-3 bg-red-500 rounded-full mr-3 animate-pulse"></div>
                                <span className="text-gray-700 font-medium">
                                    You have {unreadCount} unread announcement{unreadCount !== 1 ? 's' : ''}
                                </span>
                            </div>
                            <button
                                onClick={markAllAsRead}
                                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 transform hover:scale-105"
                            >
                                <FiCheckCircle className="w-4 h-4 mr-2" />
                                Mark All Read
                            </button>
                        </div>
                    </div>
                )}

                {/* Announcements List */}
                <div className="space-y-6">
                    {announcements.length === 0 ? (
                        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-16 text-center">
                            <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <FiBell className="w-12 h-12 text-purple-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">No Announcements</h3>
                            <p className="text-gray-600 max-w-md mx-auto">
                                There are no announcements at the moment. Check back later for updates and news.
                            </p>
                        </div>
                    ) : (
                        announcements.map((announcement) => (
                            <div
                                key={announcement._id}
                                onClick={() => handleAnnouncementClick(announcement)}
                                className={`group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-white/20 overflow-hidden cursor-pointer ${
                                    !announcement.isRead && activeUser ? 'ring-2 ring-purple-300' : ''
                                }`}
                            >
                                {/* New Announcement Banner */}
                                {!announcement.isRead && activeUser && (
                                    <div className="h-2 bg-gradient-to-r from-purple-500 to-blue-500"></div>
                                )}

                                <div className="p-6">
                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center">
                                                <FiBell className="w-6 h-6 text-purple-600" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                                                    {announcement.title}
                                                    {!announcement.isRead && activeUser && (
                                                        <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                            New
                                                        </span>
                                                    )}
                                                </h3>
                                                <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                                                    <div className="flex items-center">
                                                        <FiUser className="w-4 h-4 mr-1" />
                                                        {announcement.author?.username || 'Admin'}
                                                    </div>
                                                    <div className="flex items-center">
                                                        <FiClock className="w-4 h-4 mr-1" />
                                                        {formatDate(announcement.createdAt)}
                                                    </div>
                                                    {activeUser && activeUser.role === 'admin' && (
                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                            announcement.visibility === 'public' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                                                        }`}>
                                                            {announcement.visibility === 'public' ? 'Public' : 'Users Only'}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="text-gray-700 leading-relaxed">
                                        {announcement.content}
                                    </div>

                                    {/* Expiration Notice */}
                                    {announcement.expiresAt && (
                                        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                            <p className="text-sm text-yellow-800">
                                                <FiClock className="w-4 h-4 inline mr-1" />
                                                This announcement expires on {new Date(announcement.expiresAt).toLocaleDateString()}
                                                {announcement.expiresTime && ` at ${formatTime(announcement.expiresTime)}`}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default AnnouncementsPage;
