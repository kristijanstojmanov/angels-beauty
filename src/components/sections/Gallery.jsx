import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useLang } from '../../lib/LanguageContext';
import ImageGalleryModal from '../shop/ImageGalleryModal';

const Gallery = () => {
    const { t } = useLang();
    const [galleryItems, setGalleryItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);
    const [initialIndex, setInitialIndex] = useState(0);

    useEffect(() => {
        const fetchGallery = async () => {
            try {
                const { data, error } = await supabase
                    .from('gallery')
                    .select('id, image_url, media_type')
                    .order('display_order', { ascending: true });
                if (error) throw error;
                if (data) setGalleryItems(data.map(item => ({
                    url: item.image_url,
                    type: item.media_type || 'image',
                })));
            } catch (error) {
                console.error("Error fetching gallery:", error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchGallery();
    }, []);

    const isVideo = (item) => {
        if (item.type === 'video') return true;
        const url = item.url?.toLowerCase() || '';
        return url.endsWith('.mp4') || url.endsWith('.webm') || url.endsWith('.mov');
    };

    const isGif = (item) => {
        return (item.url?.toLowerCase() || '').endsWith('.gif');
    };

    return (
        <section id="gallery" className="py-24 bg-background-light relative text-text-main-light">
            <div className="container mx-auto px-6">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h2 className="text-4xl font-display font-bold text-primary mb-2">{t('gallery.title')}</h2>
                        <p className="text-text-muted-light dark:text-text-muted-dark">{t('gallery.subtitle')}</p>
                    </div>
                    <button
                        onClick={() => { setInitialIndex(0); setIsGalleryOpen(true); }}
                        className="text-primary font-bold hover:text-primary-hover flex items-center gap-1 transition-colors"
                    >
                        {t('gallery.viewAll')} <span className="material-symbols-outlined">arrow_forward</span>
                    </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {galleryItems.map((item, index) => (
                        <div
                            key={index}
                            className={`rounded-xl overflow-hidden relative group h-64 md:h-80 ${index === 0 ? 'md:col-span-2' : ''} cursor-pointer`}
                            onClick={() => {
                                setInitialIndex(index);
                                setIsGalleryOpen(true);
                            }}
                        >
                            {isVideo(item) ? (
                                <video
                                    src={item.url}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    muted
                                    autoPlay
                                    loop
                                    playsInline
                                />
                            ) : (
                                <img
                                    src={item.url}
                                    alt={`Gallery ${index}`}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                            )}

                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <span className="material-symbols-outlined text-white text-4xl">
                                    {isVideo(item) ? 'play_circle' : 'visibility'}
                                </span>
                            </div>

                            {/* Video/GIF badge */}
                            {(isVideo(item) || isGif(item)) && (
                                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                                    <span className="material-symbols-outlined text-xs">{isVideo(item) ? 'videocam' : 'gif_box'}</span>
                                    {isVideo(item) ? 'VIDEO' : 'GIF'}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <ImageGalleryModal
                isOpen={isGalleryOpen}
                onClose={() => setIsGalleryOpen(false)}
                items={galleryItems}
                initialIndex={initialIndex}
            />
        </section>
    );
};

export default Gallery;
