import Head from "next/head";
import { OnboardingLayout } from "@/components/onboarding/OnboardingLayout";
import { ConnectBankingScreen } from "@/components/onboarding/ConnectBankingScreen";

export default function OnboardingConnect() {
    return (
        <>
            <Head>
                <title>Connect Banking | SavQuest</title>
            </Head>
            <OnboardingLayout>
                <ConnectBankingScreen />
            </OnboardingLayout>
        </>
    );
} 