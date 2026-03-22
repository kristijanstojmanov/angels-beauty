import React, { useState, useEffect } from 'react';
import { useLang } from '../../lib/LanguageContext';
import { supabase } from '../../lib/supabase';
import EventBookingModal from '../booking/EventBookingModal';

const Events = () => {
    const { t, lang } = useLang();
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const fetchEvents = async () => {
            const { data } = await supabase
                .from('events')
                .select('*')
                .gte('date', new Date().toISOString().split('T')[0])
                .order('date', { ascending: true });
            if (data) {
                setEvents(data.map(e => ({
                    id: e.id,
                    titleEn: e.title_en,
                    titleEl: e.title_el || e.title_en,
                    descEn: e.description_en,
                    descEl: e.description_el || e.description_en,
                    date: e.date,
                    time: e.time,
                    location: e.location,
                    image: e.image_url,
                    price: `€${e.price}`,
                    spots: e.spots,
                })));
            }
        };
        fetchEvents();
    }, []);

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString(lang === 'el' ? 'el-GR' : 'en-US', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    if (events.length === 0) return null;

    return (
        <>
        <section id="events" className="py-24 bg-background-dark text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-gold-accent/5 rounded-full blur-3xl"></div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-4xl lg:text-5xl font-display font-medium text-primary tracking-tight">
                        {t('events.title')}
                    </h2>
                    <p className="text-gray-400 mt-2 tracking-wide">
                        {t('events.subtitle')}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {events.map((event) => (
                        <div
                            key={event.id}
                            className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-[2rem] overflow-hidden hover:bg-white/10 hover:border-white/20 transition-all duration-500 hover:-translate-y-2"
                        >
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={event.image}
                                    alt={lang === 'el' ? event.titleEl : event.titleEn}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-background-dark to-transparent"></div>
                                <div className="absolute top-4 right-4 bg-gold-accent text-black px-4 py-1.5 rounded-full font-bold text-sm shadow-lg">
                                    {event.price}
                                </div>
                            </div>

                            <div className="p-6 space-y-4">
                                <h3 className="text-xl font-display font-bold text-white group-hover:text-primary transition-colors">
                                    {lang === 'el' ? event.titleEl : event.titleEn}
                                </h3>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    {lang === 'el' ? event.descEl : event.descEn}
                                </p>

                                <div className="space-y-2 pt-2">
                                    <div className="flex items-center gap-2 text-sm text-gray-300">
                                        <span className="material-symbols-outlined text-primary text-base">calendar_today</span>
                                        {formatDate(event.date)}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-300">
                                        <span className="material-symbols-outlined text-primary text-base">schedule</span>
                                        {event.time}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-300">
                                        <span className="material-symbols-outlined text-primary text-base">location_on</span>
                                        {t('events.atSalon')}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 text-xs text-gold-accent font-bold uppercase tracking-wider pt-2">
                                    <span className="material-symbols-outlined text-sm">group</span>
                                    {t('events.limitedSpots')} — {event.spots} {lang === 'el' ? 'θέσεις' : 'spots'}
                                </div>

                                <button
                                    onClick={() => setSelectedEvent(event)}
                                    className="w-full mt-2 bg-white/10 hover:bg-primary border border-white/20 hover:border-primary text-white py-3 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2"
                                >
                                    <span className="material-symbols-outlined text-sm">event</span>
                                    {t('events.bookSpot')}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>

            <EventBookingModal
                isOpen={!!selectedEvent}
                onClose={() => setSelectedEvent(null)}
                event={selectedEvent}
            />
        </>
    );
};

export default Events;
