import Head from "next/head";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useOnboarding } from "@/context/OnboardingContext";

export default function Dashboard() {
    const { completed } = useOnboarding();
    const router = useRouter();

    // Redirect to onboarding if not completed
    useEffect(() => {
        if (!completed) {
            router.push("/onboarding");
        }
    }, [completed, router]);

    return (
        <>
            <Head>
                <title>SavQuest Dashboard</title>
            </Head>
            <div className="min-h-screen bg-zinc-950 text-zinc-50 pt-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <h1 className="text-4xl font-bold mb-6">Welcome to SavQuest!</h1>
                    <p className="text-xl text-zinc-300 mb-12">
                        Your financial journey begins here.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                                    <span>Level 1</span>
                                    <span>0/100 XP</span>
                                </div>
                                <div className="w-full h-2 bg-zinc-700 rounded-full">
                                    <div className="h-full bg-blue-500 rounded-full" style={{ width: "0%" }}></div>
                                </div>
                            </div>

                            <h3 className="font-medium mb-2">Leaderboard</h3>
                            <div className="space-y-2">
                                {[
                                    { name: "Alex S.", points: 450 },
                                    { name: "You", points: 0, isUser: true },
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
                </div>
            </div>
        </>
    );
} 