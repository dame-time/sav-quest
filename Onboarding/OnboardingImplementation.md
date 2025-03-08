# SavQuest Onboarding Implementation Plan

## Integration with Existing Project

We'll implement the onboarding flow within your existing the-startup-js project structure, leveraging the Hover.dev components you're already using.

## Implementation Steps

### 1. Create Onboarding Context

First, we'll create a context to manage the onboarding state:

```javascript:the-startup-js/src/context/OnboardingContext.jsx
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
```

### 2. Update _app.jsx to Include the Provider

```javascript:the-startup-js/src/pages/_app.jsx
import { OnboardingProvider } from "../context/OnboardingContext";

export default function App({ Component, pageProps }) {
  return (
    <OnboardingProvider>
      <Component {...pageProps} />
    </OnboardingProvider>
  );
}
```

### 3. Create the ProgressIndicator Component

```javascript:the-startup-js/src/components/onboarding/ProgressIndicator.jsx
import { motion } from "framer-motion";
import { useOnboarding } from "@/context/OnboardingContext";

export const ProgressIndicator = () => {
  const { currentStep, totalSteps } = useOnboarding();
  
  return (
    <div className="fixed left-8 top-1/2 -translate-y-1/2 hidden md:block">
      <div className="relative h-80 w-16">
        {/* Rocket Track */}
        <div className="absolute left-1/2 top-0 h-full w-1 -translate-x-1/2 rounded-full bg-zinc-800"></div>
        
        {/* Step Markers */}
        {Array.from({ length: totalSteps }).map((_, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          
          return (
            <div
              key={stepNumber}
              className={`absolute left-1/2 -translate-x-1/2 size-3 rounded-full ${
                isCompleted 
                  ? "bg-blue-500" 
                  : isCurrent 
                  ? "bg-blue-400" 
                  : "bg-zinc-700"
              }`}
              style={{
                top: `${(index / (totalSteps - 1)) * 100}%`,
              }}
            />
          );
        })}
        
        {/* Rocket Ship */}
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 z-10"
          initial={{ top: "0%" }}
          animate={{ 
            top: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` 
          }}
          transition={{ 
            type: "spring", 
            stiffness: 100, 
            damping: 15 
          }}
        >
          <div className="relative -ml-6 -mt-6">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L12 6" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round"/>
              <path d="M12 18L12 22" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round"/>
              <path d="M4.93 4.93L7.76 7.76" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round"/>
              <path d="M16.24 16.24L19.07 19.07" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round"/>
              <path d="M2 12L6 12" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round"/>
              <path d="M18 12L22 12" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round"/>
              <path d="M4.93 19.07L7.76 16.24" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round"/>
              <path d="M16.24 7.76L19.07 4.93" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="12" cy="12" r="4" fill="#3B82F6"/>
            </svg>
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-6 h-10 bg-gradient-to-b from-blue-500 to-transparent opacity-50 rounded-full blur-sm" />
          </div>
        </motion.div>
      </div>
    </div>
  );
};
```

### 4. Create the OnboardingLayout Component

```javascript:the-startup-js/src/components/onboarding/OnboardingLayout.jsx
import { ProgressIndicator } from "./ProgressIndicator";
import { MaxWidthWrapper } from "../utils/MaxWidthWrapper";
import { useOnboarding } from "@/context/OnboardingContext";
import { motion } from "framer-motion";

export const OnboardingLayout = ({ children, showBackButton = true }) => {
  const { currentStep, prevStep } = useOnboarding();
  
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      <ProgressIndicator />
      
      <MaxWidthWrapper className="py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto"
        >
          {currentStep > 1 && showBackButton && (
            <button
              onClick={prevStep}
              className="mb-6 text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              ← Back
            </button>
          )}
          
          {children}
        </motion.div>
      </MaxWidthWrapper>
      
      <div className="absolute inset-0 bg-grid-zinc-700/50 z-0" />
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/0 to-zinc-950 z-0" />
    </div>
  );
};
```

### 5. Create Individual Screen Components

Let's start with the welcome screen:

```javascript:the-startup-js/src/components/onboarding/WelcomeScreen.jsx
import { SplashButton } from "../buttons/SplashButton";
import { useOnboarding } from "@/context/OnboardingContext";
import { motion } from "framer-motion";

export const WelcomeScreen = () => {
  const { nextStep } = useOnboarding();
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
        Welcome to Your Financial Journey!
      </h1>
      
      <p className="text-xl text-zinc-300 mb-8">
        You've taken the first step toward financial mastery
      </p>
      
      <p className="text-zinc-400 mb-12 max-w-lg mx-auto">
        SavQuest turns financial learning into a game where you'll earn rewards while building real-world skills
      </p>
      
      <SplashButton onClick={nextStep} className="mx-auto">
        Let's Get Started
      </SplashButton>
    </motion.div>
  );
};
```

### 6. Create Page Files for Each Onboarding Step

```javascript:the-startup-js/src/pages/onboarding/index.js
import { OnboardingLayout } from "@/components/onboarding/OnboardingLayout";
import { WelcomeScreen } from "@/components/onboarding/WelcomeScreen";
import Head from "next/head";

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
```

### 7. Continue with Other Screens

Following the same pattern, we'll create the remaining screen components and their corresponding pages:

- FinancialGoalsScreen.jsx and pages/onboarding/goals.js
- LiteracyAssessmentScreen.jsx and pages/onboarding/assessment.js
- TraitPreferenceScreen.jsx and pages/onboarding/traits.js
- DashboardPreviewScreen.jsx and pages/onboarding/preview.js
- ConnectBankingScreen.jsx and pages/onboarding/connect.js

### 8. Create a Dashboard Page

```javascript:the-startup-js/src/pages/dashboard.js
import Head from "next/head";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useOnboarding } from "@/context/OnboardingContext";
import { MaxWidthWrapper } from "@/components/utils/MaxWidthWrapper";

export default function Dashboard() {
  const { completed } = useOnboarding();
  const router = useRouter();
  
  // Redirect to onboarding if not completed
  useEffect(() => {
    if (!completed) {
      router.push("/onboarding");
    }
  }, [completed, router]);
  
  return (
    <>
      <Head>
        <title>SavQuest Dashboard</title>
      </Head>
      <div className="min-h-screen bg-zinc-950 text-zinc-50">
        <MaxWidthWrapper className="py-20">
          <h1 className="text-4xl font-bold mb-6">Welcome to SavQuest!</h1>
          <p className="text-xl text-zinc-300">
            Your financial journey begins here.
          </p>
          {/* Dashboard content will go here */}
        </MaxWidthWrapper>
      </div>
    </>
  );
}
```

## Next Steps

1. Implement the remaining screen components:
   - FinancialGoalsScreen with a carousel for goal selection
   - LiteracyAssessmentScreen with a slider for self-assessment
   - TraitPreferenceScreen with cards for trait selection
   - DashboardPreviewScreen with a mockup of the dashboard
   - ConnectBankingScreen with information about TrueLayer

2. Create the corresponding page files for each screen

3. Add authentication checks to ensure only authenticated users can access the onboarding flow

4. Connect the onboarding data to your backend when the user completes the flow

5. Implement the actual dashboard that users will see after completing onboarding 