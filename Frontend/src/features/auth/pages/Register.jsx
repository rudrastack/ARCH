// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Navigate } from 'react-router';


// const Register = () => {
//     const { handleRegister } = useAuth();
//     const navigate = useNavigate();

//     const [formData, setFormData] = useState({
//         fullName: '',
//         contactNumber: '',
//         email: '',
//         password: '',
//         isSeller: false
//     });

//     const handleChange = (e) => {
//         const { name, value, type, checked } = e.target;
//         setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         await handleRegister({
//             email: formData.email,
//             contact: formData.contactNumber,
//             password: formData.password,
//             isSeller: formData.isSeller,
//             fullname: formData.fullName
//         });
//         navigate("/");
//     };



//     return()
//   }
// // ==========================================
// // Subcomponent: FloatingInput
// // ==========================================
// function FloatingInput({
//   id,
//   name,
//   type = 'text',
//   label,
//   value,
//   onChange,
//   required = false,
//   autoComplete, 
//   error,
// }) {
//   const [isFocused, setIsFocused] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);

//   const isPassword = type === 'password';
//   const effectiveType = isPassword ? (showPassword ? 'text' : 'password') : type;
//   const isFloating = isFocused || (value && value.toString().length > 0);

//   return (
//     <div className="relative pt-4 pb-1 group">
//       <input
//         id={id || name}
//         name={name}
//         type={effectiveType}
//         value={value}
//         onChange={onChange}
//         onFocus={() => setIsFocused(true)}
//         onBlur={() => setIsFocused(false)}
//         required={required}
//         autoComplete={autoComplete}
//         className={`w-full bg-transparent text-black text-sm tracking-wide py-2 pr-8 focus:outline-none border-b transition-colors duration-300 ${
//           error
//             ? 'border-red-500'
//             : isFocused
//             ? 'border-black'
//             : 'border-neutral-300 hover:border-neutral-400'
//         }`}
//       />

//       <label
//         htmlFor={id || name}
//         className={`absolute left-0 pointer-events-none transition-all duration-300 ease-out font-sans-editorial ${
//           isFloating
//             ? 'top-0 text-[10px] tracking-widest uppercase font-medium text-neutral-500'
//             : 'top-6 text-xs tracking-wider text-neutral-400 font-normal'
//         }`}
//       >
//         {label} {required && <span className="text-black font-semibold">*</span>}
//       </label>

//       {isPassword && (
//         <button
//           type="button"
//           onClick={() => setShowPassword(!showPassword)}
//           className="absolute right-0 top-6 text-neutral-400 hover:text-black transition-colors focus:outline-none"
//           aria-label={showPassword ? 'Hide password' : 'Show password'}
//         >
//           {showPassword ? (
//             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={1.5}
//                 d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-5.908a10.04 10.04 0 012.122-.363c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21f-9 9 0 00-9-9"
//               />
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={1.5}
//                 d="M3 3l18 18"
//               />
//             </svg>
//           ) : (
//             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={1.5}
//                 d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
//               />
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={1.5}
//                 d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
//               />
//             </svg>
//           )}
//         </button>
//       )}

//       <span
//         className={`absolute bottom-1 left-0 h-[1.5px] bg-black transition-all duration-300 ${
//           isFocused ? 'w-full' : 'w-0'
//         }`}
//       />
//     </div>
//   );
// }

// // ==========================================
// // Subcomponent: RoleSelector
// // ==========================================
// function RoleSelector({ selectedRole, onChange }) {
//   const roles = [
//     {
//       id: 'buyer',
//       title: 'Buyer',
//       description: 'Access curated haute couture and exclusive drops',
//     },
//     {
//       id: 'seller',
//       title: 'Seller',
//       description: 'Showcase luxury pieces to global connoisseurs',
//     },
//   ];

//   return (
//     <div className="space-y-2 my-6">
//       <div className="flex items-center justify-between">
//         <label className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-medium font-sans-editorial">
//           Select Account Role
//         </label>
//         <span className="text-[10px] tracking-wider text-neutral-400 font-light">
//           Required
//         </span>
//       </div>

