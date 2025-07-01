import React, { useState, useRef, useEffect } from 'react';
import '../../Css/VideoPlayer.css';

const VideoPlayer = ({ 
    videoUrl, 
    thumbnailUrl, 
    className = '', 
    autoPlay = false, 
    controls = true,
    muted = false,
    loop = false,
    width = '100%',
    height = 'auto'
}) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [showControls, setShowControls] = useState(true);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(muted);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showThumbnail, setShowThumbnail] = useState(true);
    const [isPortrait, setIsPortrait] = useState(false);
    const [videoDimensions, setVideoDimensions] = useState({ width: 0, height: 0 });

    const videoRef = useRef(null);
    const containerRef = useRef(null);
    const controlsTimeoutRef = useRef(null);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const handleLoadedMetadata = () => {
            setDuration(video.duration);

            // Detect video dimensions and orientation
            const videoWidth = video.videoWidth;
            const videoHeight = video.videoHeight;
            setVideoDimensions({ width: videoWidth, height: videoHeight });

            // Check if video is portrait (height > width)
            setIsPortrait(videoHeight > videoWidth);
        };

        const handleTimeUpdate = () => {
            setCurrentTime(video.currentTime);
        };

        const handlePlay = () => {
            setIsPlaying(true);
            setShowThumbnail(false);
        };

        const handlePause = () => {
            setIsPlaying(false);
        };

        const handleEnded = () => {
            setIsPlaying(false);
            setShowThumbnail(true);
        };

        video.addEventListener('loadedmetadata', handleLoadedMetadata);
        video.addEventListener('timeupdate', handleTimeUpdate);
        video.addEventListener('play', handlePlay);
        video.addEventListener('pause', handlePause);
        video.addEventListener('ended', handleEnded);

        return () => {
            video.removeEventListener('loadedmetadata', handleLoadedMetadata);
            video.removeEventListener('timeupdate', handleTimeUpdate);
            video.removeEventListener('play', handlePlay);
            video.removeEventListener('pause', handlePause);
            video.removeEventListener('ended', handleEnded);
        };
    }, []);

    const togglePlay = () => {
        const video = videoRef.current;
        if (!video) return;

        if (isPlaying) {
            video.pause();
        } else {
            video.play();
        }
    };

    const handleSeek = (e) => {
        const video = videoRef.current;
        if (!video) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        video.currentTime = pos * duration;
    };

    const handleVolumeChange = (e) => {
        const video = videoRef.current;
        const newVolume = parseFloat(e.target.value);
        
        setVolume(newVolume);
        setIsMuted(newVolume === 0);
        
        if (video) {
            video.volume = newVolume;
            video.muted = newVolume === 0;
        }
    };

    const toggleMute = () => {
        const video = videoRef.current;
        if (!video) return;

        const newMuted = !isMuted;
        setIsMuted(newMuted);
        video.muted = newMuted;
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const handleMouseMove = () => {
        setShowControls(true);
        
        if (controlsTimeoutRef.current) {
            clearTimeout(controlsTimeoutRef.current);
        }
        
        controlsTimeoutRef.current = setTimeout(() => {
            if (isPlaying) {
                setShowControls(false);
            }
        }, 3000);
    };

    const handleThumbnailClick = () => {
        setShowThumbnail(false);
        togglePlay();
    };

    const toggleFullscreen = async () => {
        const container = containerRef.current;
        if (!container) return;

        try {
            if (!isFullscreen) {
                // Enter fullscreen
                if (container.requestFullscreen) {
                    await container.requestFullscreen();
                } else if (container.webkitRequestFullscreen) {
                    await container.webkitRequestFullscreen();
                } else if (container.mozRequestFullScreen) {
                    await container.mozRequestFullScreen();
                } else if (container.msRequestFullscreen) {
                    await container.msRequestFullscreen();
                }
            } else {
                // Exit fullscreen
                if (document.exitFullscreen) {
                    await document.exitFullscreen();
                } else if (document.webkitExitFullscreen) {
                    await document.webkitExitFullscreen();
                } else if (document.mozCancelFullScreen) {
                    await document.mozCancelFullScreen();
                } else if (document.msExitFullscreen) {
                    await document.msExitFullscreen();
                }
            }
        } catch (error) {
            console.error('Fullscreen error:', error);
        }
    };

    // Listen for fullscreen changes
    useEffect(() => {
        const handleFullscreenChange = () => {
            const isCurrentlyFullscreen = !!(
                document.fullscreenElement ||
                document.webkitFullscreenElement ||
                document.mozFullScreenElement ||
                document.msFullscreenElement
            );
            setIsFullscreen(isCurrentlyFullscreen);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
        document.addEventListener('mozfullscreenchange', handleFullscreenChange);
        document.addEventListener('MSFullscreenChange', handleFullscreenChange);

        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
            document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
            document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
            document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
        };
    }, []);

    // Dynamic styling based on video orientation and fullscreen state
    const getContainerStyle = () => {
        if (isFullscreen) {
            return {
                width: '100vw',
                height: '100vh',
                maxWidth: 'none',
                maxHeight: 'none'
            };
        }

        if (isPortrait && !isFullscreen) {
            // For portrait videos, limit height and center
            return {
                width: width,
                height: height === 'auto' ? '500px' : height,
                maxHeight: '500px',
                margin: '0 auto'
            };
        }

        return { width, height };
    };

    const getVideoStyle = () => {
        if (isFullscreen && isPortrait) {
            // In fullscreen, portrait videos should fit screen height
            return {
                width: 'auto',
                height: '100%',
                maxWidth: '100vw',
                objectFit: 'contain'
            };
        }

        if (isPortrait && !isFullscreen) {
            // Portrait videos should be contained within reasonable bounds
            return {
                width: '100%',
                height: '100%',
                objectFit: 'contain'
            };
        }

        return {};
    };

    return (
        <div
            ref={containerRef}
            className={`relative bg-black rounded-lg overflow-hidden ${className} ${
                isFullscreen ? 'fixed inset-0 z-50 rounded-none' : ''
            } ${isPortrait ? 'portrait-video' : 'landscape-video'}`}
            style={getContainerStyle()}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => isPlaying && setShowControls(false)}
        >
            {/* Video Element */}
            <video
                ref={videoRef}
                className={`w-full h-full ${isPortrait ? 'object-contain' : 'object-cover'}`}
                style={getVideoStyle()}
                src={videoUrl}
                autoPlay={autoPlay}
                muted={muted}
                loop={loop}
                playsInline
                preload="metadata"
            />

            {/* Thumbnail Overlay */}
            {showThumbnail && thumbnailUrl && (
                <div 
                    className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center cursor-pointer"
                    onClick={handleThumbnailClick}
                >
                    <img 
                        src={thumbnailUrl} 
                        alt="Video thumbnail" 
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-white bg-opacity-90 rounded-full p-4 hover:bg-opacity-100 transition-all duration-200">
                            <svg className="w-8 h-8 text-gray-800" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z"/>
                            </svg>
                        </div>
                    </div>
                </div>
            )}

            {/* Controls */}
            {controls && (showControls || !isPlaying) && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                    {/* Progress Bar */}
                    <div 
                        className="w-full h-2 bg-gray-600 rounded-full mb-3 cursor-pointer"
                        onClick={handleSeek}
                    >
                        <div 
                            className="h-full bg-white rounded-full"
                            style={{ width: `${(currentTime / duration) * 100}%` }}
                        />
                    </div>

                    {/* Control Buttons */}
                    <div className="flex items-center justify-between text-white">
                        <div className="flex items-center space-x-3">
                            {/* Play/Pause Button */}
                            <button 
                                onClick={togglePlay}
                                className="hover:text-gray-300 transition-colors duration-200"
                            >
                                {isPlaying ? (
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                                    </svg>
                                ) : (
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M8 5v14l11-7z"/>
                                    </svg>
                                )}
                            </button>

                            {/* Volume Control */}
                            <div className="flex items-center space-x-2">
                                <button 
                                    onClick={toggleMute}
                                    className="hover:text-gray-300 transition-colors duration-200"
                                >
                                    {isMuted || volume === 0 ? (
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                                        </svg>
                                    )}
                                </button>
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.1"
                                    value={isMuted ? 0 : volume}
                                    onChange={handleVolumeChange}
                                    className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                                />
                            </div>

                            {/* Time Display */}
                            <span className="text-sm">
                                {formatTime(currentTime)} / {formatTime(duration)}
                            </span>
                        </div>

                        {/* Right side controls */}
                        <div className="flex items-center space-x-3">
                            {/* Portrait Video Indicator */}
                            {isPortrait && !isFullscreen && (
                                <span className="text-xs bg-blue-600 px-2 py-1 rounded">
                                    📱 Portrait
                                </span>
                            )}

                            {/* Fullscreen Button */}
                            <button
                                onClick={toggleFullscreen}
                                className="hover:text-gray-300 transition-colors duration-200"
                                title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
                            >
                                {isFullscreen ? (
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/>
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VideoPlayer;
