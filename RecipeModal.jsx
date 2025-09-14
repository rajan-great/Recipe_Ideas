import React, { useState, useEffect } from 'react'
import { X, Clock, Users, ExternalLink, ChefHat, Loader2 } from 'lucide-react'

const RecipeModal = ({ recipe, onClose }) => {
  const [recipeDetails, setRecipeDetails] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      try {
        setLoading(true)
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipe.idMeal}`)
        const data = await response.json()
        
        if (data.meals && data.meals[0]) {
          setRecipeDetails(data.meals[0])
        } else {
          setError('Recipe details not found')
        }
      } catch (err) {
        setError('Failed to fetch recipe details')
        console.error('Error fetching recipe details:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchRecipeDetails()
  }, [recipe.idMeal])

  const getIngredients = () => {
    if (!recipeDetails) return []
    
    const ingredients = []
    for (let i = 1; i <= 20; i++) {
      const ingredient = recipeDetails[`strIngredient${i}`]
      const measure = recipeDetails[`strMeasure${i}`]
      
      if (ingredient && ingredient.trim()) {
        ingredients.push({
          ingredient: ingredient.trim(),
          measure: measure ? measure.trim() : ''
        })
      }
    }
    return ingredients
  }

  const formatInstructions = (instructions) => {
    if (!instructions) return ''
    return instructions.split('\r\n').filter(step => step.trim()).join('\n\n')
  }

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-scale-in">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <ChefHat className="w-6 h-6 text-orange-500" />
            <h2 className="text-2xl font-bold text-gray-800">
              {recipe.strMeal}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="text-center">
                <Loader2 className="w-12 h-12 text-orange-500 animate-spin mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">Loading recipe details...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center py-20">
              <div className="text-center">
                <ChefHat className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">{error}</p>
              </div>
            </div>
          ) : recipeDetails ? (
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="relative overflow-hidden rounded-xl">
                    <img
                      src={recipeDetails.strMealThumb}
                      alt={recipeDetails.strMeal}
                      className="w-full h-64 object-cover"
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMDAgMTEwTDIzMCAxNDBIMTcwTDIwMCAxMTBaIiBmaWxsPSIjOUNBM0FGIi8+CjxjaXJjbGUgY3g9IjIwMCIgY3k9IjE4MCIgcj0iMjAiIGZpbGw9IiM5Q0EzQUYiLz4KPHRleHQgeD0iMjAwIiB5PSIyMjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM2QjcyODAiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjE4IiBmb250LXdlaWdodD0iNTAwIj5JbWFnZSBOb3QgRm91bmQ8L3RleHQ+Cjwvc3ZnPgo='
                      }}
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
                      <span className="text-sm font-medium text-gray-700">
                        {recipeDetails.strCategory}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-5 h-5" />
                      <span>30-45 min</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="w-5 h-5" />
                      <span>4-6 servings</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">Area:</span>
                      <span>{recipeDetails.strArea}</span>
                    </div>
                  </div>

                  {recipeDetails.strYoutube && (
                    <div>
                      <a
                        href={recipeDetails.strYoutube}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                      >
                        <ExternalLink className="w-5 h-5" />
                        <span>Watch on YouTube</span>
                      </a>
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                      <ChefHat className="w-5 h-5 mr-2 text-orange-500" />
                      Ingredients
                    </h3>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <ul className="space-y-2">
                        {getIngredients().map((item, index) => (
                          <li key={index} className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0"></div>
                            <span className="text-gray-700">
                              <span className="font-medium">{item.measure}</span> {item.ingredient}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                      <ChefHat className="w-5 h-5 mr-2 text-orange-500" />
                      Instructions
                    </h3>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="prose prose-gray max-w-none">
                        <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                          {formatInstructions(recipeDetails.strInstructions)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default RecipeModal
