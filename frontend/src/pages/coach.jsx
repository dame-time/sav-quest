import { useState, useEffect, useRef, useCallback } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import {
    FiMessageSquare, FiUser, FiDollarSign, FiTrendingUp,
    FiPieChart, FiSend, FiRefreshCw, FiClock, FiCheckCircle, FiCreditCard, FiTarget
} from "react-icons/fi";
import { GradientGrid } from "@/components/utils/GradientGrid";
import { PieChart } from "@/components/charts/PieChart";
import { SubscriptionChart } from "@/components/charts/SubscriptionChart";
import ReactMarkdown from 'react-markdown';
import { SubscriptionSelector } from "@/components/chat/SubscriptionSelector";
import { CancellationProcess } from "@/components/chat/CancellationProcess";
import { YesNoPrompt } from "@/components/chat/YesNoPrompt";

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
    const [processingSteps, setProcessingSteps] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showSubscriptionSelector, setShowSubscriptionSelector] = useState(false);
    const [cancellationInProgress, setCancellationInProgress] = useState(false);
    const [currentSubscriptions, setCurrentSubscriptions] = useState({});
    const [selectedSubscription, setSelectedSubscription] = useState(null);
    const [showCancellationPrompt, setShowCancellationPrompt] = useState(false);

    const messagesEndRef = useRef(null);

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

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

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

        // Check if this is a response to a cancellation prompt
        const isCancellationResponse = handleCancellationResponse(inputMessage);
        if (isCancellationResponse) {
            // Skip the rest of the function since we're showing the subscription selector
            setIsLoading(false);
            return;
        }

        // Check if this is a simple thank you message
        if (isThankYouMessage(inputMessage)) {
            // Add a simple acknowledgment response
            const acknowledgmentMessage = {
                id: Date.now() + 1,
                sender: "coach",
                content: "You're welcome! I'm here if you need any more help with your finances.",
                timestamp: new Date().toISOString()
            };

            setMessages([...updatedMessages, acknowledgmentMessage]);
            localStorage.setItem("savquest_coach_messages", JSON.stringify([...updatedMessages, acknowledgmentMessage]));
            setIsLoading(false);
            return;
        }

        try {
            // Check if this is a subscription query
            const isSubscriptionQuery = /netflix|hulu|disney|spotify|amazon prime|subscription/i.test(inputMessage);

            // Check if this is a transaction search query
            const isTransactionQuery = /spend|cost|pay|expense|transaction/i.test(inputMessage) && !isSubscriptionQuery;

            if (isSubscriptionQuery) {
                // Initial API call to get processing steps
                const initialResponse = await fetch('/api/v1/coach/message', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ message: inputMessage })
                });

                if (!initialResponse.ok) {
                    throw new Error('Failed to get response from coach');
                }

                const initialData = await initialResponse.json();

                // Add processing message
                const processingMessage = {
                    id: Date.now() + 1,
                    sender: "coach",
                    content: initialData.response,
                    type: "process_start",
                    timestamp: new Date().toISOString()
                };

                setMessages([...updatedMessages, processingMessage]);
                setProcessingSteps(initialData.processingSteps);
                setIsProcessing(true);

                // Update processing steps status without adding separate messages
                initialData.processingSteps.forEach((step, index) => {
                    setTimeout(() => {
                        setProcessingSteps(prev =>
                            prev.map((s, i) =>
                                i === index ? { ...s, status: "in_progress" } : s
                            )
                        );

                        // Update the process_start message to show progress
                        setMessages(prev =>
                            prev.map(m =>
                                m.type === "process_start"
                                    ? { ...m } // Just trigger a re-render
                                    : m
                            )
                        );
                    }, 1000 * (index + 1)); // Stagger the steps
                });

                // Make second API call to get actual subscription analysis
                setTimeout(async () => {
                    try {
                        const analysisResponse = await fetch('/api/v1/coach/subscription-analysis', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                user_id: 1,
                                services: initialData.services
                            })
                        });

                        if (!analysisResponse.ok) {
                            throw new Error('Failed to analyze subscriptions');
                        }

                        const analysisData = await analysisResponse.json();

                        // Update processing steps
                        setProcessingSteps(analysisData.processingSteps);

                        // Add visualization message
                        const visualizationMessage = {
                            id: Date.now() + 100,
                            sender: "coach",
                            content: "Here's a breakdown of your subscription costs:",
                            type: "subscription_visualization",
                            data: {
                                subscriptions: analysisData.subscriptionData,
                                monthlyTotal: analysisData.analysis.monthlyTotal,
                                annualTotal: analysisData.analysis.annualTotal
                            },
                            timestamp: new Date().toISOString()
                        };

                        // Add analysis message
                        const analysisMessage = {
                            id: Date.now() + 101,
                            sender: "coach",
                            content: analysisData.analysis.recommendations,
                            timestamp: new Date().toISOString()
                        };

                        // Set the state to show the prompt
                        setShowCancellationPrompt(true);

                        // Update messages - remove all process_step and process_start messages
                        setMessages(prev => [
                            ...prev.filter(m => m.type !== "process_step" && m.type !== "process_start"),
                            visualizationMessage,
                            analysisMessage
                        ]);

                        // Save to localStorage
                        const newMessages = [
                            ...updatedMessages.filter(m => m.sender === "user"),
                            visualizationMessage,
                            analysisMessage
                        ];
                        localStorage.setItem("savquest_coach_messages", JSON.stringify(newMessages));

                        // Update suggested questions
                        setSuggestedQuestions([
                            "How can I reduce my subscription costs?",
                            "Which streaming service offers the best value?",
                            "What's my total monthly entertainment budget?"
                        ]);

                        setIsProcessing(false);

                        // Check for cancellation intent
                        if (analysisData.analysis && analysisData.analysis.cancellationPrompt &&
                            /yes|sure|cancel|proceed/i.test(inputMessage)) {

                            // Show subscription selector
                            setCurrentSubscriptions(analysisData.subscriptionData);
                            setShowSubscriptionSelector(true);
                            return;
                        }
                    } catch (error) {
                        console.error('Error analyzing subscriptions:', error);
                        handleAnalysisError();
                    }
                }, 4000); // Give time for the steps to display

            } else if (isTransactionQuery) {
                // Add a "searching" message
                const searchingMessage = {
                    id: Date.now() + 1,
                    sender: "coach",
                    content: "Searching your transactions...",
                    type: "process_step",
                    timestamp: new Date().toISOString()
                };

                setMessages([...updatedMessages, searchingMessage]);

                // Rest of your transaction search code...
                const response = await fetch('/api/v1/coach/message', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ message: inputMessage })
                });

                if (!response.ok) {
                    throw new Error('Failed to get response from coach');
                }

                const data = await response.json();

                // If this was a transaction search, add visualization
                if (data.searchResults) {
                    // Add search results message
                    const resultsMessage = {
                        id: Date.now() + 2,
                        sender: "coach",
                        content: `Found ${data.searchResults.transactions.length} transactions related to your query.`,
                        type: "search_results",
                        data: data.searchResults.summary,
                        timestamp: new Date().toISOString()
                    };

                    // Add visualization message
                    const visualizationMessage = {
                        id: Date.now() + 3,
                        sender: "coach",
                        content: "Here's a breakdown of your spending:",
                        type: "visualization",
                        data: {
                            type: "pie_chart",
                            chartData: data.searchResults.summary.by_merchant
                        },
                        timestamp: new Date().toISOString()
                    };

                    // Add these messages to the chat
                    setMessages(prev => [...prev.filter(m => m.type !== "process_step"), resultsMessage, visualizationMessage]);

                    // Update localStorage with the new messages
                    const newMessages = [...updatedMessages.filter(m => m.type !== "process_step"), resultsMessage, visualizationMessage];
                    localStorage.setItem("savquest_coach_messages", JSON.stringify(newMessages));
                }

                // Add the AI response
                const aiMessage = {
                    id: Date.now() + 4,
                    sender: "coach",
                    content: data.response,
                    timestamp: new Date().toISOString()
                };

                // Update messages state with AI response
                setMessages(prev => {
                    const newMessages = [...prev.filter(m => m.type !== "process_step"), aiMessage];
                    localStorage.setItem("savquest_coach_messages", JSON.stringify(newMessages));
                    return newMessages;
                });

                // Update suggested questions
                if (data.suggestedQuestions) {
                    setSuggestedQuestions(data.suggestedQuestions);
                }
            } else {
                // Regular question processing
                const response = await fetch('/api/v1/coach/message', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ message: inputMessage })
                });

                if (!response.ok) {
                    throw new Error('Failed to get response from coach');
                }

                const data = await response.json();

                // Add the AI response
                const aiMessage = {
                    id: Date.now() + 1,
                    sender: "coach",
                    content: data.response,
                    timestamp: new Date().toISOString()
                };

                setMessages([...updatedMessages, aiMessage]);
                localStorage.setItem("savquest_coach_messages", JSON.stringify([...updatedMessages, aiMessage]));

                // Update suggested questions
                if (data.suggestedQuestions) {
                    setSuggestedQuestions(data.suggestedQuestions);
                }
            }
        } catch (error) {
            console.error('Error sending message:', error);

            // Add error message
            const errorMessage = {
                id: Date.now() + 1,
                sender: "coach",
                content: "I'm having trouble connecting to my financial analysis system right now. Please try again in a moment.",
                timestamp: new Date().toISOString()
            };

            setMessages(prev => {
                const newMessages = [...prev.filter(m => m.type !== "process_step"), errorMessage];
                localStorage.setItem("savquest_coach_messages", JSON.stringify(newMessages));
                return newMessages;
            });
        } finally {
            setIsLoading(false);
        }
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

    const handleClearChat = () => {
        // Show confirmation dialog
        if (window.confirm("Are you sure you want to clear your conversation history?")) {
            // Clear messages from state and localStorage
            setMessages([{
                id: Date.now(),
                sender: "coach",
                content: "Hello! I'm your personal financial coach. I can help you understand your finances, set goals, and improve your financial habits. What would you like to know about today?",
                timestamp: new Date().toISOString()
            }]);
            localStorage.setItem("savquest_coach_messages", JSON.stringify([]));
        }
    };

    // Add a function to handle analysis errors
    const handleAnalysisError = () => {
        setIsProcessing(false);

        // Add error message
        const errorMessage = {
            id: Date.now() + 1,
            sender: "coach",
            content: "I encountered an error while analyzing your subscription data. Let me provide a general response instead.",
            timestamp: new Date().toISOString()
        };

        // Add fallback analysis
        const fallbackMessage = {
            id: Date.now() + 2,
            sender: "coach",
            content: "Based on average costs, streaming services like Netflix ($15.99/mo), Hulu ($11.99/mo), and Disney+ ($7.99/mo) would cost about $35.97 monthly or $431.64 annually. This represents about 0.8% of your monthly income, which is well within the recommended entertainment budget of 5-10%. Consider evaluating which services you use most frequently to ensure you're getting value from each subscription.",
            timestamp: new Date().toISOString()
        };

        setMessages(prev => [
            ...prev.filter(m => m.type !== "process_step" && m.type !== "process_start"),
            errorMessage,
            fallbackMessage
        ]);
    };

    // Add a function to handle subscription cancellation
    const handleCancelSubscription = async (subscription) => {
        setSelectedSubscription(subscription);
        setShowSubscriptionSelector(false);
        setCancellationInProgress(true);

        try {
            const response = await fetch('/api/v1/coach/cancel-subscription', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user_id: 1,
                    subscription: subscription
                })
            });

            if (!response.ok) {
                throw new Error('Failed to cancel subscription');
            }

            const data = await response.json();

            // Will be handled by the CancellationProcess component's onComplete
        } catch (error) {
            console.error('Error cancelling subscription:', error);
            setCancellationInProgress(false);

            // Add error message
            const errorMessage = {
                id: Date.now() + 1,
                sender: "coach",
                content: "I encountered an error while trying to cancel your subscription. Please try again later.",
                timestamp: new Date().toISOString()
            };

            setMessages(prev => [...prev, errorMessage]);
        }
    };

    // Update the handleCancellationComplete function
    const handleCancellationComplete = () => {
        setCancellationInProgress(false);

        // Create a new success message
        const successMessage = {
            id: Date.now() + 1,
            sender: "coach",
            content: `I've successfully cancelled your ${selectedSubscription} subscription. Is there anything else I can help you with today?`,
            timestamp: new Date().toISOString()
        };

        // Replace any existing success messages for this subscription
        const filteredMessages = messages.filter(m =>
            !(m.sender === "coach" &&
                m.content.includes(`successfully cancelled your ${selectedSubscription} subscription`))
        );

        // Add the new success message
        const updatedMessages = [...filteredMessages, successMessage];
        setMessages(updatedMessages);

        // Save to localStorage
        localStorage.setItem("savquest_coach_messages", JSON.stringify(updatedMessages));

        // Update suggested questions to be more general
        setSuggestedQuestions([
            "How can I improve my savings?",
            "What's my current financial health?",
            "How do I create a budget?"
        ]);
    };

    // Update the handleCancellationResponse function
    const handleCancellationResponse = (userMessage) => {
        // Check if the last coach message was the cancellation prompt
        const lastCoachMessage = messages
            .filter(m => m.sender === "coach")
            .pop();

        if (lastCoachMessage &&
            lastCoachMessage.content === "Would you like me to help you cancel any of these subscriptions?") {

            // Check if user's response indicates they want to cancel
            if (/yes|sure|cancel|proceed|ok|okay|yep|yeah/i.test(userMessage)) {
                // Get the subscription data from the last visualization message
                const visualizationMessage = messages.find(m => m.type === "subscription_visualization");
                if (visualizationMessage && visualizationMessage.data && visualizationMessage.data.subscriptions) {
                    // Add a processing message
                    const processingMessage = {
                        id: Date.now() + 1,
                        sender: "coach",
                        content: "Let me prepare the cancellation options for you...",
                        timestamp: new Date().toISOString()
                    };

                    setMessages(prev => [...prev, processingMessage]);

                    // Show subscription selector after a delay
                    setTimeout(() => {
                        setCurrentSubscriptions(visualizationMessage.data.subscriptions);
                        setShowSubscriptionSelector(true);

                        // Remove the processing message
                        setMessages(prev => prev.filter(m => m.content !== "Let me prepare the cancellation options for you..."));
                    }, 1200);

                    return true;
                }
            }
        }
        return false;
    };

    // Add a function to detect thank you messages and provide a simple response
    const isThankYouMessage = (message) => {
        const thankYouPatterns = /thank|thanks|thx|thankyou|great|awesome|good job|nice/i;
        return thankYouPatterns.test(message) && message.split(' ').length < 5;
    };

    // Add these styles to your component or in a separate CSS file
    // You can add this right before the return statement in your component

    const markdownStyles = {
        container: "prose prose-invert max-w-none",
        heading: "font-bold text-xl mb-2 mt-4",
        paragraph: "mb-3",
        bold: "font-bold text-blue-400",
        list: "pl-5 space-y-2 mb-4",
        listItem: "flex items-start",
        listItemBullet: "mr-2 text-blue-400 flex-shrink-0",
    };

    if (!user || !userProgress || !userFinancialData) {
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
                <title>Financial Coach | SavQuest</title>
                <meta name="description" content="Get personalized financial advice from your AI coach" />
            </Head>
            <div className="min-h-screen bg-zinc-950 text-zinc-50 pt-24 relative overflow-hidden">
                <GradientGrid />
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col lg:flex-row gap-4 h-full">
                        {/* Financial Overview Sidebar - make it more compact */}
                        <div className="lg:w-1/3 lg:max-h-[calc(100vh-120px)] overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-900">
                            <div className="bg-zinc-900/50 border border-zinc-700 rounded-lg p-4">
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
                        <div className="lg:w-2/3 flex flex-col flex-grow">
                            <div className="bg-zinc-900/50 border border-zinc-700 rounded-lg p-5 flex-grow flex flex-col h-[calc(100vh-160px)]">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-bold flex items-center">
                                        <FiMessageSquare className="mr-2" /> Financial Coach
                                    </h2>
                                    <button
                                        onClick={handleClearChat}
                                        className="text-zinc-400 hover:text-zinc-200 text-sm flex items-center"
                                    >
                                        <FiRefreshCw className="mr-1" /> Clear Chat
                                    </button>
                                </div>

                                {/* Adjust the chat messages container to take available space */}
                                <div className="flex-grow overflow-y-auto mb-3 space-y-4 pr-2 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-900">
                                    {messages.map(message => (
                                        <div
                                            key={message.id}
                                            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div
                                                className={`max-w-[80%] rounded-lg p-4 ${message.sender === 'user'
                                                    ? 'bg-blue-600 text-white'
                                                    : message.type === 'process_step'
                                                        ? 'bg-zinc-800/70 border border-zinc-700'
                                                        : message.type === 'process_start'
                                                            ? 'bg-zinc-800/70 border border-zinc-700'
                                                            : message.type === 'search_results' || message.type === 'visualization' || message.type === 'subscription_visualization'
                                                                ? 'bg-zinc-800/90 border border-zinc-600'
                                                                : 'bg-zinc-800 border border-zinc-700'
                                                    }`}
                                            >
                                                {message.type === 'process_step' ? (
                                                    <div className="flex items-center">
                                                        <div className="mr-2 w-4 h-4 rounded-full border-2 border-t-transparent border-blue-400 animate-spin"></div>
                                                        <div>{message.content}</div>
                                                    </div>
                                                ) : message.type === 'process_start' ? (
                                                    <div>
                                                        <div>{message.content}</div>
                                                        <div className="mt-3 space-y-2">
                                                            {processingSteps.map((step, index) => (
                                                                <div
                                                                    key={step.id}
                                                                    className={`flex items-center ${step.status === 'completed'
                                                                        ? 'text-green-400'
                                                                        : step.status === 'in_progress'
                                                                            ? 'text-blue-400'
                                                                            : 'text-zinc-500'
                                                                        }`}
                                                                >
                                                                    {step.status === 'completed' ? (
                                                                        <FiCheckCircle className="mr-2" />
                                                                    ) : step.status === 'in_progress' ? (
                                                                        <div className="mr-2 w-4 h-4 rounded-full border-2 border-t-transparent border-blue-400 animate-spin"></div>
                                                                    ) : (
                                                                        <FiClock className="mr-2" />
                                                                    )}
                                                                    <span>{step.message}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ) : message.type === 'search_results' ? (
                                                    <div>
                                                        <div className="mb-2">{message.content}</div>
                                                        <div className="bg-zinc-900/80 p-3 rounded-md text-sm">
                                                            <div className="flex justify-between mb-1">
                                                                <span>Total:</span>
                                                                <span className="font-medium">${Math.abs(message.data.total_spent).toFixed(2)}</span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span>Period:</span>
                                                                <span className="font-medium">{message.data.time_period}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : message.type === 'visualization' ? (
                                                    <div>
                                                        <div className="mb-2">{message.content}</div>
                                                        <div className="bg-zinc-900/80 p-3 rounded-md">
                                                            <PieChart data={message.data.chartData} />
                                                        </div>
                                                    </div>
                                                ) : message.type === 'subscription_visualization' ? (
                                                    <div>
                                                        <div className="mb-2">{message.content}</div>
                                                        <div className="bg-zinc-900/80 p-3 rounded-md">
                                                            <SubscriptionChart data={message.data} />
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className={markdownStyles.container}>
                                                        <ReactMarkdown
                                                            components={{
                                                                h1: ({ node, ...props }) => <h1 className={markdownStyles.heading} {...props} />,
                                                                h2: ({ node, ...props }) => <h2 className={markdownStyles.heading} {...props} />,
                                                                h3: ({ node, ...props }) => <h3 className={markdownStyles.heading} {...props} />,
                                                                p: ({ node, ...props }) => <p className={markdownStyles.paragraph} {...props} />,
                                                                strong: ({ node, ...props }) => <strong className={markdownStyles.bold} {...props} />,
                                                                ul: ({ node, ...props }) => <ul className={markdownStyles.list} {...props} />,
                                                                li: ({ node, children, ...props }) => (
                                                                    <li className={markdownStyles.listItem} {...props}>
                                                                        <span className={markdownStyles.listItemBullet}>•</span>
                                                                        <span>{children}</span>
                                                                    </li>
                                                                ),
                                                            }}
                                                        >
                                                            {message.content}
                                                        </ReactMarkdown>
                                                    </div>
                                                )}

                                                <div className="text-xs text-right mt-2 opacity-70">
                                                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {isLoading && !messages.some(m => m.type === 'process_step') && (
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

                                    {showSubscriptionSelector && (
                                        <div className="flex justify-start">
                                            <div className="max-w-[80%]">
                                                <SubscriptionSelector
                                                    subscriptions={currentSubscriptions}
                                                    onCancel={handleCancelSubscription}
                                                    onClose={() => setShowSubscriptionSelector(false)}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {cancellationInProgress && (
                                        <div className="flex justify-start">
                                            <div className="max-w-[80%]">
                                                <CancellationProcess
                                                    subscription={selectedSubscription}
                                                    onComplete={handleCancellationComplete}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {showCancellationPrompt && (
                                        <div className="flex justify-start">
                                            <div className="max-w-[80%]">
                                                <YesNoPrompt
                                                    question="Would you like me to help you cancel any of these subscriptions?"
                                                    onYes={() => {
                                                        setShowCancellationPrompt(false);
                                                        // Get the subscription data from the last visualization message
                                                        const visualizationMessage = messages.find(m => m.type === "subscription_visualization");
                                                        if (visualizationMessage && visualizationMessage.data && visualizationMessage.data.subscriptions) {
                                                            // Add a processing message
                                                            const processingMessage = {
                                                                id: Date.now() + 1,
                                                                sender: "coach",
                                                                content: "Let me prepare the cancellation options for you...",
                                                                timestamp: new Date().toISOString()
                                                            };

                                                            setMessages(prev => [...prev, processingMessage]);

                                                            // Show subscription selector after a delay
                                                            setTimeout(() => {
                                                                setCurrentSubscriptions(visualizationMessage.data.subscriptions);
                                                                setShowSubscriptionSelector(true);

                                                                // Remove the processing message
                                                                setMessages(prev => prev.filter(m => m.content !== "Let me prepare the cancellation options for you..."));
                                                            }, 1200);
                                                        }
                                                    }}
                                                    onNo={() => {
                                                        setShowCancellationPrompt(false);
                                                        // Add a response message
                                                        const responseMessage = {
                                                            id: Date.now() + 1,
                                                            sender: "coach",
                                                            content: "No problem! Let me know if you need any other help with your finances.",
                                                            timestamp: new Date().toISOString()
                                                        };

                                                        setMessages(prev => [...prev, responseMessage]);
                                                        localStorage.setItem("savquest_coach_messages", JSON.stringify([...messages, responseMessage]));
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Make suggested questions more compact */}
                                <div className="mb-3 flex flex-wrap gap-2">
                                    {suggestedQuestions.map((question, index) => (
                                        <button
                                            key={index}
                                            onClick={() => handleSuggestedQuestion(question)}
                                            className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-3 py-1 rounded-full text-sm transition-colors"
                                        >
                                            {question}
                                        </button>
                                    ))}
                                </div>

                                {/* Input area with no bottom margin */}
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={inputMessage}
                                        onChange={(e) => setInputMessage(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                        placeholder="Ask your financial coach anything..."
                                        className="flex-grow bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <button
                                        onClick={handleSendMessage}
                                        disabled={isLoading || !inputMessage.trim()}
                                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-colors"
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