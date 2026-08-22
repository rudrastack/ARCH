import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAuth } from "../../../features/auth/hook/useAuth";

export default function Navbar() {
    const navigate = useNavigate();
    const { handleLogout } = useAuth();

    const user = useSelector(state => state.auth?.user);
    const cartItems = useSelector(state => state.cart?.items);

    const [showAccount, setShowAccount] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close account dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowAccount(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Close mobile nav on route change / resize
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) setMobileOpen(false);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleUserLogout = useCallback(async () => {
        try {
            await handleLogout();
            setShowAccount(false);
            setMobileOpen(false);
            navigate("/");
        } catch (err) {
            console.error("Logout failed:", err);
        }
    }, [handleLogout, navigate]);

    const navLinks = ["Collections", "New Arrivals", "Heritage", "Bespoke"];

    return (
        <header
            className="fixed top-0 left-0 w-full z-50"
            style={{
                background: "#ffffff",
                borderBottom: "1px solid #e5e5e5",
            }}
        >
            <nav
                className="flex items-center justify-between h-[72px] max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16 box-border"
            >
                {/* LOGO */}
                <a
                    href="/"
                    style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: 24,
                        fontWeight: 700,
                        color: "#0a192f",
                        textDecoration: "none",
                        letterSpacing: "-0.02em",
                        flexShrink: 0,
                    }}
                >
                    ARCH
                </a>

                {/* DESKTOP LINKS */}
                <div className="hidden lg:flex items-center gap-8 lg:gap-10">
                    {navLinks.map(l => (
                        <a
                            key={l}
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();

                                if (l === "Collections") {
                                    navigate("/collection");
                                }
                            }}
                            className="arch-nav-a"
                            style={{
                                fontSize: 14,
                                fontWeight: 500,
                                color: "#44474d",
                                textDecoration: "none",
                                transition: "color .2s",
                            }}
                        >
                            {l}
                        </a>
                    ))}
                </div>

                {/* ICONS & ACTIONS */}
                <div className="flex items-center gap-3 sm:gap-4">
                    {/* CART */}
                    <button
                        onClick={() => navigate("/cart")}
                        className="nav-icon-btn"
                        style={{ position: "relative" }}
                        title="Cart"
                        aria-label="Shopping Cart"
                    >
                        <span className="material-symbols-outlined" style={{ fontSize: 22 }}>shopping_bag</span>
                        {cartItems?.length > 0 && (
                            <span
                                style={{
                                    position: "absolute",
                                    top: 4,
                                    right: 4,
                                    width: 10,
                                    height: 10,
                                    borderRadius: "50%",
                                    background: "#e53935",
                                    border: "2px solid #f9f9f9",
                                }}
                            />
                        )}
                    </button>

                    {/* USER ACCOUNT */}
                    <div style={{ position: "relative" }} ref={dropdownRef}>
                        {user ? (
                            <button
                                onClick={() => setShowAccount(prev => !prev)}
                                className="nav-icon-btn"
                                title="Account"
                                aria-expanded={showAccount}
                            >
                                <span className="material-symbols-outlined">person</span>
                            </button>
                        ) : (
                            <button
                                onClick={() => navigate('/login')}
                                className="hidden sm:flex items-center"
                                style={{
                                    background: "#0a192f",
                                    color: "#ffffff",
                                    border: "none",
                                    padding: "8px 20px",
                                    borderRadius: "24px",
                                    fontWeight: 600,
                                    fontSize: 14,
                                    cursor: "pointer",
                                    transition: "opacity 0.2s",
                                    whiteSpace: "nowrap",
                                }}
                                onMouseOver={e => e.currentTarget.style.opacity = "0.9"}
                                onMouseOut={e => e.currentTarget.style.opacity = "1"}
                            >
                                Login
                            </button>
                        )}

                        {/* ACCOUNT DROPDOWN */}
                        {showAccount && user && (
                            <div
                                className="dropdown-fade-in"
                                style={{
                                    position: "absolute",
                                    top: "calc(100% + 10px)",
                                    right: 0,
                                    width: 240,
                                    background: "#fff",
                                    border: "1px solid #f3f3f4",
                                    borderRadius: 12,
                                    padding: 16,
                                    boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
                                    zIndex: 1000,
                                }}
                            >
                                {/* Header */}
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                                    <div>
                                        <div style={{ fontSize: 14, fontWeight: 600, color: "#1a1c1c" }}>My Account</div>
                                        <div style={{ fontSize: 11, color: "#75777e", marginTop: 4 }}>Manage your details</div>
                                    </div>
                                    <button
                                        onClick={handleUserLogout}
                                        title="Logout"
                                        style={{ border: "none", background: "transparent", cursor: "pointer", padding: 4, display: "flex", color: "#d32f2f" }}
                                    >
                                        <span className="material-symbols-outlined" style={{ fontSize: 20 }}>logout</span>
                                    </button>
                                </div>

                                {/* User Details */}
                                <div style={{ borderTop: "1px solid #eeeeee", paddingTop: 12, display: "flex", flexDirection: "column", gap: 12 }}>
                                    {[
                                        { label: "Full Name", value: user.fullname },
                                        { label: "Email", value: user.email },
                                        { label: "Contact", value: user.contact },
                                    ].map(({ label, value }) => (
                                        <div key={label} style={{ fontSize: 13, color: "#1a1c1c" }}>
                                            <span style={{ color: "#75777e", fontSize: 11, display: "block", marginBottom: 2 }}>{label}</span>
                                            <div style={{ fontWeight: 500, wordBreak: "break-word" }}>{value || "Not available"}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* MOBILE HAMBURGER */}
                    <button
                        className="flex lg:hidden nav-icon-btn"
                        onClick={() => setMobileOpen(o => !o)}
                        aria-label="Toggle navigation"
                        aria-expanded={mobileOpen}
                    >
                        <span className="material-symbols-outlined" style={{ fontSize: 24 }}>
                            {mobileOpen ? "close" : "menu"}
                        </span>
                    </button>
                </div>
            </nav>

            {/* MOBILE DRAWER */}
            <div className={`arch-mobile-nav ${mobileOpen ? "open" : ""}`}>
                {navLinks.map(l => (
                    <a
                        key={l}
                        href="#"
                        onClick={() => setMobileOpen(false)}
                        style={{
                            fontSize: 15,
                            fontWeight: 500,
                            color: "#44474d",
                            textDecoration: "none",
                            paddingBottom: 12,
                            borderBottom: "1px solid #eeeeee",
                        }}
                    >
                        {l}
                    </a>
                ))}
                <div className="flex flex-col gap-3 pt-2">
                    {!user && (
                        <button
                            onClick={() => { setMobileOpen(false); navigate("/login"); }}
                            style={{
                                background: "#0a192f",
                                color: "#fff",
                                border: "none",
                                padding: "12px 0",
                                borderRadius: 8,
                                fontWeight: 600,
                                fontSize: 14,
                                cursor: "pointer",
                            }}
                        >
                            Login
                        </button>
                    )}
                    {user && (
                        <button
                            onClick={handleUserLogout}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = "#d32f2f";
                                e.currentTarget.style.color = "#fff";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = "transparent";
                                e.currentTarget.style.color = "#d32f2f";
                            }}
                            style={{
                                background: "transparent",
                                color: "#d32f2f",
                                border: "1px solid #d32f2f",
                                padding: "12px 0",
                                borderRadius: 8,
                                fontWeight: 600,
                                fontSize: 14,
                                cursor: "pointer",
                                transition: "all 0.2s ease",
                            }}
                        >
                            Logout
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
}