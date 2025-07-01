import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../Context/AuthContext';
import axios from 'axios';

const StoryModal = ({ story, onClose }) => {
    const { config } = useContext(AuthContext);
    const [storyDetails, setStoryDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (story) {
            fetchStoryDetails(story._id);
        }
    }, [story]);

    const fetchStoryDetails = async (storyId) => {
        try {
            setLoading(true);
            const { data } = await axios.get(`/admin/stories/${storyId}`, config);
            setStoryDetails(data.data);
        } catch (error) {
            setError('Failed to fetch story details');
        } finally {
            setLoading(false);
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

    const stripHtmlTags = (html) => {
        if (!html) return '';
        const tmp = document.createElement('div');
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || '';
    };

    const truncateContent = (content, maxLength = 500) => {
        const plainText = stripHtmlTags(content);
        return plainText.length > maxLength ? plainText.substring(0, maxLength) + '...' : plainText;
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-10 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-lg bg-white max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h3 className="text-xl font-semibold text-gray-900">Story Details</h3>
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
                        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
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

                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                            <span className="ml-3 text-gray-600">Loading story details...</span>
                        </div>
                    ) : storyDetails ? (
                        <div className="space-y-8">
                            {/* Story Header */}
                            <div className="bg-gray-50 rounded-lg p-6">
                                <div className="flex flex-col lg:flex-row gap-6">
                                    <div className="flex-shrink-0">
                                        {storyDetails.image ? (
                                            <img
                                                src={`/storyImages/${storyDetails.image}`}
                                                alt={storyDetails.title}
                                                className="w-full lg:w-48 h-32 lg:h-32 object-cover rounded-lg shadow-sm"
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    e.target.nextSibling.style.display = 'flex';
                                                }}
                                            />
                                        ) : null}
                                        <div
                                            className={`w-full lg:w-48 h-32 lg:h-32 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg shadow-sm flex items-center justify-center ${storyDetails.image ? 'hidden' : 'flex'}`}
                                            style={{ display: storyDetails.image ? 'none' : 'flex' }}
                                        >
                                            <div className="text-center">
                                                <svg className="w-12 h-12 text-purple-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <p className="text-purple-600 text-sm font-medium">No Image</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <h2 className="text-2xl font-bold text-gray-900 mb-3">{storyDetails.title}</h2>
                                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                            <div className="flex items-center">
                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                {storyDetails.readtime} min read
                                            </div>
                                            <div className="flex items-center">
                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                Published {formatDate(storyDetails.createdAt)}
                                            </div>
                                            {storyDetails.privacy && (
                                                <div className="flex items-center">
                                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                    </svg>
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                        storyDetails.privacy === 'public' ? 'bg-green-100 text-green-800' :
                                                        storyDetails.privacy === 'user' ? 'bg-blue-100 text-blue-800' :
                                                        'bg-red-100 text-red-800'
                                                    }`}>
                                                        {storyDetails.privacy === 'public' ? 'Public' :
                                                         storyDetails.privacy === 'user' ? 'Users Only' : 'Private'}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Author Info */}
                            <div className="bg-white border border-gray-200 rounded-lg p-6">
                                <h4 className="text-lg font-semibold text-gray-900 mb-4">Author Information</h4>
                                <div className="flex items-center space-x-4">
                                    <div className="flex-shrink-0">
                                        {storyDetails.author?.photo ? (
                                            <img
                                                src={`/userPhotos/${storyDetails.author.photo}`}
                                                alt={storyDetails.author?.username}
                                                className="h-12 w-12 rounded-full object-cover"
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    e.target.nextSibling.style.display = 'flex';
                                                }}
                                            />
                                        ) : null}
                                        <div
                                            className={`h-12 w-12 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center text-white font-bold text-lg ${storyDetails.author?.photo ? 'hidden' : 'flex'}`}
                                            style={{ display: storyDetails.author?.photo ? 'none' : 'flex' }}
                                        >
                                            {storyDetails.author?.username ? storyDetails.author.username.charAt(0).toUpperCase() : 'U'}
                                        </div>
                                    </div>
                                    <div>
                                        <h5 className="text-sm font-medium text-gray-900">{storyDetails.author?.username}</h5>
                                        <p className="text-sm text-gray-500">{storyDetails.author?.email}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Story Stats */}
                            <div className="bg-white border border-gray-200 rounded-lg p-6">
                                <h4 className="text-lg font-semibold text-gray-900 mb-4">Engagement Statistics</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="bg-blue-50 rounded-lg p-4 text-center">
                                        <div className="text-2xl font-bold text-blue-600">{storyDetails.likeCount || 0}</div>
                                        <div className="text-sm text-blue-800">Likes</div>
                                    </div>
                                    <div className="bg-green-50 rounded-lg p-4 text-center">
                                        <div className="text-2xl font-bold text-green-600">{storyDetails.commentCount || 0}</div>
                                        <div className="text-sm text-green-800">Comments</div>
                                    </div>
                                    <div className="bg-purple-50 rounded-lg p-4 text-center">
                                        <div className="text-2xl font-bold text-purple-600">{storyDetails.comments?.length || 0}</div>
                                        <div className="text-sm text-purple-800">Total Comments</div>
                                    </div>
                                </div>
                            </div>

                            {/* Story Content Preview */}
                            <div className="bg-white border border-gray-200 rounded-lg p-6">
                                <h4 className="text-lg font-semibold text-gray-900 mb-4">Content Preview</h4>
                                <div className="prose max-w-none">
                                    <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                        {truncateContent(storyDetails.content, 800)}
                                    </div>
                                    {stripHtmlTags(storyDetails.content).length > 800 && (
                                        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                            <p className="text-sm text-yellow-800">
                                                <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                Content truncated for preview. Full content is {stripHtmlTags(storyDetails.content).length} characters.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Technical Details */}
                            <div className="bg-white border border-gray-200 rounded-lg p-6">
                                <h4 className="text-lg font-semibold text-gray-900 mb-4">Technical Information</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Story ID</label>
                                        <p className="text-sm text-gray-900 font-mono bg-gray-50 p-2 rounded border">
                                            {storyDetails._id}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Content Length</label>
                                        <p className="text-sm text-gray-900">
                                            {stripHtmlTags(storyDetails.content).length.toLocaleString()} characters
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Created</label>
                                        <p className="text-sm text-gray-900">{formatDate(storyDetails.createdAt)}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Last Updated</label>
                                        <p className="text-sm text-gray-900">{formatDate(storyDetails.updatedAt)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <div className="text-red-600">Failed to load story details</div>
                        </div>
                    )}
                </div>

                <div className="flex justify-between items-center p-6 border-t border-gray-200">
                    <div>
                        {storyDetails && (
                            <a
                                href={`/story/${storyDetails.slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center px-4 py-2 border border-primary-300 text-sm font-medium rounded-lg text-primary-700 bg-primary-50 hover:bg-primary-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors duration-200"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                                View Full Story
                            </a>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StoryModal;
