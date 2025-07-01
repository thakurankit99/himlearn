import axios from "axios";
import { v4 as uuidv4 } from 'uuid';
import { useState, useEffect, useContext } from "react";
import { useLocation, Link } from "react-router-dom";
import SkeletonStory from "../Skeletons/SkeletonStory";
import LearningContent from "../StoryScreens/CardStory";
import NoContent from "../StoryScreens/NoStories";
import Pagination from "./Pagination";
import { AuthContext } from "../../Context/AuthContext";
import "../../Css/Home.css"
// Icons removed for simplified homepage

import { useNavigate } from "react-router-dom"
const Home = () => {
  const search = useLocation().search
  const searchKey = new URLSearchParams(search).get('search')
  const [learningContent, setLearningContent] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const { config, activeUser } = useContext(AuthContext);

  // Smooth scroll to learning content section
  const scrollToLearningContent = (e) => {
    e.preventDefault();
    const contentSection = document.getElementById('learning-content');
    if (contentSection) {
      contentSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  // Handle start writing button click
  const handleStartWriting = (e) => {
    e.preventDefault();
    if (activeUser) {
      navigate('/add-content');
    } else {
      navigate('/auth');
    }
  };


  useEffect(() => {
    const getLearningContent = async () => {

      setLoading(true)
      try {

        // Include auth headers if available
        const requestConfig = localStorage.getItem("authToken") ? config : {};
        const { data } = await axios.get(`/story/getAllStories?search=${searchKey || ""}&page=${page}`, requestConfig)

        if (searchKey) {
          navigate({
            pathname: '/',
            search: `?search=${searchKey}${page > 1 ? `&page=${page}` : ""}`,
          });
        }
        else {
          navigate({
            pathname: '/',
            search: `${page > 1 ? `page=${page}` : ""}`,
          });


        }
        setLearningContent(data.data)
        setPages(data.pages)

        setLoading(false)
      }
      catch (error) {
        setLoading(true)
      }
    }
    getLearningContent()
  }, [setLoading, search, page, navigate, config, searchKey])


  useEffect(() => {
    setPage(1)
  }, [searchKey])


  useEffect(() => {
    document.title = "HIM LEARNING";
  }, []);


  // Render function for logged-in users
  const renderLoggedInView = () => (
    <>
      {/* Learning Content Section - Top Priority for Logged-in Users */}
      <section className="py-12 bg-white" id="learning-content">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full text-sm font-medium text-purple-700 mb-6">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Latest Learning Content
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl mb-4">
              Welcome back to HimLearning, {activeUser?.username || activeUser?.name || 'User'}!
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover the latest educational content from our HimLearning community of educators. Ready to share your own knowledge on HimLearning?
            </p>
            <div className="mt-8">
              <Link
                to="/add-content"
                className="inline-flex items-center px-6 py-3 text-lg font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl hover:from-purple-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create New Content
              </Link>
            </div>
          </div>

          {/* Learning Content Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              Array.from({ length: 6 }).map(() => (
                <SkeletonStory key={uuidv4()} />
              ))
            ) : learningContent.length === 0 ? (
              <div className="col-span-full">
                <NoContent />
              </div>
            ) : (
              learningContent.map((content) => (
                <LearningContent key={content._id} story={content} />
              ))
            )}
          </div>

          {/* Pagination */}
          {pages > 1 && (
            <div className="mt-12">
              <Pagination page={page} pages={pages} changePage={setPage} />
            </div>
          )}
        </div>
      </section>

      {/* Simplified Welcome Section for Logged-in Users */}
      <section className="py-16 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl mb-6">
            Keep Learning, Keep Growing
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Your educational content helps others learn. Continue sharing your knowledge and expertise with our growing community.
          </p>
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Create Content</h3>
              <p className="text-gray-600">Share your knowledge and expertise</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Connect</h3>
              <p className="text-gray-600">Engage with fellow educators</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Grow</h3>
              <p className="text-gray-600">Build your audience and impact</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );

  // Render function for public users
  const renderPublicView = () => (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute top-0 right-0 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative max-w-screen-xl mx-auto px-4 py-20 sm:px-6 lg:px-8 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-sm font-medium text-purple-700 border border-purple-200 mb-6">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-2 animate-pulse"></span>
                New platform for educators and learners
              </div>

              <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl lg:text-6xl leading-tight">
                Create Learning Content on HimLearning,
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
                  Share Your Knowledge
                </span>
              </h1>

              <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Join HimLearning to create compelling educational content, share your expertise, and discover amazing resources from educators worldwide. Your knowledge matters on HimLearning - start sharing it today.
              </p>

              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button
                  onClick={handleStartWriting}
                  className="group inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl hover:from-purple-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <svg className="w-5 h-5 mr-2 group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                  Join & Start Creating
                </button>

                <button
                  onClick={scrollToLearningContent}
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-gray-700 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl hover:bg-white hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Explore Learning Content
                </button>
              </div>

              {/* Features */}
              <div className="mt-12 grid grid-cols-3 gap-6 text-center lg:text-left">
                <div>
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center mb-2">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </div>
                  <div className="text-sm text-gray-600">Rich Story Editor</div>
                </div>
                <div>
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-teal-500 rounded-lg flex items-center justify-center mb-2">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="text-sm text-gray-600">Media Support</div>
                </div>
                <div>
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center mb-2">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div className="text-sm text-gray-600">Instant Publishing</div>
                </div>
              </div>
            </div>

            {/* Right content - Illustration */}
            <div className="relative lg:flex justify-center">
              <div className="relative">
                <div className="w-80 h-80 bg-gradient-to-br from-purple-400 to-blue-500 rounded-3xl transform rotate-6 opacity-20"></div>
                <div className="absolute inset-0 w-80 h-80 bg-gradient-to-br from-blue-400 to-purple-500 rounded-3xl transform -rotate-6 opacity-30"></div>
                <div className="absolute inset-0 w-80 h-80 bg-white rounded-3xl shadow-2xl flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">HimLearning Story Creator</h3>
                    <p className="text-gray-600 text-sm">Write, publish, and share your stories with the world on HimLearning</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Stories Section for Public */}
      <section className="py-20 bg-white" id="learning-content">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full text-sm font-medium text-purple-700 mb-6">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Latest Learning Content
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl mb-4">
              Discover Amazing Content on HimLearning
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore the newest learning content from our vibrant HimLearning community of educators and learners. Find inspiration, knowledge, and fresh perspectives on HimLearning.
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map(() => (
                <div key={uuidv4()} className="animate-pulse">
                  <div className="bg-gray-200 rounded-2xl h-64 mb-4"></div>
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {learningContent.length !== 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                    {learningContent.map((content) => (
                      <div key={content._id} className="group">
                        <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border border-gray-100">
                          <LearningContent story={content} />
                        </div>
                      </div>
                    ))}
                  </div>

                  {pages > 1 && (
                    <div className="flex justify-center">
                      <div className="bg-white rounded-2xl shadow-lg p-2">
                        <Pagination page={page} pages={pages} changePage={setPage} />
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex justify-center">
                  <div className="text-center py-16">
                    <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg className="w-12 h-12 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <NoContent />
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Content Creation Showcase */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left content */}
            <div>
              <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-sm font-medium text-purple-700 border border-purple-200 mb-6">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Easy Content Creation
              </div>

              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl mb-6">
                Share Your Knowledge on HimLearning in Minutes
              </h2>

              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                HimLearning's intuitive content editor makes it easy to create, format, and publish your educational materials. Add images, videos, and rich formatting to bring your learning content to life on HimLearning.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Rich text editor with formatting options</span>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Upload images and media files</span>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Instant publishing and sharing</span>
                </div>
              </div>

              <button
                onClick={handleStartWriting}
                className="inline-flex items-center px-6 py-3 text-lg font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl hover:from-purple-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Start Creating Today
              </button>
            </div>

            {/* Right content - Visual */}
            <div className="relative">
              <div className="bg-white rounded-3xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-100 rounded w-full"></div>
                    <div className="h-3 bg-gray-100 rounded w-5/6"></div>
                    <div className="h-3 bg-gray-100 rounded w-4/6"></div>
                  </div>
                  <div className="h-32 bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl flex items-center justify-center">
                    <svg className="w-12 h-12 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                      <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                        </svg>
                      </div>
                    </div>
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Community Features */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold mb-4">
              Join Our Growing HimLearning Community
            </h2>
            <p className="text-xl text-purple-100 max-w-3xl mx-auto">
              Connect with educators, learners, and enthusiasts from around the world on HimLearning. Share knowledge, get feedback, and grow together in the HimLearning community.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </div>
                <div className="text-purple-100 font-medium">Content Creation</div>
                <div className="text-sm text-purple-200 mt-1">Share knowledge</div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div className="text-purple-100 font-medium">Knowledge Sharing</div>
                <div className="text-sm text-purple-200 mt-1">Learn together</div>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="text-purple-100 font-medium">Easy Publishing</div>
                <div className="text-sm text-purple-200 mt-1">Share instantly</div>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="text-purple-100 font-medium">Rich Content</div>
                <div className="text-sm text-purple-200 mt-1">Media support</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );

  // Check if user is actually logged in (has _id or username)
  const isLoggedIn = activeUser && (activeUser._id || activeUser.username || activeUser.email);

  return (
    <div className="min-h-screen bg-gray-50">
      {isLoggedIn ? renderLoggedInView() : renderPublicView()}
    </div>
  );

};

export default Home;
