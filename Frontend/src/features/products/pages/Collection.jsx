import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProduct } from '../hook/useProduct'

export default function Collection() {
    // ── State ─────────────────────────────────────────────────────────
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(false)
    const [searchInput, setSearchInput] = useState("")    // raw input value
    const [searchQuery, setSearchQuery] = useState("")    // debounced query
    const [selectedCategory, setSelectedCategory] = useState("All")
    const [sortBy, setSortBy] = useState("newest")

    const navigate = useNavigate()
    const { handleGetAllProducts } = useProduct()
    const debounceTimer = useRef(null)

    // ── Fetch products ONCE on mount ─────────────────────────────────
    // NOTE: Empty dep array [] — we deliberately do not re-run on
    // handleGetAllProducts identity changes (it is not memoized in the hook).
    useEffect(() => {
        let cancelled = false
        const fetchProducts = async () => {
            try {
                setLoading(true)
                const data = await handleGetAllProducts()
                if (!cancelled) setProducts(data || [])
            } catch (error) {
                console.error("Error fetching products:", error)
            } finally {
                if (!cancelled) setLoading(false)
            }
        }
        fetchProducts()
        return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // ── Debounced search (300ms) ──────────────────────────────────────
    const handleSearchChange = useCallback((e) => {
        const val = e.target.value
        setSearchInput(val)
        clearTimeout(debounceTimer.current)
        debounceTimer.current = setTimeout(() => {
            setSearchQuery(val)
        }, 300)
    }, [])

    // ── Derived data (memoized) ───────────────────────────────────────
    const categories = useMemo(
        () => ["All", ...new Set(products.map(p => p.category).filter(Boolean))],
        [products]
    )

    const filteredProducts = useMemo(() => {
        const q = searchQuery.toLowerCase()
        return products
            .filter(product => {
                const matchesSearch = !q || product.title?.toLowerCase().includes(q)
                const matchesCategory =
                    selectedCategory === "All" || product.category === selectedCategory
                return matchesSearch && matchesCategory
            })
            .sort((a, b) => {
                switch (sortBy) {
                    case "priceAsc":
                        return (a.price?.amount || 0) - (b.price?.amount || 0)
                    case "priceDesc":
                        return (b.price?.amount || 0) - (a.price?.amount || 0)
                    case "titleA-Z":
                        return (a.title || "").localeCompare(b.title || "")
                    case "newest":
                    default:
                        return new Date(b.createdAt) - new Date(a.createdAt)
                }
            })
    }, [products, searchQuery, selectedCategory, sortBy])

    const handleClearFilters = useCallback(() => {
        setSearchInput("")
        setSearchQuery("")
        setSelectedCategory("All")
    }, [])

    // ── Render ────────────────────────────────────────────────────────
    return (
        <div className="min-h-screen bg-[#fbf9f6]" style={{ paddingTop: 72 }}>
            <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 py-8 md:py-12 space-y-8">

                {/* ── PAGE HEADER ─────────────────────────────────────── */}
                <div className="border-b border-[#e4e2df] pb-6">
                    <p className="text-[10px] uppercase tracking-[0.3em] text-[#C9A96E] font-medium mb-2">
                        ARKS Studio
                    </p>
                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
                        <h1
                            className="text-3xl sm:text-4xl md:text-5xl font-light text-[#1b1c1a]"
                            style={{ fontFamily: "'Cormorant Garamond', serif" }}
                        >
                            The Vault
                        </h1>
                        {!loading && (
                            <span className="text-[11px] text-[#7A6E63] tracking-wide">
                                {filteredProducts.length} piece{filteredProducts.length !== 1 ? "s" : ""}
                                {selectedCategory !== "All" ? ` in ${selectedCategory}` : ""}
                            </span>
                        )}
                    </div>
                </div>

                {/* ── SEARCH + SORT BAR ──────────────────────────────── */}
                <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                    {/* Search Input */}
                    <div className="relative flex-1 max-w-full sm:max-w-md">
                        <input
                            type="text"
                            value={searchInput}
                            onChange={handleSearchChange}
                            placeholder="Search the collection…"
                            className="w-full pl-10 pr-10 py-3 text-xs bg-white border border-[#d0c5b5] focus:border-[#C9A96E] outline-none transition-colors duration-200 placeholder-[#B5ADA3] text-[#1b1c1a]"
                        />
                        {/* Search icon */}
                        <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A6E63]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        {/* Clear button */}
                        {searchInput && (
                            <button
                                onClick={() => { setSearchInput(""); setSearchQuery("") }}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#B5ADA3] hover:text-[#1b1c1a] transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>

                    {/* Sort Select */}
                    <div className="flex items-center gap-2 sm:ml-auto">
                        <span className="text-[10px] uppercase tracking-wider text-[#7A6E63] font-semibold whitespace-nowrap">
                            Sort
                        </span>
                        <select
                            value={sortBy}
                            onChange={e => setSortBy(e.target.value)}
                            className="bg-white border border-[#d0c5b5] px-3 py-2.5 text-xs text-[#1b1c1a] font-medium outline-none cursor-pointer focus:border-[#C9A96E] transition-colors"
                        >
                            <option value="newest">Newest Arrivals</option>
                            <option value="priceAsc">Price: Low → High</option>
                            <option value="priceDesc">Price: High → Low</option>
                            <option value="titleA-Z">Name: A → Z</option>
                        </select>
                    </div>
                </div>

                {/* ── CATEGORY PILLS ────────────────────────────────── */}
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`collection-category-pill ${selectedCategory === cat ? "active" : ""}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* ── GRID / LOADING / EMPTY ─────────────────────────── */}
                {loading ? (
                    /* Shimmer Skeletons */
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-10">
                        {Array.from({ length: 10 }).map((_, i) => (
                            <div key={i} className="space-y-3">
                                <div className="aspect-[4/5] w-full bg-[#ebe9e5] animate-pulse" />
                                <div className="h-3 bg-[#ebe9e5] animate-pulse w-4/5" />
                                <div className="h-2.5 bg-[#ebe9e5] animate-pulse w-1/2" />
                                <div className="h-2.5 bg-[#ebe9e5] animate-pulse w-1/3" />
                            </div>
                        ))}
                    </div>
                ) : filteredProducts.length === 0 ? (
                    /* Empty State */
                    <div className="py-24 text-center">
                        <svg className="w-14 h-14 text-[#d0c5b5] mx-auto mb-6" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                        </svg>
                        <h2
                            className="text-2xl font-light text-[#1b1c1a] mb-3"
                            style={{ fontFamily: "'Cormorant Garamond', serif" }}
                        >
                            {products.length === 0 ? "The Vault is Empty" : "No Pieces Found"}
                        </h2>
                        <p className="text-xs text-[#7A6E63] leading-relaxed max-w-xs mx-auto mb-8">
                            {products.length === 0
                                ? "Publish your first couture piece to show it to global collectors."
                                : "Adjust your search or clear filters to reveal the collection."
                            }
                        </p>
                        {(searchQuery || selectedCategory !== "All") && (
                            <button
                                onClick={handleClearFilters}
                                className="px-6 py-2.5 text-[10px] uppercase tracking-widest font-semibold border border-[#1b1c1a] hover:bg-[#1b1c1a] hover:text-white transition-all"
                            >
                                Clear Filters
                            </button>
                        )}
                    </div>
                ) : (
                    /* Product Grid */
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 sm:gap-x-6 gap-y-10 sm:gap-y-14">
                        {filteredProducts.map(product => (
                            <ProductCard
                                key={product._id}
                                product={product}
                                onClick={() => navigate(`/details/${product._id}`)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

/* ── PRODUCT CARD (memoized) ───────────────────────────────────────── */
const ProductCard = ({ product, onClick }) => {
    const imageUrl = product.images?.[0]?.url || (product.variants?.[0]?.images?.[0]?.url) || null

    return (
        <div
            role="link"
            tabIndex={0}
            onClick={onClick}
            onKeyDown={e => { if (e.key === "Enter" || e.key === " ") onClick() }}
            className="group cursor-pointer"
            style={{ outline: "none" }}
        >
            {/* Image Container */}
            <div className="relative aspect-[4/5] overflow-hidden bg-[#f1efec] mb-3">
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={product.title || "Product"}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#B5ADA3] text-xs">
                        No Image
                    </div>
                )}

                {/* "New" Badge */}
                <span className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-[#1b1c1a] text-[#fbf9f6] text-[8px] font-semibold tracking-[0.15em] uppercase">
                    New
                </span>

                {/* Quick-view hover overlay */}
                <div className="absolute inset-0 bg-[#1b1c1a]/0 group-hover:bg-[#1b1c1a]/8 transition-colors duration-400 flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100">
                    <span className="bg-[#fbf9f6] text-[#1b1c1a] text-[9px] uppercase tracking-[0.2em] font-semibold px-4 py-2 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                        View Details
                    </span>
                </div>
            </div>

            {/* Product Info */}
            <div className="space-y-1">
                <p className="text-[9px] uppercase tracking-[0.18em] text-[#C9A96E] font-medium">
                    {product.category || "Collection"}
                </p>
                <h3
                    className="text-[13px] sm:text-sm font-medium text-[#1b1c1a] line-clamp-2 leading-snug"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                    {product.title || "Untitled Piece"}
                </h3>
                <p className="text-xs font-semibold text-[#1b1c1a]">
                    {product.price?.currency || "INR"}{" "}
                    {Number(product.price?.amount || 0).toLocaleString("en-IN")}
                </p>
            </div>
        </div>
    )
}
