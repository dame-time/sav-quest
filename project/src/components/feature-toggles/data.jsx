import React from "react";
import { AiFillBug } from "react-icons/ai";
import { BsFillCursorFill } from "react-icons/bs";
import {
  FiAlignLeft,
  FiAnchor,
  FiArrowRight, FiBarChart,
  FiCheck,
  FiChevronDown,
  FiChevronRight,
  FiClock, FiCreditCard,
  FiEdit,
  FiEye,
  FiItalic, FiMapPin, FiTrendingUp,
} from "react-icons/fi";

const SubscriptionFeature = () => {
  return (
    <div className="p-6 text-white">
      <div className="flex items-center gap-4">
        <FiCreditCard className="text-primary text-5xl" />
        <h3 className="text-2xl font-bold">Track & Cancel Subscriptions</h3>
      </div>
      <p className="mt-4 text-lg text-copy-light">
        Most people waste hundreds every year on forgotten services.
        We scan your account for recurring charges and let you cancel
        what you don’t need with few taps.
      </p>
      <button className="mt-6 rounded bg-primary px-6 py-3 text-xl text-white transition-colors hover:bg-primary-dark">
        Scan Your Expenses Now
      </button>
    </div>
  );
}

const GeoSavingsFeature = () => {
  return (
    <div className="p-6 text-white">
      <div className="flex items-center gap-4">
        <FiMapPin className="text-secondary-light text-5xl" />
        <h3 className="text-2xl font-bold">Geo-Based Savings</h3>
      </div>
      <p className="mt-4 text-lg text-copy-light">
        Life costs differ by location, so should your budget. Our AI
        compares local trends and uncovers ways to cut expenses specific
        to where you live.
      </p>
      <button className="mt-6 rounded bg-secondary-light px-6 py-3 text-xl text-white transition-colors hover:bg-blue-600">
        Get Location-Based Tips
      </button>
    </div>
  );
};

const FinanceScoreFeature = () => {
  return (
    <div className="p-5 text-white">
      <div className="flex items-center gap-4">
        <FiTrendingUp className="text-green-400 text-5xl" />
        <h3 className="text-2xl font-bold">Your Financial Score</h3>
      </div>
      <p className="mt-4 text-lg text-copy">
        We reward good money habits with a
        <span className="font-semibold text-green-400"> Financial Score</span>.
        Track:
        <ul className="list-disc pl-6 text-copy-light">
          <li>Smart spending changes</li>
          <li>Boosted savings contributions</li>
          <li>Wise investment moves</li>
        </ul>
        Raise your score and unlock new financial goals.
      </p>
      <button className="mt-4 rounded bg-green-500 px-6 py-3 text-xl text-white transition hover:bg-green-600">
        Check Your Score Now
      </button>
    </div>
  );
};

const AIInvestmentFeature = () => {
  return (
    <div className="p-5 text-white bg-primary-light">
      <div className="flex items-center gap-4">
        <FiBarChart className="text-yellow-400 text-5xl" />
        <h3 className="text-2xl font-bold">AI Investment Insights</h3>
      </div>
      <p className="mt-4 text-lg text-copy">
        Saving is step one, grow is step two. Our AI engine:
        <ul className="mt-2 list-disc pl-6 text-copy-light">
          <li>Identifies high-yield funds & ETFs</li>
          <li>Suggests stable, long-term strategies</li>
          <li>Visualizes future wealth timelines</li>
        </ul>
        Let your money work for you.
      </p>
      <button className="mt-4 rounded bg-yellow-500 px-6 py-3 text-xl text-white transition hover:bg-yellow-600">
        See Your Future Wealth
      </button>
    </div>
  );
};

export const data = [
  {
    id: 1,
    title: "Track Subscriptions",
    Component: SubscriptionFeature,
    cardTitle: "Detect & Cancel Recurring Charges",
    cardSubtitle:
      "Stop paying for services you don't use. Quickly find and eliminate hidden fees or forgotten subscriptions.",
    icon: <FiCreditCard className="text-primary text-3xl" />,
  },
  {
    id: 2,
    title: "Geo-Based Savings",
    Component: GeoSavingsFeature,
    cardTitle: "Optimize Costs for Your City",
    cardSubtitle:
      "Your budget shouldn’t be one-size-fits-all. Our AI compares local living costs to reveal smarter savings.",
    icon: <FiMapPin className="text-blue-400 text-3xl" />,
  },
  {
    id: 3,
    title: "Financial Score",
    Component: FinanceScoreFeature,
    cardTitle: "Improve Money Habits & Earn Rewards",
    cardSubtitle:
      "Get a personalized score for every smart move, track spending changes, build savings, and stay motivated.",
    icon: <FiTrendingUp className="text-green-400 text-3xl" />,
  },
  {
    id: 4,
    title: "AI Investment Insights",
    Component: AIInvestmentFeature,
    cardTitle: "Turn Savings Into Future Growth",
    cardSubtitle:
      "Use our AI to find high-potential investments, plan for the long term, and watch your money work for you.",
    icon: <FiBarChart className="text-yellow-400 text-3xl" />,
  },
];
