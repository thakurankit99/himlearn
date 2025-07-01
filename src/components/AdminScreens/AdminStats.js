import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../Context/AuthContext';
import axios from 'axios';
import {
    MdPeople,
    MdAdminPanelSettings,
    MdArticle,
    MdComment,
    MdPersonAdd,
    MdRefresh,
    MdTrendingUp,
    MdNewReleases
} from 'react-icons/md';

const AdminStats = () => {
    const { config } = useContext(AuthContext);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get('/admin/stats', config);
            setStats(data.data);
            setError('');
        } catch (error) {
            setError('Failed to fetch statistics');
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading statistics...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
            </div>
        );
    }

    const statCards = [
        {
            title: 'Total Users',
            value: stats?.totalUsers || 0,
            icon: MdPeople,
            bgColor: 'bg-blue-500',
            textColor: 'text-blue-600',
            bgLight: 'bg-blue-50'
        },
        {
            title: 'Total Admins',
            value: stats?.totalAdmins || 0,
            icon: MdAdminPanelSettings,
            bgColor: 'bg-purple-500',
            textColor: 'text-purple-600',
            bgLight: 'bg-purple-50'
        },
        {
            title: 'Total Stories',
            value: stats?.totalStories || 0,
            icon: MdArticle,
            bgColor: 'bg-green-500',
            textColor: 'text-green-600',
            bgLight: 'bg-green-50'
        },
        {
            title: 'Total Comments',
            value: stats?.totalComments || 0,
            icon: MdComment,
            bgColor: 'bg-yellow-500',
            textColor: 'text-yellow-600',
            bgLight: 'bg-yellow-50'
        },
        {
            title: 'New Users (30 days)',
            value: stats?.recentUsers || 0,
            icon: MdTrendingUp,
            bgColor: 'bg-indigo-500',
            textColor: 'text-indigo-600',
            bgLight: 'bg-indigo-50'
        },
        {
            title: 'New Stories (30 days)',
            value: stats?.recentStories || 0,
            icon: MdNewReleases,
            bgColor: 'bg-pink-500',
            textColor: 'text-pink-600',
            bgLight: 'bg-pink-50'
        }
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Platform Overview</h2>
                    <p className="mt-1 text-gray-600">Monitor your platform's key metrics and performance</p>
                </div>
                <button
                    onClick={fetchStats}
                    className="btn-secondary flex items-center space-x-2"
                >
                    <MdRefresh className="w-4 h-4" />
                    <span>Refresh Data</span>
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {statCards.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div key={index} className="card p-6">
                            <div className="flex items-center">
                                <div className={`flex-shrink-0 p-3 rounded-lg ${stat.bgLight}`}>
                                    <Icon className={`w-6 h-6 ${stat.textColor}`} />
                                </div>
                                <div className="ml-4 flex-1">
                                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                                    <p className="text-2xl font-bold text-gray-900">{stat.value.toLocaleString()}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Quick Actions */}
            <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                        <MdPersonAdd className="w-8 h-8 text-primary-600 mb-2" />
                        <span className="text-sm font-medium text-gray-900">Add New User</span>
                    </button>

                    <button
                        className="flex flex-col items-center p-4 border border-gray-200 rounded-lg bg-gray-50 cursor-not-allowed opacity-60"
                        disabled
                    >
                        <MdArticle className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-sm font-medium text-gray-500">View Reports</span>
                        <span className="text-xs text-gray-400 mt-1">Coming Soon</span>
                    </button>

                    <button
                        className="flex flex-col items-center p-4 border border-gray-200 rounded-lg bg-gray-50 cursor-not-allowed opacity-60"
                        disabled
                    >
                        <MdAdminPanelSettings className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-sm font-medium text-gray-500">Platform Settings</span>
                        <span className="text-xs text-gray-400 mt-1">Coming Soon</span>
                    </button>

                    <button
                        className="flex flex-col items-center p-4 border border-gray-200 rounded-lg bg-gray-50 cursor-not-allowed opacity-60"
                        disabled
                    >
                        <MdComment className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-sm font-medium text-gray-500">Send Notifications</span>
                        <span className="text-xs text-gray-400 mt-1">Coming Soon</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminStats;
