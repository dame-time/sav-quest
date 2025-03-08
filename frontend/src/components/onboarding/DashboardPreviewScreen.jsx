import { useOnboarding } from "@/context/OnboardingContext";
import { motion } from "framer-motion";
import { SplashButton } from "../buttons/SplashButton";

export const DashboardPreviewScreen = () => {
    const { selectedTrait, financialGoals, nextStep } = useOnboarding();

    // Find the selected trait details
    const traitDetails = {
        saver: {
            title: "Saver",
            icon: "💰",
            color: "green",
        },
        investor: {
            title: "Investor",
            icon: "📊",
            color: "purple",
        },
        budgeter: {
            title: "Budgeter",
            icon: "📝",
            color: "yellow",
        },
        scholar: {
            title: "Financial Scholar",
            icon: "🎓",
            color: "blue",
        },
    }[selectedTrait] || { title: "Trait", icon: "✨", color: "blue" };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center"
        >
            <h1 className="text-3xl font-bold mb-4">
                Here's a preview of your financial journey
            </h1>

            <p className="text-zinc-400 mb-8">
                Based on your preferences, we've customized your SavQuest experience
            </p>

            <div className="border border-zinc-700 rounded-lg p-6 mb-12 bg-zinc-900/50 backdrop-blur">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-2">
                        <div className={`text-2xl p-2 rounded-full bg-${traitDetails.color}-500/20 text-${traitDetails.color}-400`}>
                            {traitDetails.icon}
                        </div>
                        <h3 className="font-medium text-lg">
                            {traitDetails.title} Level 1
                        </h3>
                    </div>
                    <div className="text-zinc-400 text-sm">XP: 0/100</div>
                </div>

                <div className="mb-6">
                    <h4 className="text-left font-medium mb-2">Today's Challenges</h4>
                    <div className="space-y-3">
                        {generateChallenges(selectedTrait, financialGoals).map((challenge, index) => (
                            <div key={index} className="flex items-center gap-3 p-3 border border-zinc-700 rounded-lg bg-zinc-800/50">
                                <div className="text-xl">{challenge.icon}</div>
                                <div className="text-left">
                                    <div className="font-medium">{challenge.title}</div>
                                    <div className="text-sm text-zinc-400">{challenge.description}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <h4 className="text-left font-medium mb-2">Leaderboard</h4>
                    <div className="space-y-2">
                        {[
                            { name: "Alex S.", points: 450 },
                            { name: "You", points: 320, isUser: true },
                            { name: "Jamie T.", points: 280 },
                        ].map((user, index) => (
                            <div
                                key={index}
                                className={`flex justify-between items-center p-2 rounded ${user.isUser ? "bg-blue-900/20 border border-blue-500" : ""
                                    }`}
                            >
                                <div className="flex items-center gap-2">
                                    <div className="text-zinc-400">{index + 1}</div>
                                    <div className={user.isUser ? "font-medium text-blue-400" : ""}>{user.name}</div>
                                </div>
                                <div>{user.points} XP</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <SplashButton onClick={nextStep} className="mx-auto">
                Looking good!
            </SplashButton>
        </motion.div>
    );
};

function generateChallenges(trait, goals) {
    const challenges = {
        saver: [
            {
                icon: "🏦",
                title: "Start an Emergency Fund",
                description: "Set aside $50 in a separate savings account"
            },
            {
                icon: "🧮",
                title: "Track Your Expenses",
                description: "Record all spending for 3 days"
            },
        ],
        investor: [
            {
                icon: "📚",
                title: "Investment Basics",
                description: "Complete the intro to investing module"
            },
            {
                icon: "🔍",
                title: "Research a Stock",
                description: "Analyze one company you're interested in"
            },
        ],
        budgeter: [
            {
                icon: "📊",
                title: "Create a Budget",
                description: "Set up your first monthly budget"
            },
            {
                icon: "💸",
                title: "Find One Expense to Cut",
                description: "Identify a subscription you can live without"
            },
        ],
        scholar: [
            {
                icon: "📝",
                title: "Financial Terms Quiz",
                description: "Test your knowledge of basic financial terms"
            },
            {
                icon: "📰",
                title: "Read a Financial Article",
                description: "Learn something new about personal finance"
            },
        ],
    };

    return challenges[trait] || challenges.saver;
} 