//       <div className="grid grid-cols-2 gap-3">
//         {roles.map((role) => {
//           const isSelected = selectedRole === role.id;
//           return (
//             <button
//               key={role.id}
//               type="button"
//               onClick={() => onChange(role.id)}
//               className={`group relative text-left p-4 transition-all duration-300 border ${
//                 isSelected
//                   ? 'border-black bg-neutral-900 text-white shadow-sm'
//                   : 'border-neutral-200 bg-white text-neutral-800 hover:border-neutral-400'
//               }`}
//             >
//               <div className="flex items-center justify-between mb-1.5">
//                 <span
//                   className={`text-xs font-semibold tracking-widest uppercase transition-colors ${
//                     isSelected ? 'text-white' : 'text-neutral-900'
//                   }`}
//                 >
//                   {role.title}
//                 </span>

//                 <div
//                   className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all duration-300 ${
//                     isSelected
//                       ? 'border-white bg-white'
//                       : 'border-neutral-300 group-hover:border-neutral-500'
//                   }`}
//                 >
//                   {isSelected && (
//                     <div className="w-1.5 h-1.5 rounded-full bg-black" />
//                   )}
//                 </div>
//               </div>

//               <p
//                 className={`text-[11px] leading-snug transition-colors line-clamp-2 ${
//                   isSelected ? 'text-neutral-300 font-light' : 'text-neutral-500'
//                 }`}
//               >
//                 {role.description}
//               </p>
//             </button>
//           );
//         })}
//       </div>
//     </div>
//   );
// }

// // ==========================================
// // Subcomponent: EditorialHeroSection
// // ==========================================
// function EditorialHeroSection() {
//   return (
//     <div className="relative hidden md:flex md:w-1/2 bg-black flex-col justify-between overflow-hidden min-h-[640px]">
//       <img
//         src="/assets/arks_editorial_hero.png"
//         alt="ARKS High Fashion Editorial"
//         className="absolute inset-0 w-full h-full object-cover object-center grayscale contrast-125 opacity-90 transition-transform duration-1000 ease-out hover:scale-105"
//       />

//       <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/40 pointer-events-none" />

//       <div className="relative z-10 p-8 lg:p-10 flex justify-between items-start">
//         <div className="flex items-center space-x-3">
//           <span className="h-px w-8 bg-white/70" />
//           <span className="text-white text-xs font-semibold tracking-[0.35em] uppercase font-sans-editorial">
//             ARKS MONOCHROME
//           </span>
//         </div>
//         <span className="text-[10px] text-neutral-300 tracking-[0.25em] uppercase border border-white/20 px-2.5 py-1 backdrop-blur-md">
//           SS/26
//         </span>
//       </div>

//       <div className="relative z-10 p-8 lg:p-10 my-auto text-white space-y-3 max-w-md">
//         <p className="text-[11px] uppercase tracking-[0.3em] text-neutral-300 font-light">
//           Editorial Access Only
//         </p>
//         <h2 className="text-3xl lg:text-4xl font-serif-editorial italic font-normal leading-tight tracking-wide text-white">
//           "Elegance is not standing out, but being remembered."
//         </h2>
//       </div>

//       <div className="relative z-10 p-8 lg:p-10 flex justify-between items-end text-neutral-400 text-[10px] tracking-[0.2em] uppercase border-t border-white/10">
//         <div>
//           <span className="block text-white font-medium">Curated Collections</span>
//           <span className="text-neutral-400">Paris &bull; Milan &bull; Tokyo</span>
//         </div>
//         <span className="font-mono text-white/50">01 &mdash; 02</span>
//       </div>
//     </div>
//   );
// }

// // ==========================================
// // Subcomponent: RegisterForm
// // ==========================================
// function RegisterForm({ onSubmitSuccess, onSignInClick }) {
//   const [formData, setFormData] = useState({
//     fullname: '',
//     email: '',
//     contact: '',
//     password: '',
//     role: 'buyer',
//   });

//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [error, setError] = useState(null);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleRoleChange = (role) => {
//     setFormData((prev) => ({
//       ...prev,
//       role,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     setError(null);

//     const payload = {
//       email: formData.email,
//       password: formData.password,
//       fullname: formData.fullname,
//       contact: formData.contact,
//       isSeller: formData.role === 'seller',
//     };

