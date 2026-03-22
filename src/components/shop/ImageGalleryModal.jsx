
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

const isVideoUrl = (item) => {
    if (item?.type === 'video') return true;
    const url = (item?.url || item || '').toLowerCase();
    return url.endsWith('.mp4') || url.endsWith('.webm') || url.endsWith('.mov');
};

const ImageGalleryModal = ({ items, images, initialIndex = 0, isOpen, onClose }) => {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);

    // Support both old `images` (string[]) and new `items` ({ url, type }[]) prop
    const mediaItems = items || (images || []).map(url => ({ url, type: 'image' }));

    useEffect(() => {
        if (isOpen) setCurrentIndex(initialIndex);
    }, [isOpen, initialIndex]);

    useEffect(() => {
        if (!isOpen) return;
        const handleKey = (e) => {
            if (e.key === 'ArrowRight') setCurrentIndex(prev => (prev + 1) % mediaItems.length);
            if (e.key === 'ArrowLeft') setCurrentIndex(prev => (prev - 1 + mediaItems.length) % mediaItems.length);
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [isOpen, mediaItems.length, onClose]);

    if (!isOpen || mediaItems.length === 0) return null;

    const current = mediaItems[currentIndex];
    const currentUrl = current?.url || current;
    const currentIsVideo = isVideoUrl(current);

    const handleNext = (e) => {
        e.stopPropagation();
        setCurrentIndex((prev) => (prev + 1) % mediaItems.length);
    };

    const handlePrev = (e) => {
        e.stopPropagation();
        setCurrentIndex((prev) => (prev - 1 + mediaItems.length) % mediaItems.length);
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

            {/* Counter */}
            <div className="absolute top-5 left-1/2 -translate-x-1/2 text-white/60 text-sm font-bold z-50">
                {currentIndex + 1} / {mediaItems.length}
            </div>

            {/* Main Media Area */}
            <div className="flex-grow flex items-center justify-center p-4 relative h-full" onClick={onClose}>
                {/* Navigation Arrows */}
                {mediaItems.length > 1 && (
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

                {currentIsVideo ? (
                    <video
                        key={currentUrl}
                        src={currentUrl}
                        className="max-h-full max-w-full object-contain shadow-2xl animate-scale-in rounded-lg"
                        controls
                        autoPlay
                        muted
                        loop
                        playsInline
                        onClick={(e) => e.stopPropagation()}
                    />
                ) : (
                    <img
                        src={currentUrl}
                        alt={`Gallery view ${currentIndex + 1}`}
                        className="max-h-full max-w-full object-contain shadow-2xl animate-scale-in"
                        onClick={(e) => e.stopPropagation()}
                    />
                )}
            </div>

            {/* Thumbnail Strip */}
            {mediaItems.length > 1 && (
                <div className="h-24 bg-black/50 backdrop-blur-md flex items-center justify-center gap-4 p-4 shrink-0 overflow-x-auto">
                    {mediaItems.map((item, idx) => {
                        const thumbUrl = item?.url || item;
                        const thumbIsVideo = isVideoUrl(item);
                        return (
                            <button
                                key={idx}
                                onClick={() => setCurrentIndex(idx)}
                                className={`relative h-full aspect-square rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${idx === currentIndex ? 'border-primary scale-110' : 'border-transparent opacity-50 hover:opacity-100'}`}
                            >
                                {thumbIsVideo ? (
                                    <>
                                        <video src={thumbUrl} className="w-full h-full object-cover" muted playsInline />
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                            <span className="material-symbols-outlined text-white text-sm">play_arrow</span>
                                        </div>
                                    </>
                                ) : (
                                    <img src={thumbUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                                )}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>,
        document.body
    );
};

export default ImageGalleryModal;
