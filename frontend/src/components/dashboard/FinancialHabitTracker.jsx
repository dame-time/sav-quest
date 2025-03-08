import { useState } from "react";
import { FiCoffee, FiArrowUp, FiShoppingBag } from "react-icons/fi";

export const FinancialHabitTracker = () => {
    const [habits, setHabits] = useState([
        {
            id: 1,
            title: "Coffee Budget",
            target: 30,
            current: 22.50,
            timeframe: "weekly",
            progress: 75,
            xpReward: 20,
            icon: <FiCoffee />,
            color: "yellow"
        },
        {
            id: 2,
            title: "Savings Deposits",
            target: 200,
            current: 150,
            timeframe: "monthly",
            progress: 75,
            xpReward: 50,
            icon: <FiArrowUp />,
            color: "green"
        },
        {
            id: 3,
            title: "Shopping Expenses",
            target: 100,
            current: 65.75,
            timeframe: "weekly",
            progress: 65,
            xpReward: 25,
            icon: <FiShoppingBag />,
            color: "blue"
        }
    ]);

    return (
        <div className="bg-zinc-900/50 border border-zinc-700 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Financial Habits</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {habits.map(habit => (
                    <div
                        key={habit.id}
                        className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4"
                    >
                        <div className="flex items-center mb-3">
                            <div className={`w-8 h-8 rounded-full bg-${habit.color}-900/30 text-${habit.color}-400 flex items-center justify-center text-lg mr-3`}>
                                {habit.icon}
                            </div>
                            <h3 className="font-medium">{habit.title}</h3>
                        </div>

                        <div className="mb-2">
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-zinc-400">${habit.current} of ${habit.target}</span>
                                <span className="text-zinc-400">{habit.timeframe}</span>
                            </div>
                            <div className="w-full h-2 bg-zinc-700 rounded-full overflow-hidden">
                                <div
                                    className={`h-full bg-${habit.color}-500 rounded-full`}
                                    style={{ width: `${habit.progress}%` }}
                                ></div>
                            </div>
                        </div>

                        <div className="flex justify-between items-center mt-3">
                            <span className="text-xs bg-zinc-700 px-2 py-1 rounded-full text-zinc-300">
                                {habit.progress}% complete
                            </span>
                            <span className="text-xs text-blue-400">+{habit.xpReward} XP reward</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}; 