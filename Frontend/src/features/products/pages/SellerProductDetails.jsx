import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProduct } from '../hook/useProduct';

/*  Design Tokens  */
const c = {
    bg: '#fbf9f6',
    surface: '#ffffff',
    surfaceContainerLow: '#f5f3f0',
    surfaceContainer: '#efeeeb',
    onSurface: '#1b1c1a',
    onSurfaceVariant: '#4d463a',
    primary: '#745a27',
    primaryDark: '#5a4311',
    onPrimary: '#ffffff',
    primaryFixed: '#ffdea6',
    outline: '#7f7668',
    outlineVariant: '#d0c5b5',
    error: '#ba1a1a',
    errorContainer: '#ffdad6',
};

/*  SVG Icons  */
const IcPlus = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);
const IcTrash = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
);
const IcArrowLeft = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
    </svg>
);
const IcImage = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
    </svg>
);
const IcCheck = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);
const IcPackage = () => (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#d0c5b5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="16.5" y1="9.4" x2="7.5" y2="4.21" /><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
);

/*  Toast Notification  */
function Toast({ msg, type, onClose }) {
    useEffect(() => {
        const t = setTimeout(onClose, 3000);
        return () => clearTimeout(t);
    }, [onClose]);

    const bg = type === 'error' ? c.errorContainer : c.primaryFixed;
    const col = type === 'error' ? c.error : c.primaryDark;

    return (
        <div className="fixed bottom-6 right-6 z-50 rounded-lg px-5 py-3.5 text-xs font-medium flex items-center gap-2.5 shadow-lg max-w-[90vw] sm:max-w-sm transition-all" style={{ background: bg, color: col }}>
            {type !== 'error' && <IcCheck />}
            <span className="leading-snug">{msg}</span>
        </div>
    );
}

/*  Variant Card  */
function VariantCard({ variant, index, onStockChange }) {
    const [focused, setFocused] = useState(false);
    const thumbSrc = variant.images?.[0]?.url || (typeof variant.images?.[0] === 'string' ? variant.images[0] : null);
    const attrs = Object.entries(variant.attributes || {});
    const hasPrice = variant.price?.amount != null && variant.price.amount !== '';

    return (
        <div className="bg-white rounded-xl overflow-hidden shadow-xs border border-[#e4e2df] flex flex-col transition-all duration-200 hover:shadow-md">
            {/* Image strip */}
            <div className="h-44 sm:h-48 bg-[#f5f3f0] relative overflow-hidden">
                {thumbSrc ? (
                    <img
                        src={thumbSrc}
                        alt="Variant"
                        loading="lazy"
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center flex-col gap-2">
                        <IcPackage />
                        <span className="text-[11px] text-[#7A6E63] font-medium">No Image Attached</span>
                    </div>
                )}
                {/* Image count badge */}
                {variant.images?.length > 1 && (
                    <span className="absolute bottom-2.5 right-2.5 bg-[#1b1c1a]/75 backdrop-blur-xs text-white rounded-full px-2.5 py-0.5 text-[10px] font-semibold">
                        +{variant.images.length - 1} photos
                    </span>
                )}
            </div>

            {/* Body */}
            <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between gap-3">
                {/* Attribute tags */}
                <div className="flex flex-wrap gap-1.5">
                    {attrs.length > 0 ? attrs.map(([key, val]) => (
                        <span
                            key={key}
                            className="bg-[#f5f3f0] rounded-md px-2.5 py-1 text-[10px] font-semibold tracking-wider uppercase text-[#1b1c1a] border border-[#e4e2df]"
                        >
                            <span className="text-[#7A6E63] font-normal">{key}: </span>{Array.isArray(val) ? val.join(", ") : val}
                        </span>
                    )) : (
                        <span className="text-xs text-[#7A6E63] italic">No specific attributes</span>
                    )}
                </div>

                {/* Price Display */}
                <div className="text-xs text-[#7A6E63]">
                    {hasPrice ? (
                        <span className="font-semibold text-[#745a27] text-sm sm:text-base">
                            {variant.price.currency || 'INR'} {Number(variant.price.amount).toLocaleString('en-IN')}
                        </span>
                    ) : (
                        <span className="italic text-[#7A6E63]">Using base product price</span>
                    )}
                </div>
            </div>

            {/* Stock edit row */}
            <div className="p-3 sm:p-4 border-t border-[#f5f3f0] bg-[#fbf9f6] flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#7A6E63]">
                    Available Stock
                </span>
                <div className="flex items-center gap-1.5">
                    <input
                        type="number"
                        min="0"
                        value={variant.stock ?? 0}
                        onChange={e => onStockChange(index, e.target.value)}
                        onFocus={() => setFocused(true)}
                        onBlur={() => setFocused(false)}
                        className={`w-20 text-right font-medium text-base text-[#1b1c1a] bg-transparent border-b outline-none px-1 py-0.5 transition-colors ${focused ? "border-[#745a27]" : "border-[#d0c5b5]"
                            }`}
                        style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18 }}
                    />
                    <span className="text-[10px] text-[#7A6E63]">units</span>
                </div>
            </div>
        </div>
    );
}

