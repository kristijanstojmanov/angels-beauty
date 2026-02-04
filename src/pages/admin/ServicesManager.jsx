
import React, { useState, useEffect } from 'react';
import ImageUpload from '../../components/admin/ImageUpload';
import { supabase } from '../../lib/supabase';

const ServicesManager = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentService, setCurrentService] = useState(null); // null = creating new
    const [deleteId, setDeleteId] = useState(null);

    // Fetch Services
    const fetchServices = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('services')
            .select('*')
            .order('id', { ascending: true });

        if (data) setServices(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchServices();
    }, []);

    const checkDelete = (id) => {
        setDeleteId(id);
    };

    const confirmDelete = async () => {
        if (!deleteId) return;

        try {
            const { error } = await supabase.from('services').delete().eq('id', deleteId);
            if (error) throw error;

            setDeleteId(null);
            fetchServices();
        } catch (error) {
            alert('Delete Error: ' + error.message);
        }
    };

    const handleEdit = (service) => {
        setCurrentService(service);
        setIsModalOpen(true);
    };

    const handleAddNew = () => {
        setCurrentService(null);
        setIsModalOpen(true);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-display font-bold text-gray-900">Services Management</h1>
                <button
                    onClick={handleAddNew}
                    className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold hover:bg-primary-hover transition-colors flex items-center gap-2 shadow-lg shadow-primary/20"
                >
                    <span className="material-symbols-outlined">add</span>
                    Add New Service
                </button>
            </div>

            {loading ? (
                <div className="text-center py-12">Loading services...</div>
            ) : (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="p-6 font-bold text-gray-700">Image</th>
                                <th className="p-6 font-bold text-gray-700">Title</th>
                                <th className="p-6 font-bold text-gray-700">Price</th>
                                <th className="p-6 font-bold text-gray-700">Duration</th>
                                <th className="p-6 font-bold text-gray-700 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {services.map((service) => (
                                <tr key={service.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="p-6">
                                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                                            <img
                                                src={service.image_url || service.image}
                                                alt={service.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </td>
                                    <td className="p-6 font-medium text-gray-900">{service.title}</td>
                                    <td className="p-6 text-gray-600">€{service.price}</td>
                                    <td className="p-6 text-gray-500">{service.duration}</td>
                                    <td className="p-6 text-right space-x-2">
                                        <button
                                            onClick={() => handleEdit(service)}
                                            className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors"
                                            title="Edit"
                                        >
                                            <span className="material-symbols-outlined text-[20px]">edit</span>
                                        </button>
                                        <button
                                            onClick={() => checkDelete(service.id)}
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

                    {services.length === 0 && (
                        <div className="p-12 text-center text-gray-500">
                            No services found. Click "Add New Service" to create one.
                        </div>
                    )}
                </div>
            )}

            {/* Modal Placeholder */}
            {/* Delete Confirmation Modal */}
            {deleteId && (
                <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="material-symbols-outlined text-3xl text-red-600">delete</span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Service?</h3>
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
                <ServiceModal
                    service={currentService}
                    onClose={() => setIsModalOpen(false)}
                    onRefresh={fetchServices}
                />
            )}
        </div>
    );
};

const ServiceModal = ({ service, onClose, onRefresh }) => {
    const [formData, setFormData] = useState({
        title: '',
        price: '',
        duration: '',
        description: '',
        image_url: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (service) {
            setFormData({
                title: service.title || '',
                price: service.price || '',
                duration: service.duration || '',
                description: service.description || '',
                image_url: service.image_url || service.image || ''
            });
        }
    }, [service]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (service) {
                // Update
                const { error } = await supabase
                    .from('services')
                    .update(formData)
                    .eq('id', service.id);
                if (error) throw error;
            } else {
                // Create
                const { error } = await supabase
                    .from('services')
                    .insert([formData]);
                if (error) throw error;
            }
            onRefresh();
            onClose();
        } catch (error) {
            alert('Error saving service: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
                <form onSubmit={handleSubmit} className="p-8">
                    <h2 className="text-2xl font-display font-bold mb-6">
                        {service ? 'Edit Service' : 'New Service'}
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Service Title</label>
                            <input
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
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
                                <label className="block text-sm font-bold text-gray-700 mb-1">Duration</label>
                                <input
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                                    value={formData.duration}
                                    onChange={e => setFormData({ ...formData, duration: e.target.value })}
                                    placeholder="e.g. 1h 30m"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <ImageUpload
                                currentImage={formData.image_url}
                                onUpload={(url) => setFormData({ ...formData, image_url: url })}
                                label="Service Image"
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
                            {loading ? 'Saving...' : 'Save Service'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ServicesManager;
