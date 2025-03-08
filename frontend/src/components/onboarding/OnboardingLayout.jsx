import { ProgressIndicator } from "./ProgressIndicator";
import { useOnboarding } from "@/context/OnboardingContext";
import { motion } from "framer-motion";

export const OnboardingLayout = ({ children, showBackButton = true }) => {
    const { currentStep, prevStep } = useOnboarding();

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-50 relative">
            <ProgressIndicator />

            <div className="absolute inset-0 bg-grid-zinc-700/50 z-0" />
            <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/0 to-zinc-950 z-0" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-2xl mx-auto"
                >
                    {currentStep > 1 && showBackButton && (
                        <button
                            onClick={prevStep}
                            className="mb-6 text-zinc-400 hover:text-zinc-200 transition-colors"
                        >
                            ← Back
                        </button>
                    )}

                    {children}
                </motion.div>
            </div>
        </div>
    );
}; 