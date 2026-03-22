
import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';

const isVideoUrl = (item) => {
    if (item?.type === 'video') return true;
    const url = (item?.url || item || '').toLowerCase();
    return url.endsWith('.mp4') || url.endsWith('.webm') || url.endsWith('.mov');
};

const isTikTokItem = (item) => item?.type === 'tiktok';

const ImageGalleryModal = ({ items, images, initialIndex = 0, isOpen, onClose }) => {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const tiktokContainerRef = useRef(null);

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

    // Load TikTok embed script when showing a TikTok item
    useEffect(() => {
        if (!isOpen) return;
        const current = mediaItems[currentIndex];
        if (!isTikTokItem(current)) return;

        // Load TikTok embed script if not already loaded
        if (!document.getElementById('tiktok-embed-script')) {
            const script = document.createElement('script');
            script.id = 'tiktok-embed-script';
            script.src = 'https://www.tiktok.com/embed.js';
            script.async = true;
            document.body.appendChild(script);
        } else if (window.tiktokEmbed) {
            // Re-process embeds if script already loaded
            window.tiktokEmbed.lib.render();
        }
    }, [isOpen, currentIndex, mediaItems]);

    if (!isOpen || mediaItems.length === 0) return null;

    const current = mediaItems[currentIndex];
    const currentUrl = current?.url || current;
    const currentIsVideo = isVideoUrl(current);
    const currentIsTikTok = isTikTokItem(current);

    const handleNext = (e) => {
        e.stopPropagation();
        setCurrentIndex((prev) => (prev + 1) % mediaItems.length);
    };

    const handlePrev = (e) => {
        e.stopPropagation();
        setCurrentIndex((prev) => (prev - 1 + mediaItems.length) % mediaItems.length);
    };

    const renderTikTokEmbed = () => {
        const embedId = current?.embedId;
        if (!embedId) return null;

        return (
            <div
                ref={tiktokContainerRef}
                className="flex items-center justify-center h-full"
                onClick={(e) => e.stopPropagation()}
            >
                <iframe
                    src={`https://www.tiktok.com/embed/v2/${embedId}?lang=en-US`}
                    className="rounded-xl shadow-2xl animate-scale-in"
                    style={{ width: '325px', height: '580px', border: 'none' }}
                    allow="encrypted-media"
                    allowFullScreen
                />
            </div>
        );
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

                {currentIsTikTok ? (
                    renderTikTokEmbed()
                ) : currentIsVideo ? (
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
                        const thumbUrl = item?.thumbnailUrl || item?.url || item;
                        const thumbIsVideo = isVideoUrl(item);
                        const thumbIsTikTok = isTikTokItem(item);
                        return (
                            <button
                                key={idx}
                                onClick={() => setCurrentIndex(idx)}
                                className={`relative h-full aspect-square rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${idx === currentIndex ? 'border-primary scale-110' : 'border-transparent opacity-50 hover:opacity-100'}`}
                            >
                                {thumbIsTikTok ? (
                                    <>
                                        <img src={thumbUrl} alt="TikTok" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.71a8.22 8.22 0 004.76 1.5v-3.4a4.85 4.85 0 01-1-.12z"/>
                                            </svg>
                                        </div>
                                    </>
                                ) : thumbIsVideo ? (
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
