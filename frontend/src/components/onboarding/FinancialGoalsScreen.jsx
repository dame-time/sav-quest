import { useOnboarding } from "@/context/OnboardingContext";
import { motion } from "framer-motion";
import { useState } from "react";
import { SplashButton } from "../buttons/SplashButton";

const GOALS = [
    {
        id: "home",
        title: "Saving for a home",
        description: "Build a nest egg for your dream home",
        icon: "🏠",
    },
    {
        id: "debt",
        title: "Reducing debt",
        description: "Pay down loans and credit cards faster",
        icon: "💸",
    },
    {
        id: "emergency",
        title: "Building emergency fund",
        description: "Create a safety net for unexpected expenses",
        icon: "🛡️",
    },
    {
        id: "literacy",
        title: "Becoming more financially literate",
        description: "Learn the fundamentals of personal finance",
        icon: "📚",
    },
    {
        id: "investing",
        title: "Investing for the future",
        description: "Grow your wealth through smart investments",
        icon: "📈",
    },
    {
        id: "other",
        title: "Other",
        description: "Tell us your specific financial goal",
        icon: "🎯",
    },
];

export const FinancialGoalsScreen = () => {
    const { financialGoals, updateGoals, nextStep } = useOnboarding();
    const [selectedGoals, setSelectedGoals] = useState(financialGoals);
    const [otherGoal, setOtherGoal] = useState("");

    const toggleGoal = (goalId) => {
        setSelectedGoals((prev) => {
            if (prev.includes(goalId)) {
                return prev.filter(id => id !== goalId);
            } else {
                if (prev.length < 3) {
                    return [...prev, goalId];
                }
                return prev;
            }
        });
    };

    const handleContinue = () => {
        updateGoals(selectedGoals);
        nextStep();
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <h1 className="text-3xl font-bold mb-4 text-center">
                What brings you to SavQuest?
            </h1>

            <p className="text-zinc-400 mb-8 text-center">
                Select up to 3 financial goals that matter most to you
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {GOALS.map((goal) => (
                    <GoalCard
                        key={goal.id}
                        goal={goal}
                        selected={selectedGoals.includes(goal.id)}
                        onClick={() => toggleGoal(goal.id)}
                    />
                ))}
            </div>

            {selectedGoals.includes("other") && (
                <div className="mb-8">
                    <input
                        type="text"
                        value={otherGoal}
                        onChange={(e) => setOtherGoal(e.target.value)}
                        placeholder="Tell us your specific goal..."
                        className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-md text-zinc-100"
                    />
                </div>
            )}

            <SplashButton
                onClick={handleContinue}
                className="mx-auto"
                disabled={selectedGoals.length === 0}
            >
                Continue
            </SplashButton>
        </motion.div>
    );
};

const GoalCard = ({ goal, selected, onClick }) => {
    return (
        <div
            onClick={onClick}
            className={`
        p-4 rounded-lg border cursor-pointer transition-all
        ${selected
                    ? "border-blue-500 bg-blue-900/20"
                    : "border-zinc-700 bg-zinc-800/50 hover:bg-zinc-800"}
      `}
        >
            <div className="flex items-start gap-3">
                <div className="text-3xl">{goal.icon}</div>
                <div>
                    <h3 className="font-medium text-zinc-100">{goal.title}</h3>
                    <p className="text-sm text-zinc-400">{goal.description}</p>
                </div>
            </div>
        </div>
    );
}; 