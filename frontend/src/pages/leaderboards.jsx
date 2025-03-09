import Head from "next/head";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { FiUsers, FiMapPin, FiAward, FiTrendingUp } from "react-icons/fi";
import { GradientGrid } from "@/components/utils/GradientGrid";

export default function Leaderboards() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState("friends"); // "friends" or "location"
    const [friendsLeaderboard, setFriendsLeaderboard] = useState([]);
    const [locationLeaderboard, setLocationLeaderboard] = useState([]);

    useEffect(() => {
        // Check if user is authenticated
        const userData = localStorage.getItem("savquest_user");
        if (!userData) {
            router.push("/signup");
            return;
        }

        setUser(JSON.parse(userData));

        // Mock data for friends leaderboard
        const mockFriends = [
            { id: 1, name: "Alex S.", avatar: "A", points: 450, level: 5, streak: 7 },
            { id: 2, name: JSON.parse(userData).username, avatar: JSON.parse(userData).username.charAt(0).toUpperCase(), points: JSON.parse(localStorage.getItem("savquest_progress") || "{}")?.xp || 0, level: JSON.parse(localStorage.getItem("savquest_progress") || "{}")?.level || 1, streak: JSON.parse(localStorage.getItem("savquest_progress") || "{}")?.streak || 0, isUser: true },
            { id: 3, name: "Jamie T.", avatar: "J", points: 280, level: 3, streak: 4 },
            { id: 4, name: "Morgan P.", avatar: "M", points: 210, level: 2, streak: 2 },
            { id: 5, name: "Taylor R.", avatar: "T", points: 180, level: 2, streak: 3 },
        ].sort((a, b) => b.points - a.points);

        // Mock data for location leaderboard with Italian names
        const mockLocation = [
            { id: 1, name: "Sofia B.", avatar: "S", points: 520, level: 6, streak: 12, location: "Milan" },
            { id: 2, name: "Marco R.", avatar: "M", points: 480, level: 5, streak: 8, location: "Milan" },
            { id: 3, name: "Alessia C.", avatar: "A", points: 450, level: 5, streak: 7, location: "Milan" },
            { id: 4, name: JSON.parse(userData).username, avatar: JSON.parse(userData).username.charAt(0).toUpperCase(), points: JSON.parse(localStorage.getItem("savquest_progress") || "{}")?.xp || 0, level: JSON.parse(localStorage.getItem("savquest_progress") || "{}")?.level || 1, streak: JSON.parse(localStorage.getItem("savquest_progress") || "{}")?.streak || 0, isUser: true, location: "Milan" },
            { id: 5, name: "Luca M.", avatar: "L", points: 280, level: 3, streak: 4, location: "Milan" },
            { id: 6, name: "Giulia F.", avatar: "G", points: 210, level: 2, streak: 2, location: "Milan" },
            { id: 7, name: "Matteo V.", avatar: "M", points: 180, level: 2, streak: 3, location: "Milan" },
            { id: 8, name: "Francesca D.", avatar: "F", points: 150, level: 2, streak: 1, location: "Milan" },
            { id: 9, name: "Lorenzo P.", avatar: "L", points: 120, level: 1, streak: 2, location: "Milan" },
            { id: 10, name: "Chiara T.", avatar: "C", points: 90, level: 1, streak: 1, location: "Milan" },
        ].sort((a, b) => b.points - a.points);

        setFriendsLeaderboard(mockFriends);
        setLocationLeaderboard(mockLocation);
    }, [router]);

    if (!user) {
        return (
            <div className="min-h-screen bg-zinc-950 pt-20 relative overflow-hidden">
                <GradientGrid />
                <div className="relative z-10 flex items-center justify-center h-full">
                    Loading...
                </div>
            </div>
        );
    }

    return (
        <>
            <Head>
                <title>Leaderboards | SavQuest</title>
            </Head>
            <div className="min-h-screen bg-zinc-950 text-zinc-50 pt-24 relative overflow-hidden">
                <GradientGrid />
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <h1 className="text-3xl font-bold mb-8">Leaderboards</h1>

                    {/* Tab Navigation */}
                    <div className="flex border-b border-zinc-700 mb-8">
                        <button
                            className={`flex items-center gap-2 px-6 py-3 font-medium text-sm transition-colors ${activeTab === "friends"
                                ? "border-b-2 border-blue-500 text-blue-500"
                                : "text-zinc-400 hover:text-zinc-200"
                                }`}
                            onClick={() => setActiveTab("friends")}
                        >
                            <FiUsers />
                            Friends Circle
                        </button>
                        <button
                            className={`flex items-center gap-2 px-6 py-3 font-medium text-sm transition-colors ${activeTab === "location"
                                ? "border-b-2 border-blue-500 text-blue-500"
                                : "text-zinc-400 hover:text-zinc-200"
                                }`}
                            onClick={() => setActiveTab("location")}
                        >
                            <FiMapPin />
                            Location
                        </button>
                    </div>

                    {/* Friends Leaderboard */}
                    {activeTab === "friends" && (
                        <div className="bg-zinc-900/50 border border-zinc-700 rounded-lg">
                            <div className="p-4 border-b border-zinc-700">
                                <h2 className="text-xl font-bold flex items-center gap-2">
                                    <FiUsers className="text-blue-500" />
                                    Friends Circle
                                </h2>
                                <p className="text-zinc-400 text-sm mt-1">
                                    See how you stack up against your friends
                                </p>
                            </div>

                            <div className="divide-y divide-zinc-800">
                                {friendsLeaderboard.map((friend, index) => (
                                    <div
                                        key={friend.id}
                                        className={`p-4 flex items-center ${friend.isUser ? "bg-blue-900/20" : ""
                                            }`}
                                    >
                                        <div className="w-8 text-center font-bold text-zinc-500">
                                            {index + 1}
                                        </div>
                                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-sm font-medium ml-2">
                                            {friend.avatar}
                                        </div>
                                        <div className="ml-4 flex-1">
                                            <div className={`font-medium ${friend.isUser ? "text-blue-400" : ""}`}>
                                                {friend.name} {friend.isUser && "(You)"}
                                            </div>
                                            <div className="text-sm text-zinc-400 flex items-center gap-4 mt-1">
                                                <span className="flex items-center gap-1">
                                                    <FiAward className="text-yellow-500" />
                                                    Level {friend.level}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <FiTrendingUp className="text-green-500" />
                                                    {friend.streak} day streak
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xl font-bold text-blue-400">{friend.points}</div>
                                            <div className="text-xs text-zinc-400">XP</div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="p-4 border-t border-zinc-700 text-center">
                                <button className="text-blue-500 hover:text-blue-400 text-sm font-medium">
                                    Invite Friends
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Location Leaderboard */}
                    {activeTab === "location" && (
                        <div className="bg-zinc-900/50 border border-zinc-700 rounded-lg">
                            <div className="p-4 border-b border-zinc-700">
                                <h2 className="text-xl font-bold flex items-center gap-2">
                                    <FiMapPin className="text-blue-500" />
                                    Milan Leaderboard
                                </h2>
                                <p className="text-zinc-400 text-sm mt-1">
                                    Top financial wizards in your area
                                </p>
                            </div>

                            <div className="divide-y divide-zinc-800">
                                {locationLeaderboard.map((person, index) => (
                                    <div
                                        key={person.id}
                                        className={`p-4 flex items-center ${person.isUser ? "bg-blue-900/20" : ""
                                            }`}
                                    >
                                        <div className="w-8 text-center font-bold text-zinc-500">
                                            {index + 1}
                                        </div>
                                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-sm font-medium ml-2">
                                            {person.avatar}
                                        </div>
                                        <div className="ml-4 flex-1">
                                            <div className={`font-medium ${person.isUser ? "text-blue-400" : ""}`}>
                                                {person.name} {person.isUser && "(You)"}
                                            </div>
                                            <div className="text-sm text-zinc-400 flex items-center gap-4 mt-1">
                                                <span className="flex items-center gap-1">
                                                    <FiAward className="text-yellow-500" />
                                                    Level {person.level}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <FiTrendingUp className="text-green-500" />
                                                    {person.streak} day streak
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xl font-bold text-blue-400">{person.points}</div>
                                            <div className="text-xs text-zinc-400">XP</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
} 