import React from "react";
import { twMerge } from "tailwind-merge";
import { motion } from "framer-motion";

export const SplashButton = ({ children, className, ...rest }) => {
  return (
    <motion.button
      className={twMerge(
        "relative rounded-md bg-gradient-to-br from-blue-400 to-blue-700 px-6 py-3 text-lg font-medium text-zinc-50 shadow-lg transition-all",
        className
      )}
      whileHover={{ 
        scale: 1.05,
        boxShadow: "0 0 15px rgba(59, 130, 246, 0.5)"
      }}
      whileTap={{ scale: 0.95 }}
      initial={{ boxShadow: "0 0 0px rgba(59, 130, 246, 0)" }}
      {...rest}
    >
      <motion.span 
        className="absolute inset-0 rounded-md bg-gradient-to-br from-blue-400/20 to-blue-700/20"
        animate={{ 
          opacity: [0, 0.5, 0],
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          repeatType: "loop"
        }}
      />
      <motion.span 
        className="relative z-10 flex items-center justify-center gap-2"
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {children}
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-5 w-5" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M13 7l5 5m0 0l-5 5m5-5H6" 
          />
        </svg>
      </motion.span>
    </motion.button>
  );
};
