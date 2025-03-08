import React from "react";
import { SectionHeading } from "../shared/SectionHeading";
import { LogoLarge } from "../navigation/Logo";
import { Button } from "../shared/Button";

export const FinalCTA = () => {
  return (
    <section className="-mt-8 bg-foreground px-2 py-24 md:px-4">
      <div className="mx-auto flex max-w-6axl flex-col items-center">
        <LogoLarge />
        <SectionHeading>Ready to Transform Your Finances?</SectionHeading>
        <p className="mx-auto mb-8 text-center text-base leading-relaxed text-copy-light md:text-xl md:leading-relaxed">
          Start building better money habits, cut wasteful spending, and put
          more into what truly matters, no credit card required.
        </p>
        <Button intent="primary">
          <span className="font-bold">Get Started</span> - Quick &amp; Easy
        </Button>
      </div>
    </section>
  );
};
