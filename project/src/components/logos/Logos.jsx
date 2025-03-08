import React from "react";
import { motion } from "framer-motion";
import {
  FiCreditCard,
  FiEye,
  FiShield,
  FiBarChart2,
  FiScissors,
  FiTrendingDown,
  FiLock,
  FiClock,
  FiDollarSign,
  FiPieChart,
} from "react-icons/fi";
import { LiaBrainSolid } from "react-icons/lia";

export const Logos = () => {
  return (
    <section className="relative -mt-4 -rotate-1 scale-[1.01] border-y-2 border-border bg-background">
      <div className="relative z-0 flex overflow-hidden border-b-2 border-border">
        <TranslateWrapper>
          <FeatureItemsTop />
        </TranslateWrapper>
        <TranslateWrapper>
          <FeatureItemsTop />
        </TranslateWrapper>
        <TranslateWrapper>
          <FeatureItemsTop />
        </TranslateWrapper>
      </div>
      <div className="relative z-0 flex overflow-hidden">
        <TranslateWrapper reverse>
          <FeatureItemsBottom />
        </TranslateWrapper>
        <TranslateWrapper reverse>
          <FeatureItemsBottom />
        </TranslateWrapper>
        <TranslateWrapper reverse>
          <FeatureItemsBottom />
        </TranslateWrapper>
      </div>

      <div className="pointer-events-none absolute bottom-0 left-0 top-0 z-10 w-32 bg-gradient-to-r from-foreground to-foreground/0" />
      <div className="pointer-events-none absolute bottom-0 right-0 top-0 z-10 w-32 bg-gradient-to-l from-foreground to-foreground/0" />
    </section>
  );
};

const TranslateWrapper = ({ children, reverse }) => {
  return (
    <motion.div
      initial={{ translateX: reverse ? "-100%" : "0%" }}
      animate={{ translateX: reverse ? "0%" : "-100%" }}
      transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
      className="flex px-2"
    >
      {children}
    </motion.div>
  );
};

const FeatureItem = ({ Icon, title }) => {
  return (
    <span className="flex items-center justify-center gap-4 px-4 py-2 md:py-4">
      <Icon className="text-2xl text-primary md:text-3xl" />
      <span className="whitespace-nowrap text-lg font-medium uppercase md:text-xl">
        {title}
      </span>
    </span>
  );
};

/** TOP ROW ITEMS */
const FeatureItemsTop = () => (
  <>
    <FeatureItem Icon={FiCreditCard} title="Track Subs" />
    <FeatureItem Icon={FiScissors} title="Stop Overspending" />
    <FeatureItem Icon={FiTrendingDown} title="Slash Costs" />
    <FeatureItem Icon={FiDollarSign} title="Smart Savings" />
    <FeatureItem Icon={LiaBrainSolid} title="Analyze Spend" />
    <FeatureItem Icon={FiBarChart2} title="Cost Insights" />
  </>
);

/** BOTTOM ROW ITEMS */
const FeatureItemsBottom = () => (
  <>
    <FeatureItem Icon={FiClock} title="Boost Score" />
    <FeatureItem Icon={FiTrendingDown} title="Better Habits" />
    <FeatureItem Icon={FiShield} title="Secure Data" />
    <FeatureItem Icon={FiEye} title="AI Tips" />
    <FeatureItem Icon={FiDollarSign} title="Geo Advice" />
    <FeatureItem Icon={FiPieChart} title="See Progress" />
  </>
);
