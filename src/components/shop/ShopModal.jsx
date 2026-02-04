import React, { useState } from 'react';

import { supabase } from '../../lib/supabase';
import ImageGalleryModal from './ImageGalleryModal';

// Products will be fetched from Supabase

const ShopModal = ({ isOpen, onClose, onAddToCart, selectedProduct, onSelectProduct }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("All");
    const [search, setSearch] = useState("");
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);

    React.useEffect(() => {
        if (isOpen && products.length === 0) { // Fetch only when opened/needed
            fetchProducts();
        }
    }, [isOpen]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: true });
            if (error) throw error;
            if (data) setProducts(data);
        } catch (error) {
            console.error("Error fetching products:", error.message);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    const filteredProducts = products.filter(p =>
        (filter === "All" || p.category === filter) &&
        p.name.toLowerCase().includes(search.toLowerCase())
    );

    // Reset selection when closing
    const handleClose = () => {
        onSelectProduct(null);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={handleClose}></div>

            {/* Modal Content - Expanded to max-w-7xl and taller */}
            <div className="bg-[#f9f9f9] dark:bg-background-dark w-full max-w-7xl h-[95vh] rounded-[2.5rem] overflow-hidden shadow-2xl relative flex flex-col z-10 animate-fade-in-up border border-white/20 transition-all duration-500">

                {/* Header */}
                <div className="p-5 md:p-8 border-b border-gray-200 dark:border-white/10 flex justify-between items-center bg-white dark:bg-background-dark relative z-20 shrink-0">
                    <div>
                        <h2 className="text-2xl md:text-4xl font-display font-medium text-primary tracking-tight">The Collection</h2>
                        <p className="text-gray-500 text-sm mt-1 hidden md:block">Professional products for salon results.</p>
                    </div>
                    <button onClick={handleClose} className="w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-all">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {selectedProduct ? (
                    // PRODUCT DETAIL VIEW
                    <div className="flex-grow overflow-y-auto bg-white animate-fade-in flex flex-col md:flex-row">
                        {/* Left: Image */}
                        <div className="w-full md:w-1/2 h-[50vh] md:h-full bg-gray-100 relative group">
                            <img
                                src={selectedProduct.image_url || selectedProduct.image}
                                alt={selectedProduct.name}
                                className="w-full h-full object-cover cursor-zoom-in"
                                onClick={() => setIsGalleryOpen(true)}
                            />
                            <div className="absolute top-6 left-6 pointer-events-none">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation(); // Prevent gallery open
                                        onSelectProduct(null);
                                    }}
                                    className="bg-white/80 backdrop-blur px-4 py-2 rounded-full text-sm font-bold shadow-sm hover:bg-white transition-all flex items-center gap-2 pointer-events-auto"
                                >
                                    <span className="material-symbols-outlined text-sm">arrow_back</span> Back to Collection
                                </button>
                            </div>
                            {/* Zoom Hint */}
                            <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 text-white text-xs px-3 py-1 rounded-full backdrop-blur pointer-events-none">
                                Click to Expand
                            </div>
                        </div>

                        {/* Right: Details */}
                        <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center bg-white">
                            <div className="mb-2">
                                <span className="text-xs font-bold tracking-widest uppercase text-gray-400 border border-gray-200 px-3 py-1 rounded-full">
                                    {selectedProduct.category}
                                </span>
                            </div>
                            <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4 tracking-tight">
                                {selectedProduct.name}
                            </h2>
                            <p className="text-2xl text-gold-accent font-sans font-medium mb-8">
                                {selectedProduct.price.replace('$', '€')}
                            </p>

                            <p className="text-gray-600 leading-relaxed mb-6 md:mb-10 text-sm md:text-lg">
                                Experience luxury hair care with this premium formula. Enriched with natural botanical extracts to nourish and revitalize your hair from root to tip. Suitable for all hair types and perfect for daily use to maintain salon-fresh results.
                            </p>

                            <div className="flex flex-col gap-4">
                                <button
                                    onClick={() => {
                                        onAddToCart(selectedProduct);
                                        // Optional: Close modal or stay? Let's stay to allow buying more.
                                        // Maybe show a toast? For now just visual feedback handled by Cart button badge.
                                    }}
                                    className="w-full bg-black text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-gray-800 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-3"
                                >
                                    <span className="material-symbols-outlined">shopping_bag</span>
                                    Add to Bag
                                </button>
                                <button
                                    onClick={() => onSelectProduct(null)}
                                    className="w-full bg-gray-100 text-gray-900 py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-gray-200 transition-all font-sans"
                                >
                                    Continue Shopping
                                </button>
                            </div>

                            <div className="mt-12 pt-8 border-t border-gray-100 flex gap-8 text-gray-400">
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined">local_shipping</span>
                                    <span className="text-xs uppercase font-bold tracking-wider">Free Shipping</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined">verified</span>
                                    <span className="text-xs uppercase font-bold tracking-wider">Authentic</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    // PRODUCT GRID VIEW
                    <>
                        {/* Controls */}
                        <div className="px-8 py-4 bg-white/50 backdrop-blur-sm sticky top-0 z-10 border-b border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-center shrink-0">
                            <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
                                {["All", "Wash", "Treatments", "Styling", "Tools"].map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setFilter(cat)}
                                        className={`px-5 py-2 md:px-6 rounded-full text-sm font-bold transition-all duration-300 whitespace-nowrap ${filter === cat
                                            ? "bg-primary text-white shadow-md transform scale-105"
                                            : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                                            }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                            <div className="relative w-full md:w-72">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">search</span>
                                <input
                                    type="text"
                                    placeholder="Find your product..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-200 bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all shadow-sm"
                                />
                            </div>
                        </div>

                        {/* Product Grid */}
                        <div className="flex-grow overflow-y-auto p-4 md:p-8">
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                                {filteredProducts.map(product => (
                                    <div
                                        key={product.id}
                                        className="relative group cursor-pointer"
                                        onClick={() => onSelectProduct(product)}
                                    >
                                        <div className="relative aspect-[3/4] overflow-hidden rounded-[1.5rem] shadow-sm hover:shadow-xl transition-all duration-500 group-hover:-translate-y-1">

                                            {/* Image */}
                                            <img
                                                src={product.image_url || product.image}
                                                alt={product.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                            />

                                            {/* Gradient & Overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-50 transition-opacity"></div>

                                            {/* Glass Bar */}
                                            <div className="absolute bottom-3 left-3 right-3 bg-white/20 backdrop-blur-md border border-white/30 p-3 rounded-xl flex justify-between items-center text-white transition-all group-hover:bg-white/30">
                                                <div className="truncate pr-2">
                                                    <h3 className="font-display font-medium text-base truncate drop-shadow-md">{product.name}</h3>
                                                    <p className="text-xs text-white/90 font-bold">{product.price}</p>
                                                </div>

                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onAddToCart(product);
                                                    }}
                                                    className="w-8 h-8 bg-white text-black rounded-full flex items-center justify-center hover:bg-black hover:text-white transition-all shadow-lg shrink-0"
                                                >
                                                    <span className="material-symbols-outlined text-base">add</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-gray-200 bg-white flex justify-between items-center text-sm text-gray-500 shrink-0">
                            <p>Free shipping on orders over €100</p>
                            <button className="font-bold text-primary hover:underline">View Categories</button>
                        </div>
                    </>
                )}

            </div>

            {/* Gallery Modal */}
            <ImageGalleryModal
                isOpen={isGalleryOpen}
                onClose={() => setIsGalleryOpen(false)}
                images={[selectedProduct?.image_url || selectedProduct?.image].filter(Boolean)}
            />
        </div>
    );
};

export default ShopModal;
