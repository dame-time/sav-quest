import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import {
    FiMessageSquare, FiUser, FiDollarSign, FiTrendingUp,
    FiPieChart, FiSend, FiRefreshCw, FiClock, FiCheckCircle
} from "react-icons/fi";

export default function FinancialCoachPage() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [userProgress, setUserProgress] = useState(null);
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [userFinancialData, setUserFinancialData] = useState(null);
    const [suggestedQuestions, setSuggestedQuestions] = useState([
        "How can I improve my savings?",
        "What should I focus on learning next?",
        "How do I create a budget?",
        "What are my spending patterns?",
        "How can I reduce my expenses?"
    ]);

    useEffect(() => {
        // Check if user is authenticated
        const userData = localStorage.getItem("savquest_user");
        if (!userData) {
            router.push("/signup");
            return;
        }

        setUser(JSON.parse(userData));

        // Get user progress data
        const progressData = JSON.parse(localStorage.getItem("savquest_progress") || "{}");
        setUserProgress(progressData);

        // Get or initialize conversation history
        const savedMessages = JSON.parse(localStorage.getItem("savquest_coach_messages") || "[]");
        if (savedMessages.length === 0) {
            // Add welcome message if no conversation exists
            const welcomeMessage = {
                id: Date.now(),
                sender: "coach",
                content: "Hello! I'm your personal financial coach. I can help you understand your finances, set goals, and improve your financial habits. What would you like to know about today?",
                timestamp: new Date().toISOString()
            };
            setMessages([welcomeMessage]);
            localStorage.setItem("savquest_coach_messages", JSON.stringify([welcomeMessage]));
        } else {
            setMessages(savedMessages);
        }

        // Mock financial data - in a real app, this would come from an API
        setUserFinancialData({
            income: 4500,
            expenses: 3200,
            savings: 800,
            debt: 12000,
            spendingCategories: {
                housing: 1400,
                food: 600,
                transportation: 350,
                entertainment: 250,
                utilities: 200,
                other: 400
            },
            savingsRate: 17.8, // percentage of income
            debtToIncomeRatio: 0.22,
            recentTransactions: [
                { id: 1, merchant: "Grocery Store", amount: 85.42, category: "Food", date: "2023-11-15" },
                { id: 2, merchant: "Gas Station", amount: 45.00, category: "Transportation", date: "2023-11-14" },
                { id: 3, merchant: "Netflix", amount: 14.99, category: "Entertainment", date: "2023-11-13" },
                { id: 4, merchant: "Savings Transfer", amount: 200.00, category: "Savings", date: "2023-11-10" }
            ]
        });
    }, [router]);

    const handleSendMessage = async () => {
        if (!inputMessage.trim()) return;

        // Add user message to chat
        const userMessage = {
            id: Date.now(),
            sender: "user",
            content: inputMessage,
            timestamp: new Date().toISOString()
        };

        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);
        localStorage.setItem("savquest_coach_messages", JSON.stringify(updatedMessages));
        setInputMessage("");
        setIsLoading(true);

        // In a real implementation, this would be an API call to your AI service
        // For now, we'll simulate a response with a timeout
        setTimeout(() => {
            const aiResponse = generateAIResponse(inputMessage, userFinancialData, userProgress);
            const coachMessage = {
                id: Date.now(),
                sender: "coach",
                content: aiResponse,
                timestamp: new Date().toISOString()
            };

            const newMessages = [...updatedMessages, coachMessage];
            setMessages(newMessages);
            localStorage.setItem("savquest_coach_messages", JSON.stringify(newMessages));
            setIsLoading(false);

            // Update suggested questions based on the conversation
            updateSuggestedQuestions(inputMessage, aiResponse);
        }, 1500);
    };

    const handleSuggestedQuestion = (question) => {
        setInputMessage(question);
    };

    // Mock AI response generator - would be replaced with actual AI service
    const generateAIResponse = (message, financialData, progressData) => {
        const lowerMessage = message.toLowerCase();

        if (lowerMessage.includes("savings") || lowerMessage.includes("save")) {
            return `Based on your current savings rate of ${financialData.savingsRate}%, you're doing better than average! To improve further, consider setting up automatic transfers of $${Math.round(financialData.income * 0.05)} more each month to your savings account. This would increase your savings rate to ${(financialData.savingsRate + 5).toFixed(1)}%, putting you on track to build a stronger emergency fund.`;
        }

        if (lowerMessage.includes("budget") || lowerMessage.includes("spending")) {
            return `Looking at your spending patterns, your largest expense category is housing at $${financialData.spendingCategories.housing} per month (${Math.round(financialData.spendingCategories.housing / financialData.income * 100)}% of income). Financial experts typically recommend keeping housing costs under 30% of income. Your food spending is $${financialData.spendingCategories.food}, which is about average. One area you might look at reducing is entertainment at $${financialData.spendingCategories.entertainment} - perhaps try a "no-spend weekend" challenge?`;
        }

        if (lowerMessage.includes("learn") || lowerMessage.includes("course") || lowerMessage.includes("lesson")) {
            return `Based on your learning progress, I'd recommend focusing on the "Budgeting 101" module next. You've already completed the Money Basics section, and budgeting skills would help you optimize your current spending patterns. After that, the "Saving Strategies" module would be valuable given your interest in improving your savings rate.`;
        }

        if (lowerMessage.includes("debt") || lowerMessage.includes("loan")) {
            return `Your current debt-to-income ratio is ${(financialData.debtToIncomeRatio * 100).toFixed(1)}%, which is in the healthy range (under 36%). If you'd like to reduce your debt faster, consider applying the "debt snowball" method - focus on paying off your smallest debts first while maintaining minimum payments on larger ones. This creates psychological wins that can help maintain motivation.`;
        }

        // Default response if no specific topics are detected
        return `Thanks for your question about "${message}". Based on your financial profile, you're making good progress in your financial journey. Your savings rate of ${financialData.savingsRate}% is above average, and your spending is generally well-balanced across categories. Is there a specific aspect of your finances you'd like me to analyze in more detail?`;
    };

    const updateSuggestedQuestions = (userQuestion, aiResponse) => {
        // In a real implementation, this would use AI to generate contextually relevant follow-up questions
        // For now, we'll use a simple rule-based approach

        const lowerQuestion = userQuestion.toLowerCase();
        const newQuestions = [];

        if (lowerQuestion.includes("savings") || lowerQuestion.includes("save")) {
            newQuestions.push(
                "What savings goals should I set?",
                "How much emergency fund do I need?",
                "What's the best savings account type for me?"
            );
        } else if (lowerQuestion.includes("budget") || lowerQuestion.includes("spending")) {
            newQuestions.push(
                "How can I reduce my food expenses?",
                "Is my housing cost reasonable?",
                "What budgeting method would work best for me?"
            );
        } else if (lowerQuestion.includes("debt") || lowerQuestion.includes("loan")) {
            newQuestions.push(
                "Should I pay off debt or save more?",
                "What's the best way to tackle my debt?",
                "How can I improve my credit score?"
            );
        } else {
            newQuestions.push(
                "What financial habits should I develop?",
                "How am I doing compared to others?",
                "What's my biggest financial opportunity?"
            );
        }

        setSuggestedQuestions(newQuestions);
    };

    if (!user || !userProgress || !userFinancialData) {
        return <div className="min-h-screen bg-zinc-950 pt-20">Loading...</div>;
    }

    return (
        <>
            <Head>
                <title>Financial Coach | SavQuest</title>
            </Head>
            <div className="min-h-screen bg-zinc-950 text-zinc-50 pt-20">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col lg:flex-row gap-6">
                        {/* Financial Overview Sidebar */}
                        <div className="lg:w-1/3">
                            <div className="bg-zinc-900/50 border border-zinc-700 rounded-lg p-5 sticky top-24">
                                <h2 className="text-xl font-bold mb-4 flex items-center">
                                    <FiUser className="mr-2" /> Financial Profile
                                </h2>

                                <div className="space-y-4">
                                    <div className="bg-zinc-800/50 rounded-lg p-4">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-zinc-400">Monthly Income</span>
                                            <span className="font-medium">${userFinancialData.income}</span>
                                        </div>
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-zinc-400">Monthly Expenses</span>
                                            <span className="font-medium">${userFinancialData.expenses}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-zinc-400">Monthly Savings</span>
                                            <span className="font-medium text-green-400">${userFinancialData.savings}</span>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-medium text-zinc-400 mb-2">Spending Breakdown</h3>
                                        <div className="bg-zinc-800/50 rounded-lg p-4">
                                            {Object.entries(userFinancialData.spendingCategories).map(([category, amount]) => (
                                                <div key={category} className="flex justify-between items-center mb-2 last:mb-0">
                                                    <div className="flex items-center">
                                                        <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                                                        <span className="capitalize">{category}</span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <span className="font-medium">${amount}</span>
                                                        <span className="text-xs text-zinc-500 ml-1">
                                                            ({Math.round(amount / userFinancialData.income * 100)}%)
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-medium text-zinc-400 mb-2">Financial Health</h3>
                                        <div className="bg-zinc-800/50 rounded-lg p-4 space-y-3">
                                            <div>
                                                <div className="flex justify-between text-sm mb-1">
                                                    <span>Savings Rate</span>
                                                    <span className={userFinancialData.savingsRate >= 15 ? "text-green-400" : "text-yellow-400"}>
                                                        {userFinancialData.savingsRate}%
                                                    </span>
                                                </div>
                                                <div className="w-full h-2 bg-zinc-700 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-green-500 rounded-full"
                                                        style={{ width: `${Math.min(userFinancialData.savingsRate * 3, 100)}%` }}
                                                    ></div>
                                                </div>
                                            </div>

                                            <div>
                                                <div className="flex justify-between text-sm mb-1">
                                                    <span>Debt-to-Income</span>
                                                    <span className={userFinancialData.debtToIncomeRatio <= 0.3 ? "text-green-400" : "text-yellow-400"}>
                                                        {(userFinancialData.debtToIncomeRatio * 100).toFixed(1)}%
                                                    </span>
                                                </div>
                                                <div className="w-full h-2 bg-zinc-700 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-green-500 rounded-full"
                                                        style={{ width: `${Math.min(userFinancialData.debtToIncomeRatio * 100 * 2, 100)}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-medium text-zinc-400 mb-2">Recent Transactions</h3>
                                        <div className="bg-zinc-800/50 rounded-lg p-4 max-h-60 overflow-y-auto">
                                            {userFinancialData.recentTransactions.map(transaction => (
                                                <div key={transaction.id} className="flex justify-between items-center py-2 border-b border-zinc-700 last:border-0">
                                                    <div>
                                                        <div className="font-medium">{transaction.merchant}</div>
                                                        <div className="text-xs text-zinc-500">{transaction.date} · {transaction.category}</div>
                                                    </div>
                                                    <div className="font-medium">${transaction.amount.toFixed(2)}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Chat Interface */}
                        <div className="lg:w-2/3 flex flex-col">
                            <div className="bg-zinc-900/50 border border-zinc-700 rounded-lg p-5 flex-grow flex flex-col">
                                <h2 className="text-xl font-bold mb-4 flex items-center">
                                    <FiMessageSquare className="mr-2" /> Financial Coach
                                </h2>

                                {/* Chat Messages */}
                                <div className="flex-grow overflow-y-auto mb-4 space-y-4">
                                    {messages.map(message => (
                                        <div
                                            key={message.id}
                                            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div
                                                className={`max-w-[80%] rounded-lg p-4 ${message.sender === 'user'
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-zinc-800 border border-zinc-700'
                                                    }`}
                                            >
                                                <div className="prose prose-invert max-w-none">
                                                    {message.content}
                                                </div>
                                                <div className="text-xs text-right mt-2 opacity-70">
                                                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {isLoading && (
                                        <div className="flex justify-start">
                                            <div className="max-w-[80%] rounded-lg p-4 bg-zinc-800 border border-zinc-700">
                                                <div className="flex space-x-2">
                                                    <div className="w-2 h-2 rounded-full bg-zinc-400 animate-bounce"></div>
                                                    <div className="w-2 h-2 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                                    <div className="w-2 h-2 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Suggested Questions */}
                                <div className="mb-4 flex flex-wrap gap-2">
                                    {suggestedQuestions.map((question, index) => (
                                        <button
                                            key={index}
                                            onClick={() => handleSuggestedQuestion(question)}
                                            className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-3 py-1.5 rounded-full text-sm transition-colors"
                                        >
                                            {question}
                                        </button>
                                    ))}
                                </div>

                                {/* Input Area */}
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={inputMessage}
                                        onChange={(e) => setInputMessage(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                        placeholder="Ask your financial coach anything..."
                                        className="flex-grow bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <button
                                        onClick={handleSendMessage}
                                        disabled={isLoading || !inputMessage.trim()}
                                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white p-3 rounded-lg transition-colors"
                                    >
                                        <FiSend />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
} 