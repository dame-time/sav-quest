import React, { useState } from "react";
import { SectionHeading } from "../shared/SectionHeading";
import { Button } from "../shared/Button";
import { CheckListItem } from "./CheckListItem";
import { Toggle } from "./Toggle";
import { AnimatePresence, motion } from "framer-motion";

// Pricing Section
export const Pricing = () => {
  const [selected, setSelected] = useState("annual");

  return (
    <section className="mx-auto max-w-7xl px-2 md:px-4">
      <SectionHeading>Choose Your Plan</SectionHeading>
      <Toggle selected={selected} setSelected={setSelected} />

      <div className="mt-6 grid grid-cols-1 gap-6 lg:mt-12 lg:grid-cols-3 lg:gap-8">
        <PriceColumn
          title="Essential"
          price="0"
          statement="Basic scanning with minimal updates. Always free."
          items={[
            // True items first
            { children: "Refresh Every 2 Weeks", checked: true },
            { children: "Detect Hidden Subscriptions", checked: true },
            { children: "Data History (3 Months)", checked: true },
            // False items last
            { children: "AI Cost-Saving Suggestions", checked: false },
            { children: "Geo-Based Spending Tips", checked: false },
            { children: "Gamified Financial Score", checked: false },
            { children: "Self-Improvement Nudges", checked: false },
            { children: "Monthly Reports", checked: false },
            { children: "Priority Support", checked: false },
          ]}
        />

        <PriceColumn
          title="Smart Insights"
          price={selected === "monthly" ? "6.99" : "69.99"}
          oldPrice={selected === "annual" ? "84" : null}
          statement="Daily refreshes plus advanced AI insights and habit-building features."
          highlight
          items={[
            // True items first
            { children: "Refresh Daily", checked: true },
            { children: "Detect Hidden Subscriptions", checked: true },
            { children: "Data History (6 Months)", checked: true },
            { children: "AI Cost-Saving Suggestions", checked: true },
            { children: "Geo-Based Spending Tips", checked: true },
            { children: "Gamified Financial Score", checked: true },
            { children: "Self-Improvement Nudges", checked: true },
            // False items last
            { children: "Monthly Reports", checked: false },
            { children: "Priority Support", checked: false },
          ]}
        />

        <PriceColumn
          title="Full Control"
          price={selected === "monthly" ? "12.99" : "129.99"}
          oldPrice={selected === "annual" ? "156" : null}
          statement="On-demand refreshes, comprehensive reports, and top-tier support."
          items={[
            // True items first
            { children: "Refresh On-Demand", checked: true },
            { children: "Detect Hidden Subscriptions", checked: true },
            { children: "Data History (1 Year)", checked: true },
            { children: "AI Cost-Saving Suggestions", checked: true },
            { children: "Geo-Based Spending Tips", checked: true },
            { children: "Gamified Financial Score", checked: true },
            { children: "Self-Improvement Nudges", checked: true },
            { children: "Monthly Reports", checked: true },
            { children: "Priority Support", checked: true },
          ]}
        />
      </div>
    </section>
  );
};

// Price Column
const PriceColumn = ({ highlight, title, price, oldPrice, statement, items }) => {
  return (
    <div
      style={{
        boxShadow: highlight ? "0px 6px 0px rgb(24, 24, 27)" : "",
      }}
      className={`relative w-full rounded-lg p-6 md:p-8 ${
        highlight ? "border-2 border-border bg-background" : ""
      }`}
    >
      {highlight && (
        <span className="absolute right-4 top-0 -translate-y-1/2 rounded-full bg-primary px-2 py-0.5 text-sm text-white">
          Most Popular
        </span>
      )}

      <p className="mb-6 text-xl font-medium">{title}</p>
      <div className="mb-6 flex items-center gap-3">
        <AnimatePresence mode="popLayout">
          {oldPrice && (
            <motion.span
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -24, opacity: 0 }}
              key={oldPrice}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="block text-3xl font-medium text-copy-lighter line-through"
            >
              ${oldPrice}
            </motion.span>
          )}
          <motion.span
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -24, opacity: 0 }}
            key={price}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="block text-6xl font-bold"
          >
            ${price}
          </motion.span>
        </AnimatePresence>
        <motion.div layout className="font-medium text-copy-lighter">
          <span className="block">/month</span>
        </motion.div>
      </div>

      <p className="mb-8 text-lg">{statement}</p>

      <div className="mb-8 space-y-2">
        {items.map((item) => (
          <CheckListItem key={item.children} checked={item.checked}>
            {item.children}
          </CheckListItem>
        ))}
      </div>

      <Button className="w-full" intent={highlight ? "primary" : "secondary"}>
        Get Started
      </Button>
    </div>
  );
};