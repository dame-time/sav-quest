import dynamic from "next/dynamic";

export const TextParallaxContentDynamic = dynamic(
  () =>
    import("@/components/feature-toggles/TextParallaxContent.jsx").then(
      (mod) => mod.TextParallaxContent
    ),
  {
    ssr: false,
    loading: () => <div style={{ height: "100vh" }}>Loading…</div>,
  }
);