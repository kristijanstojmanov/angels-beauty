import React, { useRef, useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useLang } from '../../lib/LanguageContext';

const ShopPreview = ({ onOpenShop }) => {
    const { t } = useLang();
    const scrollRef = useRef(null);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            const { data } = await supabase.from('products').select('*').limit(8);
            if (data) setProducts(data);
        };
        fetchProducts();
    }, []);

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
                <div className="text-center mb-16">
                    <h2 className="text-4xl lg:text-5xl font-display font-medium text-primary tracking-tight">
                        {t('shopPreview.title')}
                    </h2>
                    <p className="text-gray-500 mt-2 tracking-wide font-sans">
                        {t('shopPreview.subtitle')}
                    </p>
                </div>

                <div className="relative">
                    <button
                        onClick={() => scroll('left')}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-12 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-primary hover:bg-black hover:text-white transition-all duration-300 opacity-0 group-hover/section:opacity-100"
                    >
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>

                    <button
                        onClick={() => scroll('right')}
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-12 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-primary hover:bg-black hover:text-white transition-all duration-300 opacity-0 group-hover/section:opacity-100"
                    >
                        <span className="material-symbols-outlined">arrow_forward</span>
                    </button>

                    <div
                        ref={scrollRef}
                        className="flex overflow-x-auto gap-8 pb-10 snap-x snap-mandatory scrollbar-hide px-4 -mx-4 items-stretch"
                    >
                        {products.map((product) => (
                            <div key={product.id} className="min-w-[280px] md:min-w-[320px] snap-center group cursor-pointer" onClick={() => onOpenShop(product)}>
                                <div className="relative aspect-[3/4] overflow-hidden rounded-[2rem] shadow-md hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-2">
                                    <img src={product.image || product.image_url} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300"></div>
                                    <div className="absolute top-4 right-4">
                                        <span className="px-3 py-1 bg-white/20 backdrop-blur-md border border-white/30 text-white text-[10px] uppercase tracking-widest font-bold rounded-full">
                                            {product.category}
                                        </span>
                                    </div>
                                    <div className="absolute bottom-4 left-4 right-4 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl text-white transition-all duration-300 group-hover:bg-white/20 group-hover:border-white/30">
                                        <div>
                                            <h4 className="font-display text-xl font-medium tracking-wide mb-1 drop-shadow-sm">{product.name}</h4>
                                            <p className="text-white/80 font-sans text-sm font-medium">{product.price}</p>
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
                                <span className="font-bold uppercase tracking-widest text-sm">{t('shopPreview.viewCatalogue')}</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Available at salon note */}
                <div className="text-center mt-2 space-y-4">
                    <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-sm border border-gray-100">
                        <span className="material-symbols-outlined text-primary text-lg">storefront</span>
                        <span className="text-sm font-semibold text-gray-600">{t('shopPreview.availableAtSalon')}</span>
                    </div>
                    <div className="block">
                        <button
                            onClick={() => onOpenShop(null)}
                            className="inline-flex items-center gap-2 text-primary font-bold uppercase tracking-wider border-b-2 border-primary pb-1 hover:text-black hover:border-black transition-all"
                        >
                            {t('shopPreview.openCatalogue')} <span className="material-symbols-outlined text-sm">open_in_new</span>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ShopPreview;
