import React, { useState } from "react";
import { MaxWidthWrapper } from "../utils/MaxWidthWrapper";
import { Card } from "../utils/Card";
import { SiX } from "react-icons/si";
import { BubbleButton } from "../buttons/BubbleButton";
import { motion } from "framer-motion";
import { useWindowSize } from "../utils/useWindowSize";
import { CornerGrid } from "../utils/CornerGrid";
import { SectionHeading } from "../utils/SectionHeading";
import { SectionSubheading } from "../utils/SectionSubheading";
import { SectionHeadingSpacing } from "../utils/SectionHeadingSpacing";

export const Customers = () => {
  const { width } = useWindowSize();
  const [open, setOpen] = useState(false);

  const shouldCollapseColumns = width ? width <= 768 : false;

  return (
    <section id="testimonials" className="relative overflow-hidden">
      <MaxWidthWrapper className="relative z-10 py-20 md:py-40">
        <SectionHeadingSpacing>
          <SectionHeading>Loved by our customers</SectionHeading>
          <SectionSubheading>
            People trust people. Show off all of the great reviews of your
            product to ease the minds of potential customers.
          </SectionSubheading>
        </SectionHeadingSpacing>
        <motion.div
          initial={false}
          animate={open ? "open" : "closed"}
          style={{
            overflow: "hidden",
          }}
          variants={{
            open: {
              height: "fit-content",
            },
            closed: {
              height: 400,
            },
          }}
          className="relative grid grid-cols-1 gap-3 md:grid-cols-3"
        >
          {shouldCollapseColumns ? (
            <>
              <ReviewsColumn
                reviews={[...REVIEWS.left, ...REVIEWS.center, ...REVIEWS.right]}
              />
            </>
          ) : (
            <>
              <ReviewsColumn reviews={REVIEWS.left} />
              <ReviewsColumn reviews={REVIEWS.center} />
              <ReviewsColumn reviews={REVIEWS.right} />
            </>
          )}

          <motion.div
            variants={{
              open: {
                top: "100%",
              },
              closed: {
                top: "0%",
              },
            }}
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-b from-zinc-950/0 to-zinc-950"
          />
        </motion.div>
        <BubbleButton
          onClick={() => setOpen((pv) => !pv)}
          className="mx-auto mt-12"
        >
          {open ? "View less" : "View more"}
        </BubbleButton>
      </MaxWidthWrapper>
      <CornerGrid />
    </section>
  );
};

const ReviewsColumn = ({ reviews }) => {
  return (
    <div className="h-fit space-y-3">
      {reviews.map((r) => (
        <Card
          style={{
            padding: "20px",
          }}
          key={r.name}
        >
          <div className="mb-1.5 flex items-center justify-between">
            <div className="relative flex items-center gap-2 py-2 text-xs">
              <img
                src={r.src}
                alt={`Placeholder image for faux user ${r.name}`}
                className="size-8 rounded-full"
              />
              <div>
                <span className="block font-medium text-zinc-300">
                  {r.name}
                </span>
                <span className="block text-zinc-500">{r.handle}</span>
              </div>
            </div>

            <SiX className="text-sky-300" />
          </div>
          <p>{r.review}</p>
        </Card>
      ))}
    </div>
  );
};

const REVIEWS = {
  left: [
    {
      src: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
      name: "John Johnson",
      handle: "@johns6",
      review:
        "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Earum labore incidunt temporibus sunt? Excepturi nulla atque odio dolore, velit harum.",
    },
    {
      src: "https://api.dicebear.com/7.x/avataaars/svg?seed=Dan",
      name: "Dan Daniels",
      handle: "@DannyD",
      review:
        "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Earum labore velit harum.",
    },
    {
      src: "https://api.dicebear.com/7.x/avataaars/svg?seed=Phil",
      name: "Phil Phillips",
      handle: "@phillipsp55104",
      review:
        "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Earum labore incidunt temporibus sunt? Excepturi velit harum.",
    },
    {
      src: "https://api.dicebear.com/7.x/avataaars/svg?seed=Andy",
      name: "Andy Anderson",
      handle: "@andyandyandy",
      review:
        "Lorem ipsum, dolor sit amet consectetur adipisicing. Excepturi nulla atque odio dolore, velit harum.",
    },
  ],
  center: [
    {
      src: "https://api.dicebear.com/7.x/avataaars/svg?seed=Steve",
      name: "Steve Stevenson",
      handle: "@steves",
      review: "Lorem ipsum, dolor sit amet consectetur adipisicing.",
    },
    {
      src: "https://api.dicebear.com/7.x/avataaars/svg?seed=Peter",
      name: "Peter Peterson",
      handle: "@petey.pete",
      review:
        "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Earum labore incidunt.",
    },
    {
      src: "https://api.dicebear.com/7.x/avataaars/svg?seed=Paul",
      name: "Paul Paulson",
      handle: "@p.paulson44",
      review:
        "Lorem ipsum, dolor sit amet consectetur adipisicing elit velit harum.",
    },
    {
      src: "https://api.dicebear.com/7.x/avataaars/svg?seed=Phil",
      name: "Andrew Andrews",
      handle: "@andrewA",
      review:
        "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Earum labore incidunt temporibus sunt.",
    },
  ],
  right: [
    {
      src: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jeff",
      name: "Jeff Jefferson",
      handle: "@jeffJ99",
      review:
        "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Excepturi nulla atque odio dolore, velit harum.",
    },
    {
      src: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jess",
      name: "Jess Jessica",
      handle: "@jess",
      review:
        "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Earum labore velit harum. Dolor sit amet consectetur adipisicing elit!",
    },
    {
      src: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ben",
      name: "Ben Benjamin",
      handle: "@banjamin4491",
      review:
        "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Earum labore incidunt temporibus sunt? Excepturi velit harum.",
    },
    {
      src: "https://api.dicebear.com/7.x/avataaars/svg?seed=Frank",
      name: "Frank Franklin",
      handle: "@frankyf00",
      review:
        "Lorem ipsum, dolor sit amet consectetur adipisicing. Excepturi nulla.",
    },
  ],
};
