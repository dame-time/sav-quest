import Head from "next/head";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useOnboarding } from "@/context/OnboardingContext";
import { RewardsPanel } from "@/components/dashboard/RewardsPanel";
import { FiAward, FiTrendingUp, FiCalendar } from "react-icons/fi";

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
                badges: [
                    { id: "first_login", name: "First Login", description: "Logged in for the first time", unlocked: true, icon: "🏆" },
                    { id: "profile_complete", name: "Profile Complete", description: "Completed your profile information", unlocked: true, icon: "📝" },
                    { id: "first_challenge", name: "Challenge Accepted", description: "Completed your first challenge", unlocked: false, icon: "🎯" },
                ],
                traits: {
                    saver: { level: 2, xp: 75, maxXp: 100 },
                    investor: { level: 1, xp: 25, maxXp: 100 },
                    budgeter: { level: 1, xp: 40, maxXp: 100 },
                    scholar: { level: 1, xp: 10, maxXp: 100 }
                }
            };
            localStorage.setItem("savquest_progress", JSON.stringify(defaultProgress));
            setProgress(defaultProgress);
        } else {
            setProgress(progressData);
        }
    }, [router]);

    if (!user || !progress) {
        return <div className="min-h-screen bg-zinc-950 pt-20">Loading...</div>;
    }

    const traits = [
        {
            id: "saver",
            name: "Saver",
            description: "Master saving techniques",
            icon: "💰",
            color: "green"
        },
        {
            id: "investor",
            name: "Investor",
            description: "Learn wealth-building strategies",
            icon: "📊",
            color: "purple"
        },
        {
            id: "budgeter",
            name: "Budgeter",
            description: "Develop expense management skills",
            icon: "📝",
            color: "yellow"
        },
        {
            id: "scholar",
            name: "Financial Scholar",
            description: "Build financial knowledge",
            icon: "🎓",
            color: "blue"
        }
    ];

    return (
        <>
            <Head>
                <title>SavQuest Dashboard</title>
            </Head>
            <div className="min-h-screen bg-zinc-950 text-zinc-50 pt-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold">Welcome back, {user.username}!</h1>
                            <p className="text-zinc-400 mt-1">Your financial journey continues</p>
                        </div>
                        <div className="mt-4 md:mt-0 flex items-center gap-4">
                            <div className="bg-zinc-800 px-4 py-2 rounded-lg flex items-center gap-2">
                                <span className="text-yellow-500">⚡</span>
                                <span>{progress.streak || 0}-day streak</span>
                            </div>
                            <div className="bg-zinc-800 px-4 py-2 rounded-lg flex items-center gap-2">
                                <span className="text-blue-500">✨</span>
                                <span>Level {progress.level || 1}</span>
                            </div>
                        </div>
                    </div>

                    {/* Main XP Display */}
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
                                    <FiCalendar className="text-green-500" />
                                    <span className="font-medium">{progress.streak || 0}-day streak</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FiAward className="text-purple-500" />
                                    <span className="font-medium">
                                        {progress.badges ? progress.badges.filter(b => b.unlocked).length : 0} badges
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="w-full h-3 bg-zinc-800 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-blue-500 rounded-full"
                                style={{ width: `${(progress.xp % 100) || 0}%` }}
                            ></div>
                        </div>
                        <div className="flex justify-between mt-2 text-sm text-zinc-400">
                            <span>Level {progress.level || 1}</span>
                            <span>{progress.xp % 100}/100 XP to Level {(progress.level || 1) + 1}</span>
                        </div>
                    </div>

                    {/* Trait Progress Columns */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                        {traits.map(trait => {
                            const traitProgress = progress.traits?.[trait.id] || { level: 1, xp: 0, maxXp: 100 };
                            const percentComplete = (traitProgress.xp / traitProgress.maxXp) * 100;

                            return (
                                <div
                                    key={trait.id}
                                    className="bg-zinc-900/50 border border-zinc-700 rounded-lg p-4"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className={`text-xl p-2 rounded-full bg-${trait.color}-900/30 text-${trait.color}-400`}>
                                                {trait.icon}
                                            </div>
                                            <div>
                                                <h3 className="font-bold">{trait.name}</h3>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-lg font-bold">L{traitProgress.level}</span>
                                        </div>
                                    </div>

                                    {/* Vertical progress bar */}
                                    <div className="h-48 w-full bg-zinc-800 rounded-lg overflow-hidden relative mt-4">
                                        <div
                                            className={`absolute bottom-0 left-0 right-0 bg-${trait.color}-500`}
                                            style={{ height: `${percentComplete}%` }}
                                        ></div>

                                        {/* Level markers */}
                                        <div className="absolute inset-0 flex flex-col justify-between py-2">
                                            {[5, 4, 3, 2, 1].map(level => (
                                                <div
                                                    key={level}
                                                    className="flex items-center w-full px-2"
                                                >
                                                    <div className="w-full h-px bg-zinc-700"></div>
                                                    <span className="text-xs text-zinc-500 ml-1">{level}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="mt-2 text-center">
                                        <span className="text-sm text-zinc-400">
                                            {traitProgress.xp}/{traitProgress.maxXp} XP
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Daily Challenges */}
                    <h2 className="text-2xl font-bold mb-4">Daily Challenges</h2>
                    <RewardsPanel />
                </div>
            </div>
        </>
    );
} 