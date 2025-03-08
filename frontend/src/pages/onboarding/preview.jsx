import Head from "next/head";
import { OnboardingLayout } from "@/components/onboarding/OnboardingLayout";
import { DashboardPreviewScreen } from "@/components/onboarding/DashboardPreviewScreen";

export default function OnboardingPreview() {
    return (
        <>
            <Head>
                <title>Dashboard Preview | SavQuest</title>
            </Head>
            <OnboardingLayout>
                <DashboardPreviewScreen />
            </OnboardingLayout>
        </>
    );
} 