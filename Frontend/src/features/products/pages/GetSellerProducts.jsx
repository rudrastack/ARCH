import { useProduct } from "../hook/useProduct";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function GetSellerProducts() {
    const { handleGetSellerProducts } = useProduct();
    const navigate = useNavigate();

    // Data States
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // UI Filter/Search States
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [sortBy, setSortBy] = useState("newest");

    // Modal & Toast States
    const [selectedProduct, setSelectedProduct] = useState(null); // for View Modal
    const [notification, setNotification] = useState(null);

    // Current image index state
    const [currentImageIndex, setCurrentImageIndex] = useState({});

    // Initial Loading Simulation (with fallback to mockup)
    useEffect(() => {
        const loadProducts = async () => {
            setLoading(true);
            try {
                // Call hook if integrated
                const products = await handleGetSellerProducts();
                setProducts(products);
            } catch (error) {
                console.warn("API Error, using mockup fallback catalog:", error);
                setProducts(products);
            } finally {
                setLoading(false);
            }
        };

        loadProducts();
    }, []);

    // Dismiss notifications automatically
    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => setNotification(null), 4000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    // Sorting & Filtering Logic
    const filteredProducts = products
        .filter((prod) => {
            const matchesSearch = prod.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                prod.description.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory === "All" || prod.category === selectedCategory;
            return matchesSearch && matchesCategory;
        })
        .sort((a, b) => {
            if (sortBy === "newest") {
                return new Date(b.createdAt) - new Date(a.createdAt);
            }
            if (sortBy === "priceAsc") {
                return a.priceAmount - b.priceAmount;
            }
            if (sortBy === "priceDesc") {
                return b.priceAmount - a.priceAmount;
            }
            if (sortBy === "titleA-Z") {
                return a.title.localeCompare(b.title);
            }
            return 0;
        });

    // Delete item handler
    const handleDeleteProduct = (productId, e) => {
        e.stopPropagation();
        const productTitle = products.find(p => p._id === productId)?.title;

        // Remove locally from state
        setProducts(prev => prev.filter(p => p._id !== productId));

        setNotification({
            type: "success",
            message: `"${productTitle || "Product"}" has been archived from your vault.`
        });
    };

    // Edit item placeholder
    const handleEditProduct = (productId, e) => {
        e.stopPropagation();
        setNotification({
            type: "info",
            message: "Edit mode is simulated. Catalog updates are ready to bind with ImageKit/API."
        });
    };

    // Currency Symbol Helper
    const getCurrencySymbol = (currency) => {
        switch (currency) {
            case "EUR": return "€";
            case "GBP": return "£";
            case "INR": return "₹";
            case "JPY": return "¥";
            case "CAD": return "C$";
            case "AUD": return "A$";
            default: return "$";
        }
    };

    // Carousel Image Change Handlers
    const nextImage = (productId, totalImages) => {
        setCurrentImageIndex((prev) => ({
            ...prev,
            [productId]: ((prev[productId] || 0) + 1) % totalImages,
        }));
    };

    const prevImage = (productId, totalImages) => {
        setCurrentImageIndex((prev) => ({
            ...prev,
            [productId]:
                ((prev[productId] || 0) - 1 + totalImages) % totalImages,
        }));
        console.log(productId);
    };

    const IcArrowLeft = () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
        </svg>
    );

    return (
        <>
            {/* Google Fonts */}
            <link
                href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap"
                rel="stylesheet"
            />

            <div
                className="min-h-screen selection:bg-[#C9A96E]/30 text-[#1b1c1a] px-6 md:px-12 lg:px-20 py-12 transition-colors duration-300"
                style={{ backgroundColor: "#fbf9f6", fontFamily: "'Inter', sans-serif" }}
            >
                {/* ── NOTIFICATION TOAST ── */}
                {notification && (
                    <div className="fixed top-8 right-8 z-50 animate-fade-in-down">
                        <div
                            className="p-4 rounded-none shadow-sm flex items-center justify-between gap-4 max-w-md border"
                            style={{
                                backgroundColor: notification.type === "success" ? "#f0fdf4" : "#eff6ff",
                                borderColor: notification.type === "success" ? "#bbf7d0" : "#bfdbfe",
                            }}
                        >
                            <div className="flex items-center gap-3">
                                {notification.type === "success" ? (
                                    <svg className="w-5 h-5 text-green-700 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5 text-blue-700 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                )}
                                <p className="text-xs font-medium tracking-wide text-neutral-800">
                                    {notification.message}
                                </p>
                            </div>
                            <button
                                onClick={() => setNotification(null)}
                                className="text-neutral-400 hover:text-neutral-600 transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                )}

                <div className="max-w-7xl mx-auto space-y-12">

                    {/* ── HEADER SECTION ── */}
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-[#e4e2df] pb-8">
                        <div>
                            <button
                                onClick={() => navigate('/')}
                                style={{ fontFamily: "'Cormorant Garamond', serif", background: 'none', border: 'none', cursor: 'pointer', color: "#7A6E63", display: 'flex', alignItems: 'center', gap: 6, padding: 0, fontSize: 13 }}
                            >
                                <IcArrowLeft />
                                <span style={{ letterSpacing: '0.04em', textTransform: 'uppercase', fontSize: 13, fontWeight: 600 }}>Home</span>
                            </button>
                            <span className="text-[10px] uppercase tracking-[0.35em] text-[#C9A96E] font-medium block mb-3 mt-5">
                                Atelier Dashboard
                            </span>
                            <h1
                                className="text-4xl md:text-5xl font-light tracking-wide leading-none"
                                style={{ fontFamily: "'Cormorant Garamond', serif" }}
                            >
                                Seller <em>Collection</em>
                            </h1>
                        </div>

                        {/* Quick action controls & Add Product */}
                        <div className="flex flex-wrap items-center gap-4">
                            {/* Simulator Reload Button */}
                            <button
                                onClick={() => {
                                    setLoading(true);
                                    setTimeout(() => setLoading(false), 900);
                                }}
                                className="px-4 py-3 text-[11px] uppercase tracking-widest text-[#7A6E63] border border-[#d0c5b5] hover:border-[#1b1c1a] hover:text-[#1b1c1a] transition-all bg-white font-medium rounded-lg"
                                title="Simulate reload skeletal layout"
                            >
                                Reload Grid
                            </button>

                            {/* Add Product Button */}
                            <button
                                onClick={() => navigate("/seller/create")}
                                className="px-6 py-3.5 text-[11px] uppercase tracking-[0.2em] font-semibold transition-all duration-300 border border-[#1b1c1a] flex items-center gap-2 group rounded-lg"
                                style={{ backgroundColor: "#1b1c1a", color: "#fbf9f6" }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = "#C9A96E";
                                    e.currentTarget.style.color = "#1b1c1a";
                                    e.currentTarget.style.borderColor = "#C9A96E";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = "#1b1c1a";
                                    e.currentTarget.style.color = "#fbf9f6";
                                    e.currentTarget.style.borderColor = "#1b1c1a";
                                }}
                            >
                                <svg
                                    className="w-4 h-4 transform group-hover:rotate-90 transition-transform duration-300"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                </svg>
                                Add Product
                            </button>
                        </div>
                    </div>

                    {/* ── FILTERS & SEARCH CONTROLS ── */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 border border-[#e4e2df] rounded-2xl">

                        {/* Search Input */}
                        <div className="relative flex-1 max-w-md">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search collection pieces..."
                                className="w-full pl-10 pr-4 py-2.5 text-xs bg-[#fbf9f6] border border-[#d0c5b5] rounded-xl focus:border-[#C9A96E] outline-none transition-all placeholder-[#B5ADA3]"
                            />
                            <svg
                                className="absolute left-3.5 top-3 w-4 h-4 text-[#7A6E63]"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>

                        {/* Filter & Sort selectors */}
                        <div className="flex flex-wrap items-center gap-4">
                            {/* Category Filter */}
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] uppercase tracking-wider text-[#7A6E63] font-semibold">Category</span>
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="bg-transparent border border-[#d0c5b5] rounded-xl px-3 py-2 text-xs text-[#1b1c1a] font-medium outline-none cursor-pointer focus:border-[#C9A96E]"
                                >
                                    <option value="All">All Categories</option>
                                    <option value="Outerwear">Outerwear</option>
                                    <option value="Footwear">Footwear</option>
                                    <option value="Tailoring">Tailoring</option>
                                    <option value="Accessories">Accessories</option>
                                </select>
                            </div>

                            {/* Sort Filter */}
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] uppercase tracking-wider text-[#7A6E63] font-semibold">Sort By</span>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="bg-transparent border border-[#d0c5b5] rounded-xl px-3 py-2 text-xs text-[#1b1c1a] font-medium outline-none cursor-pointer focus:border-[#C9A96E]"
                                >
                                    <option value="newest">Newest Arrivals</option>
                                    <option value="priceAsc">Price: Low to High</option>
                                    <option value="priceDesc">Price: High to Low</option>
                                    <option value="titleA-Z">Name: A to Z</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* ── GRID / LOADING / EMPTY STATE ── */}
                    {loading ? (
                        /* Premium Shimmer Loading Skeletons */
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="border border-[#e4e2df] p-4 bg-white rounded-2xl space-y-4">
                                    <div className="aspect-[3/4] w-full bg-neutral-200 animate-pulse rounded-xl" />
                                    <div className="h-4 bg-neutral-200 animate-pulse w-3/4 rounded" />
                                    <div className="h-3 bg-neutral-200 animate-pulse w-1/2 rounded" />
                                    <div className="h-3 bg-neutral-200 animate-pulse w-1/3 rounded" />
                                    <div className="flex gap-2 pt-2">
                                        <div className="h-8 bg-neutral-200 animate-pulse flex-1 rounded" />
                                        <div className="h-8 bg-neutral-200 animate-pulse flex-1 rounded" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : filteredProducts.length === 0 ? (
                        /* Sophisticated Empty State */
                        <div className="bg-white border border-[#e4e2df] rounded-3xl py-20 px-8 text-center max-w-2xl mx-auto shadow-sm">
                            <svg
                                className="w-16 h-16 text-[#B5ADA3] mx-auto mb-6"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                            </svg>
                            <h3
                                className="text-2xl font-light text-[#1b1c1a] mb-3"
                                style={{ fontFamily: "'Cormorant Garamond', serif" }}
                            >
                                {products.length === 0 ? "Your Vault is Empty" : "No Pieces Found"}
                            </h3>
                            <p className="text-xs text-[#7A6E63] leading-relaxed max-w-md mx-auto mb-8">
                                {products.length === 0
                                    ? "Publish your first couture dress, tailoring masterpiece or luxury accessories to show them to global collectors."
                                    : "Adjust your search filters or clear the active query to display items in your catalog."
                                }
                            </p>
                            {products.length === 0 ? (
                                <button
                                    onClick={() => navigate("/seller/create")}
                                    className="px-6 py-3 text-[11px] uppercase tracking-widest font-semibold border border-[#1b1c1a] bg-[#1b1c1a] text-white hover:bg-[#C9A96E] hover:text-[#1b1c1a] hover:border-[#C9A96E] transition-all rounded-lg"
                                >
                                    Curate First Piece
                                </button>
                            ) : (
                                <button
                                    onClick={() => {
                                        setSearchQuery("");
                                        setSelectedCategory("All");
                                    }}
                                    className="px-6 py-3 text-[11px] uppercase tracking-widest font-semibold border border-[#1b1c1a] hover:bg-[#1b1c1a] hover:text-white transition-all rounded-lg"
                                >
                                    Reset Filters
                                </button>
                            )}
                        </div>
                    ) : (
                        /* Responsive Luxury Product Grid */
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                            {filteredProducts.map((product) => (
                                <div
                                    key={product._id}
                                    className="group bg-white border border-[#e4e2df] hover:border-[#C9A96E] transition-all duration-500 flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-[0_12px_40px_rgba(201,169,110,0.08)] rounded-2xl"
                                >
                                    {/* Thumbnail container */}
                                    <div className="relative aspect-[3/4] overflow-hidden bg-[#fbf9f6] border-b border-[#f5f3f0]">
                                        {product.images && product.images[0] ? (
                                            <img
                                                src={product.images?.[0]?.url}
                                                alt={product.title}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-neutral-100 text-[#B5ADA3] text-xs">
                                                No Image
                                            </div>
                                        )}

                                        {/* Hover Overlay Actions */}
                                        <div className="absolute inset-0 bg-[#1b1c1a]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                                            <button
                                                onClick={() => setSelectedProduct(product)}
                                                className="p-2.5 bg-white text-[#1b1c1a] hover:bg-[#C9A96E] hover:text-white transition-colors shadow-md rounded-full"
                                                title="View Piece Details"
                                            >
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={(e) => handleEditProduct(product._id, e)}
                                                className="p-2.5 bg-white text-[#1b1c1a] hover:bg-[#C9A96E] hover:text-white transition-colors shadow-md rounded-full"
                                                title="Edit Piece"
                                            >
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={(e) => handleDeleteProduct(product._id, e)}
                                                className="p-2.5 bg-white text-[#1b1c1a] hover:bg-red-600 hover:text-white transition-colors shadow-md rounded-full"
                                                title="Archive Piece"
                                            >
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>

                                        {/* Category Badge */}
                                        <span className="absolute top-3 left-3 px-2 py-1 bg-white/95 text-[8px] uppercase tracking-wider text-[#1b1c1a] font-semibold border border-[#e4e2df] rounded shadow-xs">
                                            {product.category}
                                        </span>
                                    </div>

                                    {/* Detail Panel */}
                                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                                        <div>
                                            <h4 className="text-xs uppercase tracking-widest font-semibold text-[#1b1c1a] line-clamp-1 mb-1.5">
                                                {product.title}
                                            </h4>
                                            <p className="text-[11px] text-[#7A6E63] leading-relaxed line-clamp-2">
                                                {product.description}
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between border-t border-[#f5f3f0] pt-4 mt-auto">
                                            <span className="text-[10px] uppercase tracking-widest text-[#B5ADA3]">
                                                Retail Price
                                            </span>
                                            <span className="text-sm font-semibold tracking-wide text-[#C9A96E]">
                                                {getCurrencySymbol(product.price?.currency)}
                                                {product.price?.amount?.toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* ── HIGH-END EDITORIAL VIEW MODAL ── */}
            {selectedProduct && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto animate-fade-in"
                    onClick={() => setSelectedProduct(null)}
                >
                    <div
                        className="bg-white max-w-4xl w-full border border-[#d0c5b5] rounded-3xl overflow-hidden relative shadow-2xl animate-scale-up grid grid-cols-1 md:grid-cols-2"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Image Carousel Side */}
                        <div className="relative aspect-square overflow-hidden">
                            <div
                                className="flex h-full transition-transform duration-500 ease-in-out"
                                style={{
                                    transform: `translateX(-${(currentImageIndex[selectedProduct._id] || 0) * 100
                                        }%)`,
                                }}
                            >
                                {selectedProduct.images?.map((img) => (
                                    <img
                                        key={img._id}
                                        src={img.url}
                                        alt={selectedProduct.title}
                                        className="w-full h-full object-cover flex-shrink-0"
                                    />
                                ))}
                            </div>

                            {/* Previous */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    prevImage(selectedProduct._id, selectedProduct.images.length);
                                }}
                                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white w-8 h-8 rounded-full"
                            >
                                ❮
                            </button>

                            {/* Next */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    nextImage(selectedProduct._id, selectedProduct.images.length);
                                }}
                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white w-8 h-8 rounded-full"
                            >
                                ❯
                            </button>
                        </div>

                        {/* Modal Detail Side */}
                        <div className="p-8 md:p-12 flex flex-col justify-between space-y-8">
                            {/* Close Button */}
                            <button
                                onClick={() => setSelectedProduct(null)}
                                className="absolute top-6 right-6 p-1 bg-[#1b1c1a] text-white hover:bg-[#C9A96E] hover:text-[#1b1c1a] transition-all rounded-full"
                                aria-label="Close modal"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>

                            <div className="space-y-6">
                                <span className="text-[9px] uppercase tracking-[0.25em] text-[#C9A96E] font-semibold border-b border-[#f5f3f0] pb-2 inline-block">
                                    {selectedProduct.category} Catalog Item
                                </span>
                                <h3
                                    className="text-3xl font-light tracking-wide text-[#1b1c1a] leading-tight"
                                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                                >
                                    {selectedProduct.title}
                                </h3>
                                <p className="text-xs text-[#7A6E63] leading-relaxed">
                                    {selectedProduct.description}
                                </p>
                            </div>

                            <div className="space-y-6 border-t border-[#f5f3f0] pt-6">
                                <div className="flex items-end justify-between">
                                    <span className="text-[10px] uppercase tracking-widest text-[#B5ADA3] font-medium">
                                        Valuation
                                    </span>
                                    <span className="text-2xl font-semibold tracking-wide text-[#C9A96E]">
                                        {getCurrencySymbol(selectedProduct.price?.currency)}
                                        {selectedProduct.price?.amount?.toLocaleString()}
                                    </span>
                                </div>

                                <div className="flex gap-4">
                                    <button
                                        onClick={() => {
                                            navigate(`/seller/variants/${selectedProduct._id}`);
                                            setNotification({
                                                type: "info",
                                                message: "Opening product editor..."
                                            });

                                        }}
                                        className="flex-1 py-3 text-center text-xs uppercase tracking-widest font-semibold border border-[#1b1c1a] bg-white text-[#1b1c1a] hover:bg-[#fbf9f6] transition-all rounded-xl"
                                    >
                                        Edit Details
                                    </button>
                                    <button
                                        onClick={() => setSelectedProduct(null)}
                                        className="flex-1 py-3 text-center text-xs uppercase tracking-widest font-semibold border border-[#1b1c1a] bg-[#1b1c1a] text-white hover:bg-[#C9A96E] hover:text-[#1b1c1a] hover:border-[#C9A96E] transition-all rounded-xl"
                                    >
                                        Close Vault
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}


