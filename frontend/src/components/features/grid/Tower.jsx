import { SiGithub } from "react-icons/si";
import { CalloutChip } from "../../utils/CalloutChip";
import { Card } from "../../utils/Card";
import { motion } from "framer-motion";
import {
  FiAward,
  FiBell,
  FiGrid,
  FiMail,
  FiSettings,
  FiUser,
} from "react-icons/fi";
import { useEffect, useState } from "react";
import { CornerBlur } from "@/components/utils/CornerBlur";
import { PulseLine } from "@/components/utils/PulseLine";

export const Tower = () => {
  return (
    <div className="col-span-1 h-[600px] lg:col-span-4 lg:h-[600px]">
      <Card>
        <PulseLine />

        <CalloutChip>Callout #1</CalloutChip>
        <p className="mb-2 text-2xl">Show your product</p>
        <p className="mb-8 text-zinc-400">
          These cards are a great place to give a high level break down of what
          your website is about. Try to talk about benefits instead of features.
        </p>

        <CornerBlur />
        <Mockup />
      </Card>
    </div>
  );
};

const Mockup = () => (
  <div className="absolute -bottom-4 left-6 h-[340px] w-full overflow-hidden rounded-xl border border-zinc-700 bg-zinc-950/50 sm:h-[370px]">
    <MockupTopBar />
    <div className="flex h-full w-full">
      <MockupSideBar />
      <MockupMain />
    </div>
  </div>
);

const MockupSideBar = () => (
  <div className="h-full w-24 border-r border-zinc-700 bg-zinc-900 p-2">
    <div className="mb-4 flex items-center justify-between ">
      <SiGithub className="text-zinc-700" />
      <FiBell className="text-blue-500" />
    </div>
    <div className="space-y-2">
      <div className="flex items-center gap-1 rounded bg-zinc-700 px-1 py-0.5 text-xs text-zinc-200">
        <FiUser />
        Users
      </div>
      <div className="flex items-center gap-1 rounded px-1 py-0.5 text-xs text-zinc-600">
        <FiMail />
        Campaigns
      </div>
      <div className="flex items-center gap-1 rounded px-1 py-0.5 text-xs text-zinc-600">
        <FiAward />
        Goals
      </div>
      <div className="flex items-center gap-1 rounded px-1 py-0.5 text-xs text-zinc-600">
        <FiGrid />
        Tools
      </div>
      <div className="flex items-center gap-1 rounded px-1 py-0.5 text-xs text-zinc-600">
        <FiSettings />
        Settings
      </div>
    </div>
  </div>
);

const MockupTopBar = () => (
  <div className="flex gap-1 border-b border-zinc-700 bg-zinc-950 p-2">
    <div className="size-2 rounded-full bg-red-600"></div>
    <div className="size-2 rounded-full bg-yellow-600"></div>
    <div className="size-2 rounded-full bg-green-600"></div>
  </div>
);

const MockupMain = () => {
  const [users, setUsers] = useState([
    {
      name: "John Johnson",
      src: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    },
    {
      name: "Dan Daniels",
      src: "https://api.dicebear.com/7.x/avataaars/svg?seed=Dan",
    },
    {
      name: "Tom Thomas",
      src: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tom",
    },
    {
      name: "Andrea Andreas",
      src: "https://api.dicebear.com/7.x/avataaars/svg?seed=Andrea",
    },
    {
      name: "Pete Peters",
      src: "https://api.dicebear.com/7.x/avataaars/svg?seed=Pete",
    },
    {
      name: "Phil Phillips",
      src: "https://api.dicebear.com/7.x/avataaars/svg?seed=Phil",
    },
    {
      name: "Garry Garrison",
      src: "https://api.dicebear.com/7.x/avataaars/svg?seed=Garry",
    },
    {
      name: "Frank Franklin",
      src: "https://api.dicebear.com/7.x/avataaars/svg?seed=Frank",
    },
    {
      name: "Don Donaldson",
      src: "https://api.dicebear.com/7.x/avataaars/svg?seed=Don",
    },
  ]);

  useEffect(() => {
    const intervalRef = setInterval(() => {
      setUsers((pv) => {
        const copy = [...pv];
        const lastEl = copy.shift();

        if (lastEl) {
          copy.push(lastEl);
        }

        return copy;
      });
    }, 5000);

    return () => clearInterval(intervalRef);
  }, []);

  return (
    <div className="relative w-full">
      <div className="relative z-0 w-full p-4">
        <div className="w-full border-b border-zinc-700 pb-2 text-xs font-semibold uppercase text-zinc-500">
          <span>User</span>
        </div>
        {users.map((u, i) => (
          <motion.div
            layout
            key={u.name}
            transition={{
              duration: 0.5,
              ease: "easeInOut",
            }}
            style={{
              zIndex: i === users.length - 1 ? 0 : 1,
            }}
            className="relative flex items-center gap-2 py-2 text-xs"
          >
            <motion.img
              animate={{
                scale: i === 0 ? 1.25 : 1,
              }}
              transition={{
                duration: 0.5,
                ease: "easeInOut",
              }}
              src={u.src}
              alt={`Placeholder image for faux user ${u.name}`}
              className="size-5 rounded-full"
            />
            <span className={i === 0 ? "text-zinc-200" : "text-zinc-500"}>
              {u.name}
            </span>
          </motion.div>
        ))}
      </div>
      <div className="absolute bottom-0 left-0 right-0 top-1/4 z-10 bg-gradient-to-b from-zinc-950/0 via-zinc-950/90 to-zinc-950" />
    </div>
  );
};
