
import React, { useState, useEffect } from 'react';
import ImageUpload from '../../components/admin/ImageUpload';
import { supabase } from '../../lib/supabase';

const BrandsManager = () => {
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentBrand, setCurrentBrand] = useState(null);
    const [deleteId, setDeleteId] = useState(null);

    const fetchBrands = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('brands')
            .select('*')
            .order('display_order', { ascending: true });

        if (data) setBrands(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchBrands();
    }, []);

    const checkDelete = (id) => {
        setDeleteId(id);
    };

    const confirmDelete = async () => {
        if (!deleteId) return;

        try {
            const { error } = await supabase.from('brands').delete().eq('id', deleteId);
            if (error) throw error;

            setDeleteId(null);
            fetchBrands();
        } catch (error) {
            alert('Delete Error: ' + error.message);
        }
    };

    const handleEdit = (brand) => {
        setCurrentBrand(brand);
        setIsModalOpen(true);
    };

    const handleAddNew = () => {
        setCurrentBrand(null);
        setIsModalOpen(true);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-display font-bold text-gray-900">Brands Management</h1>
                <button
                    onClick={handleAddNew}
                    className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold hover:bg-primary-hover transition-colors flex items-center gap-2 shadow-lg shadow-primary/20"
                >
                    <span className="material-symbols-outlined">add</span>
                    Add New Brand
                </button>
            </div>

            {loading ? (
                <div className="text-center py-12">Loading brands...</div>
            ) : (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="p-6 font-bold text-gray-700">Logo</th>
                                <th className="p-6 font-bold text-gray-700">Name</th>
                                <th className="p-6 font-bold text-gray-700">Order</th>
                                <th className="p-6 font-bold text-gray-700">Active</th>
                                <th className="p-6 font-bold text-gray-700 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {brands.map((brand) => (
                                <tr key={brand.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="p-6">
                                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center p-2">
                                            {brand.logo_url ? (
                                                <img
                                                    src={brand.logo_url}
                                                    alt={brand.name}
                                                    className="w-full h-full object-contain"
                                                />
                                            ) : (
                                                <span className="material-symbols-outlined text-gray-400">branding_watermark</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-6 font-medium text-gray-900">{brand.name}</td>
                                    <td className="p-6 text-gray-500">{brand.display_order}</td>
                                    <td className="p-6">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${brand.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                            {brand.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="p-6 text-right space-x-2">
                                        <button
                                            onClick={() => handleEdit(brand)}
                                            className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors"
                                            title="Edit"
                                        >
                                            <span className="material-symbols-outlined text-[20px]">edit</span>
                                        </button>
                                        <button
                                            onClick={() => checkDelete(brand.id)}
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

                    {brands.length === 0 && (
                        <div className="p-12 text-center text-gray-500">
                            No brands found. Click "Add New Brand" to create one.
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
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Brand?</h3>
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
                <BrandModal
                    brand={currentBrand}
                    onClose={() => setIsModalOpen(false)}
                    onRefresh={fetchBrands}
                />
            )}
        </div>
    );
};

const BrandModal = ({ brand, onClose, onRefresh }) => {
    const [formData, setFormData] = useState({
        name: '',
        logo_url: '',
        website_url: '',
        display_order: 0,
        is_active: true
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (brand) {
            setFormData({
                name: brand.name || '',
                logo_url: brand.logo_url || '',
                website_url: brand.website_url || '',
                display_order: brand.display_order || 0,
                is_active: brand.is_active !== undefined ? brand.is_active : true
            });
        }
    }, [brand]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                ...formData,
                display_order: Number(formData.display_order)
            };

            if (brand) {
                const { error } = await supabase.from('brands').update(payload).eq('id', brand.id);
                if (error) throw error;
            } else {
                const { error } = await supabase.from('brands').insert([payload]);
                if (error) throw error;
            }
            onRefresh();
            onClose();
        } catch (error) {
            alert('Error saving brand: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
                <form onSubmit={handleSubmit} className="p-8">
                    <h2 className="text-2xl font-display font-bold mb-6">
                        {brand ? 'Edit Brand' : 'New Brand'}
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Brand Name</label>
                            <input
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <ImageUpload
                                currentImage={formData.logo_url}
                                onUpload={(url) => setFormData({ ...formData, logo_url: url })}
                                label="Brand Logo"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Website URL</label>
                            <input
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                                value={formData.website_url}
                                onChange={e => setFormData({ ...formData, website_url: e.target.value })}
                                placeholder="https://..."
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
                            {loading ? 'Saving...' : 'Save Brand'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BrandsManager;
