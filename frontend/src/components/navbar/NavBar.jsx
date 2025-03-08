import React, { useState } from "react";
import { MaxWidthWrapper } from "../utils/MaxWidthWrapper";
import { NavLogo } from "./NavLogo";
import { NavLinks } from "./NavLinks";
import { NavCTAs } from "./NavCTAs";
import { useMotionValueEvent, useScroll, motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/router";

export const NavBar = () => {
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  const router = useRouter();

  // Check if we're in the onboarding flow
  const isOnboarding = router.pathname.startsWith('/onboarding');
  // Check if we're on the signup or signin page
  const isAuthPage = router.pathname === '/signup' || router.pathname === '/signin';

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 150) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  });

  return (
    <motion.nav
      initial={{
        opacity: 0,
        y: "-100%",
      }}
      animate={{
        opacity: 1,
        y: "0%",
      }}
      transition={{
        duration: 1.25,
        ease: "easeInOut",
      }}
      className={`fixed left-0 right-0 top-0 z-50 bg-zinc-950/0 py-3 transition-colors ${scrolled && "bg-zinc-950/80 backdrop-blur"}`}
    >
      <MaxWidthWrapper>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-12">
            <Link href="/" className="text-2xl font-bold text-blue-500">
              SavQuest
            </Link>
            {!isOnboarding && !isAuthPage && (
              <div className="hidden md:block">
                <Link href="/#features" className="text-zinc-300 hover:text-white mr-6">
                  Features
                </Link>
                <Link href="/#testimonials" className="text-zinc-300 hover:text-white mr-6">
                  Testimonials
                </Link>
                <Link href="/#pricing" className="text-zinc-300 hover:text-white">
                  Pricing
                </Link>
              </div>
            )}
          </div>

          {/* Only show auth buttons on main pages, not during onboarding or on auth pages */}
          {!isOnboarding && !isAuthPage && (
            <div className="flex items-center space-x-4">
              <Link href="/signin" className="text-zinc-300 hover:text-white">
                Sign in
              </Link>
              <Link
                href="/signup"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>

        {/* Only show mobile nav on main pages */}
        {!isOnboarding && !isAuthPage && (
          <div className="block pt-1.5 md:hidden">
            <div className="flex space-x-4">
              <Link href="/#features" className="text-zinc-300 hover:text-white">
                Features
              </Link>
              <Link href="/#testimonials" className="text-zinc-300 hover:text-white">
                Testimonials
              </Link>
              <Link href="/#pricing" className="text-zinc-300 hover:text-white">
                Pricing
              </Link>
            </div>
          </div>
        )}
      </MaxWidthWrapper>
    </motion.nav>
  );
};
