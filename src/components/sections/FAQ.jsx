import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

const FAQ = ({ onOpenContact }) => {
    const [faqs, setFaqs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openIndex, setOpenIndex] = useState(null);

    useEffect(() => {
        const fetchFaqs = async () => {
            try {
                const { data, error } = await supabase.from('faqs').select('*').order('display_order', { ascending: true });
                if (error) throw error;
                if (data) setFaqs(data);
            } catch (error) {
                console.error("Error fetching FAQs:", error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchFaqs();
    }, []);

    return (
        <section className="py-24 bg-background-alt text-text-main-light">
            <div className="container mx-auto px-6 max-w-4xl">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-display font-bold text-primary mb-4">Frequently Asked Questions</h2>
                    <p className="text-text-muted-light">Everything you need to know about your luxary experience.</p>
                </div>

                <div className="space-y-4 mb-16">
                    {faqs.map((faq, index) => (
                        <div key={index} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm transition-all hover:shadow-md">
                            <button
                                onClick={() => setOpenIndex(prev => prev === index ? null : index)}
                                className="w-full text-left p-6 flex justify-between items-center hover:bg-gray-50 transition-colors"
                            >
                                <h3 className="font-bold text-lg">{faq.question}</h3>
                                <span className={`material-symbols-outlined transition-transform duration-300 ${openIndex === index ? "rotate-180 text-primary" : "text-gray-400"}`}>
                                    keyboard_arrow_down
                                </span>
                            </button>
                            <div className={`overflow-hidden transition-all duration-300 ${openIndex === index ? "max-h-48 opacity-100" : "max-h-0 opacity-0"}`}>
                                <div className="p-6 pt-0 text-text-muted-light border-t border-gray-50">
                                    {faq.answer}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Contact CTAs */}
                <div className="bg-white rounded-3xl p-8 md:p-12 text-center shadow-lg border border-gray-50">
                    <h3 className="text-2xl font-bold font-display mb-2">Still have questions?</h3>
                    <p className="text-text-muted-light mb-8">We're here to help you get the best experience.</p>

                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <button onClick={onOpenContact} className="flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 text-primary border border-gray-100 px-8 py-3 rounded-full font-bold transition-all">
                            <span className="material-symbols-outlined">mail</span>
                            Email Us
                        </button>
                        <a href="tel:+15551234567" className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-primary/25 transition-all">
                            <span className="material-symbols-outlined">call</span>
                            Call Now
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FAQ;
