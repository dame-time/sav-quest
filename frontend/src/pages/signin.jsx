import Head from "next/head";
import { useState } from "react";
import { useRouter } from "next/router";
import { SplashButton } from "@/components/buttons/SplashButton";
import { Barlow } from "next/font/google";
import Link from "next/link";

const barlowFont = Barlow({
  subsets: ["latin"],
  style: ["italic", "normal"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export default function SignIn() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
      <div className={`min-h-screen bg-zinc-950 text-zinc-50 ${barlowFont.className}`}>
        <div className="absolute inset-0 bg-grid-zinc-700/50 z-0" />
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/0 to-zinc-950 z-0" />

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
