import React, { useState } from 'react';
import { useLang } from '../../lib/LanguageContext';

const AboutStylist = ({ onOpenBooking }) => {
    const { t } = useLang();
    const [isOverlayOpen, setIsOverlayOpen] = useState(false);

    return (
        <>
            <section id="about" className="py-24 bg-white relative overflow-hidden">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl lg:text-5xl font-display font-medium text-primary tracking-tight">
                            {t('about.title')}
                        </h2>
                        <p className="text-gray-500 mt-2 tracking-wide">
                            {t('about.subtitle')}
                        </p>
                    </div>

                    <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20 max-w-5xl mx-auto">
                        {/* Photo */}
                        <div className="lg:w-2/5 relative">
                            <div className="relative w-72 h-96 md:w-80 md:h-[28rem] mx-auto">
                                <div className="absolute inset-0 bg-primary/10 rounded-[2.5rem] transform rotate-3"></div>
                                <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden shadow-2xl">
                                    <img
                                        src="/images/stylist.jpg"
                                        alt={t('about.name')}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.src = 'https://images.unsplash.com/photo-1595959183082-7b570b7e1e2a?w=400&h=500&fit=crop';
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                                    <div className="absolute bottom-6 left-6 right-6 text-white">
                                        <h3 className="text-2xl font-display font-bold">{t('about.name')}</h3>
                                        <p className="text-white/80 text-sm">{t('about.role')}</p>
                                    </div>
                                </div>
                                {/* Experience badge */}
                                <div className="absolute -bottom-4 -right-4 bg-primary text-white px-5 py-3 rounded-2xl shadow-lg shadow-primary/30 font-bold text-sm">
                                    {t('about.experience')}
                                </div>
                            </div>
                        </div>

                        {/* Info */}
                        <div className="lg:w-3/5 space-y-6">
                            <p className="text-gray-600 leading-relaxed text-lg">
                                {t('about.bio')}
                            </p>

                            <div className="bg-gray-50 rounded-2xl p-6 space-y-3">
                                <h4 className="font-bold text-sm uppercase tracking-wider text-gray-400">{t('about.specialties')}</h4>
                                <div className="flex flex-wrap gap-2">
                                    {t('about.specialtyList').split(', ').map((specialty) => (
                                        <span key={specialty} className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-semibold text-gray-700">
                                            {specialty}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <p className="flex items-center gap-2 text-sm text-gray-500">
                                <span className="material-symbols-outlined text-gold-accent">workspace_premium</span>
                                {t('about.certifications')}
                            </p>

                            <div className="flex flex-wrap gap-4 pt-2">
                                <button
                                    onClick={onOpenBooking}
                                    className="bg-primary hover:bg-primary-hover text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-primary/30 transition-all hover:scale-105 flex items-center gap-2"
                                >
                                    <span className="material-symbols-outlined">calendar_month</span>
                                    {t('about.bookWith')}
                                </button>
                                <button
                                    onClick={() => setIsOverlayOpen(true)}
                                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-8 py-3 rounded-full font-bold transition-all flex items-center gap-2"
                                >
                                    {t('about.learnMore')}
                                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Full Overlay */}
            {isOverlayOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsOverlayOpen(false)}></div>

                    <div className="relative bg-white w-full max-w-4xl max-h-[90vh] rounded-[2.5rem] overflow-hidden shadow-2xl z-10 flex flex-col md:flex-row animate-fade-in-up">
                        {/* Left: Large Photo */}
                        <div className="md:w-2/5 h-64 md:h-auto relative">
                            <img
                                src="/images/stylist.jpg"
                                alt={t('about.name')}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.src = 'https://images.unsplash.com/photo-1595959183082-7b570b7e1e2a?w=600&h=800&fit=crop';
                                }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-transparent"></div>
                            <div className="absolute bottom-6 left-6 md:hidden text-white">
                                <h3 className="text-3xl font-display font-bold">{t('about.name')}</h3>
                                <p className="text-white/80">{t('about.role')}</p>
                            </div>
                        </div>

                        {/* Right: Full Bio */}
                        <div className="md:w-3/5 p-8 md:p-12 overflow-y-auto">
                            <button
                                onClick={() => setIsOverlayOpen(false)}
                                className="absolute top-4 right-4 md:top-6 md:right-6 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all z-20"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>

                            <div className="hidden md:block mb-6">
                                <h3 className="text-4xl font-display font-bold text-gray-900">{t('about.name')}</h3>
                                <p className="text-primary font-semibold mt-1">{t('about.role')}</p>
                            </div>

                            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-bold mb-6">
                                <span className="material-symbols-outlined text-sm">star</span>
                                {t('about.experience')}
                            </div>

                            <p className="text-gray-600 leading-relaxed text-lg mb-8">
                                {t('about.bio')}
                            </p>

                            <div className="bg-gray-50 rounded-2xl p-6 mb-6">
                                <h4 className="font-bold text-sm uppercase tracking-wider text-gray-400 mb-3">{t('about.specialties')}</h4>
                                <div className="flex flex-wrap gap-2">
                                    {t('about.specialtyList').split(', ').map((specialty) => (
                                        <span key={specialty} className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-semibold text-gray-700">
                                            {specialty}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
                                <span className="material-symbols-outlined text-gold-accent">workspace_premium</span>
                                {t('about.certifications')}
                            </div>

                            <button
                                onClick={() => { setIsOverlayOpen(false); onOpenBooking(); }}
                                className="w-full bg-primary hover:bg-primary-hover text-white py-4 rounded-xl font-bold shadow-lg shadow-primary/30 transition-all flex items-center justify-center gap-2"
                            >
                                <span className="material-symbols-outlined">calendar_month</span>
                                {t('about.bookWith')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AboutStylist;
