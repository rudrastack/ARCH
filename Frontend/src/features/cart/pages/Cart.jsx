import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useCart } from '../hook/useCart';
import { useProduct } from '../../products/hook/useProduct';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useRazorpay } from "react-razorpay";

//  Helper: Extract clean string ID from MongoDB ObjectId, $oid, or string
const extractId = (val) => {
    if (!val) return "";
    if (typeof val === 'string') return val;
    if (val.$oid) return String(val.$oid);
    if (val._id) return extractId(val._id);
    return String(val);
};

//  Helper: Normalize string/array attribute value 
const getAttrString = (attr) => {
    if (!attr) return "";
    if (Array.isArray(attr)) return attr.join(", ");
    if (typeof attr === 'string') return attr;
    return String(attr);
};

const normalizeUrl = (img) => {
    if (!img) return null;
    if (typeof img === 'string') return img;
    if (typeof img === 'object' && img.url) return img.url;
    return null;
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

    const { handleGetAllProducts } = useProduct();

    const navigate = useNavigate();
    const cart = useSelector(state => state.cart || { items: [], totalPrice: 0, currency: 'INR' });
    const allProducts = useSelector(state => state.product?.products || []);
    const user = useSelector(state => state.auth?.user);
    const { Razorpay } = useRazorpay();

    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [actionLoading, setActionLoading] = useState(null);

    // Fetch cart and all products catalogue on mount
    useEffect(() => {
        handleGetCart();
        handleGetAllProducts();
    }, []);

    //  Build fast lookup map for all products 
    const productsMap = useMemo(() => {
        const map = new Map();
        allProducts.forEach(p => {
            const id = extractId(p._id);
            if (id) map.set(id, p);
        });
        return map;
    }, [allProducts]);

    const cartItems = cart.items || [];

    // Calculate total price accurately across all items
    const totalPrice = useMemo(() => {
        if (cart.totalPrice && cart.totalPrice > 0) return Number(cart.totalPrice);
        return cartItems.reduce((sum, item) => {
            const unit = Number(item.price?.amount || 0);
            return sum + (unit * (item.quantity || 1));
        }, 0);
    }, [cart.totalPrice, cartItems]);

    const currency = cart.currency || cartItems[0]?.price?.currency || 'INR';
    const shippingThreshold = 2000;
    const shippingCost = totalPrice > shippingThreshold || totalPrice === 0 ? 0 : 250;
    const amountToFreeShipping = Math.max(0, shippingThreshold - totalPrice);
    const finalTotal = totalPrice + shippingCost;

    const handleCheckOut = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        try {
            setIsCheckingOut(true);
            const response = await handleCartOrder();

            if (!response?.order?.id) {
                console.error("No order ID returned from checkout");
                setIsCheckingOut(false);
                return;
            }

            const options = {
                key: "rzp_test_TQWa86qmNQxtTo",
                amount: response.order.amount,
                currency: response.order.currency || currency,
                name: "ARCH Atelier",
                description: "Luxury Haute Couture Reservation",
                order_id: response.order.id,
                handler: async (paymentResponse) => {
                    try {
                        const isValid = await handleVerifyOrder(paymentResponse);
                        if (isValid) {
                            navigate(`/order-success?order_id=${paymentResponse.razorpay_order_id || response.order.id}`);
                        }
                    } catch (verifyErr) {
                        console.error("Payment verification failed:", verifyErr);
                    } finally {
                        setIsCheckingOut(false);
                    }
                },
                prefill: {
                    name: user?.fullname || "",
                    email: user?.email || "",
                    contact: user?.contact || "",
                },
                theme: {
                    color: "#0a192f",
                },
                modal: {
                    ondismiss: () => {
                        setIsCheckingOut(false);
                    }
                }
            };

            const razorpayInstance = new Razorpay(options);
            razorpayInstance.open();
        } catch (err) {
            console.error("Checkout initialization failed:", err);
            setIsCheckingOut(false);
        }
    };

    //  Resolve Full Product & Variant for any Cart Item
    const resolveItemDetails = useCallback((item) => {
        const prodId = extractId(item.product);
        const varId = extractId(item.variant);
        const itemId = extractId(item._id);

        // Find product from catalogue map or populated item.product
        const fullProduct = productsMap.get(prodId) || (typeof item.product === 'object' ? item.product : null);

        // Find variant from fullProduct.variants or item.variant
        let matchedVariant = null;
        if (fullProduct?.variants?.length) {
            // 1. Match by variant ID
            if (varId) {
                matchedVariant = fullProduct.variants.find(v => extractId(v._id) === varId);
            }
            // 2. Match by color and size if variantId not matched
            if (!matchedVariant && (item.selectedColor || item.selectedSize)) {
                matchedVariant = fullProduct.variants.find(v => {
                    const vColor = getAttrString(v.attributes?.Color || v.attributes?.color).toLowerCase();
                    const vSize = getAttrString(v.attributes?.Size || v.attributes?.size).toLowerCase();
                    const colorMatch = !item.selectedColor || vColor.includes(item.selectedColor.toLowerCase());
                    const sizeMatch = !item.selectedSize || vSize.includes(item.selectedSize.toLowerCase());
                    return colorMatch && sizeMatch;
                });
            }
            // 3. Match by color only
            if (!matchedVariant && item.selectedColor) {
                matchedVariant = fullProduct.variants.find(v => {
                    const vColor = getAttrString(v.attributes?.Color || v.attributes?.color).toLowerCase();
                    return vColor.includes(item.selectedColor.toLowerCase());
                });
            }
        }

        // Fallback to item.variant if it is an object
        if (!matchedVariant && typeof item.variant === 'object' && item.variant !== null) {
            matchedVariant = item.variant;
        }

        // Determine variant image
        let image = null;
        if (matchedVariant?.images?.length) {
            image = normalizeUrl(matchedVariant.images[0]);
        }
        if (!image && fullProduct?.images?.length) {
            image = normalizeUrl(fullProduct.images[0]);
        }
        if (!image) {
            image = "/arks_hero_editorial.png";
        }

        // Title and Category
        const title = fullProduct?.title || item.product?.title || "ARCH Haute Couture";
        const category = fullProduct?.category || item.product?.category || "Haute Couture";

        // Price
        const unitPrice = Number(
            item.price?.amount ??
            matchedVariant?.price?.amount ??
            fullProduct?.price?.amount ??
            0
        );

        const itemCurrency = item.price?.currency || matchedVariant?.price?.currency || fullProduct?.price?.currency || currency;

        // Color and Size
        const color = item.selectedColor || getAttrString(matchedVariant?.attributes?.Color || matchedVariant?.attributes?.color);
        const size = item.selectedSize || getAttrString(matchedVariant?.attributes?.Size || matchedVariant?.attributes?.size);

        return {
            prodId,
            varId,
            itemId,
            title,
            category,
            image,
            unitPrice,
            itemCurrency,
            color,
            size,
            matchedVariant,
            fullProduct
        };
    }, [productsMap, currency]);

    const handleQtyIncrease = async ({ prodId, varId, color, size, itemId, key }) => {
        setActionLoading(key);
        try {
            await handleIncreaseCartItem({ productId: prodId, variantId: varId, color, size, itemId });
        } finally {
            setActionLoading(null);
        }
    };

    const handleQtyDecrease = async ({ prodId, varId, currentQty, color, size, itemId, key }) => {
        setActionLoading(key);
        try {
            if (currentQty > 1) {
                await handleDecreaseCartItem({ productId: prodId, variantId: varId, color, size, itemId });
            } else {
                await handleRemoveCartItem({ productId: prodId, variantId: varId, color, size, itemId });
            }
        } finally {
            setActionLoading(null);
        }
    };

    const handleRemove = async ({ prodId, varId, color, size, itemId, key }) => {
        setActionLoading(key);
        try {
            await handleRemoveCartItem({ productId: prodId, variantId: varId, color, size, itemId });
        } finally {
            setActionLoading(null);
        }
    };

    return (
        <div className="min-h-screen bg-[#fbf9f6] text-[#1b1c1a] font-sans pb-20 selection:bg-[#C9A96E]/30">
            {/* Main Content */}
            <main className="pt-24 md:pt-28 max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16 box-border">

                {/* Page Header */}
                <div className="mb-8 md:mb-12 border-b border-[#e4e2df] pb-6">
                    <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.3em] text-[#C9A96E] font-semibold block mb-2">
                        Haute Couture Vault
                    </span>
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                        <h1
                            className="text-3xl sm:text-4xl md:text-5xl font-light text-[#0a192f] tracking-tight"
                            style={{ fontFamily: "'Cormorant Garamond', serif" }}
                        >
                            Shopping Bag
                        </h1>
                        <p className="text-xs sm:text-sm text-[#7A6E63]">
                            {cartItems.length === 1
                                ? '1 bespoke piece reserved'
                                : `${cartItems.length} bespoke pieces reserved`}
                        </p>
                    </div>
                </div>

                {/* Empty State */}
                {cartItems.length === 0 ? (
                    <div className="text-center py-16 sm:py-24 px-6 bg-white border border-[#e4e2df] rounded-2xl max-w-2xl mx-auto shadow-xs my-8">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-6 rounded-full bg-[#fbf9f6] border border-[#e4e2df] flex items-center justify-center text-[#7A6E63]">
                            <span className="material-symbols-outlined text-3xl sm:text-4xl">
                                shopping_bag
                            </span>
                        </div>
                        <h2
                            className="text-2xl sm:text-3xl font-light text-[#0a192f] mb-3"
                            style={{ fontFamily: "'Cormorant Garamond', serif" }}
                        >
                            Your shopping bag is empty
                        </h2>
                        <p className="text-xs sm:text-sm text-[#7A6E63] max-w-md mx-auto mb-8 leading-relaxed font-light">
                            Explore our latest atelier runway collections and reserve handcrafted garments built for timeless distinction.
                        </p>
                        <Link
                            to="/collection"
                            className="inline-block px-8 py-3.5 bg-[#0a192f] text-white hover:bg-[#C9A96E] hover:text-[#0a192f] transition-all duration-300 text-[11px] uppercase tracking-[0.25em] font-semibold"
                        >
                            Discover The Vault
                        </Link>
                    </div>
                ) : (
                    /* Cart Layout Grid */
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

                        {/* Items List (7 cols on lg) */}
                        <div className="lg:col-span-7 space-y-4 sm:space-y-6">

                            {/* Free Shipping Alert Pill */}
                            <div className="bg-[#f5f3f0] border border-[#e4e2df] p-4 rounded-xl flex items-center gap-3">
                                <span className="material-symbols-outlined text-[#C9A96E] text-xl">
                                    {shippingCost === 0 ? "verified" : "local_shipping"}
                                </span>
                                <div className="flex-1">
                                    <p className="text-xs font-medium text-[#1b1c1a]">
                                        {shippingCost === 0 ? (
                                            <span className="text-emerald-800 font-semibold">
                                                ✓ Complimentary White-Glove Express Shipping unlocked
                                            </span>
                                        ) : (
                                            <span>
                                                Add <span className="font-semibold text-[#0a192f]">{currency} {amountToFreeShipping.toLocaleString('en-IN')}</span> more to qualify for <span className="text-[#C9A96E] font-semibold">Complimentary Shipping</span>
                                            </span>
                                        )}
                                    </p>
                                </div>
                            </div>

                            {/* Item Cards - uniquely keyed by item _id or prodId + varId + color + size */}
                            {cartItems.map((item, index) => {
                                const details = resolveItemDetails(item);
                                const { prodId, varId, itemId, title, category, image, unitPrice, itemCurrency, color, size } = details;
                                const itemTotal = unitPrice * (item.quantity || 1);
                                const itemKey = itemId || `${prodId}-${varId}-${color}-${size}-${index}`;
                                const isItemLoading = actionLoading === itemKey;

                                return (
                                    <div
                                        key={itemKey}
                                        className={`bg-white border border-[#e4e2df] p-4 sm:p-6 rounded-xl transition-all duration-300 ${isItemLoading ? "opacity-60 pointer-events-none" : ""
                                            }`}
                                    >
                                        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">

                                            {/* Variant-Specific Image */}
                                            <div className="w-full sm:w-28 md:w-32 aspect-[3/4] sm:aspect-auto sm:h-36 flex-shrink-0 bg-[#f5f3f0] rounded-lg overflow-hidden border border-[#e4e2df]/60 relative">
                                                <img
                                                    src={image}
                                                    alt={`${title} - ${color || ''}`}
                                                    loading="lazy"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>

                                            {/* Item Info & Actions */}
                                            <div className="flex-1 flex flex-col justify-between gap-4">
                                                <div>
                                                    <div className="flex justify-between items-start gap-4">
                                                        <div>
                                                            <span className="text-[9px] uppercase tracking-[0.2em] text-[#C9A96E] font-semibold block mb-1">
                                                                {category}
                                                            </span>
                                                            <h3
                                                                className="text-base sm:text-lg font-normal text-[#0a192f] leading-snug"
                                                                style={{ fontFamily: "'Cormorant Garamond', serif" }}
                                                            >
                                                                {title}
                                                            </h3>
                                                        </div>

                                                        {/* Line Total */}
                                                        <div className="text-right">
                                                            <span className="text-sm sm:text-base font-semibold text-[#0a192f] whitespace-nowrap">
                                                                {itemCurrency} {itemTotal.toLocaleString('en-IN')}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Variant Attributes: Color & Size Badges */}
                                                    <div className="flex flex-wrap gap-2 mt-3">
                                                        {color && (
                                                            <span className="text-[10px] uppercase tracking-wider px-2.5 py-1 bg-[#f5f3f0] text-[#1b1c1a] border border-[#e4e2df] rounded-md font-medium">
                                                                Color: {color}
                                                            </span>
                                                        )}
                                                        {size && (
                                                            <span className="text-[10px] uppercase tracking-wider px-2.5 py-1 bg-[#f5f3f0] text-[#1b1c1a] border border-[#e4e2df] rounded-md font-medium">
                                                                Size: {size}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Bottom Row: Quantity Steppers & Remove Action */}
                                                <div className="flex items-center justify-between pt-3 border-t border-[#e4e2df]/60 flex-wrap gap-3">
                                                    {/* Quantity Stepper */}
                                                    <div className="flex items-center border border-[#d0c5b5] rounded-md overflow-hidden bg-[#fbf9f6]">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleQtyDecrease({
                                                                prodId,
                                                                varId,
                                                                currentQty: item.quantity,
                                                                color,
                                                                size,
                                                                itemId,
                                                                key: itemKey
                                                            })}
                                                            className="w-8 h-8 flex items-center justify-center text-sm font-medium hover:bg-[#e4e2df] active:bg-[#d0c5b5] transition-colors"
                                                            aria-label={`Decrease quantity of ${title}`}
                                                        >
                                                            −
                                                        </button>
                                                        <span className="w-9 text-center text-xs font-semibold text-[#0a192f]">
                                                            {item.quantity}
                                                        </span>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleQtyIncrease({
                                                                prodId,
                                                                varId,
                                                                color,
                                                                size,
                                                                itemId,
                                                                key: itemKey
                                                            })}
                                                            className="w-8 h-8 flex items-center justify-center text-sm font-medium hover:bg-[#e4e2df] active:bg-[#d0c5b5] transition-colors"
                                                            aria-label={`Increase quantity of ${title}`}
                                                        >
                                                            +
                                                        </button>
                                                    </div>

                                                    {/* Remove Button */}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemove({
                                                            prodId,
                                                            varId,
                                                            color,
                                                            size,
                                                            itemId,
                                                            key: itemKey
                                                        })}
                                                        className="text-[10px] sm:text-[11px] uppercase tracking-[0.15em] text-[#7A6E63] hover:text-red-700 font-medium py-1 px-2.5 border border-transparent hover:border-red-200 hover:bg-red-50/50 rounded transition-all"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Order Summary Box (5 cols on lg) */}
                        <div className="lg:col-span-5 lg:sticky lg:top-28">
                            <div className="bg-white border border-[#e4e2df] p-6 sm:p-8 rounded-2xl shadow-xs">
                                <h2
                                    className="text-xl sm:text-2xl font-light text-[#0a192f] pb-4 mb-6 border-b border-[#e4e2df]"
                                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                                >
                                    Summary of Reservation
                                </h2>

                                <div className="space-y-4 text-xs sm:text-sm">
                                    <div className="flex justify-between items-center text-[#7A6E63]">
                                        <span>Vault Subtotal</span>
                                        <span className="font-semibold text-[#0a192f]">
                                            {currency} {totalPrice.toLocaleString('en-IN')}
                                        </span>
                                    </div>

                                    <div className="flex justify-between items-center text-[#7A6E63]">
                                        <span>Express Courier</span>
                                        <span className={`font-semibold ${shippingCost === 0 ? "text-emerald-800" : "text-[#0a192f]"}`}>
                                            {shippingCost === 0 ? "Complimentary" : `${currency} ${shippingCost.toLocaleString('en-IN')}`}
                                        </span>
                                    </div>

                                    <div className="flex justify-between items-center text-[#7A6E63]">
                                        <span>Duties & Insurance</span>
                                        <span className="text-[#7A6E63] text-[11px]">Included</span>
                                    </div>

                                    <div className="border-t border-[#e4e2df] pt-4 mt-2 flex justify-between items-baseline">
                                        <div>
                                            <span className="text-sm sm:text-base font-bold text-[#0a192f] block">
                                                Estimated Total
                                            </span>
                                            <span className="text-[10px] text-[#7A6E63] font-light">
                                                All taxes and packaging included
                                            </span>
                                        </div>
                                        <span className="text-xl sm:text-2xl font-bold text-[#0a192f]">
                                            {currency} {finalTotal.toLocaleString('en-IN')}
                                        </span>
                                    </div>
                                </div>

                                {/* Checkout CTA */}
                                <button
                                    type="button"
                                    onClick={handleCheckOut}
                                    disabled={isCheckingOut || cartItems.length === 0}
                                    className="
                                    w-full mt-6 py-4
                                  bg-[#0a192f] text-white
                                    hover:bg-[#C9A96E]
                                    hover:text-[#0a192f]
                                    disabled:opacity-50
                                    disabled:cursor-not-allowed
                                    transition-all duration-300 ease-in-out
                                    text-xs uppercase tracking-[0.2em] font-semibold
                                    flex items-center justify-center gap-2
                                    rounded-none
                                    active:scale-[0.98]
                                    active:opacity-80
                                              "
                                >
                                    {isCheckingOut ? (
                                        <>
                                            <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                            <span>Processing Atelier Order…</span>
                                        </>
                                    ) : (
                                        "Proceed to Checkout"
                                    )}
                                </button>

                                {/* Trust Guarantees */}
                                <div className="grid grid-cols-2 gap-3 pt-6 mt-6 border-t border-[#e4e2df] text-[10px] sm:text-[11px] text-[#7A6E63]">
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[#C9A96E] text-base">
                                            lock
                                        </span>
                                        <span>256-Bit Encrypted</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[#C9A96E] text-base">
                                            verified_user
                                        </span>
                                        <span>Authenticity Guaranteed</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                )}
            </main>
        </div>
    );
}
