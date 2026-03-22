import React from 'react';
import { useLang } from '../../lib/LanguageContext';

const MobileBottomNav = ({ onOpenBooking, onOpenShop, onOpenContact }) => {
    const { t } = useLang();

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const navItems = [
        { icon: 'home', label: t('nav.home'), action: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
        { icon: 'content_cut', label: t('nav.services'), action: () => scrollToSection('services') },
        { icon: 'calendar_month', label: t('nav.bookNow'), action: onOpenBooking, primary: true },
        { icon: 'shopping_bag', label: t('nav.shop'), action: onOpenShop },
        { icon: 'call', label: t('nav.callNow'), action: () => { window.location.href = 'tel:+15551234567'; } },
    ];

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-t border-gray-200 px-2 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
            <div className="flex justify-around items-center h-16">
                {navItems.map((item) => (
                    <button
                        key={item.icon}
                        onClick={item.action}
                        className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-colors ${
                            item.primary ? 'relative' : 'text-gray-500 active:text-primary'
                        }`}
                    >
                        {item.primary ? (
                            <div className="absolute -top-5 w-14 h-14 bg-primary rounded-full flex items-center justify-center shadow-lg shadow-primary/30">
                                <span className="material-symbols-outlined text-white text-2xl">{item.icon}</span>
                            </div>
                        ) : (
                            <span className="material-symbols-outlined text-xl">{item.icon}</span>
                        )}
                        <span className={`text-[10px] font-bold tracking-wide ${item.primary ? 'mt-5 text-primary' : ''}`}>
                            {item.label}
                        </span>
                    </button>
                ))}
            </div>
        </nav>
    );
};

export default MobileBottomNav;
