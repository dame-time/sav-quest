import { useState } from "react";
import { FiAward, FiCheck, FiClock, FiGift } from "react-icons/fi";

export const RewardsPanel = () => {
    const [dailyChallenges, setDailyChallenges] = useState([
        {
            id: 1,
            title: "Track Your Expenses",
            description: "Record all your expenses for today",
            xp: 20,
            completed: false,
            icon: "📝"
        },
        {
            id: 2,
            title: "Read a Financial Article",
            description: "Learn something new about personal finance",
            xp: 15,
            completed: false,
            icon: "📚"
        },
        {
            id: 3,
            title: "Check Your Budget",
            description: "Review your monthly budget progress",
            xp: 10,
            completed: true,
            icon: "💼"
        }
    ]);

    const [rewards, setRewards] = useState([
        {
            id: 1,
            title: "Premium Template",
            description: "Unlock a premium budget template",
            cost: 100,
            icon: "🏆"
        },
        {
            id: 2,
            title: "Advanced Analytics",
            description: "Unlock advanced spending analytics",
            cost: 250,
            icon: "📊"
        },
        {
            id: 3,
            title: "Custom Badge",
            description: "Create your own custom badge",
            cost: 500,
            icon: "🎨"
        }
    ]);

    const completeChallenge = (id) => {
        setDailyChallenges(prev =>
            prev.map(challenge =>
                challenge.id === id ? { ...challenge, completed: true } : challenge
            )
        );

        // In a real app, you would update the user's XP in the backend
        const challenge = dailyChallenges.find(c => c.id === id);
        if (challenge && !challenge.completed) {
            const progress = JSON.parse(localStorage.getItem("savquest_progress") || "{}");
            progress.xp = (progress.xp || 0) + challenge.xp;
            localStorage.setItem("savquest_progress", JSON.stringify(progress));
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Daily Challenges */}
            <div className="bg-zinc-900/50 border border-zinc-700 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">Daily Challenges</h2>
                    <div className="flex items-center gap-1 text-sm text-zinc-400">
                        <FiClock />
                        <span>Resets in 12h 30m</span>
                    </div>
                </div>

                <div className="space-y-4">
                    {dailyChallenges.map(challenge => (
                        <div
                            key={challenge.id}
                            className={`p-4 border rounded-lg ${challenge.completed
                                    ? "border-green-500 bg-green-900/10"
                                    : "border-zinc-700 bg-zinc-800/50"
                                }`}
                        >
                            <div className="flex items-start gap-3">
                                <div className="text-2xl">{challenge.icon}</div>
                                <div className="flex-1">
                                    <h3 className="font-medium">{challenge.title}</h3>
                                    <p className="text-sm text-zinc-400">{challenge.description}</p>
                                </div>
                                <div className="flex flex-col items-end">
                                    <div className="text-sm font-medium text-blue-400">+{challenge.xp} XP</div>
                                    {challenge.completed ? (
                                        <div className="mt-2 text-green-500 flex items-center gap-1">
                                            <FiCheck />
                                            <span className="text-xs">Completed</span>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => completeChallenge(challenge.id)}
                                            className="mt-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs"
                                        >
                                            Complete
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Rewards Shop */}
            <div className="bg-zinc-900/50 border border-zinc-700 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">Rewards Shop</h2>
                    <div className="flex items-center gap-1 text-sm">
                        <FiAward className="text-yellow-500" />
                        <span>
                            {JSON.parse(localStorage.getItem("savquest_progress") || "{}")?.xp || 0} XP
                        </span>
                    </div>
                </div>

                <div className="space-y-4">
                    {rewards.map(reward => {
                        const userXp = JSON.parse(localStorage.getItem("savquest_progress") || "{}")?.xp || 0;
                        const canAfford = userXp >= reward.cost;

                        return (
                            <div
                                key={reward.id}
                                className={`p-4 border rounded-lg ${canAfford
                                        ? "border-purple-500 bg-purple-900/10"
                                        : "border-zinc-700 bg-zinc-800/50 opacity-70"
                                    }`}
                            >
                                <div className="flex items-start gap-3">
                                    <div className="text-2xl">{reward.icon}</div>
                                    <div className="flex-1">
                                        <h3 className="font-medium">{reward.title}</h3>
                                        <p className="text-sm text-zinc-400">{reward.description}</p>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <div className="text-sm font-medium text-yellow-400">{reward.cost} XP</div>
                                        <button
                                            disabled={!canAfford}
                                            className={`mt-2 px-3 py-1 rounded text-xs flex items-center gap-1 ${canAfford
                                                    ? "bg-purple-600 hover:bg-purple-700"
                                                    : "bg-zinc-700 cursor-not-allowed"
                                                }`}
                                        >
                                            <FiGift />
                                            <span>Redeem</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}; 