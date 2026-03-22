import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useLang } from '../../lib/LanguageContext';

const CartDrawer = ({ isOpen, onClose, cartItems, onRemove, onClearCart }) => {
    const { t } = useLang();
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', phone: '' });

    const total = cartItems.reduce((sum, item) => {
        const price = parseFloat(item.price.replace(/[^0-9.]/g, ''));
        return sum + price;
    }, 0);

    const handleCheckout = async (e) => {
        e.preventDefault();
        setLoading(true);

        const orderData = {
            customer_name: `${formData.firstName} ${formData.lastName}`,
            customer_email: formData.email,
            customer_phone: formData.phone,
            total_amount: total,
            items: cartItems,
            status: 'pending'
        };

        const { error } = await supabase.from('orders').insert([orderData]);

        setLoading(false);
        if (error) {
            alert('Error placing order: ' + error.message);
        } else {
            setIsSuccess(true);
            onClearCart();
        }
    };

    const handleClose = () => {
        setIsCheckingOut(false);
        setIsSuccess(false);
        setFormData({ firstName: '', lastName: '', email: '', phone: '' });
        onClose();
    };

    return (
        <>
            <div
                className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[80] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            ></div>

            <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[90] transform transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>

                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h2 className="text-2xl font-display font-bold text-primary">
                        {isSuccess ? t('cart.success') : isCheckingOut ? t('cart.checkout') : `${t('cart.yourBag')} (${cartItems.length})`}
                    </h2>
                    <button onClick={handleClose} className="w-10 h-10 rounded-full hover:bg-gray-200 flex items-center justify-center transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 h-[calc(100vh-200px)]">

                    {isSuccess ? (
                        <div className="flex flex-col items-center justify-center h-full text-center space-y-6 animate-fade-in">
                            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                <span className="material-symbols-outlined text-5xl text-green-600">check_circle</span>
                            </div>
                            <h3 className="text-3xl font-display font-bold text-gray-900">{t('cart.orderConfirmed')}</h3>
                            <p className="text-gray-500">
                                {t('cart.thankYou')} <strong>{formData.firstName}</strong>. {t('cart.orderReceived')}
                            </p>
                            <button onClick={handleClose} className="px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-hover shadow-lg transition-all mt-4">
                                {t('cart.continueShopping')}
                            </button>
                        </div>
                    ) : isCheckingOut ? (
                        <form id="checkout-form" onSubmit={handleCheckout} className="space-y-4 animate-fade-in">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">{t('cart.firstName')}</label>
                                    <input className="w-full p-3 bg-gray-50 rounded-lg border focus:bg-white focus:border-primary outline-none" required value={formData.firstName} onChange={e => setFormData({ ...formData, firstName: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">{t('cart.lastName')}</label>
                                    <input className="w-full p-3 bg-gray-50 rounded-lg border focus:bg-white focus:border-primary outline-none" required value={formData.lastName} onChange={e => setFormData({ ...formData, lastName: e.target.value })} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">{t('cart.email')}</label>
                                <input type="email" className="w-full p-3 bg-gray-50 rounded-lg border focus:bg-white focus:border-primary outline-none" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">{t('cart.phone')}</label>
                                <input type="tel" className="w-full p-3 bg-gray-50 rounded-lg border focus:bg-white focus:border-primary outline-none" required value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                            </div>

                            <div className="border-t border-gray-100 pt-4 mt-6">
                                <h4 className="font-bold text-gray-900 mb-2">{t('cart.orderSummary')}</h4>
                                <div className="space-y-2 text-sm text-gray-500">
                                    {cartItems.map((item, i) => (
                                        <div key={i} className="flex justify-between">
                                            <span>{item.name}</span>
                                            <span>{item.price}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-between font-bold text-lg text-gray-900 mt-4 pt-4 border-t border-gray-100">
                                    <span>{t('cart.total')}</span>
                                    <span>{'\u20AC'}{total.toFixed(2)}</span>
                                </div>
                            </div>
                        </form>
                    ) : (
                        <div className="space-y-6">
                            {cartItems.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-gray-400 mt-20">
                                    <span className="material-symbols-outlined text-6xl mb-4 opacity-20">shopping_bag</span>
                                    <p>{t('cart.emptyBag')}</p>
                                </div>
                            ) : (
                                cartItems.map((item, index) => (
                                    <div key={`${item.id}-${index}`} className="flex gap-4 animate-fade-in group">
                                        <div className="w-20 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                            <img src={item.image_url || item.image} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-between">
                                            <div>
                                                <h4 className="font-bold text-gray-900">{item.name}</h4>
                                                <p className="text-xs text-gray-500 mt-1">{item.category}</p>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gold-accent font-bold">{item.price}</span>
                                                <button onClick={() => onRemove(index)} className="text-red-400 text-xs hover:text-red-600 font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">Remove</button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>

                {!isSuccess && cartItems.length > 0 && (
                    <div className="p-6 border-t border-gray-100 bg-gray-50 absolute bottom-0 w-full">
                        {!isCheckingOut ? (
                            <>
                                <div className="flex justify-between items-center mb-4 text-lg">
                                    <span className="text-gray-600">{t('cart.total')}</span>
                                    <span className="font-bold text-primary">{'\u20AC'}{total.toFixed(2)}</span>
                                </div>
                                <button onClick={() => setIsCheckingOut(true)} className="w-full bg-black hover:bg-gray-800 text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-95">
                                    {t('cart.checkout')}
                                </button>
                            </>
                        ) : (
                            <div className="flex gap-3">
                                <button onClick={() => setIsCheckingOut(false)} className="flex-1 py-4 font-bold text-gray-600 bg-gray-200 hover:bg-gray-300 rounded-xl transition-colors">
                                    {t('cart.back')}
                                </button>
                                <button form="checkout-form" type="submit" disabled={loading} className="flex-[2] bg-primary hover:bg-primary-hover text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-95 disabled:opacity-50">
                                    {loading ? t('cart.processing') : `${t('cart.pay')} \u20AC${total.toFixed(2)}`}
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </>
    );
};

export default CartDrawer;
