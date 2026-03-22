import React from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../../lib/LanguageContext';

const Footer = () => {
    const { t } = useLang();

    return (
        <footer id="contact" className="bg-background-dark text-text-main-dark py-12 border-t border-white/10">
            <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="space-y-4">
                    <h3 className="text-2xl font-display font-bold text-primary">{t('footer.brandName')}</h3>
                    <p className="text-text-muted-dark text-sm">{t('footer.brandDesc')}</p>
                </div>

                <div className="space-y-4">
                    <h4 className="font-bold text-gold-accent uppercase tracking-wider text-sm">{t('footer.explore')}</h4>
                    <div className="flex flex-col space-y-2 text-sm text-text-muted-dark">
                        <Link to="/" className="hover:text-primary transition-colors">{t('footer.home')}</Link>
                        <Link to="/services" className="hover:text-primary transition-colors">{t('footer.services')}</Link>
                        <Link to="/booking" className="hover:text-primary transition-colors">{t('footer.bookNow')}</Link>
                        <Link to="/about" className="hover:text-primary transition-colors">{t('footer.aboutUs')}</Link>
                    </div>
                </div>

                <div className="space-y-4">
                    <h4 className="font-bold text-gold-accent uppercase tracking-wider text-sm">{t('footer.contact')}</h4>
                    <div className="space-y-2 text-sm text-text-muted-dark">
                        <p className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary text-sm">location_on</span>
                            {t('footer.address')}
                        </p>
                        <p className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary text-sm">call</span>
                            {t('footer.phone')}
                        </p>
                        <p className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary text-sm">mail</span>
                            {t('footer.email')}
                        </p>
                    </div>
                </div>

                <div className="space-y-4">
                    <h4 className="font-bold text-gold-accent uppercase tracking-wider text-sm">{t('footer.openingHours')}</h4>
                    <div className="space-y-2 text-sm text-text-muted-dark">
                        <div className="flex justify-between">
                            <span>{t('footer.monFri')}</span>
                            <span>{t('footer.monFriHours')}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>{t('footer.saturday')}</span>
                            <span>{t('footer.saturdayHours')}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>{t('footer.sunday')}</span>
                            <span className="text-primary">{t('footer.sundayClosed')}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container mx-auto px-6 mt-12 pt-6 border-t border-white/10 text-center text-xs text-text-muted-dark">
                &copy; {new Date().getFullYear()} {t('footer.copyright')}
            </div>
        </footer>
    );
};

export default Footer;
