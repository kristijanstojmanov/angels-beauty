import React from 'react';

const CartDrawer = ({ isOpen, onClose, cartItems, onRemove }) => {
    const total = cartItems.reduce((sum, item) => {
        const price = parseFloat(item.price.replace(/[^0-9.]/g, ''));
        return sum + price;
    }, 0);

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[80] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            ></div>

            {/* Drawer */}
            <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[90] transform transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>

                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h2 className="text-2xl font-display font-bold text-primary">Your Bag ({cartItems.length})</h2>
                    <button onClick={onClose} className="w-10 h-10 rounded-full hover:bg-gray-200 flex items-center justify-center transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Items */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 h-[calc(100vh-200px)]">
                    {cartItems.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400">
                            <span className="material-symbols-outlined text-6xl mb-4 opacity-20">shopping_bag</span>
                            <p>Your bag is empty.</p>
                        </div>
                    ) : (
                        cartItems.map((item, index) => (
                            <div key={`${item.id}-${index}`} className="flex gap-4 animate-fade-in">
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
                                        <button onClick={() => onRemove(index)} className="text-red-400 text-xs hover:text-red-600 font-bold uppercase tracking-wider">Remove</button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 bg-gray-50 absolute bottom-0 w-full">
                    <div className="flex justify-between items-center mb-4 text-lg">
                        <span className="text-gray-600">Total</span>
                        <span className="font-bold text-primary">€{total.toFixed(2)}</span>
                    </div>
                    <button className="w-full bg-black hover:bg-gray-800 text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-95">
                        Checkout
                    </button>
                </div>
            </div>
        </>
    );
};

export default CartDrawer;
