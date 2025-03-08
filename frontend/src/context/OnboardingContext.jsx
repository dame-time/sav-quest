import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/router";

const OnboardingContext = createContext(null);

export const OnboardingProvider = ({ children }) => {
    const router = useRouter();
    const [onboardingState, setOnboardingState] = useState({
        currentStep: 1,
        totalSteps: 6,
        financialGoals: [],
        literacyLevel: 3,
        selectedTrait: null,
        completed: false,
    });

    // Load from localStorage if available
    useEffect(() => {
        const savedState = localStorage.getItem("savquest_onboarding");
        if (savedState) {
            setOnboardingState(JSON.parse(savedState));
        }
    }, []);

    // Save to localStorage when state changes
    useEffect(() => {
        localStorage.setItem(
            "savquest_onboarding",
            JSON.stringify(onboardingState)
        );
    }, [onboardingState]);

    const nextStep = () => {
        const newStep = onboardingState.currentStep + 1;
        setOnboardingState({ ...onboardingState, currentStep: newStep });

        // Navigate to the appropriate page
        navigateToStep(newStep);
    };

    const prevStep = () => {
        const newStep = Math.max(1, onboardingState.currentStep - 1);
        setOnboardingState({ ...onboardingState, currentStep: newStep });

        // Navigate to the appropriate page
        navigateToStep(newStep);
    };

    const navigateToStep = (step) => {
        switch (step) {
            case 1:
                router.push("/onboarding");
                break;
            case 2:
                router.push("/onboarding/goals");
                break;
            case 3:
                router.push("/onboarding/assessment");
                break;
            case 4:
                router.push("/onboarding/traits");
                break;
            case 5:
                router.push("/onboarding/preview");
                break;
            case 6:
                router.push("/onboarding/connect");
                break;
            default:
                router.push("/dashboard");
                break;
        }
    };

    const updateGoals = (goals) => {
        setOnboardingState({ ...onboardingState, financialGoals: goals });
    };

    const updateLiteracyLevel = (level) => {
        setOnboardingState({ ...onboardingState, literacyLevel: level });
    };

    const updateSelectedTrait = (trait) => {
        setOnboardingState({ ...onboardingState, selectedTrait: trait });
    };

    const completeOnboarding = () => {
        setOnboardingState({ ...onboardingState, completed: true });
        // Here you would typically save the user's preferences to your backend
        router.push("/dashboard");
    };

    return (
        <OnboardingContext.Provider
            value={{
                ...onboardingState,
                nextStep,
                prevStep,
                updateGoals,
                updateLiteracyLevel,
                updateSelectedTrait,
                completeOnboarding,
            }}
        >
            {children}
        </OnboardingContext.Provider>
    );
};

export const useOnboarding = () => {
    const context = useContext(OnboardingContext);
    if (!context) {
        throw new Error("useOnboarding must be used within an OnboardingProvider");
    }
    return context;
}; 