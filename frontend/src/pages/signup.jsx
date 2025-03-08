import Head from "next/head";
import { SignUpForm } from "@/components/auth/SignUpForm";
import { Barlow } from "next/font/google";
import Link from "next/link";
import { GradientGrid } from "@/components/utils/GradientGrid";

const barlowFont = Barlow({
    subsets: ["latin"],
    style: ["italic", "normal"],
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export default function SignUp() {
    return (
        <>
            <Head>
                <title>Sign Up | SavQuest</title>
            </Head>
            <div className={`min-h-screen bg-zinc-950 text-zinc-50 ${barlowFont.className} relative overflow-hidden`}>
                <GradientGrid />

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="max-w-md mx-auto">
                        <div className="text-center mb-10">
                            <Link href="/" className="inline-block mb-6">
                                <h1 className="text-3xl font-bold text-blue-500">SavQuest</h1>
                            </Link>
                            <h2 className="text-2xl font-bold mb-2">Create your account</h2>
                            <p className="text-zinc-400">
                                Start your financial journey with SavQuest
                            </p>
                        </div>

                        <SignUpForm />

                        <div className="mt-8 text-center">
                            <p className="text-zinc-400">
                                Already have an account?{" "}
                                <Link href="/signin" className="text-blue-500 hover:text-blue-400">
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
} 