import React, { useEffect, useRef } from "react";
import { animate, useInView } from "framer-motion";
import { BubbleText } from "@/components/global/BubbleText";

export const Stats = () => {
  return (
    <section className="mx-auto max-w-8xl px-4">
      <div className="flex flex-col items-center justify-center gap-12 sm:flex-row sm:gap-0">
        <Stat num={5} suffix="x" subheading="More spent on self-growth" />
        <div className="h-[1px] w-12 bg-border sm:h-12 sm:w-[1px]" />
        <Stat num={3} suffix="x" subheading="More saved for investing" />
        <div className="h-[1px] w-12 bg-border sm:h-12 sm:w-[1px]" />
        <Stat num={10} suffix=" +" subheading="Poor Financial Habits Improved" />
      </div>
    </section>
  );
};

const Stat = ({ num, suffix, decimals = 0, subheading }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    animate(0, num, {
      duration: 1.5,
      onUpdate(value) {
        if (!ref.current) return;

        ref.current.textContent = value.toFixed(decimals);
      },
    });
  }, [num, decimals, isInView]);

  return (
    <div className="flex w-full flex-col items-center">
      <p className="mb-2 text-center text-5xl font-medium">
        <span ref={ref}></span>
        {suffix}
      </p>
      <BubbleText>{subheading}</BubbleText>
    </div>
  );
};