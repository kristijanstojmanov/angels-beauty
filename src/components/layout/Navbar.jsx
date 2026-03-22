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
        <nav className="p-6 md:p-10 flex justify-between items-center bg-white/10 backdrop-blur-md sticky top-0 z-50">
            <div className="text-2xl font-bold font-display text-primary flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                <div className="w-10 h-10 rounded-full border-2 border-gold-accent bg-gray-200 overflow-hidden">
                    <img src="/images/logo-final.jpg" alt="Logo" className="w-full h-full object-cover" />
                </div>
                Angel's Beauty
            </div>
            <div className="hidden md:flex gap-8 font-display font-semibold items-center">
                <button onClick={() => scrollToSection('services')} className="hover:text-primary transition-colors">{t('nav.services')}</button>
                <button onClick={onOpenShop} className="hover:text-primary transition-colors">{t('nav.shop')}</button>
                <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-primary transition-colors">{t('nav.about')}</button>
                <button onClick={() => scrollToSection('contact')} className="hover:text-primary transition-colors">{t('nav.contact')}</button>

                {/* Language Switcher */}
                <div className="flex items-center bg-gray-100 rounded-full p-0.5">
                    <button
                        onClick={() => lang !== 'en' && toggleLang()}
                        className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide transition-all duration-300 ${lang === 'en' ? 'bg-primary text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        EN
                    </button>
                    <button
                        onClick={() => lang !== 'el' && toggleLang()}
                        className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide transition-all duration-300 ${lang === 'el' ? 'bg-primary text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        GR
                    </button>
                </div>
            </div>
            <div className="flex items-center gap-3">
                {/* Mobile language switcher */}
                <div className="md:hidden flex items-center bg-gray-100 rounded-full p-0.5">
                    <button
                        onClick={() => lang !== 'en' && toggleLang()}
                        className={`px-2 py-1 rounded-full text-[10px] font-bold tracking-wide transition-all duration-300 ${lang === 'en' ? 'bg-primary text-white shadow-sm' : 'text-gray-400'}`}
                    >
                        EN
                    </button>
                    <button
                        onClick={() => lang !== 'el' && toggleLang()}
                        className={`px-2 py-1 rounded-full text-[10px] font-bold tracking-wide transition-all duration-300 ${lang === 'el' ? 'bg-primary text-white shadow-sm' : 'text-gray-400'}`}
                    >
                        GR
                    </button>
                </div>
                <button onClick={onOpenBooking} className="bg-primary text-white rounded-full px-4 py-2 md:px-6 md:py-2.5 font-bold hover:bg-primary-hover shadow-lg shadow-primary/25 transition-all text-sm uppercase tracking-wide">
                    {t('nav.bookNow')}
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
