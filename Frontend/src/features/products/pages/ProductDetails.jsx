import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useProduct } from "../hook/useProduct";

/* ─── Design tokens (Midnight Atelier – from Stitch output) ─── */
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

// const COLORS = [
//     { name: "Midnight Navy", hex: "#000080" },
//     { name: "Slate Gray", hex: "#708090" },
//     { name: "Pure White", hex: "#FFFFFF" },
// ];

// const SIZES = ["S", "M", "L", "XL", "XXL"];


export default function ProductDetails() {
    const { productId } = useParams();

    const [product, setProduct] = useState(null);

    const [activeThumb, setActiveThumb] = useState(0);

    const [imgOpacity, setImgOpacity] = useState(1);

    const [selectedVariant, setSelectedVariant] = useState(null);

    const [selectedColor, setSelectedColor] = useState("");

    const [selectedSize, setSelectedSize] = useState("");

    const [qty, setQty] = useState(1);

    const [activeTab, setActiveTab] = useState("story");

    const [cartFeedback, setCartFeedback] = useState(false);

    const { handleGetProductById } = useProduct();

    const variants = product?.variants ?? [];

    const availableColors = [
        ...new Set(
            variants
                .map(v => v.attributes?.Color?.[0])
                .filter(Boolean)
        )
    ];

    const availableSizes = [
        ...new Set(
            variants.flatMap(v =>
                (v.attributes?.Size?.[0] || "")
                    .split(",")
                    .map(size => size.trim())
                    .filter(Boolean)
            )
        )
    ];

    function findVariant(color, size) {

        return variants.find(v => {

            const sizes =
                (v.attributes?.Size?.[0] || "")
                    .split(",")
                    .map(s => s.trim());

            return (
                v.attributes?.Color === color &&
                sizes.includes(size)
            );
        });

    }

    function handleColorSelect(color) {

        setSelectedColor(color);

        let variant = findVariant(color, selectedSize);

        if (!variant) {

            variant = variants.find(
                v => v.attributes?.Color?.[0] === color
            );

            if (!variant) return;

            const firstSize = (variant.attributes?.Size?.[0] || "").split(",")[0]
                .trim();

            setSelectedSize(firstSize);
        }

        setSelectedVariant(variant);

    }

    function handleSizeSelect(size) {

        setSelectedSize(size);

        let variant = findVariant(selectedColor, size);

        if (!variant) {

            variant = variants.find(v => {

                const sizes = (v.attributes?.Size?.[0] || "").split(",").map(s => s.trim());

                return (
                    v.attributes?.Color?.[0] === color &&
                    sizes.includes(size)
                );

            });

            if (!variant) return;

            setSelectedColor(
                variant.attributes?.Color?.[0] || ""
            );

        }

        setSelectedVariant(variant);

    }

    useEffect(() => {

        async function fetchProduct() {

            const data = await handleGetProductById(productId);
            console.log(data.variants);
            console.log(data.variants[0].attributes);
            console.log(data.variants[0].attributes.Size);
            setProduct(data);

            if (data?.variants?.length) {

                const firstVariant = data.variants[0];

                setSelectedVariant(firstVariant);

                setSelectedColor(firstVariant.attributes?.Color?.[0] || "");

                const firstSize =
                    (firstVariant.attributes?.Size?.[0] || "")
                        .split(",")[0]
                        .trim();
                setSelectedSize(firstSize || "");

            }

        }

        fetchProduct();

    }, [productId]);

    useEffect(() => {
        setActiveThumb(0);
    }, [selectedVariant]);

    useEffect(() => {
        setQty(1);

    }, [selectedVariant]);

    function handleThumbClick(index) {
        if (index === activeThumb) return;
        setImgOpacity(0);
        setTimeout(() => { setActiveThumb(index); setImgOpacity(1); }, 280);
    }

    function handleAddToCart() {
        setCartFeedback(true);
        setTimeout(() => setCartFeedback(false), 2000);
    }

    if (!product) {
        return (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: t.surface, gap: 16, fontFamily: "'Hanken Grotesk',sans-serif" }}>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                <div style={{ width: 40, height: 40, border: `3px solid ${t.outlineVariant}`, borderTop: `3px solid ${t.primary}`, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                <p style={{ fontSize: 13, letterSpacing: "0.12em", textTransform: "uppercase", color: t.onSurfaceVariant }}>Loading product…</p>
            </div>
        );
    }
    const images =
        selectedVariant?.images?.length
            ? selectedVariant.images
            : product.images || [];

    const currentImage =
        images[Math.min(activeThumb, images.length - 1)]?.url || "";;

    const currentPrice =
        selectedVariant?.price ?? product.price;

    const formattedPrice = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: currentPrice?.currency || "INR",
    }).format(currentPrice?.amount || 0);

    const stock =
        selectedVariant?.stock ?? 0;

    const outOfStock = stock <= 0;
    return (
        <div style={{ background: t.surface, color: t.onSurface, fontFamily: "'Hanken Grotesk',sans-serif", minHeight: "100vh" }}>
            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
                .arks-add-btn:hover { background: #1a3a5c !important; }
                .arks-buy-btn:hover { background: #f3f3f4 !important; }
                .arks-thumb:hover { opacity: 1 !important; }
                .arks-nav-a:hover { color: ${t.primary} !important; }
                .arks-size:hover { border-color: ${t.primary} !important; }
                .arks-tab:hover { color: ${t.primary} !important; }
                .material-symbols-outlined {
                    font-family: 'Material Symbols Outlined';
                    font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
                    vertical-align: middle; font-style: normal;
                    font-size: inherit; display: inline-block;
                }
                .star-filled { font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 20; }
            `}</style>

            {/* ── NAV ── */}
            <nav style={{ position: "fixed", top: 0, width: "100%", zIndex: 50, background: "rgba(249,249,249,0.88)", backdropFilter: "blur(12px)", borderBottom: `1px solid ${t.outlineVariant}`, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 64px", height: 72, boxSizing: "border-box" }}>
                <a href="/" style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, fontWeight: 700, color: t.primary, textDecoration: "none", letterSpacing: "-0.02em" }}>ARKS</a>
                <div style={{ display: "flex", gap: 40 }}>
                    {["Collections", "New Arrivals", "Heritage", "Bespoke"].map(l => (
                        <a key={l} href="#" className="arks-nav-a" style={{ fontSize: 13, color: t.onSurfaceVariant, textDecoration: "none", transition: "color .2s" }}>{l}</a>
                    ))}
                </div>
                <div style={{ display: "flex", gap: 20 }}>
                    <button style={{ background: "none", border: "none", cursor: "pointer", color: t.primary, fontSize: 22, display: "flex" }} title="Cart">
                        <span className="material-symbols-outlined" style={{ fontSize: 22 }}>shopping_bag</span>
                    </button>
                    <button style={{ background: "none", border: "none", cursor: "pointer", color: t.primary, fontSize: 22, display: "flex" }} title="Account">
                        <span className="material-symbols-outlined" style={{ fontSize: 22 }}>person</span>
                    </button>
                </div>
            </nav>

            <main style={{ paddingTop: 72 }}>
                {/* ── HERO ── */}
                <section style={{ maxWidth: 1440, margin: "0 auto", padding: "80px 64px", display: "grid", gridTemplateColumns: "7fr 5fr", gap: 48, boxSizing: "border-box" }}>

                    {/* Gallery */}
                    <div style={{ display: "flex", flexDirection: "row-reverse", gap: 16, height: 680 }}>
                        {/* Main image */}
                        <div style={{ flex: 1, background: t.surfaceContainerLow, overflow: "hidden", position: "relative" }}>
                            <img src={currentImage} alt={product.title} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "opacity .3s ease", display: "block", opacity: imgOpacity }} />
                        </div>
                        {/* Thumbnails */}
                        <div style={{ width: 90, display: "flex", flexDirection: "column", gap: 12, overflowY: "auto" }}>
                            {images.map((img, i) => (
                                <button key={img._id || i} className="arks-thumb"
                                    onClick={() => handleThumbClick(i)}
                                    style={{ border: `2px solid ${i === activeThumb ? t.primary : "transparent"}`, width: "100%", aspectRatio: "3/4", background: t.surfaceContainerLow, overflow: "hidden", opacity: i === activeThumb ? 1 : 0.5, cursor: "pointer", transition: "opacity .25s, border-color .25s", padding: 0 }}>
                                    <img src={img.url} alt={`View ${i + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right panel */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
                        {/* Breadcrumbs */}
                        <nav style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: t.onSurfaceVariant }}>
                            <a href="/" className="arks-nav-a" style={{ color: t.onSurfaceVariant, textDecoration: "none" }}>HOME</a>
                            <span>/</span><span>MEN</span><span>/</span>
                            <span style={{ color: t.primary }}>POLOS</span>
                        </nav>

                        {/* Title & Price */}
                        <div>
                            <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 32, fontWeight: 400, color: t.primary, margin: "0 0 10px" }}>{product.title}</h1>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <span style={{ fontSize: 20, fontWeight: 600, color: t.primary }}>{formattedPrice}</span>
                                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                    <span style={{ color: t.secondary, fontSize: 14 }}>
                                        {"★★★★"}<span style={{ opacity: 0.5 }}>★</span>
                                    </span>
                                    <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: t.onSurfaceVariant }}>4.8 (124)</span>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <p style={{ fontSize: 15, lineHeight: 1.7, color: t.onSurfaceVariant, margin: 0 }}>{product.description}</p>
                        <p style={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: outOfStock ? "#c62828" : "#2e7d32",
                            marginTop: -12
                        }}
                        >
                            {outOfStock
                                ? "Out of Stock"
                                : `${stock} in stock`}
                        </p>

                        {/* Color Selector */}
                        <div>
                            <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: t.onSurfaceVariant, marginBottom: 10 }}>
                                Color — <span
                                    style={{
                                        color: t.onSurface,
                                        fontWeight: 400,
                                        textTransform: "none",
                                        letterSpacing: 0
                                    }}
                                >
                                    {selectedColor}
                                </span>                            </p>
                            <div style={{ display: "flex", gap: 12 }}>
                                {availableColors.map(color => (
                                    <button
                                        key={color}
                                        title={color}
                                        onClick={() => handleColorSelect(color)}
                                        style={{
                                            padding: "10px 18px",
                                            borderRadius: 999,
                                            cursor: "pointer",

                                            background:
                                                selectedColor === color
                                                    ? t.primary
                                                    : "transparent",

                                            color:
                                                selectedColor === color
                                                    ? t.primaryText
                                                    : t.onSurface,

                                            border:
                                                `1px solid ${selectedColor === color
                                                    ? t.primary
                                                    : t.outlineVariant
                                                }`,

                                            transition: "all .25s",
                                            fontSize: 13,
                                            fontWeight: 500
                                        }}
                                    >

                                        {color}

                                    </button>

                                ))}
                            </div>
                        </div>

                        {/* Size Selector */}
                        <div>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                                <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: t.onSurfaceVariant, margin: 0 }}>Select Size</p>
                                <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: t.secondary, textDecoration: "underline", padding: 0 }}>Size Guide</button>
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 8 }}>
                                {availableSizes.map(size => {
                                    const isAvailable = variants.some(v => {

                                        const sizes = (v.attributes?.Size?.[0] || "")
                                            .split(",")
                                            .map(s => s.trim());

                                        return (
                                            v.attributes?.Color?.[0] === selectedColor &&
                                            sizes.includes(size)
                                        );

                                    });

                                    return (

                                        <button
                                            key={size}
                                            className="arks-size"
                                            disabled={!isAvailable}
                                            onClick={() => handleSizeSelect(size)}
                                            style={{
                                                padding: "10px 0",

                                                border:
                                                    `1px solid ${selectedSize === size
                                                        ? t.primary
                                                        : t.outline
                                                    }`,

                                                background:
                                                    selectedSize === size
                                                        ? t.primary
                                                        : "transparent",

                                                color:
                                                    selectedSize === size
                                                        ? t.primaryText
                                                        : t.onSurface,

                                                opacity:
                                                    isAvailable
                                                        ? 1
                                                        : 0.35,

                                                cursor:
                                                    isAvailable
                                                        ? "pointer"
                                                        : "not-allowed",

                                                fontFamily:
                                                    "'Hanken Grotesk',sans-serif",

                                                fontSize: 13,

                                                fontWeight: 500,

                                                letterSpacing: "0.05em",

                                                transition: "all .2s"
                                            }}
                                        >

                                            {size}

                                        </button>

                                    );

                                })}
                            </div>
                        </div>

                        {/* Quantity */}
                        <div>
                            <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: t.onSurfaceVariant, marginBottom: 10 }}>Quantity</p>
                            <div style={{ display: "flex", alignItems: "center", border: `1px solid ${t.outlineVariant}`, width: "fit-content" }}>
                                <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ background: "none", border: "none", width: 40, height: 40, fontSize: 20, cursor: "pointer", color: t.onSurface }}>−</button>
                                <span style={{ width: 48, textAlign: "center", fontSize: 15 }}>{qty}</span>
                                <button onClick={() => setQty(q => q + 1)} style={{ background: "none", border: "none", width: 40, height: 40, fontSize: 20, cursor: "pointer", color: t.onSurface }}>+</button>
                            </div>
                        </div>

                        {/* CTA Buttons */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                            <button className="arks-add-btn" disabled={outOfStock} onClick={handleAddToCart}
                                style={{ opacity: outOfStock ? 0.5 : 1, cursor: outOfStock ? "not-allowed" : "pointer", width: "100%", padding: "18px 0", background: cartFeedback ? "#2d5a27" : t.primary, color: t.primaryText, border: "none", fontFamily: "'Hanken Grotesk',sans-serif", fontSize: 13, fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", transition: "background .3s" }}>
                                {outOfStock
                                    ? "Out of Stock"
                                    : cartFeedback
                                        ? "✓ Added to Cart"
                                        : "Add to Cart"}
                            </button>
                            <button className="arks-buy-btn" disabled={outOfStock}
                                style={{ opacity: outOfStock ? 0.5 : 1, cursor: outOfStock ? "not-allowed" : "pointer", width: "100%", padding: "18px 0", background: "transparent", color: t.primary, border: `1px solid ${t.primary}`, fontFamily: "'Hanken Grotesk',sans-serif", fontSize: 13, fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", transition: "background .3s" }}>
                                {outOfStock ? "Out of Stock" : "Buy Now"}
                            </button>
                        </div>

                        {/* Trust Badges */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, paddingTop: 20, borderTop: `1px solid ${t.outlineVariant}` }}>
                            {[{ icon: "local_shipping", label: "Free Shipping" }, { icon: "workspace_premium", label: "Premium Quality" }, { icon: "verified", label: "Authentic" }].map(b => (
                                <div key={b.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, textAlign: "center" }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: 22, color: t.primary }}>{b.icon}</span>
                                    <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: t.onSurfaceVariant }}>{b.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── TABS ── */}
                <section style={{ background: "#ffffff", borderTop: `1px solid ${t.outlineVariant}`, borderBottom: `1px solid ${t.outlineVariant}` }}>
                    <div style={{ maxWidth: 1440, margin: "0 auto", padding: "64px 64px", boxSizing: "border-box" }}>
                        <div style={{ display: "flex", justifyContent: "center", gap: 64, marginBottom: 40, borderBottom: `1px solid ${t.outlineVariant}` }}>
                            {[{ id: "story", label: "Product Story" }, { id: "fit", label: "Fit & Care" }, { id: "shipping", label: "Shipping & Returns" }].map(tb => (
                                <button key={tb.id} className="arks-tab" onClick={() => setActiveTab(tb.id)}
                                    style={{ paddingBottom: 16, fontFamily: "'Hanken Grotesk',sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", background: "none", border: "none", borderBottom: `2px solid ${activeTab === tb.id ? t.primary : "transparent"}`, color: activeTab === tb.id ? t.primary : t.onSurfaceVariant, cursor: "pointer", transition: "all .25s", marginBottom: -1 }}>
                                    {tb.label}
                                </button>
                            ))}
                        </div>
                        <div style={{ maxWidth: 720, margin: "0 auto" }}>
                            {activeTab === "story" && (
                                <>
                                    <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, fontWeight: 500, textAlign: "center", marginBottom: 20, color: t.onSurface }}>Uncompromising Quality</h3>
                                    <p style={{ fontSize: 16, lineHeight: 1.7, color: t.onSurfaceVariant, textAlign: "center" }}>{product.description} Crafted with precision and care, this polo represents the finest in everyday luxury — built to last season after season.</p>
                                </>
                            )}
                            {activeTab === "fit" && (
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48 }}>
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
                                    <p style={{ fontSize: 16, lineHeight: 1.7, color: t.onSurfaceVariant }}>Complimentary express shipping on all orders over $150. Orders processed within 24 hours.</p>
                                    <div style={{ display: "flex", justifyContent: "center", gap: 64, padding: "20px 0", borderTop: `1px solid ${t.outlineVariant}`, borderBottom: `1px solid ${t.outlineVariant}`, margin: "16px 0" }}>
                                        <div><p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: t.primary, marginBottom: 4 }}>Domestic</p><p style={{ color: t.onSurfaceVariant, fontSize: 14, margin: 0 }}>2–3 Business Days</p></div>
                                        <div><p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: t.primary, marginBottom: 4 }}>International</p><p style={{ color: t.onSurfaceVariant, fontSize: 14, margin: 0 }}>5–7 Business Days</p></div>
                                    </div>
                                    <p style={{ fontSize: 14, lineHeight: 1.7, color: t.onSurfaceVariant, fontStyle: "italic" }}>30-day window for returns. Items must be in original condition with tags attached.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* ── SELLER ── */}
                <section style={{ maxWidth: 1440, margin: "0 auto", padding: "80px 64px", boxSizing: "border-box" }}>
                    <div style={{ background: t.surfaceContainerLow, padding: 64, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
                        <div style={{ aspectRatio: "16/9", overflow: "hidden" }}>
                            <img src={images[1]?.url || images[0]?.url} alt="Seller showcase" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                        </div>
                        <div>
                            <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.25em", textTransform: "uppercase", color: t.secondary, marginBottom: 12 }}>The Maison</p>
                            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 32, fontWeight: 400, color: t.primary, marginBottom: 16 }}>ARKS Heritage</h2>
                            <p style={{ fontSize: 15, lineHeight: 1.7, color: t.onSurfaceVariant }}>Founded on the principles of quiet luxury and artisanal precision, ARKS has been redefining the modern wardrobe. We believe that true quality is found in the details — the reinforced seam, the hand-finished buttonhole, the perfect weight of a drape.</p>
                        </div>
                    </div>
                </section>
            </main>

            {/* ── FOOTER ── */}
            <footer style={{ background: t.surface, borderTop: `1px solid ${t.outlineVariant}`, padding: "48px 64px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 24 }}>
                <div>
                    <a href="/" style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 700, color: t.primary, textDecoration: "none" }}>ARKS</a>
                    <p style={{ fontSize: 11, color: t.onSurfaceVariant, letterSpacing: "0.06em", textTransform: "uppercase", marginTop: 8, marginBottom: 0 }}>© 2025 ARKS. All Rights Reserved.</p>
                </div>
                <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
                    {["Shipping", "Returns", "Size Guide", "Newsletter", "Privacy", "Terms"].map(l => (
                        <a key={l} href="#" className="arks-nav-a" style={{ fontSize: 13, color: t.onSurfaceVariant, textDecoration: "none" }}>{l}</a>
                    ))}
                </div>
            </footer>
        </div>
    );
}