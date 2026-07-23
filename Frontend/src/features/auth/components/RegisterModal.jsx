import React, { useEffect } from 'react';
import { EditorialHeroSection } from './EditorialHeroSection';
import { RegisterForm } from './RegisterForm';

/**
 * RegisterModal Component
 * Centered modal dialog max-w-[1200px] with editorial left imagery and right-side form.
 */
export const RegisterModal = ({
  isOpen = true,
  onClose,
  onSubmitSuccess,
  onSignInClick,
}) => {
  // Listen for Escape key press to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && onClose) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-y-auto">
      {/* Dark Blurred Backdrop Overlay */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity duration-500 ease-out"
        onClick={onClose}
      />

      {/* Modal Dialog Container */}
      <div className="relative z-10 w-full max-w-[1200px] bg-white rounded-none shadow-2xl overflow-hidden flex flex-col md:flex-row my-auto animate-modal-appear border border-neutral-800/20">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2.5 text-neutral-400 hover:text-black bg-white/80 backdrop-blur-sm rounded-full transition-all duration-200 hover:bg-neutral-100 focus:outline-none"
          aria-label="Close Modal"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Left Side (50% Desktop): Editorial Image */}
        <EditorialHeroSection />

        {/* Right Side (50% Desktop): Registration Form */}
        <RegisterForm
          onSubmitSuccess={onSubmitSuccess}
          onSignInClick={onSignInClick}
        />
      </div>
    </div>
  );
};
