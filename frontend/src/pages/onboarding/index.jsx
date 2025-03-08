import Head from "next/head";
import { OnboardingLayout } from "@/components/onboarding/OnboardingLayout";
import { WelcomeScreen } from "@/components/onboarding/WelcomeScreen";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function OnboardingWelcome() {
    const router = useRouter();

    useEffect(() => {
        // Check if user is authenticated
        const user = localStorage.getItem("savquest_user");
        if (!user) {
            router.push("/signup");
        }
    }, [router]);

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