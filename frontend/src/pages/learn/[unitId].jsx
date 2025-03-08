import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { FiArrowLeft, FiBook, FiCheckCircle, FiHelpCircle, FiAlertCircle, FiCheck, FiX } from "react-icons/fi";

export default function UnitDetailPage() {
    const router = useRouter();
    const { unitId } = router.query;
    const [unit, setUnit] = useState(null);
    const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
    const [userProgress, setUserProgress] = useState(null);
    const [selectedAnswers, setSelectedAnswers] = useState([]);
    const [notification, setNotification] = useState(null);
    const [quizResults, setQuizResults] = useState(null);

    useEffect(() => {
        if (!unitId) return;

        // Check if user is authenticated
        const userData = localStorage.getItem("savquest_user");
        if (!userData) {
            router.push("/signup");
            return;
        }

        // Get learning progress
        const learningProgress = JSON.parse(localStorage.getItem("savquest_learning") || "null");
        if (!learningProgress || !learningProgress.unlockedUnits.includes(unitId)) {
            router.push("/learn");
            return;
        }

        setUserProgress(learningProgress);

        // Find the unit data
        // In a real app, this would be fetched from an API
        const mockUnits = {
            "1-1": {
                id: "1-1",
                title: "Money Basics",
                description: "Understanding the fundamentals of money",
                xpReward: 20,
                icon: "💰",
                content: {
                    lessons: [
                        {
                            id: "lesson-1",
                            title: "What is Money?",
                            type: "reading",
                            duration: "3 min",
                            content: "Money is a medium of exchange that allows people to trade goods and services. It serves as a store of value and a unit of account. Throughout history, various items have been used as money, from shells and beads to gold and silver. Today, most money exists as digital records rather than physical currency.\n\nMoney has three main functions:\n\n1. Medium of Exchange: It's widely accepted for goods and services\n2. Store of Value: It can be saved and retrieved in the future\n3. Unit of Account: It provides a common measure of value",
                            completed: false
                        },
                        {
                            id: "lesson-2",
                            title: "Money Quiz",
                            type: "quiz",
                            questions: [
                                {
                                    question: "What are the three main functions of money?",
                                    options: [
                                        "Medium of exchange, store of value, unit of account",
                                        "Saving, spending, investing",
                                        "Cash, credit, digital",
                                        "Coins, bills, checks"
                                    ],
                                    correctAnswer: 0
                                },
                                {
                                    question: "Which of these is NOT a form of money?",
                                    options: [
                                        "Credit card",
                                        "Digital currency",
                                        "Gold",
                                        "Stock certificate"
                                    ],
                                    correctAnswer: 3
                                }
                            ],
                            completed: false
                        }
                    ]
                }
            },
            "1-2": {
                id: "1-2",
                title: "Budgeting 101",
                description: "Learn to create your first budget",
                xpReward: 30,
                icon: "📊",
                content: {
                    lessons: [
                        {
                            id: "lesson-1",
                            title: "Creating a Simple Budget",
                            type: "reading",
                            duration: "5 min",
                            content: "A budget is a plan for your money. It helps you track income and expenses so you can make informed financial decisions. Creating a budget is the first step toward financial control.\n\nTo create a simple budget:\n\n1. Track your income: List all sources of money coming in\n2. List your expenses: Fixed expenses (rent, utilities) and variable expenses (food, entertainment)\n3. Subtract expenses from income\n4. Adjust as needed: If expenses exceed income, find areas to cut back\n\nThe 50/30/20 rule is a popular budgeting method:\n- 50% for needs (housing, food, utilities)\n- 30% for wants (entertainment, dining out)\n- 20% for savings and debt repayment",
                            completed: false
                        },
                        {
                            id: "lesson-2",
                            title: "Budget Challenge",
                            type: "challenge",
                            description: "Create your own budget using the template provided. Track your expenses for one week and compare to your budget.",
                            completed: false
                        }
                    ]
                }
            }
        };

        if (mockUnits[unitId]) {
            setUnit(mockUnits[unitId]);
            // Initialize selected answers array based on the first quiz in the unit
            const firstQuiz = mockUnits[unitId].content.lessons.find(lesson => lesson.type === "quiz");
            if (firstQuiz) {
                setSelectedAnswers(Array(firstQuiz.questions.length).fill(null));
            }
        }
    }, [unitId, router]);

    const showNotification = (type, message) => {
        setNotification({ type, message });
        setTimeout(() => setNotification(null), 3000);
    };

    const completeLesson = () => {
        // Mark current lesson as completed
        const updatedUnit = { ...unit };
        updatedUnit.content.lessons[currentLessonIndex].completed = true;
        setUnit(updatedUnit);

        // Check if all lessons are completed
        const allCompleted = updatedUnit.content.lessons.every(lesson => lesson.completed);

        if (allCompleted) {
            // Update user progress
            const updatedProgress = { ...userProgress };
            updatedProgress.completedUnits = [...updatedProgress.completedUnits, unit.id];

            // Add XP
            updatedProgress.xpEarned += unit.xpReward;

            // Update savquest_progress with XP
            const progressData = JSON.parse(localStorage.getItem("savquest_progress") || "{}");
            progressData.xp = (progressData.xp || 0) + unit.xpReward;
            localStorage.setItem("savquest_progress", JSON.stringify(progressData));

            // Unlock next unit if available
            // This is simplified - in a real app you'd have a proper progression system
            const nextUnitId = `${unitId.split('-')[0]}-${parseInt(unitId.split('-')[1]) + 1}`;
            if (!updatedProgress.unlockedUnits.includes(nextUnitId)) {
                updatedProgress.unlockedUnits.push(nextUnitId);
                updatedProgress.currentUnit = nextUnitId;
            }

            localStorage.setItem("savquest_learning", JSON.stringify(updatedProgress));
            setUserProgress(updatedProgress);

            // Show completion message
            showNotification("success", `Congratulations! You've completed this unit and earned ${unit.xpReward} XP!`);

            // Navigate back to learning path after a delay
            setTimeout(() => {
                router.push("/learn");
            }, 3000);
        } else {
            // Move to next lesson
            setCurrentLessonIndex(currentLessonIndex + 1);
            // Reset selected answers for next quiz
            const nextLesson = unit.content.lessons[currentLessonIndex + 1];
            if (nextLesson && nextLesson.type === "quiz") {
                setSelectedAnswers(Array(nextLesson.questions.length).fill(null));
            } else {
                setSelectedAnswers([]);
            }
            // Reset quiz results
            setQuizResults(null);
        }
    };

    const handleAnswerSelect = (questionIndex, answerIndex) => {
        const newAnswers = [...selectedAnswers];
        newAnswers[questionIndex] = answerIndex;
        setSelectedAnswers(newAnswers);
    };

    const handleQuizSubmit = () => {
        // Check if all questions are answered
        if (selectedAnswers.some(answer => answer === null)) {
            showNotification("error", "Please answer all questions before submitting.");
            return;
        }

        // Check answers and calculate score
        const questions = unit.content.lessons[currentLessonIndex].questions;
        const correctAnswers = questions.map(q => q.correctAnswer);

        // Create results array with correct/incorrect for each question
        const results = selectedAnswers.map((answer, index) => ({
            isCorrect: answer === correctAnswers[index],
            correctAnswer: correctAnswers[index],
            selectedAnswer: answer
        }));

        setQuizResults(results);

        const score = results.filter(r => r.isCorrect).length;
        const totalQuestions = correctAnswers.length;

        // Show appropriate notification based on score
        if (score === totalQuestions) {
            showNotification("success", `Perfect! You got all ${totalQuestions} questions correct!`);
        } else if (score > totalQuestions / 2) {
            showNotification("success", `Good job! You got ${score} out of ${totalQuestions} correct.`);
        } else {
            showNotification("warning", `You got ${score} out of ${totalQuestions} correct. Review the answers and try again!`);
        }

        // If they got at least 70% correct, allow them to proceed
        if (score >= Math.ceil(totalQuestions * 0.7)) {
            // Add a delay before completing the lesson
            setTimeout(() => {
                completeLesson();
            }, 3000);
        }
    };

    // Loading state
    if (!unit) {
        return <div className="min-h-screen bg-zinc-950 pt-20 flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-zinc-400">Loading lesson content...</p>
            </div>
        </div>;
    }

    // Get current lesson safely
    const currentLesson = unit.content.lessons[currentLessonIndex];

    // If somehow currentLesson is undefined, show an error
    if (!currentLesson) {
        return <div className="min-h-screen bg-zinc-950 pt-20 flex items-center justify-center">
            <div className="text-center">
                <div className="text-red-500 text-5xl mb-4">⚠️</div>
                <h2 className="text-xl font-bold mb-2">Lesson Not Found</h2>
                <p className="text-zinc-400 mb-4">We couldn't find the lesson you're looking for.</p>
                <button
                    onClick={() => router.push("/learn")}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                >
                    Return to Learning Path
                </button>
            </div>
        </div>;
    }

    return (
        <>
            <Head>
                <title>{unit.title} | SavQuest Learning</title>
            </Head>
            <div className="min-h-screen bg-zinc-950 text-zinc-50 pt-20">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <button
                        onClick={() => router.push("/learn")}
                        className="flex items-center text-zinc-400 hover:text-white mb-6"
                    >
                        <FiArrowLeft className="mr-2" /> Back to Learning Path
                    </button>

                    <div className="bg-zinc-900/50 border border-zinc-700 rounded-lg p-6">
                        <div className="flex items-center mb-6">
                            <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-xl mr-4">
                                <span>{unit.icon}</span>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold">{unit.title}</h1>
                                <p className="text-zinc-400">{unit.description}</p>
                            </div>
                        </div>

                        <div className="flex mb-6">
                            {unit.content.lessons.map((lesson, index) => (
                                <div
                                    key={lesson.id}
                                    className={`h-1 flex-1 mx-1 rounded-full ${index < currentLessonIndex
                                        ? "bg-green-500"
                                        : index === currentLessonIndex
                                            ? "bg-blue-500"
                                            : "bg-zinc-700"
                                        }`}
                                ></div>
                            ))}
                        </div>

                        <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold">{currentLesson.title}</h2>
                                <div className="flex items-center text-sm text-zinc-400">
                                    {currentLesson.type === "reading" ? (
                                        <><FiBook className="mr-1" /> {currentLesson.duration} read</>
                                    ) : currentLesson.type === "quiz" ? (
                                        <><FiHelpCircle className="mr-1" /> {currentLesson.questions.length} questions</>
                                    ) : (
                                        <><FiCheckCircle className="mr-1" /> Challenge</>
                                    )}
                                </div>
                            </div>

                            {currentLesson.type === "reading" ? (
                                <>
                                    <div className="prose prose-invert max-w-none mb-6">
                                        {currentLesson.content.split('\n\n').map((paragraph, i) => (
                                            <p key={i} className="mb-4">{paragraph}</p>
                                        ))}
                                    </div>

                                    <button
                                        onClick={completeLesson}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md font-medium"
                                    >
                                        Mark as Completed
                                    </button>
                                </>
                            ) : currentLesson.type === "quiz" ? (
                                <div className="space-y-6">
                                    {currentLesson.questions.map((question, qIndex) => (
                                        <div key={qIndex} className="bg-zinc-900/50 border border-zinc-700 rounded-lg p-4">
                                            <h3 className="font-medium mb-3">{question.question}</h3>
                                            <div className="space-y-2">
                                                {question.options.map((option, oIndex) => {
                                                    // Determine styling based on quiz results
                                                    let optionStyle = "";
                                                    if (quizResults) {
                                                        if (oIndex === quizResults[qIndex].correctAnswer) {
                                                            optionStyle = "border-green-500 bg-green-900/20";
                                                        } else if (oIndex === quizResults[qIndex].selectedAnswer && !quizResults[qIndex].isCorrect) {
                                                            optionStyle = "border-red-500 bg-red-900/20";
                                                        }
                                                    }

                                                    return (
                                                        <div
                                                            key={oIndex}
                                                            className={`flex items-center p-3 border rounded-lg cursor-pointer hover:bg-zinc-800 ${selectedAnswers[qIndex] === oIndex && !quizResults
                                                                ? "border-blue-500 bg-blue-900/20"
                                                                : optionStyle || "border-zinc-700"
                                                                }`}
                                                            onClick={() => !quizResults && handleAnswerSelect(qIndex, oIndex)}
                                                        >
                                                            <div className={`w-5 h-5 rounded-full mr-3 flex items-center justify-center ${selectedAnswers[qIndex] === oIndex && !quizResults
                                                                ? "bg-blue-500"
                                                                : quizResults && oIndex === quizResults[qIndex].correctAnswer
                                                                    ? "bg-green-500"
                                                                    : quizResults && oIndex === quizResults[qIndex].selectedAnswer && !quizResults[qIndex].isCorrect
                                                                        ? "bg-red-500"
                                                                        : "border border-zinc-500"
                                                                }`}>
                                                                {selectedAnswers[qIndex] === oIndex && !quizResults && (
                                                                    <div className="w-2 h-2 rounded-full bg-white"></div>
                                                                )}
                                                                {quizResults && oIndex === quizResults[qIndex].correctAnswer && (
                                                                    <FiCheck className="text-white text-xs" />
                                                                )}
                                                                {quizResults && oIndex === quizResults[qIndex].selectedAnswer && !quizResults[qIndex].isCorrect && (
                                                                    <FiX className="text-white text-xs" />
                                                                )}
                                                            </div>
                                                            <span>{option}</span>
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                            {/* Show explanation after answering */}
                                            {quizResults && (
                                                <div className={`mt-3 p-3 rounded-lg ${quizResults[qIndex].isCorrect ? "bg-green-900/10 border border-green-700" : "bg-red-900/10 border border-red-700"
                                                    }`}>
                                                    <div className="flex items-center">
                                                        {quizResults[qIndex].isCorrect ? (
                                                            <>
                                                                <FiCheck className="text-green-500 mr-2" />
                                                                <span className="text-green-400 font-medium">Correct!</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <FiX className="text-red-500 mr-2" />
                                                                <span className="text-red-400 font-medium">Incorrect</span>
                                                            </>
                                                        )}
                                                    </div>
                                                    <p className="text-sm mt-1 text-zinc-300">
                                                        {quizResults[qIndex].isCorrect
                                                            ? "Great job! You selected the right answer."
                                                            : `The correct answer is: ${question.options[quizResults[qIndex].correctAnswer]}`
                                                        }
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    ))}

                                    {!quizResults ? (
                                        <button
                                            onClick={handleQuizSubmit}
                                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md font-medium"
                                        >
                                            Submit Answers
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => {
                                                if (quizResults.filter(r => r.isCorrect).length >= Math.ceil(quizResults.length * 0.7)) {
                                                    completeLesson();
                                                } else {
                                                    // Reset the quiz to try again
                                                    setQuizResults(null);
                                                    setSelectedAnswers(Array(currentLesson.questions.length).fill(null));
                                                    showNotification("info", "Let's try again! Review the questions and select your answers.");
                                                }
                                            }}
                                            className={`w-full py-3 rounded-md font-medium ${quizResults.filter(r => r.isCorrect).length >= Math.ceil(quizResults.length * 0.7)
                                                ? "bg-green-600 hover:bg-green-700"
                                                : "bg-yellow-600 hover:bg-yellow-700"
                                                } text-white`}
                                        >
                                            {quizResults.filter(r => r.isCorrect).length >= Math.ceil(quizResults.length * 0.7)
                                                ? "Continue to Next Lesson"
                                                : "Try Again"
                                            }
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <>
                                    <div className="prose prose-invert max-w-none mb-6">
                                        <p>{currentLesson.description}</p>
                                    </div>

                                    <button
                                        onClick={completeLesson}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md font-medium"
                                    >
                                        Complete Challenge
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Notification component */}
                    {notification && (
                        <div className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg max-w-md animate-slide-up ${notification.type === "success" ? "bg-green-900/90 border border-green-700" :
                            notification.type === "error" ? "bg-red-900/90 border border-red-700" :
                                notification.type === "info" ? "bg-blue-900/90 border border-blue-700" :
                                    "bg-yellow-900/90 border border-yellow-700"
                            }`}>
                            <div className="flex items-start">
                                <div className="flex-shrink-0 mr-3">
                                    {notification.type === "success" ? (
                                        <FiCheckCircle className="text-green-400 text-xl" />
                                    ) : notification.type === "error" ? (
                                        <FiAlertCircle className="text-red-400 text-xl" />
                                    ) : notification.type === "info" ? (
                                        <FiAlertCircle className="text-blue-400 text-xl" />
                                    ) : (
                                        <FiAlertCircle className="text-yellow-400 text-xl" />
                                    )}
                                </div>
                                <div>
                                    <p className="font-medium text-white">{notification.message}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
                @keyframes slide-up {
                    from { transform: translateY(100%); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                .animate-slide-up {
                    animation: slide-up 0.3s ease-out forwards;
                }
            `}</style>
        </>
    );
} 