/*  New Variant Slide-over Panel  */
function VariantFormPanel({ onClose, onSave, saving }) {
    const fileInputRef = useRef(null);
    const [attrInputs, setAttrInputs] = useState([{ key: '', value: '' }]);
    const [stock, setStock] = useState('10');
    const [priceAmount, setPriceAmount] = useState('');
    const [priceCurrency, setPriceCurrency] = useState('INR');
    const [images, setImages] = useState([]);
    const [error, setError] = useState('');

    function handleAttrChange(idx, field, val) {
        const updated = attrInputs.map((a, i) => i === idx ? { ...a, [field]: val } : a);
        setAttrInputs(updated);
    }

    function addAttr() {
        setAttrInputs(p => [...p, { key: '', value: '' }]);
    }

    function removeAttr(idx) {
        if (attrInputs.length === 1) return;
        setAttrInputs(p => p.filter((_, i) => i !== idx));
    }

    function handleImageUpload(e) {
        const files = Array.from(e.target.files);
        if (!files.length) return;
        const slots = 7 - images.length;
        const toAdd = files.slice(0, slots).map(f => ({
            file: f,
            previewUrl: URL.createObjectURL(f)
        }));
        setImages(p => [...p, ...toAdd]);
        e.target.value = '';
    }

    function removeImage(idx) {
        URL.revokeObjectURL(images[idx]?.previewUrl);
        setImages(p => p.filter((_, i) => i !== idx));
    }

    function buildAttrsObj() {
        const obj = {};
        attrInputs.forEach(a => {
            if (a.key.trim()) {
                obj[a.key.trim()] = a.value.trim();
            }
        });
        return obj;
    }

    function handleSubmit() {
        setError('');
        const hasAttr = attrInputs.some(a => a.key.trim() && a.value.trim());
        if (!hasAttr) {
            setError('Please provide at least one attribute key & value (e.g. Color: Black or Size: M).');
            return;
        }

        const variantPayload = {
            images: images.map(i => i.file),
            stock: Number(stock) || 0,
            attributes: buildAttrsObj(),
            price: priceAmount ? Number(priceAmount) : undefined,
        };

        onSave(variantPayload, images.map(i => ({ url: i.previewUrl })));
    }

    return (

        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <div
                onClick={onClose}
                className="fixed inset-0 bg-[#1b1c1a]/50 backdrop-blur-xs transition-opacity"
            />

            {/* Slide-over panel */}
            <div className="relative w-full max-w-full sm:max-w-lg h-full bg-white shadow-2xl flex flex-col z-10 overflow-y-auto">
                {/* Header */}
                <div className="p-6 sm:p-8 border-b border-[#e4e2df] flex items-center justify-between sticky top-0 bg-white z-10">
                    <div>
                        <h2
                            className="text-2xl font-light text-[#0a192f]"
                            style={{ fontFamily: "'Inter', sans-serif" }}
                        >
                            Create Bespoke Variant
                        </h2>
                        <p className="text-xs text-[#7A6E63] mt-1">
                            Configure color, sizing attributes, stock & custom pricing
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-[#7A6E63] hover:text-[#1b1c1a] rounded-full hover:bg-[#f5f3f0] transition-colors"
                        aria-label="Close panel"
                    >
                        <span className="material-symbols-outlined text-xl">close</span>
                    </button>
                </div>

                {/* Form Body */}
                <div className="p-6 sm:p-8 flex-1 space-y-6">
                    {/* Error Banner */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3.5 text-xs">
                            {error}
                        </div>
                    )}

                    {/* Attributes Section */}
                    <div>
                        <label className="block text-[11px] font-semibold tracking-wider uppercase text-[#7A6E63] mb-1">
                            Attributes & Specifications <span className="text-red-600">*</span>
                        </label>
                        <p className="text-[11px] text-[#7A6E63] mb-3">
                            e.g., Color → Obsidian Black, Size → XL, Fabric → Cashmere
                        </p>

                        <div className="space-y-3">
                            {attrInputs.map((attr, idx) => (
                                <div key={idx} className="flex gap-2 sm:gap-3 items-center">
                                    <input
                                        type="text"
                                        placeholder="Key (e.g. Color)"
                                        value={attr.key}
                                        onChange={e => handleAttrChange(idx, 'key', e.target.value)}
                                        className="flex-1 bg-transparent border-b border-[#d0c5b5] focus:border-[#745a27] py-2 text-xs text-[#1b1c1a] outline-none transition-colors"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Value (e.g. Ivory Gold)"
                                        value={attr.value}
                                        onChange={e => handleAttrChange(idx, 'value', e.target.value)}
                                        className="flex-1 bg-transparent border-b border-[#d0c5b5] focus:border-[#745a27] py-2 text-xs text-[#1b1c1a] outline-none transition-colors"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeAttr(idx)}
                                        disabled={attrInputs.length === 1}
                                        className={`p-2 text-sm rounded ${attrInputs.length === 1
                                            ? "text-[#d0c5b5] cursor-not-allowed"
                                            : "text-red-600 hover:bg-red-50"
                                            }`}
                                    >
                                        <IcTrash />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <button
                            type="button"
                            onClick={addAttr}
                            className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#745a27] hover:text-[#5a4311] transition-colors"
                        >
                            <IcPlus /> Add Specification Field
                        </button>
                    </div>

                    {/* Stock & Price Fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 pt-4 border-t border-[#e4e2df]">
                        <div>
                            <label className="block text-[11px] font-semibold tracking-wider uppercase text-[#7A6E63] mb-1">
                                Variant Stock
                            </label>
                            <input
                                type="number"
                                min="0"
                                value={stock}
                                onChange={e => setStock(e.target.value)}
                                className="w-full bg-transparent border-b border-[#d0c5b5] focus:border-[#745a27] py-2 text-sm text-[#1b1c1a] outline-none transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block text-[11px] font-semibold tracking-wider uppercase text-[#7A6E63] mb-1">
                                Custom Price <span className="text-[#7A6E63] font-normal normal-case">(optional)</span>
                            </label>
                            <input
                                type="number"
                                min="0"
                                placeholder="Base product price"
                                value={priceAmount}
                                onChange={e => setPriceAmount(e.target.value)}
                                className="w-full bg-transparent border-b border-[#d0c5b5] focus:border-[#745a27] py-2 text-sm text-[#1b1c1a] outline-none transition-colors"
                            />
                        </div>
                    </div>

                    {/* Currency Selector */}
                    <div>
                        <label className="block text-[11px] font-semibold tracking-wider uppercase text-[#7A6E63] mb-1">
                            Currency
                        </label>
                        <select
                            value={priceCurrency}
                            onChange={e => setPriceCurrency(e.target.value)}
                            className="w-full bg-transparent border-b border-[#d0c5b5] focus:border-[#745a27] py-2 text-xs text-[#1b1c1a] outline-none cursor-pointer"
                        >
                            {['INR', 'USD', 'EUR', 'GBP', 'AED'].map(cur => (
                                <option key={cur} value={cur}>{cur}</option>
                            ))}
                        </select>
                    </div>

                    {/* Image Upload Area */}
                    <div className="pt-4 border-t border-[#e4e2df]">
                        <div className="flex justify-between items-center mb-3">
                            <label className="text-[11px] font-semibold tracking-wider uppercase text-[#7A6E63]">
                                Variant Photos <span className="text-[#7A6E63] font-normal normal-case">(max 7)</span>
                            </label>
                            <span className="text-xs text-[#7A6E63] font-medium">{images.length}/7</span>
                        </div>

                        {/* Image Previews */}
                        {images.length > 0 && (
                            <div className="grid grid-cols-3 gap-3 mb-4">
                                {images.map((img, i) => (
                                    <div key={i} className="aspect-[3/4] bg-[#f5f3f0] rounded-lg overflow-hidden relative border border-[#e4e2df]">
                                        <img
                                            src={img.previewUrl}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(i)}
                                            className="absolute top-1.5 right-1.5 bg-white/90 text-red-600 rounded-full p-1 shadow-xs hover:bg-white transition-colors"
                                        >
                                            <IcTrash />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Dropzone */}
                        {images.length < 7 && (
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="border-2 border-dashed border-[#d0c5b5] hover:border-[#745a27] rounded-xl p-6 text-center cursor-pointer hover:bg-[#fbf9f6] transition-all"
                            >
                                <div className="mx-auto w-10 h-10 flex items-center justify-center text-[#745a27] mb-2">
                                    <IcImage />
                                </div>
                                <p className="text-xs font-medium text-[#1b1c1a] mb-1">
                                    Click to browse variant photography
                                </p>
                                <p className="text-[11px] text-[#7A6E63]">
                                    High-res PNG, JPG, WEBP formats accepted
                                </p>
                            </div>
                        )}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageUpload}
                            className="hidden"
                        />
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 sm:p-8 border-t border-[#e4e2df] bg-white sticky bottom-0 flex gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 py-3.5 border border-[#d0c5b5] text-[#1b1c1a] text-xs uppercase tracking-widest font-semibold hover:bg-[#f5f3f0] transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={saving}
                        className="flex-2 py-3.5 bg-[#0a192f] text-white hover:bg-[#745a27] disabled:opacity-50 text-xs uppercase tracking-widest font-semibold transition-all flex items-center justify-center gap-2"
                    >
                        {saving ? (
                            <>
                                <span className="inline-block w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                <span>Saving Variant…</span>
                            </>
                        ) : (
                            "Save Variant"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

/*  Main Page  */
export default function SellerProductDetails() {
    const { productId } = useParams();
    const navigate = useNavigate();
    const { handleGetProductById, handleCreateProductVariants } = useProduct();

    const [product, setProduct] = useState(null);
    const [localVariants, setLocalVariants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showPanel, setShowPanel] = useState(false);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState(null);
    const [activeThumb, setActiveThumb] = useState(0);

    /*  Fetch Product  */
    useEffect(() => {
        let cancelled = false;
        async function load() {
            setLoading(true);
            try {
                const data = await handleGetProductById(productId);
                if (!cancelled) {
                    setProduct(data);
                    setLocalVariants(data?.variants || []);
                }
            } catch (err) {
                console.error(err);
                if (!cancelled) {
                    setToast({ msg: 'Failed to load product specifications.', type: 'error' });
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        load();
        return () => { cancelled = true; };
    }, [productId, handleGetProductById]);

    /*  Stock change handler  */
    function handleStockChange(idx, val) {
        setLocalVariants(prev => {
            const updated = [...prev];
            updated[idx] = { ...updated[idx], stock: Number(val) };
            return updated;
        });
    }

    /*  Save new variant  */
    async function handleSaveVariant(payload, previewImages) {
        setSaving(true);
        try {
            const updatedProduct = await handleCreateProductVariants(productId, payload);

            // If backend returned updated variants use them, otherwise optimistic update
            if (updatedProduct?.variants) {
                setLocalVariants(updatedProduct.variants);
            } else {
                setLocalVariants(prev => [...prev, {
                    images: previewImages,
                    stock: payload.stock,
                    attributes: payload.attributes,
                    price: payload.price ? { amount: payload.price, currency: 'INR' } : null,
                }]);
            }

            setShowPanel(false);
            setToast({ msg: 'Variant created & inventory published!', type: 'success' });
        } catch (err) {
            console.error(err);
            setToast({ msg: 'Failed to save variant. Please verify inputs.', type: 'error' });
        } finally {
            setSaving(false);
        }
    }

    /*  Loading State  */
    if (loading) {
        return (
            <div className="min-h-screen bg-[#fbf9f6] flex flex-col items-center justify-center gap-4">
                <div className="w-10 h-10 border-3 border-[#d0c5b5] border-t-[#745a27] rounded-full animate-spin" />
                <p className="text-xs uppercase tracking-widest text-[#7A6E63] font-medium">
                    Loading Atelier Inventory…
                </p>
            </div>
        );
    }

    /*  Not Found State  */
    if (!product) {
        return (
            <div className="min-h-screen bg-[#fbf9f6] flex flex-col items-center justify-center p-6 text-center">
                <h2
                    className="text-3xl font-light text-[#0a192f] mb-4"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                    Piece Not Found
                </h2>
                <button
                    onClick={() => navigate('/seller/get')}
                    className="px-6 py-3 bg-[#0a192f] text-white text-xs uppercase tracking-widest font-semibold"
                >
                    Back to Seller Dashboard
                </button>
            </div>
        );
    }

    const images = product.images || [];

    return (
        <div className="min-h-screen bg-[#fbf9f6] font-sans text-[#1b1c1a] pb-24 selection:bg-[#C9A96E]/30">
            {/* Sticky Header */}
            <header className="sticky top-0 z-40 bg-[#fbf9f6]/95 backdrop-blur-md border-b border-[#e4e2df] px-4 sm:px-8 lg:px-12 h-16 flex items-center justify-between">
                <div className="flex items-center gap-3 sm:gap-4 overflow-hidden">
                    <button
                        onClick={() => navigate('/seller/get')}
                        className="inline-flex items-center gap-1.5 text-[#7A6E63] hover:text-[#1b1c1a] text-xs font-semibold uppercase tracking-wider transition-colors flex-shrink-0"
                    >
                        <IcArrowLeft />
                        <span className="hidden sm:inline">Vault Inventory</span>
                    </button>
                    <span className="text-[#d0c5b5]">/</span>
                    <h1
                        className="text-base sm:text-lg font-medium text-[#0a192f] truncate"
                        style={{ fontFamily: "'Cormorant Garamond', serif" }}
                    >
                        {product.title}
                    </h1>
                </div>

                <span className="text-[10px] uppercase tracking-widest font-semibold text-[#745a27] bg-[#ffdea6]/70 px-3 py-1 rounded-full whitespace-nowrap flex-shrink-0">
                    Seller Studio
                </span>
            </header>

            {/* Main Content */}
            <main className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-12 pt-8 sm:pt-12 space-y-12">

                {/* Base Product Overview Section */}
                <section>
                    <span className="text-[10px] uppercase tracking-[0.25em] text-[#C9A96E] font-semibold block mb-3">
                        Master Garment Profile
                    </span>

                    <div className="bg-white border border-[#e4e2df] rounded-2xl p-6 sm:p-8 lg:p-10 shadow-xs">
                        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">

                            {/* Image Gallery */}
                            <div className="w-full lg:w-[380px] xl:w-[420px] flex-shrink-0">
                                <div className="aspect-[4/5] bg-[#f5f3f0] rounded-xl overflow-hidden mb-3 border border-[#e4e2df]">
                                    {images[activeThumb] ? (
                                        <img
                                            src={images[activeThumb].url || images[activeThumb]}
                                            alt={product.title}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-[#d0c5b5]">
                                            <IcPackage />
                                        </div>
                                    )}
                                </div>

                                {/* Thumbnails Strip */}
                                {images.length > 1 && (
                                    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                                        {images.map((img, i) => (
                                            <button
                                                key={i}
                                                type="button"
                                                onClick={() => setActiveThumb(i)}
                                                className={`w-14 h-18 rounded-md overflow-hidden flex-shrink-0 border-2 transition-all ${i === activeThumb
                                                    ? "border-[#745a27] opacity-100"
                                                    : "border-transparent opacity-60 hover:opacity-100"
                                                    }`}
                                            >
                                                <img
                                                    src={img.url || img}
                                                    alt={`Thumb ${i + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Details Information */}
                            <div className="flex-1 flex flex-col justify-between gap-6">
                                <div>
                                    <span className="text-[10px] uppercase tracking-widest text-[#7A6E63] font-semibold block mb-1">
                                        {product.category || "Atelier Collection"}
                                    </span>
                                    <h2
                                        className="text-2xl sm:text-4xl font-light text-[#0a192f] leading-tight mb-4"
                                        style={{ fontFamily: "'Cormorant Garamond', serif" }}
                                    >
                                        {product.title}
                                    </h2>
                                    <p className="text-xs sm:text-sm text-[#7A6E63] leading-relaxed max-w-2xl font-light">
                                        {product.description || "No editorial description available for this piece."}
                                    </p>
                                </div>

                                {/* Metrics Cards */}
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-[#e4e2df]">
                                    <div className="bg-[#fbf9f6] p-4 rounded-xl border border-[#e4e2df]">
                                        <p className="text-[10px] uppercase tracking-wider text-[#7A6E63] font-medium mb-1">
                                            Base Price
                                        </p>
                                        <p
                                            className="text-xl sm:text-2xl font-normal text-[#0a192f]"
                                            style={{ fontFamily: "'Cormorant Garamond', serif" }}
                                        >
                                            {product.price?.currency || 'INR'} {Number(product.price?.amount || 0).toLocaleString('en-IN')}
                                        </p>
                                    </div>

                                    <div className="bg-[#fbf9f6] p-4 rounded-xl border border-[#e4e2df]">
                                        <p className="text-[10px] uppercase tracking-wider text-[#7A6E63] font-medium mb-1">
                                            Configured Variants
                                        </p>
                                        <p
                                            className="text-xl sm:text-2xl font-normal text-[#0a192f]"
                                            style={{ fontFamily: "'Cormorant Garamond', serif" }}
                                        >
                                            {localVariants.length} <span className="text-xs text-[#7A6E63]">editions</span>
                                        </p>
                                    </div>

                                    <div className="bg-[#fbf9f6] p-4 rounded-xl border border-[#e4e2df] col-span-2 sm:col-span-1">
                                        <p className="text-[10px] uppercase tracking-wider text-[#7A6E63] font-medium mb-1">
                                            Product ID
                                        </p>
                                        <code className="text-[11px] text-[#7A6E63] font-mono block truncate">
                                            {productId}
                                        </code>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>

                {/* Variants & Inventory Section */}
                <section className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                        <div>
                            <span className="text-[10px] uppercase tracking-[0.25em] text-[#C9A96E] font-semibold block mb-1">
                                Stock & Attributes
                            </span>
                            <h2
                                className="text-2xl sm:text-3xl font-light text-[#0a192f]"
                                style={{ fontFamily: "'Cormorant Garamond', serif" }}
                            >
                                Product Variants & Inventory
                            </h2>
                        </div>

                        <button
                            type="button"
                            onClick={() => setShowPanel(true)}
                            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#0a192f] text-white hover:bg-[#C9A96E] hover:text-[#0a192f] text-xs uppercase tracking-widest font-semibold transition-all duration-300 rounded-none shadow-xs"
                        >
                            <IcPlus /> Add New Variant
                        </button>
                    </div>

                    {/* Variants Grid */}
                    {localVariants.length === 0 ? (
                        <div className="bg-white border-2 border-dashed border-[#d0c5b5] rounded-2xl p-12 text-center max-w-xl mx-auto space-y-4">
                            <div className="w-14 h-14 mx-auto flex items-center justify-center text-[#d0c5b5]">
                                <IcPackage />
                            </div>
                            <h3
                                className="text-2xl font-light text-[#0a192f]"
                                style={{ fontFamily: "'Cormorant Garamond', serif" }}
                            >
                                No Variants Configured Yet
                            </h3>
                            <p className="text-xs text-[#7A6E63] max-w-md mx-auto leading-relaxed">
                                Add bespoke sizes, unique colors, or customized variations to let collectors purchase specific editions.
                            </p>
                            <button
                                type="button"
                                onClick={() => setShowPanel(true)}
                                className="px-6 py-3 bg-[#0a192f] text-white hover:bg-[#C9A96E] hover:text-[#0a192f] text-xs uppercase tracking-widest font-semibold transition-all"
                            >
                                Create First Variant
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {localVariants.map((variant, idx) => (
                                <VariantCard
                                    key={variant._id || idx}
                                    variant={variant}
                                    index={idx}
                                    onStockChange={handleStockChange}
                                />
                            ))}

                            {/* Add Variant Card Action */}
                            <div
                                onClick={() => setShowPanel(true)}
                                className="border-2 border-dashed border-[#d0c5b5] hover:border-[#745a27] rounded-xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-[#fbf9f6] transition-all min-h-[220px] text-[#7A6E63] hover:text-[#745a27]"
                            >
                                <div className="w-12 h-12 rounded-full border-2 border-current flex items-center justify-center">
                                    <IcPlus />
                                </div>
                                <span className="text-xs uppercase tracking-widest font-semibold">
                                    Add Another Variant
                                </span>
                            </div>
                        </div>
                    )}
                </section>
            </main>

            {/* Slide-over Variant Form */}
            {showPanel && (
                <VariantFormPanel
                    onClose={() => setShowPanel(false)}
                    onSave={handleSaveVariant}
                    saving={saving}
                />
            )}

            {/* Toast feedback */}
            {toast && (
                <Toast
                    msg={toast.msg}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    );
}