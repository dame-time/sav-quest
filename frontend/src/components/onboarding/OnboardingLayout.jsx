import { ProgressIndicator } from "./ProgressIndicator";
import { useOnboarding } from "@/context/OnboardingContext";
import { motion, AnimatePresence } from "framer-motion";
import { GradientGrid } from "@/components/utils/GradientGrid";

export const OnboardingLayout = ({ children, showBackButton = true }) => {
    const { currentStep, prevStep } = useOnboarding();

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-50 relative flex items-center justify-center overflow-hidden">
            {/* Centered horizontal progress indicator */}
            <div className="absolute top-10 left-0 right-0 flex justify-center z-10">
                <ProgressIndicator />
            </div>

            {/* Background grid */}
            <GradientGrid />
            
            {/* Animated background circles */}
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse z-0" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse z-0" 
                 style={{ animationDelay: '1s', animationDuration: '8s' }} />

            {/* Main content */}
            <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10 flex justify-center">
                <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ 
                            opacity: 0, 
                            y: -20, 
                            scale: 0.95,
                            transition: { duration: 0.2 } 
                        }}
                        transition={{ 
                            type: "spring", 
                            stiffness: 300, 
                            damping: 30,
                            duration: 0.5 
                        }}
                        className="max-w-2xl w-full"
                    >
                        {currentStep > 1 && showBackButton && (
                            <motion.button
                                onClick={prevStep}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                className="mb-6 text-zinc-400 hover:text-zinc-200 transition-colors flex items-center"
                                whileHover={{ x: -3 }}
                                whileTap={{ scale: 0.97 }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                Back
                            </motion.button>
                        )}

                        {children}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Step completion confetti effect */}
            <div id="confetti-container" className="fixed inset-0 pointer-events-none z-50"></div>
        </div>
    );
}; 