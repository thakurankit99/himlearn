import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../Context/AuthContext';
import axios from 'axios';
import StoryTable from './StoryTable';
import StoryModal from './StoryModal';

const StoryManagement = () => {
    const { config } = useContext(AuthContext);
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [selectedStory, setSelectedStory] = useState(null);

    useEffect(() => {
        fetchStories();
    }, [currentPage, searchTerm]);

    const fetchStories = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(
                `/admin/stories?page=${currentPage}&search=${searchTerm}`,
                config
            );
            setStories(data.data);
            setTotalPages(data.pages);
            setError('');
        } catch (error) {
            setError('Failed to fetch stories');
            console.error('Error fetching stories:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const handleViewStory = (story) => {
        setSelectedStory(story);
        setShowModal(true);
    };

    const handleDeleteStory = async (storyId) => {
        if (!window.confirm('Are you sure you want to delete this story? This action cannot be undone and will also delete all comments.')) {
            return;
        }

        try {
            await axios.delete(`/admin/stories/${storyId}`, config);
            fetchStories(); // Refresh the list
            alert('Story deleted successfully');
        } catch (error) {
            alert('Failed to delete story');
            console.error('Error deleting story:', error);
        }
    };

    const handleModalClose = () => {
        setShowModal(false);
        setSelectedStory(null);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getStoryStats = () => {
        const totalStories = stories.length;
        const totalLikes = stories.reduce((sum, story) => sum + (story.likeCount || 0), 0);
        const totalComments = stories.reduce((sum, story) => sum + (story.commentCount || 0), 0);
        
        return { totalStories, totalLikes, totalComments };
    };

    const stats = getStoryStats();

    return (
        <div className="space-y-6">
            {/* Header Section with Stats */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Story Management</h2>
                        <p className="mt-1 text-gray-600">Manage platform content and monitor engagement</p>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-primary-600">{stats.totalStories}</div>
                            <div className="text-sm text-gray-500">Stories</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">{stats.totalLikes}</div>
                            <div className="text-sm text-gray-500">Total Likes</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">{stats.totalComments}</div>
                            <div className="text-sm text-gray-500">Comments</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search and Controls */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <label htmlFor="story-search" className="sr-only">Search stories</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <input
                                id="story-search"
                                type="text"
                                placeholder="Search stories by title..."
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

            <StoryTable
                stories={stories}
                loading={loading}
                onView={handleViewStory}
                onDelete={handleDeleteStory}
                formatDate={formatDate}
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
                <StoryModal
                    story={selectedStory}
                    onClose={handleModalClose}
                />
            )}
        </div>
    );
};

export default StoryManagement;
