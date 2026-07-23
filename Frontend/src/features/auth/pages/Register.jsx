// import React, { useState } from 'react';
// import { RegisterModal } from '../components/RegisterModal';
// import { useAuth } from '../hooks/useAuth';



// export default function RegisterPage() {
//   const [isModalOpen, setIsModalOpen] = useState(true);
//   const [submittedData, setSubmittedData] = useState(null);

//   const handleSubmitSuccess = (data) => {
//     console.log('Submitted Register Payload:', data);
//     setSubmittedData(data);
//   };

//   const handleSignInClick = () => {
//     alert('Redirecting to ARKS Sign In modal / page...');
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
//             className="px-5 py-2.5 bg-white text-black font-medium tracking-[0.2em] hover:bg-neutral-200 transition-all text-[11px] uppercase"
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
//             className="px-8 py-4 bg-white text-black font-semibold text-xs tracking-[0.25em] uppercase hover:bg-neutral-200 transition-all shadow-lg"
//           >
//             Join ARKS Community
//           </button>
//         </div>

//         {/* Console Log Output Panel */}
//         {submittedData && (
//           <div className="mt-12 w-full text-left bg-neutral-900 border border-neutral-800 p-6 rounded-none space-y-3">
//             <div className="flex items-center justify-between text-xs tracking-widest text-neutral-400 uppercase">
//               <span>Last Form Submitted Payload</span>
//               <span className="text-[10px] text-green-400">Validated</span>
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
