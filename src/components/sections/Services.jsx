import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useLang } from '../../lib/LanguageContext';

const Services = ({ onOpenBooking }) => {
    const { t } = useLang();
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeService, setActiveService] = useState(0);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const { data, error } = await supabase.from('services').select('*').order('created_at', { ascending: true });
                if (error) throw error;
                if (data) setServices(data);
            } catch (error) {
                console.error("Error fetching services:", error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchServices();
    }, []);

    if (loading || services.length === 0) {
        return <div className="py-24 text-center">{t('services.loading')}</div>;
    }

    return (
        <section id="services" className="py-24 bg-white relative">
            <div className="container mx-auto px-6">
                <div className="text-center mb-20">
                    <h2 className="text-4xl lg:text-5xl font-display font-medium text-text-main tracking-tight">
                        {t('services.title')}
                    </h2>
                    <p className="text-gray-500 mt-3 text-lg font-light tracking-wide max-w-xl mx-auto">
                        {t('services.subtitle')}
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-stretch">
                    <div className="lg:w-1/2 flex flex-col justify-center space-y-2">
                        {services.map((service, index) => (
                            <div
                                key={index}
                                onMouseEnter={() => setActiveService(index)}
                                onClick={() => setActiveService(index)}
                                className={`group p-6 rounded-2xl cursor-pointer transition-all duration-300 border border-transparent ${activeService === index ? 'bg-gray-50 border-gray-100 shadow-sm' : 'hover:bg-white'}`}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className={`text-2xl font-display transition-colors duration-300 ${activeService === index ? 'text-primary' : 'text-gray-800 group-hover:text-primary'} flex items-center gap-3`}>
                                        <span className={`material-symbols-outlined transition-opacity duration-300 ${activeService === index ? 'opacity-100' : 'opacity-0 text-gray-400 -ml-8'} text-2xl`}>
                                            arrow_right_alt
                                        </span>
                                        {service.title}
                                    </h3>
                                    <span className={`font-sans font-medium text-sm transition-colors duration-300 ${activeService === index ? 'text-gold-accent' : 'text-gray-400'}`}>
                                        {service.price}
                                    </span>
                                </div>

                                <div className={`overflow-hidden transition-all duration-500 ease-in-out ${activeService === index ? 'max-h-[600px] opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
                                    <div className="lg:hidden mb-4 rounded-xl overflow-hidden shadow-sm h-48 w-full">
                                        <img src={service.image_url || service.image} alt={service.title} className="w-full h-full object-cover" />
                                    </div>
                                    <p className="text-gray-500 leading-relaxed font-light mb-4">{service.description}</p>
                                    <button onClick={onOpenBooking} className="text-primary text-xs font-bold uppercase tracking-widest border-b border-primary/20 hover:border-primary pb-1 transition-all">
                                        {t('services.bookAppointment')}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="lg:w-1/2 relative min-h-[400px] lg:min-h-[600px] hidden lg:block">
                        <div className="sticky top-24 h-[600px] w-full rounded-[2.5rem] overflow-hidden shadow-2xl">
                            {services.map((service, index) => (
                                <div key={index} className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${activeService === index ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
                                    <img src={service.image_url || service.image} alt={service.title} className="w-full h-full object-cover transform scale-105 transition-transform duration-[2s]" />
                                    <div className="absolute inset-0 bg-black/10"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Services;
