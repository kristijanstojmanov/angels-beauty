
import React, { useState, useEffect } from 'react';
import ImageUpload from '../../components/admin/ImageUpload';
import { supabase } from '../../lib/supabase';

const TIKTOK_URL_REGEX = /tiktok\.com\/@[\w.-]+\/video\/(\d+)/;

const GalleryManager = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newItemUrl, setNewItemUrl] = useState('');
    const [newCaption, setNewCaption] = useState('');
    const [newMediaType, setNewMediaType] = useState('image');
    const [isAdding, setIsAdding] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [tiktokLoading, setTiktokLoading] = useState(false);
    const [tiktokPreview, setTiktokPreview] = useState(null);

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

    const fetchTikTokPreview = async (url) => {
        const match = url.match(TIKTOK_URL_REGEX);
        if (!match) {
            setTiktokPreview(null);
            return;
        }
        setTiktokLoading(true);
        try {
            const res = await fetch(`https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`);
            const data = await res.json();
            setTiktokPreview({
                embedId: match[1],
                thumbnailUrl: data.thumbnail_url,
                title: data.title,
                author: data.author_name,
            });
            if (!newCaption) setNewCaption(data.title || '');
        } catch {
            setTiktokPreview(null);
        } finally {
            setTiktokLoading(false);
        }
    };

    const handleTikTokUrlChange = (url) => {
        setNewItemUrl(url);
        if (TIKTOK_URL_REGEX.test(url)) {
            fetchTikTokPreview(url);
        } else {
            setTiktokPreview(null);
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!newItemUrl) return;

        const insertData = {
            image_url: newItemUrl,
            caption: newCaption || null,
            media_type: newMediaType,
        };

        // Add TikTok-specific fields
        if (newMediaType === 'tiktok' && tiktokPreview) {
            insertData.embed_id = tiktokPreview.embedId;
            insertData.thumbnail_url = tiktokPreview.thumbnailUrl;
        }

        const { error } = await supabase.from('gallery').insert([insertData]);

        if (error) {
            alert('Error adding media: ' + error.message);
        } else {
            setNewItemUrl('');
            setNewCaption('');
            setNewMediaType('image');
            setTiktokPreview(null);
            setIsAdding(false);
            fetchItems();
        }
    };

    const isVideo = (item) => {
        if (item.media_type === 'video') return true;
        const url = (item.image_url || '').toLowerCase();
        return url.endsWith('.mp4') || url.endsWith('.webm') || url.endsWith('.mov');
    };

    const isTikTok = (item) => item.media_type === 'tiktok';

    const getMediaBadge = (item) => {
        if (isTikTok(item)) return { icon: 'play_circle', label: 'TikTok', color: 'bg-pink-600' };
        if (isVideo(item)) return { icon: 'videocam', label: 'Video', color: 'bg-blue-600' };
        return null;
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
                            <div className="w-full md:w-64">
                                <label className="block text-sm font-bold text-gray-700 mb-1">Media Type</label>
                                <div className="flex bg-gray-100 rounded-lg p-1">
                                    <button
                                        type="button"
                                        onClick={() => { setNewMediaType('image'); setNewItemUrl(''); setTiktokPreview(null); }}
                                        className={`flex-1 py-2 px-3 rounded-md text-sm font-bold transition-all flex items-center justify-center gap-1 ${newMediaType === 'image' ? 'bg-white text-primary shadow-sm' : 'text-gray-500'}`}
                                    >
                                        <span className="material-symbols-outlined text-sm">image</span>
                                        Image
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => { setNewMediaType('video'); setNewItemUrl(''); setTiktokPreview(null); }}
                                        className={`flex-1 py-2 px-3 rounded-md text-sm font-bold transition-all flex items-center justify-center gap-1 ${newMediaType === 'video' ? 'bg-white text-primary shadow-sm' : 'text-gray-500'}`}
                                    >
                                        <span className="material-symbols-outlined text-sm">videocam</span>
                                        Video
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => { setNewMediaType('tiktok'); setNewItemUrl(''); setTiktokPreview(null); }}
                                        className={`flex-1 py-2 px-3 rounded-md text-sm font-bold transition-all flex items-center justify-center gap-1 ${newMediaType === 'tiktok' ? 'bg-white text-pink-600 shadow-sm' : 'text-gray-500'}`}
                                    >
                                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.71a8.22 8.22 0 004.76 1.5v-3.4a4.85 4.85 0 01-1-.12z"/>
                                        </svg>
                                        TikTok
                                    </button>
                                </div>
                            </div>

                            {/* Caption */}
                            <div className="w-full md:flex-1">
                                <label className="block text-sm font-bold text-gray-700 mb-1">Caption (optional)</label>
                                <input
                                    type="text"
                                    placeholder="Enter a caption..."
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                                    value={newCaption}
                                    onChange={(e) => setNewCaption(e.target.value)}
                                />
                            </div>
                        </div>

                        {newMediaType === 'image' ? (
                            <ImageUpload
                                currentImage={newItemUrl}
                                onUpload={(url) => setNewItemUrl(url)}
                                label="Upload Image"
                            />
                        ) : newMediaType === 'tiktok' ? (
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">TikTok URL</label>
                                <input
                                    type="url"
                                    placeholder="https://www.tiktok.com/@username/video/1234567890"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                                    value={newItemUrl}
                                    onChange={(e) => handleTikTokUrlChange(e.target.value)}
                                />
                                <p className="text-xs text-gray-400 mt-1">Paste the full TikTok video URL. The thumbnail and embed will be fetched automatically.</p>

                                {tiktokLoading && (
                                    <div className="mt-3 text-sm text-gray-500 flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                        Fetching TikTok preview...
                                    </div>
                                )}

                                {tiktokPreview && (
                                    <div className="mt-3 flex items-start gap-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
                                        <img
                                            src={tiktokPreview.thumbnailUrl}
                                            alt="TikTok preview"
                                            className="w-24 h-32 object-cover rounded-lg"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-gray-800 truncate">{tiktokPreview.title}</p>
                                            <p className="text-xs text-gray-500 mt-1">by {tiktokPreview.author}</p>
                                            <div className="flex items-center gap-1 mt-2 text-xs text-pink-600 font-bold">
                                                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.71a8.22 8.22 0 004.76 1.5v-3.4a4.85 4.85 0 01-1-.12z"/>
                                                </svg>
                                                TikTok Video
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
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
                            disabled={!newItemUrl || (newMediaType === 'tiktok' && !tiktokPreview)}
                            className="bg-primary text-white px-6 py-2 rounded-lg font-bold hover:bg-primary-hover transition-colors disabled:opacity-50"
                        >
                            Save {newMediaType === 'tiktok' ? 'TikTok' : newMediaType === 'video' ? 'Video' : 'Image'}
                        </button>
                    </form>
                </div>
            )}

            {loading ? (
                <div className="text-center py-12">Loading gallery...</div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {items.map((item) => {
                        const badge = getMediaBadge(item);
                        return (
                            <div key={item.id} className="group relative rounded-xl overflow-hidden aspect-square bg-gray-100 shadow-sm">
                                {isTikTok(item) ? (
                                    <img
                                        src={item.thumbnail_url || item.image_url}
                                        alt={item.caption || 'TikTok video'}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                ) : isVideo(item) ? (
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
                                        alt={item.caption || 'Gallery image'}
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
                                    <span className="text-xs text-white font-medium px-2 truncate">{item.caption || ''}</span>
                                    {badge && (
                                        <span className={`text-xs text-white ${badge.color} px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0`}>
                                            <span className="material-symbols-outlined text-xs">{badge.icon}</span>
                                            {badge.label}
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
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
