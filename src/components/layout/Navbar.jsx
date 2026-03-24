import React from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../../lib/LanguageContext';

const Navbar = ({ onOpenBooking, onOpenShop }) => {
    const { t, lang, toggleLang } = useLang();

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <nav className="px-4 py-3 md:px-8 md:py-4 flex justify-between items-center bg-white/10 backdrop-blur-md sticky top-0 z-50">
            <div className="text-xl md:text-2xl font-bold font-display text-primary flex items-center gap-2 cursor-pointer shrink-0" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                <div className="w-9 h-9 md:w-10 md:h-10 rounded-full border-2 border-gold-accent bg-gray-200 overflow-hidden">
                    <img src="/images/logo-final.jpg" alt="Logo" className="w-full h-full object-cover" />
                </div>
                <span className="hidden sm:inline">Angel's Beauty</span>
            </div>

            {/* Desktop nav links */}
            <div className="hidden md:flex gap-5 font-display font-semibold items-center text-sm">
                <button onClick={() => scrollToSection('services')} className="hover:text-primary transition-colors">{t('nav.services')}</button>
                <button onClick={onOpenShop} className="hover:text-primary transition-colors">{t('nav.shop')}</button>
                <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-primary transition-colors">{t('nav.about')}</button>
                <button onClick={() => scrollToSection('contact')} className="hover:text-primary transition-colors">{t('nav.contact')}</button>
            </div>

            {/* Right side: language + buttons */}
            <div className="flex items-center gap-1.5 md:gap-3">
                {/* Language switcher */}
                <div className="flex items-center bg-gray-100 rounded-full p-0.5">
                    <button
                        onClick={() => lang !== 'en' && toggleLang()}
                        className={`px-2 py-0.5 md:px-3 md:py-1 rounded-full text-[10px] md:text-xs font-bold tracking-wide transition-all duration-300 ${lang === 'en' ? 'bg-primary text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        EN
                    </button>
                    <button
                        onClick={() => lang !== 'el' && toggleLang()}
                        className={`px-2 py-0.5 md:px-3 md:py-1 rounded-full text-[10px] md:text-xs font-bold tracking-wide transition-all duration-300 ${lang === 'el' ? 'bg-primary text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        GR
                    </button>
                </div>

                {/* Call Now */}
                <a href="tel:+15551234567" className="flex items-center justify-center border-2 border-primary text-primary rounded-full w-8 h-8 md:w-auto md:h-auto md:px-4 md:py-2 font-bold hover:bg-primary hover:text-white transition-all text-sm uppercase tracking-wide shrink-0">
                    <span className="material-symbols-outlined text-[14px] md:text-base leading-none">call</span>
                    <span className="hidden md:inline ml-1.5">{t('nav.callNow')}</span>
                </a>

                {/* Book Now */}
                <button onClick={onOpenBooking} className="bg-primary text-white rounded-full px-2.5 py-1 md:px-5 md:py-2 font-bold hover:bg-primary-hover shadow-lg shadow-primary/25 transition-all text-[10px] md:text-sm uppercase tracking-wide shrink-0">
                    {t('nav.bookNow')}
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
