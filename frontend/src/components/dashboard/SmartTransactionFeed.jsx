import { useState, useEffect } from "react";
import { FiBookOpen, FiCoffee, FiShoppingBag, FiArrowUp, FiTrendingUp, FiCheck } from "react-icons/fi";
import { useNotification } from "@/components/utils/Notification";

export const SmartTransactionFeed = () => {
    const { showSuccess, showInfo } = useNotification();
    const [transactions, setTransactions] = useState([]);
    const [challenges, setChallenges] = useState([
        {
            id: "challenge_1",
            title: "Education Spending Opportunity",
            description: "You've spent $24.99 on educational materials this month. Increase to $50 to earn the \"Knowledge Investor\" badge and 50 XP!",
            icon: <FiBookOpen />,
            color: "purple",
            accepted: false,
            completed: false
        },
        {
            id: "challenge_2",
            title: "Savings Goal",
            description: "Set aside $100 this month for your emergency fund to earn the \"Safety Net Builder\" badge and 30 XP!",
            icon: <FiTrendingUp />,
            color: "green",
            accepted: false,
            completed: false
        }
    ]);

    useEffect(() => {
        // In a real app, this would fetch from TrueLayer API
        // For demo, we'll use mock data
        const mockTransactions = [
            {
                id: "tx_1",
                merchant: "Barnes & Noble",
                amount: -24.99,
                category: "Education",
                date: "2023-11-10",
                description: "Book purchase",
                hasXpReward: true,
                xpAmount: 15,
                icon: <FiBookOpen />,
                color: "blue"
            },
            {
                id: "tx_2",
                merchant: "Starbucks",
                amount: -4.50,
                category: "Food & Drink",
                date: "2023-11-09",
                description: "Coffee",
                hasXpReward: false,
                icon: <FiCoffee />,
                color: "yellow"
            },
            {
                id: "tx_3",
                merchant: "Savings Account",
                amount: 100.00,
                category: "Transfer",
                date: "2023-11-08",
                description: "Savings deposit",
                hasXpReward: true,
                xpAmount: 25,
                icon: <FiArrowUp />,
                color: "green"
            }
        ];

        setTransactions(mockTransactions);
    }, []);

    const acceptChallenge = (challengeId) => {
        setChallenges(prev => 
            prev.map(challenge => 
                challenge.id === challengeId 
                    ? { ...challenge, accepted: true } 
                    : challenge
            )
        );
        
        // Show notification
        const challenge = challenges.find(c => c.id === challengeId);
        if (challenge) {
            showSuccess(`Challenge accepted: ${challenge.title}`);
        }
    };

    const completeChallenge = (challengeId) => {
        setChallenges(prev => 
            prev.map(challenge => 
                challenge.id === challengeId 
                    ? { ...challenge, completed: true } 
                    : challenge
            )
        );
        
        // Add XP reward
        const challenge = challenges.find(c => c.id === challengeId);
        if (challenge) {
            const progress = JSON.parse(localStorage.getItem("savquest_progress") || "{}");
            progress.xp = (progress.xp || 0) + 50; // Default XP reward
            localStorage.setItem("savquest_progress", JSON.stringify(progress));
            
            showSuccess(`Challenge completed! +50 XP earned`);
        }
    };

    return (
        <div className="bg-zinc-900/50 border border-zinc-700 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Recent Transactions</h2>

            <div className="space-y-3">
                {transactions.map(transaction => (
                    <div
                        key={transaction.id}
                        className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4 flex items-center"
                    >
                        <div 
                            className="w-10 h-10 rounded-full flex items-center justify-center text-xl mr-4"
                            style={{ 
                                backgroundColor: transaction.color === 'blue' 
                                    ? 'rgba(59, 130, 246, 0.2)' 
                                    : transaction.color === 'yellow' 
                                        ? 'rgba(234, 179, 8, 0.2)' 
                                        : 'rgba(22, 163, 74, 0.2)',
                                color: transaction.color === 'blue' 
                                    ? '#3b82f6' 
                                    : transaction.color === 'yellow' 
                                        ? '#eab308' 
                                        : '#16a34a'
                            }}
                        >
                            {transaction.icon}
                        </div>

                        <div className="flex-grow">
                            <div className="flex justify-between">
                                <h3 className="font-medium">{transaction.merchant}</h3>
                                <span className={transaction.amount > 0 ? "text-green-400" : "text-white"}>
                                    {transaction.amount > 0 ? "+" : ""}${Math.abs(transaction.amount).toFixed(2)}
                                </span>
                            </div>
                            <div className="flex justify-between mt-1">
                                <p className="text-sm text-zinc-400">{transaction.description}</p>
                                <p className="text-sm text-zinc-400">{transaction.date}</p>
                            </div>
                        </div>

                        {transaction.hasXpReward && (
                            <div className="ml-4 bg-blue-900/30 border border-blue-700 rounded-lg px-3 py-2 flex items-center">
                                <span className="text-blue-400 font-medium">+{transaction.xpAmount} XP</span>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="mt-6 border-t border-zinc-700 pt-4">
                <h3 className="text-lg font-medium mb-3">Financial Insights</h3>
                <div className="space-y-4">
                    {challenges.map(challenge => (
                        <div 
                            key={challenge.id}
                            className={`bg-zinc-800/50 border rounded-lg p-4 ${
                                challenge.completed 
                                    ? 'border-green-500 bg-green-900/10' 
                                    : challenge.accepted 
                                        ? 'border-blue-500 bg-blue-900/10' 
                                        : 'border-zinc-700'
                            }`}
                        >
                            <div className="flex items-start">
                                <div 
                                    className="w-10 h-10 rounded-full flex items-center justify-center text-xl mr-4"
                                    style={{ 
                                        backgroundColor: challenge.color === 'purple' 
                                            ? 'rgba(147, 51, 234, 0.2)' 
                                            : 'rgba(22, 163, 74, 0.2)',
                                        color: challenge.color === 'purple' 
                                            ? '#a855f7' 
                                            : '#16a34a'
                                    }}
                                >
                                    {challenge.icon}
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-medium">{challenge.title}</h4>
                                    <p className="text-sm text-zinc-400 mt-1">
                                        {challenge.description}
                                    </p>
                                    <div className="mt-3">
                                        {challenge.completed ? (
                                            <div className="text-green-500 flex items-center gap-1">
                                                <FiCheck />
                                                <span>Challenge Completed</span>
                                            </div>
                                        ) : challenge.accepted ? (
                                            <div className="flex gap-2">
                                                <span className="text-blue-400 text-sm">Challenge Accepted</span>
                                                <button 
                                                    onClick={() => completeChallenge(challenge.id)}
                                                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm ml-2"
                                                >
                                                    Mark Complete
                                                </button>
                                            </div>
                                        ) : (
                                            <button 
                                                onClick={() => acceptChallenge(challenge.id)}
                                                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-1.5 rounded-md text-sm"
                                            >
                                                Accept Challenge
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}; 