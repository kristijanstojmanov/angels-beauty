
import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';

const ImageUpload = ({ onUpload, currentImage, label = "Image" }) => {
    const [uploading, setUploading] = useState(false);

    // Function to handle the file upload
    const uploadImage = async (event) => {
        try {
            setUploading(true);
            const file = event.target.files[0];
            if (!file) return;

            // 1. Create a unique file name
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            // 2. Upload to Supabase Storage (Bucket: 'images')
            const { error: uploadError } = await supabase.storage
                .from('images') // User must create this bucket
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            // 3. Get the Public URL
            const { data } = supabase.storage
                .from('images')
                .getPublicUrl(filePath);

            if (data) {
                onUpload(data.publicUrl); // Pass the URL back to parent
            }

        } catch (error) {
            alert('Error uploading image: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="mb-4">
            <label className="block text-sm font-bold text-gray-700 mb-2">{label}</label>

            <div className="flex items-center gap-4">
                {/* Preview */}
                <div className="w-24 h-24 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden flex-shrink-0 relative group">
                    {currentImage ? (
                        <img
                            src={currentImage}
                            alt="Preview"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <span className="material-symbols-outlined">image</span>
                        </div>
                    )}
                    {/* Overlay loading spinner */}
                    {uploading && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    )}
                </div>

                {/* Upload Button */}
                <div className="flex-1">
                    <input
                        type="file"
                        id="single"
                        accept="image/*"
                        onChange={uploadImage}
                        disabled={uploading}
                        className="block w-full text-sm text-gray-500
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-full file:border-0
                            file:text-sm file:font-semibold
                            file:bg-primary file:text-white
                            hover:file:bg-primary-hover
                            cursor-pointer"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                        {uploading ? 'Uploading...' : 'Upload from your computer (Max 2MB recommended)'}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ImageUpload;
