import React, { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Hero from '../components/sections/Hero';
import Services from '../components/sections/Services';
import ShopPreview from '../components/sections/ShopPreview';
import Gallery from '../components/sections/Gallery';
import FAQ from '../components/sections/FAQ';
import MapSection from '../components/sections/MapSection';
import ShopModal from '../components/shop/ShopModal';
import BookingModal from '../components/booking/BookingModal';
import ShopCartButton from '../components/shop/ShopCartButton';
import CartDrawer from '../components/shop/CartDrawer';
import ContactModal from '../components/contact/ContactModal';

const Home = () => {
    const [isShopOpen, setIsShopOpen] = useState(false);
    const [isBookingOpen, setIsBookingOpen] = useState(false);
    const [isContactOpen, setIsContactOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [cart, setCart] = useState([]); // Ensure initialized

    const handleOpenShop = (product) => {
        // Ensure we only select a valid product object, not a DOM event
        if (product && typeof product === 'object' && 'id' in product) {
            setSelectedProduct(product);
        } else {
            setSelectedProduct(null);
        }
        setIsShopOpen(true);
    };

    const addToCart = (product) => {
        console.log("addToCart called with:", product);
        if (!cart) {
            console.error("Cart is undefined!");
            return;
        }
        setCart([...cart, product]);
        // setIsCartOpen(true); // Don't open drawer automatically
    };

    const removeFromCart = (index) => {
        const newCart = [...cart];
        newCart.splice(index, 1);
        setCart(newCart);
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar onOpenBooking={() => setIsBookingOpen(true)} onOpenShop={() => handleOpenShop(null)} />

            <main>
                <Hero onOpenBooking={() => setIsBookingOpen(true)} onOpenShop={() => handleOpenShop(null)} />
                <Services onOpenBooking={() => setIsBookingOpen(true)} />
                <ShopPreview onOpenShop={handleOpenShop} onAddToCart={addToCart} />
                <Gallery />
                <FAQ onOpenContact={() => setIsContactOpen(true)} />
                <MapSection />
            </main>

            <Footer />

            <ShopModal
                isOpen={isShopOpen}
                onClose={() => setIsShopOpen(false)}
                onAddToCart={addToCart}
                selectedProduct={selectedProduct}
                onSelectProduct={setSelectedProduct}
            />
            <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
            <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />

            <ShopCartButton isOpen={isCartOpen} onClick={() => setIsCartOpen(!isCartOpen)} count={cart.length} />
            <CartDrawer
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                cartItems={cart}
                onRemove={removeFromCart}
                onClearCart={() => setCart([])}
            />
        </div>
    );
};

export default Home;
