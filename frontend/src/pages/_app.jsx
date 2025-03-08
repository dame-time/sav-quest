import { NavBar } from "@/components/navbar/NavBar";
import { OnboardingProvider } from "../context/OnboardingContext";
import "@/styles/globals.css";

export default function App({ Component, pageProps }) {
  return (
    <OnboardingProvider>
      <NavBar />
      <Component {...pageProps} />
    </OnboardingProvider>
  );
}
