import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer id="contact" className="bg-background-dark text-text-main-dark py-12 border-t border-white/10">
            <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Brand */}
                <div className="space-y-4">
                    <h3 className="text-2xl font-display font-bold text-primary">Angel's Beauty</h3>
                    <p className="text-text-muted-dark text-sm">
                        Reveal your inner angel with our premium beauty and wellness services.
                    </p>
                </div>

                {/* Quick Links */}
                <div className="space-y-4">
                    <h4 className="font-bold text-gold-accent uppercase tracking-wider text-sm">Explore</h4>
                    <div className="flex flex-col space-y-2 text-sm text-text-muted-dark">
                        <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                        <Link to="/services" className="hover:text-primary transition-colors">Services</Link>
                        <Link to="/booking" className="hover:text-primary transition-colors">Book Now</Link>
                        <Link to="/about" className="hover:text-primary transition-colors">About Us</Link>
                    </div>
                </div>

                {/* Contact */}
                <div className="space-y-4">
                    <h4 className="font-bold text-gold-accent uppercase tracking-wider text-sm">Contact</h4>
                    <div className="space-y-2 text-sm text-text-muted-dark">
                        <p className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary text-sm">location_on</span>
                            123 Luxury Lane, Beverly Hills
                        </p>
                        <p className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary text-sm">call</span>
                            +1 (555) 123-4567
                        </p>
                        <p className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary text-sm">mail</span>
                            hello@angelsbeauty.com
                        </p>
                    </div>
                </div>

                {/* Working Hours */}
                <div className="space-y-4">
                    <h4 className="font-bold text-gold-accent uppercase tracking-wider text-sm">Opening Hours</h4>
                    <div className="space-y-2 text-sm text-text-muted-dark">
                        <div className="flex justify-between">
                            <span>Mon - Fri</span>
                            <span>9:00 AM - 8:00 PM</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Saturday</span>
                            <span>10:00 AM - 6:00 PM</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Sunday</span>
                            <span className="text-primary">Closed</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container mx-auto px-6 mt-12 pt-6 border-t border-white/10 text-center text-xs text-text-muted-dark">
                &copy; {new Date().getFullYear()} Angel's Beauty. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
