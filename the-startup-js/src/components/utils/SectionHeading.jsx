import React from "react";

export const SectionHeading = ({ children, persistCenter = false }) => {
  return (
    <h2
      className={`text-center text-3xl font-semibold leading-tight sm:text-4xl sm:leading-tight md:text-5xl md:leading-tight ${persistCenter ? "" : "md:text-start"}`}
    >
      {children}
    </h2>
  );
};
