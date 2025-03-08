# SavQuest Onboarding Structure

## File Structure

```
src/
├── components/
│   ├── onboarding/
│   │   ├── OnboardingLayout.jsx       # Wrapper with progress indicator
│   │   ├── WelcomeScreen.jsx          # First screen
│   │   ├── FinancialGoalsScreen.jsx   # Goals selection
│   │   ├── LiteracyAssessmentScreen.jsx # Self-assessment
│   │   ├── TraitPreferenceScreen.jsx  # Trait selection
│   │   ├── DashboardPreviewScreen.jsx # Preview of app
│   │   ├── ConnectBankingScreen.jsx   # TrueLayer connection prompt
│   │   └── ProgressIndicator.jsx      # Rocket ship progress visualization
│   └── ui/
│       ├── Carousel.jsx               # For goal selection
│       ├── Slider.jsx                 # For self-assessment
│       └── TraitCard.jsx              # For trait selection
├── pages/
│   ├── onboarding/
│   │   ├── index.js                   # Entry point (Welcome)
│   │   ├── goals.js                   # Financial goals
│   │   ├── assessment.js              # Literacy assessment
│   │   ├── traits.js                  # Trait preference
│   │   ├── preview.js                 # Dashboard preview
│   │   └── connect.js                 # Banking connection
│   └── dashboard.js                   # Main app after onboarding
└── context/
    └── OnboardingContext.jsx          # State management for onboarding
```

## Component Implementation Plan

### 1. OnboardingLayout Component

This will be a wrapper component that includes:
- The rocket ship progress indicator
- Consistent styling across all onboarding screens
- Navigation controls

### 2. ProgressIndicator Component

An animated rocket ship that shows progress through the onboarding flow:
- Visual representation of 6 stages
- Current stage highlighted
- Previous stages marked as complete
- Future stages shown as upcoming

### 3. Screen Components

Each screen will follow a similar structure:
- Clear headline
- Concise instructions
- Interactive elements specific to that step
- Navigation buttons (back/continue)
- Consistent animations for transitions

### 4. State Management

The OnboardingContext will manage:
- User selections throughout the flow
- Progress tracking
- Data to be saved to the user profile
- Navigation between screens

## Implementation Notes

1. **Responsive Design**
   - All components should be mobile-first
   - Use Hover.dev components with appropriate responsive adjustments

2. **Animations**
   - Use subtle animations for transitions between screens
   - Animate selection interactions for immediate feedback
   - Keep animations consistent with Hover.dev library style

3. **Accessibility**
   - Ensure all interactive elements have proper ARIA attributes
   - Maintain keyboard navigation support
   - Test with screen readers

4. **Data Handling**
   - Store onboarding progress in localStorage to handle page refreshes
   - Submit collected data to backend only at final step
   - Implement form validation where appropriate
```

## Next Steps

1. Create the base OnboardingLayout and ProgressIndicator components
2. Implement the WelcomeScreen as the entry point
3. Build each subsequent screen following the flow
4. Set up the OnboardingContext for state management
5. Connect the flow to your authentication and user profile systems 