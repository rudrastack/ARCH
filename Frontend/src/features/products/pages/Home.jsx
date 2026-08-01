import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useProduct } from "../hook/useProduct";
import { useAuth } from "../../auth/hook/useAuth";
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// ============================================================
// 1. MAIN HOME PAGE ORCHESTRATION
// ============================================================
export default function Home() {
    const { handleGetAllProducts } = useProduct();
    const user = useSelector((state) => state.auth.user);

    const [products, setProducts] = useState([]);
    const [navVisible, setNavVisible] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalTab, setModalTab] = useState('register');

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const data = await handleGetAllProducts();
                setProducts(data || []);
            } catch (err) {
                console.error('Failed to load products:', err);
            }
        };
        loadProducts();
    }, []);


    // Auto-trigger auth modal after 4 seconds if not logged in
    useEffect(() => {
        if (user) return;
        const timer = setTimeout(() => {
            setModalTab('register');
            setModalOpen(true);
        }, 4000);
        return () => clearTimeout(timer);
    }, [user]);

    // Initialize Lenis smooth scroll
    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            smoothWheel: true,
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);

        return () => {
            lenis.destroy();
        };
    }, []);

    const handleOpenAuth = (tab = 'register') => {
        setModalTab(tab);
        setModalOpen(true);
    };

    return (
        <div className="arks-landing bg-[#fbf9f6] text-[#1b1c1a] min-h-screen selection:bg-[#C9A96E]/30 select-none">
            {/* 1. Mouse Follower */}
            <MouseFollower />

            {/* 2. Gate Opening Intro Overlay with Netflix-Style Zooming Logo */}
            <IntroOverlay onComplete={() => setNavVisible(true)} />

            {/* 3. Navigation Bar */}
            <Navbar visible={navVisible} onOpenAuth={handleOpenAuth} user={user} />

            {/* 4. Hero Section with Video Loop 1 (Runway Fashion Catwalk) */}
            <HeroSection />

            {/* 5. Model Shoot Section with Video Loop 2 (Atelier Posing Motion) */}
            <ModelShootSection />

            {/* 6. Featured Products Collection */}
            <FeaturedCollection products={products} onOpenAuth={handleOpenAuth} />

            {/* 7. Editorial Quote Banner */}
            <EditorialBanner />

            {/* 8. Footer */}
            <Footer onOpenAuth={handleOpenAuth} />

            {/* 9. Dual Auth Modal Overlay */}
            <AuthModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                initialTab={modalTab}
            />
        </div>
    );
}







gsap.registerPlugin(ScrollTrigger);

// ============================================================
// OFFICIAL ARKS ATTACHED LOGO COMPONENT
// ============================================================
function ArksLogo({ variant = 'dark', className = '', size = 'md' }) {
    const sizeClasses = {
        sm: 'h-6 md:h-7',
        md: 'h-8 md:h-10',
        lg: 'h-14 md:h-16',
        xl: 'h-24 md:h-32',
    }[size] || 'h-9';

    return (
        <div className={`inline-flex items-center justify-center select-none ${className}`}>
            <img
                src="/arks_logo.png"
                alt="ARKS Official Logo"
                className={`${sizeClasses} object-contain transition-all duration-300`}
                style={{
                    filter: variant === 'light' ? 'invert(1) hue-rotate(180deg) brightness(1.2)' : 'none',
                }}
            />
        </div>
    );
}

