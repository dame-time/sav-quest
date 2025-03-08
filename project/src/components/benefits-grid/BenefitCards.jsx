import { motion } from "framer-motion";
import React, { useState } from "react";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { SectionSubheading } from "@/components/shared/SectionSubheading";
import {
  FiTrendingDown,
  FiBarChart2,
  FiShield,
  FiClock,
  FiMapPin,
  FiThumbsUp,
} from "react-icons/fi";

// Mapping from position keys to style values for the deck (desktop) layout.
const positionStyles = {
  front: { x: 0, rotate: 0, zIndex: 6 },
  next: { x: 40, rotate: 8, zIndex: 5 },
  third: { x: 80, rotate: 16, zIndex: 4 },
  fourth: { x: 120, rotate: 24, zIndex: 3 },
  fifth: { x: 160, rotate: 32, zIndex: 2 },
  sixth: { x: 200, rotate: 40, zIndex: 1 },
};

// The order of positions.
const positionKeys = ["front", "next", "third", "fourth", "fifth", "sixth"];

// Benefit cards data. Keep descriptions short and focused on your product's unique edge.
const cardsData = [
  {
    icon: <FiTrendingDown className="text-4xl text-blue-400" />,
    title: "Fix Bad Habits",
    description: "Spot hidden charges & cut wasteful spending fast.",
  },
  {
    icon: <FiMapPin className="text-4xl text-green-400" />,
    title: "Geo-Based Savings",
    description: "Optimize costs using local deals & city benchmarks.",
  },
  {
    icon: <FiThumbsUp className="text-4xl text-yellow-400" />,
    title: "Invest in Yourself",
    description: "Redirect wasted money into self-improvement & growth.",
  },
  {
    icon: <FiBarChart2 className="text-4xl text-purple-400" />,
    title: "Score Your Finances",
    description: "A gamified system that rewards better money habits.",
  },
  {
    icon: <FiShield className="text-4xl text-red-400" />,
    title: "No Data Stored",
    description: "We never save or share your personal information.",
  },
  {
    icon: <FiClock className="text-4xl text-indigo-400" />,
    title: "Instant Insights",
    description: "Connect your bank via the EU approved Open Banking system, or upload your account statements & see your finances in less than 10 minutes.",
  },
];

const BenefitCards = () => {
  const initialOrder = [0, 1, 2, 3, 4, 5];
  const [cardOrder, setCardOrder] = useState(initialOrder);

  const handleShuffle = () => {
    setCardOrder((prevOrder) => [...prevOrder.slice(1), prevOrder[0]]);
  };

  return (
    <motion.section
      transition={{ staggerChildren: 0.1 }}
      initial="initial"
      whileInView="whileInView"
      className="relative mx-auto max-w-6xl px-2 md:px-4"
    >
      <div className="mb-8">
        <SectionHeading>Build Better Money Habits</SectionHeading>
        <SectionSubheading>
          Discover how our unique blend of AI insights, geo-based tips,
          and gamification can transform your finances.
        </SectionSubheading>
      </div>

      {/* Desktop version: Overlapping deck */}
      <div className="hidden md:grid place-content-center overflow-hidden bg-foreground px-8 py-24 text-slate-50">
        <div className="relative -ml-[100px] h-[450px] w-[350px] md:-ml-[175px]">
          {cardsData.map((card, dataIndex) => {
            const orderIndex = cardOrder.indexOf(dataIndex);
            const position = positionKeys[orderIndex];
            return (
              <Card
                key={dataIndex}
                icon={card.icon}
                title={card.title}
                description={card.description}
                handleShuffle={orderIndex === 0 ? handleShuffle : undefined}
                position={position}
                layout="deck"
              />
            );
          })}
        </div>
      </div>

      {/* Mobile version: Vertically stacked cards */}
      <div className="block md:hidden bg-foreground px-8 py-24 text-slate-50">
        <div className="flex flex-col gap-4">
          {cardsData.map((card, index) => (
            <Card
              key={index}
              icon={card.icon}
              title={card.title}
              description={card.description}
              layout="vertical"
            />
          ))}
        </div>
      </div>
    </motion.section>
  );
};

const Card = ({ handleShuffle, title, description, icon, position, layout }) => {
  if (layout === "deck") {
    const { x, rotate, zIndex } = positionStyles[position] || {
      x: 0,
      rotate: 0,
      zIndex: 0,
    };
    const draggable = position === "front";

    const onDragEnd = (e, info) => {
      if (info.offset.x < -150 && handleShuffle) {
        handleShuffle();
      }
    };

    return (
      <motion.div
        style={{ zIndex }}
        animate={{ x, rotate }}
        drag={draggable}
        dragElastic={0.35}
        dragListener={draggable}
        dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
        onDragEnd={draggable ? onDragEnd : undefined}
        transition={{ duration: 0.35 }}
        className={`absolute left-0 top-0 grid h-[450px] w-[350px] select-none place-content-center space-y-6 rounded-2xl border-2 border-slate-700 bg-slate-800/20 p-6 shadow-xl backdrop-blur-md ${
          draggable ? "cursor-grab active:cursor-grabbing" : ""
        }`}
      >
        <div className="flex justify-center">{icon}</div>
        <h3 className="text-center text-xl font-semibold text-slate-100">
          {title}
        </h3>
        <p className="text-center text-base text-slate-400">{description}</p>
      </motion.div>
    );
  } else if (layout === "vertical") {
    return (
      <div className="w-full grid select-none place-content-center space-y-6 rounded-2xl border-2 border-slate-700 bg-slate-800/20 p-6 shadow-xl backdrop-blur-md">
        <div className="flex justify-center">{icon}</div>
        <h3 className="text-center text-xl font-semibold text-slate-100">
          {title}
        </h3>
        <p className="text-center text-base text-slate-400">{description}</p>
      </div>
    );
  }
};

export default BenefitCards;