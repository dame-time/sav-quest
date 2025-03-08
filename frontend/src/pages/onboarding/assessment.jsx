import Head from "next/head";
import { OnboardingLayout } from "@/components/onboarding/OnboardingLayout";
import { LiteracyAssessmentScreen } from "@/components/onboarding/LiteracyAssessmentScreen";

export default function OnboardingAssessment() {
    return (
        <>
            <Head>
                <title>Financial Knowledge Assessment | SavQuest</title>
            </Head>
            <OnboardingLayout>
                <LiteracyAssessmentScreen />
            </OnboardingLayout>
        </>
    );
} 