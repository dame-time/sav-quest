import { useState, useEffect } from "react";
import { FiBookOpen, FiCoffee, FiShoppingBag, FiArrowUp, FiTrendingUp } from "react-icons/fi";

export const SmartTransactionFeed = () => {
    const [transactions, setTransactions] = useState([]);

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

    return (
        <div className="bg-zinc-900/50 border border-zinc-700 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Recent Transactions</h2>

            <div className="space-y-3">
                {transactions.map(transaction => (
                    <div
                        key={transaction.id}
                        className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4 flex items-center"
                    >
                        <div className={`w-10 h-10 rounded-full bg-${transaction.color}-900/30 text-${transaction.color}-400 flex items-center justify-center text-xl mr-4`}>
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
                <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4">
                    <div className="flex items-start">
                        <div className="w-10 h-10 rounded-full bg-purple-900/30 text-purple-400 flex items-center justify-center text-xl mr-4">
                            <FiBookOpen />
                        </div>
                        <div>
                            <h4 className="font-medium">Education Spending Opportunity</h4>
                            <p className="text-sm text-zinc-400 mt-1">
                                You've spent $24.99 on educational materials this month.
                                Increase to $50 to earn the "Knowledge Investor" badge and 50 XP!
                            </p>
                            <button className="mt-3 bg-purple-600 hover:bg-purple-700 text-white px-4 py-1.5 rounded-md text-sm">
                                Accept Challenge
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}; 