// Utility functions for handling image URLs

// Configuration for default images
// Note: These URLs are public Cloudinary URLs for default images and are safe to include
const CLOUDINARY_CONFIG = {
    cloudName: 'dmrwcy4v1', // This is a public identifier, not sensitive
    defaultUserImage: 'https://res.cloudinary.com/dmrwcy4v1/image/upload/v1751222751/himlearning/users/user.jpg',
    defaultStoryImage: 'https://res.cloudinary.com/dmrwcy4v1/image/upload/v1751222753/himlearning/stories/default.jpg'
};

/**
 * Get the correct image URL for user photos
 * Handles both old local paths and new Cloudinary URLs
 */
export const getUserPhotoUrl = (photo) => {
    if (!photo) {
        // Default Cloudinary user photo
        return CLOUDINARY_CONFIG.defaultUserImage;
    }

    // If it's already a full URL (Cloudinary), return as is
    if (photo.startsWith('http://') || photo.startsWith('https://')) {
        return photo;
    }

    // If it's a local filename, construct the local URL
    return `/userPhotos/${photo}`;
};

/**
 * Get the correct image URL for story images
 * Handles both old local paths and new Cloudinary URLs
 */
export const getStoryImageUrl = (image) => {
    if (!image) {
        // Default Cloudinary story image
        return CLOUDINARY_CONFIG.defaultStoryImage;
    }

    // If it's already a full URL (Cloudinary), return as is
    if (image.startsWith('http://') || image.startsWith('https://')) {
        return image;
    }

    // If it's a local filename, construct the local URL
    return `/storyImages/${image}`;
};

/**
 * Get fallback image URL for user photos
 */
export const getUserPhotoFallback = () => {
    return CLOUDINARY_CONFIG.defaultUserImage;
};

/**
 * Get fallback image URL for story images
 */
export const getStoryImageFallback = () => {
    return CLOUDINARY_CONFIG.defaultStoryImage;
};

/**
 * Handle image error by setting fallback URL
 */
export const handleImageError = (e, type = 'user') => {
    if (type === 'user') {
        e.target.src = getUserPhotoFallback();
    } else if (type === 'story') {
        e.target.src = getStoryImageFallback();
    }
};

/**
 * Check if a URL is a video
 */
export const isVideoUrl = (url) => {
    if (!url) return false;
    return url.includes('/video/upload/') ||
           url.includes('resource_type=video') ||
           url.toLowerCase().match(/\.(mp4|mov|avi|webm|mkv)$/);
};

/**
 * Get video thumbnail URL from Cloudinary video URL
 */
export const getVideoThumbnail = (videoUrl) => {
    if (!videoUrl || !videoUrl.includes('cloudinary')) return null;

    try {
        // Replace video upload with image upload and add .jpg extension
        return videoUrl
            .replace('/video/upload/', '/image/upload/')
            .replace(/\.(mp4|mov|avi|webm|mkv)$/, '.jpg');
    } catch (error) {
        console.error('Error generating video thumbnail:', error);
        return getStoryImageFallback();
    }
};

/**
 * Format video duration from seconds to readable format
 */
export const formatVideoDuration = (seconds) => {
    if (!seconds || seconds === 0) return '0:00';

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

/**
 * Get media display info (for both images and videos)
 */
export const getMediaDisplayInfo = (story) => {
    const isVideo = story.mediaType === 'video' || isVideoUrl(story.image);

    return {
        isVideo,
        displayUrl: isVideo ? (story.videoThumbnail || getVideoThumbnail(story.image) || story.image) : getStoryImageUrl(story.image),
        videoUrl: isVideo ? story.image : null,
        duration: isVideo ? story.videoDuration : null,
        formattedDuration: isVideo ? formatVideoDuration(story.videoDuration) : null
    };
};
