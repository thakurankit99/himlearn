import React, { useRef, useContext } from 'react'
import { useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { AuthContext } from "../../Context/AuthContext";
import { AiOutlineUpload } from 'react-icons/ai'
import { FiArrowLeft } from 'react-icons/fi'
import '../../Css/AddStory.css'
import '../../Css/Privacy.css'

const AddStory = () => {

    const { config } = useContext(AuthContext)
    const navigate = useNavigate()
    const imageEl = useRef(null)
    const editorEl = useRef(null)
    const [image, setImage] = useState('')
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [privacy, setPrivacy] = useState('public')
    const [success, setSuccess] = useState('')
    const [error, setError] = useState('')
    const [isVideo, setIsVideo] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)
    const [uploadStatus, setUploadStatus] = useState('')

    const clearInputs = () => {
        setTitle('')
        setContent('')
        setImage('')
        setPrivacy('public')
        setIsVideo(false)
        setIsUploading(false)
        setUploadProgress(0)
        setUploadStatus('')
        editorEl.current.editor.setData('')
        imageEl.current.value = ""
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!title.trim()) {
            setError('Please provide a title');
            setTimeout(() => setError(''), 5000);
            return;
        }

        if (!content.trim()) {
            setError('Please provide content for your story');
            setTimeout(() => setError(''), 5000);
            return;
        }



        setIsUploading(true);
        setUploadProgress(0);
        setError('');
        setSuccess('');

        const formdata = new FormData()
        formdata.append("title", title)
        formdata.append("image", image)
        formdata.append("content", content)
        formdata.append("privacy", privacy)

        try {
            setUploadStatus('Preparing upload...');
            setUploadProgress(10);

            // Create config with progress tracking
            const uploadConfig = {
                ...config,
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );

                    setUploadProgress(percentCompleted);

                    if (percentCompleted < 30) {
                        setUploadStatus('Uploading media...');
                    } else if (percentCompleted < 70) {
                        setUploadStatus(isVideo ? 'Processing video...' : 'Processing image...');
                    } else if (percentCompleted < 95) {
                        setUploadStatus('Finalizing story...');
                    } else {
                        setUploadStatus('Almost done...');
                    }
                }
            };

            const response = await axios.post("/story/addstory", formdata, uploadConfig);

            setUploadProgress(100);
            setUploadStatus('Story published successfully!');
            setSuccess('Story published successfully!');

            // Clear inputs
            clearInputs();

            // Redirect to the new story after a short delay
            setTimeout(() => {
                if (response.data && response.data.data && response.data.data.slug) {
                    navigate(`/story/${response.data.data.slug}`);
                } else {
                    navigate('/');
                }
            }, 1500);

        } catch (error) {
            setIsUploading(false);
            setUploadProgress(0);
            setUploadStatus('');

            const errorMessage = error.response?.data?.error || 'Failed to publish story. Please try again.';
            setError(errorMessage);

            setTimeout(() => {
                setError('');
            }, 7000);
        }
    }
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 left-0 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
                <div className="absolute top-0 right-0 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
            </div>

            <div className="relative max-w-4xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <Link
                        to="/"
                        className="inline-flex items-center px-4 py-2 text-gray-600 hover:text-purple-600 transition-colors duration-200 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm hover:shadow-md"
                    >
                        <FiArrowLeft className="w-5 h-5 mr-2" />
                        Back to Home
                    </Link>

                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Your Story</h1>
                        <p className="text-gray-600">Share your knowledge and inspire others</p>
                    </div>

                    <div className="w-32"></div> {/* Spacer for centering */}
                </div>

                {/* Main Form Container */}
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
                    <form onSubmit={handleSubmit} className={`p-8 space-y-8 ${isUploading ? 'uploading' : ''}`}>

                        {/* Error and Success Messages */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl flex items-center">
                                <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-xl flex items-center">
                                <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                {success}
                            </div>
                        )}

                        {/* Upload Progress */}
                        {isUploading && (
                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-blue-700 font-medium">{uploadStatus}</span>
                                    <span className="text-blue-600 font-bold">{uploadProgress}%</span>
                                </div>
                                <div className="w-full bg-blue-200 rounded-full h-3 overflow-hidden">
                                    <div
                                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full transition-all duration-300 ease-out"
                                        style={{ width: `${uploadProgress}%` }}
                                    ></div>
                                </div>
                                {isVideo && uploadProgress > 0 && uploadProgress < 100 && (
                                    <p className="text-blue-600 text-sm mt-2">
                                        📹 Video processing may take a moment...
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Title Field */}
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Story Title
                                <span className="text-red-500 ml-1">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    required
                                    id="title"
                                    placeholder="Enter an engaging title for your story..."
                                    onChange={(e) => setTitle(e.target.value)}
                                    value={title}
                                    disabled={isUploading}
                                    className="w-full px-4 py-4 text-lg border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Content Editor */}
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Story Content
                                <span className="text-red-500 ml-1">*</span>
                            </label>
                            <div className="relative">
                                <CKEditor
                                    editor={ClassicEditor}
                                    config={{
                                        toolbar: [
                                            'heading', '|',
                                            'bold', 'italic', 'link', '|',
                                            'bulletedList', 'numberedList', '|',
                                            'outdent', 'indent', '|',
                                            'blockQuote', 'insertTable', '|',
                                            'undo', 'redo'
                                        ],
                                        placeholder: 'Write your story content here... Share your knowledge, experiences, and insights with the community.',
                                        removePlugins: ['MediaEmbed'],
                                        height: '350px'
                                    }}
                                    onChange={(e, editor) => {
                                        const data = editor.getData();
                                        setContent(data)
                                    }}
                                    ref={editorEl}
                                    disabled={isUploading}
                                />
                            </div>
                        </div>

                        {/* Privacy Settings */}
                        <div className="space-y-4">
                            <label className="block text-sm font-semibold text-gray-700">
                                Privacy Settings
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Public Option */}
                                <label className={`relative flex flex-col p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                                    privacy === 'public'
                                        ? 'border-green-500 bg-green-50 shadow-md'
                                        : 'border-gray-200 bg-white/50 hover:border-green-300 hover:bg-green-50'
                                } ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                    <input
                                        type="radio"
                                        name="privacy"
                                        value="public"
                                        checked={privacy === 'public'}
                                        onChange={(e) => setPrivacy(e.target.value)}
                                        disabled={isUploading}
                                        className="sr-only"
                                    />
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                                                <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <span className="font-medium text-gray-900">Public</span>
                                        </div>
                                        {privacy === 'public' && (
                                            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-600">Everyone can see this story</p>
                                </label>

                                {/* Registered Users Option */}
                                <label className={`relative flex flex-col p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                                    privacy === 'user'
                                        ? 'border-blue-500 bg-blue-50 shadow-md'
                                        : 'border-gray-200 bg-white/50 hover:border-blue-300 hover:bg-blue-50'
                                } ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                    <input
                                        type="radio"
                                        name="privacy"
                                        value="user"
                                        checked={privacy === 'user'}
                                        onChange={(e) => setPrivacy(e.target.value)}
                                        disabled={isUploading}
                                        className="sr-only"
                                    />
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                                <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <span className="font-medium text-gray-900">Members</span>
                                        </div>
                                        {privacy === 'user' && (
                                            <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-600">Only registered users can see</p>
                                </label>

                                {/* Private Option */}
                                <label className={`relative flex flex-col p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                                    privacy === 'private'
                                        ? 'border-purple-500 bg-purple-50 shadow-md'
                                        : 'border-gray-200 bg-white/50 hover:border-purple-300 hover:bg-purple-50'
                                } ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                    <input
                                        type="radio"
                                        name="privacy"
                                        value="private"
                                        checked={privacy === 'private'}
                                        onChange={(e) => setPrivacy(e.target.value)}
                                        disabled={isUploading}
                                        className="sr-only"
                                    />
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                                                <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <span className="font-medium text-gray-900">Private</span>
                                        </div>
                                        {privacy === 'private' && (
                                            <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-600">Only you and admins can see</p>
                                </label>
                            </div>
                        </div>



                        {/* Media Upload */}
                        <div className="space-y-4">
                            <label className="block text-sm font-semibold text-gray-700">
                                Featured Media
                                <span className="text-gray-500 font-normal ml-2">(Optional)</span>
                            </label>

                            <div className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                                image
                                    ? 'border-green-300 bg-green-50'
                                    : 'border-gray-300 bg-gray-50 hover:border-purple-400 hover:bg-purple-50'
                            } ${isUploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>

                                {image ? (
                                    <div className="space-y-3">
                                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                                            {isVideo ? (
                                                <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M2 6a2 2 0 012-2h6l2 2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                                                </svg>
                                            ) : (
                                                <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                                </svg>
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{image.name}</p>
                                            <p className="text-sm text-gray-600">
                                                {isVideo ? '📹 Video' : '🖼️ Image'} • {(image.size / (1024 * 1024)).toFixed(1)}MB
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setImage('');
                                                setIsVideo(false);
                                                imageEl.current.value = '';
                                            }}
                                            className="text-red-600 hover:text-red-700 text-sm font-medium"
                                            disabled={isUploading}
                                        >
                                            Remove file
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                                            <AiOutlineUpload className="w-8 h-8 text-purple-600" />
                                        </div>
                                        <div>
                                            <p className="text-lg font-medium text-gray-900 mb-2">Upload Media</p>
                                            <p className="text-gray-600">
                                                Include a high-quality image or video to make your story more engaging
                                            </p>
                                            <p className="text-sm text-gray-500 mt-2">
                                                Supports: JPG, PNG, GIF, MP4, MOV • Max 50MB
                                            </p>
                                        </div>
                                    </div>
                                )}

                                <input
                                    name="image"
                                    type="file"
                                    accept="image/*,video/*"
                                    ref={imageEl}
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            // Check for problematic filename characters
                                            const problematicChars = /[🥶📚✅🔥#@$%^&*()+=\[\]{}|\\:";'<>?,]/;
                                            const hasEmojis = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu;

                                            if (problematicChars.test(file.name) || hasEmojis.test(file.name)) {
                                                setError('Filename contains special characters or emojis that may cause upload issues. The system will automatically clean the filename during upload.');
                                                setTimeout(() => setError(''), 5000);
                                            }

                                            setImage(file);
                                            setIsVideo(file.type.startsWith('video/'));
                                        }
                                    }}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    disabled={isUploading}
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-center pt-6">
                            <button
                                type="submit"
                                className={`group relative px-8 py-4 text-lg font-semibold text-white rounded-xl transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-300 ${
                                    isUploading
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl'
                                }`}
                                disabled={isUploading}
                            >
                                {isUploading ? (
                                    <span className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Publishing...
                                    </span>
                                ) : (
                                    <span className="flex items-center">
                                        <svg className="w-5 h-5 mr-2 group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                        </svg>
                                        Publish Story
                                    </span>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

    )
}

export default AddStory


