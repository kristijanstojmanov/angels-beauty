
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

const FAQManager = () => {
    const [faqs, setFaqs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentFaq, setCurrentFaq] = useState(null);
    const [deleteId, setDeleteId] = useState(null);

    const fetchFaqs = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('faqs')
            .select('*')
            .order('display_order', { ascending: true });

        if (data) setFaqs(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchFaqs();
    }, []);

    const checkDelete = (id) => {
        setDeleteId(id);
    };

    const confirmDelete = async () => {
        if (!deleteId) return;

        try {
            const { error } = await supabase.from('faqs').delete().eq('id', deleteId);
            if (error) throw error;

            setDeleteId(null);
            fetchFaqs();
        } catch (error) {
            alert('Delete Error: ' + error.message);
        }
    };

    const handleEdit = (faq) => {
        setCurrentFaq(faq);
        setIsModalOpen(true);
    };

    const handleAddNew = () => {
        setCurrentFaq(null);
        setIsModalOpen(true);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-display font-bold text-gray-900">FAQ Management</h1>
                <button
                    onClick={handleAddNew}
                    className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold hover:bg-primary-hover transition-colors flex items-center gap-2 shadow-lg shadow-primary/20"
                >
                    <span className="material-symbols-outlined">add</span>
                    Add New FAQ
                </button>
            </div>

            {loading ? (
                <div className="text-center py-12">Loading FAQs...</div>
            ) : (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="p-6 font-bold text-gray-700">Order</th>
                                <th className="p-6 font-bold text-gray-700">Question</th>
                                <th className="p-6 font-bold text-gray-700 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {faqs.map((faq) => (
                                <tr key={faq.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="p-6 text-gray-500 w-20">
                                        <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-lg text-sm font-bold">
                                            {faq.display_order}
                                        </span>
                                    </td>
                                    <td className="p-6 font-medium text-gray-900 max-w-lg truncate">
                                        {faq.question}
                                    </td>
                                    <td className="p-6 text-right space-x-2">
                                        <button
                                            onClick={() => handleEdit(faq)}
                                            className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors"
                                            title="Edit"
                                        >
                                            <span className="material-symbols-outlined text-[20px]">edit</span>
                                        </button>
                                        <button
                                            onClick={() => checkDelete(faq.id)}
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

                    {faqs.length === 0 && (
                        <div className="p-12 text-center text-gray-500">
                            No FAQs found. Click "Add New FAQ" to create one.
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
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Delete FAQ?</h3>
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
                <FAQModal
                    faq={currentFaq}
                    onClose={() => setIsModalOpen(false)}
                    onRefresh={fetchFaqs}
                />
            )}
        </div>
    );
};

const FAQModal = ({ faq, onClose, onRefresh }) => {
    const [formData, setFormData] = useState({
        question: '',
        answer: '',
        display_order: 0
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (faq) {
            setFormData({
                question: faq.question || '',
                answer: faq.answer || '',
                display_order: faq.display_order || 0
            });
        }
    }, [faq]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                ...formData,
                display_order: Number(formData.display_order)
            };

            if (faq) {
                const { error } = await supabase.from('faqs').update(payload).eq('id', faq.id);
                if (error) throw error;
            } else {
                const { error } = await supabase.from('faqs').insert([payload]);
                if (error) throw error;
            }
            onRefresh();
            onClose();
        } catch (error) {
            alert('Error saving FAQ: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
                <form onSubmit={handleSubmit} className="p-8">
                    <h2 className="text-2xl font-display font-bold mb-6">
                        {faq ? 'Edit FAQ' : 'New FAQ'}
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Question</label>
                            <input
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                                value={formData.question}
                                onChange={e => setFormData({ ...formData, question: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Answer</label>
                            <textarea
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary h-32 resize-none"
                                value={formData.answer}
                                onChange={e => setFormData({ ...formData, answer: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Display Order</label>
                            <input
                                type="number"
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                                value={formData.display_order}
                                onChange={e => setFormData({ ...formData, display_order: e.target.value })}
                            />
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
                            {loading ? 'Saving...' : 'Save FAQ'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FAQManager;
