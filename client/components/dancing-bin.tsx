"use client"

import { motion } from "framer-motion"

export function DancingBin() {
  return (
    <div className="flex justify-center items-center">
      <motion.div
        className="relative"
        animate={{
          y: [0, -10, 0],
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      >
        {/* Bin Body */}
        <motion.div
          className="w-16 h-20 sm:w-20 sm:h-24 bg-gradient-to-b from-green-500 to-green-600 rounded-lg relative shadow-lg"
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 1.5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          {/* Bin Lid */}
          <motion.div
            className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-18 h-3 sm:w-22 sm:h-4 bg-green-700 rounded-full shadow-md"
            animate={{
              rotateX: [0, 15, 0],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />

          {/* Bin Handle */}
          <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-8 h-2 sm:w-10 sm:h-3 bg-green-800 rounded-full" />

          {/* Recycle Symbol */}
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-lg sm:text-xl"
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          >
            ♻️
          </motion.div>

          {/* Sparkles */}
          <motion.div
            className="absolute -top-4 -left-2 text-yellow-400 text-xs sm:text-sm"
            animate={{
              scale: [0, 1, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 1,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            ✨
          </motion.div>

          <motion.div
            className="absolute -top-3 -right-3 text-yellow-400 text-xs sm:text-sm"
            animate={{
              scale: [0, 1, 0],
              rotate: [360, 180, 0],
            }}
            transition={{
              duration: 1.2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: 0.5,
            }}
          >
            ✨
          </motion.div>

          <motion.div
            className="absolute top-1/4 -left-4 text-green-300 text-xs sm:text-sm"
            animate={{
              scale: [0, 1, 0],
              x: [0, 5, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: 0.8,
            }}
          >
            💚
          </motion.div>
        </motion.div>

        {/* Shadow */}
        <motion.div
          className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-12 h-2 sm:w-16 sm:h-3 bg-gray-300 rounded-full opacity-30"
          animate={{
            scaleX: [1, 1.1, 1],
            opacity: [0.3, 0.2, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      </motion.div>
    </div>
  )
}
