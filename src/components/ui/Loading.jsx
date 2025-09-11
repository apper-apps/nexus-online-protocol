import React from "react"
import { motion } from "framer-motion"

const Loading = ({ text = "Loading...", className = "" }) => {
  return (
    <div className={`flex flex-col items-center justify-center p-12 ${className}`}>
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-4 border-gray-200"></div>
        <motion.div
          className="absolute top-0 left-0 w-12 h-12 rounded-full border-4 border-transparent border-t-primary-600"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mt-4 text-sm text-gray-600 font-medium"
      >
        {text}
      </motion.p>
    </div>
  )
}

export default Loading