//     try {
//       const response = await axios.post(
//         'http://localhost:3000/api/auth/register',
//         payload,
//         { withCredentials: true }
//       );

//       if (response.data && response.data.success) {
//         if (onSubmitSuccess) {
//           onSubmitSuccess(response.data.user);
//         }
//       } else {
//         setError(response.data?.message || 'Registration failed.');
//       }
//     } catch (err) {
//       console.error('Error during registration API call:', err);
//       setError(
//         err.response?.data?.message ||
//           err.message ||
//           'An error occurred during registration.'
//       );
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="w-full md:w-1/2 bg-white p-8 sm:p-10 lg:p-14 flex flex-col justify-between overflow-y-auto">
//       <div>
//         <div className="flex justify-between items-center mb-8">
//           <span className="text-2xl font-bold tracking-[0.35em] text-black font-serif-editorial uppercase">
//             ARKS
//           </span>
//           <span className="text-[10px] uppercase tracking-[0.25em] text-neutral-400 font-sans-editorial">
//             Membership
//           </span>
//         </div>

//         <div className="space-y-2 mb-8">
//           <h1 className="text-2xl sm:text-3xl font-light text-black tracking-tight font-serif-editorial">
//             Become Part of the Community
//           </h1>
//           <p className="text-xs text-neutral-500 font-light leading-relaxed font-sans-editorial">
//             Create your account to access exclusive collections and member benefits.
//           </p>
//         </div>

//         {error && (
//           <div className="mb-6 p-4 bg-red-50 text-red-600 border border-red-200 text-xs font-sans-editorial">
//             <div className="font-semibold uppercase tracking-wider text-[10px] mb-1">
//               Registration Error
//             </div>
//             {error}
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <FloatingInput
//             id="fullname"
//             name="fullname"
//             type="text"
//             label="Full Name"
//             value={formData.fullname}
//             onChange={handleChange}
//             required
//             autoComplete="name"
//           />

//           <FloatingInput
//             id="email"
//             name="email"
//             type="email"
//             label="Email Address"
//             value={formData.email}
//             onChange={handleChange}
//             required
//             autoComplete="email"
//           />

//           <FloatingInput
//             id="contact"
//             name="contact"
//             type="tel"
//             label="Contact Number"
//             value={formData.contact}
//             onChange={handleChange}
//             required
//             autoComplete="tel"
//           />

//           <FloatingInput
//             id="password"
//             name="password"
//             type="password"
//             label="Password"
//             value={formData.password}
//             onChange={handleChange}
//             required
//             autoComplete="new-password"
//           />

//           <RoleSelector
//             selectedRole={formData.role}
//             onChange={handleRoleChange}
//           />

//           <button
//             type="submit"
//             disabled={isSubmitting}
//             className="w-full mt-6 relative group overflow-hidden bg-black text-white py-4 text-xs font-semibold tracking-[0.25em] uppercase transition-all duration-300 hover:bg-neutral-800 active:scale-[0.99] disabled:opacity-70 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
//           >
//             <span className="relative z-10 flex items-center justify-center space-x-2">
//               {isSubmitting ? (
//                 <>
//                   <svg
//                     className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                   >
//                     <circle
//                       className="opacity-25"
//                       cx="12"
//                       cy="12"
//                       r="10"
//                       stroke="currentColor"
//                       strokeWidth="4"
//                     />
//                     <path
//                       className="opacity-75"
//                       fill="currentColor"
//                       d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                     />
//                   </svg>
//                   <span>Processing...</span>
//                 </>
//               ) : (
//                 <>
//                   <span>Create Account</span>
//                   <svg
//                     className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={1.5}
//                       d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
//                     />
//                   </svg>
//                 </>
//               )}
//             </span>
//             <div className="absolute inset-0 bg-neutral-900 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
//           </button>
//         </form>
//       </div>

//       <div className="mt-8 pt-6 border-t border-neutral-100 text-center">
//         <p className="text-xs text-neutral-500 font-light font-sans-editorial">
//           Already have an account?{' '}
//           <button
//             type="button"
//             onClick={onSignInClick}
//             className="text-black font-semibold tracking-wider hover:underline underline-offset-4 uppercase ml-1 transition-all"
//           >
//             Sign In
//           </button>
//         </p>
//       </div>
//     </div>
//   );
// }

