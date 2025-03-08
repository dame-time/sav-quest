import { useOnboarding } from "@/context/OnboardingContext";
import { motion } from "framer-motion";
import { SplashButton } from "../buttons/SplashButton";
import { GhostButton } from "../buttons/GhostButton";
import { FiLock, FiShield, FiCheckCircle } from "react-icons/fi";

export const ConnectBankingScreen = () => {
    const { completeOnboarding } = useOnboarding();

    const handleConnect = () => {
        // In a real implementation, this would trigger the TrueLayer connection flow
        // For now, we'll just complete the onboarding
        completeOnboarding();
    };

    const handleSkip = () => {
        // Allow users to skip this step
        completeOnboarding();
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center"
        >
            <h1 className="text-3xl font-bold mb-4">
                One last step: Connect your banking data
            </h1>

            <p className="text-xl text-zinc-300 mb-8">
                SavQuest uses TrueLayer to securely access your financial information
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <BenefitCard
                    icon={<FiCheckCircle className="text-green-400" />}
                    title="Personalized Challenges"
                    description="Get challenges based on your actual spending habits"
                />
                <BenefitCard
                    icon={<FiLock className="text-blue-400" />}
                    title="Automatic Tracking"
                    description="We'll track your financial progress automatically"
                />
                <BenefitCard
                    icon={<FiShield className="text-purple-400" />}
                    title="Bank-Level Security"
                    description="Your data is encrypted and never shared with third parties"
                />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <GhostButton onClick={handleSkip}>
                    Connect Later
                </GhostButton>
                <SplashButton onClick={handleConnect}>
                    Connect Now
                </SplashButton>
            </div>
        </motion.div>
    );
};

const BenefitCard = ({ icon, title, description }) => {
    return (
        <div className="p-6 border border-zinc-700 rounded-lg bg-zinc-800/50">
            <div className="flex flex-col items-center text-center">
                <div className="text-2xl mb-4">
                    {icon}
                </div>
                <h3 className="text-lg font-medium mb-2">{title}</h3>
                <p className="text-sm text-zinc-400">{description}</p>
            </div>
        </div>
    );
}; 