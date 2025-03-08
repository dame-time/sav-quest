import React from "react";
import {
  FiCalendar,
  FiCheck,
  FiCloud,
  FiDollarSign,
  FiMoon,
  FiWatch,
} from "react-icons/fi";

export const SimpleGrid = () => (
  <div className="relative z-10 grid grid-cols-2 gap-9 px-3 md:grid-cols-3 md:gap-12 md:px-6">
    <Item
      Icon={FiCalendar}
      title="Clear your calendar"
      subtitle="Lorem ipsum dolor sit, amet consectetur adipisicing elit. Illo, dolorem."
    />
    <Item
      Icon={FiWatch}
      title="Save tens of hours"
      subtitle="Lorem ipsum dolor sit, amet consectetur adipisicing elit. Illo, dolorem."
    />
    <Item
      Icon={FiMoon}
      title="Rest easy"
      subtitle="Lorem ipsum dolor sit, amet consectetur adipisicing elit. Illo, dolorem."
    />
    <Item
      Icon={FiDollarSign}
      title="Save thousands"
      subtitle="Lorem ipsum dolor sit, amet consectetur adipisicing elit. Illo, dolorem."
    />
    <Item
      Icon={FiCloud}
      title="Simple hosting"
      subtitle="Lorem ipsum dolor sit, amet consectetur adipisicing elit. Illo, dolorem."
    />
    <Item
      Icon={FiCheck}
      title="Everything you need"
      subtitle="Lorem ipsum dolor sit, amet consectetur adipisicing elit. Illo, dolorem."
    />
  </div>
);

const Item = ({ Icon, title, subtitle }) => {
  return (
    <div>
      <h4 className="mb-1.5 flex items-start text-lg font-medium md:text-xl">
        <Icon className="mr-1.5 h-[26px] text-blue-300" />
        {title}
      </h4>
      <p className="text-sm text-zinc-400 md:text-base">{subtitle}</p>
    </div>
  );
};
