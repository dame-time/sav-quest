import { useState } from "react";
import { useRouter } from "next/router";
import { SplashButton } from "../buttons/SplashButton";

export const SignUpForm = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.username.trim()) {
            newErrors.username = "Username is required";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email is invalid";
        }

        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setIsLoading(true);

        try {
            // In a real app, you would send this data to your backend
            // For now, we'll just simulate a successful registration

            // Store user info in localStorage (in a real app, this would be handled by your auth system)
            localStorage.setItem("savquest_user", JSON.stringify({
                username: formData.username,
                email: formData.email,
                isAuthenticated: true
            }));

            // Redirect to onboarding
            router.push("/onboarding");
        } catch (error) {
            console.error("Registration error:", error);
            setErrors({ form: "Registration failed. Please try again." });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="username" className="block text-sm font-medium text-zinc-300">
                        Username
                    </label>
                    <input
                        id="username"
                        name="username"
                        type="text"
                        required
                        value={formData.username}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md bg-zinc-800 border border-zinc-700 py-2 px-3 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors.username && (
                        <p className="mt-1 text-sm text-red-500">{errors.username}</p>
                    )}
                </div>

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
                    {errors.email && (
                        <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                    )}
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
                    {errors.password && (
                        <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-zinc-300">
                        Confirm Password
                    </label>
                    <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        required
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md bg-zinc-800 border border-zinc-700 py-2 px-3 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors.confirmPassword && (
                        <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
                    )}
                </div>

                {errors.form && (
                    <div className="bg-red-900/30 border border-red-500 rounded-md p-3">
                        <p className="text-sm text-red-500">{errors.form}</p>
                    </div>
                )}

                <div>
                    <SplashButton
                        type="submit"
                        className="w-full flex justify-center"
                        disabled={isLoading}
                    >
                        {isLoading ? "Creating Account..." : "Sign Up"}
                    </SplashButton>
                </div>
            </form>
        </div>
    );
}; 