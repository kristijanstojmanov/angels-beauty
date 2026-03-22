import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useLang } from '../../lib/LanguageContext';
import ImageGalleryModal from './ImageGalleryModal';

const ShopModal = ({ isOpen, onClose, selectedProduct, onSelectProduct, onOpenBooking }) => {
    const { t } = useLang();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("All");
    const [search, setSearch] = useState("");
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);

    React.useEffect(() => {
        if (isOpen && products.length === 0) {
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

    const categories = [
        { key: "All", label: t('shop.all') },
        { key: "Wash", label: t('shop.wash') },
        { key: "Treatments", label: t('shop.treatments') },
        { key: "Styling", label: t('shop.styling') },
        { key: "Tools", label: t('shop.tools') },
    ];

    const filteredProducts = products.filter(p =>
        (filter === "All" || p.category === filter) &&
        p.name.toLowerCase().includes(search.toLowerCase())
    );

    const handleClose = () => {
        onSelectProduct(null);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={handleClose}></div>

            <div className="bg-[#f9f9f9] dark:bg-background-dark w-full max-w-7xl h-[95vh] rounded-[2.5rem] overflow-hidden shadow-2xl relative flex flex-col z-10 animate-fade-in-up border border-white/20 transition-all duration-500">

                <div className="p-5 md:p-8 border-b border-gray-200 dark:border-white/10 flex justify-between items-center bg-white dark:bg-background-dark relative z-20 shrink-0">
                    <div>
                        <h2 className="text-2xl md:text-4xl font-display font-medium text-primary tracking-tight">{t('shop.title')}</h2>
                        <p className="text-gray-500 text-sm mt-1 hidden md:block">{t('shop.subtitle')}</p>
                    </div>
                    <button onClick={handleClose} className="w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-all">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {selectedProduct ? (
                    <div className="flex-grow overflow-y-auto bg-white animate-fade-in flex flex-col md:flex-row">
                        <div className="w-full md:w-1/2 h-[50vh] md:h-full bg-gray-100 relative group">
                            <img src={selectedProduct.image_url || selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover cursor-zoom-in" onClick={() => setIsGalleryOpen(true)} />
                            <div className="absolute top-6 left-6 pointer-events-none">
                                <button onClick={(e) => { e.stopPropagation(); onSelectProduct(null); }} className="bg-white/80 backdrop-blur px-4 py-2 rounded-full text-sm font-bold shadow-sm hover:bg-white transition-all flex items-center gap-2 pointer-events-auto">
                                    <span className="material-symbols-outlined text-sm">arrow_back</span> {t('shop.backToCollection')}
                                </button>
                            </div>
                            <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 text-white text-xs px-3 py-1 rounded-full backdrop-blur pointer-events-none">
                                {t('shop.clickToExpand')}
                            </div>
                        </div>

                        <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center bg-white">
                            <div className="mb-2">
                                <span className="text-xs font-bold tracking-widest uppercase text-gray-400 border border-gray-200 px-3 py-1 rounded-full">{selectedProduct.category}</span>
                            </div>
                            <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4 tracking-tight">{selectedProduct.name}</h2>
                            <p className="text-2xl text-gold-accent font-sans font-medium mb-8">{selectedProduct.price.replace('$', '€')}</p>
                            <p className="text-gray-600 leading-relaxed mb-6 md:mb-10 text-sm md:text-lg">{t('shop.genericDescription')}</p>

                            {/* Available at salon banner */}
                            <div className="flex items-center gap-3 bg-primary/5 border border-primary/20 rounded-xl p-4 mb-6">
                                <span className="material-symbols-outlined text-primary text-2xl">storefront</span>
                                <p className="text-sm font-semibold text-gray-700">{t('shop.availableAtSalon')}</p>
                            </div>

                            <div className="flex flex-col gap-4">
                                <button
                                    onClick={() => { handleClose(); onOpenBooking(); }}
                                    className="w-full bg-primary text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-primary-hover transition-all shadow-lg shadow-primary/30 active:scale-95 flex items-center justify-center gap-3"
                                >
                                    <span className="material-symbols-outlined">calendar_month</span>
                                    {t('shop.bookForProduct')}
                                </button>
                                <button
                                    onClick={() => onSelectProduct(null)}
                                    className="w-full bg-gray-100 text-gray-900 py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-gray-200 transition-all font-sans"
                                >
                                    {t('shop.backToCollection')}
                                </button>
                            </div>

                            <div className="mt-12 pt-8 border-t border-gray-100 flex gap-8 text-gray-400">
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined">storefront</span>
                                    <span className="text-xs uppercase font-bold tracking-wider">{t('shop.salonOnly')}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined">verified</span>
                                    <span className="text-xs uppercase font-bold tracking-wider">{t('shop.authentic')}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="px-8 py-4 bg-white/50 backdrop-blur-sm sticky top-0 z-10 border-b border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-center shrink-0">
                            <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
                                {categories.map(cat => (
                                    <button
                                        key={cat.key}
                                        onClick={() => setFilter(cat.key)}
                                        className={`px-5 py-2 md:px-6 rounded-full text-sm font-bold transition-all duration-300 whitespace-nowrap ${filter === cat.key
                                            ? "bg-primary text-white shadow-md transform scale-105"
                                            : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                                            }`}
                                    >
                                        {cat.label}
                                    </button>
                                ))}
                            </div>
                            <div className="relative w-full md:w-72">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">search</span>
                                <input type="text" placeholder={t('shop.searchPlaceholder')} value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-200 bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all shadow-sm" />
                            </div>
                        </div>

                        <div className="flex-grow overflow-y-auto p-4 md:p-8">
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                                {filteredProducts.map(product => (
                                    <div key={product.id} className="relative group cursor-pointer" onClick={() => onSelectProduct(product)}>
                                        <div className="relative aspect-[3/4] overflow-hidden rounded-[1.5rem] shadow-sm hover:shadow-xl transition-all duration-500 group-hover:-translate-y-1">
                                            <img src={product.image_url || product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-50 transition-opacity"></div>
                                            <div className="absolute bottom-3 left-3 right-3 bg-white/20 backdrop-blur-md border border-white/30 p-3 rounded-xl text-white transition-all group-hover:bg-white/30">
                                                <div>
                                                    <h3 className="font-display font-medium text-base truncate drop-shadow-md">{product.name}</h3>
                                                    <p className="text-xs text-white/90 font-bold">{product.price}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-200 bg-white flex justify-between items-center text-sm text-gray-500 shrink-0">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary text-base">storefront</span>
                                <p>{t('shop.availableAtSalon')}</p>
                            </div>
                            <button className="font-bold text-primary hover:underline">{t('shop.viewCategories')}</button>
                        </div>
                    </>
                )}
            </div>

            <ImageGalleryModal
                isOpen={isGalleryOpen}
                onClose={() => setIsGalleryOpen(false)}
                images={[selectedProduct?.image_url || selectedProduct?.image].filter(Boolean)}
            />
        </div>
    );
};

export default ShopModal;
