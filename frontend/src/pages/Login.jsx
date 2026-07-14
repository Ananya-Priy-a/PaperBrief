import React, { useState, useEffect } from "react";
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import Logo from '@/components/layout/Logo';
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

/**
 * Login Component for PaperBrief AI
 * Built with React, Tailwind CSS v4, and Lucide Icons.
 * Follows shadcn/ui design patterns for a premium AI SaaS feel.
 */
const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const navigate = useNavigate();
    const handleSignup = async () => {

        if (!formData.email || !formData.password) {

            alert("Enter email and password first.");
            return;

        }

        setIsLoading(true);

        const { error } = await supabase.auth.signUp({

            email: formData.email,
            password: formData.password,

        });

        setIsLoading(false);

        if (error) {

            alert(error.message);
            return;

        }

        alert("Account created successfully! Please sign in.");

    };
    const handleSubmit = async (e) => {
        e.preventDefault();

        setIsLoading(true);

        const { data, error } =
            await supabase.auth.signInWithPassword({
                email: formData.email,
                password: formData.password,
            });

        setIsLoading(false);

        if (error) {
            alert(error.message);
            return;
        }

        console.log("Logged in!");

        const token = data.session.access_token;

        console.log("Access Token:");
        console.log(token);

        console.log("JWT Header:");
        console.log(JSON.parse(atob(token.split(".")[0])));

        navigate("/dashboard");
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };
    React.useEffect(() => {

        setFormData((prev) => ({
            ...prev,
            password: "",
        }));

    }, []);
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#faf8ff] p-4 font-sans selection:bg-primary/20">
            <div className="w-full max-w-[480px] animate-in fade-in zoom-in duration-500">
                {/* Card Container */}
                <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-8 md:p-12">

                    {/* Header Section */}
                    <div className="flex flex-col items-center text-center mb-10">
                        <Logo size="login" />
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">
                            Welcome Back
                        </h1>
                        <p className="text-slate-500 text-sm">
                            Unlock the power of research with AI.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email Field */}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 ml-1">
                                Email Address
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                                    <Mail size={18} strokeWidth={2.5} />
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    placeholder="name@university.edu"
                                    className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center px-1">
                                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                    Password
                                </label>
                            </div>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                                    <Lock size={18} strokeWidth={2.5} />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    required
                                    placeholder="••••••••"
                                    className="block w-full pl-11 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Sign In Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3.5 bg-primary text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 hover:bg-primary/90 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-100"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase tracking-widest font-bold text-slate-300">
                            <span className="bg-white px-4">OR</span>
                        </div>
                    </div>


                    {/* Footer Link */}
                    <div className="mt-8 text-center text-sm text-slate-500">
                        Don't have an account?{' '}
                        <button
                            type="button"
                            onClick={() => navigate("/signup")}
                            className="font-semibold text-primary hover:underline"
                        >
                            Sign up
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;