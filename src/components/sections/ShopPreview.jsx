import React, { useRef, useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

const ShopPreview = ({ onOpenShop, onAddToCart }) => {
    const scrollRef = useRef(null);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            const { data } = await supabase.from('products').select('*').limit(8);
            if (data) setProducts(data);
        };
        fetchProducts();
    }, []);

    // Force scroll to start (left) when products load
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollLeft = 0;
        }
    }, [products]);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const { current } = scrollRef;
            const scrollAmount = direction === 'left' ? -350 : 350;
            current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <section id="shop" className="py-24 bg-[#ebebeb] text-text-main-light relative overflow-hidden group/section">
            <div className="container mx-auto px-6 h-full flex flex-col justify-center relative">
                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl lg:text-5xl font-display font-medium text-primary tracking-tight">
                        Salon Essentials
                    </h2>
                    <p className="text-gray-500 mt-2 tracking-wide font-sans">
                        Professional care for your hair at home
                    </p>
                </div>

                {/* Slider Container with Arrows */}
                <div className="relative">
                    {/* Left Arrow */}
                    <button
                        onClick={() => scroll('left')}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-12 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-primary hover:bg-black hover:text-white transition-all duration-300 opacity-0 group-hover/section:opacity-100"
                    >
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>

                    {/* Right Arrow */}
                    <button
                        onClick={() => scroll('right')}
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-12 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-primary hover:bg-black hover:text-white transition-all duration-300 opacity-0 group-hover/section:opacity-100"
                    >
                        <span className="material-symbols-outlined">arrow_forward</span>
                    </button>

                    {/* Horizontal Snap Slider */}
                    <div
                        ref={scrollRef}
                        className="flex overflow-x-auto gap-8 pb-10 snap-x snap-mandatory scrollbar-hide px-4 -mx-4 items-stretch"
                    >
                        {products.map((product) => (
                            <div key={product.id} className="min-w-[280px] md:min-w-[320px] snap-center group cursor-pointer" onClick={() => onOpenShop(product)}>
                                {/* Glass Card Container */}
                                <div className="relative aspect-[3/4] overflow-hidden rounded-[2rem] shadow-md hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-2">

                                    {/* Full Height Image */}
                                    <img
                                        src={product.image || product.image_url}
                                        alt={product.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />

                                    {/* Gradient Overlay for Text Readability */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300"></div>

                                    {/* Top Right Category Tag */}
                                    <div className="absolute top-4 right-4">
                                        <span className="px-3 py-1 bg-white/20 backdrop-blur-md border border-white/30 text-white text-[10px] uppercase tracking-widest font-bold rounded-full">
                                            {product.category}
                                        </span>
                                    </div>

                                    {/* Glass Info Bar (Bottom) */}
                                    <div className="absolute bottom-4 left-4 right-4 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl text-white transition-all duration-300 group-hover:bg-white/20 group-hover:border-white/30">
                                        <div className="flex justify-between items-end">
                                            <div>
                                                <h4 className="font-display text-xl font-medium tracking-wide mb-1 drop-shadow-sm">
                                                    {product.name}
                                                </h4>
                                                <p className="text-white/80 font-sans text-sm font-medium">
                                                    {product.price}
                                                </p>
                                            </div>

                                            {/* Quick Add Button (Floating on Glass) */}
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onAddToCart(product);
                                                }}
                                                className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center hover:scale-110 hover:bg-gold-accent hover:text-white transition-all shadow-lg active:scale-95"
                                            >
                                                <span className="material-symbols-outlined text-lg">add</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <div className="min-w-[200px] flex items-center justify-center snap-center">
                            <button onClick={() => onOpenShop(null)} className="flex flex-col items-center gap-4 text-gray-400 hover:text-primary transition-colors group">
                                <span className="w-16 h-16 rounded-full border-2 border-dashed border-gray-300 group-hover:border-primary flex items-center justify-center bg-white group-hover:bg-gray-50 transition-colors">
                                    <span className="material-symbols-outlined text-3xl">arrow_forward</span>
                                </span>
                                <span className="font-bold uppercase tracking-widest text-sm">View Full Catalogue</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="text-center mt-4">
                    <button
                        onClick={() => onOpenShop(null)}
                        className="inline-flex items-center gap-2 text-primary font-bold uppercase tracking-wider border-b-2 border-primary pb-1 hover:text-black hover:border-black transition-all"
                    >
                        Open Full Catalogue <span className="material-symbols-outlined text-sm">open_in_new</span>
                    </button>
                </div>
            </div>
        </section>
    );
};

export default ShopPreview;