// // ==========================================
// // Subcomponent: RegisterModal
// // ==========================================
// function RegisterModal({
//   isOpen = true,
//   onClose,
//   onSubmitSuccess,
//   onSignInClick,
// }) {
//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       if (e.key === 'Escape' && onClose) {
//         onClose();
//       }
//     };
//     if (isOpen) {
//       window.addEventListener('keydown', handleKeyDown);
//       document.body.style.overflow = 'hidden';
//     }
//     return () => {
//       window.removeEventListener('keydown', handleKeyDown);
//       document.body.style.overflow = 'unset';
//     };
//   }, [isOpen, onClose]);

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-y-auto">
//       <div
//         className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity duration-500 ease-out"
//         onClick={onClose}
//       />

//       <div className="relative z-10 w-full max-w-[1200px] bg-white rounded-none shadow-2xl overflow-hidden flex flex-col md:flex-row my-auto border border-neutral-800/20">
//         <button
//           type="button"
//           onClick={onClose}
//           className="absolute top-4 right-4 z-30 p-2.5 text-neutral-400 hover:text-black bg-white/80 backdrop-blur-sm rounded-full transition-all duration-200 hover:bg-neutral-100 focus:outline-none"
//           aria-label="Close Modal"
//         >
//           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={1.5}
//               d="M6 18L18 6M6 6l12 12"
//             />
//           </svg>
//         </button>

//         <EditorialHeroSection />

//         <RegisterForm
//           onSubmitSuccess={onSubmitSuccess}
//           onSignInClick={onSignInClick}
//         />
//       </div>
//     </div>
//   );
// }

// // ==========================================
// // Main Exported Component: RegisterPage
// // ==========================================
// export function RegisterPage() {
//   const [isModalOpen, setIsModalOpen] = useState(true);
//   const [submittedData, setSubmittedData] = useState(null);


//   const handleSubmitSuccess = (user) => {
//     console.log('Submitted Register Payload:', user);
//     setSubmittedData(user);
//     setIsModalOpen(false);
//   };

//   const handleSignInClick = (e) => {
//     e.preventDefault();

//   };

//   return (
//     <div className="min-h-screen bg-neutral-950 text-white font-sans-editorial flex flex-col justify-between selection:bg-white selection:text-black">
//       {/* Background Subtle Editorial Grid Header */}
//       <header className="border-b border-neutral-800/80 px-6 py-5 flex items-center justify-between backdrop-blur-md sticky top-0 z-40 bg-neutral-950/90">
//         <div className="flex items-center space-x-4">
//           <span className="text-xl font-bold tracking-[0.4em] uppercase font-serif-editorial text-white">
//             ARKS
//           </span>
//           <span className="text-[9px] uppercase tracking-[0.2em] px-2 py-0.5 border border-neutral-700 text-neutral-400">
//             Luxury Haute Couture
//           </span>
//         </div>

//         <nav className="flex items-center space-x-6 text-xs tracking-[0.2em] uppercase font-light text-neutral-300">
//           <span className="hover:text-white transition-colors cursor-pointer hidden sm:inline">
//             Collections
//           </span>
//           <span className="hover:text-white transition-colors cursor-pointer hidden sm:inline">
//             Editorial
//           </span>
//           <button
//             type="button"
//             onClick={() => setIsModalOpen(true)}
//             className="px-5 py-2.5 bg-white text-black font-medium tracking-[0.2em] hover:bg-neutral-200 transition-all text-[11px] uppercase cursor-pointer"
//           >
//             Open Register Modal
//           </button>
//         </nav>
//       </header>

//       {/* Main Hero Background Showcase when Modal is closed */}
//       <main className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-4xl mx-auto space-y-6">
//         <span className="text-xs uppercase tracking-[0.3em] text-neutral-400 font-light">
//           Autumn / Winter 2026 Collection
//         </span>
//         <h1 className="text-4xl sm:text-6xl font-serif-editorial italic font-normal tracking-wide leading-tight">
//           Where Minimalism Meets Haute Couture
//         </h1>
//         <p className="text-sm text-neutral-400 max-w-xl font-light leading-relaxed">
//           Experience timeless fashion, curated drops, and bespoke member privileges. Join our exclusive global community of buyers and sellers.
//         </p>

