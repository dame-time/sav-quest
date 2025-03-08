import { Stars } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import React, { useEffect } from "react";
import { FiArrowRight } from "react-icons/fi";
import {
  useMotionTemplate,
  useMotionValue,
  motion,
  animate,
} from "framer-motion";
import { LogoLarge } from "@/components/navigation/Logo";

const COLORS_TOP = ["#293bee", "#5866f2", "#ee297c", "#f25899"];

export const Hero = () => {
  const color = useMotionValue(COLORS_TOP[0]);

  useEffect(() => {
    animate(color, COLORS_TOP, {
      ease: "easeInOut",
      duration: 10,
      repeat: Infinity,
      repeatType: "mirror",
    });
  }, []);

  const backgroundImage = useMotionTemplate`radial-gradient(125% 125% at 50% 0%, #131420 50%, ${color})`;
  const border = useMotionTemplate`1px solid ${color}`;
  const boxShadow = useMotionTemplate`0px 4px 24px ${color}`;

  return (
    <motion.section
      style={{ backgroundImage }}
      className="relative grid min-h-screen place-content-center overflow-hidden bg-gray-950 px-4 py-24 text-gray-200"
    >
      {/* Logo at top left */}
      <div className="absolute top-12 left-12 z-20">
        <LogoLarge />
      </div>

      <div className="relative z-10 flex flex-col items-center">
        <h1 className="max-w-5xl bg-gradient-to-br from-copy to-copy-lighter bg-clip-text text-center text-3xl font-semibold leading-tight text-transparent sm:text-5xl sm:leading-tight md:text-7xl md:leading-tight">
          Transform Your Finances into a Game You Can Win
        </h1>
        <p className="my-6 max-w-2xl text-center text-base leading-relaxed text-copy md:text-lg md:leading-relaxed">
          Combine AI insights, local cost tips, and habit-building challenges to
          slash hidden fees, invest in yourself, and stay ahead of monthly bills.
          No guesswork, no spreadsheets, just a fun path to real financial growth.
        </p>
        <motion.button
          style={{ border, boxShadow }}
          whileHover={{ scale: 1.015 }}
          whileTap={{ scale: 0.985 }}
          className="group relative flex w-fit items-center gap-1.5 rounded bg-foreground/10 px-8 py-6 text-copy-light transition-colors hover:bg-foreground/50"
        >
          Start Your Quest
          <FiArrowRight className="transition-transform group-hover:-rotate-45 group-active:-rotate-12" />
        </motion.button>
      </div>

      {/* Starfield background */}
      <div className="absolute inset-0 z-0">
        <Canvas>
          <Stars radius={50} count={2500} factor={4} fade speed={2} />
        </Canvas>
      </div>
    </motion.section>
  );
};