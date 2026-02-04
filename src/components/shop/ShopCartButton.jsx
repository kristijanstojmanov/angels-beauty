import React from 'react';

const ShopCartButton = ({ isOpen, onClick, count }) => {
    return (
        <button
            onClick={onClick}
            className={`fixed bottom-8 right-8 z-[70] w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 ${isOpen ? 'bg-white text-black translate-x-32' : 'bg-primary text-white'}`}
        >
            <span className="material-symbols-outlined text-3xl">shopping_cart</span>
            {count > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center border-2 border-white">
                    {count}
                </span>
            )}
        </button>
    );
};

export default ShopCartButton;
