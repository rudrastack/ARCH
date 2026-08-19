import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProduct } from '../hook/useProduct'

export default function Collection() {
    // Data & Loading States
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(false)
    // UI Filter/Search States
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("All")
    const [sortBy, setSortBy] = useState("newest")

    const navigate = useNavigate()
    const { handleGetAllProducts } = useProduct()

    // Fetch products on component mount
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true)
                const data = await handleGetAllProducts()
                setProducts(data || [])
            } catch (error) {
                console.error("Error fetching products:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchProducts()
    }, [handleGetAllProducts])

    const categories = [...new Set(products.map((product) => product.category).filter(Boolean))]

    // Filter and sort products
    const filteredProducts = products
        .filter((product) => {
            const matchesSearch = product.title?.toLowerCase().includes(searchQuery.toLowerCase())
            const matchesCategory = selectedCategory === "All" || product.category === selectedCategory
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



    return (
        <div className="min-h-screen bg-[#fbf9f6] p-6 md:p-12 lg:p-16">
            <div className="max-w-[1440px] mx-auto space-y-8">
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
                                {categories.map((category) => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-x-5 gap-y-12">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="border border-[#e4e2df] p-4 bg-white rounded-2xl space-y-4">
                                <div className="aspect-3/4 w-full bg-neutral-200 animate-pulse rounded-xl" />
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
                                    setSearchQuery("")
                                    setSelectedCategory("All")
                                }}
                                className="px-6 py-3 text-[11px] uppercase tracking-widest font-semibold border border-[#1b1c1a] hover:bg-[#1b1c1a] hover:text-white transition-all rounded-lg"
                            >
                                Reset Filters
                            </button>
                        )}
                    </div>
                ) : (
                    /* Responsive Luxury Product Grid */
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-5 gap-y-12">
                        {filteredProducts.map((product) => (
                            <div
                                key={product._id}
                                onClick={() => navigate(`/details/${product._id}`)}
                                onKeyDown={(event) => {
                                    if (event.key === "Enter" || event.key === " ") navigate(`/details/${product._id}`)
                                }}
                                role="link"
                                tabIndex={0}
                                className="group cursor-pointer"
                            >
                                {/* Thumbnail container */}
                                <div className="relative aspect-[4/5] overflow-hidden bg-[#f1efec]">
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


                                    {/* Category Badge */}
                                    <span className="absolute top-3 right-3 px-2 py-1 bg-[#ef1717] text-[9px] text-white font-medium">
                                        New
                                    </span>
                                </div>

                                {/* Product Info */}
                                <div className="pt-4 space-y-2">
                                    <h4 className="text-[13px] sm:text-sm font-medium text-[#1b1c1a] line-clamp-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                                        {product.title || "Untitled piece"}
                                    </h4>
                                    <p className="text-[10px] uppercase tracking-wider text-[#7A6E63]">{product.category || "Collection"}</p>
                                    <p className="text-xs sm:text-sm font-semibold text-[#1b1c1a]">
                                        {product.price?.currency || "INR"} {Number(product.price?.amount || 0).toLocaleString("en-IN")}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

