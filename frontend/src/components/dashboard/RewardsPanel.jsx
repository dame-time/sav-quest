import { useState } from "react";
import { FiAward, FiCheck, FiClock, FiGift, FiArrowRight, FiDollarSign, FiInfo } from "react-icons/fi";
import { useNotification } from "@/components/utils/Notification";
import Link from "next/link";
import { getCoinsForLevel } from "@/utils/rewards";

export const RewardsPanel = () => {
    const { showSuccess, showInfo, showError } = useNotification();
    const [dailyChallenges, setDailyChallenges] = useState([
        {
            id: 1,
            title: "Track Your Expenses",
            description: "Record all your expenses for today",
            xp: 20,
            coins: 15,
            completed: false,
            icon: "📝"
        },
        {
            id: 2,
            title: "Read a Financial Article",
            description: "Learn something new about personal finance",
            xp: 15,
            coins: 10,
            completed: false,
            icon: "📚"
        },
        {
            id: 3,
            title: "Check Your Budget",
            description: "Review your monthly budget progress",
            xp: 10,
            coins: 5,
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
            icon: "🏆",
            redeemed: false
        },
        {
            id: 2,
            title: "Advanced Analytics",
            description: "Unlock advanced spending analytics",
            cost: 250,
            icon: "📊",
            redeemed: false
        },
        {
            id: 3,
            title: "Custom Badge",
            description: "Create your own custom badge",
            cost: 500,
            icon: "🎨",
            redeemed: false
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

            // Add coins for completing the challenge
            progress.coins = (progress.coins || 0) + challenge.coins;

            localStorage.setItem("savquest_progress", JSON.stringify(progress));

            // Show success notification
            showSuccess(`Challenge completed! +${challenge.xp} XP and +${challenge.coins} coins earned`);
        }
    };

    const redeemReward = (id) => {
        const reward = rewards.find(r => r.id === id);
        if (!reward) return;

        const progress = JSON.parse(localStorage.getItem("savquest_progress") || "{}");
        const userCoins = progress.coins || 0;

        if (userCoins >= reward.cost && !reward.redeemed) {
            // Deduct coins cost
            progress.coins = userCoins - reward.cost;
            localStorage.setItem("savquest_progress", JSON.stringify(progress));

            // Mark reward as redeemed
            setRewards(prev =>
                prev.map(r =>
                    r.id === id ? { ...r, redeemed: true } : r
                )
            );

            // Show success notification
            showSuccess(`${reward.title} redeemed successfully!`);
        } else if (reward.redeemed) {
            // Show info notification if already redeemed
            showInfo(`You've already redeemed ${reward.title}`);
        } else {
            // Show error notification if not enough coins
            showError(`Not enough coins to redeem ${reward.title}`);
        }
    };

    // Get user progress data
    const progress = JSON.parse(localStorage.getItem("savquest_progress") || "{}");
    const userLevel = progress.level || 1;
    const coinsForNextLevel = getCoinsForLevel(userLevel + 1);

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
                                    <div className="flex flex-col items-end">
                                        <div className="text-sm font-medium text-blue-400">+{challenge.xp} XP</div>
                                        <div className="text-sm font-medium text-yellow-400">+{challenge.coins} coins</div>
                                    </div>
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

                {/* Level Up Coins Info */}
                <div className="mt-6 p-3 bg-blue-900/20 border border-blue-800 rounded-lg flex items-center gap-2">
                    <FiInfo className="text-blue-400 flex-shrink-0" />
                    <p className="text-xs text-blue-300">
                        Reach Level {userLevel + 1} to earn <span className="font-bold text-yellow-400">{coinsForNextLevel} coins</span>!
                    </p>
                </div>
            </div>

            {/* Rewards Shop */}
            <div className="bg-zinc-900/50 border border-zinc-700 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">Rewards Shop</h2>
                    <div className="flex items-center gap-1 text-sm">
                        <FiDollarSign className="text-yellow-500" />
                        <span>
                            {progress.coins || 0} coins
                        </span>
                    </div>
                </div>

                <div className="space-y-4">
                    {rewards.map(reward => {
                        const userCoins = progress.coins || 0;
                        const canAfford = userCoins >= reward.cost && !reward.redeemed;

                        return (
                            <div
                                key={reward.id}
                                className={`p-4 border rounded-lg ${reward.redeemed
                                    ? "border-green-500 bg-green-900/10"
                                    : canAfford
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
                                        <div className="text-sm font-medium text-yellow-400">{reward.cost} coins</div>
                                        {reward.redeemed ? (
                                            <div className="mt-2 text-green-500 flex items-center gap-1">
                                                <FiCheck />
                                                <span className="text-xs">Redeemed</span>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => redeemReward(reward.id)}
                                                disabled={!canAfford}
                                                className={`mt-2 px-3 py-1 rounded text-xs flex items-center gap-1 ${canAfford
                                                    ? "bg-purple-600 hover:bg-purple-700"
                                                    : "bg-zinc-700 cursor-not-allowed"
                                                    }`}
                                            >
                                                <FiGift />
                                                <span>Redeem</span>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Link to full rewards page */}
                <div className="mt-6 text-center">
                    <Link
                        href="/rewards"
                        className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
                    >
                        <span>View all rewards</span>
                        <FiArrowRight />
                    </Link>
                </div>
            </div>
        </div>
    );
}; 