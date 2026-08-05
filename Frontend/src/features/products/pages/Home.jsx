import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useProduct } from "../hook/useProduct";
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Register GSAP Plugin
gsap.registerPlugin(ScrollTrigger);

// 1. MAIN HOME PAGE ORCHESTRATION
export default function Home() {

    const { handleGetAllProducts } = useProduct();
    const user = useSelector((state) => state.auth.user);
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [navVisible, setNavVisible] = useState(false);

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

    const handleNavigateAuth = (path) => {
        navigate(path);
    };

    return (
        <div className="arks-landing bg-[#fbf9f6] text-[#1b1c1a] min-h-screen selection:bg-[#C9A96E]/30 select-none">
            {/* 1. Mouse Follower */}
            <MouseFollower />

            {/* 2. Gate Opening Intro Overlay with Netflix-Style Zooming Logo */}
            <IntroOverlay onComplete={() => setNavVisible(true)} />

            {/* 3. Navigation Bar */}
            <Navbar visible={navVisible} onAuthNavigate={handleNavigateAuth} user={user} />

            {/* 4. Hero Section with Video Loop 1 (Runway Fashion Catwalk) */}
            <HeroSection />

            {/* 5. Model Shoot Section with Video Loop 2 (Atelier Posing Motion) */}
            <ModelShootSection />

            {/* 6. Featured Products Collection */}
            <FeaturedCollection
                products={products}
                user={user}
                onAuthNavigate={handleNavigateAuth}
            />
            {/* 7. Editorial Quote Banner */}
            <EditorialBanner />

            {/* 8. Footer */}
            <Footer onAuthNavigate={handleNavigateAuth} />
        </div>
    );
}

// OFFICIAL ARKS ATTACHED LOGO COMPONENT
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

