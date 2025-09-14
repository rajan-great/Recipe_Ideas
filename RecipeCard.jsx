import React from 'react'
import { Eye, Clock, Users } from 'lucide-react'

const RecipeCard = ({ recipe, onClick, isDarkMode = false }) => {
  return (
    <div
      onClick={onClick}
      className={`backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer overflow-hidden group ${
        isDarkMode ? 'bg-gray-800/95' : 'bg-white/95'
      }`}
    >
      <div className="relative overflow-hidden">
        <img
          src={recipe.strMealThumb}
          alt={recipe.strMeal}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
          onError={(e) => {
            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNTAgNzVMMTc1IDEwMEgxMjVMMTUwIDc1WiIgZmlsbD0iIzlDQTNBRiIvPgo8Y2lyY2xlIGN4PSIxNTAiIGN5PSIxMjUiIHI9IjE1IiBmaWxsPSIjOUNBM0FGIi8+Cjx0ZXh0IHg9IjE1MCIgeT0iMTYwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNkI3MjgwIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZm9udC13ZWlnaHQ9IjUwMCI+SW1hZ2UgTm90IEZvdW5kPC90ZXh0Pgo8L3N2Zz4K'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Eye className="w-4 h-4 text-gray-700" />
        </div>
      </div>
      
      <div className="p-6">
        <h3 className={`text-xl font-bold mb-3 line-clamp-2 group-hover:text-orange-500 transition-colors duration-300 ${
          isDarkMode ? 'text-white' : 'text-gray-800'
        }`}>
          {recipe.strMeal}
        </h3>
        
        <div className={`flex items-center justify-between text-sm mb-4 ${
          isDarkMode ? 'text-gray-300' : 'text-gray-600'
        }`}>
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>30-45 min</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="w-4 h-4" />
            <span>4-6 servings</span>
          </div>
        </div>
        
        <button className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
          View Recipe
        </button>
      </div>
    </div>
  )
}

export default RecipeCard
