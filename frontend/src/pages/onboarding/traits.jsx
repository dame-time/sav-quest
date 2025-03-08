import Head from "next/head";
import { OnboardingLayout } from "@/components/onboarding/OnboardingLayout";
import { TraitPreferenceScreen } from "@/components/onboarding/TraitPreferenceScreen";

export default function OnboardingTraits() {
    return (
        <>
            <Head>
                <title>Choose Your Financial Trait | SavQuest</title>
            </Head>
            <OnboardingLayout>
                <TraitPreferenceScreen />
            </OnboardingLayout>
        </>
    );
} 