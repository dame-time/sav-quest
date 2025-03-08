import React, { useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import { motion } from "framer-motion";
import useMeasure from "react-use-measure";

const FAQ = () => {
  return (
    <div className="px-4 py-12">
      <div className="mx-auto max-w-3xl">
        <h3 className="mb-4 text-center text-3xl font-semibold text-copy">
          How We Reinvent Personal Finance
        </h3>
        <p className="mb-8 text-center text-lg text-copy-light">
          We combine smart AI insights, city-based cost optimization, and
          fun gamification to help you eliminate bad spending habits, invest
          in self-improvement, and build a healthier financial life.
        </p>

        <Question title="Who benefits most from this?" defaultOpen>
          <p>
            Anyone wanting to strengthen their money habits or break bad
            spending patterns. Whether you’re overspending on subscriptions,
            looking for better local deals, or aiming to invest more in your
            personal growth, our platform guides you step by step.
          </p>
        </Question>

        <Question title="How does it actually save me money?">
          <p>
            Our system scans your transactions, flagging wasteful spending,
            unused subscriptions, and missed opportunities for self-improvement
            (like courses or workshops).
          </p>
          <p>
            It also factors in your city’s cost of living, so suggestions
            are truly personalized and help you cut unnecessary costs fast.
          </p>
        </Question>

        <Question title="What about privacy and bank details?">
          <p>
            We never store personal data. You can connect via Open Banking or
            simply upload a bank statement, our AI processes it on the spot
            without saving sensitive information. Your finances stay under your
            control, 100%.
          </p>
        </Question>

        <Question title="Does it take long to see results?">
          <p>
            Not at all. In under five minutes, you’ll get a detailed breakdown of
            your spending habits, local cost insights, and personalized tips.
          </p>
          <p>
            Many users spot 25% or more in potential savings during their very
            first scan.
          </p>
        </Question>

        <Question title="Why is this different from normal budgeting apps?">
          <p>
            We gamify the entire process, turning good financial decisions into
            progress points for your personal “Financial Score".
          </p>
          <p>
            We also compare your spending to local benchmarks, so you’ll know if
            you’re paying more than others for bills, groceries, or self-improvement.
          </p>
          <p>
            It’s not just about tracking expenses, it’s about <em>transforming </em>
            your money habits.
          </p>
        </Question>
      </div>
    </div>
  );
};

const Question = ({ title, children, defaultOpen = false }) => {
  const [ref, { height }] = useMeasure();
  const [open, setOpen] = useState(defaultOpen);

  return (
    <motion.div
      animate={open ? "open" : "closed"}
      className="border-b-[1px] border-border"
    >
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between gap-4 py-6"
      >
        <motion.span
          variants={{
            open: { color: "#5866f2" },
            closed: { color: "#fafafc" },
          }}
          className="bg-gradient-to-r from-primary-light to-primary bg-clip-text text-left text-lg font-medium"
        >
          {title}
        </motion.span>
        <motion.span
          variants={{
            open: { rotate: "180deg", color: "#5866f2" },
            closed: { rotate: "0deg", color: "#fafafc" },
          }}
        >
          <FiChevronDown className="text-2xl" />
        </motion.span>
      </button>
      <motion.div
        initial={false}
        animate={{
          height: open ? height : "0px",
          marginBottom: open ? "24px" : "0px",
        }}
        className="overflow-hidden text-copy-light"
      >
        <div ref={ref}>{children}</div>
      </motion.div>
    </motion.div>
  );
};

export default FAQ;