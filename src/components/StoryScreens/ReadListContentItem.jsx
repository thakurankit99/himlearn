import React from 'react';
import { Link } from 'react-router-dom';
import { BsThreeDots } from 'react-icons/bs';
import { getUserPhotoUrl, handleImageError } from '../../utils/imageUtils';

const ReadListContentItem = ({ story, editDate }) => {
    return (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md border border-white/20 overflow-hidden transition-all duration-300 hover:shadow-lg">
            <div className="flex flex-col md:flex-row">
                {/* Content Image */}
                <div className="md:w-1/4 relative">
                    <Link to={`/learning-content/${story.slug}`}>
                        {story.image ? (
                            <img 
                                src={story.image} 
                                alt={story.title} 
                                className="w-full h-48 md:h-full object-cover"
                                onError={(e) => handleImageError(e, 'content')}
                            />
                        ) : (
                            <div className="w-full h-48 md:h-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center">
                                <span className="text-white text-xl font-bold">
                                    {story.title.charAt(0)}
                                </span>
                            </div>
                        )}
                        <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                            {story.content_type || 'Article'}
                        </div>
                    </Link>
                </div>

                {/* Content Details */}
                <div className="p-6 md:w-3/4 flex flex-col justify-between">
                    <div>
                        <div className="flex justify-between items-start mb-3">
                            <Link to={`/learning-content/${story.slug}`} className="block">
                                <h3 className="text-xl font-bold text-gray-900 hover:text-purple-600 transition-colors duration-200 mb-2">
                                    {story.title}
                                </h3>
                            </Link>
                            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200">
                                <BsThreeDots className="w-5 h-5" />
                            </button>
                        </div>

                        <p className="text-gray-600 mb-4 line-clamp-2">
                            {story.description || story.content.substring(0, 150)}...
                        </p>

                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                </svg>
                                {story.viewsCount || 0}
                            </div>
                            <div className="flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                                </svg>
                                {story.likesCount || 0}
                            </div>
                            <div className="flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clipRule="evenodd" />
                                </svg>
                                {story.commentsCount || 0}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between mt-6">
                        <div className="flex items-center">
                            <Link to={`/profile/${story.author?.username}`} className="flex items-center">
                                {story.author?.photo ? (
                                    <img 
                                        src={getUserPhotoUrl(story.author.photo)} 
                                        alt={story.author.username} 
                                        className="w-8 h-8 rounded-full mr-3 object-cover"
                                        onError={(e) => handleImageError(e, 'user')}
                                    />
                                ) : (
                                    <div className="w-8 h-8 rounded-full mr-3 bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-sm">
                                        {story.author?.username?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                )}
                                <span className="text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors duration-200">
                                    {story.author?.username || 'Unknown Author'}
                                </span>
                            </Link>
                        </div>
                        <span className="text-sm text-gray-500">
                            {editDate ? editDate(story.createdAt) : new Date(story.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReadListContentItem; 