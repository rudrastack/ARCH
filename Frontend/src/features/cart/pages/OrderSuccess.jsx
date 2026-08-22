import React, { useState, useMemo } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function OrderSuccess() {
    const location = useLocation();
    const navigate = useNavigate();
    const user = useSelector(state => state.auth?.user);

    const [copied, setCopied] = useState(false);
    const [supportModal, setSupportModal] = useState(false);

    // Read order ID from query params
    const queryParams = new URLSearchParams(location.search);
    const rawOrderId = queryParams.get("order_id") || queryParams.get("orderId");
    const orderId = rawOrderId || `ARCH-${Math.floor(100000 + Math.random() * 900000)}`;

    // Calculate delivery window 
    const deliveryDates = useMemo(() => {
        const today = new Date();
        const start = new Date(today);
        start.setDate(today.getDate() + 3);
        const end = new Date(today);
        end.setDate(today.getDate() + 5);

        const options = { month: 'long', day: 'numeric', year: 'numeric' };
        return {
            start: start.toLocaleDateString('en-US', options),
            end: end.toLocaleDateString('en-US', options),
        };
    }, []);

    const handleCopyId = () => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(orderId);
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="min-h-screen bg-[#fbf9f6] text-[#1b1c1a] font-sans pb-24 selection:bg-[#C9A96E]/30">
            <style>{`
                @media print {
                    header, footer, .no-print {
                        display: none !important;
                    }
                    body, .min-h-screen {
                        background: #ffffff !important;
                        padding: 0 !important;
                    }
                    .print-card {
                        box-shadow: none !important;
                        border: 1px solid #ddd !important;
                    }
                }
            `}</style>

            <main className="pt-24 md:pt-28 px-4 sm:px-6 md:px-12 lg:px-20 max-w-[1440px] mx-auto">

                {/* Top Atelier Badge & Header */}
                <div className="max-w-4xl mx-auto text-center mb-12 sm:mb-16">
                    <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#0a192f] text-[#C9A96E] mb-6 shadow-md">
                        <span className="material-symbols-outlined text-3xl sm:text-4xl font-light">
                            check
                        </span>
                    </div>

                    <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.35em] text-[#C9A96E] font-semibold block mb-3">
                        Transaction Completed &bull; Bespoke Allocation
                    </span>

                    <h1
                        className="text-3xl sm:text-5xl md:text-6xl font-light text-[#0a192f] leading-tight tracking-tight mb-4"
                        style={{ fontFamily: "'Cormorant Garamond', serif" }}
                    >
                        A masterpiece from our <br className="hidden sm:inline" />
                        <span className="italic">Atelier</span> is reserved for you.
                    </h1>

                    <p className="text-xs sm:text-sm text-[#7A6E63] max-w-lg mx-auto font-light leading-relaxed">
                        We have registered your bespoke couture reservation. Our master artisans are now commencing inspection and tailored preparation.
                    </p>
                </div>

                {/* Main Content Two-Column Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 max-w-6xl mx-auto items-start">

                    {/* Left Column (7 cols): Order ID, Progress Timeline, Details */}
                    <div className="lg:col-span-7 space-y-6 sm:space-y-8">

                        {/* Order Reference Card */}
                        <div className="bg-white border border-[#e4e2df] rounded-2xl p-6 sm:p-8 shadow-xs print-card">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#e4e2df]">
                                <div>
                                    <span className="text-[10px] uppercase tracking-widest text-[#7A6E63] font-medium block mb-1">
                                        Official Order Reference
                                    </span>
                                    <p
                                        className="text-2xl sm:text-3xl font-medium text-[#745a27] tracking-wider [word-wrap:break-word] max-w-[14rem]"
                                        style={{ fontFamily: "'Cormorant Garamond', serif", }}
                                    >
                                        #{orderId}
                                    </p>
                                </div>

                                <div className="flex items-center gap-2 no-print">
                                    <button
                                        type="button"
                                        onClick={handleCopyId}
                                        className="inline-flex items-center gap-1.5 px-4 py-2 border border-[#d0c5b5] hover:border-[#745a27] rounded-lg text-xs uppercase tracking-wider font-semibold text-[#1b1c1a] bg-[#fbf9f6] transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-base">
                                            {copied ? "done" : "content_copy"}
                                        </span>
                                        {copied ? "Copied" : "Copy Reference"}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={handlePrint}
                                        className="inline-flex items-center gap-1.5 px-4 py-2 border border-[#d0c5b5] hover:border-[#0a192f] rounded-lg text-xs uppercase tracking-wider font-semibold text-[#0a192f] bg-white transition-colors"
                                        title="Print Official Order Receipt"
                                    >
                                        <span className="material-symbols-outlined text-base">
                                            print
                                        </span>
                                        <span className="hidden sm:inline">Print Receipt</span>
                                    </button>
                                </div>
                            </div>

                            {/* Atelier Progress Tracker */}
                            <div className="pt-6 space-y-5">
                                <span className="text-[10px] uppercase tracking-widest text-[#7A6E63] font-semibold block">
                                    Atelier Fulfillment Journey
                                </span>

                                <div className="space-y-4">
                                    {/* Step 1: Confirmed */}
                                    <div className="flex items-start gap-4">
                                        <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center flex-shrink-0 text-sm shadow-xs">
                                            ✓
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-center">
                                                <h4 className="text-xs sm:text-sm font-semibold text-[#0a192f]">
                                                    Order Confirmed & Payment Verified
                                                </h4>
                                                <span className="text-[10px] uppercase tracking-wider font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                                                    Complete
                                                </span>
                                            </div>
                                            <p className="text-[11px] text-[#7A6E63] mt-0.5">
                                                Secured via encrypted 256-bit gateway.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Step 2: Curation */}
                                    <div className="flex items-start gap-4">
                                        <div className="w-8 h-8 rounded-full bg-[#C9A96E] text-[#0a192f] flex items-center justify-center flex-shrink-0 text-xs font-bold shadow-xs">
                                            2
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-center">
                                                <h4 className="text-xs sm:text-sm font-semibold text-[#0a192f]">
                                                    Atelier Inspection & Bespoke Packaging
                                                </h4>
                                                <span className="text-[10px] uppercase tracking-wider font-medium text-[#745a27] bg-[#ffdea6]/60 px-2 py-0.5 rounded animate-pulse">
                                                    In Progress
                                                </span>
                                            </div>
                                            <p className="text-[11px] text-[#7A6E63] mt-0.5">
                                                Garment finishing and signature preservation box packaging.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Step 3: Dispatch */}
                                    <div className="flex items-start gap-4">
                                        <div className="w-8 h-8 rounded-full bg-[#f5f3f0] text-[#7A6E63] border border-[#e4e2df] flex items-center justify-center flex-shrink-0 text-xs font-medium">
                                            3
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-center">
                                                <h4 className="text-xs sm:text-sm font-medium text-[#7A6E63]">
                                                    White-Glove Courier Dispatch
                                                </h4>
                                                <span className="text-[10px] text-[#7A6E63]">
                                                    Estimated {deliveryDates.start}
                                                </span>
                                            </div>
                                            <p className="text-[11px] text-[#7A6E63] mt-0.5">
                                                Insured express direct flight tracking.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Step 4: Delivery */}
                                    <div className="flex items-start gap-4">
                                        <div className="w-8 h-8 rounded-full bg-[#f5f3f0] text-[#7A6E63] border border-[#e4e2df] flex items-center justify-center flex-shrink-0 text-xs font-medium">
                                            4
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-center">
                                                <h4 className="text-xs sm:text-sm font-medium text-[#7A6E63]">
                                                    Hand-Delivered to Your Residence
                                                </h4>
                                                <span className="text-[10px] text-[#7A6E63]">
                                                    {deliveryDates.end}
                                                </span>
                                            </div>
                                            <p className="text-[11px] text-[#7A6E63] mt-0.5">
                                                Signature required upon private handover.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Member & Courier Details Card */}
                        <div className="bg-white border border-[#e4e2df] rounded-2xl p-6 sm:p-8 shadow-xs print-card">
                            <h3
                                className="text-xl font-light text-[#0a192f] mb-4 pb-3 border-b border-[#e4e2df]"
                                style={{ fontFamily: "'Cormorant Garamond', serif" }}
                            >
                                Dispatch Destination & Member File
                            </h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
                                <div>
                                    <span className="text-[10px] uppercase tracking-wider text-[#7A6E63] font-semibold block mb-1">
                                        Recipient Details
                                    </span>
                                    <p className="font-semibold text-sm text-[#0a192f]">
                                        {user?.fullname || "Esteemed ARCH Club Member"}
                                    </p>
                                    <p className="text-[#7A6E63] mt-1">
                                        {user?.email || "Registered Email on File"}
                                    </p>
                                    {user?.contact && (
                                        <p className="text-[#7A6E63] mt-0.5">
                                            {user.contact}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <span className="text-[10px] uppercase tracking-wider text-[#7A6E63] font-semibold block mb-1">
                                        Delivery Mode
                                    </span>
                                    <p className="font-semibold text-sm text-[#0a192f]">
                                        Complimentary White-Glove Express
                                    </p>
                                    <p className="text-[#7A6E63] mt-1">
                                        Climate-controlled garment freight with tamper-evident seal.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column (5 cols): Actions, Summary & Concierge */}
                    <div className="lg:col-span-5 space-y-6">

                        {/* Estimated Arrival Box */}
                        <div className="bg-[#f5f3f0] border border-[#e4e2df] rounded-2xl p-6 sm:p-8 print-card">
                            <span className="text-[10px] uppercase tracking-widest text-[#C9A96E] font-semibold block mb-2">
                                Estimated Handover Window
                            </span>
                            <h3
                                className="text-2xl sm:text-3xl font-light text-[#0a192f] mb-3"
                                style={{ fontFamily: "'Cormorant Garamond', serif" }}
                            >
                                {deliveryDates.start} — {deliveryDates.end}
                            </h3>
                            <p className="text-xs text-[#7A6E63] font-light leading-relaxed">
                                Live courier tracking links and flight dispatch notifications will be transmitted to your registered email upon packaging seal verification.
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-3 no-print">
                            <Link
                                to="/collection"
                                className="block w-full py-4 text-center text-xs uppercase tracking-[0.2em] font-semibold bg-[#0a192f] text-white hover:bg-[#C9A96E] hover:text-[#0a192f] transition-all duration-300 shadow-xs"
                            >
                                Continue Exploring The Vault
                            </Link>

                            <Link
                                to="/"
                                className="block w-full py-3.5 text-center text-xs uppercase tracking-[0.2em] font-semibold bg-white border border-[#0a192f] text-[#0a192f] hover:bg-[#f5f3f0] transition-colors"
                            >
                                Return to Atelier Home
                            </Link>

                            <button
                                type="button"
                                onClick={() => setSupportModal(true)}
                                className="block w-full py-3 text-center text-xs uppercase tracking-[0.15em] font-medium text-[#7A6E63] hover:text-[#0a192f] transition-colors"
                            >
                                Need Concierge Assistance?
                            </button>
                        </div>

                        {/* Concierge Guarantee Card */}
                        <div className="bg-white border border-[#e4e2df] p-6 rounded-2xl space-y-3 text-[11px] text-[#7A6E63] print-card">
                            <div className="flex items-center gap-2 text-[#0a192f] font-semibold uppercase tracking-wider text-xs">
                                <span className="material-symbols-outlined text-[#C9A96E] text-base">
                                    workspace_premium
                                </span>
                                <span>The ARCH Atelier Guarantee</span>
                            </div>
                            <p className="leading-relaxed">
                                Every garment is numbered and archived under the ARCH Maison registry. Includes complimentary tailoring consultation and 30-day seamless exchange privileges.
                            </p>
                        </div>

                    </div>
                </div>
            </main>

            {/* Concierge Support Modal */}
            {supportModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        onClick={() => setSupportModal(false)}
                        className="fixed inset-0 bg-[#1b1c1a]/60 backdrop-blur-xs transition-opacity"
                    />
                    <div className="relative bg-white border border-[#e4e2df] rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl z-10 space-y-5">
                        <div className="flex justify-between items-start">
                            <div>
                                <span className="text-[10px] uppercase tracking-widest text-[#C9A96E] font-semibold block mb-1">
                                    Private Client Services
                                </span>
                                <h3
                                    className="text-2xl font-light text-[#0a192f]"
                                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                                >
                                    ARCH Atelier Concierge
                                </h3>
                            </div>
                            <button
                                onClick={() => setSupportModal(false)}
                                className="p-1 text-[#7A6E63] hover:text-[#0a192f]"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <p className="text-xs text-[#7A6E63] leading-relaxed">
                            Our private concierge is available 24/7 for size alteration adjustments, delivery scheduling, or bespoke requests.
                        </p>

                        <div className="bg-[#fbf9f6] border border-[#e4e2df] rounded-xl p-4 space-y-3 text-xs">
                            <div className="flex items-center gap-2.5">
                                <span className="material-symbols-outlined text-[#C9A96E] text-base">mail</span>
                                <span className="font-semibold text-[#0a192f]">concierge@arch.club</span>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <span className="material-symbols-outlined text-[#C9A96E] text-base">call</span>
                                <span className="font-semibold text-[#0a192f]">+91 (800) 845-ARCH</span>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => setSupportModal(false)}
                            className="w-full py-3 bg-[#0a192f] text-white text-xs uppercase tracking-widest font-semibold hover:bg-[#C9A96E] hover:text-[#0a192f] transition-colors"
                        >
                            Done
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}