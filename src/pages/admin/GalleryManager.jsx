
import React, { useState, useEffect } from 'react';
import ImageUpload from '../../components/admin/ImageUpload';
import { supabase } from '../../lib/supabase';

const GalleryManager = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newItemUrl, setNewItemUrl] = useState('');
    const [newCategory, setNewCategory] = useState('hair-coloring'); // Default
    const [isAdding, setIsAdding] = useState(false);

    const fetchImages = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('gallery')
            .select('*')
            .order('created_at', { ascending: false });

        if (data) setImages(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchImages();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this image?')) {
            const { error } = await supabase.from('gallery').delete().eq('id', id);
            if (!error) fetchImages();
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!newItemUrl) return;

        const { error } = await supabase.from('gallery').insert([{
            image_url: newItemUrl,
            category: newCategory
        }]);

        if (error) {
            alert('Error adding image: ' + error.message);
        } else {
            setNewItemUrl('');
            setIsAdding(false);
            fetchImages();
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-display font-bold text-gray-900">Gallery Management</h1>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold hover:bg-primary-hover transition-colors flex items-center gap-2 shadow-lg shadow-primary/20"
                >
                    <span className="material-symbols-outlined">{isAdding ? 'close' : 'add'}</span>
                    {isAdding ? 'Cancel' : 'Add New Image'}
                </button>
            </div>

            {isAdding && (
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mb-8 animate-in fade-in slide-in-from-top-4">
                    <form onSubmit={handleAdd} className="flex flex-col md:flex-row gap-4 items-end">
                        <div className="flex-1 w-full">
                            <ImageUpload
                                currentImage={newItemUrl}
                                onUpload={(url) => setNewItemUrl(url)}
                                label="Upload Image"
                            />
                        </div>
                        <div className="w-full md:w-64">
                            <label className="block text-sm font-bold text-gray-700 mb-1">Category</label>
                            <select
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                                value={newCategory}
                                onChange={(e) => setNewCategory(e.target.value)}
                            >
                                <option value="hair-coloring">Hair Coloring</option>
                                <option value="styling">Styling</option>
                                <option value="extensions">Extensions</option>
                                <option value="cuts">Cuts</option>
                            </select>
                        </div>
                        <button
                            type="submit"
                            className="bg-primary text-white px-6 py-2 rounded-lg font-bold hover:bg-primary-hover transition-colors w-full md:w-auto"
                        >
                            Save Image
                        </button>
                    </form>
                </div>
            )}

            {loading ? (
                <div className="text-center py-12">Loading gallery...</div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {images.map((img) => (
                        <div key={img.id} className="group relative rounded-xl overflow-hidden aspect-square bg-gray-100 shadow-sm">
                            <img
                                src={img.image_url}
                                alt={img.category}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <button
                                    onClick={() => handleDelete(img.id)}
                                    className="bg-white text-red-500 p-3 rounded-full hover:bg-red-50 transition-colors"
                                    title="Delete"
                                >
                                    <span className="material-symbols-outlined">delete</span>
                                </button>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
                                <span className="text-xs text-white font-medium capitalize px-2">{img.category}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default GalleryManager;
