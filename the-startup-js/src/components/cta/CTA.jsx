import React from "react";
import { MaxWidthWrapper } from "../utils/MaxWidthWrapper";
import { SplashButton } from "../buttons/SplashButton";
import { FiArrowRight } from "react-icons/fi";
import { GhostButton } from "../buttons/GhostButton";
import { motion } from "framer-motion";
import { GlowingChip } from "../utils/GlowingChip";
import { useRouter } from "next/router";

export const CTA = () => {
  const router = useRouter();
  return (
    <section className="relative overflow-hidden border-t border-zinc-700 bg-gradient-to-b from-zinc-900/30 to-zinc-950 py-20">
      <MaxWidthWrapper className="relative z-20 flex flex-col items-center justify-center">
        <motion.div
          initial={{
            y: 25,
            opacity: 0,
          }}
          animate={{
            y: 0,
            opacity: 1,
          }}
          transition={{
            duration: 1.25,
            ease: "easeInOut",
          }}
          className="relative mb-3"
        >
          <GlowingChip>Exciting announcement 🎉</GlowingChip>
        </motion.div>
        <motion.h1
          initial={{
            y: 25,
            opacity: 0,
          }}
          animate={{
            y: 0,
            opacity: 1,
          }}
          transition={{
            duration: 1.25,
            delay: 0.25,
            ease: "easeInOut",
          }}
          className="mb-9 max-w-xl text-center text-3xl font-bold leading-tight text-zinc-50 sm:text-4xl sm:leading-tight md:text-5xl md:leading-tight"
        >
          A landing page template that works for you
        </motion.h1>
        <motion.div
          initial={{
            y: 25,
            opacity: 0,
          }}
          animate={{
            y: 0,
            opacity: 1,
          }}
          transition={{
            duration: 1.25,
            delay: 0.75,
            ease: "easeInOut",
          }}
          className="flex flex-col items-center gap-4 sm:flex-row"
        >
          <SplashButton
            onClick={() => router.push("/signin")}
            className="flex items-center gap-2"
          >
            Try it free
            <FiArrowRight />
          </SplashButton>
          <GhostButton
            onClick={() => router.push("/#features")}
            className="rounded-md px-4 py-2 text-lg text-zinc-100"
          >
            Learn more
          </GhostButton>
        </motion.div>
      </MaxWidthWrapper>
      <div className="absolute inset-0 z-0 bg-grid-zinc-700/50" />
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/0 to-zinc-950" />
    </section>
  );
};
