import React, { useEffect, useRef } from "react";
import { animate, useInView } from "framer-motion";
import { CornerBlur } from "@/components/utils/CornerBlur";

export const Stats = () => {
  return (
    <div className="relative overflow-hidden border-y border-zinc-700 bg-zinc-900/30">
      <div className="relative z-20 mx-auto max-w-3xl px-4 py-12">
        <h2 className="mx-auto mb-9 block w-fit bg-gradient-to-br from-zinc-200 to-zinc-500 bg-clip-text text-center text-lg text-transparent">
          Have hard stats? Numbers don't lie!
        </h2>

        <div className="flex flex-col items-center justify-center sm:flex-row">
          <Stat
            num={45}
            suffix="%"
            subheading="Lorem ipsum dolor sit amet consectetur"
          />
          <div className="h-[1px] w-12 bg-zinc-600 sm:h-12 sm:w-[1px]" />
          <Stat
            num={15.5}
            decimals={1}
            suffix="K+"
            subheading="Lorem ipsum dolor sit amet consectetur"
          />
          <div className="h-[1px] w-12 bg-zinc-600 sm:h-12 sm:w-[1px]" />
          <Stat
            num={20}
            suffix="B+"
            subheading="Lorem ipsum dolor sit amet consectetur"
          />
        </div>
      </div>

      <CornerBlur />
    </div>
  );
};

const Stat = ({ num, suffix, decimals = 0, subheading }) => {
  const ref = useRef(null);
  const isInView = useInView(ref);

  useEffect(() => {
    if (!isInView) return;

    animate(0, num, {
      duration: 2.5,
      onUpdate(value) {
        if (!ref.current) return;

        ref.current.textContent = value.toFixed(decimals);
      },
    });
  }, [num, decimals, isInView]);

  return (
    <div className="flex w-72 flex-col items-center py-8 sm:py-0">
      <p className="mb-2 text-center text-7xl font-semibold text-zinc-50 sm:text-6xl">
        <span ref={ref}></span>
        <span className="text-blue-500">{suffix}</span>
      </p>
      <p className="max-w-48 text-center text-zinc-500">{subheading}</p>
    </div>
  );
};
