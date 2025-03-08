import { useOnboarding } from "@/context/OnboardingContext";
import { motion } from "framer-motion";
import { useState } from "react";
import { SplashButton } from "../buttons/SplashButton";

const TRAITS = [
    {
        id: "saver",
        title: "Saver",
        description: "Master saving techniques",
        icon: "💰",
        color: "from-green-400 to-green-700",
    },
    {
        id: "investor",
        title: "Investor",
        description: "Learn wealth-building strategies",
        icon: "📊",
        color: "from-purple-400 to-purple-700",
    },
    {
        id: "budgeter",
        title: "Budgeter",
        description: "Develop expense management skills",
        icon: "📝",
        color: "from-yellow-400 to-yellow-700",
    },
    {
        id: "scholar",
        title: "Financial Scholar",
        description: "Build financial knowledge",
        icon: "🎓",
        color: "from-blue-400 to-blue-700",
    },
];

export const TraitPreferenceScreen = () => {
    const { selectedTrait, updateSelectedTrait, nextStep } = useOnboarding();
    const [selected, setSelected] = useState(selectedTrait);

    const handleSelect = (traitId) => {
        setSelected(traitId);
    };

    const handleContinue = () => {
        updateSelectedTrait(selected);
        nextStep();
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <h1 className="text-3xl font-bold mb-4 text-center">
                Which financial superpower would you like to develop first?
            </h1>

            <p className="text-zinc-400 mb-8 text-center">
                Choose the trait you'd like to focus on initially
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
                {TRAITS.map((trait) => (
                    <TraitCard
                        key={trait.id}
                        trait={trait}
                        selected={selected === trait.id}
                        onClick={() => handleSelect(trait.id)}
                    />
                ))}
            </div>

            <SplashButton
                onClick={handleContinue}
                className="mx-auto"
                disabled={!selected}
            >
                Continue
            </SplashButton>
        </motion.div>
    );
};

const TraitCard = ({ trait, selected, onClick }) => {
    return (
        <div
            onClick={onClick}
            className={`
        p-6 rounded-lg border cursor-pointer transition-all
        ${selected
                    ? `border-${trait.color.split(' ')[0].replace('from-', '')} bg-${trait.color.split(' ')[0].replace('from-', '')}/20`
                    : "border-zinc-700 bg-zinc-800/50 hover:bg-zinc-800"}
      `}
        >
            <div className="flex flex-col items-center text-center gap-3">
                <div className={`text-5xl p-4 rounded-full bg-gradient-to-br ${trait.color}`}>
                    {trait.icon}
                </div>
                <div>
                    <h3 className="text-xl font-medium text-zinc-100">{trait.title}</h3>
                    <p className="text-sm text-zinc-400">{trait.description}</p>
                </div>
            </div>
        </div>
    );
}; 