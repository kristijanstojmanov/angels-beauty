
import React, { useState, useEffect } from 'react';
import ImageUpload from '../../components/admin/ImageUpload';
import { supabase } from '../../lib/supabase';

const ProductsManager = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);

    const fetchProducts = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('id', { ascending: true });

        if (data) setProducts(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            const { error } = await supabase.from('products').delete().eq('id', id);
            if (!error) fetchProducts();
        }
    };

    const handleEdit = (product) => {
        setCurrentProduct(product);
        setIsModalOpen(true);
    };

    const handleAddNew = () => {
        setCurrentProduct(null);
        setIsModalOpen(true);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-display font-bold text-gray-900">Products Management</h1>
                <button
                    onClick={handleAddNew}
                    className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold hover:bg-primary-hover transition-colors flex items-center gap-2 shadow-lg shadow-primary/20"
                >
                    <span className="material-symbols-outlined">add</span>
                    Add New Product
                </button>
            </div>

            {loading ? (
                <div className="text-center py-12">Loading products...</div>
            ) : (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="p-6 font-bold text-gray-700">Image</th>
                                <th className="p-6 font-bold text-gray-700">Name</th>
                                <th className="p-6 font-bold text-gray-700">Price</th>
                                <th className="p-6 font-bold text-gray-700">Category</th>
                                <th className="p-6 font-bold text-gray-700 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {products.map((product) => (
                                <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="p-6">
                                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                                            <img
                                                src={product.image_url || product.image}
                                                alt={product.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </td>
                                    <td className="p-6 font-medium text-gray-900">{product.name}</td>
                                    <td className="p-6 text-gray-600">€{product.price}</td>
                                    <td className="p-6 text-gray-500 capitalize">{product.category}</td>
                                    <td className="p-6 text-right space-x-2">
                                        <button
                                            onClick={() => handleEdit(product)}
                                            className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors"
                                            title="Edit"
                                        >
                                            <span className="material-symbols-outlined text-[20px]">edit</span>
                                        </button>
                                        <button
                                            onClick={() => handleDelete(product.id)}
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
                    {products.length === 0 && (
                        <div className="p-12 text-center text-gray-500">No products found.</div>
                    )}
                </div>
            )}

            {isModalOpen && (
                <ProductModal
                    product={currentProduct}
                    onClose={() => setIsModalOpen(false)}
                    onRefresh={fetchProducts}
                />
            )}
        </div>
    );
};

const ProductModal = ({ product, onClose, onRefresh }) => {
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        category: 'haircare',
        description: '',
        image_url: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name || '',
                price: product.price || '',
                category: product.category || 'haircare',
                description: product.description || '',
                image_url: product.image_url || product.image || ''
            });
        }
    }, [product]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (product) {
                const { error } = await supabase.from('products').update(formData).eq('id', product.id);
                if (error) throw error;
            } else {
                const { error } = await supabase.from('products').insert([formData]);
                if (error) throw error;
            }
            onRefresh();
            onClose();
        } catch (error) {
            alert('Error saving product: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
                <form onSubmit={handleSubmit} className="p-8">
                    <h2 className="text-2xl font-display font-bold mb-6">
                        {product ? 'Edit Product' : 'New Product'}
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Product Name</label>
                            <input
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Price (€)</label>
                                <input
                                    type="number"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                                    value={formData.price}
                                    onChange={e => setFormData({ ...formData, price: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Category</label>
                                <select
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                                    value={formData.category}
                                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                                >
                                    <option value="haircare">Haircare</option>
                                    <option value="styling">Styling</option>
                                    <option value="accessories">Accessories</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <ImageUpload
                                currentImage={formData.image_url}
                                onUpload={(url) => setFormData({ ...formData, image_url: url })}
                                label="Product Image"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                            <textarea
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary h-24 resize-none"
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
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
                            {loading ? 'Saving...' : 'Save Product'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductsManager;
