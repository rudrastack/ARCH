import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProduct } from '../hook/useProduct';

/* ─── Design Tokens — Variant Manager (Stitch: Warm Minimalist Editorial) ─── */
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

/* ─── SVG Icons ─── */
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
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={c.outlineVariant} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="16.5" y1="9.4" x2="7.5" y2="4.21" /><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
);

/* ─── Shared styles ─── */
const inputBase = {
    width: '100%',
    background: 'transparent',
    border: 'none',
    borderBottom: `1px solid ${c.outlineVariant}`,
    padding: '8px 2px',
    fontSize: 14,
    fontFamily: 'Inter, sans-serif',
    color: c.onSurface,
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
};

const labelBase = {
    display: 'block',
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: '0.07em',
    textTransform: 'uppercase',
    color: c.onSurfaceVariant,
    marginBottom: 6,
    fontFamily: 'Inter, sans-serif',
};

/* ─── Toast Notification ─── */
function Toast({ msg, type, onClose }) {
    useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, []);
    const bg = type === 'error' ? c.errorContainer : c.primaryFixed;
    const col = type === 'error' ? c.error : c.primaryDark;
    return (
        <div style={{ position: 'fixed', bottom: 32, right: 32, zIndex: 200, background: bg, color: col, borderRadius: 8, padding: '14px 20px', fontSize: 13, fontFamily: 'Inter, sans-serif', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 10, boxShadow: '0 8px 32px rgba(116,90,39,0.12)', maxWidth: 360 }}>
            {type !== 'error' && <IcCheck />}
            {msg}
        </div>
    );
}

