import React from 'react';
import { Link } from 'react-router-dom';
import '../../Css/Privacy.css';
import { getUserPhotoUrl, getStoryImageUrl, handleImageError, getMediaDisplayInfo } from '../../utils/imageUtils';

const Story = ({ story }) => {

    const editDate = (createdAt) => {
        const d = new Date(createdAt);
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return `${d.getDate()} ${monthNames[d.getMonth()]}, ${d.getFullYear()}`;
    }

    const mediaInfo = getMediaDisplayInfo(story);

    const truncateContent = (content) => {
        if (!content) return "No content available";
        // Remove HTML tags and get plain text
        const plainText = content.replace(/<[^>]*>/g, '').trim();
        if (plainText.length === 0) return "No content available";
        const trimmedString = plainText.substr(0, 120);
        return trimmedString;
    }

    const truncateTitle = (title) => {
        const trimmedString = title.substr(0, 60);
        return trimmedString;
    }

    const getPrivacyBadge = (privacy) => {
        switch(privacy) {
            case 'private':
                return (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200 shadow-sm">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                        Private
                    </span>
                );
            case 'user':
                return (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200 shadow-sm">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                        </svg>
                        Members
                    </span>
                );
            case 'public':
            default:
                return (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200 shadow-sm">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" />
                        </svg>
                        Public
                    </span>
                );
        }
    }



    // Generate a consistent gradient based on story ID
    const getGradientClass = (storyId) => {
        const gradients = [
            'from-purple-50 to-blue-50 border-purple-200/30',
            'from-green-50 to-teal-50 border-green-200/30',
            'from-pink-50 to-rose-50 border-pink-200/30',
            'from-orange-50 to-amber-50 border-orange-200/30',
            'from-indigo-50 to-purple-50 border-indigo-200/30',
            'from-cyan-50 to-blue-50 border-cyan-200/30',
            'from-emerald-50 to-green-50 border-emerald-200/30',
            'from-violet-50 to-purple-50 border-violet-200/30'
        ];

        // Use story ID to consistently pick the same gradient
        const hash = storyId.split('').reduce((a, b) => {
            a = ((a << 5) - a) + b.charCodeAt(0);
            return a & a;
        }, 0);

        return gradients[Math.abs(hash) % gradients.length];
    };

    const gradientClass = getGradientClass(story._id);

    return (
        <article className={`group bg-gradient-to-br ${gradientClass} rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 overflow-hidden border cursor-pointer h-[480px] flex flex-col`}>
            <Link to={`/learning-content/${story.slug}`} className="block h-full flex flex-col">
                {/* Story Media Container */}
                <div className="relative overflow-hidden flex-shrink-0">
                    {/* Privacy and Paid Badges */}
                    <div className="absolute top-4 right-4 z-20 space-y-2">
                        {getPrivacyBadge(story.privacy)}
                        {story.isPaid && (
                            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center space-x-1">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.51-1.31c-.562-.649-1.413-1.076-2.353-1.253V5z" clipRule="evenodd" />
                                </svg>
                                <span>₹{story.price}</span>
                            </div>
                        )}
                    </div>

                    {/* Story Media */}
                    <div className="relative overflow-hidden h-48">
                        <img
                            className={`w-full h-full group-hover:scale-110 transition-transform duration-700 ${
                                mediaInfo.isVideo ? 'object-contain bg-gradient-to-br from-gray-900 to-gray-800' : 'object-cover'
                            }`}
                            src={mediaInfo.displayUrl}
                            alt={story.title}
                            onError={(e) => handleImageError(e, 'story')}
                        />

                        {/* Gradient Overlay for better text readability */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>

                        {/* Video Indicator */}
                        {mediaInfo.isVideo && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-all duration-300">
                                <div className="bg-white/95 backdrop-blur-sm rounded-full p-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                    <svg className="w-8 h-8 text-gray-800" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M8 5v14l11-7z"/>
                                    </svg>
                                </div>

                                {/* Video Type Badge */}
                                <div className="absolute top-4 left-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm px-3 py-1 rounded-full flex items-center gap-2 shadow-lg">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M17 10.5V7a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h12a1 1 0 001-1v-3.5l4 4v-11l-4 4z"/>
                                    </svg>
                                    Video
                                </div>

                                {/* Duration Badge */}
                                {mediaInfo.formattedDuration && (
                                    <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-sm text-white text-sm px-3 py-1 rounded-full font-medium">
                                        <svg className="w-4 h-4 inline mr-1" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                        </svg>
                                        {mediaInfo.formattedDuration}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Read Time Badge */}
                        <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm text-gray-800 text-sm px-3 py-1 rounded-full font-medium shadow-lg">
                            <svg className="w-4 h-4 inline mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                            </svg>
                            {story.readtime} min
                        </div>
                    </div>
                </div>

                {/* Story Content */}
                <div className="p-6 flex flex-col flex-1">
                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-blue-600 transition-all duration-300 leading-tight">
                        {story.title.length > 60 ? truncateTitle(story.title) + "..." : story.title}
                    </h3>

                    {/* Content Preview */}
                    <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3 flex-grow">
                        {truncateContent(story.content)}{story.content && story.content.length > 120 ? '...' : ''}
                    </p>

                    {/* Author Info */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                            <div className="relative">
                                {story.author?.photo ? (
                                    <img
                                        src={getUserPhotoUrl(story.author.photo)}
                                        alt={story.author?.username || 'Anonymous'}
                                        className="w-10 h-10 rounded-full object-cover ring-2 ring-white/50 group-hover:ring-white/80 transition-all duration-300 shadow-lg"
                                        onError={(e) => handleImageError(e, 'user')}
                                    />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-sm ring-2 ring-white/50 group-hover:ring-white/80 transition-all duration-300 shadow-lg">
                                        {story.author?.username ? story.author.username.charAt(0).toUpperCase() : 'A'}
                                    </div>
                                )}
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full border-2 border-white shadow-sm"></div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-900 truncate">
                                    {story.author?.username || 'Anonymous'}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {editDate(story.createdAt)}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Story Stats */}
                    <div className="flex items-center justify-between pt-4 border-t border-white/30 mt-auto">
                        <div className="flex items-center space-x-4">
                            <span className="flex items-center space-x-1 text-gray-600 hover:text-red-500 transition-colors duration-200">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                                </svg>
                                <span className="text-sm font-semibold">{story.likeCount}</span>
                            </span>

                            <span className="flex items-center space-x-1 text-gray-600 hover:text-blue-500 transition-colors duration-200">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                                </svg>
                                <span className="text-sm font-semibold">{story.commentCount}</span>
                            </span>
                        </div>

                        {/* Read Time Badge */}
                        <div className="flex items-center">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white/70 backdrop-blur-sm text-purple-700 shadow-sm border border-white/40">
                                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                </svg>
                                {story.readtime} min read
                            </span>
                        </div>
                    </div>
                </div>
            </Link>
        </article>
    )
}

export default Story;
