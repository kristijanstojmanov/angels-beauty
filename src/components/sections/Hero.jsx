import React from 'react';
import { useLang } from '../../lib/LanguageContext';

const Hero = ({ onOpenBooking, onOpenShop }) => {
    const { t } = useLang();

    const reviews = [
        { text: t('hero.review1'), user: t('hero.review1Author'), pos: "top-[15%] right-[10%]", delay: "0s" },
        { text: t('hero.review2'), user: t('hero.review2Author'), pos: "top-[30%] right-[25%]", delay: "1s" },
        { text: t('hero.review3'), user: t('hero.review3Author'), pos: "bottom-[35%] right-[5%]", delay: "2s" },
        { text: t('hero.review4'), user: t('hero.review4Author'), pos: "top-[50%] right-[18%]", delay: "0.5s" },
        { text: t('hero.review5'), user: t('hero.review5Author'), pos: "bottom-[20%] right-[30%]", delay: "1.5s" }
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
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="w-10 h-10 rounded-full border-2 border-background-dark bg-gray-300 overflow-hidden">
                                    <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" className="w-full h-full object-cover" />
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

                {/* Scattered Reviews */}
                <div className="absolute inset-0 pointer-events-none z-10 hidden lg:block">
                    {reviews.map((review, i) => (
                        <div key={i} className={`absolute ${review.pos} pointer-events-auto bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-xl shadow-lg flex items-center gap-3 hover:scale-110 transition-transform duration-300 cursor-pointer max-w-[220px] hover:bg-white/20 group`}>
                            <img src={`https://i.pravatar.cc/100?img=${i + 30}`} alt={review.user} className="w-8 h-8 rounded-full border border-white" />
                            <div>
                                <div className="flex text-gold-accent text-[10px] mb-0.5">
                                    {[...Array(5)].map((_, star) => (
                                        <span key={star} className="material-symbols-outlined text--[10px] fill-current">star</span>
                                    ))}
                                </div>
                                <p className="text-white text-xs italic leading-tight group-hover:text-gold-accent transition-colors">"{review.text}"</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Large Review Badge */}
            <div className="hidden md:block absolute font-sans bottom-10 right-6 md:right-20 md:bottom-20 bg-white/10 backdrop-blur-lg border border-white/20 p-5 rounded-2xl shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-300 z-20 max-w-xs cursor-default hover:bg-white/20">
                <div className="flex items-center gap-4">
                    <div className="flex -space-x-4">
                        {[1, 2, 3].map((i) => (
                            <img key={i} src={`https://i.pravatar.cc/100?img=${i + 25}`} alt="Client" className="w-12 h-12 rounded-full border-2 border-white object-cover" />
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
        </section>
    );
};

export default Hero;
