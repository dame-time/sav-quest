import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import ParallaxSlide from "@/components/feature-toggles/ParallaxSlide";

/**
 * -- HOW THIS WORKS --
 * 1. A single parent <ParallaxFeaturesSection> wraps all slides.
 * 2. We use one useScroll({ container: containerRef }) to track scroll progress.
 * 3. Each slide uses a portion of scrollYProgress to animate its image & overlay.
 * 4. This approach reduces overhead and prevents multiple sticky layouts.
 */

export const ParallaxFeaturesSection = () => {
  // We'll reference a container that handles scrolling for all slides
  const containerRef = useRef(null);

  // Single scroll observer for the entire container
  const { scrollYProgress } = useScroll({
    container: containerRef,
  });

  // Your slides data: image, subheading, heading, and any child content
  const slides = [
    {
      imgUrl: "Show01Alt.webp",
      subheading: "Stop Paying for What You Don’t Use",
      heading: "Find & Eliminate Unwanted Subscriptions",
      title: "Instantly Detect Hidden Fees & Subscriptions",
      text: "Unlike basic budgeting apps, we automatically find recurring charges, hidden fees, and overpriced services, so you can cut waste and save effortlessly.",
      cta: "Scan Your Expenses Now",
    },
    {
      imgUrl: "Show02.webp",
      subheading: "Save More Based on Where You Live",
      heading: "Personalized Cost-Cutting for Your City",
      title: "Geo-Based Money Advice",
      text: "Your cost of living isn’t the same everywhere, so why should your budget be? We provide region-specific insights to help you find better deals, lower bills, and optimize your spending based on where you live.",
      cta: "Get Smart Cost Insights",
    },
    {
      imgUrl: "Show03.webp",
      subheading: "Make Money Management Fun & Engaging",
      heading: "Track Your Financial Progress",
      title: "Your Money Score & Progress Tracking",
      text: "Unlike traditional finance apps, we turn smart money moves into progress. Your personalized Financial Score tracks your habits, rewarding good decisions and helping you stay on top of your goals.",
      cta: "Check Your Score Now",
    },
    {
      imgUrl: "Show04.webp",
      subheading: "Turn Savings Into Wealth",
      heading: "Plan Your Future with AI Insights",
      title: "See How Your Savings Can Grow",
      text: "Saving money is great, but what’s next? We don’t just track spending; we help you project long-term financial growth, showing you how today’s smart choices turn into real wealth over time.",
      cta: "See Your Future Wealth",
    },
  ];

  return (
    <div
      ref={containerRef}
      className="bg-foreground h-screen overflow-y-scroll snap-y snap-mandatory"
      /**
       * h-screen + overflow-y-scroll let this container handle all scrolling.
       * snap-y snap-mandatory is optional if you want a "snap" effect per slide.
       */
    >
      {slides.map((slide, index) => (
        <ParallaxSlide
          key={index}
          index={index}
          totalSlides={slides.length}
          scrollYProgress={scrollYProgress}
          {...slide}
        />
      ))}
    </div>
  );
};