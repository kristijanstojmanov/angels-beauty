import React, { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import MobileBottomNav from '../components/layout/MobileBottomNav';
import Hero from '../components/sections/Hero';
import Services from '../components/sections/Services';
import AboutStylist from '../components/sections/AboutStylist';
import Brands from '../components/sections/Brands';
import ShopPreview from '../components/sections/ShopPreview';
import Gallery from '../components/sections/Gallery';
import Events from '../components/sections/Events';
import FAQ from '../components/sections/FAQ';
import MapSection from '../components/sections/MapSection';
import ShopModal from '../components/shop/ShopModal';
import BookingModal from '../components/booking/BookingModal';
import ContactModal from '../components/contact/ContactModal';

const Home = () => {
    const [isShopOpen, setIsShopOpen] = useState(false);
    const [isBookingOpen, setIsBookingOpen] = useState(false);
    const [isContactOpen, setIsContactOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const handleOpenShop = (product) => {
        if (product && typeof product === 'object' && 'id' in product) {
            setSelectedProduct(product);
        } else {
            setSelectedProduct(null);
        }
        setIsShopOpen(true);
    };

    return (
        <div className="flex flex-col min-h-screen pb-16 md:pb-0">
            <Navbar onOpenBooking={() => setIsBookingOpen(true)} onOpenShop={() => handleOpenShop(null)} />

            <main>
                <Hero onOpenBooking={() => setIsBookingOpen(true)} onOpenShop={() => handleOpenShop(null)} />
                <Brands />
                <Services onOpenBooking={() => setIsBookingOpen(true)} />
                <AboutStylist onOpenBooking={() => setIsBookingOpen(true)} />
                <ShopPreview onOpenShop={handleOpenShop} />
                <Gallery />
                <Events />
                <FAQ onOpenContact={() => setIsContactOpen(true)} />
                <MapSection />
            </main>

            <Footer />

            <MobileBottomNav
                onOpenBooking={() => setIsBookingOpen(true)}
                onOpenShop={() => handleOpenShop(null)}
                onOpenContact={() => setIsContactOpen(true)}
            />

            <ShopModal
                isOpen={isShopOpen}
                onClose={() => setIsShopOpen(false)}
                selectedProduct={selectedProduct}
                onSelectProduct={setSelectedProduct}
                onOpenBooking={() => setIsBookingOpen(true)}
            />
            <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
            <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
        </div>
    );
};

export default Home;
