import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

const AnnouncementContext = createContext();

export const useAnnouncements = () => {
    const context = useContext(AnnouncementContext);
    if (!context) {
        throw new Error('useAnnouncements must be used within AnnouncementProvider');
    }
    return context;
};

export const AnnouncementProvider = ({ children }) => {
    const [announcements, setAnnouncements] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const { activeUser, config } = useContext(AuthContext);

    // Fetch all announcements
    const fetchAnnouncements = async () => {
        try {
            setLoading(true);
            const requestConfig = localStorage.getItem("authToken") ? config : {};
            const { data } = await axios.get('/announcements', requestConfig);
            setAnnouncements(data.data);
        } catch (error) {
            console.error('Error fetching announcements:', error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch unread count
    const fetchUnreadCount = async () => {
        if (!activeUser || !activeUser._id) return;
        
        try {
            const { data } = await axios.get('/announcements/unread-count', config);
            setUnreadCount(data.count);
        } catch (error) {
            console.error('Error fetching unread count:', error);
        }
    };

    // Mark announcement as read
    const markAsRead = async (announcementId) => {
        if (!activeUser || !activeUser._id) return;
        
        try {
            await axios.post(`/announcements/${announcementId}/mark-read`, {}, config);
            
            // Update local state
            setAnnouncements(prev => 
                prev.map(announcement => 
                    announcement._id === announcementId 
                        ? { ...announcement, isRead: true }
                        : announcement
                )
            );
            
            // Update unread count
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Error marking announcement as read:', error);
        }
    };

    // Mark all announcements as read
    const markAllAsRead = async () => {
        if (!activeUser || !activeUser._id) return;
        
        try {
            await axios.post('/announcements/mark-all-read', {}, config);
            
            // Update local state
            setAnnouncements(prev => 
                prev.map(announcement => ({ ...announcement, isRead: true }))
            );
            
            // Reset unread count
            setUnreadCount(0);
        } catch (error) {
            console.error('Error marking all announcements as read:', error);
        }
    };

    // Get unread announcements
    const getUnreadAnnouncements = () => {
        return announcements.filter(announcement => !announcement.isRead);
    };

    // Initial fetch
    useEffect(() => {
        fetchAnnouncements();
    }, []);

    // Fetch unread count when user changes
    useEffect(() => {
        if (activeUser && activeUser._id) {
            fetchUnreadCount();
        } else {
            setUnreadCount(0);
        }
    }, [activeUser]);

    // Real-time updates - check every 30 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            fetchAnnouncements();
            if (activeUser && activeUser._id) {
                fetchUnreadCount();
            }
        }, 30 * 1000); // 30 seconds for real-time feel

        return () => clearInterval(interval);
    }, [activeUser]);

    // Also check when user becomes active (focus/visibility change)
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (!document.hidden) {
                fetchAnnouncements();
                if (activeUser && activeUser._id) {
                    fetchUnreadCount();
                }
            }
        };

        const handleFocus = () => {
            fetchAnnouncements();
            if (activeUser && activeUser._id) {
                fetchUnreadCount();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('focus', handleFocus);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('focus', handleFocus);
        };
    }, [activeUser]);

    const value = {
        announcements,
        unreadCount,
        loading,
        fetchAnnouncements,
        fetchUnreadCount,
        markAsRead,
        markAllAsRead,
        getUnreadAnnouncements
    };

    return (
        <AnnouncementContext.Provider value={value}>
            {children}
        </AnnouncementContext.Provider>
    );
};
