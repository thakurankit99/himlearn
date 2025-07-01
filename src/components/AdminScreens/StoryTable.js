import React from 'react';

const StoryTable = ({ stories, loading, onView, onDelete, formatDate }) => {
    const truncateText = (text, maxLength = 100) => {
        if (!text) return '';
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    };

    const stripHtmlTags = (html) => {
        if (!html) return '';
        const tmp = document.createElement('div');
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || '';
    };

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                <div className="flex flex-col items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                    <p className="mt-4 text-gray-600">Loading stories...</p>
                </div>
            </div>
        );
    }

    if (stories.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                <div className="text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No stories found</h3>
                    <p className="mt-1 text-sm text-gray-500">Try adjusting your search criteria.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Story
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Author
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Published
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Engagement
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {stories.map(story => (
                            <tr key={story._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <div className="flex items-start space-x-4">
                                        <div className="flex-shrink-0">
                                            {story.image ? (
                                                <img
                                                    src={`/storyImages/${story.image}`}
                                                    alt={story.title}
                                                    className="h-16 w-16 rounded-lg object-cover"
                                                    onError={(e) => {
                                                        e.target.style.display = 'none';
                                                        e.target.nextSibling.style.display = 'flex';
                                                    }}
                                                />
                                            ) : null}
                                            <div
                                                className={`h-16 w-16 rounded-lg bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center ${story.image ? 'hidden' : 'flex'}`}
                                                style={{ display: story.image ? 'none' : 'flex' }}
                                            >
                                                <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-medium text-gray-900 truncate">
                                                {truncateText(story.title, 50)}
                                            </h4>
                                            <p className="text-sm text-gray-500 mt-1">
                                                {truncateText(stripHtmlTags(story.content), 80)}
                                            </p>
                                            <div className="mt-2">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                    {story.readtime} min read
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-8 w-8">
                                            {story.author?.photo ? (
                                                <img
                                                    src={`/userPhotos/${story.author.photo}`}
                                                    alt={story.author?.username}
                                                    className="h-8 w-8 rounded-full object-cover"
                                                    onError={(e) => {
                                                        e.target.style.display = 'none';
                                                        e.target.nextSibling.style.display = 'flex';
                                                    }}
                                                />
                                            ) : null}
                                            <div
                                                className={`h-8 w-8 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center text-white font-bold text-xs ${story.author?.photo ? 'hidden' : 'flex'}`}
                                                style={{ display: story.author?.photo ? 'none' : 'flex' }}
                                            >
                                                {story.author?.username ? story.author.username.charAt(0).toUpperCase() : 'U'}
                                            </div>
                                        </div>
                                        <div className="ml-3">
                                            <div className="text-sm font-medium text-gray-900">{story.author?.username}</div>
                                            <div className="text-sm text-gray-500">{story.author?.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{formatDate(story.createdAt)}</div>
                                    <div className="text-sm text-gray-500">ID: {story._id.slice(-6)}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex space-x-4">
                                        <div className="text-center">
                                            <div className="text-sm font-medium text-gray-900">{story.likeCount || 0}</div>
                                            <div className="text-xs text-gray-500">Likes</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-sm font-medium text-gray-900">{story.commentCount || 0}</div>
                                            <div className="text-xs text-gray-500">Comments</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => onView(story)}
                                            className="text-primary-600 hover:text-primary-900 transition-colors duration-200"
                                            title="View Story"
                                        >
                                            View
                                        </button>
                                        <button
                                            onClick={() => onDelete(story._id)}
                                            className="text-red-600 hover:text-red-900 transition-colors duration-200"
                                            title="Delete Story"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StoryTable;
