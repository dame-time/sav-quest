import { useOnboarding } from "@/context/OnboardingContext";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { SplashButton } from "../buttons/SplashButton";

const LITERACY_LEVELS = [
    {
        value: 1,
        label: "Financial Rookie",
        description: "Just starting your financial journey",
    },
    {
        value: 2,
        label: "Budget Beginner",
        description: "Learning the basics of budgeting",
    },
    {
        value: 3,
        label: "Money Manager",
        description: "Comfortable with basic financial concepts",
    },
    {
        value: 4,
        label: "Finance Enthusiast",
        description: "Knowledgeable about various financial topics",
    },
    {
        value: 5,
        label: "Wealth Wizard",
        description: "Advanced understanding of personal finance",
    },
];

export const LiteracyAssessmentScreen = () => {
    const { literacyLevel, updateLiteracyLevel, nextStep } = useOnboarding();
    const [level, setLevel] = useState(literacyLevel);
    const [isDragging, setIsDragging] = useState(false);

    const handleContinue = () => {
        updateLiteracyLevel(level);
        nextStep();
    };

    const currentLevel = LITERACY_LEVELS.find(l => l.value === level);
    
    // Calculate the slider thumb position
    const thumbPosition = ((level - 1) / 4) * 100; // 4 is the range (5-1)

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center"
        >
            <h1 className="text-3xl font-bold mb-4">
                How would you rate your financial knowledge?
            </h1>

            <p className="text-zinc-400 mb-12">
                No matter where you start, SavQuest will help you level up!
            </p>

            <div className="mb-12">
                {/* Level indicators */}
                <div className="flex justify-between mb-2">
                    {LITERACY_LEVELS.map((l) => (
                        <motion.div 
                            key={l.value} 
                            className={`text-xs font-medium transition-colors duration-300 ${
                                l.value === level ? "text-blue-400" : "text-zinc-500"
                            }`}
                            animate={{
                                scale: l.value === level ? 1.2 : 1
                            }}
                            transition={{ duration: 0.3 }}
                        >
                            {l.value}
                        </motion.div>
                    ))}
                </div>

                {/* Custom slider track and thumb */}
                <div className="relative w-full h-10 my-4">
                    {/* Track background */}
                    <div className="absolute top-4 left-0 w-full h-2 bg-zinc-800 rounded-full" />
                    
                    {/* Filled track */}
                    <motion.div 
                        className="absolute top-4 left-0 h-2 bg-blue-500 rounded-full origin-left"
                        style={{ width: "100%" }}
                        animate={{ 
                            scaleX: thumbPosition / 100
                        }}
                        transition={{ duration: 0.3 }}
                    />
                    
                    {/* Slider thumb */}
                    <motion.div
                        className={`absolute top-1.5 w-7 h-7 bg-blue-500 rounded-full shadow-lg cursor-pointer flex items-center justify-center ${
                            isDragging ? "scale-110" : ""
                        }`}
                        style={{ 
                            left: `calc(${thumbPosition}% - 14px)` 
                        }}
                        animate={{ 
                            boxShadow: isDragging 
                                ? "0 0 0 8px rgba(59, 130, 246, 0.2)" 
                                : "0 0 0 0px rgba(59, 130, 246, 0)"
                        }}
                        transition={{ duration: 0.3 }}
                    >
                        <span className="text-white text-xs font-bold">{level}</span>
                    </motion.div>
                    
                    {/* Hidden native input for accessibility */}
                    <input
                        type="range"
                        min="1"
                        max="5"
                        step="1"
                        value={level}
                        onChange={(e) => setLevel(parseInt(e.target.value))}
                        onMouseDown={() => setIsDragging(true)}
                        onMouseUp={() => setIsDragging(false)}
                        onTouchStart={() => setIsDragging(true)}
                        onTouchEnd={() => setIsDragging(false)}
                        className="absolute top-0 left-0 w-full h-10 opacity-0 cursor-pointer"
                    />
                </div>

                {/* Level description card */}
                <motion.div 
                    className="mt-8 p-6 border border-blue-500 bg-blue-900/20 rounded-lg overflow-hidden"
                    animate={{ 
                        borderColor: isDragging ? "#60a5fa" : "#3b82f6",
                        backgroundColor: isDragging ? "rgba(37, 99, 235, 0.2)" : "rgba(30, 58, 138, 0.2)"
                    }}
                    transition={{ duration: 0.3 }}
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={level}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="flex flex-col items-center"
                        >
                            <motion.div 
                                className="text-5xl mb-3"
                                initial={{ scale: 0.5, rotate: -10 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ 
                                    type: "spring", 
                                    stiffness: 300, 
                                    damping: 15 
                                }}
                            >
                                {getLevelEmoji(level)}
                            </motion.div>
                            <motion.h3 
                                className="text-xl font-medium text-blue-400 mb-1"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.1 }}
                            >
                                {currentLevel.label}
                            </motion.h3>
                            <motion.p 
                                className="text-zinc-300"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                {currentLevel.description}
                            </motion.p>
                        </motion.div>
                    </AnimatePresence>
                </motion.div>
            </div>

            <SplashButton onClick={handleContinue} className="mx-auto">
                Continue
            </SplashButton>
        </motion.div>
    );
};

function getLevelEmoji(level) {
    switch (level) {
        case 1: return "🌱";
        case 2: return "🌿";
        case 3: return "🌲";
        case 4: return "🌳";
        case 5: return "🌴";
        default: return "🌱";
    }
} 