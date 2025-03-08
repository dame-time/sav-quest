import Head from "next/head";
import { OnboardingLayout } from "@/components/onboarding/OnboardingLayout";
import { FinancialGoalsScreen } from "@/components/onboarding/FinancialGoalsScreen";

export default function OnboardingGoals() {
    return (
        <>
            <Head>
                <title>Your Financial Goals | SavQuest</title>
            </Head>
            <OnboardingLayout>
                <FinancialGoalsScreen />
            </OnboardingLayout>
        </>
    );
} 