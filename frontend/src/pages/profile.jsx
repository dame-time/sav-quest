import Head from "next/head";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useOnboarding } from "@/context/OnboardingContext";
import { FiAward, FiCalendar, FiLock, FiStar, FiTrendingUp, FiUnlock, FiEdit, FiTarget, FiBook, FiDollarSign, FiCpu, FiPieChart, FiShield, FiZap, FiBarChart2 } from "react-icons/fi";
import { GradientGrid } from "@/components/utils/GradientGrid";

export default function Profile() {
    const router = useRouter();
    const { selectedTrait, updateSelectedTrait } = useOnboarding();
    const [user, setUser] = useState(null);
    const [progressState, setProgressState] = useState(null);

    useEffect(() => {
        // Check if user is authenticated
        const userData = localStorage.getItem("savquest_user");
        if (!userData) {
            router.push("/signup");
            return;
        }

        setUser(JSON.parse(userData));

        // For demo purposes, let's add some mock data to localStorage if it doesn't exist
        if (!localStorage.getItem("savquest_progress")) {
            // Generate random traits for the user
            const randomTraits = generateRandomTraits();
            
            localStorage.setItem("savquest_progress", JSON.stringify({
                streak: 3,
                xp: 120,
                level: 2,
                badges: [
                    { id: "first_login", name: "First Login", description: "Logged in for the first time", unlocked: true, icon: "🏆" },
                    { id: "profile_complete", name: "Profile Complete", description: "Completed your profile information", unlocked: true, icon: "📝" },
                    { id: "first_challenge", name: "Challenge Accepted", description: "Completed your first challenge", unlocked: false, icon: "🎯" },
                ],
                traits: randomTraits
            }));
        }
        
        // Load progress data
        const progressData = JSON.parse(localStorage.getItem("savquest_progress") || "{}");
        setProgressState(progressData);
    }, [router]);

    // Function to level up a trait
    const levelUpTrait = (traitId) => {
        if (!progressState) return;
        
        const updatedProgress = JSON.parse(JSON.stringify(progressState)); // Deep clone to avoid reference issues
        
        if (updatedProgress.traits && updatedProgress.traits[traitId] !== undefined) {
            let trait = updatedProgress.traits[traitId];
            
            // Convert number trait to object if needed
            if (typeof trait === 'number') {
                // Convert the numeric trait value to our object format
                const traitValue = trait;
                trait = {
                    level: Math.max(1, Math.floor(traitValue / 20)), // Rough conversion: 0-20 = level 1, 21-40 = level 2, etc.
                    xp: (traitValue % 20) * 5, // Convert remaining points to XP
                    maxXp: 100
                };
                updatedProgress.traits[traitId] = trait;
            }
            
            // Add XP
            const xpGain = Math.floor(Math.random() * 30) + 10; // Random XP between 10-39
            trait.xp += xpGain;
            
            // Check if level up
            if (trait.xp >= trait.maxXp) {
                trait.level += 1;
                trait.xp = trait.xp - trait.maxXp;
                trait.maxXp = Math.floor(trait.maxXp * 1.5); // Increase XP required for next level
                
                // Show level up notification
                alert(`Congratulations! Your ${getTraitInfo(traitId).name} trait leveled up to level ${trait.level}!`);
                
                // Check if a new skill was unlocked
                const traitInfo = getTraitInfo(traitId);
                const newlyUnlockedSkills = traitInfo.skills.filter(skill => skill.levelRequired === trait.level);
                
                if (newlyUnlockedSkills.length > 0) {
                    // Add skill badges
                    if (!updatedProgress.badges) {
                        updatedProgress.badges = [];
                    }
                    
                    newlyUnlockedSkills.forEach(skill => {
                        // Get appropriate icon based on trait type
                        let skillIcon;
                        switch(traitId) {
                            case 'saver':
                                skillIcon = "💰";
                                break;
                            case 'investor':
                                skillIcon = "📊";
                                break;
                            case 'budgeter':
                                skillIcon = "📝";
                                break;
                            case 'scholar':
                                skillIcon = "🎓";
                                break;
                            case 'minimalist':
                                skillIcon = "✨";
                                break;
                            case 'entrepreneur':
                                skillIcon = "💼";
                                break;
                            case 'techie':
                                skillIcon = "💻";
                                break;
                            case 'analyst':
                                skillIcon = "📈";
                                break;
                            default:
                                skillIcon = "🌟";
                        }
                        
                        // Create a new badge for the unlocked skill
                        const skillBadge = {
                            id: `${traitId}_${skill.name.toLowerCase().replace(/\s+/g, '_')}`,
                            name: skill.name,
                            description: `${skill.description} (${traitInfo.name} skill)`,
                            unlocked: true,
                            icon: skillIcon,
                            date: new Date().toISOString(),
                            traitColor: traitInfo.color // Store the trait color for styling
                        };
                        
                        // Add badge if it doesn't exist already
                        if (!updatedProgress.badges.some(badge => badge.id === skillBadge.id)) {
                            updatedProgress.badges.push(skillBadge);
                            // Show notification about new badge
                            alert(`New Skill Badge Unlocked: ${skill.name}!`);
                        }
                    });
                }
            } else {
                // Show XP gain notification
                alert(`You gained ${xpGain} XP for your ${getTraitInfo(traitId).name} trait!`);
            }
            
            // Update overall user XP and level
            updatedProgress.xp = (updatedProgress.xp || 0) + Math.floor(xpGain / 2);
            
            // Check if user level up (simplified)
            if (updatedProgress.xp >= 200 && (!updatedProgress.level || updatedProgress.level < 3)) {
                updatedProgress.level = 3;
                alert("Congratulations! You reached level 3!");
            }
            
            // Save updated progress
            localStorage.setItem("savquest_progress", JSON.stringify(updatedProgress));
            setProgressState(updatedProgress);
        }
    };
    
    // Function to set a trait as primary
    const setAsPrimaryTrait = (traitId) => {
        updateSelectedTrait(traitId);
        alert(`${getTraitInfo(traitId).name} is now your primary trait!`);
    };

    // Function to generate random traits for a new user
    const generateRandomTraits = () => {
        // Get all available trait types from getTraitInfo
        const traitTypes = Object.keys(getTraitInfo('').traits);
        
        // Select 3-5 random traits for the user
        const numTraits = Math.floor(Math.random() * 3) + 3; // 3-5 traits
        const selectedTraits = [];
        
        // Ensure we always have the core traits (saver, investor, budgeter)
        const coreTraits = ['saver', 'investor', 'budgeter'];
        
        // Add core traits without duplicates
        coreTraits.forEach(trait => {
            if (!selectedTraits.includes(trait)) {
                selectedTraits.push(trait);
            }
        });
        
        // Add additional random traits if needed
        while (selectedTraits.length < numTraits) {
            const randomTraitIndex = Math.floor(Math.random() * traitTypes.length);
            const randomTrait = traitTypes[randomTraitIndex];
            
            // Only add if not already in the list
            if (!selectedTraits.includes(randomTrait)) {
                selectedTraits.push(randomTrait);
            }
        }
        
        // Create traits object with random levels and XP
        const traits = {};
        selectedTraits.forEach(trait => {
            const level = Math.floor(Math.random() * 3) + 1; // Level 1-3
            const xp = Math.floor(Math.random() * 80) + 10; // XP between 10-89
            traits[trait] = { level, xp, maxXp: 100 };
        });
        
        return traits;
    };

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
                <title>Your Profile | SavQuest</title>
            </Head>
            <div className="min-h-screen bg-zinc-950 text-zinc-50 pt-20 relative overflow-hidden">
                <GradientGrid />
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Profile Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-zinc-900/50 border border-zinc-700 rounded-lg p-6">
                                <div className="text-center mb-6">
                                    <div className="w-24 h-24 bg-blue-600 rounded-full mx-auto flex items-center justify-center text-3xl">
                                        {user.username ? user.username.charAt(0).toUpperCase() : "U"}
                                    </div>
                                    <h1 className="text-2xl font-bold mt-4">{user.username}</h1>
                                    <p className="text-zinc-400">{user.email}</p>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <FiStar className="text-yellow-500" />
                                            <span>Level</span>
                                        </div>
                                        <span className="font-bold">{progressState?.level || 1}</span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <FiTrendingUp className="text-blue-500" />
                                            <span>XP</span>
                                        </div>
                                        <span className="font-bold">{progressState?.xp || 0}</span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <FiCalendar className="text-green-500" />
                                            <span>Streak</span>
                                        </div>
                                        <span className="font-bold">{progressState?.streak || 0} days</span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <FiAward className="text-purple-500" />
                                            <span>Badges</span>
                                        </div>
                                        <span className="font-bold">
                                            {progressState?.badges ? progressState.badges.filter(b => b.unlocked).length : 0} /
                                            {progressState?.badges ? progressState.badges.length : 0}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Badges Section */}
                            <div className="mt-8 bg-zinc-900/50 border border-zinc-700 rounded-lg p-6">
                                <h2 className="text-xl font-bold mb-4">Badges & Unlocked Skills</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    {progressState?.badges ? (
                                        progressState.badges.map((badge) => {
                                            // Determine if this is a skill badge by checking the ID format
                                            const isSkillBadge = badge.id.includes('_');
                                            let traitColor = 'blue';
                                            
                                            if (isSkillBadge && badge.traitColor) {
                                                traitColor = badge.traitColor;
                                            }
                                            
                                            return (
                                                <div
                                                    key={badge.id}
                                                    className={`p-4 border rounded-lg text-center ${badge.unlocked
                                                        ? isSkillBadge 
                                                          ? `border-${traitColor}-500 bg-${traitColor}-900/20` 
                                                          : "border-blue-500 bg-blue-900/20"
                                                        : "border-zinc-700 bg-zinc-800/50 opacity-60"
                                                        }`}
                                                >
                                                    <div className="text-3xl mb-2">
                                                        {badge.unlocked ? badge.icon : <FiLock />}
                                                    </div>
                                                    <h3 className="font-medium">{badge.name}</h3>
                                                    <p className="text-xs text-zinc-400">{badge.description}</p>
                                                    {badge.date && (
                                                        <p className="text-xs text-zinc-500 mt-2">
                                                            {new Date(badge.date).toLocaleDateString()}
                                                        </p>
                                                    )}
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <p className="text-zinc-400 col-span-2">No badges yet</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Financial Traits */}
                        <div className="lg:col-span-2">
                            <div className="bg-zinc-900/50 border border-zinc-700 rounded-lg p-6">
                                <h2 className="text-xl font-bold mb-6">Financial Traits</h2>

                                <div className="space-y-8">
                                    {progressState?.traits && Object.entries(progressState.traits)
                                        // Filter out any duplicate trait IDs
                                        .filter(([traitId, _], index, self) => 
                                            index === self.findIndex(([id, _]) => id === traitId)
                                        )
                                        .map(([traitId, trait]) => {
                                        const traitInfo = getTraitInfo(traitId);
                                        if (!traitInfo) return null; // Skip if trait info not found
                                        
                                        const isSelected = selectedTrait === traitId;

                                        return (
                                            <div
                                                key={traitId}
                                                className={`p-4 border rounded-lg ${isSelected
                                                    ? `border-${traitInfo.color}-500 bg-${traitInfo.color}-900/20`
                                                    : "border-zinc-700"
                                                    }`}
                                            >
                                                <div className="flex items-center gap-4 mb-3">
                                                    <div className={`text-3xl p-2 rounded-full bg-${traitInfo.color}-900/30 text-${traitInfo.color}-400`}>
                                                        {traitInfo.icon}
                                                    </div>
                                                    <div>
                                                        <h3 className="text-lg font-medium flex items-center gap-2">
                                                            {traitInfo.name}
                                                            {isSelected && (
                                                                <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">
                                                                    Primary
                                                                </span>
                                                            )}
                                                        </h3>
                                                        <p className="text-sm text-zinc-400">{traitInfo.description}</p>
                                                    </div>
                                                    <div className="ml-auto text-right">
                                                        <div className="text-lg font-bold">
                                                            Level {typeof trait === 'number' 
                                                                ? Math.max(1, Math.floor(trait / 20)) 
                                                                : trait.level}
                                                        </div>
                                                        <div className="text-sm text-zinc-400">
                                                            {typeof trait === 'number' 
                                                                ? `${trait}/100 points` 
                                                                : `${trait.xp}/${trait.maxXp} XP`}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Progress bar */}
                                                <div className="w-full h-2 bg-zinc-700 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full bg-${traitInfo.color}-500`}
                                                        style={{ width: `${typeof trait === 'number' 
                                                            ? trait 
                                                            : (trait.xp / trait.maxXp) * 100}%` }}
                                                    ></div>
                                                </div>

                                                {/* Skill summary */}
                                                {(() => {
                                                    const traitLevel = typeof trait === 'number' 
                                                        ? Math.max(1, Math.floor(trait / 20))
                                                        : trait.level;
                                                    
                                                    const unlockedSkills = traitInfo.skills.filter(
                                                        skill => skill.levelRequired <= traitLevel
                                                    );
                                                    
                                                    const lockedSkills = traitInfo.skills.filter(
                                                        skill => skill.levelRequired > traitLevel
                                                    );
                                                    
                                                    return (
                                                        <div className="mt-3 mb-4">
                                                            <div className="flex justify-between text-sm">
                                                                <span className="text-green-400">
                                                                    {unlockedSkills.length} skills unlocked
                                                                </span>
                                                                <span className="text-zinc-400">
                                                                    {lockedSkills.length} skills remaining
                                                                </span>
                                                            </div>
                                                            
                                                            {/* Mini skill indicators */}
                                                            <div className="flex gap-1 mt-2">
                                                                {traitInfo.skills.map((skill, idx) => (
                                                                    <div 
                                                                        key={idx}
                                                                        className={`h-1.5 flex-1 rounded-full ${
                                                                            skill.levelRequired <= traitLevel
                                                                                ? `bg-${traitInfo.color}-500`
                                                                                : 'bg-zinc-700'
                                                                        }`}
                                                                        title={`${skill.name} (Level ${skill.levelRequired})`}
                                                                    />
                                                                ))}
                                                            </div>
                                                        </div>
                                                    );
                                                })()}

                                                {/* Unlockable skills */}
                                                <div className="mt-4">
                                                    <h4 className="font-medium mb-2">Unlockable Skills</h4>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                        {traitInfo.skills.map((skill, index) => {
                                                            const traitLevel = typeof trait === 'number' 
                                                                ? Math.max(1, Math.floor(trait / 20))
                                                                : trait.level;
                                                            const isUnlocked = traitLevel >= skill.levelRequired;
                                                            
                                                            // Check if this skill has a badge
                                                            const skillBadgeId = `${traitId}_${skill.name.toLowerCase().replace(/\s+/g, '_')}`;
                                                            const hasBadge = progressState?.badges?.some(
                                                                badge => badge.id === skillBadgeId && badge.unlocked
                                                            );

                                                            return (
                                                                <div
                                                                    key={index}
                                                                    className={`flex flex-col p-3 border rounded-lg ${isUnlocked
                                                                        ? `border-${traitInfo.color}-500 bg-${traitInfo.color}-900/10`
                                                                        : "border-zinc-700 bg-zinc-800/50 opacity-60"
                                                                        }`}
                                                                >
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="text-xl">
                                                                            {isUnlocked ? <FiUnlock className="text-green-500" /> : <FiLock className="text-zinc-500" />}
                                                                        </div>
                                                                        <div className="flex-1">
                                                                            <div className="font-medium flex items-center gap-2">
                                                                                {skill.name}
                                                                                {hasBadge && (
                                                                                    <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">
                                                                                        Badged
                                                                                    </span>
                                                                                )}
                                                                            </div>
                                                                            <div className="text-xs text-zinc-400">
                                                                                {isUnlocked ? "Unlocked" : `Unlocks at level ${skill.levelRequired}`}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    {skill.description && (
                                                                        <div className="mt-2 text-sm text-zinc-300 pl-8">
                                                                            {skill.description}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>

                                                {/* Actions for this trait */}
                                                <div className="mt-6 flex flex-wrap gap-3 justify-between items-center">
                                                    <button
                                                        onClick={() => levelUpTrait(traitId)}
                                                        className={`px-4 py-2 rounded-md bg-${traitInfo.color}-600 hover:bg-${traitInfo.color}-500 text-white text-sm transition-colors`}
                                                    >
                                                        Level Up This Trait
                                                    </button>
                                                    
                                                    {isSelected ? (
                                                        <span className="text-xs bg-blue-600 text-white px-3 py-1 rounded-full">
                                                            Primary Trait
                                                        </span>
                                                    ) : (
                                                        <button
                                                            onClick={() => setAsPrimaryTrait(traitId)}
                                                            className="px-4 py-2 rounded-md bg-zinc-700 hover:bg-zinc-600 text-white text-sm transition-colors"
                                                        >
                                                            Set as Primary
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

function getTraitInfo(traitId) {
    const traits = {
        saver: {
            name: "Saver",
            description: "Master saving techniques and build financial security",
            icon: <FiDollarSign className="text-green-500" />,
            color: "green",
            skills: [
                { name: "Basic Budgeting", levelRequired: 1, description: "Create a simple monthly budget" },
                { name: "Emergency Fund Planning", levelRequired: 2, description: "Learn to build a 3-6 month emergency fund" },
                { name: "Automated Savings", levelRequired: 3, description: "Set up recurring transfers to savings accounts" },
                { name: "Advanced Saving Strategies", levelRequired: 5, description: "Optimize your savings with advanced techniques" },
                { name: "Financial Independence", levelRequired: 8, description: "Master the path to financial freedom" }
            ]
        },
        investor: {
            name: "Investor",
            description: "Learn wealth-building strategies for long-term growth",
            icon: <FiTrendingUp className="text-purple-500" />,
            color: "purple",
            skills: [
                { name: "Investment Basics", levelRequired: 1, description: "Understand fundamental investment concepts" },
                { name: "Stock Market Fundamentals", levelRequired: 2, description: "Learn how to analyze stocks and markets" },
                { name: "Portfolio Diversification", levelRequired: 3, description: "Balance risk across different asset classes" },
                { name: "Advanced Investment Analysis", levelRequired: 5, description: "Use sophisticated methods to evaluate investments" },
                { name: "Wealth Management", levelRequired: 7, description: "Strategies for managing significant assets" }
            ]
        },
        budgeter: {
            name: "Budgeter",
            description: "Develop expense management skills for financial control",
            icon: <FiEdit className="text-yellow-500" />,
            color: "yellow",
            skills: [
                { name: "Expense Tracking", levelRequired: 1, description: "Monitor where your money goes" },
                { name: "Budget Creation", levelRequired: 2, description: "Build effective spending plans" },
                { name: "Debt Management", levelRequired: 3, description: "Strategies to reduce and eliminate debt" },
                { name: "Zero-Based Budgeting", levelRequired: 5, description: "Assign every dollar a purpose" },
                { name: "Financial Forecasting", levelRequired: 6, description: "Project future expenses and income" }
            ]
        },
        scholar: {
            name: "Financial Scholar",
            description: "Build comprehensive financial knowledge and expertise",
            icon: <FiBook className="text-blue-500" />,
            color: "blue",
            skills: [
                { name: "Financial Terms", levelRequired: 1, description: "Master essential financial vocabulary" },
                { name: "Tax Basics", levelRequired: 2, description: "Understand tax principles and strategies" },
                { name: "Retirement Planning", levelRequired: 3, description: "Prepare for a secure retirement" },
                { name: "Estate Planning", levelRequired: 5, description: "Learn about wills, trusts and inheritance" },
                { name: "Advanced Tax Strategies", levelRequired: 7, description: "Optimize your tax situation legally" }
            ]
        },
        minimalist: {
            name: "Financial Minimalist",
            description: "Master the art of doing more with less",
            icon: <FiTarget className="text-indigo-500" />,
            color: "indigo",
            skills: [
                { name: "Needs vs Wants", levelRequired: 1, description: "Distinguish between essential and non-essential expenses" },
                { name: "Mindful Spending", levelRequired: 2, description: "Make intentional purchasing decisions" },
                { name: "Decluttering Finances", levelRequired: 3, description: "Simplify accounts and financial systems" },
                { name: "Frugal Living", levelRequired: 4, description: "Maximize value while minimizing costs" },
                { name: "Financial Zen", levelRequired: 6, description: "Achieve peace of mind through simplicity" }
            ]
        },
        entrepreneur: {
            name: "Financial Entrepreneur",
            description: "Develop skills to build and grow income streams",
            icon: <FiBarChart2 className="text-pink-500" />,
            color: "pink",
            skills: [
                { name: "Side Hustle Basics", levelRequired: 1, description: "Start your first additional income stream" },
                { name: "Business Planning", levelRequired: 2, description: "Create effective business models" },
                { name: "Income Diversification", levelRequired: 3, description: "Build multiple revenue sources" },
                { name: "Scaling Strategies", levelRequired: 5, description: "Grow your income exponentially" },
                { name: "Passive Income Mastery", levelRequired: 7, description: "Create income that doesn't require active work" }
            ]
        },
        techie: {
            name: "Financial Technologist",
            description: "Leverage technology for financial optimization",
            icon: <FiCpu className="text-cyan-500" />,
            color: "cyan",
            skills: [
                { name: "Fintech Basics", levelRequired: 1, description: "Use apps and tools for financial management" },
                { name: "Automation Setup", levelRequired: 2, description: "Automate bills, savings and investments" },
                { name: "Digital Security", levelRequired: 3, description: "Protect your financial accounts and identity" },
                { name: "Algorithmic Investing", levelRequired: 5, description: "Use technology for investment decisions" },
                { name: "Cryptocurrency Fundamentals", levelRequired: 6, description: "Understand blockchain and digital assets" }
            ]
        },
        analyst: {
            name: "Financial Analyst",
            description: "Master data-driven financial decision making",
            icon: <FiPieChart className="text-red-500" />,
            color: "red",
            skills: [
                { name: "Data Collection", levelRequired: 1, description: "Gather relevant financial information" },
                { name: "Trend Analysis", levelRequired: 2, description: "Identify patterns in your financial data" },
                { name: "Financial Modeling", levelRequired: 3, description: "Create predictive models for decisions" },
                { name: "Risk Assessment", levelRequired: 4, description: "Evaluate and quantify financial risks" },
                { name: "Advanced Analytics", levelRequired: 6, description: "Use sophisticated techniques for deep insights" }
            ]
        }
    };

    // If the trait exists, return it, otherwise return a random trait
    if (traits[traitId]) {
        return traits[traitId];
    } else if (traitId === '') {
        // Only return the traits object when explicitly requested
        return { traits };
    } else {
        // Get all trait keys and select a random one
        const traitKeys = Object.keys(traits);
        const randomTraitKey = traitKeys[Math.floor(Math.random() * traitKeys.length)];
        return traits[randomTraitKey];
    }
} 