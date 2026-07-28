import { useProduct } from "../hook/useProduct";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";

export default function CreateProduct() {
    const { handleCreateProduct } = useProduct();
    const navigate = useNavigate();

    // Form fields state
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        priceAmount: "",
        priceCurrency: "USD",
    });

    // Image upload state
    const [images, setImages] = useState([]);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef(null);

    // Form submission & feedback state
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState(null);

    // Auto-dismiss notification
    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => {
                setNotification(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    // Handle form fields input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Simulate ImageKit upload progress
    const simulateUpload = (id) => {
        let currentProgress = 0;
        const interval = setInterval(() => {
            currentProgress += Math.floor(Math.random() * 15) + 10;
            if (currentProgress >= 100) {
                currentProgress = 100;
                clearInterval(interval);
                setImages((prev) =>
                    prev.map((img) =>
                        img.id === id ? { ...img, progress: 100, status: "done" } : img
                    )
                );
            } else {
                setImages((prev) =>
                    prev.map((img) =>
                        img.id === id ? { ...img, progress: currentProgress } : img
                    )
                );
            }
        }, 150);
    };

    // Process files added
    const handleFiles = (filesList) => {
        const filesArray = Array.from(filesList);
        const currentCount = images.length;
        const availableSlots = 7 - currentCount;

        if (filesArray.length > availableSlots) {
            setNotification({
                type: "error",
                message: `You can only add up to 7 images. You have ${currentCount} and tried to add ${filesArray.length} more.`,
            });
            // Slice to fit remaining slots
            filesArray.splice(availableSlots);
        }

        if (filesArray.length === 0) return;

        const newImages = filesArray.map((file) => {
            const newId = Math.random().toString(36).substr(2, 9);
            return {
                id: newId,
                file,
                url: URL.createObjectURL(file),
                progress: 0,
                status: "uploading",
            };
        });

        setImages((prev) => [...prev, ...newImages]);

        // Start progress simulation for each new image
        newImages.forEach((img) => {
            simulateUpload(img.id);
        });
    };

    // Drag-and-drop handlers
    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFiles(e.dataTransfer.files);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    const handleFileSelect = (e) => {
        if (e.target.files && e.target.files[0]) {
            handleFiles(e.target.files);
        }
    };

    // Remove single image from list
    const removeImage = (id, e) => {
        e.stopPropagation();
        setImages((prev) => {
            const target = prev.find((img) => img.id === id);
            if (target && target.url) {
                URL.revokeObjectURL(target.url);
            }
            return prev.filter((img) => img.id !== id);
        });
    };

    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate that all uploads are done
        const hasUploading = images.some((img) => img.status === "uploading");
        if (hasUploading) {
            setNotification({
                type: "warning",
                message: "Please wait for all images to finish uploading.",
            });
            return;
        }

        // Validate at least one image
        if (images.length === 0) {
            setNotification({
                type: "warning",
                message: "Please upload at least one image of your product.",
            });
            return;
        }

        setLoading(true);
        try {
            // Prepare payload
            const imageUrls = images.map((img) => img.url);
            const payload = {
                ...formData,
                priceAmount: parseFloat(formData.priceAmount),
                images: imageUrls,
            };

            // Call API via hook
            await handleCreateProduct(payload);

            setNotification({
                type: "success",
                message: "Product published successfully to the catalog.",
            });

            // Redirect back to dashboard after brief delay
            setTimeout(() => {
                navigate("/seller/get");
            }, 1500);
        } catch (error) {
            console.error("Failed to create product:", error);
            setNotification({
                type: "error",
                message: "Error publishing product. Reverting to offline preview.",
            });
            // Show offline success for design verification
            setTimeout(() => {
                navigate("/seller/get");
            }, 2000);
        } finally {
            setLoading(false);
        }
    };

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
                {/* ── BREADCRUMB / HEADER ── */}
                <div className="max-w-7xl mx-auto mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#e4e2df] pb-6">
                    <div>
                        <span
                            onClick={() => navigate("/seller/get")}
                            className="text-[10px] uppercase tracking-[0.25em] text-[#7A6E63] hover:text-[#C9A96E] transition-colors cursor-pointer flex items-center gap-2 mb-4 group"
                        >
                            <svg
                                className="w-3.5 h-3.5 transform group-hover:-translate-x-1 transition-transform"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                            </svg>
                            Back to Collection
                        </span>
                        <h1
                            className="text-4xl md:text-5xl font-light tracking-wide leading-tight"
                            style={{ fontFamily: "'Cormorant Garamond', serif" }}
                        >
                            Curate <em>New Piece</em>
                        </h1>
                    </div>
                    <div className="text-[11px] uppercase tracking-[0.18em] text-[#B5ADA3] font-light">
                        Step 1 of 1 — Catalog Details
                    </div>
                </div>

                {/* ── NOTIFICATION TOAST ── */}
                {notification && (
                    <div className="fixed top-8 right-8 z-50 animate-fade-in-down">
                        <div
                            className="p-4 rounded-none shadow-sm flex items-center justify-between gap-4 max-w-md border"
                            style={{
                                backgroundColor:
                                    notification.type === "success"
                                        ? "#f0fdf4"
                                        : notification.type === "error"
                                            ? "#fef2f2"
                                            : "#fffbeb",
                                borderColor:
                                    notification.type === "success"
                                        ? "#bbf7d0"
                                        : notification.type === "error"
                                            ? "#fecaca"
                                            : "#fef3c7",
                            }}
                        >
                            <div className="flex items-center gap-3">
                                {notification.type === "success" ? (
                                    <svg className="w-5 h-5 text-green-700 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5 text-amber-700 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
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

                {/* ── TWO-COLUMN LAYOUT FORM ── */}
                <form onSubmit={handleSubmit} className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">

                    {/* LEFT COLUMN: Fields (7 Cols) */}
                    <div className="lg:col-span-7 space-y-12">
                        {/* Information Card */}
                        <div className="bg-white border border-[#e4e2df] p-8 md:p-10 rounded-2xl relative transition-all duration-300 hover:border-[#d0c5b5] hover:shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
                            <h2
                                className="text-xl font-light tracking-wider text-[#1b1c1a] mb-10 border-b border-[#f5f3f0] pb-4"
                                style={{ fontFamily: "'Cormorant Garamond', serif" }}
                            >
                                Product Information
                            </h2>

                            <div className="space-y-10">
                                {/* Title Floating Label */}
                                <div className="relative group">
                                    <input
                                        id="form-title"
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        required
                                        placeholder=" "
                                        className="peer w-full bg-transparent outline-none py-3 text-sm transition-all duration-300 border-b border-[#d0c5b5] focus:border-[#C9A96E]"
                                    />
                                    <label
                                        htmlFor="form-title"
                                        className="absolute left-0 top-3 text-xs tracking-widest uppercase font-medium text-[#7A6E63] pointer-events-none transition-all duration-300 origin-left transform 
                                        peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 
                                        peer-focus:-translate-y-6 peer-focus:scale-85 peer-focus:text-[#C9A96E]
                                        peer-[:not(:placeholder-shown)]:-translate-y-6 peer-[:not(:placeholder-shown)]:scale-85"
                                    >
                                        Product Title
                                    </label>
                                </div>

                                {/* Description Textarea */}
                                <div className="relative group">
                                    <textarea
                                        id="form-description"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        required
                                        rows="4"
                                        placeholder=" "
                                        className="peer w-full bg-transparent outline-none py-3 text-sm transition-all duration-300 border-b border-[#d0c5b5] focus:border-[#C9A96E] resize-none"
                                    />
                                    <label
                                        htmlFor="form-description"
                                        className="absolute left-0 top-3 text-xs tracking-widest uppercase font-medium text-[#7A6E63] pointer-events-none transition-all duration-300 origin-left transform 
                                        peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 
                                        peer-focus:-translate-y-6 peer-focus:scale-85 peer-focus:text-[#C9A96E]
                                        peer-[:not(:placeholder-shown)]:-translate-y-6 peer-[:not(:placeholder-shown)]:scale-85"
                                    >
                                        Description / Editorial Review
                                    </label>
                                </div>

                                {/* Currency & Price (Side by Side) */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                                    {/* Price Amount */}
                                    <div className="sm:col-span-2 relative group">
                                        <input
                                            id="form-priceAmount"
                                            type="number"
                                            name="priceAmount"
                                            value={formData.priceAmount}
                                            onChange={handleChange}
                                            required
                                            min="0"
                                            step="0.01"
                                            placeholder=" "
                                            className="peer w-full bg-transparent outline-none py-3 text-sm transition-all duration-300 border-b border-[#d0c5b5] focus:border-[#C9A96E]"
                                        />
                                        <label
                                            htmlFor="form-priceAmount"
                                            className="absolute left-0 top-3 text-xs tracking-widest uppercase font-medium text-[#7A6E63] pointer-events-none transition-all duration-300 origin-left transform 
                                            peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 
                                            peer-focus:-translate-y-6 peer-focus:scale-85 peer-focus:text-[#C9A96E]
                                            peer-[:not(:placeholder-shown)]:-translate-y-6 peer-[:not(:placeholder-shown)]:scale-85"
                                        >
                                            Price Amount
                                        </label>
                                    </div>

                                    {/* Currency Dropdown */}
                                    <div className="relative group flex flex-col gap-2">
                                        <label
                                            htmlFor="form-priceCurrency"
                                            className="text-[10px] uppercase tracking-widest font-semibold text-[#7A6E63]"
                                        >
                                            Currency
                                        </label>
                                        <select
                                            id="form-priceCurrency"
                                            name="priceCurrency"
                                            value={formData.priceCurrency}
                                            onChange={handleChange}
                                            className="w-full bg-transparent outline-none py-2 text-sm border-b border-[#d0c5b5] focus:border-[#C9A96E] cursor-pointer text-[#1b1c1a] font-medium"
                                        >
                                            <option value="USD">USD ($)</option>
                                            <option value="EUR">EUR (€)</option>
                                            <option value="GBP">GBP (£)</option>
                                            <option value="INR">INR (₹)</option>
                                            <option value="JPY">JPY (¥)</option>
                                            <option value="CAD">CAD (C$)</option>
                                            <option value="AUD">AUD (A$)</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Informative Guidance */}
                        <div className="border-l-2 border-[#C9A96E] pl-6 py-2">
                            <p className="text-[11px] uppercase tracking-[0.2em] text-[#C9A96E] font-medium mb-1">
                                Editorial Standards
                            </p>
                            <p className="text-xs text-[#7A6E63] leading-relaxed">
                                Ensure your product titles and descriptions maintain the luxury tone. Use concise descriptions focusing on materials, silhouette, and design philosophy.
                            </p>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Media Upload (5 Cols) */}
                    <div className="lg:col-span-5 space-y-8">
                        {/* Media Upload Card */}
                        <div className="bg-white border border-[#e4e2df] p-8 rounded-2xl relative transition-all duration-300 hover:border-[#d0c5b5] hover:shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
                            <div className="flex items-center justify-between mb-8 border-b border-[#f5f3f0] pb-4">
                                <h3
                                    className="text-lg font-light tracking-wider text-[#1b1c1a]"
                                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                                >
                                    Product Images
                                </h3>
                                <span className="text-xs tracking-wider text-[#7A6E63] font-medium">
                                    {images.length}/7 images
                                </span>
                            </div>

                            {/* Hidden file input */}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleFileSelect}
                                className="hidden"
                            />

                            {/* Drag and Drop Box */}
                            <div
                                onDragEnter={handleDrag}
                                onDragOver={handleDrag}
                                onDragLeave={handleDrag}
                                onDrop={handleDrop}
                                onClick={triggerFileInput}
                                className={`w-full py-12 px-6 border-2 border-dashed rounded-xl transition-all duration-300 flex flex-col items-center justify-center cursor-pointer text-center ${dragActive
                                        ? "border-[#C9A96E] bg-[#C9A96E]/5"
                                        : "border-[#d0c5b5] hover:border-[#7A6E63] bg-[#fbf9f6]/30 hover:bg-[#fbf9f6]"
                                    }`}
                            >
                                <svg
                                    className={`w-8 h-8 mb-4 transition-colors duration-300 ${dragActive ? "text-[#C9A96E]" : "text-[#7A6E63]"
                                        }`}
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.2"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                <p className="text-[11px] uppercase tracking-widest text-neutral-800 font-semibold mb-1">
                                    Drag &amp; Drop Images
                                </p>
                                <p className="text-[10px] tracking-wider text-[#7A6E63]">
                                    or click to browse from files
                                </p>
                                <p className="text-[9px] text-[#B5ADA3] mt-3 tracking-wide">
                                    PNG, JPG or WebP (max. 7 files)
                                </p>
                            </div>

                            {/* Previews grid */}
                            {images.length > 0 && (
                                <div className="grid grid-cols-2 gap-4 mt-8">
                                    {images.map((image) => (
                                        <div
                                            key={image.id}
                                            className="group relative bg-[#fbf9f6] border border-[#e4e2df] aspect-square rounded-xl overflow-hidden shadow-sm"
                                        >
                                            {/* Preview Image */}
                                            <img
                                                src={image.url}
                                                alt="Preview"
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />

                                            {/* Status Overlay / Progress placeholder */}
                                            {image.status === "uploading" && (
                                                <div className="absolute inset-0 bg-[#fbf9f6]/95 flex flex-col justify-center items-center p-3">
                                                    <span className="text-[9px] uppercase tracking-widest text-[#7A6E63] font-semibold mb-2 animate-pulse">
                                                        Uploading...
                                                    </span>
                                                    {/* Progress bar container */}
                                                    <div className="w-full h-1 bg-[#e4e2df] overflow-hidden rounded-full max-w-[80px]">
                                                        <div
                                                            className="h-full bg-[#C9A96E] transition-all duration-150"
                                                            style={{ width: `${image.progress}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-[9px] text-[#B5ADA3] mt-1">
                                                        {image.progress}%
                                                    </span>
                                                </div>
                                            )}

                                            {/* Remove Button */}
                                            <button
                                                type="button"
                                                onClick={(e) => removeImage(image.id, e)}
                                                className="absolute top-2 right-2 p-1.5 bg-[#1b1c1a] text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-[#C9A96E]"
                                                aria-label="Remove image"
                                            >
                                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Submit Button Section */}
                        <button
                            type="submit"
                            disabled={loading || images.length === 0}
                            className="w-full py-4 text-center text-xs uppercase tracking-[0.25em] font-semibold transition-all duration-300 shadow-sm relative overflow-hidden disabled:opacity-40 disabled:cursor-not-allowed group border border-[#1b1c1a]"
                            style={{
                                backgroundColor: "#1b1c1a",
                                color: "#fbf9f6",
                            }}
                            onMouseEnter={(e) => {
                                if (loading || images.length === 0) return;
                                e.currentTarget.style.backgroundColor = "#C9A96E";
                                e.currentTarget.style.color = "#1b1c1a";
                                e.currentTarget.style.borderColor = "#C9A96E";
                            }}
                            onMouseLeave={(e) => {
                                if (loading || images.length === 0) return;
                                e.currentTarget.style.backgroundColor = "#1b1c1a";
                                e.currentTarget.style.color = "#fbf9f6";
                                e.currentTarget.style.borderColor = "#1b1c1a";
                            }}
                        >
                            {loading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-4 w-4 text-[#fbf9f6]" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Publishing Catalog Item...
                                </div>
                            ) : (
                                "Publish Product"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}