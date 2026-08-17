import React, { useEffect } from 'react';
import { useCart } from '../hook/useCart';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useRazorpay, RazorpayOrderOptions } from "react-razorpay";


const t = {
    primary: "#0a192f",
    primaryText: "#ffffff",
    secondary: "#735c00",
    surface: "#fbf9f6",
    surfaceContainerLow: "#f5f3f0",
    surfaceContainer: "#eeeeee",
    onSurface: "#1b1c1a",
    onSurfaceVariant: "#7A6E63",
    outline: "#75777e",
    outlineVariant: "#e4e2df",
    accentGold: "#C9A96E",
    accentRed: "#b71c1c",
};

export default function Cart() {

    const {
        handleGetCart,
        handleCartOrder,
        handleVerifyOrder,
        handleRemoveCartItem,
        handleIncreaseCartItem,
        handleDecreaseCartItem,
    } = useCart();

    const navigate = useNavigate();
    const cart = useSelector(state => state.cart)
    const user = useSelector(state => state.auth.user);
    const { error, isLoading, Razorpay } = useRazorpay();

    const handleCheckOut = async () => {
        const response = await handleCartOrder();

        console.log("Orderamount:", response.order.amount);
        console.log("Ordercurrency:", response.order.currency);
        console.log("Order ID:", response.order.id);

        const options = {
            key: "rzp_test_TQWa86qmNQxtTo",
            amount: response.order.amount,
            currency: response.order.currency,
            name: "ARKS",
            description: "Test Transaction",

            // ✅ FIX
            order_id: response.order.id,

            handler: async (response) => {
                const isValid = await handleVerifyOrder(response)
                if (isValid) {
                    navigate(`/order-success?order_id=${response?.razorpay_order_id}`)
                }
            },

            prefill: {
                name: user?.fullname,
                email: user?.email,
                contact: user?.contact,
            },

            theme: {
                color: t.primary,
            },
        };

        const razorpayInstance = new Razorpay(options);
        razorpayInstance.open();
    };

    useEffect(() => {
        handleGetCart();
    }, []);

    const getSelectedVariant = (item) => {
        return item?.product?.variants;
    };
    const getItemImage = (item) => {
        const variant = getSelectedVariant(item);

        if (variant?.images?.[0]?.url) {
            return variant.images[0].url;
        }

        if (item.product?.images?.[0]?.url) {
            return item.product.images[0].url;
        }

        return "/arks_hero_editorial.png";
    };

    const getItemTitle = (item) => {
        return item.product?.title || "ARKS Luxury Garment";
    };

    const getItemVariantDetails = (item) => {
        const variant = getSelectedVariant(item);
        if (!variant) return "Standard Edition";
        const color = variant.attributes?.Color?.[0];
        const size = variant.attributes?.Size?.[0];



        const details = [];

        if (color) details.push(`Color: ${color}`);
        if (size) details.push(`Size: ${size}`);

        return details.length
            ? details.join(" • ")
            : "Standard Edition";
    };

    const getItemUnitPrice = (item) => {
        return item.price?.amount ?? 0;
    };

    const getItemCurrency = (item) => {
        return item.price?.currency || "INR";
    };

    const shippingCost = cart.totalPrice > 2000 ? 0 : 250;

    return (
        <div style={{ background: t.surface, color: t.onSurface, fontFamily: "'Hanken Grotesk', sans-serif", minHeight: "100vh" }}>
            <style>{`
                    @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
                    .arks-cart-container { animation: fadeIn 0.4s ease-out forwards; }
                    .arks-nav-link:hover { color: ${t.primary} !important; }
                    .arks-qty-btn:hover { background-color: ${t.outlineVariant} !important; }
                    .arks-remove-btn:hover { color: ${t.accentRed} !important; border-color: ${t.accentRed} !important; }
                    .arks-checkout-btn:hover { background-color: #1a3a5c !important; transform: translateY(-1px); }
                    .arks-checkout-btn:active { transform: translateY(0); }
                    .material-symbols-outlined {
                        font-family: 'Material Symbols Outlined';
                        font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
                        vertical-align: middle; display: inline-block;
                    }
                `}</style>
            {/* Navigation Bar */}
            <nav style={{ position: "fixed", top: 0, width: "100%", zIndex: 50, background: "rgba(251,249,246,0.92)", backdropFilter: "blur(12px)", borderBottom: `1px solid ${t.outlineVariant}`, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 48px", height: 72, boxSizing: "border-box" }}>
                <Link to="/" style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, color: t.primary, textDecoration: "none", letterSpacing: "-0.02em" }}>
                    ARKS
                </Link>
                <div style={{ display: "flex", gap: 36 }} className="hidden md:flex">
                    <Link to="/" className="arks-nav-link" style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.2em", color: t.onSurfaceVariant, textDecoration: "none" }}>Home</Link>
                    <Link to="/" className="arks-nav-link" style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.2em", color: t.onSurfaceVariant, textDecoration: "none" }}>Collections</Link>
                    <Link to="/" className="arks-nav-link" style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.2em", color: t.onSurfaceVariant, textDecoration: "none" }}>Atelier</Link>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
                    <span style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.15em", color: t.accentGold, fontWeight: 600 }}>
                        {user?.fullname?.split(' ')[0] ? `Hi, ${user.fullname.split(' ')[0]}` : 'Guest Member'}
                    </span>
                    <button onClick={() => navigate('/cart')} style={{ background: "none", border: "none", cursor: "pointer", color: t.primary, position: "relative", display: "flex" }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 24 }}>shopping_bag</span>
                        {cart.items.length > 0 && (
                            <span style={{ position: "absolute", top: -4, right: -6, background: t.accentGold, color: t.primary, fontSize: 10, fontWeight: 700, borderRadius: "50%", width: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                {cart.items.length}
                            </span>
                        )}
                    </button>
                </div>
            </nav>
            {/* Main Content */}
            <main style={{ paddingTop: 96, paddingBottom: 80 }} className="arks-cart-container">
                <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>

                    {/* Header */}
                    <div style={{ marginBottom: 40, borderBottom: `1px solid ${t.outlineVariant}`, paddingBottom: 24 }}>
                        <span style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.3em", color: t.accentGold, fontWeight: 600, display: "block", marginBottom: 8 }}>
                            Haute Couture Vault
                        </span>
                        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, fontWeight: 400, color: t.primary, margin: 0 }}>
                            Shopping Bag
                        </h1>
                        <p style={{ fontSize: 13, color: t.onSurfaceVariant, marginTop: 8 }}>
                            {cart.items.length === 1 ? '1 bespoke item reserved' : `${cart.items.length} bespoke items reserved`}
                        </p>
                    </div>
                    {cart.items.length === 0 ? (
                        /* Empty Cart State */
                        <div style={{ textAlign: "center", padding: "80px 24px", background: t.surfaceContainerLow, border: `1px solid ${t.outlineVariant}`, borderRadius: 4 }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 64, color: t.onSurfaceVariant, marginBottom: 16 }}>
                                shopping_bag
                            </span>
                            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 400, color: t.primary, marginBottom: 12 }}>
                                Your shopping bag is empty
                            </h2>
                            <p style={{ fontSize: 14, color: t.onSurfaceVariant, maxWidth: 420, margin: "0 auto 32px", lineHeight: 1.6 }}>
                                Explore our latest runway collection and reserve handcrafted garments built for timeless style.
                            </p>
                            <Link to="/" style={{ display: "inline-block", padding: "16px 36px", background: t.primary, color: t.primaryText, textDecoration: "none", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.2em", fontWeight: 600, transition: "background 0.3s" }}>
                                Discover Collection
                            </Link>
                        </div>
                    ) : (
                        /* Cart Grid with Items & Summary */
                        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 48 }} className="lg:grid-cols-12">

                            {/* Items List (Left / Main Panel - 7 columns) */}
                            <div className="lg:col-span-7" style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                                {cart.items?.map((item, index) => {
                                    const unitPrice = getItemUnitPrice(item);
                                    const itemCur = getItemCurrency(item);
                                    const subtotal = unitPrice * (item.quantity || 1);
                                    const variantText = getItemVariantDetails(item);
                                    const prodId = typeof item.product === 'object' ? item.product?._id : item.product;
                                    const varId = typeof item.variant === 'object' ? item.variant?._id : item.variant;
                                    const variantPrice = getSelectedVariant(item).price?.amount;

                                    return (
                                        <div key={item._id || `${prodId}-${varId}-${index}`} style={{ display: "flex", gap: 20, padding: 24, background: "#ffffff", border: `1px solid ${t.outlineVariant}`, borderRadius: 4, transition: "box-shadow 0.2s" }}>

                                            {/* Product Image */}
                                            <div style={{ width: 110, height: 140, flexShrink: 0, background: t.surfaceContainerLow, overflow: "hidden", borderRadius: 2, position: "relative" }}>
                                                <img
                                                    src={getItemImage(item)}
                                                    alt={getItemTitle(item)}
                                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                                />
                                            </div>
                                            {/* Item Details & Controls */}
                                            <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                                                <div>
                                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                                                        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 500, color: t.primary, margin: 0 }}>
                                                            {getItemTitle(item)}
                                                        </h3>
                                                        <span style={{ fontSize: 15, fontWeight: 600, color: t.primary }}>
                                                            {getItemCurrency(itemCur)}
                                                        </span>
                                                    </div>
                                                    {variantText && (
                                                        <p style={{ fontSize: 12, color: t.onSurfaceVariant, marginTop: 6, marginBottom: 0 }}>
                                                            {variantText}
                                                        </p>
                                                    )}

                                                    <p style={{ fontSize: 12, color: t.onSurfaceVariant, marginTop: 4 }}>
                                                        Unit Price: <span style={{ fontWeight: 500, color: t.onSurface }}>{getItemUnitPrice(item)}</span>
                                                    </p>
                                                    {
                                                        unitPrice !== variantPrice && (
                                                            <>
                                                                {unitPrice > variantPrice
                                                                    ? <p className="text-[10px] uppercase tracking-[0.15em] mb-4 mt-3 text-green-800 font-bold " > you will get this at {variantPrice} {itemCur} save {Math.abs(variantPrice - unitPrice)}.🎉  </p>
                                                                    : <p className="text-[10px] uppercase tracking-[0.15em] mb-4 mt-3 text-red-600 font-bold" > Warning this product will cost you {Math.abs(variantPrice - unitPrice)} more.  </p>
                                                                }
                                                            </>
                                                        )
                                                    }

                                                </div>
                                                {/* Bottom Row: Quantity controls & Remove */}
                                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16 }}>
                                                    {/* Quantity Control */}
                                                    <div style={{ display: "flex", alignItems: "center", border: `1px solid ${t.outlineVariant}`, borderRadius: 2, overflow: "hidden" }}>
                                                        <button
                                                            className="arks-qty-btn"
                                                            onClick={() => {
                                                                if (item.quantity > 1) {
                                                                    handleDecreaseCartItem({ productId: prodId, variantId: varId });
                                                                } else {
                                                                    handleRemoveCartItem({ productId: prodId, variantId: varId });
                                                                }
                                                            }}
                                                            style={{ width: 32, height: 32, background: "none", border: "none", cursor: "pointer", fontSize: 16, color: t.onSurface, transition: "background 0.2s" }}
                                                        >
                                                            −
                                                        </button>
                                                        <span style={{ width: 36, textAlign: "center", fontSize: 13, fontWeight: 600 }}>
                                                            {item.quantity}
                                                        </span>
                                                        <button
                                                            className="arks-qty-btn"
                                                            onClick={() => handleIncreaseCartItem({ productId: prodId, variantId: varId })}
                                                            style={{ width: 32, height: 32, background: "none", border: "none", cursor: "pointer", fontSize: 16, color: t.onSurface, transition: "background 0.2s" }}
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                    {/* Remove Button */}
                                                    <button
                                                        className="arks-remove-btn"
                                                        onClick={() => handleRemoveCartItem({ productId: prodId, variantId: varId })}
                                                        style={{ background: "none", border: `1px solid ${t.outlineVariant}`, padding: "6px 12px", borderRadius: 2, cursor: "pointer", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", color: t.onSurfaceVariant, transition: "all 0.2s" }}
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            {/* Order Summary (Right Panel - 5 columns) */}
                            <div className="lg:col-span-5">
                                <div style={{ position: "sticky", top: 96, background: "#ffffff", border: `1px solid ${t.outlineVariant}`, padding: 32, borderRadius: 4 }}>
                                    <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 500, color: t.primary, marginTop: 0, marginBottom: 24, paddingBottom: 16, borderBottom: `1px solid ${t.outlineVariant}` }}>
                                        Order Summary
                                    </h2>
                                    <div style={{ display: "flex", flexDirection: "column", gap: 16, fontSize: 14 }}>
                                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                                            <span style={{ color: t.onSurfaceVariant }}>Bag Subtotal</span>
                                            <span style={{ fontWeight: 600, color: t.onSurface }}>{cart.totalPrice}</span>
                                        </div>
                                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                                            <span style={{ color: t.onSurfaceVariant }}>Express Shipping</span>
                                            <span style={{ fontWeight: 600, color: shippingCost === 0 ? "#2e7d32" : t.onSurface }}>
                                                {shippingCost === 0 ? "Complimentary" : shippingCost + " " + "Rs"}
                                            </span>
                                        </div>
                                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                                            <span style={{ color: t.onSurfaceVariant }}>Duties & Taxes</span>
                                            <span style={{ color: t.onSurfaceVariant, fontSize: 12 }}>Calculated at checkout</span>
                                        </div>
                                        <div style={{ borderTop: `1px solid ${t.outlineVariant}`, paddingTop: 20, marginTop: 8, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                                            <div>
                                                <span style={{ fontSize: 16, fontWeight: 700, color: t.primary, display: "block" }}>Total</span>
                                                <span style={{ fontSize: 11, color: t.onSurfaceVariant }}>Includes VAT if applicable</span>
                                            </div>
                                            <span style={{ fontSize: 24, fontWeight: 700, color: t.primary }}>
                                                {cart.totalPrice + shippingCost + " " + cart.currency}
                                            </span>
                                        </div>
                                    </div>
                                    {/* Checkout CTA */}
                                    <button
                                        className="arks-checkout-btn"
                                        onClick={handleCheckOut}
                                        style={{ width: "100%", padding: "18px 0", background: t.primary, color: t.primaryText, border: "none", marginTop: 32, fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.2em", cursor: "pointer", transition: "all 0.3s" }}
                                    >
                                        Proceed to Checkout
                                    </button>
                                    {/* Guarantees */}
                                    <div style={{ marginTop: 24, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, paddingTop: 20, borderTop: `1px solid ${t.outlineVariant}` }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11, color: t.onSurfaceVariant }}>
                                            <span className="material-symbols-outlined" style={{ fontSize: 18, color: t.accentGold }}>lock</span>
                                            <span>Secure 256-bit Checkout</span>
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11, color: t.onSurfaceVariant }}>
                                            <span className="material-symbols-outlined" style={{ fontSize: 18, color: t.accentGold }}>local_shipping</span>
                                            <span>Insured Express Delivery</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
            {/* Simple Footer */}
            <footer style={{ background: t.surfaceContainerLow, borderTop: `1px solid ${t.outlineVariant}`, padding: "32px 48px", textAlign: "center", fontSize: 11, color: t.onSurfaceVariant, letterSpacing: "0.08em" }}>
                © {new Date().getFullYear()} ARKS STUDIO. ALL RIGHTS RESERVED.
            </footer>
        </div>
    );
}
