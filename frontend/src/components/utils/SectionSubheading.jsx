import React from "react";

export const SectionSubheading = ({ children, persistCenter = false }) => {
  return (
    <p
      className={`text-center text-base text-zinc-400 md:text-lg ${persistCenter ? "" : "mx-auto max-w-md md:mx-0 md:text-start"}`}
    >
      {children}
    </p>
  );
};
