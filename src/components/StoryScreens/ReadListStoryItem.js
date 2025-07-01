import React from 'react'
import { Link } from 'react-router-dom'
import { AiFillStar } from 'react-icons/ai'
import { BsThreeDots, BsBookmarkFill } from 'react-icons/bs'

const ReadListContentItem = ({ story, editDate }) => {

    const truncateContent = (text) => {
        // Remove HTML tags and truncate
        const textContent = text.replace(/<[^>]*>/g, '');
        const trimmedString = textContent.substr(0, 150);
        return trimmedString
    }

    const handleImageError = (e) => {
        // Hide the image and show a placeholder
        e.target.style.display = 'none';
        const placeholder = e.target.nextSibling;
        if (placeholder) {
            placeholder.style.display = 'flex';
        }
    }

    return (
        <article className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-white/20 overflow-hidden">
            <div className="flex flex-col md:flex-row">
                {/* Content Section */}
                <div className="flex-1 p-6 md:p-8">
                    {/* Author and Meta Info */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                                <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full flex items-center justify-center text-white font-bold text-xs">
                                    {story.author.username.charAt(0).toUpperCase()}
                                </div>
                                <span className="font-medium">{story.author.username}</span>
                                <span className="text-gray-400">•</span>
                                <span>{editDate(story.createdAt)}</span>
                                <AiFillStar className="w-4 h-4 text-yellow-500 ml-2" />
                            </div>
                        </div>

                        <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200 rounded-full hover:bg-gray-100">
                            <BsThreeDots className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Content Title */}
                    <Link to={`/learning-content/${story.slug}`} className="block group-hover:text-purple-600 transition-colors duration-200">
                        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 line-clamp-2 leading-tight">
                            {story.title}
                        </h2>
                    </Link>

                    {/* Content Preview */}
                    <p className="text-gray-600 text-base leading-relaxed mb-6 line-clamp-3">
                        {truncateContent(story.content)}...
                    </p>

                    {/* Bottom Actions */}
                    <div className="flex items-center justify-between">
                        <Link
                            to={`/learning-content/${story.slug}`}
                            className="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium text-sm transition-colors duration-200"
                        >
                            <span>Read More</span>
                            <span className="mx-2">•</span>
                            <span>{story.readtime} min read</span>
                            <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </Link>

                        <div className="flex items-center space-x-3">
                            <button className="p-2 text-purple-600 hover:text-purple-700 transition-colors duration-200 rounded-full hover:bg-purple-50">
                                <BsBookmarkFill className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Image Section */}
                <div className="md:w-64 md:flex-shrink-0">
                    <div className="h-48 md:h-full relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                        {story.image && (
                            <img
                                src={`/storyImages/${story.image}`}
                                alt={story.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                onError={handleImageError}
                            />
                        )}

                        {/* Fallback placeholder */}
                        <div
                            className={`w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-blue-100 ${story.image ? 'hidden' : 'flex'}`}
                            style={{ display: story.image ? 'none' : 'flex' }}
                        >
                            <div className="text-center">
                                <svg className="w-16 h-16 text-purple-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <p className="text-purple-600 text-sm font-medium">Learning Content Image</p>
                            </div>
                        </div>

                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                        {/* Read Time Badge */}
                        <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm text-gray-800 text-xs px-3 py-1 rounded-full font-medium shadow-lg">
                            <svg className="w-3 h-3 inline mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                            </svg>
                            {story.readtime} min
                        </div>
                    </div>
                </div>
            </div>
        </article>
    )
}

export default ReadListContentItem