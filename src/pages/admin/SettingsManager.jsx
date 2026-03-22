
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

const SETTINGS_SECTIONS = [
    {
        title: 'Business Info',
        icon: 'store',
        keys: [
            { key: 'salon_name', label: 'Salon Name', type: 'text' },
            { key: 'phone', label: 'Phone', type: 'text' },
            { key: 'email', label: 'Email', type: 'email' }
        ]
    },
    {
        title: 'Location',
        icon: 'location_on',
        keys: [
            { key: 'address', label: 'Address (Greek)', type: 'text' },
            { key: 'address_en', label: 'Address (English)', type: 'text' },
            { key: 'city', label: 'City', type: 'text' },
            { key: 'country', label: 'Country', type: 'text' },
            { key: 'latitude', label: 'Latitude', type: 'text' },
            { key: 'longitude', label: 'Longitude', type: 'text' }
        ]
    },
    {
        title: 'Hours',
        icon: 'schedule',
        keys: [
            { key: 'hours_mon_fri', label: 'Monday - Friday', type: 'text' },
            { key: 'hours_saturday', label: 'Saturday', type: 'text' },
            { key: 'hours_sunday', label: 'Sunday', type: 'text' }
        ]
    },
    {
        title: 'Social Media',
        icon: 'share',
        keys: [
            { key: 'instagram', label: 'Instagram URL', type: 'text' },
            { key: 'facebook', label: 'Facebook URL', type: 'text' },
            { key: 'tiktok', label: 'TikTok URL', type: 'text' }
        ]
    }
];

const SettingsManager = () => {
    const [settings, setSettings] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [savedKey, setSavedKey] = useState(null);

    const fetchSettings = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('business_settings')
            .select('*');

        if (data) {
            const settingsMap = {};
            data.forEach((item) => {
                settingsMap[item.key] = item.value;
            });
            setSettings(settingsMap);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    const handleChange = (key, value) => {
        setSettings((prev) => ({ ...prev, [key]: value }));
    };

    const saveSetting = async (key) => {
        try {
            const { error } = await supabase
                .from('business_settings')
                .upsert({ key, value: settings[key] || '' }, { onConflict: 'key' });

            if (error) throw error;

            setSavedKey(key);
            setTimeout(() => setSavedKey(null), 2000);
        } catch (error) {
            alert('Error saving setting: ' + error.message);
        }
    };

    const saveAll = async () => {
        setSaving(true);

        try {
            const allKeys = SETTINGS_SECTIONS.flatMap((section) =>
                section.keys.map((k) => k.key)
            );

            const upserts = allKeys.map((key) => ({
                key,
                value: settings[key] || ''
            }));

            const { error } = await supabase
                .from('business_settings')
                .upsert(upserts, { onConflict: 'key' });

            if (error) throw error;

            setSavedKey('__all__');
            setTimeout(() => setSavedKey(null), 2000);
        } catch (error) {
            alert('Error saving settings: ' + error.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="text-center py-12">Loading settings...</div>;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-display font-bold text-gray-900">Settings</h1>
                <button
                    onClick={saveAll}
                    disabled={saving}
                    className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold hover:bg-primary-hover transition-colors flex items-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-50"
                >
                    <span className="material-symbols-outlined">
                        {savedKey === '__all__' ? 'check_circle' : 'save'}
                    </span>
                    {saving ? 'Saving...' : savedKey === '__all__' ? 'Saved!' : 'Save All'}
                </button>
            </div>

            <div className="space-y-8">
                {SETTINGS_SECTIONS.map((section) => (
                    <div
                        key={section.title}
                        className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
                    >
                        <div className="bg-gray-50 border-b border-gray-100 px-6 py-4 flex items-center gap-3">
                            <span className="material-symbols-outlined text-primary">{section.icon}</span>
                            <h2 className="text-lg font-bold text-gray-900">{section.title}</h2>
                        </div>

                        <div className="p-6 space-y-4">
                            {section.keys.map(({ key, label, type }) => (
                                <div key={key} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                                    <label className="text-sm font-bold text-gray-700 sm:w-48 shrink-0">
                                        {label}
                                    </label>
                                    <div className="flex-1 flex gap-2">
                                        <input
                                            type={type}
                                            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary bg-gray-50"
                                            value={settings[key] || ''}
                                            onChange={(e) => handleChange(key, e.target.value)}
                                        />
                                        <button
                                            onClick={() => saveSetting(key)}
                                            className={`px-3 py-2 rounded-lg text-sm font-bold transition-colors shrink-0 ${
                                                savedKey === key
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                            title="Save this field"
                                        >
                                            <span className="material-symbols-outlined text-[18px]">
                                                {savedKey === key ? 'check' : 'save'}
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SettingsManager;
