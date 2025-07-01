import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiBell, FiX } from 'react-icons/fi';
import { useAnnouncements } from '../../Context/AnnouncementContext';

const NotificationBell = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const { 
        announcements, 
        unreadCount, 
        markAsRead, 
        markAllAsRead 
    } = useAnnouncements();

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
    };



    const handleAnnouncementClick = (announcement) => {
        if (!announcement.isRead) {
            markAsRead(announcement._id);
        }
        setIsOpen(false);
    };

    const recentAnnouncements = announcements.slice(0, 5); // Show only 5 most recent

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Bell Icon */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-600 hover:text-purple-600 transition-colors duration-200 rounded-full hover:bg-gray-100"
            >
                <FiBell className="w-6 h-6" />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-500 rounded-full min-w-[18px] h-[18px] transform translate-x-1/3 -translate-y-1/3">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 max-h-96 overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
                        <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                        >
                            <FiX className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="max-h-80 overflow-y-auto">
                        {recentAnnouncements.length === 0 ? (
                            <div className="p-6 text-center">
                                <FiBell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-500">No announcements yet</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-100">
                                {recentAnnouncements.map((announcement) => (
                                    <div
                                        key={announcement._id}
                                        onClick={() => handleAnnouncementClick(announcement)}
                                        className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors duration-200 ${
                                            !announcement.isRead ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                                        }`}
                                    >
                                        <div className="flex items-start space-x-3">
                                            <div className="w-8 h-8 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                                <FiBell className="w-4 h-4 text-purple-600" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between">
                                                    <h4 className={`text-sm font-medium truncate ${
                                                        !announcement.isRead ? 'text-gray-900' : 'text-gray-700'
                                                    }`}>
                                                        {announcement.title}
                                                        {!announcement.isRead && (
                                                            <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                                New
                                                            </span>
                                                        )}
                                                    </h4>
                                                </div>
                                                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                                    {announcement.content.length > 80
                                                        ? announcement.content.substring(0, 80) + '...'
                                                        : announcement.content
                                                    }
                                                </p>
                                                <p className="text-xs text-gray-400 mt-2">
                                                    {formatDate(announcement.createdAt)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    {recentAnnouncements.length > 0 && (
                        <div className="p-3 border-t border-gray-200 bg-gray-50">
                            <div className="flex items-center justify-between">
                                <Link
                                    to="/announcements"
                                    onClick={() => setIsOpen(false)}
                                    className="text-sm text-purple-600 hover:text-purple-700 font-medium transition-colors duration-200"
                                >
                                    View All Announcements
                                </Link>
                                {unreadCount > 0 && (
                                    <button
                                        onClick={() => {
                                            markAllAsRead();
                                            setIsOpen(false);
                                        }}
                                        className="text-sm text-gray-600 hover:text-gray-700 transition-colors duration-200"
                                    >
                                        Mark All Read
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
