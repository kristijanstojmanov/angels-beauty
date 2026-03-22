
import React, { useState, useEffect } from 'react';
import ImageUpload from '../../components/admin/ImageUpload';
import { supabase } from '../../lib/supabase';

const StylistManager = () => {
    const [stylists, setStylists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentStylist, setCurrentStylist] = useState(null);
    const [deleteId, setDeleteId] = useState(null);

    const fetchStylists = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('stylists')
            .select('*')
            .order('id', { ascending: true });

        if (data) setStylists(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchStylists();
    }, []);

    const checkDelete = (id) => {
        setDeleteId(id);
    };

    const confirmDelete = async () => {
        if (!deleteId) return;

        try {
            const { error } = await supabase.from('stylists').delete().eq('id', deleteId);
            if (error) throw error;

            setDeleteId(null);
            fetchStylists();
        } catch (error) {
            alert('Delete Error: ' + error.message);
        }
    };

    const handleEdit = (stylist) => {
        setCurrentStylist(stylist);
        setIsModalOpen(true);
    };

    const handleAddNew = () => {
        setCurrentStylist(null);
        setIsModalOpen(true);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-display font-bold text-gray-900">Stylists Management</h1>
                <button
                    onClick={handleAddNew}
                    className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold hover:bg-primary-hover transition-colors flex items-center gap-2 shadow-lg shadow-primary/20"
                >
                    <span className="material-symbols-outlined">add</span>
                    Add New Stylist
                </button>
            </div>

            {loading ? (
                <div className="text-center py-12">Loading stylists...</div>
            ) : (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="p-6 font-bold text-gray-700">Image</th>
                                <th className="p-6 font-bold text-gray-700">Name</th>
                                <th className="p-6 font-bold text-gray-700">Role</th>
                                <th className="p-6 font-bold text-gray-700">Experience</th>
                                <th className="p-6 font-bold text-gray-700">Main</th>
                                <th className="p-6 font-bold text-gray-700 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {stylists.map((stylist) => (
                                <tr key={stylist.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="p-6">
                                        <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 border border-gray-200">
                                            {stylist.image_url ? (
                                                <img
                                                    src={stylist.image_url}
                                                    alt={stylist.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                    <span className="material-symbols-outlined">person</span>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-6 font-medium text-gray-900">{stylist.name}</td>
                                    <td className="p-6 text-gray-600">{stylist.role_en || '—'}</td>
                                    <td className="p-6 text-gray-500">
                                        {stylist.experience_years ? `${stylist.experience_years} years` : '—'}
                                    </td>
                                    <td className="p-6">
                                        {stylist.is_main && (
                                            <span className="px-2 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary">
                                                Main
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-6 text-right space-x-2">
                                        <button
                                            onClick={() => handleEdit(stylist)}
                                            className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors"
                                            title="Edit"
                                        >
                                            <span className="material-symbols-outlined text-[20px]">edit</span>
                                        </button>
                                        <button
                                            onClick={() => checkDelete(stylist.id)}
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

                    {stylists.length === 0 && (
                        <div className="p-12 text-center text-gray-500">
                            No stylists found. Click "Add New Stylist" to create one.
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
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Stylist?</h3>
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
                <StylistModal
                    stylist={currentStylist}
                    onClose={() => setIsModalOpen(false)}
                    onRefresh={fetchStylists}
                />
            )}
        </div>
    );
};

const arrayToString = (arr) => {
    if (Array.isArray(arr)) return arr.join(', ');
    if (typeof arr === 'string') return arr;
    return '';
};

const stringToArray = (str) => {
    if (!str) return [];
    return str.split(',').map((s) => s.trim()).filter(Boolean);
};

const StylistModal = ({ stylist, onClose, onRefresh }) => {
    const [formData, setFormData] = useState({
        name: '',
        role_en: '',
        role_el: '',
        bio_en: '',
        bio_el: '',
        experience_years: '',
        specialties_en: '',
        specialties_el: '',
        certifications_en: '',
        certifications_el: '',
        image_url: '',
        is_main: false
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (stylist) {
            setFormData({
                name: stylist.name || '',
                role_en: stylist.role_en || '',
                role_el: stylist.role_el || '',
                bio_en: stylist.bio_en || '',
                bio_el: stylist.bio_el || '',
                experience_years: stylist.experience_years || '',
                specialties_en: arrayToString(stylist.specialties_en),
                specialties_el: arrayToString(stylist.specialties_el),
                certifications_en: arrayToString(stylist.certifications_en),
                certifications_el: arrayToString(stylist.certifications_el),
                image_url: stylist.image_url || '',
                is_main: stylist.is_main || false
            });
        }
    }, [stylist]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                name: formData.name,
                role_en: formData.role_en,
                role_el: formData.role_el,
                bio_en: formData.bio_en,
                bio_el: formData.bio_el,
                experience_years: formData.experience_years ? Number(formData.experience_years) : null,
                specialties_en: stringToArray(formData.specialties_en),
                specialties_el: stringToArray(formData.specialties_el),
                certifications_en: stringToArray(formData.certifications_en),
                certifications_el: stringToArray(formData.certifications_el),
                image_url: formData.image_url,
                is_main: formData.is_main
            };

            if (stylist) {
                const { error } = await supabase.from('stylists').update(payload).eq('id', stylist.id);
                if (error) throw error;
            } else {
                const { error } = await supabase.from('stylists').insert([payload]);
                if (error) throw error;
            }
            onRefresh();
            onClose();
        } catch (error) {
            alert('Error saving stylist: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
                <form onSubmit={handleSubmit} className="p-8">
                    <h2 className="text-2xl font-display font-bold mb-6">
                        {stylist ? 'Edit Stylist' : 'New Stylist'}
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Name</label>
                            <input
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Role (English)</label>
                                <input
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                                    value={formData.role_en}
                                    onChange={e => setFormData({ ...formData, role_en: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Role (Greek)</label>
                                <input
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                                    value={formData.role_el}
                                    onChange={e => setFormData({ ...formData, role_el: e.target.value })}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Experience (years)</label>
                            <input
                                type="number"
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                                value={formData.experience_years}
                                onChange={e => setFormData({ ...formData, experience_years: e.target.value })}
                            />
                        </div>
                        <div>
                            <ImageUpload
                                currentImage={formData.image_url}
                                onUpload={(url) => setFormData({ ...formData, image_url: url })}
                                label="Stylist Photo"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Bio (English)</label>
                            <textarea
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary h-24 resize-none"
                                value={formData.bio_en}
                                onChange={e => setFormData({ ...formData, bio_en: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Bio (Greek)</label>
                            <textarea
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary h-24 resize-none"
                                value={formData.bio_el}
                                onChange={e => setFormData({ ...formData, bio_el: e.target.value })}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Specialties (English)</label>
                                <input
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                                    value={formData.specialties_en}
                                    onChange={e => setFormData({ ...formData, specialties_en: e.target.value })}
                                    placeholder="e.g. Balayage, Color, Cuts"
                                />
                                <p className="text-xs text-gray-400 mt-1">Comma-separated</p>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Specialties (Greek)</label>
                                <input
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                                    value={formData.specialties_el}
                                    onChange={e => setFormData({ ...formData, specialties_el: e.target.value })}
                                    placeholder="Comma-separated"
                                />
                                <p className="text-xs text-gray-400 mt-1">Comma-separated</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Certifications (English)</label>
                                <input
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                                    value={formData.certifications_en}
                                    onChange={e => setFormData({ ...formData, certifications_en: e.target.value })}
                                    placeholder="Comma-separated"
                                />
                                <p className="text-xs text-gray-400 mt-1">Comma-separated</p>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Certifications (Greek)</label>
                                <input
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                                    value={formData.certifications_el}
                                    onChange={e => setFormData({ ...formData, certifications_el: e.target.value })}
                                    placeholder="Comma-separated"
                                />
                                <p className="text-xs text-gray-400 mt-1">Comma-separated</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <label className="text-sm font-bold text-gray-700">Main Stylist</label>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, is_main: !formData.is_main })}
                                className={`relative w-12 h-6 rounded-full transition-colors ${formData.is_main ? 'bg-primary' : 'bg-gray-300'}`}
                            >
                                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${formData.is_main ? 'translate-x-6' : ''}`} />
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
                            {loading ? 'Saving...' : 'Save Stylist'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default StylistManager;
