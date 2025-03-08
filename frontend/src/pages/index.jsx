import { CTA } from "@/components/cta/CTA";
import { Customers } from "@/components/customers/Customers";
import Carousel from "@/components/features/carousel/Carousel";
import { CodeDemo } from "@/components/features/code/CodeDemo";
import { FeatureGrid } from "@/components/features/grid/FeatureGrid";
import { Stats } from "@/components/features/stats/Stats";
import { Footer } from "@/components/footer/Footer";
import { Hero } from "@/components/hero/Hero";
import { Logos } from "@/components/logos/Logos";
import { Pricing } from "@/components/pricing/Pricing";
import { Barlow } from "next/font/google";
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useOnboarding } from '@/context/OnboardingContext';

const barlowFont = Barlow({
  subsets: ["latin"],
  style: ["italic", "normal"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export default function Home() {
  const { completed } = useOnboarding();
  const router = useRouter();

  useEffect(() => {
    // If onboarding is not completed, redirect to onboarding
    if (!completed) {
      router.push('/onboarding');
    }
  }, [completed, router]);

  return (
    <main className={barlowFont.className}>
      <Hero />
      <Logos />
      <FeatureGrid />
      <CodeDemo />
      <Carousel />
      <Customers />
      <Stats />
      <Pricing />
      <CTA />
      <Footer />
    </main>
  );
}
