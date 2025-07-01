import React, { useEffect, useState, useContext } from 'react'
import axios from 'axios'
import Loader from "../GeneralScreens/Loader";
import { useNavigate, Link } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'
import { AuthContext } from '../../Context/AuthContext'
import { AiFillLock } from 'react-icons/ai'
import { BsThreeDots } from 'react-icons/bs'
import ReadListContentItem from '../StoryScreens/ReadListContentItem';

import '../../Css/ReadListPage.css'

const ReadListPage = () => {
    const navigate = useNavigate();
    const [readList, setReadList] = useState([])
    const [loading, setLoading] = useState(false)
    const { config, activeUser } = useContext(AuthContext)

    useEffect(() => {
        const getUserLearningLibrary = async () => {
            setLoading(true)

            try {
                const { data } = await (await axios.get(`/user/learningLibrary`, config)).data
                setReadList(data)
                setLoading(false)
            }
            catch (error) {
                navigate("/")
            }
        }
        getUserLearningLibrary()


    }, [])


    const editDate = (createdAt) => {

        const d = new Date(createdAt);
        var datestring = d.toLocaleString('eng', { month: 'long' }).substring(0, 3) + "  " + d.getDate()
        return datestring
    }


    return (
        <>
            {loading ? <Loader /> :
                <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
                    {/* Background decorative elements */}
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute top-0 left-0 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
                        <div className="absolute top-0 right-0 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
                        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
                    </div>

                    <div className="relative max-w-6xl mx-auto px-4 py-8">
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
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">My Learning Library</h1>
                                <p className="text-gray-600">Your saved learning content</p>
                            </div>

                            <div className="w-32"></div> {/* Spacer for centering */}
                        </div>

                        {/* User Info Card */}
                        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8 mb-8">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-6">
                                    <div className="relative">
                                        {activeUser.photo ? (
                                            <img
                                                src={`/userPhotos/${activeUser.photo}`}
                                                alt={activeUser.username}
                                                className="w-20 h-20 rounded-full object-cover ring-4 ring-purple-200 shadow-lg"
                                                onError={(e) => {
                                                    // If image fails to load, replace with avatar
                                                    e.target.style.display = 'none';
                                                    e.target.nextSibling.style.display = 'flex';
                                                }}
                                            />
                                        ) : null}
                                        <div
                                            className={`w-20 h-20 rounded-full ring-4 ring-purple-200 shadow-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-2xl ${activeUser.photo ? 'hidden' : 'flex'}`}
                                            style={{ display: activeUser.photo ? 'none' : 'flex' }}
                                        >
                                            {activeUser.username ? activeUser.username.charAt(0).toUpperCase() : 'U'}
                                        </div>
                                        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                    </div>

                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900 mb-2">{activeUser.username}</h2>
                                        <div className="flex items-center space-x-4 text-gray-600">
                                            <div className="flex items-center">
                                                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                                </svg>
                                                {editDate(Date.now())}
                                            </div>
                                            <div className="flex items-center">
                                                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                                                </svg>
                                                {activeUser.readListLength} {activeUser.readListLength === 1 ? 'item' : 'items'}
                                            </div>
                                            <div className="flex items-center">
                                                <AiFillLock className="w-4 h-4 mr-2" />
                                                Private
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <button className="p-3 text-gray-400 hover:text-gray-600 transition-colors duration-200 bg-gray-100 hover:bg-gray-200 rounded-full">
                                    <BsThreeDots className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Learning Content Grid */}
                        {readList.length !== 0 ? (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl font-semibold text-gray-900">
                                        Saved Learning Content ({readList.length})
                                    </h3>
                                    <div className="flex items-center space-x-2">
                                        <button className="px-4 py-2 text-sm font-medium text-gray-600 bg-white/80 backdrop-blur-sm rounded-lg hover:bg-white transition-colors duration-200">
                                            Sort by Date
                                        </button>
                                        <button className="p-2 text-gray-600 hover:text-purple-600 transition-colors duration-200">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                <div className="grid gap-6">
                                    {readList.map(content => (
                                        <ReadListContentItem key={content._id} story={content} editDate={editDate} />
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-16 text-center">
                                <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg className="w-12 h-12 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">Your Learning Library is Empty</h3>
                                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                                    Start building your personal library by saving learning content that interests you.
                                    Look for the bookmark icon on any content to add it here.
                                </p>
                                <Link
                                    to="/"
                                    className="inline-flex items-center px-6 py-3 text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    Discover Learning Content
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            }
        </>
    )
}

export default ReadListPage