// ============================================================
// 1. INTRO OVERLAY (Netflix-Style Logo Zoom + Gate Opening)
// ============================================================
function IntroOverlay({ onComplete }) {
    const overlayRef = useRef(null);
    const leftGateRef = useRef(null);
    const rightGateRef = useRef(null);
    const logoWrapperRef = useRef(null);

    useEffect(() => {
        // Lock scroll during intro
        document.body.style.overflow = 'hidden';

        // Master GSAP Timeline for Intro
        const tl = gsap.timeline({
            onComplete: () => {
                document.body.style.overflow = '';
                if (overlayRef.current) {
                    overlayRef.current.style.pointerEvents = 'none';
                    overlayRef.current.style.display = 'none';
                }
                if (onComplete) onComplete();
            },
        });

        // 1. Logo Fade In & Initial Breath (0.65 -> 1.0)
        tl.fromTo(
            logoWrapperRef.current,
            { opacity: 0, scale: 0.65 },
            { opacity: 1, scale: 1, duration: 1.0, ease: 'power3.out' }
        )
            .to({}, { duration: 0.8 }) // Hold briefly

            // 2. Netflix-Style Zoom Forward (Surges towards screen while expanding & fading out)
            .to(logoWrapperRef.current, {
                scale: 3.2,
                opacity: 0,
                duration: 1.1,
                ease: 'power3.inOut',
            })

            // 3. Gate Opening Sequence (Left & Right Doors slide apart)
            .to(
                leftGateRef.current,
                {
                    xPercent: -100,
                    duration: 1.3,
                    ease: 'power4.inOut',
                },
                '-=0.4' // Overlap slightly with logo zoom out
            )
            .to(
                rightGateRef.current,
                {
                    xPercent: 100,
                    duration: 1.3,
                    ease: 'power4.inOut',
                },
                '<' // Run simultaneously with left gate
            );

        return () => {
            tl.kill();
            document.body.style.overflow = '';
        };
    }, [onComplete]);

    return (
        <div
            ref={overlayRef}
            className="fixed inset-0 z-[1000] flex pointer-events-auto select-none overflow-hidden"
            style={{ perspective: '1200px' }}
        >
            {/* Left Gate Panel */}
            <div
                ref={leftGateRef}
                className="gate-panel w-1/2 h-full bg-[#1b1c1a] border-r border-[#C9A96E]/20 relative flex items-center justify-end pr-10"
            >
                <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px]" />
            </div>

            {/* Right Gate Panel */}
            <div
                ref={rightGateRef}
                className="gate-panel w-1/2 h-full bg-[#1b1c1a] border-l border-[#C9A96E]/20 relative flex items-center justify-start pl-10"
            >
                <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px]" />
            </div>

            {/* Centered Netflix-Style Zooming Logo */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-20">
                <div ref={logoWrapperRef} className="text-center" style={{ opacity: 0, transformOrigin: 'center center' }}>
                    <ArksLogo variant="light" size="xl" />
                    <p className="mt-4 text-[10px] uppercase tracking-[0.4em] text-[#C9A96E] font-medium">
                        Quiet Luxury &bull; Haute Couture
                    </p>
                </div>
            </div>
        </div>
    );
}

