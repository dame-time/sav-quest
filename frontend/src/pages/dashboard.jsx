import Head from "next/head";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useOnboarding } from "@/context/OnboardingContext";
import { RewardsPanel } from "@/components/dashboard/RewardsPanel";

export default function Dashboard() {
    const { completed } = useOnboarding();
    const router = useRouter();
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Check if user is authenticated
        const userData = localStorage.getItem("savquest_user");
        if (!userData) {
            router.push("/signup");
            return;
        }

        setUser(JSON.parse(userData));
    }, [router]);

    if (!user) {
        return <div className="min-h-screen bg-zinc-950 pt-20">Loading...</div>;
    }

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
                                <span>
                                    {JSON.parse(localStorage.getItem("savquest_progress") || "{}")?.streak || 0}-day streak
                                </span>
                            </div>
                            <div className="bg-zinc-800 px-4 py-2 rounded-lg flex items-center gap-2">
                                <span className="text-blue-500">✨</span>
                                <span>
                                    Level {JSON.parse(localStorage.getItem("savquest_progress") || "{}")?.level || 1}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Rewards Panel */}
                    <RewardsPanel />

                    {/* Your existing dashboard content */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                        <div className="col-span-2 border border-zinc-700 rounded-lg p-6 bg-zinc-900/50">
                            <h2 className="text-2xl font-bold mb-4">Your Challenges</h2>
                            <p className="text-zinc-400 mb-6">Complete these challenges to earn XP and level up!</p>

                            <div className="space-y-4">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="p-4 border border-zinc-700 rounded-lg bg-zinc-800/50">
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-3">
                                                <div className="text-2xl">🎯</div>
                                                <div>
                                                    <h3 className="font-medium">Challenge {i}</h3>
                                                    <p className="text-sm text-zinc-400">Description of challenge {i}</p>
                                                </div>
                                            </div>
                                            <button className="px-3 py-1 bg-blue-600 rounded-md text-sm">
                                                Start
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="border border-zinc-700 rounded-lg p-6 bg-zinc-900/50">
                            <h2 className="text-2xl font-bold mb-4">Your Progress</h2>
                            <div className="mb-6">
                                <div className="flex justify-between mb-2">
                                    <span>Level {JSON.parse(localStorage.getItem("savquest_progress") || "{}")?.level || 1}</span>
                                    <span>
                                        {JSON.parse(localStorage.getItem("savquest_progress") || "{}")?.xp || 0}/100 XP
                                    </span>
                                </div>
                                <div className="w-full h-2 bg-zinc-700 rounded-full">
                                    <div
                                        className="h-full bg-blue-500 rounded-full"
                                        style={{
                                            width: `${(JSON.parse(localStorage.getItem("savquest_progress") || "{}")?.xp || 0) % 100}%`
                                        }}
                                    ></div>
                                </div>
                            </div>

                            <h3 className="font-medium mb-2">Leaderboard</h3>
                            <div className="space-y-2">
                                {[
                                    { name: "Alex S.", points: 450 },
                                    { name: user.username, points: JSON.parse(localStorage.getItem("savquest_progress") || "{}")?.xp || 0, isUser: true },
                                    { name: "Jamie T.", points: 280 },
                                ].sort((a, b) => b.points - a.points).map((user, index) => (
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
                </div>
            </div>
        </>
    );
} 