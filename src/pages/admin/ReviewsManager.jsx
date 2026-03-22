
import React, { useState, useEffect } from 'react';
import ImageUpload from '../../components/admin/ImageUpload';
import { supabase } from '../../lib/supabase';

const ReviewsManager = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentReview, setCurrentReview] = useState(null);
    const [deleteId, setDeleteId] = useState(null);

    const fetchReviews = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('reviews')
            .select('*')
            .order('created_at', { ascending: false });

        if (data) setReviews(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    const checkDelete = (id) => {
        setDeleteId(id);
    };

    const confirmDelete = async () => {
        if (!deleteId) return;

        try {
            const { error } = await supabase.from('reviews').delete().eq('id', deleteId);
            if (error) throw error;

            setDeleteId(null);
            fetchReviews();
        } catch (error) {
            alert('Delete Error: ' + error.message);
        }
    };

    const handleEdit = (review) => {
        setCurrentReview(review);
        setIsModalOpen(true);
    };

    const handleAddNew = () => {
        setCurrentReview(null);
        setIsModalOpen(true);
    };

    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, i) => (
            <span
                key={i}
                className={`material-symbols-outlined text-[18px] ${i < rating ? 'text-yellow-500' : 'text-gray-300'}`}
            >
                star
            </span>
        ));
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-display font-bold text-gray-900">Reviews Management</h1>
                <button
                    onClick={handleAddNew}
                    className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold hover:bg-primary-hover transition-colors flex items-center gap-2 shadow-lg shadow-primary/20"
                >
                    <span className="material-symbols-outlined">add</span>
                    Add New Review
                </button>
            </div>

            {loading ? (
                <div className="text-center py-12">Loading reviews...</div>
            ) : (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="p-6 font-bold text-gray-700">Author</th>
                                <th className="p-6 font-bold text-gray-700">Review</th>
                                <th className="p-6 font-bold text-gray-700">Rating</th>
                                <th className="p-6 font-bold text-gray-700">Featured</th>
                                <th className="p-6 font-bold text-gray-700">Active</th>
                                <th className="p-6 font-bold text-gray-700 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {reviews.map((review) => (
                                <tr key={review.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="p-6">
                                        <div className="flex items-center gap-3">
                                            {review.avatar_url ? (
                                                <img
                                                    src={review.avatar_url}
                                                    alt={review.author}
                                                    className="w-10 h-10 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                    <span className="text-primary font-bold text-sm">
                                                        {review.author?.charAt(0)?.toUpperCase()}
                                                    </span>
                                                </div>
                                            )}
                                            <span className="font-medium text-gray-900">{review.author}</span>
                                        </div>
                                    </td>
                                    <td className="p-6 text-gray-600 max-w-xs truncate">
                                        {review.text_en || review.text_el || '—'}
                                    </td>
                                    <td className="p-6">
                                        <div className="flex">{renderStars(review.rating)}</div>
                                    </td>
                                    <td className="p-6">
                                        {review.is_featured && (
                                            <span className="px-2 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700">
                                                Featured
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-6">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${review.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                            {review.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="p-6 text-right space-x-2">
                                        <button
                                            onClick={() => handleEdit(review)}
                                            className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors"
                                            title="Edit"
                                        >
                                            <span className="material-symbols-outlined text-[20px]">edit</span>
                                        </button>
                                        <button
                                            onClick={() => checkDelete(review.id)}
                                            className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                                            title="Delete"
                                        >
                                            <span className="material-symbols-outlined text-[20px]">delete</span>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {reviews.length === 0 && (
                        <div className="p-12 text-center text-gray-500">
                            No reviews found. Click "Add New Review" to create one.
                        </div>
                    )}
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteId && (
                <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="material-symbols-outlined text-3xl text-red-600">delete</span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Review?</h3>
                        <p className="text-gray-500 mb-8">This action cannot be undone.</p>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setDeleteId(null)}
                                className="flex-1 py-3 font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="flex-1 py-3 font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors shadow-lg shadow-red-200"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isModalOpen && (
                <ReviewModal
                    review={currentReview}
                    onClose={() => setIsModalOpen(false)}
                    onRefresh={fetchReviews}
                />
            )}
        </div>
    );
};

const ReviewModal = ({ review, onClose, onRefresh }) => {
    const [formData, setFormData] = useState({
        author: '',
        text_en: '',
        text_el: '',
        rating: 5,
        avatar_url: '',
        is_featured: false,
        is_active: true
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (review) {
            setFormData({
                author: review.author || '',
                text_en: review.text_en || '',
                text_el: review.text_el || '',
                rating: review.rating || 5,
                avatar_url: review.avatar_url || '',
                is_featured: review.is_featured || false,
                is_active: review.is_active !== undefined ? review.is_active : true
            });
        }
    }, [review]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                ...formData,
                rating: Number(formData.rating)
            };

            if (review) {
                const { error } = await supabase.from('reviews').update(payload).eq('id', review.id);
                if (error) throw error;
            } else {
                const { error } = await supabase.from('reviews').insert([payload]);
                if (error) throw error;
            }
            onRefresh();
            onClose();
        } catch (error) {
            alert('Error saving review: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
                <form onSubmit={handleSubmit} className="p-8">
                    <h2 className="text-2xl font-display font-bold mb-6">
                        {review ? 'Edit Review' : 'New Review'}
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Author Name</label>
                            <input
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                                value={formData.author}
                                onChange={e => setFormData({ ...formData, author: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Rating</label>
                            <select
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                                value={formData.rating}
                                onChange={e => setFormData({ ...formData, rating: e.target.value })}
                            >
                                <option value={5}>5 Stars</option>
                                <option value={4}>4 Stars</option>
                                <option value={3}>3 Stars</option>
                                <option value={2}>2 Stars</option>
                                <option value={1}>1 Star</option>
                            </select>
                        </div>
                        <div>
                            <ImageUpload
                                currentImage={formData.avatar_url}
                                onUpload={(url) => setFormData({ ...formData, avatar_url: url })}
                                label="Avatar Image"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Review Text (English)</label>
                            <textarea
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary h-24 resize-none"
                                value={formData.text_en}
                                onChange={e => setFormData({ ...formData, text_en: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Review Text (Greek)</label>
                            <textarea
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary h-24 resize-none"
                                value={formData.text_el}
                                onChange={e => setFormData({ ...formData, text_el: e.target.value })}
                            />
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-3">
                                <label className="text-sm font-bold text-gray-700">Featured</label>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, is_featured: !formData.is_featured })}
                                    className={`relative w-12 h-6 rounded-full transition-colors ${formData.is_featured ? 'bg-yellow-500' : 'bg-gray-300'}`}
                                >
                                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${formData.is_featured ? 'translate-x-6' : ''}`} />
                                </button>
                            </div>
                            <div className="flex items-center gap-3">
                                <label className="text-sm font-bold text-gray-700">Active</label>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, is_active: !formData.is_active })}
                                    className={`relative w-12 h-6 rounded-full transition-colors ${formData.is_active ? 'bg-primary' : 'bg-gray-300'}`}
                                >
                                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${formData.is_active ? 'translate-x-6' : ''}`} />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-8">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-bold transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 bg-primary text-white rounded-lg font-bold hover:bg-primary-hover transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : 'Save Review'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReviewsManager;
