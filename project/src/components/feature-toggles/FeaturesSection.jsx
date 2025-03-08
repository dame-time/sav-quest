import React from "react";
import { TextParallaxContent } from "@/components/feature-toggles/TextParallaxContent";
import { FiArrowUpRight } from "react-icons/fi";

export const FeaturesSection = () => {
  return (
    <div className="bg-foreground">
      {/* Feature 1: Subscription & Hidden Fees Detection */}
      <TextParallaxContent
        imgUrl="Show01Alt.webp"
        subheading="Stop Paying for What You Don’t Use"
        heading="Find & Eliminate Unwanted Subscriptions"
      >
        <FeatureContent
          title="Instantly Detect Hidden Fees & Subscriptions"
          text="Unlike basic budgeting apps, we automatically find recurring charges, hidden fees, and overpriced services—so you can cut waste and save effortlessly."
          cta="Scan Your Expenses Now"
        />
      </TextParallaxContent>

      {/* Feature 2: Location-Based Cost Optimization */}
      <TextParallaxContent
        imgUrl="Show02.webp"
        subheading="Save More Based on Where You Live"
        heading="Personalized Cost-Cutting for Your City"
      >
        <FeatureContent
          title="Geo-Based Money Advice"
          text="Your cost of living isn’t the same everywhere—so why should your budget be? We provide region-specific insights to help you find better deals, lower bills, and optimize your spending based on where you live."
          cta="Get Smart Cost Insights"
        />
      </TextParallaxContent>

      {/* Feature 3: Financial Score & Gamification */}
      <TextParallaxContent
        imgUrl="Show03.webp"
        subheading="Make Money Management Fun & Engaging"
        heading="Track Your Financial Progress"
      >
        <FeatureContent
          title="Your Money Score & Progress Tracking"
          text="Unlike traditional finance apps, we turn smart money moves into progress. Your personalized Financial Score tracks your habits, rewarding good decisions and helping you stay on top of your goals."
          cta="Check Your Score Now"
        />
      </TextParallaxContent>

      {/* Feature 4: AI-Driven Investment & Growth Insights */}
      <TextParallaxContent
        imgUrl="Show04.webp"
        subheading="Turn Savings Into Wealth"
        heading="Plan Your Future with AI Insights"
      >
        <FeatureContent
          title="See How Your Savings Can Grow"
          text="Saving money is great—but what’s next? We don’t just track spending; we help you project long-term financial growth, showing you how today’s smart choices turn into real wealth over time."
          cta="See Your Future Wealth"
        />
      </TextParallaxContent>
    </div>
  );
};

const FeatureContent = ({ title, text, cta }) => (
  <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 px-4 pb-24 pt-12 md:grid-cols-12">
    <h2 className="col-span-1 text-3xl font-bold md:col-span-4">{title}</h2>
    <div className="col-span-1 md:col-span-8">
      <p className="mb-4 text-xl text-copy-light md:text-2xl">{text}</p>
      <button className="w-full rounded bg-primary px-9 py-4 text-xl text-white transition-colors hover:bg-primary-dark md:w-fit">
        {cta} <FiArrowUpRight className="inline" />
      </button>
    </div>
  </div>
);
