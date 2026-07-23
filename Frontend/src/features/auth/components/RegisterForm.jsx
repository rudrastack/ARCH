import React, { useState } from 'react';
import { FloatingInput } from './FloatingInput';
import { RoleSelector } from './RoleSelector';
import { useAuth } from '../hooks/useAuth';

/**
 * RegisterForm Component
 * Right-hand side 50% form with controlled state handling, validation, and luxury submission animation.
 */
export const RegisterForm = () => {

  const { handleRegister } = useAuth()
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    contact: '',
    password: '',
    isSeller: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleRoleChange = (newRole) => {
    setFormData((prev) => ({
      ...prev,
      role: newRole,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleChange({
      email: formData.email,
      fullname: formData.fullname,
      password: formData.password,
      contact: formData.contact,
      role: formData.role,
    })
    console.log("register form submitted", formData)
  };

  setTimeout(() => {
    setIsSubmitting(false);
    setSubmittedData(payload);
    if (onSubmitSuccess) {
      onSubmitSuccess(payload);
    }
  }, 600);


  return (
    <div className="w-full md:w-1/2 bg-white p-8 sm:p-10 lg:p-14 flex flex-col justify-between overflow-y-auto">
      {/* Brand Header */}
      <div>
        <div className="flex justify-between items-center mb-8">
          <span className="text-2xl font-bold tracking-[0.35em] text-black font-serif-editorial uppercase">
            ARKS
          </span>
          <span className="text-[10px] uppercase tracking-[0.25em] text-neutral-400 font-sans-editorial">
            Membership
          </span>
        </div>

        {/* Heading & Subheading */}
        <div className="space-y-2 mb-8">
          <h1 className="text-2xl sm:text-3xl font-light text-black tracking-tight font-serif-editorial">
            Become Part of the Community
          </h1>
          <p className="text-xs text-neutral-500 font-light leading-relaxed font-sans-editorial">
            Create your account to access exclusive collections and member benefits.
          </p>
        </div>

        {/* Submission Toast / Success Payload View */}
        {submittedData && (
          <div className="mb-6 p-4 bg-neutral-900 text-white rounded border border-black space-y-2 text-xs transition-all duration-300">
            <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-neutral-400">
              <span>Account Registered Successfully</span>
              <button
                type="button"
                onClick={() => setSubmittedData(null)}
                aria-label="Dismiss toast notification"
                className="text-neutral-400 hover:text-white"
              >
                &times;
              </button>
            </div>
            <pre className="text-[11px] font-mono bg-black/60 p-2.5 rounded text-neutral-200 overflow-x-auto">
              {JSON.stringify(submittedData, null, 2)}
            </pre>
          </div>
        )}

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <FloatingInput
            id="fullname"
            name="fullname"
            type="text"
            label="Full Name"
            value={formData.fullname}
            onChange={handleChange}
            required
            autoComplete="name"
          />

          <FloatingInput
            id="email"
            name="email"
            type="email"
            label="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            autoComplete="email"
          />

          <FloatingInput
            id="contact"
            name="contact"
            type="tel"
            label="Contact Number"
            value={formData.contact}
            onChange={handleChange}
            required
            autoComplete="tel"
          />

          <FloatingInput
            id="password"
            name="password"
            type="password"
            label="Password"
            value={formData.password}
            onChange={handleChange}
            required
            autoComplete="new-password"
          />

          {/* Role Selection Component */}
          <RoleSelector
            selectedRole={formData.role}
            onChange={handleRoleChange}
          />

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-6 relative group overflow-hidden bg-black text-white py-4 text-xs font-semibold tracking-[0.25em] uppercase transition-all duration-300 hover:bg-neutral-800 active:scale-[0.99] disabled:opacity-70 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
          >
            <span className="relative z-10 flex items-center justify-center space-x-2">
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <svg
                    className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                    />
                  </svg>
                </>
              )}
            </span>
            <div className="absolute inset-0 bg-neutral-900 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
          </button>
        </form>
      </div>

      {/* Footer / Sign In Link */}
      <div className="mt-8 pt-6 border-t border-neutral-100 text-center">
        <p className="text-xs text-neutral-500 font-light font-sans-editorial">
          Already have an account?{' '}
          <button
            type="button"
            onClick={onSignInClick}
            className="text-black font-semibold tracking-wider hover:underline underline-offset-4 uppercase ml-1 transition-all"
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
}