import React, { useState } from 'react'
import { Search, Loader2 } from 'lucide-react'

const SearchBar = ({ onSearch, loading, isDarkMode = false }) => {
  const [inputValue, setInputValue] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (inputValue.trim() && !loading) {
      onSearch(inputValue.trim())
    }
  }

  const handleInputChange = (e) => {
    setInputValue(e.target.value)
  }

  return (
    <div className="max-w-2xl mx-auto mb-8">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            {loading ? (
              <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
            ) : (
              <Search className="w-5 h-5 text-gray-400" />
            )}
          </div>
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Search for an ingredient (e.g., pasta, cheese, tomato)..."
            className={`input-field pl-12 pr-32 backdrop-blur-sm ${
              isDarkMode 
                ? 'bg-gray-800/90 border-gray-600 text-white' 
                : 'bg-white/90 border-white/20'
            }`}
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !inputValue.trim()}
            className="absolute inset-y-0 right-0 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold rounded-r-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>
      
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {['pasta', 'cheese', 'tomato', 'fish', 'chicken', 'meat'].map((ingredient) => (
          <button
            key={ingredient}
            onClick={() => onSearch(ingredient)}
            disabled={loading}
            className={`px-3 py-1 text-sm backdrop-blur-sm rounded-full transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm ${
              isDarkMode 
                ? 'bg-gray-700/80 hover:bg-gray-600 text-gray-200' 
                : 'bg-white/80 hover:bg-white text-gray-700'
            }`}
          >
            {ingredient}
          </button>
        ))}
      </div>
    </div>
  )
}

export default SearchBar
