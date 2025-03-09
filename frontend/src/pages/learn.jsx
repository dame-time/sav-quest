import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import {
    FiBook, FiLock, FiCheck, FiChevronDown, FiChevronUp,
    FiAward, FiClock, FiStar
} from "react-icons/fi";
import {
    BsCashCoin, BsPiggyBank, BsCalculator, BsJournalCheck,
    BsBank, BsGraphUp, BsShield
} from "react-icons/bs";
import Link from "next/link";
import { GradientGrid } from "@/components/utils/GradientGrid";

export default function LearnPage() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [learningPath, setLearningPath] = useState([]);
    const [userProgress, setUserProgress] = useState(null);
    const [expandedSections, setExpandedSections] = useState({});

    useEffect(() => {
        // Check if user is authenticated
        const userData = localStorage.getItem("savquest_user");
        if (!userData) {
            router.push("/signup");
            return;
        }

        setUser(JSON.parse(userData));

        // Get user traits to personalize content
        const progressData = JSON.parse(localStorage.getItem("savquest_progress") || "{}");
        const userTraits = Object.keys(progressData.traits || {})
            .filter(trait => {
                const traitData = progressData.traits[trait];
                // Handle both number and object formats
                if (typeof traitData === 'number') {
                    return traitData > 0;
                } else if (typeof traitData === 'object' && traitData !== null) {
                    return traitData.level > 0;
                }
                return false;
            });

        // Generate personalized learning path based on traits
        const personalizedPath = generateLearningPath(userTraits);
        setLearningPath(personalizedPath);

        // Initialize expanded sections (first section expanded by default)
        const initialExpandedState = {};
        if (personalizedPath.length > 0) {
            initialExpandedState[personalizedPath[0].id] = true;
        }
        setExpandedSections(initialExpandedState);

        // Get or initialize user learning progress
        let learningProgress = JSON.parse(localStorage.getItem("savquest_learning") || "null");
        if (!learningProgress) {
            learningProgress = {
                completedUnits: [],
                currentUnit: personalizedPath[0]?.units[0]?.id || null,
                unlockedUnits: [personalizedPath[0]?.units[0]?.id || null],
                xpEarned: 0,
                badges: []
            };
            localStorage.setItem("savquest_learning", JSON.stringify(learningProgress));
        }

        setUserProgress(learningProgress);
    }, [router]);

    // Function to generate personalized learning path based on user traits
    const generateLearningPath = (userTraits) => {
        // This would be more sophisticated in a real app
        // For now, we'll filter the full learning path to match user traits

        const fullPath = [
            {
                id: 1,
                title: "Financial Foundations",
                description: "Essential knowledge for your financial journey",
                color: "#FF7E1D", // Orange color for section 1
                units: [
                    {
                        id: "1-1",
                        title: "Money Basics",
                        description: "Understanding the fundamentals of money",
                        duration: "15 min",
                        xpReward: 20,
                        icon: <BsCashCoin />,
                        color: "#FF7E1D", // Orange
                        requiredTraits: [] // Everyone gets this
                    },
                    {
                        id: "1-2",
                        title: "Budgeting 101",
                        description: "Learn to create your first budget",
                        duration: "20 min",
                        xpReward: 30,
                        icon: <BsCalculator />,
                        color: "#FF7E1D", // Orange
                        requiredTraits: ["budgeter"]
                    },
                    {
                        id: "1-3",
                        title: "Saving Strategies",
                        description: "Simple techniques to save more",
                        duration: "18 min",
                        xpReward: 25,
                        icon: <BsPiggyBank />,
                        color: "#FF7E1D", // Orange
                        requiredTraits: ["saver"]
                    },
                    {
                        id: "1-4",
                        title: "Investment Basics",
                        description: "Introduction to growing your money",
                        duration: "25 min",
                        xpReward: 35,
                        icon: <BsGraphUp />,
                        color: "#FF7E1D", // Orange
                        requiredTraits: ["investor"]
                    }
                ]
            },
            {
                id: 2,
                title: "Building Good Habits",
                description: "Develop routines for financial success",
                color: "#4A6DF5", // Blue color for section 2
                units: [
                    {
                        id: "2-1",
                        title: "Tracking Expenses",
                        description: "Learn to monitor your spending",
                        duration: "22 min",
                        xpReward: 30,
                        icon: <BsJournalCheck />,
                        color: "#4A6DF5", // Blue
                        requiredTraits: ["budgeter"]
                    },
                    {
                        id: "2-2",
                        title: "Emergency Fund",
                        description: "Preparing for unexpected expenses",
                        duration: "20 min",
                        xpReward: 35,
                        icon: <BsShield />,
                        color: "#4A6DF5", // Blue
                        requiredTraits: ["saver"]
                    },
                    {
                        id: "2-3",
                        title: "Understanding Risk",
                        description: "Balancing risk and reward",
                        duration: "30 min",
                        xpReward: 40,
                        icon: <BsBank />,
                        color: "#4A6DF5", // Blue
                        requiredTraits: ["investor"]
                    }
                ]
            }
        ];

        // Filter units based on user traits, but keep common units
        return fullPath.map(section => ({
            ...section,
            units: section.units.filter(unit =>
                unit.requiredTraits.length === 0 ||
                unit.requiredTraits.some(trait => userTraits.includes(trait))
            )
        }));
    };

    const handleUnitClick = (unitId) => {
        if (userProgress.unlockedUnits.includes(unitId)) {
            router.push(`/learn/${unitId}`);
        }
    };

    const toggleSection = (sectionId) => {
        setExpandedSections(prev => ({
            ...prev,
            [sectionId]: !prev[sectionId]
        }));
    };

    if (!user || !learningPath.length || !userProgress) {
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
                <title>Learning Journey | SavQuest</title>
            </Head>
            <div className="min-h-screen bg-zinc-950 text-zinc-50 pt-20 pb-32 relative overflow-hidden">
                <GradientGrid />
                <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <h1 className="text-3xl font-bold mb-2">Your Financial Learning Journey</h1>
                    <p className="text-zinc-400 mb-8">Personalized lessons to build your financial knowledge</p>

                    {/* Stats bar */}
                    <div className="flex justify-between items-center bg-zinc-900/80 border border-zinc-800 rounded-lg p-4 mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
                                <FiBook className="text-white" />
                            </div>
                            <div>
                                <div className="text-sm text-zinc-400">Total XP Earned</div>
                                <div className="font-bold">{userProgress.xpEarned} XP</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center shadow-lg">
                                <FiCheck className="text-white" />
                            </div>
                            <div>
                                <div className="text-sm text-zinc-400">Completed Units</div>
                                <div className="font-bold">{userProgress.completedUnits.length} / {learningPath.reduce((acc, section) => acc + section.units.length, 0)}</div>
                            </div>
                        </div>
                    </div>

                    {/* Learning sections */}
                    <div className="space-y-4">
                        {learningPath.map((section) => (
                            <div key={section.id} className="bg-zinc-900/80 border border-zinc-800 rounded-lg overflow-hidden">
                                {/* Section header - clickable to expand/collapse */}
                                <div
                                    className="p-4 flex items-center justify-between cursor-pointer hover:bg-zinc-800/50"
                                    onClick={() => toggleSection(section.id)}
                                    style={{ borderLeft: `4px solid ${section.color}` }}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="text-xl font-bold" style={{ color: section.color }}>
                                            Section {section.id}: {section.title}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="text-sm text-zinc-400">
                                            {section.units.filter(unit => userProgress.completedUnits.includes(unit.id)).length} / {section.units.length} completed
                                        </div>
                                        {expandedSections[section.id] ? <FiChevronUp /> : <FiChevronDown />}
                                    </div>
                                </div>

                                {/* Section content - only visible when expanded */}
                                {expandedSections[section.id] && (
                                    <div className="p-4 pt-0 border-t border-zinc-800">
                                        <p className="text-zinc-400 mb-4 pl-4">{section.description}</p>

                                        <div className="space-y-3">
                                            {section.units.map((unit) => {
                                                const isCompleted = userProgress.completedUnits.includes(unit.id);
                                                const isUnlocked = userProgress.unlockedUnits.includes(unit.id);
                                                const isCurrent = userProgress.currentUnit === unit.id;

                                                return (
                                                    <div
                                                        key={unit.id}
                                                        className={`p-4 rounded-lg border ${isCompleted
                                                                ? 'border-green-600 bg-green-900/10'
                                                                : isCurrent
                                                                    ? 'border-blue-600 bg-blue-900/10'
                                                                    : isUnlocked
                                                                        ? `border-${section.color.replace('#', '')} bg-zinc-800/50`
                                                                        : 'border-zinc-700 bg-zinc-800/20'
                                                            } ${isUnlocked ? 'cursor-pointer hover:bg-zinc-800' : 'opacity-70'}`}
                                                        onClick={() => isUnlocked && handleUnitClick(unit.id)}
                                                    >
                                                        <div className="flex items-start gap-4">
                                                            <div
                                                                className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${isCompleted
                                                                        ? 'bg-green-600'
                                                                        : isUnlocked
                                                                            ? 'bg-gradient-to-br from-' + section.color.replace('#', '') + '/80 to-' + section.color.replace('#', '')
                                                                            : 'bg-zinc-700'
                                                                    }`}
                                                            >
                                                                {isCompleted ? (
                                                                    <FiCheck className="text-white text-xl" />
                                                                ) : (
                                                                    <div className="text-white text-xl">
                                                                        {!isUnlocked ? <FiLock /> : unit.icon}
                                                                    </div>
                                                                )}
                                                            </div>

                                                            <div className="flex-grow">
                                                                <div className="flex justify-between items-start">
                                                                    <div>
                                                                        <h3 className="font-bold text-lg">{unit.title}</h3>
                                                                        <p className="text-zinc-400 text-sm">{unit.description}</p>
                                                                    </div>

                                                                    {isUnlocked && (
                                                                        <div className="flex items-center gap-2 text-sm">
                                                                            <div className="flex items-center text-zinc-400">
                                                                                <FiClock className="mr-1" /> {unit.duration}
                                                                            </div>
                                                                            <div className="bg-blue-900/30 border border-blue-700 rounded-full px-2 py-0.5 text-blue-400">
                                                                                +{unit.xpReward} XP
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                {isCompleted && (
                                                                    <div className="mt-2 flex items-center text-green-400 text-sm">
                                                                        <FiStar className="mr-1" /> Completed
                                                                    </div>
                                                                )}

                                                                {!isUnlocked && (
                                                                    <div className="mt-2 flex items-center text-zinc-500 text-sm">
                                                                        <FiLock className="mr-1" /> Complete previous lessons to unlock
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Completion status */}
                    <div className="mt-8 text-center">
                        <div className="inline-block bg-zinc-900/80 border border-zinc-800 rounded-lg p-6">
                            <div className="text-4xl mb-3">
                                {userProgress.completedUnits.length === learningPath.reduce((acc, section) => acc + section.units.length, 0)
                                    ? '🏆'
                                    : '📚'}
                            </div>
                            <div className="font-bold text-lg">
                                {userProgress.completedUnits.length === learningPath.reduce((acc, section) => acc + section.units.length, 0)
                                    ? 'Congratulations! You\'ve completed all lessons.'
                                    : `${userProgress.completedUnits.length} of ${learningPath.reduce((acc, section) => acc + section.units.length, 0)} lessons completed`}
                            </div>
                            <div className="text-zinc-400 mt-1">
                                {userProgress.completedUnits.length === learningPath.reduce((acc, section) => acc + section.units.length, 0)
                                    ? 'You\'ve mastered the essentials of financial literacy!'
                                    : 'Keep learning to improve your financial knowledge'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
} 