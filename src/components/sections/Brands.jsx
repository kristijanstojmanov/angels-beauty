import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

const Brands = () => {
    const [brands, setBrands] = useState([]);
    const [brokenImages, setBrokenImages] = useState(new Set());

    useEffect(() => {
        const fetchBrands = async () => {
            const { data, error } = await supabase
                .from('brands')
                .select('id, name, logo_url')
                .order('display_order', { ascending: true });
            if (error) {
                console.error('Failed to fetch brands:', error.message);
                return;
            }
            if (data) setBrands(data);
        };
        fetchBrands();
    }, []);

    if (brands.length === 0) return null;

    // Double the brands for seamless loop
    const scrollBrands = [...brands, ...brands];

    return (
        <section className="py-6 bg-gray-50 border-b border-gray-100 overflow-hidden">
            <div className="relative">
                <div className="flex items-center gap-12 md:gap-20 animate-scroll-right-to-left">
                    {scrollBrands.map((brand, i) => (
                        <div
                            key={`${brand.id}-${i}`}
                            className="flex items-center justify-center shrink-0 w-28 h-12 md:w-36 md:h-14 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
                        >
                            {brokenImages.has(brand.id) ? (
                                <span className="text-lg md:text-xl font-display font-bold text-gray-400 whitespace-nowrap">
                                    {brand.name}
                                </span>
                            ) : (
                                <img
                                    src={brand.logo_url}
                                    alt={brand.name}
                                    className="max-w-full max-h-full object-contain"
                                    onError={() => setBrokenImages(prev => new Set(prev).add(brand.id))}
                                />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
                @keyframes scrollRightToLeft {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-scroll-right-to-left {
                    animation: scrollRightToLeft 20s linear infinite;
                }
                .animate-scroll-right-to-left:hover {
                    animation-play-state: paused;
                }
            `}</style>
        </section>
    );
};

export default Brands;
