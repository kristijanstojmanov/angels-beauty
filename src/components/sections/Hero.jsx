import React, { useState, useEffect } from 'react';
import { useLang } from '../../lib/LanguageContext';
import { supabase } from '../../lib/supabase';

const Hero = ({ onOpenBooking, onOpenShop }) => {
    const { t, lang } = useLang();
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        const fetchReviews = async () => {
            const { data, error } = await supabase
                .from('reviews')
                .select('id, author, text_en, text_el, rating, avatar_url')
                .eq('is_featured', true)
                .order('created_at', { ascending: true })
                .limit(5);
            if (error) {
                console.error('Failed to fetch reviews:', error.message);
                return;
            }
            if (data) setReviews(data);
        };
        fetchReviews();
    }, []);

    // Positions use calc-based values that adapt to container size
    const floatingPositions = [
        { top: '12%', right: '8%' },
        { top: '28%', right: '22%' },
        { top: '46%', right: '4%' },
        { top: '62%', right: '18%' },
        { bottom: '12%', right: '8%' },
    ];

    return (
        <section className="relative min-h-[90vh] flex items-center overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <img
                    src="/images/hero-final.jpg"
                    alt="Luxury Hair Salon"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-background-dark/95 via-background-dark/70 to-transparent"></div>
            </div>

            <div className="container mx-auto px-6 relative z-10 h-full flex items-center">
                <div className="max-w-2xl space-y-8 relative z-20">
                    <div className="space-y-4">
                        <h1 className="text-5xl md:text-7xl font-display font-extrabold text-white leading-tight">
                            {t('hero.title1')} <br />
                            <span className="text-gold-accent">{t('hero.title2')}</span>
                        </h1>
                        <p className="text-xl text-gray-200 max-w-lg">
                            {t('hero.subtitle')}
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-4">
                        <button onClick={onOpenBooking} className="bg-primary hover:bg-primary-hover text-white px-8 py-3 rounded-full font-bold text-lg shadow-lg shadow-primary/30 transition-all hover:scale-105">
                            {t('hero.bookAppointment')}
                        </button>
                        <button onClick={onOpenShop} className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white border border-white/30 px-8 py-3 rounded-full font-bold text-lg transition-all hover:scale-105">
                            {t('hero.shopHaircare')}
                        </button>
                    </div>

                    <div className="flex items-center gap-4 pt-4 border-t border-white/20 max-w-xs">
                        <div className="flex -space-x-3">
                            {reviews.slice(0, 4).map((r, i) => (
                                <div key={r.id} className="w-10 h-10 rounded-full border-2 border-background-dark bg-gray-300 overflow-hidden">
                                    <img src={r.avatar_url || `https://i.pravatar.cc/100?img=${i + 10}`} alt={r.author} className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>
                        <div className="text-white">
                            <div className="flex text-gold-accent text-sm">
                                {[...Array(5)].map((_, i) => (
                                    <span key={i} className="material-symbols-outlined text-sm fill-current">star</span>
                                ))}
                            </div>
                            <p className="text-sm font-semibold">{t('hero.reviews')}</p>
                        </div>
                    </div>
                </div>

                {/* Scattered floating reviews - desktop only */}
                <div className="absolute inset-0 pointer-events-none z-10 hidden lg:block">
                    {reviews.map((review, i) => {
                        const pos = floatingPositions[i] || floatingPositions[0];
                        return (
                            <div
                                key={review.id}
                                className="absolute pointer-events-auto bg-white/10 backdrop-blur-lg border border-white/20 p-3 rounded-2xl shadow-lg hover:scale-110 hover:bg-white/25 transition-all duration-300 cursor-default"
                                style={{
                                    ...pos,
                                    maxWidth: 'min(240px, 20vw)',
                                    animation: `fadeSlideIn 0.6s ease-out ${i * 0.15}s both`,
                                }}
                            >
                                <div className="flex items-start gap-2.5">
                                    <img
                                        src={review.avatar_url || `https://i.pravatar.cc/100?img=${i + 30}`}
                                        alt={review.author}
                                        className="w-9 h-9 rounded-full border-2 border-white/40 object-cover shrink-0"
                                    />
                                    <div className="min-w-0">
                                        <div className="flex text-gold-accent text-[10px] mb-0.5">
                                            {[...Array(review.rating)].map((_, star) => (
                                                <span key={star} className="material-symbols-outlined text-[10px] fill-current">star</span>
                                            ))}
                                        </div>
                                        <p className="text-white text-[11px] leading-snug line-clamp-2 italic">
                                            "{lang === 'el' ? (review.text_el || review.text_en) : review.text_en}"
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Trusted badge - tablet only (md but not lg) */}
            <div className="hidden md:block lg:hidden absolute bottom-8 right-6 bg-white/10 backdrop-blur-lg border border-white/20 p-4 rounded-2xl shadow-2xl z-20 max-w-[260px]">
                <div className="flex items-center gap-3">
                    <div className="flex -space-x-3">
                        {reviews.slice(0, 3).map((r, i) => (
                            <img key={r.id} src={r.avatar_url || `https://i.pravatar.cc/100?img=${i + 25}`} alt={r.author} className="w-10 h-10 rounded-full border-2 border-white object-cover" />
                        ))}
                    </div>
                    <div>
                        <div className="flex text-gold-accent">
                            {[...Array(5)].map((_, i) => (
                                <span key={i} className="material-symbols-outlined fill-current text-xs">star</span>
                            ))}
                        </div>
                        <p className="text-white font-bold text-xs leading-tight">
                            {t('hero.trustedBy')}
                        </p>
                    </div>
                </div>
            </div>

            {/* Large trusted badge - desktop, bottom right */}
            <div className="hidden lg:block absolute bottom-8 right-8 xl:right-16 bg-white/10 backdrop-blur-lg border border-white/20 p-5 rounded-2xl shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-300 z-20 max-w-xs cursor-default hover:bg-white/20">
                <div className="flex items-center gap-4">
                    <div className="flex -space-x-4">
                        {reviews.slice(0, 3).map((r, i) => (
                            <img key={r.id} src={r.avatar_url || `https://i.pravatar.cc/100?img=${i + 25}`} alt={r.author} className="w-12 h-12 rounded-full border-2 border-white object-cover" />
                        ))}
                    </div>
                    <div>
                        <div className="flex text-gold-accent">
                            {[...Array(5)].map((_, i) => (
                                <span key={i} className="material-symbols-outlined fill-current text-sm">star</span>
                            ))}
                        </div>
                        <p className="text-white font-bold text-sm leading-tight">
                            {t('hero.trustedBy')}
                        </p>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes fadeSlideIn {
                    from { opacity: 0; transform: translateY(12px) scale(0.95); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
            `}</style>
        </section>
    );
};

export default Hero;
