// import { useState } from 'react';
// import { useAuth } from "../hook/useAuth";
// import { useNavigate } from "react-router-dom";
// import ContinueWithGoogle from "../components/ContinueWithGoogle";

// export const Login = () => {
//     const { handleLogin } = useAuth();
//     const navigate = useNavigate();

//     const [formData, setFormData] = useState({
//         email: '',
//         password: ''
//     });

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData(prev => ({ ...prev, [name]: value }));
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             const user = await handleLogin({
//                 email: formData.email,
//                 password: formData.password
//             });

//             console.log("User:", user);

//             if (user?.role === "buyer") {
//                 console.log("Navigating...");
//                 navigate("/");
//             }
//             else if (user.role === "seller") {
//                 navigate("/seller/get");
//             }
//         } catch (error) {
//             console.error("Login failed", error);
//         }
//     };

//     return (
//         <>
//             {/* Google Fonts */}
//             <link
//                 href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap"
//                 rel="stylesheet"
//             />

//             <div
//                 className="min-h-screen flex flex-col lg:flex-row selection:bg-[#C9A96E]/30"
//                 style={{ backgroundColor: '#fbf9f6', fontFamily: "'Inter', sans-serif" }}
//             >
//                 {/* ── LEFT: Editorial Image Panel ── */}
//                 <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden" style={{ backgroundColor: '#f5f3f0' }}>
//                     <img
//                         src="/snitch_editorial_warm.png"
//                         alt="Snitch Fashion Editorial"
//                         className="absolute inset-0 w-full h-full object-cover object-top"
//                         style={{ filter: 'brightness(0.97)' }}
//                     />
//                     {/* Subtle warm overlay */}
//                     <div
//                         className="absolute inset-0"
//                         style={{ background: 'linear-gradient(to top, rgba(27,24,20,0.62) 0%, rgba(27,24,20,0.08) 45%, transparent 100%)' }}
//                     />
//                     <div className="absolute inset-0 p-14 flex flex-col justify-between z-10">
//                         {/* Brand */}
//                         <span
//                             className="text-sm font-medium tracking-[0.35em] uppercase"
//                             style={{ fontFamily: "'Cormorant Garamond', serif", color: '#C9A96E', letterSpacing: '0.35em' }}
//                         >
//                             Snitch.
//                         </span>
//                         {/* Editorial Headline */}
//                         <div>
//                             <p
//                                 className="text-5xl xl:text-6xl font-light leading-[1.08] text-white mb-5"
//                                 style={{ fontFamily: "'Cormorant Garamond', serif" }}
//                             >
//                                 Welcome<br />
//                                 <em>back.</em>
//                             </p>
//                             <p className="text-sm font-light leading-relaxed max-w-xs" style={{ color: 'rgba(255,255,255,0.65)' }}>
//                                 Sign in to explore the latest exclusive drops and manage your aesthetic.
//                             </p>
//                         </div>
//                     </div>
//                 </div>

//                 {/* ── RIGHT: Form Panel ── */}
//                 <div
//                     className="w-full lg:w-1/2 flex items-center justify-center min-h-screen px-8 sm:px-14 lg:px-20 py-16"
//                     style={{ backgroundColor: '#fbf9f6' }}
//                 >
//                     <div className="w-full max-w-sm">

//                         {/* Mobile brand mark */}
//                         <div className="lg:hidden mb-14">
//                             <span
//                                 className="text-sm tracking-[0.35em] uppercase"
//                                 style={{ fontFamily: "'Cormorant Garamond', serif", color: '#C9A96E' }}
//                             >
//                                 Snitch.
//                             </span>
//                         </div>

//                         {/* Header */}
//                         <div className="mb-14">
//                             <p
//                                 className="text-[10px] uppercase tracking-[0.22em] mb-4 font-medium"
//                                 style={{ color: '#C9A96E' }}
//                             >
//                                 Sign in to Snitch
//                             </p>
//                             <h1
//                                 className="text-[2.6rem] xl:text-5xl font-light leading-[1.1]"
//                                 style={{ fontFamily: "'Cormorant Garamond', serif", color: '#1b1c1a' }}
//                             >
//                                 Enter the Vault
//                             </h1>
//                         </div>

//                         {/* Form */}
//                         <form onSubmit={handleSubmit} className="flex flex-col gap-10">

//                             {/* Email */}
//                             <div className="flex flex-col gap-2">
//                                 <label
//                                     htmlFor="login-email"
//                                     className="text-[10px] uppercase tracking-[0.18em] font-medium"
//                                     style={{ color: '#7A6E63' }}
//                                 >
//                                     Email Address
//                                 </label>
//                                 <input
//                                     id="login-email"
//                                     type="email"
//                                     name="email"
//                                     value={formData.email}
//                                     onChange={handleChange}
//                                     required
//                                     placeholder="hello@example.com"
//                                     className="w-full bg-transparent outline-none py-3 text-sm transition-colors duration-300"
//                                     style={{
//                                         color: '#1b1c1a',
//                                         borderBottom: '1px solid #d0c5b5',
//                                         fontFamily: "'Inter', sans-serif"
//                                     }}
//                                     onFocus={e => e.target.style.borderBottomColor = '#C9A96E'}
//                                     onBlur={e => e.target.style.borderBottomColor = '#d0c5b5'}
//                                 />
//                             </div>

//                             {/* Password */}
//                             <div className="flex flex-col gap-2">
//                                 <div className="flex items-center justify-between">
//                                     <label
//                                         htmlFor="login-password"
//                                         className="text-[10px] uppercase tracking-[0.18em] font-medium"
//                                         style={{ color: '#7A6E63' }}
//                                     >
//                                         Password
//                                     </label>
//                                     <a
//                                         href="#"
//                                         className="text-[10px] transition-colors duration-200"
//                                         style={{ color: '#B5ADA3' }}
//                                         onMouseEnter={e => e.target.style.color = '#C9A96E'}
//                                         onMouseLeave={e => e.target.style.color = '#B5ADA3'}
//                                     >
//                                         Forgot password?
//                                     </a>
//                                 </div>
//                                 <input
//                                     id="login-password"
//                                     type="password"
//                                     name="password"
//                                     value={formData.password}
//                                     onChange={handleChange}
//                                     required
//                                     placeholder="••••••••"
//                                     className="w-full bg-transparent outline-none py-3 text-sm transition-colors duration-300"
//                                     style={{
//                                         color: '#1b1c1a',
//                                         borderBottom: '1px solid #d0c5b5',
//                                         fontFamily: "'Inter', sans-serif"
//                                     }}
//                                     onFocus={e => e.target.style.borderBottomColor = '#C9A96E'}
//                                     onBlur={e => e.target.style.borderBottomColor = '#d0c5b5'}
//                                 />
//                             </div>

//                             {/* Sign In Button */}
//                             <button
//                                 type="submit"
//                                 className="w-full py-4 text-[11px] uppercase tracking-[0.25em] font-medium transition-all duration-300 mt-2"
//                                 style={{
//                                     backgroundColor: '#1b1c1a',
//                                     color: '#fbf9f6',
//                                     fontFamily: "'Inter', sans-serif"
//                                 }}
//                                 onMouseEnter={e => {
//                                     e.currentTarget.style.backgroundColor = '#C9A96E';
//                                     e.currentTarget.style.color = '#1b1c1a';
//                                 }}
//                                 onMouseLeave={e => {
//                                     e.currentTarget.style.backgroundColor = '#1b1c1a';
//                                     e.currentTarget.style.color = '#fbf9f6';
//                                 }}
//                             >
//                                 Sign In
//                             </button>

//                             {/* Divider */}
//                             <div className="flex items-center gap-4">
//                                 <div className="flex-1 h-px" style={{ backgroundColor: '#e4e2df' }} />
//                                 <span className="text-[10px] uppercase tracking-[0.15em]" style={{ color: '#B5ADA3' }}>or</span>
//                                 <div className="flex-1 h-px" style={{ backgroundColor: '#e4e2df' }} />
//                             </div>
//                             <ContinueWithGoogle />
//                             {/* Google SSO */}


//                             {/* Footer Link */}
//                             <p className="text-center text-[11px]" style={{ color: '#B5ADA3' }}>
//                                 Don&apos;t have an account?{' '}
//                                 <a
//                                     href="/register"
//                                     className="transition-colors duration-200"
//                                     style={{ color: '#7A6E63', textDecoration: 'underline', textUnderlineOffset: '3px' }}
//                                     onMouseEnter={e => e.target.style.color = '#C9A96E'}
//                                     onMouseLeave={e => e.target.style.color = '#7A6E63'}
//                                 >
//                                     Sign up
//                                 </a>
//                             </p>
//                         </form>
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// };

// export default Login;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../hook/useAuth";
import ContinueWithGoogle from "../components/ContinueWithGoogle";

export const Login = () => {
    const { handleLogin, loading, error } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const user = await handleLogin({
                email: formData.email,
                password: formData.password,
            });

            console.log("User:", user);

            if (user?.role === "buyer") {
                console.log("Navigating...");
                navigate("/");
            } else if (user?.role === "seller") {
                navigate("/seller/get");
            }
        } catch (err) {
            console.error("Login failed", err);
        }
    };

    const handleClose = () => {
        navigate("/");
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto selection:bg-[#C9A96E]/30">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={handleClose}
                    className="fixed inset-0 bg-[#1b1c1a]/80 backdrop-blur-md"
                />

                {/* Modal Container */}
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    style={{ fontFamily: "'Inter', sans-serif" }}
                    className="relative z-10 w-full max-w-[1000px] bg-[#fbf9f6] border border-[#e4e2df] shadow-2xl overflow-hidden flex flex-col md:flex-row my-auto"
                >
                    {/* Close Button */}
                    <button
                        onClick={handleClose}
                        type="button"
                        className="absolute top-5 right-5 z-30 p-2 text-[#1b1c1a]/60 hover:text-[#1b1c1a] transition-colors"
                    >
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    {/* Left Editorial Visual */}
                    <div className="hidden md:flex md:w-1/2 bg-[#1b1c1a] p-10 flex-col justify-between relative overflow-hidden min-h-[550px]">
                        <img
                            src="/arks_hero_editorial.png"
                            alt="ARKS Fashion Editorial"
                            className="absolute inset-0 w-full h-full object-cover object-top filter brightness-[0.97]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#1b1c1a]/90 via-[#1b1c1a]/30 to-transparent" />

                        <div className="relative z-10">
                            <span
                                className="text-sm font-medium tracking-[0.35em] uppercase"
                                style={{
                                    fontFamily: "'Cormorant Garamond', serif",
                                    color: "#C9A96E",
                                }}
                            >
                                ARKS.
                            </span>
                        </div>

                        <div className="relative z-10 space-y-3">
                            <h3
                                className="text-4xl lg:text-5xl font-light leading-[1.08] text-white"
                                style={{ fontFamily: "'Cormorant Garamond', serif" }}
                            >
                                Welcome<br />
                                <em className="italic">back.</em>
                            </h3>
                            <p className="text-xs font-light leading-relaxed text-white/70 max-w-xs">
                                Sign in to explore the latest exclusive drops and manage your aesthetic.
                            </p>
                        </div>
                    </div>

                    {/* Right Form Panel */}
                    <div className="w-full md:w-1/2 p-8 sm:p-12 flex flex-col justify-between bg-[#fbf9f6]">
                        <div>
                            {/* Header Tab */}
                            <div className="flex border-b border-[#e4e2df] mb-8 pb-3">
                                <span className="text-xs uppercase tracking-[0.2em] font-medium border-b-2 border-[#C9A96E] text-[#1b1c1a] pb-3 -mb-3">
                                    Sign In
                                </span>
                            </div>

                            {error && (
                                <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 text-xs">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Email Address */}
                                <div className="flex flex-col gap-1">
                                    <label
                                        htmlFor="login-email"
                                        className="text-[9px] uppercase tracking-[0.18em] text-[#7A6E63] font-medium block"
                                    >
                                        Email Address
                                    </label>
                                    <input
                                        id="login-email"
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        placeholder="hello@example.com"
                                        className="w-full bg-transparent border-b border-[#d0c5b5] py-2 text-xs text-[#1b1c1a] outline-none focus:border-[#C9A96E] transition-colors duration-300"
                                    />
                                </div>

                                {/* Password */}
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-center justify-between">
                                        <label
                                            htmlFor="login-password"
                                            className="text-[9px] uppercase tracking-[0.18em] text-[#7A6E63] font-medium block"
                                        >
                                            Password
                                        </label>
                                        <a
                                            href="#"
                                            className="text-[10px] text-[#B5ADA3] hover:text-[#C9A96E] transition-colors duration-200"
                                        >
                                            Forgot password?
                                        </a>
                                    </div>
                                    <input
                                        id="login-password"
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        placeholder="••••••••"
                                        className="w-full bg-transparent border-b border-[#d0c5b5] py-2 text-xs text-[#1b1c1a] outline-none focus:border-[#C9A96E] transition-colors duration-300"
                                    />
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full mt-6 py-3.5 bg-[#1b1c1a] text-[#fbf9f6] text-xs uppercase tracking-[0.25em] font-medium hover:bg-[#C9A96E] hover:text-[#1b1c1a] transition-all duration-300 disabled:opacity-50"
                                >
                                    {loading ? "Processing..." : "Sign In"}
                                </button>
                            </form>
                        </div>

                        {/* Footer / Social Options */}
                        <div className="mt-8 space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="flex-1 h-px bg-[#e4e2df]" />
                                <span className="text-[10px] uppercase tracking-[0.15em] text-[#B5ADA3]">
                                    or
                                </span>
                                <div className="flex-1 h-px bg-[#e4e2df]" />
                            </div>

                            <ContinueWithGoogle />

                            <p className="text-center text-[10px] uppercase tracking-wider text-[#7A6E63]">
                                Don&apos;t have an account?{" "}
                                <span
                                    onClick={() => navigate("/register")}
                                    className="cursor-pointer text-[#1b1c1a] underline underline-offset-4 hover:text-[#C9A96E] transition-colors duration-200"
                                >
                                    Sign up
                                </span>
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default Login;