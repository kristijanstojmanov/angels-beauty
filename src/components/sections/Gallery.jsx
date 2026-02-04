import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

import ImageGalleryModal from '../shop/ImageGalleryModal';

const Gallery = () => {
    const [galleryImages, setGalleryImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);
    const [initialIndex, setInitialIndex] = useState(0);

    useEffect(() => {
        const fetchGallery = async () => {
            try {
                const { data, error } = await supabase.from('gallery').select('*').order('display_order', { ascending: true });
                if (error) throw error;
                if (data) setGalleryImages(data.map(item => item.image_url)); // Map to array of strings to match existing structure
            } catch (error) {
                console.error("Error fetching gallery:", error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchGallery();
    }, []);
    return (
        <section className="py-24 bg-background-light relative text-text-main-light">
            <div className="container mx-auto px-6">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h2 className="text-4xl font-display font-bold text-primary mb-2">Our Masterpieces</h2>
                        <p className="text-text-muted-light dark:text-text-muted-dark">Recent transformations from our artists.</p>
                    </div>
                    <button className="text-primary font-bold hover:text-primary-hover flex items-center gap-1 transition-colors">
                        View All Work <span className="material-symbols-outlined">arrow_forward</span>
                    </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {galleryImages.map((src, index) => (
                        <div
                            key={index}
                            className={`rounded-xl overflow-hidden relative group h-64 md:h-80 ${index === 0 ? 'md:col-span-2' : ''} cursor-pointer`}
                            onClick={() => {
                                setInitialIndex(index);
                                setIsGalleryOpen(true);
                            }}
                        >
                            <img
                                src={src}
                                alt={`Gallery ${index}`}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <span className="material-symbols-outlined text-white text-4xl">visibility</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <ImageGalleryModal
                isOpen={isGalleryOpen}
                onClose={() => setIsGalleryOpen(false)}
                images={galleryImages}
                initialIndex={initialIndex}
            />
        </section>
    );
};

export default Gallery;
