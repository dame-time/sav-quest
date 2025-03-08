import { motion } from "framer-motion";
import { useOnboarding } from "@/context/OnboardingContext";

export const ProgressIndicator = () => {
    const { currentStep, totalSteps } = useOnboarding();

    return (
        <div className="fixed left-8 top-1/2 -translate-y-1/2 hidden md:block">
            <div className="relative h-80 w-16">
                {/* Rocket Track */}
                <div className="absolute left-1/2 top-0 h-full w-1 -translate-x-1/2 rounded-full bg-zinc-800"></div>

                {/* Step Markers */}
                {Array.from({ length: totalSteps }).map((_, index) => {
                    const stepNumber = index + 1;
                    const isCompleted = stepNumber < currentStep;
                    const isCurrent = stepNumber === currentStep;

                    return (
                        <div
                            key={stepNumber}
                            className={`absolute left-1/2 -translate-x-1/2 size-3 rounded-full ${isCompleted
                                    ? "bg-blue-500"
                                    : isCurrent
                                        ? "bg-blue-400"
                                        : "bg-zinc-700"
                                }`}
                            style={{
                                top: `${(index / (totalSteps - 1)) * 100}%`,
                            }}
                        />
                    );
                })}

                {/* Rocket Ship */}
                <motion.div
                    className="absolute left-1/2 -translate-x-1/2 z-10"
                    initial={{ top: "0%" }}
                    animate={{
                        top: `${((currentStep - 1) / (totalSteps - 1)) * 100}%`
                    }}
                >
                    <div className="relative -ml-6 -mt-6">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2L12 6" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" />
                            <path d="M12 18L12 22" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" />
                            <path d="M4.93 4.93L7.76 7.76" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" />
                            <path d="M16.24 16.24L19.07 19.07" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" />
                            <path d="M2 12L6 12" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" />
                            <path d="M18 12L22 12" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" />
                            <path d="M4.93 19.07L7.76 16.24" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" />
                            <path d="M16.24 7.76L19.07 4.93" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" />
                            <circle cx="12" cy="12" r="4" fill="#3B82F6" />
                        </svg>
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-6 h-10 bg-gradient-to-b from-blue-500 to-transparent opacity-50 rounded-full blur-sm" />
                    </div>
                </motion.div>
            </div>
        </div>
    );
}; 