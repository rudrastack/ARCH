import React, { useState } from 'react';

/**
 * FloatingInput Component
 * Minimalist luxury bottom-border input with animated floating label and sleek focus state.
 */
export const FloatingInput = ({
  id,
  name,
  type = 'text',
  label,
  value,
  onChange,
  required = false,
  autoComplete,
  error,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === 'password';
  const effectiveType = isPassword ? (showPassword ? 'text' : 'password') : type;
  const isFloating = isFocused || (value && value.toString().length > 0);

  return (
    <div className="relative pt-4 pb-1 group">
      <input
        id={id || name}
        name={name}
        type={effectiveType}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        required={required}
        autoComplete={autoComplete}
        className={`w-full bg-transparent text-black text-sm tracking-wide py-2 pr-8 focus:outline-none border-b transition-colors duration-300 ${
          error
            ? 'border-red-500'
            : isFocused
            ? 'border-black'
            : 'border-neutral-300 hover:border-neutral-400'
        }`}
      />

      <label
        htmlFor={id || name}
        className={`absolute left-0 pointer-events-none transition-all duration-300 ease-out font-sans-editorial ${
          isFloating
            ? 'top-0 text-[10px] tracking-widest uppercase font-medium text-neutral-500'
            : 'top-6 text-xs tracking-wider text-neutral-400 font-normal'
        }`}
      >
        {label} {required && <span className="text-black font-semibold">*</span>}
      </label>

      {/* Password Toggle Button */}
      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-0 top-6 text-neutral-400 hover:text-black transition-colors focus:outline-none"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? (
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-5.908a10.04 10.04 0 012.122-.363c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21f-9 9 0 00-9-9"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 3l18 18"
              />
            </svg>
          ) : (
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          )}
        </button>
      )}

      {/* Focus line indicator animation */}
      <span
        className={`absolute bottom-1 left-0 h-[1.5px] bg-black transition-all duration-300 ${
          isFocused ? 'w-full' : 'w-0'
        }`}
      />
    </div>
  );
};
