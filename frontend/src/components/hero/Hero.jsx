import { GradientGrid } from "./GradientGrid";
import { Beams } from "../utils/Beams";
import { Content } from "./Content";

export const Hero = () => {
  return (
    <section className="relative overflow-hidden">
      <Content />
      <Beams />
      <GradientGrid />
    </section>
  );
};
