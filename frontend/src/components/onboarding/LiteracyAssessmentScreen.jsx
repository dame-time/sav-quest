import { useOnboarding } from "@/context/OnboardingContext";
import { motion } from "framer-motion";
import { useState } from "react";
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

    const handleContinue = () => {
        updateLiteracyLevel(level);
        nextStep();
    };

    const currentLevel = LITERACY_LEVELS.find(l => l.value === level);

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
                <div className="flex justify-between mb-2">
                    {LITERACY_LEVELS.map((l) => (
                        <div key={l.value} className="text-xs text-zinc-500">
                            {l.value}
                        </div>
                    ))}
                </div>

                <input
                    type="range"
                    min="1"
                    max="5"
                    step="1"
                    value={level}
                    onChange={(e) => setLevel(parseInt(e.target.value))}
                    className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer"
                />

                <div className="mt-8 p-6 border border-blue-500 bg-blue-900/20 rounded-lg">
                    <div className="text-4xl mb-2">{getLevelEmoji(level)}</div>
                    <h3 className="text-xl font-medium text-blue-400">{currentLevel.label}</h3>
                    <p className="text-zinc-300">{currentLevel.description}</p>
                </div>
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