// ============================================================
// 2. MOUSE FOLLOWER
// ============================================================
function MouseFollower() {
    const cursorRef = useRef(null);
    const cursorDotRef = useRef(null);
    const posRef = useRef({ x: 0, y: 0 });
    const targetRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        if (window.matchMedia('(pointer: coarse)').matches) return;

        const handleMouseMove = (e) => {
            targetRef.current = { x: e.clientX, y: e.clientY };
        };

        const handleMouseEnter = () => {
            if (cursorRef.current) {
                gsap.to(cursorRef.current, { scale: 2.2, borderColor: '#C9A96E', duration: 0.3 });
            }
        };

        const handleMouseLeave = () => {
            if (cursorRef.current) {
                gsap.to(cursorRef.current, { scale: 1, borderColor: 'rgba(27,28,26,0.4)', duration: 0.3 });
            }
        };

        window.addEventListener('mousemove', handleMouseMove);

        const interactiveEls = document.querySelectorAll('a, button, input, video, [data-hover]');
        interactiveEls.forEach((el) => {
            el.addEventListener('mouseenter', handleMouseEnter);
            el.addEventListener('mouseleave', handleMouseLeave);
        });

        const animate = () => {
            posRef.current.x += (targetRef.current.x - posRef.current.x) * 0.14;
            posRef.current.y += (targetRef.current.y - posRef.current.y) * 0.14;
            if (cursorRef.current) {
                gsap.set(cursorRef.current, {
                    x: posRef.current.x - 10,
                    y: posRef.current.y - 10,
                });
            }
            if (cursorDotRef.current) {
                gsap.set(cursorDotRef.current, {
                    x: targetRef.current.x - 3,
                    y: targetRef.current.y - 3,
                });
            }
            requestAnimationFrame(animate);
        };
        const rafId = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            interactiveEls.forEach((el) => {
                el.removeEventListener('mouseenter', handleMouseEnter);
                el.removeEventListener('mouseleave', handleMouseLeave);
            });
            cancelAnimationFrame(rafId);
        };
    }, []);

    if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
        return null;
    }

    return (
        <>
            <div
                ref={cursorRef}
                className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full border border-[#1b1c1a]/40 transition-colors duration-300"
                style={{ width: 22, height: 22 }}
            />
            <div
                ref={cursorDotRef}
                className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full bg-[#C9A96E]"
                style={{ width: 6, height: 6 }}
            />
        </>
    );
}

// ============================================================
// 3. MAGNETIC BUTTON
// ============================================================
function MagneticButton({ children, className = '', onClick, type = 'button', disabled = false, ...props }) {
    const btnRef = useRef(null);

    const handleMouseMove = useCallback((e) => {
        if (!btnRef.current) return;
        const rect = btnRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        gsap.to(btnRef.current, {
            x: x * 0.25,
            y: y * 0.25,
            duration: 0.3,
            ease: 'power2.out',
        });
    }, []);

    const handleMouseLeave = useCallback(() => {
        if (!btnRef.current) return;
        gsap.to(btnRef.current, {
            x: 0,
            y: 0,
            duration: 0.5,
            ease: 'elastic.out(1, 0.4)',
        });
    }, []);

    return (
        <button
            ref={btnRef}
            type={type}
            onClick={onClick}
            disabled={disabled}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={className}
            data-hover
            {...props}
        >
            {children}
        </button>
    );
}

// ============================================================
// 4. NAVBAR (With Official ARKS Logo)
// ============================================================
function Navbar({ visible, onOpenAuth, user }) {
    const navRef = useRef(null);
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        if (visible && navRef.current) {
            gsap.fromTo(
                navRef.current,
                { opacity: 0, y: -20 },
                { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
            );
        }
    }, [visible]);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 60);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav
            ref={navRef}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
                ? 'bg-[#fbf9f6]/90 backdrop-blur-md border-b border-[#e4e2df] py-3 shadow-xs'
                : 'bg-transparent py-5'
                }`}
            style={{ opacity: visible ? 1 : 0 }}
        >
            <div className="max-w-[1440px] mx-auto px-6 md:px-12 flex items-center justify-between">
                {/* Official ARKS Logo */}
                <a href="/" className="flex items-center space-x-3 group" data-hover>
                    <ArksLogo variant="dark" size="sm" />
                    <span className="text-[9px] uppercase tracking-[0.2em] text-[#C9A96E] font-medium border border-[#C9A96E]/30 px-2 py-0.5 hidden sm:inline-block ml-2">
                        Club
                    </span>
                </a>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center space-x-10">
                    {['Collections', 'Atelier Shoot', 'Ethos', 'About'].map((item) => (
                        <a
                            key={item}
                            href={`#${item.toLowerCase().replace(' ', '-')}`}
                            data-hover
                            className="text-[11px] uppercase tracking-[0.22em] text-[#7A6E63] hover:text-[#1b1c1a] transition-colors duration-300 font-medium"
                        >
                            {item}
                        </a>
                    ))}
                </div>

                {/* Right CTA */}
                <div className="flex items-center space-x-5">
                    {user ? (
                        <span className="text-[10px] uppercase tracking-[0.2em] text-[#C9A96E] font-semibold hidden sm:inline-block">
                            Welcome, {user.fullname?.split(' ')[0] || 'Member'}
                        </span>
                    ) : (
                        <MagneticButton
                            onClick={() => onOpenAuth('login')}
                            className="hidden sm:block px-6 py-2.5 bg-[#1b1c1a] text-[#fbf9f6] text-[10px] uppercase tracking-[0.25em] font-medium hover:bg-[#C9A96E] hover:text-[#1b1c1a] transition-all duration-300"
                        >
                            Sign In
                        </MagneticButton>
                    )}

                    <MagneticButton
                        onClick={() => onOpenAuth('register')}
                        className="px-5 py-2.5 border border-[#1b1c1a] text-[10px] uppercase tracking-[0.22em] text-[#1b1c1a] font-medium hover:bg-[#1b1c1a] hover:text-[#fbf9f6] transition-all duration-300"
                    >
                        Join Club
                    </MagneticButton>

                    {/* Mobile Menu Button */}
                    <button
                        data-hover
                        className="md:hidden text-[#1b1c1a] p-1"
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                            {menuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Drawer */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-[#fbf9f6] border-b border-[#e4e2df] px-6 py-8 space-y-6"
                    >
                        {['Collections', 'Atelier Shoot', 'Ethos', 'About'].map((item) => (
                            <a
                                key={item}
                                href={`#${item.toLowerCase().replace(' ', '-')}`}
                                onClick={() => setMenuOpen(false)}
                                className="block text-xs uppercase tracking-[0.2em] text-[#1b1c1a] font-medium"
                            >
                                {item}
                            </a>
                        ))}
                        <div className="pt-4 border-t border-[#e4e2df] flex flex-col gap-3">
                            <button
                                onClick={() => { setMenuOpen(false); onOpenAuth('login'); }}
                                className="w-full py-3 bg-[#1b1c1a] text-[#fbf9f6] text-xs uppercase tracking-[0.2em] font-medium"
                            >
                                Sign In
                            </button>
                            <button
                                onClick={() => { setMenuOpen(false); onOpenAuth('register'); }}
                                className="w-full py-3 border border-[#1b1c1a] text-[#1b1c1a] text-xs uppercase tracking-[0.2em] font-medium"
                            >
                                Join ARKS Club
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}

// ============================================================
// 5. HERO SECTION (Video 1: Runway Fashion Model Video Loop)
// ============================================================
function HeroSection() {
    return (
        <section className="relative min-h-screen bg-[#fbf9f6] flex flex-col justify-between pt-28 pb-12 px-6 md:px-12 lg:px-20 overflow-hidden">
            {/* Hero Runway Video Container */}
            <div className="relative w-full h-[55vh] md:h-[65vh] lg:h-[70vh] rounded-none overflow-hidden my-auto border border-[#e4e2df]">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    poster="/arks_hero_editorial.png"
                    className="absolute inset-0 w-full h-full object-cover object-center filter contrast-[1.05] brightness-[0.95]"
                >
                    <source
                        src="https://assets.mixkit.co/videos/preview/mixkit-fashion-model-walking-on-a-catwalk-41484-large.mp4"
                        type="video/mp4"
                    />
                </video>

                {/* Ambient Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1b1c1a]/75 via-transparent to-[#1b1c1a]/20" />

                {/* Overlay Content */}
                <div className="absolute inset-0 p-8 md:p-14 flex flex-col justify-between z-10">
                    <div className="flex justify-between items-start">
                        <span className="text-[10px] uppercase tracking-[0.3em] text-[#C9A96E] font-medium border border-[#C9A96E]/40 px-3 py-1 bg-[#1b1c1a]/40 backdrop-blur-md">
                            SS/26 Collection
                        </span>
                        <span className="text-[10px] uppercase tracking-[0.25em] text-[#fbf9f6]/80 font-mono hidden sm:inline">
                            01 &mdash; 02
                        </span>
                    </div>

                    <div className="max-w-2xl text-[#fbf9f6]">
                        <p className="text-[10px] uppercase tracking-[0.35em] text-[#C9A96E] font-medium mb-3">
                            ARKS Studio &bull; Limited Release
                        </p>
                        <h1
                            className="text-4xl sm:text-6xl lg:text-7xl font-light leading-[1.05] tracking-wide"
                            style={{ fontFamily: "'Cormorant Garamond', serif" }}
                        >
                            The Modern Expression of Heritage.
                        </h1>
                    </div>
                </div>
            </div>

            {/* Subtitle & Scroll Info */}
            <div className="max-w-[1440px] mx-auto w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pt-6 border-t border-[#e4e2df]">
                <p className="text-xs text-[#7A6E63] max-w-md font-light leading-relaxed tracking-wide">
                    Designed with restraint and executed with perfection. Explore curated footwear, apparel, and bespoke member drops.
                </p>

                <div className="flex items-center space-x-4">
                    <span className="text-[9px] uppercase tracking-[0.3em] text-[#1b1c1a] font-semibold">
                        Scroll to Explore
                    </span>
                    <div className="w-8 h-[1px] bg-[#C9A96E]" />
                </div>
            </div>
        </section>
    );
}

// ============================================================
// 6. ATELIER MODEL SHOOT SECTION (Video 2: Model Photoshoot Motion)
// Replaces the heavy reels section with 1 clean photoshoot video + editorial shot
// ============================================================
function ModelShootSection() {
    return (
        <section id="atelier-shoot" className="py-24 bg-[#f5f3f0] border-y border-[#e4e2df] px-6 md:px-12 lg:px-20">
            <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                {/* Left Column: Model Photoshoot Video Loop */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ duration: 0.8 }}
                    className="lg:col-span-7 relative aspect-[4/5] bg-[#1b1c1a] border border-[#e4e2df] overflow-hidden"
                >
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        poster="/arks_hero_editorial.png"
                        className="w-full h-full object-cover filter contrast-[1.05] brightness-[0.95]"
                    >
                        <source
                            src="https://assets.mixkit.co/videos/preview/mixkit-model-posing-in-a-black-outfit-41489-large.mp4"
                            type="video/mp4"
                        />
                    </video>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1b1c1a]/80 via-transparent to-transparent" />
                    <div className="absolute bottom-6 left-6 z-10 text-[#fbf9f6]">
                        <span className="text-[9px] uppercase tracking-[0.25em] text-[#C9A96E] font-medium block mb-1">
                            Atelier Shoot &bull; Vol. I
                        </span>
                        <p
                            className="text-2xl font-light"
                            style={{ fontFamily: "'Cormorant Garamond', serif" }}
                        >
                            Silhouettes in Motion
                        </p>
                    </div>
                </motion.div>

                {/* Right Column: Editorial Shot & Narrative */}
                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="lg:col-span-5 space-y-8"
                >
                    <div className="space-y-4">
                        <span className="text-[10px] uppercase tracking-[0.3em] text-[#C9A96E] font-medium block">
                            Atelier Craftsmanship
                        </span>
                        <h2
                            className="text-4xl md:text-5xl font-light text-[#1b1c1a] leading-tight"
                            style={{ fontFamily: "'Cormorant Garamond', serif" }}
                        >
                            Behind the lens of ARKS Studio.
                        </h2>
                        <p className="text-xs text-[#7A6E63] leading-relaxed font-light">
                            Every garment undergoes rigorous pattern development and drape testing in our atelier. We prioritize pure form, structural elegance, and longevity over fleeting seasonal hype.
                        </p>
                    </div>

                    {/* High Fashion Shot */}
                    <div className="aspect-[16/10] bg-[#efece6] border border-[#e4e2df] overflow-hidden relative">
                        <img
                            src="/arks_hero_editorial.png"
                            alt="Editorial Model Shoot"
                            className="w-full h-full object-cover grayscale contrast-105"
                        />
                        <div className="absolute bottom-3 right-3 bg-[#1b1c1a] text-[#fbf9f6] text-[9px] uppercase tracking-[0.2em] px-2.5 py-1">
                            Studio Shot
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

// ============================================================
// 7. FEATURED COLLECTION
// ============================================================
function FeaturedCollection({ products, onOpenAuth }) {
    const navigate = useNavigate();

    return (
        <section id="collections" className="py-28 bg-[#fbf9f6] px-6 md:px-12 lg:px-20">
            <div className="max-w-[1440px] mx-auto mb-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <span className="text-[10px] uppercase tracking-[0.3em] text-[#C9A96E] font-medium block mb-3">
                        Available Releases
                    </span>
                    <h2
                        className="text-4xl md:text-6xl font-light text-[#1b1c1a]"
                        style={{ fontFamily: "'Cormorant Garamond', serif" }}
                    >
                        Curated Essentials
                    </h2>
                </div>
                <MagneticButton
                    onClick={() => onOpenAuth('register')}

                    className="px-8 py-3.5 border border-[#1b1c1a] text-[10px] uppercase tracking-[0.25em] text-[#1b1c1a] font-medium hover:bg-[#1b1c1a] hover:text-[#fbf9f6] transition-all duration-300"
                >
                    View Full Vault
                </MagneticButton>
            </div>

            {/* Grid */}
            <div className="max-w-[1440px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {(products && products.length > 0 ? products : fallbackProducts).map((products, i) => (
                    <motion.div
                        key={products._id || products.id || i}
                        onClick={() => navigate(`/details/${products._id}`)}
                        className="group bg-[#fbf9f6] border border-[#e4e2df] p-4 cursor-pointer" initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-50px' }}
                        transition={{ duration: 0.6, delay: i * 0.1 }}
                    >
                        <div className="relative aspect-[3/4] overflow-hidden bg-[#f5f3f0] mb-4">
                            {products.images && products.images[0] ? (
                                <img
                                    src={products.images?.[0]?.url}
                                    alt={products.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-neutral-100 text-[#B5ADA3] text-xs">
                                    No Image
                                </div>
                            )}

                            {/* <img
                                src={products.images?.[0] || products.images}
                                alt={products.title}
                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                            /> */}
                            <div className="absolute top-3 right-3 bg-[#1b1c1a] text-[#fbf9f6] text-[9px] uppercase tracking-[0.15em] px-2 py-1">
                                New
                            </div>
                        </div>

                        <div className="space-y-1">
                            <span className="text-[9px] uppercase tracking-[0.2em] text-[#C9A96E] font-medium">
                                {products.category || 'Haute Couture'}
                            </span>
                            <h3 className="text-xs uppercase tracking-[0.12em] text-[#1b1c1a] font-semibold truncate">
                                {products.title}
                            </h3>
                            <p className="text-[11px] text-[#7A6E63] font-light">
                                {products.price?.currency ? `${products.price.currency} ${products.price.amount.toLocaleString()}` : 'Price on request'}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}

const fallbackProducts = [
    { id: '1', name: 'Monochrome Wool Blazer', price: 18500, category: 'Apparel' },
    { id: '2', name: 'Signature Leather Sneaker', price: 14200, category: 'Footwear' },
    { id: '3', name: 'Minimal Trench Coat', price: 22000, category: 'Outerwear' },
    { id: '4', name: 'Structured Linen Trousers', price: 9800, category: 'Apparel' },
];

// ============================================================
// 8. EDITORIAL QUOTE BANNER
// ============================================================
function EditorialBanner() {
    return (
        <section id="ethos" className="py-28 bg-[#1b1c1a] text-[#fbf9f6] px-6 md:px-12 text-center relative overflow-hidden">
            <div className="max-w-4xl mx-auto space-y-6">
                <span className="text-[10px] uppercase tracking-[0.35em] text-[#C9A96E] font-medium">
                    The ARKS Ethos
                </span>
                <h2
                    className="text-3xl sm:text-5xl md:text-6xl font-light italic leading-tight text-[#fbf9f6]"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                    "Elegance is not standing out, but being remembered."
                </h2>
                <div className="w-16 h-[1px] bg-[#C9A96E] mx-auto mt-6" />
            </div>
        </section>
    );
}

// ============================================================
// 9. FOOTER
// ============================================================
function Footer({ onOpenAuth }) {
    return (
        <footer className="bg-[#1b1c1a] text-[#fbf9f6] pt-20 pb-12 border-t border-[#C9A96E]/20 px-6 md:px-12 lg:px-20">
            <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                {/* Official ARKS Logo */}
                <div className="space-y-4 md:col-span-1">
                    <ArksLogo variant="light" size="md" />
                    <p className="text-xs text-[#fbf9f6]/60 font-light leading-relaxed max-w-xs pt-2">
                        A global community living simply and deliberately. Minimalist luxury apparel, footwear, and bespoke studio drops.
                    </p>
                </div>

                {/* Links 1 */}
                <div>
                    <h4 className="text-[10px] uppercase tracking-[0.25em] text-[#C9A96E] font-semibold mb-6">
                        Site Navigation
                    </h4>
                    <ul className="space-y-3 text-xs tracking-[0.15em] uppercase text-[#fbf9f6]/70">
                        <li><a href="#collections" className="hover:text-white transition-colors">Collections</a></li>
                        <li><a href="#atelier-shoot" className="hover:text-white transition-colors">Atelier Shoot</a></li>
                        <li><a href="#ethos" className="hover:text-white transition-colors">The Ethos</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">About Brand</a></li>
                    </ul>
                </div>

                {/* Links 2 */}
                <div>
                    <h4 className="text-[10px] uppercase tracking-[0.25em] text-[#C9A96E] font-semibold mb-6">
                        Member Access
                    </h4>
                    <ul className="space-y-3 text-xs tracking-[0.15em] uppercase text-[#fbf9f6]/70">
                        <li>
                            <button onClick={() => onOpenAuth('login')} className="hover:text-white transition-colors">
                                Sign In to Vault
                            </button>
                        </li>
                        <li>
                            <button onClick={() => onOpenAuth('register')} className="hover:text-white transition-colors">
                                Create Account
                            </button>
                        </li>
                        <li><a href="#" className="hover:text-white transition-colors">Client Concierge</a></li>
                    </ul>
                </div>

                {/* Newsletter */}
                <div>
                    <h4 className="text-[10px] uppercase tracking-[0.25em] text-[#C9A96E] font-semibold mb-6">
                        Join Studio List
                    </h4>
                    <form onSubmit={(e) => e.preventDefault()} className="space-y-3">
                        <input
                            type="email"
                            placeholder="YOUR EMAIL ADDRESS"
                            className="w-full bg-transparent border-b border-[#fbf9f6]/20 py-2.5 text-xs text-[#fbf9f6] outline-none focus:border-[#C9A96E] tracking-wider placeholder:text-[#fbf9f6]/30"
                        />
                        <button
                            type="submit"
                            className="w-full py-3 bg-[#C9A96E] text-[#1b1c1a] text-[10px] uppercase tracking-[0.2em] font-medium hover:bg-white transition-colors"
                        >
                            Subscribe
                        </button>
                    </form>
                </div>
            </div>

            <div className="max-w-[1440px] mx-auto pt-8 border-t border-[#fbf9f6]/10 flex flex-col sm:flex-row justify-between items-center text-[10px] uppercase tracking-[0.2em] text-[#fbf9f6]/40">
                <span>&copy; 2026 ARKS LUXURY HOUSE. ALL RIGHTS RESERVED.</span>
                <span>DESIGNED FOR QUIET CONFIDENCE</span>
            </div>
        </footer>
    );
}

// ============================================================
// 10. DUAL AUTH MODAL
// ============================================================
function AuthModal({ isOpen, onClose, initialTab = 'register' }) {
    const { handeRegister, handleLogin } = useAuth();
    const [activeTab, setActiveTab] = useState(initialTab);
    const [formData, setFormData] = useState({
        fullname: '',
        email: '',
        contact: '',
        password: '',
        role: 'buyer',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        setActiveTab(initialTab);
    }, [initialTab]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            if (activeTab === 'register') {
                await handeRegister({
                    email: formData.email,
                    password: formData.password,
                    fullname: formData.fullname,
                    contact: formData.contact,
                    isSeller: formData.role === 'seller',
                });
            } else {
                await handleLogin({
                    email: formData.email,
                    password: formData.password,
                });
            }
            onClose();
        } catch (err) {
            console.error('Auth action failed:', err);
            setError(err?.response?.data?.message || err?.message || 'Authentication failed.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-[#1b1c1a]/80 backdrop-blur-md"
                    />

                    {/* Modal Container */}
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        className="relative z-10 w-full max-w-[1000px] bg-[#fbf9f6] border border-[#e4e2df] shadow-2xl overflow-hidden flex flex-col md:flex-row my-auto"
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-5 right-5 z-30 p-2 text-[#1b1c1a]/60 hover:text-[#1b1c1a] transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {/* Left Editorial Visual */}
                        <div className="hidden md:flex md:w-1/2 bg-[#1b1c1a] p-10 flex-col justify-between relative overflow-hidden">
                            <img
                                src="/arks_hero_editorial.png"
                                alt="ARKS Editorial"
                                className="absolute inset-0 w-full h-full object-cover grayscale contrast-110 opacity-75"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#1b1c1a] via-[#1b1c1a]/30 to-transparent" />

                            <div className="relative z-10">
                                <ArksLogo variant="light" size="md" />
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
                        <div className="w-full md:w-1/2 p-8 sm:p-12 flex flex-col justify-between">
                            <div>
                                {/* Tabs */}
                                <div className="flex border-b border-[#e4e2df] mb-8">
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab('register')}
                                        className={`pb-3 text-xs uppercase tracking-[0.2em] font-medium transition-colors border-b-2 mr-8 ${activeTab === 'register'
                                            ? 'border-[#C9A96E] text-[#1b1c1a]'
                                            : 'border-transparent text-[#7A6E63] hover:text-[#1b1c1a]'
                                            }`}
                                    >
                                        Create Account
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab('login')}
                                        className={`pb-3 text-xs uppercase tracking-[0.2em] font-medium transition-colors border-b-2 ${activeTab === 'login'
                                            ? 'border-[#C9A96E] text-[#1b1c1a]'
                                            : 'border-transparent text-[#7A6E63] hover:text-[#1b1c1a]'
                                            }`}
                                    >
                                        Sign In
                                    </button>
                                </div>

                                {error && (
                                    <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 text-xs font-sans-editorial">
                                        {error}
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    {activeTab === 'register' && (
                                        <>
                                            <div>
                                                <label className="text-[9px] uppercase tracking-[0.18em] text-[#7A6E63] font-medium block mb-1">
                                                    Full Name
                                                </label>
                                                <input
                                                    type="text"
                                                    name="fullname"
                                                    value={formData.fullname}
                                                    onChange={handleChange}
                                                    required
                                                    placeholder="John Doe"
                                                    className="w-full bg-transparent border-b border-[#d0c5b5] py-2 text-xs text-[#1b1c1a] outline-none focus:border-[#C9A96E]"
                                                />
                                            </div>

                                            <div>
                                                <label className="text-[9px] uppercase tracking-[0.18em] text-[#7A6E63] font-medium block mb-1">
                                                    Contact Number
                                                </label>
                                                <input
                                                    type="tel"
                                                    name="contact"
                                                    value={formData.contact}
                                                    onChange={handleChange}
                                                    required
                                                    placeholder="+91 98765 43210"
                                                    className="w-full bg-transparent border-b border-[#d0c5b5] py-2 text-xs text-[#1b1c1a] outline-none focus:border-[#C9A96E]"
                                                />
                                            </div>
                                        </>
                                    )}

                                    <div>
                                        <label className="text-[9px] uppercase tracking-[0.18em] text-[#7A6E63] font-medium block mb-1">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            placeholder="hello@example.com"
                                            className="w-full bg-transparent border-b border-[#d0c5b5] py-2 text-xs text-[#1b1c1a] outline-none focus:border-[#C9A96E]"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-[9px] uppercase tracking-[0.18em] text-[#7A6E63] font-medium block mb-1">
                                            Password
                                        </label>
                                        <input
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                            placeholder="••••••••"
                                            className="w-full bg-transparent border-b border-[#d0c5b5] py-2 text-xs text-[#1b1c1a] outline-none focus:border-[#C9A96E]"
                                        />
                                    </div>

                                    {activeTab === 'register' && (
                                        <div className="pt-2">
                                            <label className="text-[9px] uppercase tracking-[0.18em] text-[#7A6E63] font-medium block mb-2">
                                                Account Type
                                            </label>
                                            <div className="grid grid-cols-2 gap-3">
                                                <button
                                                    type="button"
                                                    onClick={() => setFormData((p) => ({ ...p, role: 'buyer' }))}
                                                    className={`p-2.5 border text-xs text-left ${formData.role === 'buyer'
                                                        ? 'border-[#1b1c1a] bg-[#1b1c1a] text-white'
                                                        : 'border-[#d0c5b5] text-[#1b1c1a]'
                                                        }`}
                                                >
                                                    Buyer
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setFormData((p) => ({ ...p, role: 'seller' }))}
                                                    className={`p-2.5 border text-xs text-left ${formData.role === 'seller'
                                                        ? 'border-[#1b1c1a] bg-[#1b1c1a] text-white'
                                                        : 'border-[#d0c5b5] text-[#1b1c1a]'
                                                        }`}
                                                >
                                                    Seller
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full mt-6 py-3.5 bg-[#1b1c1a] text-[#fbf9f6] text-xs uppercase tracking-[0.25em] font-medium hover:bg-[#C9A96E] hover:text-[#1b1c1a] transition-all duration-300 disabled:opacity-50"
                                    >
                                        {isSubmitting
                                            ? 'Processing...'
                                            : activeTab === 'register'
                                                ? 'Create Account'
                                                : 'Sign In'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

