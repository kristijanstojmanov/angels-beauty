import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ onOpenBooking, onOpenShop }) => {
    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <nav className="p-6 md:p-10 flex justify-between items-center bg-white/10 backdrop-blur-md sticky top-0 z-50">
            <div className="text-2xl font-bold font-display text-primary flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                {/* Placeholder for Logo */}
                <div className="w-10 h-10 rounded-full border-2 border-gold-accent bg-gray-200 overflow-hidden">
                    <img src="/images/logo-final.jpg" alt="Logo" className="w-full h-full object-cover" />
                </div>
                Angel's Beauty
            </div>
            <div className="hidden md:flex gap-8 font-display font-semibold items-center">
                <button onClick={() => scrollToSection('services')} className="hover:text-primary transition-colors">Services</button>
                <button onClick={onOpenShop} className="hover:text-primary transition-colors">Shop</button>
                <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-primary transition-colors">About</button>
                <button onClick={() => scrollToSection('contact')} className="hover:text-primary transition-colors">Contact</button>
            </div>
            <button onClick={onOpenBooking} className="bg-primary text-white rounded-full px-4 py-2 md:px-6 md:py-2.5 font-bold hover:bg-primary-hover shadow-lg shadow-primary/25 transition-all text-sm uppercase tracking-wide">
                Book Now
            </button>
        </nav>
    );
};

export default Navbar;
