import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../hook/useAuth";
import ContinueWithGoogle from "../components/ContinueWithGoogle";

export const Register = () => {
  const { handleRegister, loading, error } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    contactNumber: "",
    email: "",
    password: "",
    isSeller: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Fixed: Passing formData.contactNumber instead of formData.contact
      const user = await handleRegister({
        email: formData.email,
        password: formData.password,
        fullname: formData.fullName,
        contact: formData.contactNumber,
        isSeller: formData.isSeller,
      });

      // Role-based navigation matching Login functionality
      if (user?.role === "seller" || formData.isSeller) {
        navigate("/seller/get");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("Registration failed:", err);
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
              alt="Editorial Visual"
              className="absolute inset-0 w-full h-full object-cover grayscale contrast-110 opacity-75"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1b1c1a] via-[#1b1c1a]/30 to-transparent" />

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
              <p className="text-[10px] uppercase tracking-[0.25em] text-[#C9A96E] font-medium">
                Member Privileges
              </p>
              <h3
                className="text-3xl font-light leading-snug text-[#fbf9f6]"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Access curated haute couture and exclusive drops.
              </h3>
            </div>
          </div>

          {/* Right Form */}
          <div className="w-full md:w-1/2 p-8 sm:p-12 flex flex-col justify-between bg-[#fbf9f6]">
            <div>
              {/* Header Tab */}
              <div className="flex border-b border-[#e4e2df] mb-8 pb-3">
                <span className="text-xs uppercase tracking-[0.2em] font-medium border-b-2 border-[#C9A96E] text-[#1b1c1a] pb-3 -mb-3">
                  Create Account
                </span>
              </div>

              {error && (
                <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 text-xs">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Full Name */}
                <div>
                  <label
                    htmlFor="reg-fullName"
                    className="text-[9px] uppercase tracking-[0.18em] text-[#7A6E63] font-medium block mb-1"
                  >
                    Full Name
                  </label>
                  <input
                    id="reg-fullName"
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    placeholder="e.g. John Doe"
                    className="w-full bg-transparent border-b border-[#d0c5b5] py-2 text-xs text-[#1b1c1a] outline-none focus:border-[#C9A96E] transition-colors"
                  />
                </div>

                {/* Contact Number */}
                <div>
                  <label
                    htmlFor="reg-contact"
                    className="text-[9px] uppercase tracking-[0.18em] text-[#7A6E63] font-medium block mb-1"
                  >
                    Contact Number
                  </label>
                  <input
                    id="reg-contact"
                    type="tel"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    required
                    placeholder="+91 98765 43210"
                    className="w-full bg-transparent border-b border-[#d0c5b5] py-2 text-xs text-[#1b1c1a] outline-none focus:border-[#C9A96E] transition-colors"
                  />
                </div>

                {/* Email Address */}
                <div>
                  <label
                    htmlFor="reg-email"
                    className="text-[9px] uppercase tracking-[0.18em] text-[#7A6E63] font-medium block mb-1"
                  >
                    Email Address
                  </label>
                  <input
                    id="reg-email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="hello@example.com"
                    className="w-full bg-transparent border-b border-[#d0c5b5] py-2 text-xs text-[#1b1c1a] outline-none focus:border-[#C9A96E] transition-colors"
                  />
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="reg-password"
                    className="text-[9px] uppercase tracking-[0.18em] text-[#7A6E63] font-medium block mb-1"
                  >
                    Password
                  </label>
                  <input
                    id="reg-password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="••••••••"
                    className="w-full bg-transparent border-b border-[#d0c5b5] py-2 text-xs text-[#1b1c1a] outline-none focus:border-[#C9A96E] transition-colors"
                  />
                </div>

                {/* Seller Checkbox */}
                <div className="pt-2">
                  <label
                    htmlFor="reg-isSeller"
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <div className="relative flex-shrink-0">
                      <input
                        id="reg-isSeller"
                        type="checkbox"
                        name="isSeller"
                        checked={formData.isSeller}
                        onChange={handleChange}
                        className="peer sr-only"
                      />
                      <div
                        className="w-4 h-4 border flex items-center justify-center transition-all"
                        style={{
                          borderColor: formData.isSeller ? "#C9A96E" : "#d0c5b5",
                          backgroundColor: formData.isSeller ? "#C9A96E" : "transparent",
                        }}
                      >
                        {formData.isSeller && (
                          <svg
                            className="w-2.5 h-2.5"
                            viewBox="0 0 12 12"
                            fill="none"
                          >
                            <path
                              d="M2 6l3 3 5-5"
                              stroke="#fff"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </div>
                    </div>

                    <span
                      className="text-[10px] uppercase tracking-[0.15em] font-medium"
                      style={{
                        color: formData.isSeller ? "#C9A96E" : "#7A6E63",
                      }}
                    >
                      Register as Seller
                    </span>
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-6 py-3.5 bg-[#1b1c1a] text-[#fbf9f6] text-xs uppercase tracking-[0.25em] font-medium hover:bg-[#C9A96E] hover:text-[#1b1c1a] transition-all duration-300 disabled:opacity-50"
                >
                  {loading ? "Processing..." : "Sign Up"}
                </button>
              </form>
            </div>

            {/* Footer / Social Options */}
            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex-1 h-px bg-[#e4e2df]" />
                <span className="text-[10px] uppercase tracking-[0.15em] text-[#B5ADA3]">
                  or
                </span>
                <div className="flex-1 h-px bg-[#e4e2df]" />
              </div>

              <ContinueWithGoogle />

              <p className="text-center text-[10px] uppercase tracking-wider text-[#7A6E63]">
                Already have an account?{" "}
                <span
                  onClick={() => navigate("/login")}
                  className="cursor-pointer text-[#1b1c1a] underline underline-offset-4 hover:text-[#C9A96E] transition-colors"
                >
                  Sign in
                </span>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default Register;