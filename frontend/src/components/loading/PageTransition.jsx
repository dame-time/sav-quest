import React from "react";
import { motion } from "framer-motion";

export const PageTransition = ({ children, isLoading }) => {
  return (
    <>
      {/* Page content with fade-in animation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoading ? 0 : 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full"
      >
        {children}
      </motion.div>

      {/* Loading overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoading ? 1 : 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className={`fixed inset-0 z-50 flex items-center justify-center bg-zinc-950 ${
          isLoading ? "" : "pointer-events-none"
        }`}
      >
        <div className="flex flex-col items-center">
          {/* Logo animation */}
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="mb-6 text-4xl font-bold text-blue-500"
          >
            SavQuest
          </motion.div>

          {/* Loading spinner */}
          <div className="relative h-16 w-16">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute inset-0 rounded-full border-b-2 border-t-2 border-blue-500"
            ></motion.div>
            <motion.div
              animate={{ rotate: -360 }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute inset-2 rounded-full border-l-2 border-r-2 border-blue-300"
            ></motion.div>
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="h-2 w-2 rounded-full bg-blue-500"></div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </>
  );
}; 