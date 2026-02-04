
import React, { useState } from 'react';
import ReactDOM from 'react-dom';

const ContactModal = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [submitted, setSubmitted] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simulate submission
        setTimeout(() => {
            setSubmitted(true);
            setTimeout(() => {
                setSubmitted(false);
                setFormData({ name: '', email: '', message: '' });
                onClose();
            }, 2000);
        }, 1000);
    };

    return ReactDOM.createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

            <div className="relative bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-scale-in">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-all"
                >
                    <span className="material-symbols-outlined">close</span>
                </button>

                {!submitted ? (
                    <>
                        <h3 className="text-2xl font-display font-bold text-primary mb-2">Get in Touch</h3>
                        <p className="text-gray-500 mb-6 text-sm">Fill out the form below and we'll get back to you shortly.</p>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:outline-none focus:border-primary transition-colors font-sans"
                                    placeholder="Your Name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:outline-none focus:border-primary transition-colors font-sans"
                                    placeholder="hello@example.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Message</label>
                                <textarea
                                    required
                                    rows="4"
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:outline-none focus:border-primary transition-colors font-sans resize-none"
                                    placeholder="How can we help?"
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                ></textarea>
                            </div>

                            <button type="submit" className="w-full bg-primary text-white font-bold py-3.5 rounded-full hover:bg-primary-hover shadow-lg shadow-primary/25 transition-all mt-2">
                                Send Message
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="material-symbols-outlined text-3xl">check</span>
                        </div>
                        <h3 className="text-2xl font-display font-bold text-primary mb-2">Message Sent!</h3>
                        <p className="text-gray-500">We'll be in touch soon.</p>
                    </div>
                )}
            </div>
        </div>,
        document.body
    );
};

export default ContactModal;