/* ─── Variant Card ─── */
function VariantCard({ variant, index, onStockChange }) {
    const [focused, setFocused] = useState(false);
    const thumbSrc = variant.images?.[0]?.url || null;
    const attrs = Object.entries(variant.attributes || {});
    const hasPrice = variant.price?.amount != null && variant.price.amount !== '';

    return (
        <div style={{ background: c.surface, borderRadius: 8, overflow: 'hidden', boxShadow: '0 4px 24px rgba(116,90,39,0.06)', display: 'flex', flexDirection: 'column', border: `1px solid ${c.surfaceContainerLow}` }}>
            {/* Image strip */}
            <div style={{ height: 160, background: c.surfaceContainerLow, position: 'relative', overflow: 'hidden' }}>
                {thumbSrc
                    ? <img src={thumbSrc} alt="Variant" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 8 }}>
                        <IcPackage />
                        <span style={{ fontSize: 11, color: c.outlineVariant, fontFamily: 'Inter, sans-serif' }}>No Image</span>
                    </div>
                }
                {/* Image count badge */}
                {variant.images?.length > 1 && (
                    <span style={{ position: 'absolute', bottom: 8, right: 8, background: 'rgba(27,28,26,0.65)', color: '#fff', borderRadius: 20, padding: '2px 8px', fontSize: 10, fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                        +{variant.images.length - 1}
                    </span>
                )}
            </div>

            {/* Body */}
            <div style={{ padding: '16px 18px', flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {/* Attribute tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {attrs.length > 0 ? attrs.map(([key, val]) => (
                        <span key={key} style={{ background: c.surfaceContainerLow, borderRadius: 4, padding: '3px 9px', fontSize: 11, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', color: c.onSurface, fontFamily: 'Inter, sans-serif', border: `1px solid ${c.outlineVariant}` }}>
                            <span style={{ color: c.outline, fontWeight: 400 }}>{key}: </span>{val}
                        </span>
                    )) : (
                        <span style={{ fontSize: 12, color: c.outlineVariant, fontFamily: 'Inter, sans-serif' }}>No attributes</span>
                    )}
                </div>

                {/* Price */}
                <div style={{ fontSize: 13, color: c.onSurfaceVariant, fontFamily: 'Inter, sans-serif' }}>
                    {hasPrice ? (
                        <span style={{ fontWeight: 600, color: c.primaryDark, fontSize: 15 }}>
                            {variant.price.amount} {variant.price.currency || 'INR'}
                        </span>
                    ) : (
                        <span style={{ fontStyle: 'italic', color: c.outlineVariant }}>Base price</span>
                    )}
                </div>
            </div>

            {/* Stock row */}
            <div style={{ padding: '12px 18px', borderTop: `1px solid ${c.surfaceContainerLow}`, background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ ...labelBase, marginBottom: 0 }}>Stock</span>
                <input
                    type="number"
                    min="0"
                    value={variant.stock ?? 0}
                    onChange={e => onStockChange(index, e.target.value)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    style={{ width: 80, textAlign: 'right', fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 600, color: c.onSurface, background: 'transparent', border: 'none', borderBottom: `1.5px solid ${focused ? c.primary : c.outlineVariant}`, outline: 'none', padding: '2px 4px', transition: 'border-color 0.2s' }}
                />
            </div>
        </div>
    );
}

/* ─── New Variant Slide-over Panel ─── */
function VariantFormPanel({ onClose, onSave, saving }) {
    const fileInputRef = useRef(null);
    const [attrInputs, setAttrInputs] = useState([{ key: '', value: '' }]);
    const [stock, setStock] = useState('0');
    const [priceAmount, setPriceAmount] = useState('');
    const [priceCurrency, setPriceCurrency] = useState('INR');
    const [images, setImages] = useState([]);
    const [error, setError] = useState('');
    const [focusedAttr, setFocusedAttr] = useState(null);

    function handleAttrChange(idx, field, val) {
        const updated = attrInputs.map((a, i) => i === idx ? { ...a, [field]: val } : a);
        setAttrInputs(updated);
    }

    function addAttr() { setAttrInputs(p => [...p, { key: '', value: '' }]); }

    function removeAttr(idx) {
        if (attrInputs.length === 1) return;
        setAttrInputs(p => p.filter((_, i) => i !== idx));
    }

    function handleImageUpload(e) {
        const files = Array.from(e.target.files);
        if (!files.length) return;
        const slots = 7 - images.length;
        const toAdd = files.slice(0, slots).map(f => ({ file: f, previewUrl: URL.createObjectURL(f) }));
        setImages(p => [...p, ...toAdd]);
        e.target.value = '';
    }

    function removeImage(idx) {
        URL.revokeObjectURL(images[idx]?.previewUrl);
        setImages(p => p.filter((_, i) => i !== idx));
    }

    function buildAttrsObj() {
        const obj = {};
        attrInputs.forEach(a => { if (a.key.trim()) obj[a.key.trim()] = a.value; });
        return obj;
    }

    function handleSubmit() {
        setError('');
        const hasAttr = attrInputs.some(a => a.key.trim() && a.value.trim());
        if (!hasAttr) { setError('Please fill at least one attribute (e.g. Color: Red).'); return; }

        const variantPayload = {
            images: images.map(i => i.file),
            stock: Number(stock) || 0,
            attributes: buildAttrsObj(),
            price: priceAmount ? Number(priceAmount) : undefined,
        };
        onSave(variantPayload, images.map(i => ({ url: i.previewUrl })));
    }

    return (
        /* Overlay */
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', justifyContent: 'flex-end' }}>
            {/* Backdrop */}
            <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(27,28,26,0.35)', backdropFilter: 'blur(2px)', cursor: 'pointer' }} />

            {/* Panel */}
            <div style={{ position: 'relative', width: '100%', maxWidth: 520, height: '100%', background: c.surface, overflowY: 'auto', boxShadow: '-8px 0 48px rgba(116,90,39,0.1)', display: 'flex', flexDirection: 'column' }}>
                {/* Panel Header */}
                <div style={{ padding: '24px 32px', borderBottom: `1px solid ${c.surfaceContainerLow}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, background: c.surface, zIndex: 1 }}>
                    <div>
                        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 600, color: c.onSurface, margin: 0 }}>Create Variant</h2>
                        <p style={{ fontSize: 12, color: c.onSurfaceVariant, fontFamily: 'Inter, sans-serif', margin: '4px 0 0' }}>Add a new product variant with custom attributes</p>
                    </div>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: c.onSurfaceVariant, fontSize: 22, lineHeight: 1, display: 'flex', padding: 4 }}>×</button>
                </div>

                <div style={{ padding: '28px 32px', flex: 1, display: 'flex', flexDirection: 'column', gap: 28 }}>
                    {/* Error */}
                    {error && (
                        <div style={{ background: c.errorContainer, color: c.error, borderRadius: 6, padding: '10px 14px', fontSize: 13, fontFamily: 'Inter, sans-serif' }}>
                            {error}
                        </div>
                    )}

                    {/* Attributes */}
                    <div>
                        <label style={labelBase}>Attributes <span style={{ color: c.error }}>*</span></label>
                        <p style={{ fontSize: 12, color: c.outlineVariant, fontFamily: 'Inter, sans-serif', marginBottom: 14, marginTop: -2 }}>e.g. Color → Red, Size → S, M, L... etc</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {attrInputs.map((attr, idx) => (
                                <div key={idx} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                                    <input
                                        placeholder="Key (e.g. Color)"
                                        value={attr.key}
                                        onChange={e => handleAttrChange(idx, 'key', e.target.value)}
                                        onFocus={() => setFocusedAttr(`${idx}-key`)}
                                        onBlur={() => setFocusedAttr(null)}
                                        style={{ ...inputBase, flex: 1, borderBottomColor: focusedAttr === `${idx}-key` ? c.primary : c.outlineVariant }}
                                    />
                                    <input
                                        placeholder="Value (e.g. Red)"
                                        value={attr.value}
                                        onChange={e => handleAttrChange(idx, 'value', e.target.value)}
                                        onFocus={() => setFocusedAttr(`${idx}-val`)}
                                        onBlur={() => setFocusedAttr(null)}
                                        style={{ ...inputBase, flex: 1, borderBottomColor: focusedAttr === `${idx}-val` ? c.primary : c.outlineVariant }}
                                    />
                                    <button
                                        onClick={() => removeAttr(idx)}
                                        disabled={attrInputs.length === 1}
                                        style={{ background: 'none', border: 'none', cursor: attrInputs.length === 1 ? 'default' : 'pointer', color: attrInputs.length === 1 ? c.outlineVariant : c.error, padding: 4, display: 'flex', flexShrink: 0 }}
                                    ><IcTrash /></button>
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={addAttr}
                            style={{ marginTop: 12, background: 'none', border: 'none', cursor: 'pointer', color: c.primary, fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 6, padding: 0 }}
                        >
                            <IcPlus /> Add Attribute
                        </button>
                    </div>

                    {/* Stock & Price */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                        <div>
                            <label style={labelBase}>Stock</label>
                            <input
                                type="number" min="0"
                                value={stock}
                                onChange={e => setStock(e.target.value)}
                                style={{ ...inputBase }}
                            />
                        </div>
                        <div>
                            <label style={labelBase}>Price Amount <span style={{ color: c.outlineVariant, fontWeight: 400, textTransform: 'none' }}>(optional)</span></label>
                            <input
                                type="number" min="0"
                                placeholder="Leave blank for base price"
                                value={priceAmount}
                                onChange={e => setPriceAmount(e.target.value)}
                                style={{ ...inputBase }}
                            />
                        </div>
                    </div>

                    {/* Currency */}
                    <div style={{ marginTop: -16 }}>
                        <label style={labelBase}>Currency</label>
                        <select
                            value={priceCurrency}
                            onChange={e => setPriceCurrency(e.target.value)}
                            style={{ ...inputBase, cursor: 'pointer' }}
                        >
                            {['INR', 'USD', 'EUR', 'GBP', 'AED'].map(cur => (
                                <option key={cur} value={cur}>{cur}</option>
                            ))}
                        </select>
                    </div>

                    {/* Image Upload */}
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 12 }}>
                            <label style={{ ...labelBase, marginBottom: 0 }}>Variant Images <span style={{ color: c.outlineVariant, fontWeight: 400, textTransform: 'none' }}>(max 7)</span></label>
                            <span style={{ fontSize: 12, color: c.onSurfaceVariant, fontFamily: 'Inter, sans-serif' }}>{images.length}/7</span>
                        </div>

                        {/* Image previews */}
                        {images.length > 0 && (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 12 }}>
                                {images.map((img, i) => (
                                    <div key={i} style={{ aspectRatio: '3/4', background: c.surfaceContainerLow, borderRadius: 4, overflow: 'hidden', position: 'relative' }}>
                                        <img src={img.previewUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                                        <button
                                            onClick={() => removeImage(i)}
                                            style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: 4, cursor: 'pointer', color: c.error, display: 'flex', padding: 4 }}
                                        ><IcTrash /></button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Upload zone */}
                        {images.length < 7 && (
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                style={{ border: `1.5px dashed ${c.outlineVariant}`, borderRadius: 6, padding: '20px 16px', textAlign: 'center', cursor: 'pointer', transition: 'border-color 0.2s, background 0.2s' }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = c.primary; e.currentTarget.style.background = '#fdf8f0'; }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = c.outlineVariant; e.currentTarget.style.background = 'transparent'; }}
                            >
                                <IcImage />
                                <p style={{ fontSize: 13, color: c.onSurfaceVariant, fontFamily: 'Inter, sans-serif', margin: '8px 0 4px' }}>Click to upload images</p>
                                <p style={{ fontSize: 11, color: c.outlineVariant, fontFamily: 'Inter, sans-serif', margin: 0 }}>PNG, JPG, WEBP — Multiple allowed</p>
                            </div>
                        )}
                        <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleImageUpload} style={{ display: 'none' }} />
                    </div>
                </div>

                {/* Panel Footer */}
                <div style={{ padding: '20px 32px', borderTop: `1px solid ${c.surfaceContainerLow}`, display: 'flex', gap: 12, position: 'sticky', bottom: 0, background: c.surface }}>
                    <button
                        onClick={onClose}
                        style={{ flex: 1, padding: '13px 0', border: `1px solid ${c.outlineVariant}`, borderRadius: 6, background: 'transparent', color: c.onSurface, fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer' }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={saving}
                        style={{ flex: 2, padding: '13px 0', background: saving ? c.outlineVariant : c.primary, border: 'none', borderRadius: 6, color: c.onPrimary, fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', cursor: saving ? 'not-allowed' : 'pointer', transition: 'background 0.2s, opacity 0.2s' }}
                    >
                        {saving ? 'Saving…' : 'Save Variant'}
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ─── Main Page ─── */
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

    /* ─── Fetch ─── */
    useEffect(() => {
        async function load() {
            setLoading(true);
            try {
                const data = await handleGetProductById(productId);
                setProduct(data);
                setLocalVariants(data?.variants || []);
            } catch (err) {
                console.error(err);
                setToast({ msg: 'Failed to load product.', type: 'error' });
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [productId]);

    /* ─── Stock change ─── */
    function handleStockChange(idx, val) {
        setLocalVariants(prev => {
            const updated = [...prev];
            updated[idx] = { ...updated[idx], stock: Number(val) };
            return updated;
        });
    }

    /* ─── Save new variant ─── */
    async function handleSaveVariant(payload, previewImages) {
        setSaving(true);
        try {
            await handleCreateProductVariants(productId, payload);

            // Optimistically add to list with previews
            setLocalVariants(prev => [...prev, {
                images: previewImages,
                stock: payload.stock,
                attributes: payload.attributes,
                price: payload.price ? { amount: payload.price, currency: 'INR' } : null,
            }]);

            setShowPanel(false);
            setToast({ msg: 'Variant created successfully!', type: 'success' });
        } catch (err) {
            console.error(err);
            setToast({ msg: 'Failed to save variant. Please try again.', type: 'error' });
        } finally {
            setSaving(false);
        }
    }

    /* ─── Loading / Error states ─── */
    if (loading) {
        return (
            <div style={{ minHeight: '100vh', background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                <div style={{ width: 36, height: 36, border: `3px solid ${c.outlineVariant}`, borderTop: `3px solid ${c.primary}`, borderRadius: '50%', animation: 'spin 0.9s linear infinite' }} />
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: c.onSurfaceVariant, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Loading Variant Manager…</p>
            </div>
        );
    }

    if (!product) {
        return (
            <div style={{ minHeight: '100vh', background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, color: c.onSurface }}>Product not found.</p>
            </div>
        );
    }

    const images = product.images || [];

    return (
        <div style={{ minHeight: '100vh', background: c.bg, fontFamily: 'Inter, sans-serif', color: c.onSurface }}>
            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
                * { box-sizing: border-box; }
                input[type=number]::-webkit-inner-spin-button { opacity: 0.4; }
                input::placeholder { color: ${c.outlineVariant}; }
                select option { background: ${c.surface}; }
            `}</style>

            {/* ── STICKY HEADER ── */}
            <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(251,249,246,0.9)', backdropFilter: 'blur(10px)', borderBottom: `1px solid ${c.outlineVariant}20`, padding: '0 40px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <button
                        onClick={() => navigate('/seller/get')}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: c.onSurfaceVariant, display: 'flex', alignItems: 'center', gap: 6, padding: 0, fontSize: 13, fontFamily: 'Inter, sans-serif' }}
                    >
                        <IcArrowLeft />
                        <span style={{ letterSpacing: '0.04em', textTransform: 'uppercase', fontSize: 11, fontWeight: 600 }}>Products</span>
                    </button>
                    <span style={{ color: c.outlineVariant, fontSize: 16 }}>/</span>
                    <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 600, color: c.onSurface }}>
                        {product.title?.length > 32 ? product.title.slice(0, 32) + '…' : product.title}
                    </span>
                </div>
                <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: c.primary, background: c.primaryFixed, padding: '4px 12px', borderRadius: 20 }}>
                    Seller Dashboard
                </span>
            </header>

            <main style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 40px 80px' }}>

                {/* ── BASE PRODUCT PANEL ── */}
                <section style={{ marginBottom: 64 }}>
                    <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: c.primary, marginBottom: 20 }}>Base Product</p>

                    <div style={{ display: 'grid', gridTemplateColumns: '420px 1fr', gap: 48, background: c.surface, borderRadius: 12, padding: 36, boxShadow: '0 4px 32px rgba(116,90,39,0.05)' }}>
                        {/* Gallery */}
                        <div>
                            <div style={{ aspectRatio: '4/5', background: c.surfaceContainerLow, borderRadius: 8, overflow: 'hidden', marginBottom: 10 }}>
                                {images[activeThumb]
                                    ? <img src={images[activeThumb].url} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                                    : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: c.outlineVariant }}><IcPackage /></div>
                                }
                            </div>
                            {images.length > 1 && (
                                <div style={{ display: 'flex', gap: 8, overflowX: 'auto' }}>
                                    {images.map((img, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setActiveThumb(i)}
                                            style={{ flexShrink: 0, width: 56, height: 72, borderRadius: 4, overflow: 'hidden', border: `2px solid ${i === activeThumb ? c.primary : 'transparent'}`, cursor: 'pointer', padding: 0, background: 'none', transition: 'border-color 0.2s' }}
                                        >
                                            <img src={img.url} alt={`Thumb ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Info */}
                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 20 }}>
                            <div>
                                <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: c.onSurfaceVariant, marginBottom: 6 }}>Product Title</p>
                                <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, fontWeight: 600, color: c.onSurface, margin: 0, lineHeight: 1.2 }}>{product.title}</h1>
                            </div>

                            <p style={{ fontSize: 15, lineHeight: 1.7, color: c.onSurfaceVariant, margin: 0, maxWidth: 420 }}>{product.description}</p>

                            <div style={{ display: 'flex', gap: 32 }}>
                                <div>
                                    <p style={{ ...labelBase, marginBottom: 4 }}>Base Price</p>
                                    <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 500, color: c.primaryDark, margin: 0 }}>
                                        {product.price?.amount ?? '—'} <span style={{ fontSize: 14, fontWeight: 400, color: c.onSurfaceVariant }}>{product.price?.currency ?? ''}</span>
                                    </p>
                                </div>
                                <div>
                                    <p style={{ ...labelBase, marginBottom: 4 }}>Variants</p>
                                    <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 500, color: c.onSurface, margin: 0 }}>
                                        {localVariants.length}
                                    </p>
                                </div>
                            </div>

                            <div style={{ paddingTop: 8, borderTop: `1px solid ${c.surfaceContainerLow}` }}>
                                <p style={labelBase}>Product ID</p>
                                <code style={{ fontSize: 12, color: c.outline, fontFamily: 'monospace', background: c.surfaceContainerLow, padding: '4px 8px', borderRadius: 4 }}>{productId}</code>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── VARIANTS & INVENTORY ── */}
                <section>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 28 }}>
                        <div>
                            <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: c.primary, marginBottom: 6 }}>Inventory</p>
                            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 600, color: c.onSurface, margin: 0 }}>Variants & Stock</h2>
                        </div>
                        <button
                            onClick={() => setShowPanel(true)}
                            style={{ display: 'flex', alignItems: 'center', gap: 8, background: c.primary, color: c.onPrimary, border: 'none', borderRadius: 6, padding: '12px 22px', fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer', transition: 'opacity 0.2s' }}
                            onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                        >
                            <IcPlus /> Add Variant
                        </button>
                    </div>

                    {/* Empty state */}
                    {localVariants.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '64px 0', background: c.surface, borderRadius: 12, border: `1.5px dashed ${c.outlineVariant}` }}>
                            <div style={{ marginBottom: 16 }}><IcPackage /></div>
                            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 500, color: c.onSurface, margin: '0 0 8px' }}>No variants yet</h3>
                            <p style={{ fontSize: 14, color: c.onSurfaceVariant, marginBottom: 24 }}>Add your first variant to start managing inventory.</p>
                            <button
                                onClick={() => setShowPanel(true)}
                                style={{ background: c.primary, color: c.onPrimary, border: 'none', borderRadius: 6, padding: '12px 28px', fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer' }}
                            >
                                Create First Variant
                            </button>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
                            {localVariants.map((variant, idx) => (
                                <VariantCard
                                    key={variant._id || idx}
                                    variant={variant}
                                    index={idx}
                                    onStockChange={handleStockChange}
                                />
                            ))}

                            {/* Add more card */}
                            <div
                                onClick={() => setShowPanel(true)}
                                style={{ minHeight: 240, border: `1.5px dashed ${c.outlineVariant}`, borderRadius: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, cursor: 'pointer', transition: 'border-color 0.2s, background 0.2s', color: c.onSurfaceVariant }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = c.primary; e.currentTarget.style.background = '#fdf8f0'; e.currentTarget.style.color = c.primary; }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = c.outlineVariant; e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = c.onSurfaceVariant; }}
                            >
                                <div style={{ width: 44, height: 44, borderRadius: '50%', border: `1.5px solid currentColor`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <IcPlus />
                                </div>
                                <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'Inter, sans-serif' }}>Add Variant</span>
                            </div>
                        </div>
                    )}
                </section>
            </main>

            {/* ── SLIDE-OVER PANEL ── */}
            {showPanel && (
                <VariantFormPanel
                    onClose={() => setShowPanel(false)}
                    onSave={handleSaveVariant}
                    saving={saving}
                />
            )}

            {/* ── TOAST ── */}
            {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
}