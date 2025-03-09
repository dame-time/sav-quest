import Head from "next/head";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { FiAward, FiGift, FiLock, FiInfo, FiStar, FiTrendingUp, FiCoffee, FiShoppingBag, FiBookOpen, FiArrowUp } from "react-icons/fi";
import { GradientGrid } from "@/components/utils/GradientGrid";
import { useNotification } from "@/components/utils/Notification";
import { getCoinsForLevel, getUserTierByLevel } from "@/utils/rewards";

export default function Rewards() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [progress, setProgress] = useState(null);
    const [activeTab, setActiveTab] = useState("all");
    const [activeTier, setActiveTier] = useState("all");
    const { showSuccess, showError, showInfo } = useNotification();

    useEffect(() => {
        // Check if user is authenticated
        const userData = localStorage.getItem("savquest_user");
        if (!userData) {
            router.push("/signup");
            return;
        }

        setUser(JSON.parse(userData));

        // Get progress data
        const progressData = JSON.parse(localStorage.getItem("savquest_progress") || "{}");
        setProgress(progressData);
    }, [router]);

    if (!user || !progress) {
        return (
            <div className="min-h-screen bg-zinc-950 pt-20 relative overflow-hidden">
                <GradientGrid />
                <div className="relative z-10 flex items-center justify-center h-full">
                    Loading...
                </div>
            </div>
        );
    }

    // Define reward tiers
    const tiers = [
        { id: "bronze", name: "Bronze", levelRange: "1-5", color: "text-amber-600", bgColor: "bg-amber-900/20", borderColor: "border-amber-600" },
        { id: "silver", name: "Silver", levelRange: "6-10", color: "text-gray-400", bgColor: "bg-gray-500/20", borderColor: "border-gray-400" },
        { id: "gold", name: "Gold", levelRange: "11-15", color: "text-yellow-400", bgColor: "bg-yellow-500/20", borderColor: "border-yellow-400" },
        { id: "platinum", name: "Platinum", levelRange: "16+", color: "text-cyan-400", bgColor: "bg-cyan-500/20", borderColor: "border-cyan-400" },
    ];

    // Define reward categories
    const categories = [
        { id: "all", name: "All Rewards", icon: <FiGift /> },
        { id: "educational", name: "Educational", icon: <FiBookOpen /> },
        { id: "experience", name: "Experiences", icon: <FiCoffee /> },
        { id: "partner", name: "Partner Rewards", icon: <FiShoppingBag /> },
    ];

    // Define rewards
    const allRewards = [
        // Bronze Tier (Levels 1-5)
        {
            id: "coffee_voucher",
            title: "Free Coffee Voucher",
            description: "Get a free coffee at participating cafes",
            tier: "bronze",
            category: "partner",
            cost: 100,
            levelRequired: 1,
            icon: "☕",
        },
        {
            id: "ebook_finance",
            title: "Financial Basics E-Book",
            description: "Comprehensive guide to personal finance fundamentals",
            tier: "bronze",
            category: "educational",
            cost: 150,
            levelRequired: 2,
            icon: "📚",
        },
        {
            id: "webinar_access",
            title: "Financial Webinar Access",
            description: "Access to a beginner-friendly financial planning webinar",
            tier: "bronze",
            category: "educational",
            cost: 200,
            levelRequired: 3,
            icon: "🎓",
        },
        {
            id: "grocery_discount",
            title: "5% Grocery Discount",
            description: "One-time 5% discount at partner grocery stores",
            tier: "bronze",
            category: "partner",
            cost: 250,
            levelRequired: 4,
            icon: "🛒",
        },

        // Silver Tier (Levels 6-10)
        {
            id: "wework_pass",
            title: "3-Day WeWork Pass",
            description: "Access to any WeWork location for 3 days",
            tier: "silver",
            category: "experience",
            cost: 400,
            levelRequired: 6,
            icon: "🏢",
        },
        {
            id: "amazon_voucher_small",
            title: "$10 Amazon Voucher",
            description: "Digital voucher for Amazon purchases",
            tier: "silver",
            category: "partner",
            cost: 500,
            levelRequired: 7,
            icon: "🛍️",
        },
        {
            id: "financial_workshop",
            title: "Investment Workshop",
            description: "Virtual workshop on investment basics",
            tier: "silver",
            category: "educational",
            cost: 600,
            levelRequired: 8,
            icon: "📊",
        },
        {
            id: "meal_delivery",
            title: "Meal Delivery Credit",
            description: "$15 credit for meal delivery services",
            tier: "silver",
            category: "partner",
            cost: 700,
            levelRequired: 9,
            icon: "🍽️",
        },

        // Gold Tier (Levels 11-15)
        {
            id: "financial_coaching",
            title: "1-on-1 Financial Coaching",
            description: "30-minute session with a financial advisor",
            tier: "gold",
            category: "experience",
            cost: 1000,
            levelRequired: 11,
            icon: "👨‍💼",
        },
        {
            id: "amazon_voucher_medium",
            title: "$25 Amazon Voucher",
            description: "Digital voucher for Amazon purchases",
            tier: "gold",
            category: "partner",
            cost: 1200,
            levelRequired: 12,
            icon: "🛍️",
        },
        {
            id: "premium_course",
            title: "Premium Finance Course",
            description: "Complete course on advanced financial planning",
            tier: "gold",
            category: "educational",
            cost: 1500,
            levelRequired: 13,
            icon: "🎓",
        },

        // Platinum Tier (Levels 16+)
        {
            id: "amazon_voucher_large",
            title: "$50 Amazon Voucher",
            description: "Digital voucher for Amazon purchases",
            tier: "platinum",
            category: "partner",
            cost: 2000,
            levelRequired: 16,
            icon: "🛍️",
        },
        {
            id: "executive_coaching",
            title: "Executive Financial Planning",
            description: "Comprehensive financial planning session",
            tier: "platinum",
            category: "experience",
            cost: 2500,
            levelRequired: 18,
            icon: "💼",
        },
    ];

    // Filter rewards based on active tab and tier
    const filteredRewards = allRewards.filter(reward => {
        const categoryMatch = activeTab === "all" || reward.category === activeTab;
        const tierMatch = activeTier === "all" || reward.tier === activeTier;
        return categoryMatch && tierMatch;
    });

    // Function to determine if a reward is unlocked based on user level
    const isRewardUnlocked = (reward) => {
        return (progress.level || 1) >= reward.levelRequired;
    };

    // Function to redeem a reward
    const redeemReward = (reward) => {
        if (!isRewardUnlocked(reward)) {
            showError(`You need to reach level ${reward.levelRequired} to unlock this reward`);
            return;
        }

        const userCoins = progress.coins || 0;

        if (userCoins < reward.cost) {
            showError(`Not enough coins! You need ${reward.cost - userCoins} more coins`);
            return;
        }

        // Update user's coins in localStorage
        const updatedProgress = { ...progress };
        updatedProgress.coins = userCoins - reward.cost;

        // Add to redeemed rewards if not already there
        if (!updatedProgress.redeemedRewards) {
            updatedProgress.redeemedRewards = [];
        }

        // Check if already redeemed
        const alreadyRedeemed = updatedProgress.redeemedRewards.some(r => r.id === reward.id);
        if (alreadyRedeemed) {
            showInfo("You've already redeemed this reward");
            return;
        }

        // Add to redeemed rewards with timestamp
        updatedProgress.redeemedRewards.push({
            ...reward,
            redeemedAt: new Date().toISOString()
        });

        // Save updated progress
        localStorage.setItem("savquest_progress", JSON.stringify(updatedProgress));
        setProgress(updatedProgress);

        showSuccess(`Successfully redeemed ${reward.title}!`);
    };

    // Get user's current tier based on level
    const getUserTier = () => {
        return getUserTierByLevel(progress.level || 1);
    };

    const userTier = getUserTier();

    // Calculate coins for next level
    const coinsForNextLevel = getCoinsForLevel((progress.level || 1) + 1);

    return (
        <>
            <Head>
                <title>Rewards | SavQuest</title>
            </Head>
            <div className="min-h-screen bg-zinc-950 text-zinc-50 pt-24 relative overflow-hidden">
                <GradientGrid />
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Header Section */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold">Rewards Marketplace</h1>
                        <p className="text-zinc-400 mt-2">Redeem your coins for real-world rewards and benefits</p>
                    </div>

                    {/* User Stats */}
                    <div className="bg-zinc-900/50 border border-zinc-700 rounded-lg p-6 mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-full ${userTier.bgColor}`}>
                                    <FiStar className={`text-2xl ${userTier.color}`} />
                                </div>
                                <div>
                                    <p className="text-zinc-400 text-sm">Your Tier</p>
                                    <p className={`text-xl font-bold ${userTier.color}`}>{userTier.name}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-full bg-yellow-900/20">
                                    <FiAward className="text-2xl text-yellow-500" />
                                </div>
                                <div>
                                    <p className="text-zinc-400 text-sm">Your Coins</p>
                                    <p className="text-xl font-bold text-yellow-500">{progress.coins || 0}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-full bg-blue-900/20">
                                    <FiTrendingUp className="text-2xl text-blue-500" />
                                </div>
                                <div>
                                    <p className="text-zinc-400 text-sm">Your Level</p>
                                    <p className="text-xl font-bold text-blue-500">Level {progress.level || 1}</p>
                                </div>
                            </div>
                        </div>

                        {/* Next Level Coins Info */}
                        <div className="mt-6 p-4 bg-blue-900/20 border border-blue-800 rounded-lg flex items-center gap-3">
                            <FiArrowUp className="text-blue-400 text-xl" />
                            <div>
                                <p className="text-blue-300">
                                    <span className="font-bold">Level Up Bonus:</span> You'll earn <span className="font-bold text-yellow-400">{coinsForNextLevel} coins</span> when you reach Level {(progress.level || 1) + 1}!
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* How to Earn Coins Section */}
                    <div className="bg-zinc-900/50 border border-zinc-700 rounded-lg p-6 mb-8">
                        <div className="flex items-center gap-2 mb-4">
                            <FiInfo className="text-blue-400" />
                            <h2 className="text-xl font-bold">How to Earn Coins</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="p-4 bg-zinc-800/50 rounded-lg">
                                <div className="text-2xl mb-2">🎯</div>
                                <h3 className="font-medium mb-1">Complete Challenges</h3>
                                <p className="text-sm text-zinc-400">Earn coins by completing daily and weekly challenges</p>
                            </div>

                            <div className="p-4 bg-zinc-800/50 rounded-lg">
                                <div className="text-2xl mb-2">🔥</div>
                                <h3 className="font-medium mb-1">Maintain Streaks</h3>
                                <p className="text-sm text-zinc-400">Keep your login streak going for bonus coins</p>
                            </div>

                            <div className="p-4 bg-zinc-800/50 rounded-lg">
                                <div className="text-2xl mb-2">📚</div>
                                <h3 className="font-medium mb-1">Learn & Level Up</h3>
                                <p className="text-sm text-zinc-400">Complete learning modules to earn XP and level up</p>
                            </div>

                            <div className="p-4 bg-zinc-800/50 rounded-lg">
                                <div className="text-2xl mb-2">🏆</div>
                                <h3 className="font-medium mb-1">Unlock Achievements</h3>
                                <p className="text-sm text-zinc-400">Earn coins when you unlock new achievements</p>
                            </div>
                        </div>

                        {/* Level-up Coins Table */}
                        <div className="mt-6">
                            <h3 className="font-medium mb-3 text-blue-300">Coins Earned Per Level</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="bg-zinc-800">
                                            <th className="px-4 py-2 text-left">Level</th>
                                            <th className="px-4 py-2 text-left">Coins Earned</th>
                                            <th className="px-4 py-2 text-left">Tier</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {[1, 2, 3, 5, 6, 10, 11, 15, 16, 20].map(level => {
                                            const tier = getUserTierByLevel(level);
                                            return (
                                                <tr key={level} className="border-t border-zinc-700">
                                                    <td className="px-4 py-2">Level {level}</td>
                                                    <td className="px-4 py-2 text-yellow-400 font-medium">{getCoinsForLevel(level)} coins</td>
                                                    <td className={`px-4 py-2 ${tier.color}`}>{tier.name}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                            <p className="mt-2 text-xs text-zinc-400">Formula: 50 base coins + (level × 25)</p>
                        </div>
                    </div>

                    {/* Filter Tabs */}
                    <div className="mb-6">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex overflow-x-auto pb-2 sm:pb-0 gap-2">
                                {categories.map(category => (
                                    <button
                                        key={category.id}
                                        onClick={() => setActiveTab(category.id)}
                                        className={`px-4 py-2 rounded-full flex items-center gap-2 whitespace-nowrap ${activeTab === category.id
                                            ? "bg-blue-600 text-white"
                                            : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                                            }`}
                                    >
                                        {category.icon}
                                        {category.name}
                                    </button>
                                ))}
                            </div>

                            <div className="flex overflow-x-auto pb-2 sm:pb-0 gap-2">
                                <button
                                    onClick={() => setActiveTier("all")}
                                    className={`px-4 py-2 rounded-full whitespace-nowrap ${activeTier === "all"
                                        ? "bg-blue-600 text-white"
                                        : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                                        }`}
                                >
                                    All Tiers
                                </button>

                                {tiers.map(tier => (
                                    <button
                                        key={tier.id}
                                        onClick={() => setActiveTier(tier.id)}
                                        className={`px-4 py-2 rounded-full whitespace-nowrap ${activeTier === tier.id
                                            ? `${tier.bgColor} ${tier.color} ${tier.borderColor} border`
                                            : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                                            }`}
                                    >
                                        {tier.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Rewards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredRewards.length > 0 ? (
                            filteredRewards.map(reward => {
                                const unlocked = isRewardUnlocked(reward);
                                const redeemed = progress.redeemedRewards?.some(r => r.id === reward.id);
                                const canAfford = (progress.coins || 0) >= reward.cost;

                                // Find the tier object for this reward
                                const rewardTier = tiers.find(t => t.id === reward.tier);

                                return (
                                    <div
                                        key={reward.id}
                                        className={`bg-zinc-900/50 border rounded-lg overflow-hidden ${!unlocked
                                            ? "border-zinc-700 opacity-70"
                                            : redeemed
                                                ? "border-green-500"
                                                : rewardTier.borderColor
                                            }`}
                                    >
                                        <div className={`p-3 ${rewardTier.bgColor} flex justify-between items-center`}>
                                            <span className={`font-medium ${rewardTier.color}`}>{rewardTier.name} Tier</span>
                                            <span className="text-sm bg-zinc-800 px-2 py-1 rounded">Level {reward.levelRequired}+</span>
                                        </div>

                                        <div className="p-6">
                                            <div className="flex items-start gap-4">
                                                <div className="text-3xl">{reward.icon}</div>
                                                <div className="flex-1">
                                                    <h3 className="font-bold text-lg">{reward.title}</h3>
                                                    <p className="text-zinc-400 text-sm">{reward.description}</p>

                                                    <div className="mt-4 flex items-center justify-between">
                                                        <div className="flex items-center gap-1">
                                                            <FiAward className="text-yellow-500" />
                                                            <span className="font-bold text-yellow-500">{reward.cost} coins</span>
                                                        </div>

                                                        {!unlocked ? (
                                                            <button
                                                                className="px-4 py-2 bg-zinc-700 rounded flex items-center gap-2 opacity-70 cursor-not-allowed"
                                                                disabled
                                                            >
                                                                <FiLock />
                                                                <span>Locked</span>
                                                            </button>
                                                        ) : redeemed ? (
                                                            <button
                                                                className="px-4 py-2 bg-green-600 rounded flex items-center gap-2 cursor-default"
                                                                disabled
                                                            >
                                                                <FiAward />
                                                                <span>Redeemed</span>
                                                            </button>
                                                        ) : (
                                                            <button
                                                                onClick={() => redeemReward(reward)}
                                                                disabled={!canAfford}
                                                                className={`px-4 py-2 rounded flex items-center gap-2 ${canAfford
                                                                    ? "bg-blue-600 hover:bg-blue-700"
                                                                    : "bg-zinc-700 opacity-70 cursor-not-allowed"
                                                                    }`}
                                                            >
                                                                <FiGift />
                                                                <span>Redeem</span>
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="col-span-full text-center py-12">
                                <div className="text-4xl mb-4">🔍</div>
                                <h3 className="text-xl font-medium mb-2">No rewards found</h3>
                                <p className="text-zinc-400">Try changing your filters to see more rewards</p>
                            </div>
                        )}
                    </div>

                    {/* Redeemed Rewards Section */}
                    {progress.redeemedRewards && progress.redeemedRewards.length > 0 && (
                        <div className="mt-12">
                            <h2 className="text-2xl font-bold mb-6">Your Redeemed Rewards</h2>

                            <div className="bg-zinc-900/50 border border-zinc-700 rounded-lg p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {progress.redeemedRewards.map((reward, index) => (
                                        <div key={`${reward.id}-${index}`} className="flex items-center gap-4 p-4 bg-zinc-800/50 rounded-lg">
                                            <div className="text-3xl">{reward.icon}</div>
                                            <div className="flex-1">
                                                <h3 className="font-medium">{reward.title}</h3>
                                                <p className="text-sm text-zinc-400">
                                                    Redeemed on {new Date(reward.redeemedAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="px-3 py-1 bg-green-900/20 text-green-400 rounded-full text-xs">
                                                Redeemed
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
} 