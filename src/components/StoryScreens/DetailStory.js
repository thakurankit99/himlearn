import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import Loader from '../GeneralScreens/Loader';
import { FaRegHeart, FaHeart } from 'react-icons/fa'
import { RiDeleteBin6Line } from 'react-icons/ri'
import { FiEdit, FiArrowLeft, FiLock, FiUsers, FiGlobe } from 'react-icons/fi'
import { FaRegComment } from 'react-icons/fa'
import { BsBookmarkPlus, BsThreeDots, BsBookmarkFill } from 'react-icons/bs'
import CommentSidebar from '../CommentScreens/CommentSidebar';
import VideoPlayer from '../Common/VideoPlayer';
import { getMediaDisplayInfo } from '../../utils/imageUtils';

const DetailStory = () => {
  const [likeStatus, setLikeStatus] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [activeUser, setActiveUser] = useState({})
  const [story, setStory] = useState({})

  const [sidebarShowStatus, setSidebarShowStatus] = useState(false)
  const [loading, setLoading] = useState(true)
  const [mediaInfo, setMediaInfo] = useState(null)
  const slug = useParams().slug
  const [storyReadListStatus, setStoryReadListStatus] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {

    const getDetailStory = async () => {
      setLoading(true)
      var activeUser = {}
      try {
        const { data } = await axios.get("/auth/private", {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        activeUser = data.user

        setActiveUser(activeUser)

      }
      catch (error) {
        setActiveUser({})
      }

      try {
        const { data } = await axios.post(`/story/${slug}`, { activeUser })
        setStory(data.data)
        setLikeStatus(data.likeStatus)
        setLikeCount(data.data.likeCount)
        setMediaInfo(getMediaDisplayInfo(data.data))

        setLoading(false)

        const story_id = data.data._id;

        if (activeUser.readList) {

          if (!activeUser.readList.includes(story_id)) {
            setStoryReadListStatus(false)
          }
          else {
            setStoryReadListStatus(true)

          }

        }

      }
      catch (error) {
        setLoading(false)
        if (error.response?.status === 403) {
          setError("You don't have permission to access this story. It may be private or restricted to registered users.")
        } else if (error.response?.status === 401) {
          setError("You need to be logged in to access this story.")
        } else if (error.response?.status === 404) {
          setError("Story not found.")
        } else {
          setError("An error occurred while loading the story.")
        }
        setStory({})
      }

    }
    getDetailStory();

  }, [slug, setLoading])



  const handleLike = async () => {
    setTimeout(() => {
      setLikeStatus(!likeStatus)
    }, 1500)

    try {
      const { data } = await axios.post(`/story/${slug}/like`, { activeUser }, {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      })

      setLikeCount(data.data.likeCount)


    }
    catch (error) {
      setStory({})
      localStorage.removeItem("authToken")
      navigate("/")
    }

  }

  const handleDelete = async () => {

    if (window.confirm("Do you want to delete this post")) {

      try {

        await axios.delete(`/story/${slug}/delete`, {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        })
        navigate("/")

      }
      catch (error) {
        console.log(error)
      }

    }

  }



  const handleAdminDelete = async () => {

    if (window.confirm("Are you sure you want to delete this story? This action cannot be undone and will also delete all comments.")) {

      try {

        await axios.delete(`/admin/stories/${story._id}`, {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        })
        navigate("/")

      }
      catch (error) {
        console.log(error)
        alert("Failed to delete story. Please try again.")
      }

    }

  }


  const editDate = (createdAt) => {

    const d = new Date(createdAt)
      ;
    var datestring = d.toLocaleString('eng', { month: 'long' }).substring(0, 3) + " " + d.getDate()
    return datestring
  }

  const addStoryToReadList = async () => {

    try {

      const { data } = await axios.post(`/user/${slug}/addStoryToReadList`, { activeUser }, {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      })

      setStoryReadListStatus(data.status)

      document.getElementById("readListLength").textContent = data.user.readListLength
    }
    catch (error) {
      console.log(error)
    }
  }

  const getPrivacyIcon = (privacy) => {
    switch(privacy) {
        case 'private':
            return <FiLock className="privacy-icon private" title="Private - Only you and admins can see" />;
        case 'user':
            return <FiUsers className="privacy-icon user" title="Registered Users - Only logged-in users can see" />;
        case 'public':
        default:
            return <FiGlobe className="privacy-icon public" title="Public - Everyone can see" />;
    }
  }

  const getPrivacyBadge = (privacy) => {
    switch(privacy) {
        case 'private':
            return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Private</span>;
        case 'user':
            return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Registered Users</span>;
        case 'public':
        default:
            return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Public</span>;
    }
  }

  return (
    <>
      {
        loading ? <Loader /> :
          error ? (
            <div className='min-h-screen bg-gray-50 flex items-center justify-center px-4'>
              <div className='text-center'>
                <h2 className='text-2xl font-bold text-gray-900 mb-4'>Access Restricted</h2>
                <p className='text-gray-600 mb-6'>{error}</p>
                <Link to='/' className='btn-primary'>Go Back Home</Link>
              </div>
            </div>
          ) : (
            <div className='min-h-screen bg-gray-50'>
              {/* Header */}
              <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
                <div className="max-w-4xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
                  <div className="flex items-center justify-between">
                    <Link to={'/'} className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors duration-200">
                      <FiArrowLeft className="w-5 h-5" />
                      <span className="text-sm font-medium">Back to learning content</span>
                    </Link>

                    <div className="flex items-center space-x-3">
                      {getPrivacyIcon(story.privacy)}
                      {getPrivacyBadge(story.privacy)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Story Content */}
              <article className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                {/* Story Header */}
                <header className="mb-8">
                  <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-6">
                    {story.title}
                  </h1>

                  {/* Author Info */}
                  <div className="flex items-center space-x-4 mb-6">
                    {story.author && (
                      <>
                        <img
                          src={`/userPhotos/${story.author.photo}`}
                          alt={story.author.username}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <p className="text-lg font-medium text-gray-900">{story.author.username}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>{editDate(story.createdAt)}</span>
                            <span>•</span>
                            <span>{story.readtime} min read</span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between border-t border-b border-gray-200 py-4">
                    <div className="flex items-center space-x-6">
                      {/* Comments for non-logged users */}
                      {!activeUser.username && (
                        <button
                          onClick={() => setSidebarShowStatus(!sidebarShowStatus)}
                          className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors duration-200"
                        >
                          <FaRegComment className="w-5 h-5" />
                          <span className="text-sm font-medium">{story.commentCount}</span>
                        </button>
                      )}
                    </div>

                    {/* Author/Admin Controls */}
                    {activeUser && story.author && (
                      story.author._id === activeUser._id ? (
                        <div className="flex items-center space-x-3">
                          <Link
                            to={`/story/${story.slug}/edit`}
                            className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                          >
                            <FiEdit className="w-4 h-4" />
                            <span>Edit</span>
                          </Link>
                          <button
                            onClick={handleDelete}
                            className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-red-700 bg-red-100 rounded-lg hover:bg-red-200 transition-colors duration-200"
                          >
                            <RiDeleteBin6Line className="w-4 h-4" />
                            <span>Delete</span>
                          </button>
                        </div>
                      ) : activeUser.role === 'admin' ? (
                        <div className="flex items-center space-x-3">
                          <span className="text-xs font-medium text-primary-600 bg-primary-100 px-2 py-1 rounded">Admin</span>
                          <Link
                            to={`/story/${story.slug}/edit`}
                            className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                          >
                            <FiEdit className="w-4 h-4" />
                            <span>Edit</span>
                          </Link>
                          <button
                            onClick={handleAdminDelete}
                            className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-red-700 bg-red-100 rounded-lg hover:bg-red-200 transition-colors duration-200"
                          >
                            <RiDeleteBin6Line className="w-4 h-4" />
                            <span>Delete</span>
                          </button>
                        </div>
                      ) : null
                    )}
                  </div>
                </header>

                {/* Story Media */}
                <div className="mb-8">
                  {mediaInfo && mediaInfo.isVideo ? (
                    <div className="flex justify-center">
                      <VideoPlayer
                        videoUrl={mediaInfo.videoUrl}
                        thumbnailUrl={mediaInfo.displayUrl}
                        className="rounded-lg shadow-sm"
                        width="100%"
                        height="auto"
                        controls={true}
                        autoPlay={false}
                      />
                    </div>
                  ) : (
                    <img
                      src={mediaInfo ? mediaInfo.displayUrl : `/storyImages/${story.image}`}
                      alt={story.title}
                      className="w-full h-64 sm:h-80 lg:h-96 object-cover rounded-lg shadow-sm"
                      onError={(e) => {
                        e.target.src = '/storyImages/default.jpg';
                      }}
                    />
                  )}
                </div>





                {/* Story Content */}
                <div className="prose prose-lg max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: story.content }} />
                </div>
              </article>

              {/* Comment Sidebar */}
              <CommentSidebar
                slug={slug}
                sidebarShowStatus={sidebarShowStatus}
                setSidebarShowStatus={setSidebarShowStatus}
                activeUser={activeUser}
              />

              {/* Floating Action Buttons for Logged Users */}
              {activeUser.username && (
                <div className='fixed bottom-8 right-8 z-50'>
                  <div className='bg-white rounded-lg shadow-lg border border-gray-200 p-4 space-y-4'>
                    {/* Like Button */}
                    <div className='flex items-center space-x-3'>
                      <button
                        onClick={handleLike}
                        className={`p-2 rounded-full transition-colors duration-200 ${
                          likeStatus
                            ? 'text-red-600 bg-red-50 hover:bg-red-100'
                            : 'text-gray-600 bg-gray-50 hover:bg-gray-100'
                        }`}
                      >
                        {likeStatus ? <FaHeart className="w-5 h-5" /> : <FaRegHeart className="w-5 h-5" />}
                      </button>
                      <span className={`text-sm font-medium ${likeStatus ? 'text-red-600' : 'text-gray-600'}`}>
                        {likeCount}
                      </span>
                    </div>

                    {/* Comment Button */}
                    <div className='flex items-center space-x-3'>
                      <button
                        onClick={() => setSidebarShowStatus(!sidebarShowStatus)}
                        className='p-2 rounded-full text-gray-600 bg-gray-50 hover:bg-gray-100 transition-colors duration-200'
                      >
                        <FaRegComment className="w-5 h-5" />
                      </button>
                      <span className='text-sm font-medium text-gray-600'>{story.commentCount}</span>
                    </div>

                    {/* Bookmark Button */}
                    <div className='flex items-center space-x-3'>
                      <button
                        onClick={addStoryToReadList}
                        className={`p-2 rounded-full transition-colors duration-200 ${
                          storyReadListStatus
                            ? 'text-blue-600 bg-blue-50 hover:bg-blue-100'
                            : 'text-gray-600 bg-gray-50 hover:bg-gray-100'
                        }`}
                      >
                        {storyReadListStatus ? <BsBookmarkFill className="w-5 h-5" /> : <BsBookmarkPlus className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )
      }


    </>
  )
}

export default DetailStory;
