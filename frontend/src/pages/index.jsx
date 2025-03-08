import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { Barlow } from "next/font/google";
import Link from "next/link";
import { motion } from "framer-motion";

// Import components similar to the project landing page
import { MaxWidthWrapper } from "@/components/utils/MaxWidthWrapper";

const barlowFont = Barlow({
  subsets: ["latin"],
  style: ["italic", "normal"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

// Hero section adapted from project
const Hero = () => {
  return (
    <div className="relative bg-zinc-950 pt-24 pb-20 md:pt-72 md:pb-72 overflow-hidden">
      {/* Add GradientGrid as background */}
      <GradientGrid />
      
      <MaxWidthWrapper className="relative z-10">
        <div className="text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-4xl font-bold tracking-tight text-white sm:text-6xl md:text-7xl"
          >
            Master Your Finances with <span className="text-blue-500">SavQuest</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="mt-6 text-lg leading-8 text-zinc-300 max-w-3xl mx-auto"
          >
            Your personal finance journey made simple. Track spending, set goals, and learn financial skills through interactive challenges and expert guidance.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="mt-10 flex items-center justify-center gap-x-6"
          >
            <Link
              href="/signup"
              className="rounded-md bg-blue-600 px-6 py-3 text-lg font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              Get Started
            </Link>
            <Link href="#features" className="text-lg font-semibold leading-6 text-white hover:text-blue-400">
              Learn more <span aria-hidden="true">→</span>
            </Link>
          </motion.div>
        </div>
      </MaxWidthWrapper>
    </div>
  );
};

// Features section
const Features = () => {
  return (
    <div id="features" className="py-24 bg-zinc-900">
      <MaxWidthWrapper>
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-blue-500">Features</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Everything you need to master your finances
          </p>
          <p className="mt-6 text-lg leading-8 text-zinc-300">
            SavQuest provides all the tools you need to understand, manage, and grow your finances.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <div className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {[
              {
                title: "Expense Tracking",
                description: "Easily track and categorize your expenses to understand where your money goes.",
                icon: "📊",
              },
              {
                title: "Financial Goals",
                description: "Set and track progress towards your financial goals with visual dashboards.",
                icon: "🎯",
              },
              {
                title: "Learning Journey",
                description: "Learn financial concepts through interactive lessons and real-world challenges.",
                icon: "📚",
              },
              {
                title: "AI Financial Coach",
                description: "Get personalized advice and answers to your financial questions.",
                icon: "🤖",
              },
              {
                title: "Bank Integration",
                description: "Securely connect your bank accounts for automatic transaction tracking.",
                icon: "🏦",
              },
              {
                title: "Community Challenges",
                description: "Compete with friends and earn rewards for good financial habits.",
                icon: "🏆",
              },
            ].map((feature, index) => (
              <div key={index} className="flex flex-col bg-zinc-800 p-6 rounded-xl">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold leading-7 text-white">{feature.title}</h3>
                <p className="mt-2 text-base leading-7 text-zinc-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </MaxWidthWrapper>
    </div>
  );
};

// Stats section
const Stats = () => {
  return (
    <div className="bg-zinc-950 py-24">
      <MaxWidthWrapper>
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-blue-500">Results</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Join thousands improving their finances
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:mt-20 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-4">
          {[
            { value: "87%", label: "of users save more money" },
            { value: "2.5x", label: "increase in financial literacy" },
            { value: "10k+", label: "active users" },
            { value: "4.8/5", label: "average rating" },
          ].map((stat, index) => (
            <div key={index} className="flex flex-col bg-zinc-800/50 p-8 rounded-xl">
              <div className="text-4xl font-bold text-blue-500">{stat.value}</div>
              <div className="mt-2 text-base text-zinc-300">{stat.label}</div>
            </div>
          ))}
        </div>
      </MaxWidthWrapper>
    </div>
  );
};

// Testimonials
const Testimonials = () => {
  return (
    <div id="testimonials" className="bg-zinc-900 py-24">
      <MaxWidthWrapper>
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-blue-500">Testimonials</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            What our users are saying
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {[
            {
              quote: "SavQuest helped me pay off my student loans 2 years earlier than planned. The goal tracking feature kept me motivated.",
              author: "Sarah J.",
              role: "Teacher",
            },
            {
              quote: "I never understood investing until I started using SavQuest. The learning modules break down complex topics in a way that's easy to understand.",
              author: "Michael T.",
              role: "Software Engineer",
            },
            {
              quote: "The AI coach answered all my questions about budgeting and helped me create a plan that actually works for my lifestyle.",
              author: "Elena R.",
              role: "Freelance Designer",
            },
          ].map((testimonial, index) => (
            <div key={index} className="flex flex-col bg-zinc-800 p-8 rounded-xl">
              <p className="text-lg text-zinc-300 italic">"{testimonial.quote}"</p>
              <div className="mt-6">
                <p className="text-base font-semibold text-white">{testimonial.author}</p>
                <p className="text-sm text-zinc-400">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </MaxWidthWrapper>
    </div>
  );
};

// Pricing section
const Pricing = () => {
  return (
    <div id="pricing" className="bg-zinc-950 py-24">
      <MaxWidthWrapper>
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-blue-500">Pricing</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Simple, transparent pricing
          </p>
          <p className="mt-6 text-lg leading-8 text-zinc-300">
            Choose the plan that works best for your financial journey
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-md grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {[
            {
              name: "Basic",
              price: "Free",
              description: "Essential tools to start your financial journey",
              features: [
                "Expense tracking",
                "Basic budgeting tools",
                "Limited financial lessons",
                "Community access",
              ],
              cta: "Get Started",
              highlighted: false,
            },
            {
              name: "Premium",
              price: "$9.99/month",
              description: "Advanced tools for serious financial growth",
              features: [
                "Everything in Basic",
                "Unlimited financial lessons",
                "AI financial coach",
                "Goal tracking and insights",
                "Bank account integration",
                "Priority support",
              ],
              cta: "Start Free Trial",
              highlighted: true,
            },
            {
              name: "Family",
              price: "$19.99/month",
              description: "Manage finances for the whole family",
              features: [
                "Everything in Premium",
                "Up to 5 user accounts",
                "Family budget planning",
                "Shared goals and challenges",
                "Financial education for kids",
                "Dedicated support team",
              ],
              cta: "Start Free Trial",
              highlighted: false,
            },
          ].map((plan, index) => (
            <div
              key={index}
              className={`flex flex-col p-8 rounded-xl ${
                plan.highlighted
                  ? "bg-blue-600 ring-2 ring-blue-500"
                  : "bg-zinc-800"
              }`}
            >
              <h3 className={`text-2xl font-bold ${plan.highlighted ? "text-white" : "text-white"}`}>
                {plan.name}
              </h3>
              <p className={`mt-4 text-5xl font-bold tracking-tight ${plan.highlighted ? "text-white" : "text-white"}`}>
                {plan.price}
              </p>
              <p className={`mt-2 text-base ${plan.highlighted ? "text-blue-100" : "text-zinc-300"}`}>
                {plan.description}
              </p>
              <ul className="mt-8 space-y-3">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center">
                    <div className={`rounded-full p-1 ${plan.highlighted ? "bg-blue-800" : "bg-zinc-700"}`}>
                      <svg className={`h-4 w-4 ${plan.highlighted ? "text-blue-100" : "text-zinc-300"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className={`ml-3 text-sm ${plan.highlighted ? "text-white" : "text-zinc-300"}`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
              <Link
                href="/signup"
                className={`mt-8 block rounded-md px-3.5 py-2.5 text-center text-sm font-semibold shadow-sm ${
                  plan.highlighted
                    ? "bg-white text-blue-600 hover:bg-blue-50"
                    : "bg-blue-600 text-white hover:bg-blue-500"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </MaxWidthWrapper>
    </div>
  );
};

// CTA section
const CTA = () => {
  return (
    <div className="bg-blue-600 py-16">
      <MaxWidthWrapper>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to transform your financial future?
          </h2>
          <p className="mt-6 text-lg leading-8 text-blue-100">
            Join thousands of users who are taking control of their finances with SavQuest.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/signup"
              className="rounded-md bg-white px-6 py-3 text-lg font-semibold text-blue-600 shadow-sm hover:bg-blue-50"
            >
              Get Started Today
            </Link>
            <Link href="/signin" className="text-lg font-semibold text-white hover:text-blue-100">
              Sign In <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </MaxWidthWrapper>
    </div>
  );
};

// Footer
const Footer = () => {
  return (
    <footer className="bg-zinc-950 py-12">
      <MaxWidthWrapper>
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div>
            <h3 className="text-sm font-semibold text-white">Product</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="#features" className="text-sm text-zinc-400 hover:text-white">Features</Link></li>
              <li><Link href="#pricing" className="text-sm text-zinc-400 hover:text-white">Pricing</Link></li>
              <li><Link href="#" className="text-sm text-zinc-400 hover:text-white">Roadmap</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Resources</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="#" className="text-sm text-zinc-400 hover:text-white">Blog</Link></li>
              <li><Link href="#" className="text-sm text-zinc-400 hover:text-white">Help Center</Link></li>
              <li><Link href="#" className="text-sm text-zinc-400 hover:text-white">Community</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Company</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="#" className="text-sm text-zinc-400 hover:text-white">About</Link></li>
              <li><Link href="#" className="text-sm text-zinc-400 hover:text-white">Careers</Link></li>
              <li><Link href="#" className="text-sm text-zinc-400 hover:text-white">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Legal</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="#" className="text-sm text-zinc-400 hover:text-white">Privacy</Link></li>
              <li><Link href="#" className="text-sm text-zinc-400 hover:text-white">Terms</Link></li>
              <li><Link href="#" className="text-sm text-zinc-400 hover:text-white">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-zinc-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-zinc-400">© 2023 SavQuest. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="#" className="text-zinc-400 hover:text-white">
              <span className="sr-only">Twitter</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </Link>
            <Link href="#" className="text-zinc-400 hover:text-white">
              <span className="sr-only">GitHub</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
      </MaxWidthWrapper>
    </footer>
  );
};


const GradientGrid = () => {
  return (
    <motion.div
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      transition={{
        duration: 2.5,
        ease: "easeInOut",
      }}
      className="absolute inset-0 z-0"
    >
      <div
        style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke-width='2' stroke='rgb(30 58 138 / 0.5)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e")`,
        }}
        className="absolute inset-0 z-0"
      />
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-zinc-950/0 to-zinc-950" />
    </motion.div>
  );
};

const GRID_BOX_SIZE = 32;
const BEAM_WIDTH_OFFSET = 1;

export default function Home() {
  const router = useRouter();
  
  // Check if user is logged in
  useEffect(() => {
    const userData = localStorage.getItem("savquest_user");
    if (userData) {
      // If user is logged in, redirect to dashboard
      router.push("/dashboard");
    }
  }, [router]);

  return (
    <main className={barlowFont.className}>
      <Hero />
      <Features />
      <Stats />
      <Testimonials />
      <Pricing />
      <CTA />
      <Footer />
    </main>
  );
}