//         <div className="pt-4 flex flex-col sm:flex-row gap-4">
//           <button
//             type="button"
//             onClick={() => setIsModalOpen(true)}
//             className="px-8 py-4 bg-white text-black font-semibold text-xs tracking-[0.25em] uppercase hover:bg-neutral-200 transition-all shadow-lg cursor-pointer"
//           >
//             Join ARKS Community
//           </button>
//         </div>

//         {/* Console Log Output Panel */}
//         {submittedData && (
//           <div className="mt-12 w-full text-left bg-neutral-900 border border-neutral-800 p-6 rounded-none space-y-3">
//             <div className="flex items-center justify-between text-xs tracking-widest text-neutral-400 uppercase">
//               <span>Last Form Submitted Payload (User details from backend)</span>
//               <span className="text-[10px] text-green-400 font-bold uppercase tracking-wider">Registered Successfully</span>
//             </div>
//             <pre className="text-xs font-mono text-neutral-200 bg-black p-4 overflow-x-auto border border-neutral-800">
//               {JSON.stringify(submittedData, null, 2)}
//             </pre>
//           </div>
//         )}
//       </main>

//       {/* Footer */}
//       <footer className="border-t border-neutral-900 px-6 py-6 text-center text-[10px] uppercase tracking-[0.25em] text-neutral-500">
//         &copy; 2026 ARKS Luxury House. All Rights Reserved.
//       </footer>

