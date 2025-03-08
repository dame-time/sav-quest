import { motion, useTransform } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";

function ParallaxSlide({
  index,
  totalSlides,
  scrollYProgress,
  imgUrl,
  subheading,
  heading,
  title,
  text,
  cta,
}) {
  // Calculate where this slide should start/end in scroll space
  const start = index / totalSlides;
  const end = (index + 1) / totalSlides;

  // Example transforms for image scale & overlay fade
  const scale = useTransform(scrollYProgress, [start, end], [1, 0.85]);
  const imageOpacity = useTransform(scrollYProgress, [start, end], [1, 0.5]);

  // For subheading/heading to move in/out
  const textY = useTransform(scrollYProgress, [start, end], ["30%", "-30%"]);
  const textOpacity = useTransform(scrollYProgress, [start + 0.1, end - 0.1], [0, 1]);

  return (
    <div className="relative snap-start h-screen w-full flex flex-col">
      {/* Parallax Image */}
      <motion.div
        className="sticky top-0 h-screen w-full bg-cover bg-center"
        style={{
          scale,
          opacity: imageOpacity,
          backgroundImage: `url(${imgUrl})`,
        }}
      >
        {/* Optional overlay */}
        <div className="absolute inset-0 bg-black/50" />
      </motion.div>

      {/* Overlay Text */}
      <motion.div
        style={{
          y: textY,
          opacity: textOpacity,
        }}
        className="pointer-events-none absolute top-0 left-0 flex h-full w-full flex-col items-center justify-center px-6 text-center text-white"
      >
        <p className="mb-2 text-xl md:mb-4 md:text-3xl">{subheading}</p>
        <p className="text-4xl font-bold md:text-6xl">{heading}</p>
      </motion.div>

      {/* Slide Content (below the fold) */}
      <div className="relative z-10 mt-auto w-full bg-foreground">
        <FeatureContent title={title} text={text} cta={cta} />
      </div>
    </div>
  );
}

function FeatureContent({ title, text, cta }) {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 md:py-24 md:grid md:grid-cols-12 md:gap-8">
      <h2 className="col-span-4 text-3xl font-bold md:text-4xl">{title}</h2>
      <div className="col-span-8 mt-4 md:mt-0">
        <p className="mb-4 text-xl text-copy-light md:text-2xl">{text}</p>
        <button className="w-full rounded bg-primary px-9 py-4 text-xl text-white transition-colors hover:bg-primary-dark md:w-auto">
          {cta} <FiArrowUpRight className="inline" />
        </button>
      </div>
    </div>
  );
}

export default ParallaxSlide;