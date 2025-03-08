import { Beams } from "@/components/utils/Beams";
import React from "react";

export const Minigrid = () => {
  return (
    <div className="absolute bottom-0 left-0 right-0 top-0 bg-grid-blue-900/50">
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/80 via-zinc-950/0 to-zinc-950/80" />
      <Beams />
    </div>
  );
};