//       {/* Controlled Register Modal Component */}
//       <RegisterModal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         onSubmitSuccess={handleSubmitSuccess}
//         onSignInClick={handleSignInClick}
//       />
//     </div>
//   );
// }
import { useState } from "react";
import { useNavigate } from "react-router";
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
      await handleRegister({
        email: formData.email,
        password: formData.password,
        fullname: formData.fullName,
        contact: formData.contactNumber,
        isSeller: formData.isSeller,
      });

      navigate("/");
    } catch (err) {
      console.error("Registration failed:", err);
    }
  };

  const inputStyle = {
    color: "#1b1c1a",
    borderBottom: "1px solid #d0c5b5",
    fontFamily: "'Inter', sans-serif",
  };

  const handleFocus = (e) => {
    e.target.style.borderBottomColor = "#C9A96E";
  };

  const handleBlur = (e) => {
    e.target.style.borderBottomColor = "#d0c5b5";
  };


  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap"
        rel="stylesheet"
      />

      <div
        className="min-h-screen flex flex-col lg:flex-row selection:bg-[#C9A96E]/30"
        style={{
          backgroundColor: "#fbf9f6",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        {/* Left Section */}
        <div
          className="hidden lg:flex lg:w-1/2 relative overflow-hidden"
          style={{ backgroundColor: "#f5f3f0" }}
        >
          <img
            src="/snitch_editorial_warm.png"
            alt="Fashion Editorial"
            className="absolute inset-0 w-full h-full object-cover object-top"
            style={{ filter: "brightness(0.97)" }}
          />

          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(27,24,20,0.62) 0%, rgba(27,24,20,0.08) 45%, transparent 100%)",
            }}
          />

          <div className="absolute inset-0 p-14 flex flex-col justify-between z-10">
            <span
              className="text-sm font-medium tracking-[0.35em] uppercase"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                color: "#C9A96E",
              }}
            >
              Snitch.
            </span>

            <div>
              <p
                className="text-5xl xl:text-6xl font-light leading-[1.08] text-white mb-5"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                }}
              >
                Define your
                <br />
                <em>aesthetic.</em>
              </p>

              <p
                className="text-sm font-light leading-relaxed max-w-xs"
                style={{ color: "rgba(255,255,255,0.65)" }}
              >
                Join the exclusive movement of creators and brands redefining
                the modern fashion landscape.
              </p>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div
          className="w-full lg:w-1/2 flex items-center justify-center min-h-screen px-8 sm:px-14 lg:px-20 py-16 overflow-y-auto"
          style={{ backgroundColor: "#fbf9f6" }}
        >
          <div className="w-full max-w-sm">

            <div className="lg:hidden mb-14">
              <span
                className="text-sm tracking-[0.35em] uppercase"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  color: "#C9A96E",
                }}
              >
                Snitch.
              </span>
            </div>

            <div className="mb-12">
              <p
                className="text-[10px] uppercase tracking-[0.22em] mb-4 font-medium"
                style={{ color: "#C9A96E" }}
              >
                Welcome to Snitch
              </p>

              <h1
                className="text-[2.6rem] xl:text-5xl font-light leading-[1.1]"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  color: "#1b1c1a",
                }}
              >
                Elevate Your Style
              </h1>
            </div>

            {error && (
              <div className="mb-5 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-9">
              {/* Full Name */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="reg-fullName"
                  className="text-[10px] uppercase tracking-[0.18em] font-medium"
                  style={{ color: "#7A6E63" }}
                >
                  Full Name
                </label>

                <input
                  id="reg-fullName"
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  required
                  placeholder="e.g. John Doe"
                  className="w-full bg-transparent outline-none py-3 text-sm transition-colors duration-300"
                  style={inputStyle}
                />
              </div>

              {/* Contact */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="reg-contact"
                  className="text-[10px] uppercase tracking-[0.18em] font-medium"
                  style={{ color: "#7A6E63" }}
                >
                  Contact Number
                </label>

                <input
                  id="reg-contact"
                  type="tel"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  required
                  placeholder="+91 98765 43210"
                  className="w-full bg-transparent outline-none py-3 text-sm transition-colors duration-300"
                  style={inputStyle}
                />
              </div>

              {/* Email */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="reg-email"
                  className="text-[10px] uppercase tracking-[0.18em] font-medium"
                  style={{ color: "#7A6E63" }}
                >
                  Email Address
                </label>

                <input
                  id="reg-email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  required
                  placeholder="hello@example.com"
                  className="w-full bg-transparent outline-none py-3 text-sm transition-colors duration-300"
                  style={inputStyle}
                />
              </div>

              {/* Password */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="reg-password"
                  className="text-[10px] uppercase tracking-[0.18em] font-medium"
                  style={{ color: "#7A6E63" }}
                >
                  Password
                </label>

                <input
                  id="reg-password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  required
                  placeholder="••••••••"
                  className="w-full bg-transparent outline-none py-3 text-sm transition-colors duration-300"
                  style={inputStyle}
                />
              </div>

              {/* Seller Checkbox */}
              <label
                htmlFor="reg-isSeller"
                className="flex items-center gap-4 cursor-pointer"
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
                      borderColor: formData.isSeller
                        ? "#C9A96E"
                        : "#d0c5b5",
                      backgroundColor: formData.isSeller
                        ? "#C9A96E"
                        : "transparent",
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
                  className="text-[11px] uppercase tracking-[0.15em]"
                  style={{
                    color: formData.isSeller ? "#C9A96E" : "#7A6E63",
                  }}
                >
                  Register as Seller
                </span>
              </label>


              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 text-[11px] uppercase tracking-[0.25em] font-medium transition-all duration-300 mt-2 disabled:opacity-60"
                style={{
                  backgroundColor: "#1b1c1a",
                  color: "#fbf9f6",
                }}
              >
                {loading ? "Creating Account..." : "Sign Up"}
              </button>

              <div className="flex items-center gap-4">
                <div
                  className="flex-1 h-px"
                  style={{ backgroundColor: "#e4e2df" }}
                />
                <span
                  className="text-[10px] uppercase tracking-[0.15em]"
                  style={{ color: "#B5ADA3" }}
                >
                  or
                </span>
                <div
                  className="flex-1 h-px"
                  style={{ backgroundColor: "#e4e2df" }}
                />
              </div>

              <ContinueWithGoogle />
              <p
                className="text-center text-[11px]"
                style={{ color: "#B5ADA3" }}
              >
                Already have an account?{" "}
                <span
                  onClick={() => navigate("/login")}
                  className="cursor-pointer underline underline-offset-4"
                  style={{ color: "#7A6E63" }}
                >
                  Sign in
                </span>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;