import Head from "next/head";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useOnboarding } from "@/context/OnboardingContext";
import { RewardsPanel } from "@/components/dashboard/RewardsPanel";
import { SmartTransactionFeed } from "@/components/dashboard/SmartTransactionFeed";
import { FinancialHabitTracker } from "@/components/dashboard/FinancialHabitTracker";
import { FiAward, FiTrendingUp, FiCalendar, FiStar, FiUnlock, FiInfo, FiGift, FiDollarSign } from "react-icons/fi";
import { GradientGrid } from "@/components/utils/GradientGrid";
import Link from "next/link";
import { getCoinsForLevel } from "@/utils/rewards";

export default function Dashboard() {
    const { completed } = useOnboarding();
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [progress, setProgress] = useState(null);

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

        // If no progress data exists, create default data
        if (!progressData.traits) {
            const defaultProgress = {
                streak: 3,
                xp: 120,
                level: 2,
                nextLevelXp: 200,
                coins: 150,
                badges: [
                    { id: "first_login", name: "First Login", description: "Logged in for the first time", unlocked: true, icon: "🏆", date: "2023-11-01" },
                    { id: "profile_complete", name: "Profile Complete", description: "Completed your profile information", unlocked: true, icon: "📝", date: "2023-11-02" },
                    { id: "first_challenge", name: "Challenge Accepted", description: "Completed your first challenge", unlocked: false, icon: "🎯" },
                    { id: "streak_3", name: "On Fire", description: "Maintained a 3-day streak", unlocked: true, icon: "🔥", date: "2023-11-03" },
                    { id: "saver_level_2", name: "Saving Pro", description: "Reached Level 2 as a Saver", unlocked: true, icon: "💰", date: "2023-11-04" },
                ],
                traits: {
                    saver: { level: 2, xp: 45, maxXp: 100 },
                    investor: { level: 1, xp: 25, maxXp: 100 },
                    planner: { level: 2, xp: 40, maxXp: 100 },
                    knowledgeable: { level: 1, xp: 30, maxXp: 100 }
                }
            };
            localStorage.setItem("savquest_progress", JSON.stringify(defaultProgress));
            setProgress(defaultProgress);
        } else {
            // Convert any numeric traits to object format
            const updatedProgressData = { ...progressData };

            if (updatedProgressData.traits) {
                Object.keys(updatedProgressData.traits).forEach(traitId => {
                    const traitValue = updatedProgressData.traits[traitId];

                    if (typeof traitValue === 'number') {
                        // Convert numeric value to object format
                        updatedProgressData.traits[traitId] = {
                            level: Math.max(1, Math.floor(traitValue / 20)), // 0-20 = level 1, 21-40 = level 2, etc.
                            xp: (traitValue % 20) * 5, // Convert remaining points to XP
                            maxXp: 100
                        };
                    }
                });

                // Save the updated format back to localStorage
                localStorage.setItem("savquest_progress", JSON.stringify(updatedProgressData));
            }

            setProgress(updatedProgressData);
        }
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

    const traits = [
        {
            id: "saver",
            name: "Saver",
            icon: "💰",
            color: "green",
            bgColor: "rgba(22, 163, 74, 0.2)",
            textColor: "#22c55e",
            barColor: "#22c55e"
        },
        {
            id: "investor",
            name: "Investor",
            icon: "📊",
            color: "purple",
            bgColor: "rgba(147, 51, 234, 0.2)",
            textColor: "#a855f7",
            barColor: "#a855f7"
        },
        {
            id: "planner",
            name: "Planner",
            icon: "📝",
            color: "yellow",
            bgColor: "rgba(234, 179, 8, 0.2)",
            textColor: "#eab308",
            barColor: "#eab308"
        },
        {
            id: "knowledgeable",
            name: "Financial Scholar",
            icon: "🎓",
            color: "blue",
            bgColor: "rgba(59, 130, 246, 0.2)",
            textColor: "#3b82f6",
            barColor: "#3b82f6"
        }
    ];

    // Get unlocked badges and sort by date (most recent first)
    const unlockedBadges = progress.badges
        ? progress.badges
            .filter(badge => badge.unlocked)
            .sort((a, b) => new Date(b.date) - new Date(a.date))
        : [];

    // Calculate XP progress percentage for the level progress bar
    const xpProgressPercentage = progress.nextLevelXp
        ? (progress.xp / progress.nextLevelXp) * 100
        : (progress.xp % 100);

    return (
        <>
            <Head>
                <title>SavQuest Dashboard</title>
            </Head>
            <div className="min-h-screen bg-zinc-950 text-zinc-50 pt-24 relative overflow-hidden">
                <GradientGrid />
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold">Welcome back, {user.username}!</h1>
                            <p className="text-zinc-400 mt-1">Your financial journey continues</p>

                            {/* Display preset profile info if available */}
                            {user.presetName && (
                                <div className="mt-2 inline-flex items-center gap-1 bg-blue-900/30 text-blue-300 px-3 py-1 rounded-full text-xs">
                                    <FiInfo className="text-blue-400" />
                                    <span>Profile Type: {user.presetName}</span>
                                </div>
                            )}
                        </div>
                        <div className="mt-4 md:mt-0 flex items-center gap-4">
                            <div className="bg-zinc-800 px-4 py-2 rounded-lg flex items-center gap-2">
                                <span className="text-orange-500">🔥</span>
                                <span>{progress.streakDays || progress.streak || 0}-day streak</span>
                            </div>
                            <div className="bg-zinc-800 px-4 py-2 rounded-lg flex items-center gap-2">
                                <span className="text-blue-500">✨</span>
                                <span>Level {progress.level || 1}</span>
                            </div>
                            <Link href="/rewards" className="bg-gradient-to-r from-yellow-600 to-amber-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:from-yellow-500 hover:to-amber-400 transition-all">
                                <FiGift />
                                <span>Rewards</span>
                            </Link>
                        </div>
                    </div>

                    {/* Main XP Display with Trait Progress */}
                    <div className="bg-zinc-900/50 border border-zinc-700 rounded-lg p-6 mb-8">
                        <div className="flex flex-col md:flex-row items-center justify-between mb-4">
                            <div className="flex items-center gap-4 mb-4 md:mb-0">
                                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-2xl">
                                    <FiTrendingUp />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold">Total XP: {progress.xp || 0}</h2>
                                    <p className="text-zinc-400">Level {progress.level || 1}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-2">
                                    <span className="text-orange-500">🔥</span>
                                    <span className="font-medium">{progress.streakDays || progress.streak || 0}-day streak</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FiAward className="text-purple-500" />
                                    <span className="font-medium">
                                        {unlockedBadges.length} badges
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FiDollarSign className="text-yellow-500" />
                                    <span className="font-medium">
                                        {progress.coins || 0} coins
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Main progress bar */}
                        <div className="w-full h-3 bg-zinc-800 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-blue-500 rounded-full"
                                style={{ width: `${xpProgressPercentage}%` }}
                            ></div>
                        </div>
                        <div className="flex justify-between mt-2 mb-4 text-sm text-zinc-400">
                            <span>Level {progress.level || 1}</span>
                            <span>{progress.xp}/{progress.nextLevelXp || 100} XP to Level {(progress.level || 1) + 1}</span>
                        </div>

                        {/* Level up reward info */}
                        <div className="mb-8 p-3 bg-blue-900/20 border border-blue-800 rounded-lg flex items-center gap-3">
                            <FiInfo className="text-blue-400" />
                            <div className="text-sm text-blue-300">
                                When you reach Level {(progress.level || 1) + 1}, you'll earn <span className="font-bold text-yellow-400">{getCoinsForLevel((progress.level || 1) + 1)} coins</span>!
                            </div>
                        </div>

                        <div className="border-t border-zinc-700 pt-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Traits Section */}
                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    <FiStar className="text-yellow-400" />
                                    <h3 className="text-lg font-bold">Financial Traits</h3>
                                </div>

                                <div className="space-y-5">
                                    {traits.map(trait => {
                                        // Get trait value from the progress data
                                        const traitValue = progress.traits?.[trait.id];

                                        // Ensure trait is in object format
                                        const traitObj = typeof traitValue === 'number'
                                            ? {
                                                level: Math.max(1, Math.floor(traitValue / 20)),
                                                xp: traitValue,
                                                maxXp: 100
                                            }
                                            : traitValue || { level: 1, xp: 0, maxXp: 100 };

                                        // Calculate progress percentage for the bar
                                        const progressPercentage = typeof traitValue === 'number'
                                            ? traitValue
                                            : traitObj ? (traitObj.xp / traitObj.maxXp) * 100 : 0;

                                        return (
                                            <div key={trait.id} className="flex items-center gap-3">
                                                <div
                                                    className="text-lg p-2 rounded-full flex-shrink-0"
                                                    style={{
                                                        backgroundColor: trait.bgColor,
                                                        color: trait.textColor
                                                    }}
                                                >
                                                    {trait.icon}
                                                </div>

                                                <div className="flex-grow">
                                                    <div className="flex justify-between items-center mb-1.5">
                                                        <span
                                                            className="font-semibold"
                                                            style={{ color: trait.textColor }}
                                                        >
                                                            {trait.name}
                                                        </span>
                                                        <span className="text-xs bg-zinc-800 px-2 py-0.5 rounded-full text-zinc-300">
                                                            {typeof traitValue === 'object' && traitValue !== null
                                                                ? `Level ${traitValue.level || 1}`
                                                                : typeof traitValue === 'number'
                                                                    ? `Level ${Math.max(1, Math.floor(traitValue / 20))}`
                                                                    : 'Level 1'}
                                                        </span>
                                                    </div>

                                                    <div className="w-full h-2.5 bg-zinc-800 rounded-full overflow-hidden relative">
                                                        <div
                                                            className="h-full rounded-full"
                                                            style={{
                                                                width: `${progressPercentage}%`,
                                                                backgroundColor: trait.barColor
                                                            }}
                                                        ></div>

                                                        {/* Level markers */}
                                                        <div className="absolute inset-0 flex justify-between items-center px-0">
                                                            {[20, 40, 60, 80].map(level => (
                                                                <div
                                                                    key={level}
                                                                    className="w-px h-2.5 bg-zinc-700"
                                                                    style={{ marginLeft: `${level}%` }}
                                                                ></div>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* Level numbers */}
                                                    <div className="flex justify-between mt-0.5 text-xs text-zinc-500">
                                                        <span>0</span>
                                                        <span>20</span>
                                                        <span>40</span>
                                                        <span>60</span>
                                                        <span>80</span>
                                                        <span>100</span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Recent Achievements Section */}
                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    <FiUnlock className="text-purple-400" />
                                    <h3 className="text-lg font-bold">Recent Achievements</h3>
                                </div>

                                {unlockedBadges.length > 0 ? (
                                    <div className="space-y-3">
                                        {unlockedBadges.slice(0, 4).map(badge => (
                                            <div key={badge.id} className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-3 flex items-center gap-3">
                                                <div className="text-2xl">{badge.icon}</div>
                                                <div className="flex-grow">
                                                    <h4 className="font-medium">{badge.name}</h4>
                                                    <p className="text-sm text-zinc-400">{badge.description}</p>
                                                </div>
                                                <div className="text-xs text-zinc-500">
                                                    {new Date(badge.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                </div>
                                            </div>
                                        ))}

                                        {unlockedBadges.length > 4 && (
                                            <div className="text-center mt-2">
                                                <a href="/profile" className="text-blue-400 hover:text-blue-300 text-sm">
                                                    View all {unlockedBadges.length} badges →
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-6 text-center">
                                        <p className="text-zinc-400">Complete challenges to earn badges!</p>
                                    </div>
                                )}

                                {/* Upcoming Achievements */}
                                <div className="mt-6">
                                    <h4 className="text-sm font-medium text-zinc-400 mb-3">Upcoming Achievements</h4>
                                    <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-3 flex items-center gap-3">
                                        <div className="text-2xl opacity-50">🎯</div>
                                        <div className="flex-grow">
                                            <h4 className="font-medium text-zinc-300">Challenge Accepted</h4>
                                            <p className="text-sm text-zinc-500">Complete your first challenge</p>
                                        </div>
                                        <div className="text-xs px-2 py-1 bg-zinc-700 rounded-full text-zinc-300">
                                            Locked
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Financial Habit Tracker */}
                    <div className="mb-8">
                        <FinancialHabitTracker />
                    </div>

                    {/* Smart Transaction Feed */}
                    <div className="mb-8">
                        <SmartTransactionFeed />
                    </div>

                    {/* Daily Challenges */}
                    <h2 className="text-2xl font-bold mb-4">Daily Challenges</h2>
                    <RewardsPanel />
                </div>
            </div>
        </>
    );
} 