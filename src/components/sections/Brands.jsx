import React, { useState, useEffect } from 'react';
import { useLang } from '../../lib/LanguageContext';
import { supabase } from '../../lib/supabase';

const Brands = () => {
    const { t } = useLang();
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

    return (
        <section className="py-16 bg-white border-y border-gray-100">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className="text-3xl lg:text-4xl font-display font-medium text-primary tracking-tight">
                        {t('brands.title')}
                    </h2>
                    <p className="text-gray-500 mt-2 text-sm tracking-wide">
                        {t('brands.subtitle')}
                    </p>
                </div>

                <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
                    {brands.map((brand) => (
                        <div
                            key={brand.id}
                            className="group flex items-center justify-center w-28 h-16 md:w-36 md:h-20 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
                        >
                            {brokenImages.has(brand.id) ? (
                                <span className="text-xl md:text-2xl font-display font-bold text-gray-400 group-hover:text-primary transition-colors">
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
        </section>
    );
};

export default Brands;
