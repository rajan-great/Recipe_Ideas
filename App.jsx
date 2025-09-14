import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SearchBar from './components/SearchBar'
import RecipeCard from './components/RecipeCard'
import RecipeModal from './components/RecipeModal'
import MamaPopup from './components/MamaPopup'
import { ChefHat, Heart, Moon, Sun } from 'lucide-react'

function App() {
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedRecipe, setSelectedRecipe] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [floatingHearts, setFloatingHearts] = useState([])
  const [dailyQuote, setDailyQuote] = useState('')
  const [savedRecipes, setSavedRecipes] = useState([])

  const mamaQuotes = [
    "A mother's love is the secret ingredient in every meal.",
    "No recipe is complete without mama's touch.",
    "Mama's cooking is the taste of home.",
    "Every dish tells the story of mama's love.",
    "Mama's hands create flavors that last forever.",
    "The warmth of a meal is the warmth of a mother's heart.",
    "Cooking with love is mama's greatest recipe.",
    "Mama's kitchen is where happiness begins.",
    "A recipe written with love tastes better than gold.",
    "Home is where mama is — and her food too."
  ]

  useEffect(() => {
    // Set daily quote based on date
    const today = new Date().getDate()
    setDailyQuote(mamaQuotes[today % mamaQuotes.length])
    
    // Load saved recipes from localStorage
    const saved = localStorage.getItem('savedRecipes')
    if (saved) {
      setSavedRecipes(JSON.parse(saved))
    }
  }, [])

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }

  const createFloatingHearts = () => {
    const newHearts = Array.from({ length: 5 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      delay: i * 0.2
    }))
    setFloatingHearts(newHearts)
    
    // Remove hearts after animation
    setTimeout(() => {
      setFloatingHearts([])
    }, 3000)
  }

  const searchRecipes = async (ingredient) => {
    if (!ingredient.trim()) return
    
    setLoading(true)
    try {
      const allRecipes = new Map()
      
      // Search by ingredient
      const ingredientResponse = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${encodeURIComponent(ingredient)}`)
      const ingredientData = await ingredientResponse.json()
      if (ingredientData.meals) {
        ingredientData.meals.forEach(recipe => {
          allRecipes.set(recipe.idMeal, recipe)
        })
      }
      
      // Search by meal name (for broader results)
      const nameResponse = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(ingredient)}`)
      const nameData = await nameResponse.json()
      if (nameData.meals) {
        nameData.meals.forEach(recipe => {
          allRecipes.set(recipe.idMeal, recipe)
        })
      }
      
      // Search by category for specific ingredients (only for ingredients that exist)
      const categoryMap = {
        'chicken': 'Chicken',
        'meat': 'Beef',
        'cheese': 'Miscellaneous',
        'pasta': 'Pasta',
        'tomato': 'Vegetarian',
        'fish': 'Seafood'
      }
      
      if (categoryMap[ingredient.toLowerCase()]) {
        const categoryResponse = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${encodeURIComponent(categoryMap[ingredient.toLowerCase()])}`)
        const categoryData = await categoryResponse.json()
        if (categoryData.meals) {
          // Take first 8 recipes from category to avoid too many results
          categoryData.meals.slice(0, 8).forEach(recipe => {
            allRecipes.set(recipe.idMeal, recipe)
          })
        }
      }
      
      // Convert Map to Array and limit to 12 recipes max
      const recipes = Array.from(allRecipes.values()).slice(0, 12)
      
      setRecipes(recipes)
      setSearchQuery(ingredient)
    } catch (error) {
      console.error('Error fetching recipes:', error)
      setRecipes([])
    } finally {
      setLoading(false)
    }
  }

  const getRandomRecipe = async () => {
    setLoading(true)
    try {
      const response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php')
      const data = await response.json()
      setRecipes(data.meals || [])
      setSearchQuery('Random Recipe')
    } catch (error) {
      console.error('Error fetching random recipe:', error)
    } finally {
      setLoading(false)
    }
  }

  const openRecipeModal = (recipe) => {
    setSelectedRecipe(recipe)
  }

  const closeRecipeModal = () => {
    setSelectedRecipe(null)
  }

  return (
    <div className={`min-h-screen relative overflow-hidden transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-orange-400 via-orange-300 to-yellow-100'
    }`}>
      {/* Background pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="w-full h-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f97316' fill-opacity='0.1'%3E%3Cpath d='M30 30c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zm-20-18c9.941 0 18 8.059 18 18s-8.059 18-18 18S-8 39.941-8 30s8.059-18 18-18z'/%3E%3Cpath d='M30 30c0-11.046 8.954-20 20-20s20 8.954 20 20-8.954 20-20 20-20-8.954-20-20zm20 18c-9.941 0-18-8.059-18-18s8.059-18 18-18 18 8.059 18 18-8.059 18-18 18z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}></div>
      </div>
      
      {/* Floating Hearts */}
      <AnimatePresence>
        {floatingHearts.map((heart) => (
          <motion.div
            key={heart.id}
            initial={{ opacity: 1, y: 0, x: `${heart.x}%` }}
            animate={{ 
              opacity: 0, 
              y: -100, 
              x: `${heart.x + (Math.random() - 0.5) * 20}%` 
            }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: 3, 
              delay: heart.delay,
              ease: "easeOut" 
            }}
            className="fixed bottom-20 text-red-500 text-2xl pointer-events-none z-50"
          >
            ❤️
          </motion.div>
        ))}
      </AnimatePresence>
      
      {/* Content overlay */}
      <div className="relative z-10">
        {/* Navbar */}
        <nav className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            {/* Logo and Title - Left Side */}
            <div className="flex items-center space-x-3">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 200, 
                  damping: 10,
                  delay: 0.2 
                }}
              >
                <svg 
                  width="48" 
                  height="48" 
                  viewBox="0 0 48 48" 
                  className="text-orange-500"
                >
                  {/* Cooking Pot */}
                  <path 
                    d="M24 8C18 8 14 12 14 18V28C14 32 16 36 20 38V42H28V38C32 36 34 32 34 28V18C34 12 30 8 24 8Z" 
                    fill="#f97316"
                    stroke="#3f3d56"
                    strokeWidth="1"
                  />
                  {/* Pot Handle */}
                  <path 
                    d="M38 20C40 20 42 22 42 24C42 26 40 28 38 28" 
                    fill="none"
                    stroke="#3f3d56"
                    strokeWidth="2"
                  />
                  {/* Heart Steam */}
                  <path 
                    d="M20 6C18 4 15 4 13 6C11 8 11 11 13 13L20 20L27 13C29 11 29 8 27 6C25 4 22 4 20 6Z" 
                    fill="#ef4444"
                    opacity="0.8"
                  />
                  <path 
                    d="M28 4C26 2 23 2 21 4C19 6 19 9 21 11L28 18L35 11C37 9 37 6 35 4C33 2 30 2 28 4Z" 
                    fill="#ef4444"
                    opacity="0.6"
                  />
                </svg>
              </motion.div>
              <motion.h1 
                className={`text-3xl font-bold drop-shadow-lg ${
                  isDarkMode ? 'text-white' : 'text-white'
                }`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                Mama's Recipe
              </motion.h1>
            </div>

            {/* Theme Toggle - Right Side */}
            <motion.button
              onClick={toggleDarkMode}
              className="p-3 rounded-full bg-white/20 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
            >
              {isDarkMode ? (
                <Sun className="w-6 h-6 text-yellow-500" />
              ) : (
                <Moon className="w-6 h-6 text-gray-600" />
              )}
            </motion.button>
          </div>
        </nav>

        <div className="container mx-auto px-4 py-8">
          <header className="text-center mb-12">
            <motion.div 
              className="max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <h2 className={`text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg ${
                isDarkMode ? 'text-white' : 'text-white'
              }`}>
                Find Your Perfect Meal
              </h2>
              <p className={`text-lg mb-8 drop-shadow-md ${
                isDarkMode ? 'text-gray-300' : 'text-white/90'
              }`}>
                Discover delicious recipes with ingredients you have at home
              </p>
            </motion.div>
          </header>

          {/* Mama's Words of Love Section */}
          <motion.div 
            className="max-w-4xl mx-auto mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
          >
            <div className={`rounded-2xl p-8 shadow-lg backdrop-blur-sm ${
              isDarkMode 
                ? 'bg-gray-800/50 border border-gray-700' 
                : 'bg-yellow-50/80 border border-orange-200'
            }`}>
              <h3 className={`text-2xl font-bold text-center mb-4 ${
                isDarkMode ? 'text-white' : 'text-gray-800'
              }`}>
                Mama's Words of Love ❤
              </h3>
              <p className={`text-lg italic text-center ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                "{dailyQuote}"
              </p>
            </div>
          </motion.div>

          <SearchBar onSearch={searchRecipes} loading={loading} isDarkMode={isDarkMode} />

          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
          >
            <motion.button
              onClick={getRandomRecipe}
              disabled={loading}
              className="group relative bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="flex items-center space-x-3">
                <motion.span 
                  className="text-2xl"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                >
                  🎲
                </motion.span>
                <span>I'm Feeling Lucky</span>
              </span>
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-400 rounded-2xl blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
            </motion.button>
          </motion.div>

          {searchQuery && (
            <motion.div 
              className="text-center mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className={`text-2xl font-semibold mb-2 drop-shadow-lg ${
                isDarkMode ? 'text-white' : 'text-white'
              }`}>
                {loading ? 'Searching...' : `Results for "${searchQuery}"`}
              </h3>
              <p className={`drop-shadow-md ${
                isDarkMode ? 'text-gray-300' : 'text-white/80'
              }`}>
                {recipes.length} recipe{recipes.length !== 1 ? 's' : ''} found
              </p>
            </motion.div>
          )}

        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent"></div>
          </div>
        )}

        {!loading && recipes.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {recipes.map((recipe) => (
              <RecipeCard
                key={recipe.idMeal}
                recipe={recipe}
                onClick={() => openRecipeModal(recipe)}
                isDarkMode={isDarkMode}
              />
            ))}
          </div>
        )}

          {!loading && recipes.length === 0 && searchQuery && (
            <div className="text-center py-20">
              <div className={`mb-4 ${
                isDarkMode ? 'text-gray-300' : 'text-white/80'
              }`}>
                <ChefHat className={`w-16 h-16 mx-auto mb-4 ${
                  isDarkMode ? 'text-white' : 'text-white'
                }`} />
                <h3 className={`text-xl font-semibold mb-2 drop-shadow-lg ${
                  isDarkMode ? 'text-white' : 'text-white'
                }`}>No recipes found</h3>
                <p className="drop-shadow-md">Try searching for a different ingredient</p>
              </div>
            </div>
          )}

          {!loading && recipes.length === 0 && !searchQuery && (
            <div className="text-center py-20">
              <div className={`mb-4 ${
                isDarkMode ? 'text-gray-300' : 'text-white/80'
              }`}>
                <ChefHat className={`w-16 h-16 mx-auto mb-4 ${
                  isDarkMode ? 'text-white' : 'text-white'
                }`} />
                <h3 className={`text-xl font-semibold mb-2 drop-shadow-lg ${
                  isDarkMode ? 'text-white' : 'text-white'
                }`}>Ready to cook?</h3>
                <p className="drop-shadow-md">Search for an ingredient to get started</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className={`mt-16 py-8 ${
        isDarkMode ? 'bg-gray-800' : 'bg-orange-500'
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-white text-sm">
              Made with ❤ in honor of all mothers.
            </div>
            <div className="flex items-center space-x-2">
              <svg width="24" height="24" viewBox="0 0 48 48" className="text-white">
                <path 
                  d="M24 8C18 8 14 12 14 18V28C14 32 16 36 20 38V42H28V38C32 36 34 32 34 28V18C34 12 30 8 24 8Z" 
                  fill="white"
                />
                <path 
                  d="M20 6C18 4 15 4 13 6C11 8 11 11 13 13L20 20L27 13C29 11 29 8 27 6C25 4 22 4 20 6Z" 
                  fill="#ef4444"
                  opacity="0.8"
                />
              </svg>
              <span className="text-white font-semibold">Mama's Recipe</span>
            </div>
            <div className="text-white text-sm">
              © 2025 Mama's Recipe
            </div>
          </div>
        </div>
      </footer>

      {selectedRecipe && (
        <RecipeModal
          recipe={selectedRecipe}
          onClose={closeRecipeModal}
        />
      )}

      <MamaPopup isDarkMode={isDarkMode} />

      {/* Floating Heart Button */}
      <motion.button
        onClick={createFloatingHearts}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center bg-orange-500 hover:bg-orange-600"
        animate={{ 
          scale: [1, 1.1, 1],
          boxShadow: [
            "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(249, 115, 22, 0.5)",
            "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
          ]
        }}
        transition={{ 
          duration: 6, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Heart className="w-7 h-7 text-white" />
      </motion.button>
    </div>
  )
}

export default App