// 2. INTRO OVERLAY (Netflix-Style Logo Zoom + Gate Opening)
function IntroOverlay({ onComplete }) {
    const overlayRef = useRef(null);
    const leftGateRef = useRef(null);
    const rightGateRef = useRef(null);
    const logoWrapperRef = useRef(null);

    useEffect(() => {
        document.body.style.overflow = 'hidden';

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

        tl.fromTo(
            logoWrapperRef.current,
            { opacity: 0, scale: 0.65 },
            { opacity: 1, scale: 1, duration: 1.0, ease: 'power3.out' }
        )
            .to({}, { duration: 0.8 })
            .to(logoWrapperRef.current, {
                scale: 3.2,
                opacity: 0,
                duration: 1.1,
                ease: 'power3.inOut',
            })
            .to(
                leftGateRef.current,
                {
                    xPercent: -100,
                    duration: 1.3,
                    ease: 'power4.inOut',
                },
                '-=0.4'
            )
            .to(
                rightGateRef.current,
                {
                    xPercent: 100,
                    duration: 1.3,
                    ease: 'power4.inOut',
                },
                '<'
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
            <div
                ref={leftGateRef}
                className="gate-panel w-1/2 h-full bg-[#1b1c1a] border-r border-[#C9A96E]/20 relative flex items-center justify-end pr-10"
            >
                <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px]" />
            </div>

            <div
                ref={rightGateRef}
                className="gate-panel w-1/2 h-full bg-[#1b1c1a] border-l border-[#C9A96E]/20 relative flex items-center justify-start pl-10"
            >
                <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px]" />
            </div>

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

// 3. MOUSE FOLLOWER
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

// 4. MAGNETIC BUTTON
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

// 5. NAVBAR
function Navbar({ visible, onAuthNavigate, user }) {
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
                <a href="/" className="flex items-center space-x-3 group" data-hover>
                    <ArksLogo variant="dark" size="sm" />
                    <span className="text-[9px] uppercase tracking-[0.2em] text-[#C9A96E] font-medium border border-[#C9A96E]/30 px-2 py-0.5 hidden sm:inline-block ml-2">
                        Club
                    </span>
                </a>

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

                <div className="flex items-center space-x-5">
                    {user ? (
                        <span className="text-[10px] uppercase tracking-[0.2em] text-[#C9A96E] font-semibold hidden sm:inline-block">
                            Welcome, {user.fullname?.split(' ')[0] || 'Member'}
                        </span>
                    ) : (
                        <MagneticButton
                            onClick={() => onAuthNavigate('/login')}
                            className="hidden sm:block px-6 py-2.5 bg-[#1b1c1a] text-[#fbf9f6] text-[10px] uppercase tracking-[0.25em] font-medium hover:bg-[#C9A96E] hover:text-[#1b1c1a] transition-all duration-300"
                        >
                            Sign In
                        </MagneticButton>
                    )}

                    <MagneticButton
                        onClick={() => onAuthNavigate('/register')}
                        className="px-5 py-2.5 border border-[#1b1c1a] text-[10px] uppercase tracking-[0.22em] text-[#1b1c1a] font-medium hover:bg-[#1b1c1a] hover:text-[#fbf9f6] transition-all duration-300"
                    >
                        Join Club
                    </MagneticButton>

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
                                onClick={() => { setMenuOpen(false); onAuthNavigate('/login'); }}
                                className="w-full py-3 bg-[#1b1c1a] text-[#fbf9f6] text-xs uppercase tracking-[0.2em] font-medium"
                            >
                                Sign In
                            </button>
                            <button
                                onClick={() => { setMenuOpen(false); onAuthNavigate('/register'); }}
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

// 6. HERO SECTION
function HeroSection() {
    return (
        <section className="relative min-h-screen bg-[#fbf9f6] flex flex-col justify-between pt-28 pb-12 px-6 md:px-12 lg:px-20 overflow-hidden">
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

                <div className="absolute inset-0 bg-gradient-to-t from-[#1b1c1a]/75 via-transparent to-[#1b1c1a]/20" />

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

// 7. ATELIER MODEL SHOOT SECTION
function ModelShootSection() {
    return (
        <section id="atelier-shoot" className="py-24 bg-[#f5f3f0] border-y border-[#e4e2df] px-6 md:px-12 lg:px-20">
            <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
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

// 8. FEATURED COLLECTION
function FeaturedCollection({ products, onAuthNavigate }) {
    const user = useSelector(state => state.auth.user);
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
                    onClick={() => {
                        if (!user) {
                            onAuthNavigate("/register");
                            return;
                        }
                        navigate("/collection");
                    }}
                    className="px-8 py-3.5 border border-[#1b1c1a] text-[10px] uppercase tracking-[0.25em] text-[#1b1c1a] font-medium hover:bg-[#1b1c1a] hover:text-[#fbf9f6] transition-all duration-300"
                >
                    View Full Vault
                </MagneticButton>
            </div>

            <div className="max-w-[1440px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {(products && products.length > 0 ? products : []).map((product, i) => (
                    <motion.div
                        key={product._id || product.id || i}
                        onClick={() => navigate(`/details/${product._id}`)}
                        className="group bg-[#fbf9f6] border border-[#e4e2df] p-4 cursor-pointer"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-50px' }}
                        transition={{ duration: 0.6, delay: i * 0.1 }}
                    >
                        <div className="relative aspect-[3/4] overflow-hidden bg-[#f5f3f0] mb-4">
                            {product.images && product.images[0] ? (
                                <img
                                    src={product.images[0].url || product.images[0]}
                                    alt={product.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-neutral-100 text-[#B5ADA3] text-xs">
                                    No Image
                                </div>
                            )}
                            <div className="absolute top-3 right-3 bg-[#1b1c1a] text-[#fbf9f6] text-[9px] uppercase tracking-[0.15em] px-2 py-1">
                                New
                            </div>
                        </div>

                        <div className="space-y-1">
                            <span className="text-[9px] uppercase tracking-[0.2em] text-[#C9A96E] font-medium">
                                {product.category || 'Haute Couture'}
                            </span>
                            <h3 className="text-xs uppercase tracking-[0.12em] text-[#1b1c1a] font-semibold truncate">
                                {product.title}
                            </h3>
                            <p className="text-[11px] text-[#7A6E63] font-light">
                                {product.price?.currency ? `${product.price.currency} ${product.price.amount.toLocaleString()}` : 'Price on request'}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}

// 9. EDITORIAL BANNER
function EditorialBanner() {
    return (
        <section id="ethos" className="py-24 bg-[#1b1c1a] text-[#fbf9f6] px-6 md:px-12 lg:px-20 relative overflow-hidden">
            <div className="max-w-[1000px] mx-auto text-center space-y-6 relative z-10">
                <span className="text-[10px] uppercase tracking-[0.35em] text-[#C9A96E] font-medium block">
                    Our Philosophy
                </span>
                <h2
                    className="text-3xl md:text-5xl font-light leading-snug"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                    &ldquo;Luxury is not about abundance, but the elimination of noise until only pure form remains.&rdquo;
                </h2>
                <p className="text-xs tracking-[0.2em] uppercase text-[#7A6E63]">
                    &mdash; ARKS Atelier Manifesto
                </p>
            </div>
        </section>
    );
}

// 10. FOOTER
function Footer({ onAuthNavigate }) {
    return (
        <footer id="about" className="bg-[#f5f3f0] border-t border-[#e4e2df] pt-16 pb-12 px-6 md:px-12 lg:px-20">
            <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 mb-16">
                <div className="space-y-4 md:col-span-1">
                    <ArksLogo variant="dark" size="md" />
                    <p className="text-xs text-[#7A6E63] leading-relaxed font-light">
                        Haute couture, footwear, and curated objects designed for members of refined taste.
                    </p>
                </div>

                <div>
                    <h4 className="text-[10px] uppercase tracking-[0.2em] text-[#1b1c1a] font-semibold mb-4">Navigation</h4>
                    <ul className="space-y-2 text-xs text-[#7A6E63]">
                        <li><a href="#collections" className="hover:text-[#1b1c1a] transition-colors">Collections</a></li>
                        <li><a href="#atelier-shoot" className="hover:text-[#1b1c1a] transition-colors">Atelier Shoot</a></li>
                        <li><a href="#ethos" className="hover:text-[#1b1c1a] transition-colors">Ethos</a></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-[10px] uppercase tracking-[0.2em] text-[#1b1c1a] font-semibold mb-4">Membership</h4>
                    <ul className="space-y-2 text-xs text-[#7A6E63]">
                        <li><button onClick={() => onAuthNavigate('/login')} className="hover:text-[#1b1c1a] transition-colors">Sign In</button></li>
                        <li><button onClick={() => onAuthNavigate('/register')} className="hover:text-[#1b1c1a] transition-colors">Register Account</button></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-[10px] uppercase tracking-[0.2em] text-[#1b1c1a] font-semibold mb-4">Client Care</h4>
                    <p className="text-xs text-[#7A6E63] leading-relaxed">
                        For bespoke inquiries and private viewing appointments: <br />
                        <span className="text-[#1b1c1a] font-medium">concierge@arks.com</span>
                    </p>
                </div>
            </div>

            <div className="max-w-[1440px] mx-auto pt-8 border-t border-[#e4e2df] flex flex-col sm:flex-row justify-between items-center text-[10px] text-[#7A6E63] gap-4">
                <p>&copy; {new Date().getFullYear()} ARKS Studio. All rights reserved.</p>
                <div className="flex space-x-6">
                    <a href="#" className="hover:text-[#1b1c1a] transition-colors">Privacy Policy</a>
                    <a href="#" className="hover:text-[#1b1c1a] transition-colors">Terms of Service</a>
                </div>
            </div>
        </footer>
    );
}

