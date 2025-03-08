import React from "react";
import { twMerge } from "tailwind-merge";

export const MaxWidthWrapper = ({ children, className = "" }) => {
  return (
    <div className={twMerge("mx-auto max-w-7xl px-4 md:px-8", className)}>
      {children}
    </div>
  );
};
