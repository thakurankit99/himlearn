import React from 'react'

const NoContent = () => {
    return (
        <div className="text-center py-10">
            <div className="mb-4">
                <svg className="w-16 h-16 text-gray-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-700 mb-2">No Learning Content Found</h2>
            <p className="text-gray-500">Try adjusting your search or filters to find what you're looking for.</p>
        </div>
    )
}

export default NoContent
