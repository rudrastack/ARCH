import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProduct } from "../hook/useProduct";
import { useCart } from "../../../features/cart/hook/useCart";
import { useSelector } from "react-redux";
import { useAuth } from "../../../features/auth/hook/useAuth";

// ── Design tokens  ──────────────────
const t = {
    primary: "#0a192f",
    primaryText: "#ffffff",
    secondary: "#735c00",
    surface: "#f9f9f9",
    surfaceContainerLow: "#f3f3f4",
    surfaceContainer: "#eeeeee",
    onSurface: "#1a1c1c",
    onSurfaceVariant: "#44474d",
    outline: "#75777e",
    outlineVariant: "#c5c6cd",
};

// ── Helper: Normalize attributes whether stored as string or array ──
const getAttrString = (attr) => {
    if (!attr) return "";
    if (Array.isArray(attr)) return attr.join(", ");
    if (typeof attr === 'string') return attr;
    return String(attr);
};

const getAttrList = (attr) => {
    const str = getAttrString(attr);
    if (!str) return [];
    return str.split(",").map(s => s.trim()).filter(Boolean);
};

export default function ProductDetails() {
    const navigate = useNavigate();
    const { productId } = useParams();
    const { handleLogout } = useAuth();
    const { handleGetProductById } = useProduct();
    const user = useSelector(state => state.auth.user);
    const { handleAddToCart, handleGetCart } = useCart();

    const [qty, setQty] = useState(1);
    const [product, setProduct] = useState(null);
    const [imgOpacity, setImgOpacity] = useState(1);
    const [activeThumb, setActiveThumb] = useState(0);
    const [activeTab, setActiveTab] = useState("story");
    const [selectedSize, setSelectedSize] = useState("");
    const [notification, setNotification] = useState(null);
    const [selectedColor, setSelectedColor] = useState("");
    const [cartFeedback, setCartFeedback] = useState(false);
    const [selectedVariant, setSelectedVariant] = useState(null);

    const variants = useMemo(() => product?.variants ?? [], [product]);

    // Derived selections  
    const availableColors = useMemo(() => {
        const set = new Set();
        variants.forEach(v => {
            const list = getAttrList(v.attributes?.Color || v.attributes?.color);
            list.forEach(c => set.add(c));
        });
        return Array.from(set);
    }, [variants]);

    const availableSizes = useMemo(() => {
        const set = new Set();
        variants.forEach(v => {
            const list = getAttrList(v.attributes?.Size || v.attributes?.size);
            list.forEach(s => set.add(s));
        });
        return Array.from(set);
    }, [variants]);

    //  Variant Finder  
    const findVariant = useCallback((color, size) => {
        if (!variants.length) return null;

        // 1. Match both color and size
        if (color && size) {
            const match = variants.find(v => {
                const colorList = getAttrList(v.attributes?.Color || v.attributes?.color).map(c => c.toLowerCase());
                const sizeList = getAttrList(v.attributes?.Size || v.attributes?.size).map(s => s.toLowerCase());
                return colorList.includes(color.toLowerCase()) && sizeList.includes(size.toLowerCase());
            });
            if (match) return match;
        }

        // 2. Match by color
        if (color) {
            const match = variants.find(v => {
                const colorList = getAttrList(v.attributes?.Color || v.attributes?.color).map(c => c.toLowerCase());
                return colorList.includes(color.toLowerCase());
            });
            if (match) return match;
        }

        // 3. Match by size
        if (size) {
            const match = variants.find(v => {
                const sizeList = getAttrList(v.attributes?.Size || v.attributes?.size).map(s => s.toLowerCase());
                return sizeList.includes(size.toLowerCase());
            });
            if (match) return match;
        }

        return variants[0] || null;
    }, [variants]);

    const handleColorSelect = useCallback((color) => {
        setSelectedColor(color);
        const variant = findVariant(color, selectedSize);
        if (variant) {
            setSelectedVariant(variant);
            const variantSizes = getAttrList(variant.attributes?.Size || variant.attributes?.size);
            if (variantSizes.length && (!selectedSize || !variantSizes.map(s => s.toLowerCase()).includes(selectedSize.toLowerCase()))) {
                setSelectedSize(variantSizes[0]);
            }
        }
    }, [findVariant, selectedSize]);

    const handleSizeSelect = useCallback((size) => {
        setSelectedSize(size);
        const variant = findVariant(selectedColor, size);
        if (variant) {
            setSelectedVariant(variant);
            const variantColors = getAttrList(variant.attributes?.Color || variant.attributes?.color);
            if (variantColors.length && (!selectedColor || !variantColors.map(c => c.toLowerCase()).includes(selectedColor.toLowerCase()))) {
                setSelectedColor(variantColors[0]);
            }
        }
    }, [findVariant, selectedColor]);

    const isSizeAvailable = useCallback((size) => {
        if (!selectedColor) return true;
        return variants.some(v => {
            const colorList = getAttrList(v.attributes?.Color || v.attributes?.color).map(c => c.toLowerCase());
            const sizeList = getAttrList(v.attributes?.Size || v.attributes?.size).map(s => s.toLowerCase());
            return colorList.includes(selectedColor.toLowerCase()) && sizeList.includes(size.toLowerCase());
        });
    }, [variants, selectedColor]);

    //  Cart  
    const handleAdd = useCallback(async () => {
        // User logged in nahi hai
        if (!user) {
            navigate("/login");
            return false;
        }

        try {
            await handleAddToCart({
                productId: product?._id,
                variantId: selectedVariant?._id,
                quantity: qty,
                selectedColor,
                selectedSize,
            });

            setNotification({
                type: "success",
                message: "PRODUCT ADDED TO CART"
            });

            setCartFeedback(true);

            setTimeout(() => setCartFeedback(false), 2000);
            setTimeout(() => setNotification(null), 3000);

            return true;

        } catch (error) {
            console.error("Add to cart failed:", error);

            setNotification({
                type: "error",
                message:
                    error?.response?.data?.message ||
                    "FAILED TO ADD PRODUCT TO CART",
            });

            setTimeout(() => setNotification(null), 3000);

            return false;
        }
    }, [
        user,
        navigate,
        handleAddToCart,
        product,
        selectedVariant,
        qty,
        selectedColor,
        selectedSize
    ]);

    //  Data fetching  
    useEffect(() => {
        let cancelled = false;
        async function fetchProduct() {
            const data = await handleGetProductById(productId);
            if (cancelled) return;
            setProduct(data);
            if (data?.variants?.length) {
                const first = data.variants[0];
                setSelectedVariant(first);
                const firstColors = getAttrList(first.attributes?.Color || first.attributes?.color);
                const firstSizes = getAttrList(first.attributes?.Size || first.attributes?.size);
                setSelectedColor(firstColors[0] || "");
                setSelectedSize(firstSizes[0] || "");
            }
        }
        fetchProduct();
        return () => { cancelled = true; };
    }, [productId, handleGetProductById]);

    // Reset thumb & qty when variant changes
    useEffect(() => {
        setActiveThumb(0);
        setQty(1);
    }, [selectedVariant]);

    useEffect(() => {
        handleGetCart();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleThumbClick = useCallback((index) => {
        if (index === activeThumb) return;
        setImgOpacity(0);
        setTimeout(() => { setActiveThumb(index); setImgOpacity(1); }, 280);
    }, [activeThumb]);

    //  Loading state  
    if (!product) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4"
                style={{ background: t.surface, fontFamily: "'Hanken Grotesk', sans-serif" }}>
                <div style={{
                    width: 40, height: 40,
                    border: `3px solid ${t.outlineVariant}`,
                    borderTop: `3px solid ${t.primary}`,
                    borderRadius: "50%",
                    animation: "spin 0.8s linear infinite",
                }} />
                <p style={{ fontSize: 13, letterSpacing: "0.12em", textTransform: "uppercase", color: t.onSurfaceVariant }}>
                    Loading product…
                </p>
            </div>
        );
    }

    const images = selectedVariant?.images?.length ? selectedVariant.images : product.images || [];
    const currentImage = images[Math.min(activeThumb, Math.max(0, images.length - 1))]?.url || images[Math.min(activeThumb, Math.max(0, images.length - 1))] || "";
    const currentPrice = selectedVariant?.price ?? product.price;
    const formattedPrice = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: currentPrice?.currency || "INR",
    }).format(currentPrice?.amount || 0);

    const stock = selectedVariant?.stock ?? 0;
    const outOfStock = stock <= 0;

    const tabs = [
        { id: "story", label: "Product Story" },
        { id: "fit", label: "Fit & Care" },
        { id: "shipping", label: "Shipping & Returns" },
    ];

    const trustBadges = [
        { icon: "local_shipping", label: "Free Shipping" },
        { icon: "workspace_premium", label: "Premium Quality" },
        { icon: "verified", label: "Authentic" },
    ];

    return (
        <div style={{ background: t.surface, color: t.onSurface, fontFamily: "'Hanken Grotesk', sans-serif", minHeight: "100vh" }}>

            {/* ── NOTIFICATION TOAST  ─ */}
            {notification && (
                <div className="fixed top-20 right-4 sm:right-8 z-50">
                    <div
                        className="p-4 shadow-md flex items-center justify-between gap-4 max-w-[360px] border"
                        style={{
                            backgroundColor: notification.type === "success" ? "#f0fdf4" : "#fef2f2",
                            borderColor: notification.type === "success" ? "#bbf7d0" : "#fecaca",
                        }}
                    >
                        <div className="flex items-center gap-3">
                            {notification.type === "success" ? (
                                <svg className="w-5 h-5 text-green-700 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5 text-red-700 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            )}
                            <p className="text-xs font-medium tracking-wide text-neutral-800">{notification.message}</p>
                        </div>
                        <button onClick={() => setNotification(null)} className="text-neutral-400 hover:text-neutral-600 transition-colors flex-shrink-0">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}

            <main style={{ paddingTop: 72 }}>
                {/* HERO SECTION   */}
                <section className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16 py-8 md:py-16">
                    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">

                        {/* IMAGE GALLERY  */}
                        <div className="w-full lg:w-[58%] flex flex-col-reverse sm:flex-row gap-3">
                            {/* Thumbnail Strip */}
                            <div className="flex flex-row sm:flex-col gap-2 sm:gap-3 overflow-x-auto sm:overflow-y-auto sm:w-[80px] sm:max-h-[600px] pb-1 sm:pb-0">
                                {images.map((img, i) => {
                                    const imgUrl = typeof img === 'object' ? img?.url : img;
                                    return (
                                        <button
                                            key={img?._id || i}
                                            className="arks-thumb flex-shrink-0"
                                            onClick={() => handleThumbClick(i)}
                                            style={{
                                                border: `2px solid ${i === activeThumb ? t.primary : "transparent"}`,
                                                width: 64,
                                                minWidth: 64,
                                                aspectRatio: "3/4",
                                                background: t.surfaceContainerLow,
                                                overflow: "hidden",
                                                opacity: i === activeThumb ? 1 : 0.5,
                                                cursor: "pointer",
                                                padding: 0,
                                            }}
                                        >
                                            <img
                                                src={imgUrl}
                                                alt={`View ${i + 1}`}
                                                loading="lazy"
                                                decoding="async"
                                                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                                            />
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Main Image */}
                            <div className="flex-1 bg-[#f3f3f4] overflow-hidden relative" style={{ aspectRatio: "3/4", maxHeight: "70vh", minHeight: 320 }}>
                                <img
                                    src={currentImage}
                                    alt={product.title}
                                    style={{
                                        width: "100%", height: "100%", objectFit: "cover",
                                        transition: "opacity .3s ease", display: "block", opacity: imgOpacity,
                                    }}
                                />
                            </div>
                        </div>

                        {/* RIGHT PANEL  */}
                        <div className="w-full lg:w-[42%] flex flex-col gap-6 lg:gap-7">
                            {/* Breadcrumbs */}
                            <nav className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.1em] uppercase text-[#44474d]">
                                <a href="/" className="arks-nav-a hover:text-[#0a192f] transition-colors" style={{ color: t.onSurfaceVariant, textDecoration: "none" }}>Home</a>
                                <span>/</span><span>Collection</span><span>/</span>
                                <span style={{ color: t.primary }}>Details</span>
                            </nav>

                            {/* Title & Price */}
                            <div>
                                <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(22px,4vw,32px)", fontWeight: 400, color: t.primary, margin: "0 0 10px" }}>
                                    {product.title}
                                </h1>
                                <div className="flex items-center justify-between gap-2 flex-wrap">
                                    <span style={{ fontSize: 20, fontWeight: 600, color: t.primary }}>{formattedPrice}</span>
                                    <div className="flex items-center gap-2">
                                        <span style={{ color: t.secondary, fontSize: 14 }}>{"★★★★"}<span style={{ opacity: 0.5 }}>★</span></span>
                                        <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: t.onSurfaceVariant }}>4.8 (124)</span>
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <p style={{ fontSize: 15, lineHeight: 1.7, color: t.onSurfaceVariant, margin: 0 }}>{product.description}</p>
                            <p style={{ fontSize: 13, fontWeight: 600, color: outOfStock ? "#c62828" : "#2e7d32", marginTop: -16 }}>
                                {outOfStock ? "Out of Stock" : `${stock} in stock`}
                            </p>

                            {/* Color Selector */}
                            {availableColors.length > 0 && (
                                <div>
                                    <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: t.onSurfaceVariant, marginBottom: 10 }}>
                                        Color — <span style={{ color: t.onSurface, fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>{selectedColor}</span>
                                    </p>
                                    <div className="flex flex-wrap gap-3">
                                        {availableColors.map(color => (
                                            <button key={color} title={color} onClick={() => handleColorSelect(color)} style={{
                                                padding: "8px 16px",
                                                borderRadius: 999,
                                                cursor: "pointer",
                                                background: selectedColor?.toLowerCase() === color.toLowerCase() ? t.primary : "transparent",
                                                color: selectedColor?.toLowerCase() === color.toLowerCase() ? t.primaryText : t.onSurface,
                                                border: `1px solid ${selectedColor?.toLowerCase() === color.toLowerCase() ? t.primary : t.outlineVariant}`,
                                                transition: "all .25s",
                                                fontSize: 13,
                                                fontWeight: 500,
                                            }}>
                                                {color}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Size Selector */}
                            {availableSizes.length > 0 && (
                                <div>
                                    <div className="flex justify-between items-center mb-2.5">
                                        <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: t.onSurfaceVariant, margin: 0 }}>Select Size</p>
                                        <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: t.secondary, textDecoration: "underline", padding: 0 }}>Size Guide</button>
                                    </div>
                                    <div className="grid grid-cols-5 sm:grid-cols-5 gap-2">
                                        {availableSizes.map(size => {
                                            const isAvailable = isSizeAvailable(size);
                                            const isSelected = selectedSize?.toLowerCase() === size.toLowerCase();
                                            return (
                                                <button
                                                    key={size}
                                                    className="arks-size"
                                                    disabled={!isAvailable}
                                                    onClick={() => handleSizeSelect(size)}
                                                    style={{
                                                        padding: "10px 0",
                                                        border: `1px solid ${isSelected ? t.primary : t.outline}`,
                                                        background: isSelected ? t.primary : "transparent",
                                                        color: isSelected ? t.primaryText : t.onSurface,
                                                        opacity: isAvailable ? 1 : 0.35,
                                                        cursor: isAvailable ? "pointer" : "not-allowed",
                                                        fontFamily: "'Hanken Grotesk', sans-serif",
                                                        fontSize: 13,
                                                        fontWeight: 500,
                                                        letterSpacing: "0.05em",
                                                        transition: "all .2s",
                                                    }}
                                                >
                                                    {size}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Quantity */}
                            <div>
                                <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: t.onSurfaceVariant, marginBottom: 10 }}>Quantity</p>
                                <div className="flex items-center border border-[#c5c6cd] w-fit">
                                    <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ background: "none", border: "none", width: 40, height: 40, fontSize: 20, cursor: "pointer", color: t.onSurface }}>−</button>
                                    <span style={{ width: 48, textAlign: "center", fontSize: 15 }}>{qty}</span>
                                    <button onClick={() => setQty(q => q + 1)} style={{ background: "none", border: "none", width: 40, height: 40, fontSize: 20, cursor: "pointer", color: t.onSurface }}>+</button>
                                </div>
                            </div>

                            {/* CTA Buttons */}
                            <div className="flex flex-col gap-3">

                                {/* ADD TO CART */}
                                <button
                                    className="
                                    arks-add-btn
                                    transition-all duration-300 ease-in-out
                                    active:scale-[0.98]
                                    active:opacity-80"
                                    disabled={outOfStock}
                                    onClick={handleAdd}
                                    style={{
                                        opacity: outOfStock ? 0.5 : 1,
                                        cursor: outOfStock ? "not-allowed" : "pointer",
                                        width: "100%",
                                        padding: "16px 0",
                                        background: cartFeedback ? "#2d5a27" : t.primary,
                                        color: t.primaryText,
                                        border: "none",
                                        fontFamily: "'Hanken Grotesk', sans-serif",
                                        fontSize: 13,
                                        fontWeight: 600,
                                        letterSpacing: "0.15em",
                                        textTransform: "uppercase",
                                        transition: "background .3s ease-in-out, transform .15s ease-in-out",
                                    }}
                                >
                                    {outOfStock
                                        ? "Out of Stock"
                                        : cartFeedback
                                            ? "✓ Added to Cart"
                                            : "Add to Cart"}
                                </button>


                                {/* BUY NOW */}
                                <button
                                    className="
                                    arks-buy-btn
                                    transition-all duration-300 ease-in-out
                                    active:scale-[0.98]
                                    active:opacity-80"
                                    disabled={outOfStock}
                                    onClick={async () => {
                                        const added = await handleAdd();

                                        // Only go to cart if product was actually added
                                        if (added) {
                                            navigate("/cart");
                                        }
                                    }}
                                    style={{
                                        opacity: outOfStock ? 0.5 : 1,
                                        cursor: outOfStock ? "not-allowed" : "pointer",
                                        width: "100%",
                                        padding: "16px 0",
                                        background: "transparent",
                                        color: t.primary,
                                        border: `1px solid ${t.primary}`,
                                        fontFamily: "'Hanken Grotesk', sans-serif",
                                        fontSize: 13,
                                        fontWeight: 600,
                                        letterSpacing: "0.15em",
                                        textTransform: "uppercase",
                                        transition: "background .3s ease-in-out, transform .15s ease-in-out",
                                    }}
                                >
                                    {outOfStock ? "Out of Stock" : "Buy Now"}
                                </button>

                            </div>

                            {/* Trust Badges */}
                            <div className="grid grid-cols-3 gap-4 pt-5 border-t border-[#c5c6cd]">
                                {trustBadges.map(b => (
                                    <div key={b.label} className="flex flex-col items-center gap-1.5 text-center">
                                        <span className="material-symbols-outlined" style={{ fontSize: 22, color: t.primary }}>{b.icon}</span>
                                        <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: t.onSurfaceVariant }}>{b.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/*  TABS   */}
                <section style={{ background: "#ffffff", borderTop: `1px solid ${t.outlineVariant}`, borderBottom: `1px solid ${t.outlineVariant}` }}>
                    <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16 py-12 md:py-16">
                        {/* Tab headers — horizontally scrollable on mobile */}
                        <div className="flex gap-8 md:gap-16 mb-10 border-b border-[#c5c6cd] overflow-x-auto pb-px scrollbar-hide justify-start md:justify-center">
                            {tabs.map(tb => (
                                <button
                                    key={tb.id}
                                    className="arks-tab flex-shrink-0"
                                    onClick={() => setActiveTab(tb.id)}
                                    style={{
                                        paddingBottom: 16,
                                        fontFamily: "'Hanken Grotesk', sans-serif",
                                        fontSize: 11, fontWeight: 600,
                                        letterSpacing: "0.18em", textTransform: "uppercase",
                                        background: "none", border: "none",
                                        borderBottom: `2px solid ${activeTab === tb.id ? t.primary : "transparent"}`,
                                        color: activeTab === tb.id ? t.primary : t.onSurfaceVariant,
                                        cursor: "pointer", transition: "all .25s",
                                        marginBottom: -1,
                                    }}
                                >
                                    {tb.label}
                                </button>
                            ))}
                        </div>

                        {/* Tab content */}
                        <div className="max-w-[720px] mx-auto">
                            {activeTab === "story" && (
                                <>
                                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 500, textAlign: "center", marginBottom: 20, color: t.onSurface }}>Uncompromising Quality</h3>
                                    <p style={{ fontSize: 15, lineHeight: 1.7, color: t.onSurfaceVariant, textAlign: "center" }}>{product.description} Crafted with precision and care, this piece represents the finest in everyday luxury — built to last season after season.</p>
                                </>
                            )}
                            {activeTab === "fit" && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 sm:gap-12">
                                    <div>
                                        <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: t.primary, marginBottom: 12 }}>The Fit</p>
                                        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10, fontSize: 15, color: t.onSurfaceVariant }}>
                                            <li>• Tailored athletic silhouette</li><li>• Slightly tapered waist</li><li>• Mid-bicep sleeve length</li><li>• Model 6'2" wearing size M</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: t.primary, marginBottom: 12 }}>Care Instructions</p>
                                        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10, fontSize: 15, color: t.onSurfaceVariant }}>
                                            <li>• Machine wash cold, inside out</li><li>• Use mild detergent only</li><li>• Do not tumble dry</li><li>• Cool iron if necessary</li>
                                        </ul>
                                    </div>
                                </div>
                            )}
                            {activeTab === "shipping" && (
                                <div style={{ textAlign: "center" }}>
                                    <p style={{ fontSize: 15, lineHeight: 1.7, color: t.onSurfaceVariant }}>Complimentary express shipping on all orders over ₹2,000. Orders processed within 24 hours.</p>
                                    <div className="flex justify-center gap-12 sm:gap-16 py-5 border-t border-b border-[#c5c6cd] my-4">
                                        <div><p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: t.primary, marginBottom: 4 }}>Domestic</p><p style={{ color: t.onSurfaceVariant, fontSize: 14, margin: 0 }}>2–3 Business Days</p></div>
                                        <div><p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: t.primary, marginBottom: 4 }}>International</p><p style={{ color: t.onSurfaceVariant, fontSize: 14, margin: 0 }}>5–7 Business Days</p></div>
                                    </div>
                                    <p style={{ fontSize: 14, lineHeight: 1.7, color: t.onSurfaceVariant, fontStyle: "italic" }}>30-day window for returns. Items must be in original condition with tags attached.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/*  HERITAGE SECTION  */}
                <section className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16 py-12 md:py-20">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center" style={{ background: t.surfaceContainerLow, padding: "clamp(24px,5vw,64px)" }}>
                        <div className="aspect-video overflow-hidden">
                            <img
                                src={images[1]?.url || images[0]?.url || images[0]}
                                alt="Seller showcase"
                                loading="lazy"
                                decoding="async"
                                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                            />
                        </div>
                        <div>
                            <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.25em", textTransform: "uppercase", color: t.secondary, marginBottom: 12 }}>The Maison</p>
                            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(22px,3vw,32px)", fontWeight: 400, color: t.primary, marginBottom: 16 }}>ARCH Heritage</h2>
                            <p style={{ fontSize: 15, lineHeight: 1.7, color: t.onSurfaceVariant }}>Founded on the principles of quiet luxury and artisanal precision, ARCH has been redefining the modern wardrobe. We believe that true quality is found in the details — the reinforced seam, the hand-finished buttonhole, the perfect weight of a drape.</p>
                        </div>
                    </div>
                </section>
            </main>

            {/*  FOOTER  */}
            <footer className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 flex-wrap px-4 sm:px-8 lg:px-16 py-10"
                style={{ background: t.surface, borderTop: `1px solid ${t.outlineVariant}` }}>
                <div>
                    <a href="/" style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: t.primary, textDecoration: "none" }}>ARCH</a>
                    <p style={{ fontSize: 11, color: t.onSurfaceVariant, letterSpacing: "0.06em", textTransform: "uppercase", marginTop: 8, marginBottom: 0 }}>© 2026 ARCH. All Rights Reserved.</p>
                </div>
                <div className="flex flex-wrap gap-5 sm:gap-8">
                    {["Shipping", "Returns", "Size Guide", "Newsletter", "Privacy", "Terms"].map(l => (
                        <a key={l} href="#" className="arks-nav-a" style={{ fontSize: 13, color: t.onSurfaceVariant, textDecoration: "none" }}>{l}</a>
                    ))}
                </div>
            </footer>
        </div>
    );
}