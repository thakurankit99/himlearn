import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import AdminStats from './AdminStats';
import UserManagement from './UserManagement';
import StoryManagement from './StoryManagement';
import AnnouncementManagement from './AnnouncementManagement';
import Loader from '../GeneralScreens/Loader';
import { MdDashboard, MdPeople, MdArticle, MdAnalytics, MdCampaign } from 'react-icons/md';

const AdminDashboard = () => {
    const { activeUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Wait for activeUser to be loaded
        if (activeUser && Object.keys(activeUser).length > 0) {
            // Check if user is admin
            if (activeUser.role !== 'admin') {
                navigate('/');
                return;
            }
            setLoading(false);
        }
    }, [activeUser, navigate]);

    // Show loading while waiting for user data
    if (!activeUser || Object.keys(activeUser).length === 0 || loading) {
        return <Loader />;
    }

    // Show access denied if not admin
    if (activeUser.role !== 'admin') {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
                    <p className="text-gray-600 mb-6">Admin privileges required to access this page.</p>
                    <button
                        onClick={() => navigate('/')}
                        className="btn-primary"
                    >
                        Go Back Home
                    </button>
                </div>
            </div>
        );
    }

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return <AdminStats />;
            case 'users':
                return <UserManagement />;
            case 'stories':
                return <StoryManagement />;
            case 'announcements':
                return <AnnouncementManagement />;
            default:
                return <AdminStats />;
        }
    };

    const tabs = [
        { id: 'dashboard', label: 'Dashboard', icon: MdDashboard, active: activeTab === 'dashboard' },
        { id: 'users', label: 'User Management', icon: MdPeople, active: activeTab === 'users' },
        { id: 'stories', label: 'Story Management', icon: MdArticle, active: activeTab === 'stories' },
        { id: 'announcements', label: 'Announcements', icon: MdCampaign, active: activeTab === 'announcements' },
        { id: 'analytics', label: 'Analytics', icon: MdAnalytics, disabled: true }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Admin Header Section */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="py-8">
                        <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
                        <p className="mt-2 text-gray-600">Manage your platform and monitor activity</p>
                    </div>
                </div>
            </div>

            {/* Admin Navigation Tabs */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <nav className="flex space-x-8" aria-label="Tabs">
                        {tabs.map(tab => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    className={`${
                                        tab.active
                                            ? 'border-primary-500 text-primary-600'
                                            : tab.disabled
                                            ? 'border-transparent text-gray-400 cursor-not-allowed'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors duration-200`}
                                    onClick={() => !tab.disabled && setActiveTab(tab.id)}
                                    disabled={tab.disabled}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span>{tab.label}</span>
                                    {tab.disabled && (
                                        <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                            Soon
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </nav>
                </div>
            </div>

            {/* Admin Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {renderContent()}
            </div>
        </div>
    );
};

export default AdminDashboard;
