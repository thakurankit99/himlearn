import React, { useState } from 'react'
import {BiSearchAlt2} from 'react-icons/bi'
import {  useNavigate } from "react-router-dom";
const SearchForm = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const navigate =useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault() ; 
        if(searchTerm){
            navigate(`/?search=${searchTerm}`)
        }

        setSearchTerm("")
    }

  
    return (
        <form
            className="relative flex items-center"
            onSubmit={handleSubmit}
        >
            <div className="relative">
                <input
                    type="text"
                    name="search"
                    placeholder="Search stories..."
                    className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
                    onChange={(e) => setSearchTerm(e.target.value)}
                    value={searchTerm}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <BiSearchAlt2 className="h-5 w-5 text-gray-400" />
                </div>
            </div>

            <button
                type="submit"
                className={`ml-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
                    searchTerm.trim()
                        ? 'bg-primary-600 text-white hover:bg-primary-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                disabled={!searchTerm.trim()}
            >
                Search
            </button>
        </form>
    )
}

export default SearchForm