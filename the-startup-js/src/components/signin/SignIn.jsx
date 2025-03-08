import React from "react";
import { CornerGrid } from "../utils/CornerGrid";
import { NavLogo } from "../navbar/NavLogo";
import Link from "next/link";
import { BubbleButton } from "../buttons/BubbleButton";
import { SiGithub, SiX } from "react-icons/si";
import { SplashButton } from "../buttons/SplashButton";
import { FiArrowLeft } from "react-icons/fi";
import { useRouter } from "next/router";
import { motion } from "framer-motion";

export const SignIn = () => {
  const router = useRouter();

  return (
    <div className="fixed inset-0 z-50 overflow-y-scroll bg-zinc-950 py-20">
      <BubbleButton
        onClick={() => {
          router.push("/");
        }}
        className="absolute left-4 top-6 text-sm"
      >
        <FiArrowLeft />
        Go back
      </BubbleButton>

      <motion.div
        initial={{
          opacity: 0,
          y: 25,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 1.25,
          ease: "easeInOut",
        }}
        className="relative z-10 mx-auto w-full max-w-xl p-4"
      >
        <Heading />

        <SocialOptions />
        <Or />
        <Email />
        <Terms />
      </motion.div>

      <CornerGrid />
    </div>
  );
};

const Heading = () => (
  <div>
    <NavLogo />
    <div className="mb-9 mt-6 space-y-1.5">
      <h1 className="text-2xl font-semibold">Sign in to your account</h1>
      <p className="text-zinc-400">
        Don't have an account?{" "}
        <Link href="#" className="text-blue-400">
          Create one.
        </Link>
      </p>
    </div>
  </div>
);

const SocialOptions = () => (
  <div>
    <div className="mb-3 flex gap-3">
      <BubbleButton className="flex w-full justify-center py-3">
        <SiX />
      </BubbleButton>
      <BubbleButton className="flex w-full justify-center py-3">
        <SiGithub />
      </BubbleButton>
    </div>
    <BubbleButton className="flex w-full justify-center py-3">
      Sign in with SSO
    </BubbleButton>
  </div>
);

const Or = () => {
  return (
    <div className="my-6 flex items-center gap-3">
      <div className="h-[1px] w-full bg-zinc-700" />
      <span className="text-zinc-400">OR</span>
      <div className="h-[1px] w-full bg-zinc-700" />
    </div>
  );
};

const Email = () => {
  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <div className="mb-3">
        <label htmlFor="email-input" className="mb-1.5 block text-zinc-400">
          Email
        </label>
        <input
          id="email-input"
          type="email"
          placeholder="your.email@provider.com"
          className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 placeholder-zinc-500 ring-1 ring-transparent transition-shadow focus:outline-0 focus:ring-blue-700"
        />
      </div>
      <div className="mb-6">
        <div className="mb-1.5 flex items-end justify-between">
          <label htmlFor="password-input" className="block text-zinc-400">
            Password
          </label>
          <Link href="#" className="text-sm text-blue-400">
            Forgot?
          </Link>
        </div>
        <input
          id="password-input"
          type="password"
          placeholder="••••••••••••"
          className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 placeholder-zinc-500 ring-1 ring-transparent transition-shadow focus:outline-0 focus:ring-blue-700"
        />
      </div>
      <SplashButton type="submit" className="w-full">
        Sign in
      </SplashButton>
    </form>
  );
};

const Terms = () => (
  <p className="mt-9 text-xs text-zinc-400">
    By signing in, you agree to our{" "}
    <Link href="#" className="text-blue-400">
      Terms & Conditions
    </Link>{" "}
    and{" "}
    <Link href="#" className="text-blue-400">
      Privacy Policy.
    </Link>
  </p>
);
