import { Card } from "@/components/utils/Card";
import { CornerBlur } from "@/components/utils/CornerBlur";
import { SectionHeading } from "@/components/utils/SectionHeading";
import { SectionSubheading } from "@/components/utils/SectionSubheading";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  FiArrowLeft,
  FiArrowRight,
  FiArrowUp,
  FiBox,
  FiPhone,
  FiShield,
  FiUsers,
} from "react-icons/fi";
import useMeasure from "react-use-measure";

const CARD_WIDTH = 350;
const MARGIN = 20;
const CARD_SIZE = CARD_WIDTH + MARGIN;

const BREAKPOINTS = {
  sm: 640,
  lg: 1024,
};

const Carousel = () => {
  const [ref, { width }] = useMeasure();
  const [offset, setOffset] = useState(0);

  const CARD_BUFFER =
    width > BREAKPOINTS.lg ? 3 : width > BREAKPOINTS.sm ? 2 : 1;

  const CAN_SHIFT_LEFT = offset < 0;

  const CAN_SHIFT_RIGHT =
    Math.abs(offset) < CARD_SIZE * (features.length - CARD_BUFFER);

  const shiftLeft = () => {
    if (!CAN_SHIFT_LEFT) {
      return;
    }
    setOffset((pv) => (pv += CARD_SIZE));
  };

  const shiftRight = () => {
    if (!CAN_SHIFT_RIGHT) {
      return;
    }
    setOffset((pv) => (pv -= CARD_SIZE));
  };

  return (
    <section
      className="relative overflow-hidden border-b border-zinc-700 bg-zinc-900/30 py-12"
      ref={ref}
    >
      <div className="relative z-20 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="mb-12 flex flex-col items-center justify-between gap-6 md:flex-row md:items-end">
            <div className="space-y-3">
              <SectionHeading>Dive into the specifics</SectionHeading>
              <SectionSubheading>
                Anything else you want to show off? What are you proud of? What
                makes you different? Show it off here!
              </SectionSubheading>
            </div>
            <div className="flex items-center gap-2">
              <button
                className={`rounded-lg border-[1px] border-zinc-700 bg-zinc-900 p-1.5 text-2xl transition-opacity ${
                  CAN_SHIFT_LEFT ? "" : "opacity-30"
                }`}
                disabled={!CAN_SHIFT_LEFT}
                onClick={shiftLeft}
              >
                <FiArrowLeft />
              </button>
              <button
                className={`rounded-lg border-[1px] border-zinc-700 bg-zinc-900 p-1.5 text-2xl transition-opacity ${
                  CAN_SHIFT_RIGHT ? "" : "opacity-30"
                }`}
                disabled={!CAN_SHIFT_RIGHT}
                onClick={shiftRight}
              >
                <FiArrowRight />
              </button>
            </div>
          </div>
          <motion.div
            animate={{
              x: offset,
            }}
            transition={{
              ease: "easeInOut",
            }}
            className="grid"
            style={{
              gridTemplateColumns: `repeat(${features.length}, 1fr)`,
            }}
          >
            {features.map((post) => {
              return <Feature key={post.id} {...post} />;
            })}
          </motion.div>
        </div>
      </div>

      <CornerBlur />
    </section>
  );
};

const Feature = ({ title, description, Icon }) => {
  return (
    <Card
      className="shrink-0"
      style={{
        width: CARD_WIDTH,
        marginRight: MARGIN,
      }}
    >
      <Icon className="size-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-700 p-3 text-blue-50" />
      <p className="mb-1.5 mt-3 text-lg font-medium">{title}</p>
      <p className="text-sm text-zinc-400">{description}</p>
    </Card>
  );
};

export default Carousel;

const features = [
  {
    id: 1,
    Icon: FiArrowUp,
    title: "Fast & accurate reporting",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi, dolor.",
  },
  {
    id: 2,
    Icon: FiShield,
    title: "A+ Security",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi, dolor.",
  },
  {
    id: 3,
    Icon: FiUsers,
    title: "World class teams",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi, dolor.",
  },
  {
    id: 4,
    Icon: FiPhone,
    title: "Best in class support",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi, dolor.",
  },
  {
    id: 5,
    Icon: FiBox,
    title: "All-in-one product",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi, dolor.",
  },
];
