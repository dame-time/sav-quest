import { motion } from "framer-motion";
import { useOnboarding } from "@/context/OnboardingContext";

export const ProgressIndicator = () => {
    const { currentStep, totalSteps } = useOnboarding();
    
    // Calculate progress percentage
    const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;
    
    return (
        <div className="w-full py-6 px-4 z-10">
            <div className="max-w-md mx-auto">
                {/* Simple progress bar container */}
                <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                    {/* Animated progress fill - only animates on initial render */}
                    <motion.div 
                        className="h-full bg-blue-500 rounded-full"
                        initial={{ width: "0%" }}
                        animate={{ width: `${progressPercentage}%` }}
                        transition={{ 
                            duration: 0.5, 
                            ease: "easeInOut"
                        }}
                        // Disable exit animations
                        exit={{ width: `${progressPercentage}%` }}
                    />
                </div>
                
                {/* Optional: Step counter text */}
                <div className="mt-2 text-xs text-right text-zinc-400">
                    Step {currentStep} of {totalSteps}
                </div>
            </div>
        </div>
    );
}; 