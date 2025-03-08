import { SplashButton } from "../buttons/SplashButton";
import { useOnboarding } from "@/context/OnboardingContext";
import { motion } from "framer-motion";

export const WelcomeScreen = () => {
    const { nextStep } = useOnboarding();

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center"
        >
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                Welcome to Your Financial Journey!
            </h1>

            <p className="text-xl text-zinc-300 mb-8">
                You've taken the first step toward financial mastery
            </p>

            <p className="text-zinc-400 mb-12 max-w-lg mx-auto">
                SavQuest turns financial learning into a game where you'll earn rewards while building real-world skills
            </p>

            <SplashButton onClick={nextStep} className="mx-auto">
                Let's Get Started
            </SplashButton>
        </motion.div>
    );
}; 