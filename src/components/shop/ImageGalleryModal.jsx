
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

const ImageGalleryModal = ({ images, initialIndex = 0, isOpen, onClose }) => {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);

    useEffect(() => {
        if (isOpen) setCurrentIndex(initialIndex);
    }, [isOpen, initialIndex]);

    if (!isOpen) return null;

    const handleNext = (e) => {
        e.stopPropagation();
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const handlePrev = (e) => {
        e.stopPropagation();
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    return ReactDOM.createPortal(
        <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col animate-fade-in">
            {/* Close Button */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 z-50 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-all backdrop-blur-sm"
            >
                <span className="material-symbols-outlined text-2xl">close</span>
            </button>

            {/* Main Image Area */}
            <div className="flex-grow flex items-center justify-center p-4 relative h-full">

                {/* Navigation Arrows (only if multiple images) */}
                {images.length > 1 && (
                    <>
                        <button
                            onClick={handlePrev}
                            className="absolute left-4 md:left-8 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-all backdrop-blur-sm z-50"
                        >
                            <span className="material-symbols-outlined text-3xl">chevron_left</span>
                        </button>
                        <button
                            onClick={handleNext}
                            className="absolute right-4 md:right-8 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-all backdrop-blur-sm z-50"
                        >
                            <span className="material-symbols-outlined text-3xl">chevron_right</span>
                        </button>
                    </>
                )}

                <img
                    src={images[currentIndex]}
                    alt={`Gallery view ${currentIndex + 1}`}
                    className="max-h-full max-w-full object-contain shadow-2xl animate-scale-in"
                />
            </div>

            {/* Thumbnail Strip (only if multiple) */}
            {images.length > 1 && (
                <div className="h-24 bg-black/50 backdrop-blur-md flex items-center justify-center gap-4 p-4 shrink-0 overflow-x-auto">
                    {images.map((img, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            className={`relative h-full aspect-square rounded-lg overflow-hidden border-2 transition-all ${idx === currentIndex ? 'border-primary scale-110' : 'border-transparent opacity-50 hover:opacity-100'
                                }`}
                        >
                            <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                        </button>
                    ))}
                </div>
            )}
        </div>,
        document.body
    );
};

export default ImageGalleryModal;
