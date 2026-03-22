import React from 'react';
import { useLang } from '../../lib/LanguageContext';

const brandLogos = [
    { name: "L'Oréal", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/L%27Or%C3%A9al_logo.svg/200px-L%27Or%C3%A9al_logo.svg.png" },
    { name: "Wella", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Wella_logo.svg/200px-Wella_logo.svg.png" },
    { name: "Redken", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Redken_logo.svg/200px-Redken_logo.svg.png" },
    { name: "Kérastase", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/K%C3%A9rastase_logo.svg/200px-K%C3%A9rastase_logo.svg.png" },
    { name: "Olaplex", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Olaplex_logo.svg/200px-Olaplex_logo.svg.png" },
    { name: "GHD", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Ghd_logo.svg/200px-Ghd_logo.svg.png" },
];

const Brands = () => {
    const { t } = useLang();

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
                    {brandLogos.map((brand) => (
                        <div
                            key={brand.name}
                            className="group flex items-center justify-center w-28 h-16 md:w-36 md:h-20 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
                        >
                            <img
                                src={brand.logo}
                                alt={brand.name}
                                className="max-w-full max-h-full object-contain"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.parentElement.innerHTML = `<span class="text-xl md:text-2xl font-display font-bold text-gray-400 group-hover:text-primary transition-colors">${brand.name}</span>`;
                                }}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Brands;
