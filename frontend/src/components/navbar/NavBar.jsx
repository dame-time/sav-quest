import React, { useState, useEffect, useRef } from "react";
import { MaxWidthWrapper } from "../utils/MaxWidthWrapper";
import { NavLogo } from "./NavLogo";
import { NavLinks } from "./NavLinks";
import { NavCTAs } from "./NavCTAs";
import { useMotionValueEvent, useScroll, motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/router";
import { FiChevronDown, FiLogOut, FiUser, FiHome, FiAward, FiBook, FiMessageSquare, FiFileText, FiTarget, FiDollarSign, FiTrendingUp, FiGift } from "react-icons/fi";

export const NavBar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const dropdownRef = useRef(null);

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

  useEffect(() => {
    const userData = localStorage.getItem("savquest_user");
    if (userData) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userData));
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }
  }, [router.pathname]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("savquest_user");
    setIsLoggedIn(false);
    setUser(null);
    router.push("/");
  };

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
      className={`fixed left-0 right-0 top-0 z-50 ${scrolled ? "bg-zinc-950/70" : "bg-zinc-950/60"} backdrop-blur-md py-3 transition-colors`}
    >
      <MaxWidthWrapper>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-12">
            <Link href="/" className="text-2xl font-bold text-blue-500">
              SavQuest
            </Link>
            {/* Only show marketing links when not logged in and not on auth/onboarding pages */}
            {!isLoggedIn && !isOnboarding && !isAuthPage && (
              <div className="hidden md:flex space-x-6">
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
            )}
          </div>

          {/* Auth buttons or user menu */}
          {!isOnboarding && !isAuthPage && (
            <div className="flex items-center">
              {isLoggedIn ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 px-3 py-2 rounded-md transition-colors"
                  >
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                      {user?.username?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <span className="hidden sm:inline">{user?.username || "User"}</span>
                    <FiChevronDown className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-zinc-800 border border-zinc-700 rounded-md shadow-lg py-1 z-50">
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-zinc-200 hover:bg-zinc-700"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <FiHome />
                        Dashboard
                      </Link>
                      <Link
                        href="/profile"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-zinc-200 hover:bg-zinc-700"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <FiUser />
                        Profile
                      </Link>
                      <Link
                        href="/leaderboards"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-zinc-200 hover:bg-zinc-700"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <FiAward />
                        Leaderboards
                      </Link>
                      <Link
                        href="/rewards"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-zinc-200 hover:bg-zinc-700"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <FiGift />
                        Rewards
                      </Link>
                      <Link
                        href="/learn"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-zinc-200 hover:bg-zinc-700"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <FiBook />
                        Learning Journey
                      </Link>
                      <Link
                        href="/coach"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-zinc-200 hover:bg-zinc-700"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <FiMessageSquare />
                        Financial Coach
                      </Link>
                      <Link
                        href="/statement-analysis"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-zinc-200 hover:bg-zinc-700"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <FiFileText />
                        Statement Analysis
                      </Link>
                      <Link
                        href="/monthly-prediction"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-zinc-200 hover:bg-zinc-700"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <FiTrendingUp />
                        Monthly Prediction
                      </Link>
                      <Link
                        href="/save-more"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-zinc-200 hover:bg-zinc-700"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <FiDollarSign />
                        Save More
                      </Link>
                      <Link
                        href="/savings-planner"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-zinc-200 hover:bg-zinc-700"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <FiTarget />
                        Savings Planner
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-zinc-200 hover:bg-zinc-700 w-full text-left"
                      >
                        <FiLogOut />
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
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
          )}
        </div>

        {/* Mobile navigation - only show for non-logged in users */}
        {!isLoggedIn && !isOnboarding && !isAuthPage && (
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
