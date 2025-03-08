import { NavBar } from "@/components/navbar/NavBar";
import { OnboardingProvider } from "../context/OnboardingContext";
import { PageTransition } from "@/components/loading/PageTransition";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import "@/styles/globals.css";

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Handle route change start
  useEffect(() => {
    const handleStart = () => {
      setIsLoading(true);
    };

    // Handle route change complete
    const handleComplete = () => {
      setTimeout(() => {
        setIsLoading(false);
      }, 800); // Delay to show loading animation
    };

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, [router]);

  return (
    <OnboardingProvider>
      <NavBar />
      <AnimatePresence mode="wait">
        <PageTransition isLoading={isLoading} key={router.pathname}>
          <Component {...pageProps} />
        </PageTransition>
      </AnimatePresence>
    </OnboardingProvider>
  );
}
