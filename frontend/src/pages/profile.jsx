import Head from "next/head";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useOnboarding } from "@/context/OnboardingContext";
import { FiAward, FiCalendar, FiLock, FiStar, FiTrendingUp, FiUnlock } from "react-icons/fi";

export default function Profile() {
    const router = useRouter();
    const { selectedTrait } = useOnboarding();
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Check if user is authenticated
        const userData = localStorage.getItem("savquest_user");
        if (!userData) {
            router.push("/signup");
            return;
        }

        setUser(JSON.parse(userData));

        // For demo purposes, let's add some mock data to localStorage if it doesn't exist
        if (!localStorage.getItem("savquest_progress")) {
            localStorage.setItem("savquest_progress", JSON.stringify({
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
            }));
        }
    }, [router]);

    const progress = JSON.parse(localStorage.getItem("savquest_progress") || "{}");

    if (!user) {
        return <div className="min-h-screen bg-zinc-950 pt-20">Loading...</div>;
    }

    return (
        <>
            <Head>
                <title>Your Profile | SavQuest</title>
            </Head>
            <div className="min-h-screen bg-zinc-950 text-zinc-50 pt-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Profile Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-zinc-900/50 border border-zinc-700 rounded-lg p-6">
                                <div className="text-center mb-6">
                                    <div className="w-24 h-24 bg-blue-600 rounded-full mx-auto flex items-center justify-center text-3xl">
                                        {user.username ? user.username.charAt(0).toUpperCase() : "U"}
                                    </div>
                                    <h1 className="text-2xl font-bold mt-4">{user.username}</h1>
                                    <p className="text-zinc-400">{user.email}</p>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <FiStar className="text-yellow-500" />
                                            <span>Level</span>
                                        </div>
                                        <span className="font-bold">{progress.level || 1}</span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <FiTrendingUp className="text-blue-500" />
                                            <span>XP</span>
                                        </div>
                                        <span className="font-bold">{progress.xp || 0}</span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <FiCalendar className="text-green-500" />
                                            <span>Streak</span>
                                        </div>
                                        <span className="font-bold">{progress.streak || 0} days</span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <FiAward className="text-purple-500" />
                                            <span>Badges</span>
                                        </div>
                                        <span className="font-bold">
                                            {progress.badges ? progress.badges.filter(b => b.unlocked).length : 0} /
                                            {progress.badges ? progress.badges.length : 0}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Badges Section */}
                            <div className="mt-8 bg-zinc-900/50 border border-zinc-700 rounded-lg p-6">
                                <h2 className="text-xl font-bold mb-4">Badges</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    {progress.badges ? (
                                        progress.badges.map((badge) => (
                                            <div
                                                key={badge.id}
                                                className={`p-4 border rounded-lg text-center ${badge.unlocked
                                                        ? "border-blue-500 bg-blue-900/20"
                                                        : "border-zinc-700 bg-zinc-800/50 opacity-60"
                                                    }`}
                                            >
                                                <div className="text-3xl mb-2">
                                                    {badge.unlocked ? badge.icon : <FiLock />}
                                                </div>
                                                <h3 className="font-medium">{badge.name}</h3>
                                                <p className="text-xs text-zinc-400">{badge.description}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-zinc-400 col-span-2">No badges yet</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Financial Traits */}
                        <div className="lg:col-span-2">
                            <div className="bg-zinc-900/50 border border-zinc-700 rounded-lg p-6">
                                <h2 className="text-xl font-bold mb-6">Financial Traits</h2>

                                <div className="space-y-8">
                                    {progress.traits && Object.entries(progress.traits).map(([traitId, trait]) => {
                                        const traitInfo = getTraitInfo(traitId);
                                        const isSelected = selectedTrait === traitId;

                                        return (
                                            <div
                                                key={traitId}
                                                className={`p-4 border rounded-lg ${isSelected
                                                        ? `border-${traitInfo.color}-500 bg-${traitInfo.color}-900/20`
                                                        : "border-zinc-700"
                                                    }`}
                                            >
                                                <div className="flex items-center gap-4 mb-3">
                                                    <div className={`text-3xl p-2 rounded-full bg-${traitInfo.color}-900/30 text-${traitInfo.color}-400`}>
                                                        {traitInfo.icon}
                                                    </div>
                                                    <div>
                                                        <h3 className="text-lg font-medium flex items-center gap-2">
                                                            {traitInfo.name}
                                                            {isSelected && (
                                                                <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">
                                                                    Primary
                                                                </span>
                                                            )}
                                                        </h3>
                                                        <p className="text-sm text-zinc-400">{traitInfo.description}</p>
                                                    </div>
                                                    <div className="ml-auto text-right">
                                                        <div className="text-lg font-bold">Level {trait.level}</div>
                                                        <div className="text-sm text-zinc-400">{trait.xp} / {trait.maxXp} XP</div>
                                                    </div>
                                                </div>

                                                {/* Progress bar */}
                                                <div className="w-full h-2 bg-zinc-700 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full bg-${traitInfo.color}-500`}
                                                        style={{ width: `${(trait.xp / trait.maxXp) * 100}%` }}
                                                    ></div>
                                                </div>

                                                {/* Unlockable skills */}
                                                <div className="mt-4">
                                                    <h4 className="font-medium mb-2">Unlockable Skills</h4>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                        {traitInfo.skills.map((skill, index) => {
                                                            const isUnlocked = trait.level >= skill.levelRequired;

                                                            return (
                                                                <div
                                                                    key={index}
                                                                    className={`flex items-center gap-3 p-3 border rounded-lg ${isUnlocked
                                                                            ? `border-${traitInfo.color}-500 bg-${traitInfo.color}-900/10`
                                                                            : "border-zinc-700 bg-zinc-800/50 opacity-60"
                                                                        }`}
                                                                >
                                                                    <div className="text-xl">
                                                                        {isUnlocked ? <FiUnlock className="text-green-500" /> : <FiLock className="text-zinc-500" />}
                                                                    </div>
                                                                    <div>
                                                                        <div className="font-medium">{skill.name}</div>
                                                                        <div className="text-xs text-zinc-400">
                                                                            {isUnlocked ? "Unlocked" : `Unlocks at level ${skill.levelRequired}`}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

function getTraitInfo(traitId) {
    const traits = {
        saver: {
            name: "Saver",
            description: "Master saving techniques",
            icon: "💰",
            color: "green",
            skills: [
                { name: "Basic Budgeting", levelRequired: 1 },
                { name: "Emergency Fund Planning", levelRequired: 2 },
                { name: "Automated Savings", levelRequired: 3 },
                { name: "Advanced Saving Strategies", levelRequired: 5 }
            ]
        },
        investor: {
            name: "Investor",
            description: "Learn wealth-building strategies",
            icon: "📊",
            color: "purple",
            skills: [
                { name: "Investment Basics", levelRequired: 1 },
                { name: "Stock Market Fundamentals", levelRequired: 2 },
                { name: "Portfolio Diversification", levelRequired: 3 },
                { name: "Advanced Investment Analysis", levelRequired: 5 }
            ]
        },
        budgeter: {
            name: "Budgeter",
            description: "Develop expense management skills",
            icon: "📝",
            color: "yellow",
            skills: [
                { name: "Expense Tracking", levelRequired: 1 },
                { name: "Budget Creation", levelRequired: 2 },
                { name: "Debt Management", levelRequired: 3 },
                { name: "Zero-Based Budgeting", levelRequired: 5 }
            ]
        },
        scholar: {
            name: "Financial Scholar",
            description: "Build financial knowledge",
            icon: "🎓",
            color: "blue",
            skills: [
                { name: "Financial Terms", levelRequired: 1 },
                { name: "Tax Basics", levelRequired: 2 },
                { name: "Retirement Planning", levelRequired: 3 },
                { name: "Estate Planning", levelRequired: 5 }
            ]
        }
    };

    return traits[traitId] || traits.saver;
} 