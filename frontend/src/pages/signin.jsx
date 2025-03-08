import Head from "next/head";
import { useState } from "react";
import { useRouter } from "next/router";
import { SplashButton } from "@/components/buttons/SplashButton";
import { Barlow } from "next/font/google";
import Link from "next/link";
import { FiZap } from "react-icons/fi";
import { GradientGrid } from "@/components/utils/GradientGrid";
import { getRandomUserPreset } from "@/utils/userPresets";

const barlowFont = Barlow({
  subsets: ["latin"],
  style: ["italic", "normal"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

// Function to generate a random username
const generateRandomUsername = () => {
  const adjectives = ['Happy', 'Clever', 'Brave', 'Wise', 'Smart', 'Bold', 'Calm', 'Eager', 'Fair', 'Kind'];
  const nouns = ['Tiger', 'Eagle', 'Dolphin', 'Panda', 'Lion', 'Wolf', 'Bear', 'Hawk', 'Fox', 'Owl'];
  const randomNum = Math.floor(Math.random() * 1000);
  
  const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
  
  return `${randomAdjective}${randomNoun}${randomNum}`;
};

export default function SignIn() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isQuickLoading, setIsQuickLoading] = useState(false);
  const [randomPreset, setRandomPreset] = useState(() => getRandomUserPreset());

  // Function to refresh the random preset
  const refreshRandomPreset = () => {
    setRandomPreset(getRandomUserPreset());
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleQuickLogin = async () => {
    setIsQuickLoading(true);
    setError("");
    
    try {
      // Generate random user data
      const randomUsername = generateRandomUsername();
      const randomEmail = `${randomUsername.toLowerCase()}@example.com`;
      
      // Use the current random preset
      const preset = randomPreset;
      
      // Create a random user and store in localStorage
      const userData = {
        username: randomUsername,
        email: randomEmail,
        isAuthenticated: true,
        // Add a reference to which preset was used
        presetId: preset.id,
        presetName: preset.name
      };
      
      localStorage.setItem("savquest_user", JSON.stringify(userData));
      
      // Store the preset progress data
      localStorage.setItem("savquest_progress", JSON.stringify(preset));
      
      // Redirect to dashboard
      router.push("/dashboard");
    } catch (error) {
      console.error("Quick login error:", error);
      setError("An error occurred with quick login. Please try again.");
      setIsQuickLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    setIsLoading(true);

    try {
      // In a real app, you would validate credentials with your backend
      // For this POC, we'll just check if there's a user in localStorage with this email
      const userData = localStorage.getItem("savquest_user");

      if (userData) {
        const user = JSON.parse(userData);

        // Simple check - in a real app you'd verify the password properly
        if (user.email === formData.email) {
          // Update the user's authentication status
          user.isAuthenticated = true;
          localStorage.setItem("savquest_user", JSON.stringify(user));

          // Redirect to dashboard
          router.push("/dashboard");
          return;
        }
      }

      // If we get here, authentication failed
      setError("Invalid email or password");
    } catch (error) {
      console.error("Sign in error:", error);
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Sign In | SavQuest</title>
      </Head>
      <div className={`min-h-screen bg-zinc-950 text-zinc-50 ${barlowFont.className} relative overflow-hidden`}>
        <GradientGrid />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-10">
              <Link href="/" className="inline-block mb-6">
                <h1 className="text-3xl font-bold text-blue-500">SavQuest</h1>
              </Link>
              <h2 className="text-2xl font-bold mb-2">Welcome back!</h2>
              <p className="text-zinc-400">
                Sign in to continue your financial journey
              </p>
            </div>

            {/* Quick Login Button */}
            <div className="mb-6">
              <button
                onClick={handleQuickLogin}
                disabled={isQuickLoading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white font-medium rounded-md transition-all duration-200"
              >
                <FiZap className="text-lg" />
                {isQuickLoading ? "Logging in..." : "Quick Login"}
              </button>
              <div className="flex justify-between items-center mt-2">
                <p className="text-xs text-zinc-500">
                  Skip registration and login instantly
                </p>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-zinc-400">Profile: </span>
                  <span className="text-xs font-medium text-blue-400">{randomPreset.name}</span>
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      refreshRandomPreset();
                    }}
                    className="ml-1 text-xs text-zinc-500 hover:text-zinc-300"
                  >
                    ↻
                  </button>
                </div>
              </div>
            </div>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-zinc-950 text-zinc-500">Or continue with</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-900/30 border border-red-500 rounded-md p-3">
                  <p className="text-sm text-red-500">{error}</p>
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-zinc-300">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md bg-zinc-800 border border-zinc-700 py-2 px-3 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-zinc-300">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md bg-zinc-800 border border-zinc-700 py-2 px-3 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 rounded border-zinc-700 bg-zinc-800 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-zinc-300">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <a href="#" className="text-blue-500 hover:text-blue-400">
                    Forgot your password?
                  </a>
                </div>
              </div>

              <div>
                <SplashButton
                  type="submit"
                  className="w-full flex justify-center"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign in"}
                </SplashButton>
              </div>
            </form>

            <div className="mt-8 text-center">
              <p className="text-zinc-400">
                Don't have an account?{" "}
                <Link href="/signup" className="text-blue-500 hover:text-blue-400">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
