import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart } from 'lucide-react'

const MamaPopup = ({ isDarkMode = false }) => {
  const [isVisible, setIsVisible] = useState(false)
  const [hasShownOnce, setHasShownOnce] = useState(false)

  useEffect(() => {
    // Show popup 5 seconds after component mounts
    const timer = setTimeout(() => {
      setIsVisible(true)
      setHasShownOnce(true)
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  const handleClose = () => {
    setIsVisible(false)
  }

  const handleReopen = () => {
    setIsVisible(true)
  }

  const popupVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      x: 100
    },
    visible: {
      opacity: 1,
      scale: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      x: 100,
      transition: {
        duration: 0.3,
        ease: "easeIn"
      }
    }
  }

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  }

  const heartVariants = {
    pulse: {
      scale: [1, 1.1, 1],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  }

  return (
    <>
      {/* Popup Modal */}
      <AnimatePresence>
        {isVisible && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Background Overlay */}
            <motion.div
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="absolute inset-0 bg-black/50"
              onClick={handleClose}
            />
            
            {/* Popup Card */}
            <motion.div
              variants={popupVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className={`relative rounded-3xl shadow-2xl max-w-2xl w-full mx-4 p-8 ${
                isDarkMode 
                  ? 'bg-gray-800 text-gray-100' 
                  : 'bg-yellow-50 text-gray-800'
              }`}
              style={{ backgroundColor: isDarkMode ? '#1f2937' : '#FFF8E7' }}
            >
              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 p-2 hover:bg-black/10 rounded-full transition-all duration-300"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Content */}
              <div className="text-center space-y-6">
                {/* Title */}
                <h1 
                  className="text-4xl md:text-5xl font-bold"
                  style={{ color: '#FF7A00' }}
                >
                  ❤ Thank You Mama
                </h1>

                {/* Message Text */}
                <div className="space-y-4">
                  <p className="text-lg md:text-xl leading-relaxed font-medium">
                    These recipes are dedicated to all the wonderful mothers who have loved us unconditionally since childhood. They fill our lives with care, comfort, and the delicious meals we cherish every day. Mama's love is the secret ingredient that makes every meal special — a love that is timeless, selfless, and always from the heart. 🌸
                  </p>
                </div>

                {/* Close Button */}
                <motion.button
                  onClick={handleClose}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 rounded-full text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                  style={{ backgroundColor: '#FF7A00' }}
                >
                  Close 💕
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Permanent Heart Icon Button */}
      <motion.button
        variants={heartVariants}
        animate="pulse"
        onClick={handleReopen}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
        style={{ backgroundColor: '#FF7A00' }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Heart className="w-7 h-7 text-white" />
      </motion.button>
    </>
  )
}

export default MamaPopup
