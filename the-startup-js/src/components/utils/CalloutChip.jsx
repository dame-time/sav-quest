import React from "react";

export const CalloutChip = ({ children }) => {
  return (
    <span className="mb-4 inline-block w-fit rounded-full border border-zinc-500 bg-zinc-800 px-2 py-0.5 text-xs font-medium uppercase">
      {children}
    </span>
  );
};
