import React from "react";
import { cva } from "class-variance-authority";

const button = cva(["uppercase", "transition-colors"], {
  variants: {
    intent: {
      primary: ["bg-primary", "hover:bg-primary-dark", "text-copy"],
      secondary: ["bg-secondary", "hover:bg-secondary-dark", "text-copy"],
      outline: ["bg-white", "hover:bg-primary-light", "border", "border-border"],
    },
    size: {
      small: ["px-3", "py-1.5", "rounded-md", "text-sm"],
      medium: ["p-3", "rounded-lg", "text-base"],
    },
  },
  compoundVariants: [{ intent: "primary", size: "medium", class: "uppercase" }],
  defaultVariants: {
    intent: "primary",
    size: "medium",
  },
});

export const Button = ({ className, intent, size, ...props }) => (
  <button className={button({ intent, size, className })} {...props} />
);
