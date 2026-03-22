
import React, { useState, useEffect } from 'react';
import ImageUpload from '../../components/admin/ImageUpload';
import { supabase } from '../../lib/supabase';

const GalleryManager = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newItemUrl, setNewItemUrl] = useState('');
    const [newCategory, setNewCategory] = useState('hair-coloring');
    const [newMediaType, setNewMediaType] = useState('image');
    const [isAdding, setIsAdding] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const fetchItems = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('gallery')
            .select('*')
            .order('created_at', { ascending: false });
        if (error) console.error('Failed to fetch gallery:', error.message);
        if (data) setItems(data);
        setLoading(false);
    };

    useEffect(() => { fetchItems(); }, []);

    const confirmDelete = async () => {
        if (!deleteId) return;
        try {
            const { error } = await supabase.from('gallery').delete().eq('id', deleteId);
            if (error) throw error;
            setDeleteId(null);
            fetchItems();
        } catch (error) {
            alert('Delete Error: ' + error.message);
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!newItemUrl) return;

        const { error } = await supabase.from('gallery').insert([{
            image_url: newItemUrl,
            category: newCategory,
            media_type: newMediaType,
        }]);

        if (error) {
            alert('Error adding media: ' + error.message);
        } else {
            setNewItemUrl('');
            setNewMediaType('image');
            setIsAdding(false);
            fetchItems();
        }
    };

    const isVideo = (item) => {
        if (item.media_type === 'video') return true;
        const url = (item.image_url || '').toLowerCase();
        return url.endsWith('.mp4') || url.endsWith('.webm') || url.endsWith('.mov');
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
                    {isAdding ? 'Cancel' : 'Add New Media'}
                </button>
            </div>

            {isAdding && (
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mb-8">
                    <form onSubmit={handleAdd} className="space-y-4">
                        <div className="flex flex-col md:flex-row gap-4">
                            {/* Media Type Toggle */}
                            <div className="w-full md:w-48">
                                <label className="block text-sm font-bold text-gray-700 mb-1">Media Type</label>
                                <div className="flex bg-gray-100 rounded-lg p-1">
                                    <button
                                        type="button"
                                        onClick={() => setNewMediaType('image')}
                                        className={`flex-1 py-2 px-3 rounded-md text-sm font-bold transition-all flex items-center justify-center gap-1 ${newMediaType === 'image' ? 'bg-white text-primary shadow-sm' : 'text-gray-500'}`}
                                    >
                                        <span className="material-symbols-outlined text-sm">image</span>
                                        Image
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setNewMediaType('video')}
                                        className={`flex-1 py-2 px-3 rounded-md text-sm font-bold transition-all flex items-center justify-center gap-1 ${newMediaType === 'video' ? 'bg-white text-primary shadow-sm' : 'text-gray-500'}`}
                                    >
                                        <span className="material-symbols-outlined text-sm">videocam</span>
                                        Video
                                    </button>
                                </div>
                            </div>

                            {/* Category */}
                            <div className="w-full md:w-48">
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
                        </div>

                        {newMediaType === 'image' ? (
                            <ImageUpload
                                currentImage={newItemUrl}
                                onUpload={(url) => setNewItemUrl(url)}
                                label="Upload Image"
                            />
                        ) : (
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Video URL</label>
                                <input
                                    type="url"
                                    placeholder="Paste video URL (.mp4, .webm, .mov)"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                                    value={newItemUrl}
                                    onChange={(e) => setNewItemUrl(e.target.value)}
                                />
                                <p className="text-xs text-gray-400 mt-1">Supported formats: MP4, WebM, MOV. Videos will autoplay muted as previews.</p>
                                {newItemUrl && (
                                    <div className="mt-3 rounded-lg overflow-hidden bg-black max-w-xs">
                                        <video src={newItemUrl} className="w-full" muted autoPlay loop playsInline />
                                    </div>
                                )}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={!newItemUrl}
                            className="bg-primary text-white px-6 py-2 rounded-lg font-bold hover:bg-primary-hover transition-colors disabled:opacity-50"
                        >
                            Save {newMediaType === 'video' ? 'Video' : 'Image'}
                        </button>
                    </form>
                </div>
            )}

            {loading ? (
                <div className="text-center py-12">Loading gallery...</div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {items.map((item) => (
                        <div key={item.id} className="group relative rounded-xl overflow-hidden aspect-square bg-gray-100 shadow-sm">
                            {isVideo(item) ? (
                                <video
                                    src={item.image_url}
                                    className="w-full h-full object-cover"
                                    muted
                                    autoPlay
                                    loop
                                    playsInline
                                />
                            ) : (
                                <img
                                    src={item.image_url}
                                    alt={item.category}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                            )}

                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <button
                                    onClick={() => setDeleteId(item.id)}
                                    className="bg-white text-red-500 p-3 rounded-full hover:bg-red-50 transition-colors"
                                    title="Delete"
                                >
                                    <span className="material-symbols-outlined">delete</span>
                                </button>
                            </div>

                            <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent flex justify-between items-center">
                                <span className="text-xs text-white font-medium capitalize px-2">{item.category}</span>
                                {isVideo(item) && (
                                    <span className="text-xs text-white bg-white/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                                        <span className="material-symbols-outlined text-xs">videocam</span>
                                        Video
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteId && (
                <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="material-symbols-outlined text-3xl text-red-600">delete</span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Item?</h3>
                        <p className="text-gray-500 mb-8">This action cannot be undone.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setDeleteId(null)} className="flex-1 py-3 font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">Cancel</button>
                            <button onClick={confirmDelete} className="flex-1 py-3 font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors shadow-lg shadow-red-200">Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GalleryManager;
