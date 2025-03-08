import { SplashButton } from "../buttons/SplashButton";
import { useOnboarding } from "@/context/OnboardingContext";
import { motion } from "framer-motion";

export const WelcomeScreen = () => {
    const { nextStep } = useOnboarding();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { 
                type: "spring", 
                stiffness: 300, 
                damping: 24 
            }
        }
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center"
        >
            <motion.div className="mb-12" variants={itemVariants}>
                <motion.div 
                    className="w-24 h-24 mx-auto mb-6 rounded-full bg-blue-500/20 flex items-center justify-center"
                    whileHover={{ scale: 1.05, rotate: 5 }}
                    animate={{ 
                        boxShadow: ["0 0 0 0 rgba(59, 130, 246, 0.5)", "0 0 0 10px rgba(59, 130, 246, 0)"],
                    }}
                    transition={{ 
                        boxShadow: { 
                            repeat: Infinity, 
                            duration: 2,
                            repeatType: "loop"
                        }
                    }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </motion.div>
                <motion.h1 
                    className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent"
                    variants={itemVariants}
                >
                    Welcome to Your Financial Journey!
                </motion.h1>
            </motion.div>

            <motion.p 
                className="text-xl text-zinc-300 mb-8"
                variants={itemVariants}
            >
                You've taken the first step toward financial mastery
            </motion.p>

            <motion.p 
                className="text-zinc-400 mb-12 max-w-lg mx-auto"
                variants={itemVariants}
            >
                SavQuest turns financial learning into a game where you'll earn rewards while building real-world skills
            </motion.p>

            <motion.div
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <SplashButton onClick={nextStep} className="mx-auto">
                    Let's Get Started
                </SplashButton>
            </motion.div>
        </motion.div>
    );
}; 