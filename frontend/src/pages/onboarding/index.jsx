import Head from "next/head";
import { OnboardingLayout } from "@/components/onboarding/OnboardingLayout";
import { WelcomeScreen } from "@/components/onboarding/WelcomeScreen";

export default function OnboardingWelcome() {
    return (
        <>
            <Head>
                <title>Welcome to SavQuest</title>
            </Head>
            <OnboardingLayout showBackButton={false}>
                <WelcomeScreen />
            </OnboardingLayout>
        </>
    );
} 