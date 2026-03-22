import React, { useState } from 'react';
import { useLang } from '../../lib/LanguageContext';
import EventBookingModal from '../booking/EventBookingModal';

const upcomingEvents = [
    {
        id: 1,
        titleEn: "Balayage Masterclass",
        titleEl: "Masterclass Balayage",
        descEn: "Learn the latest balayage techniques from industry experts. Perfect for professionals looking to elevate their craft.",
        descEl: "Μάθετε τις τελευταίες τεχνικές balayage από ειδικούς. Ιδανικό για επαγγελματίες που θέλουν να αναβαθμίσουν την τέχνη τους.",
        date: "2026-04-15",
        time: "10:00 - 16:00",
        location: "salon",
        image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&h=400&fit=crop",
        price: "€150",
        spots: 12,
    },
    {
        id: 2,
        titleEn: "Hair Color Trends 2026",
        titleEl: "Τάσεις Χρώματος Μαλλιών 2026",
        descEn: "Discover the hottest color trends for 2026. Live demonstrations and hands-on practice included.",
        descEl: "Ανακαλύψτε τις πιο hot τάσεις χρώματος για το 2026. Περιλαμβάνονται ζωντανές επιδείξεις και πρακτική εξάσκηση.",
        date: "2026-05-20",
        time: "11:00 - 15:00",
        location: "salon",
        image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&h=400&fit=crop",
        price: "€80",
        spots: 20,
    },
    {
        id: 3,
        titleEn: "Bridal Hair Workshop",
        titleEl: "Workshop Νυφικού Χτενίσματος",
        descEn: "Master elegant bridal hairstyles. From classic updos to modern romantic styles — perfect for wedding season prep.",
        descEl: "Κατακτήστε κομψά νυφικά χτενίσματα. Από κλασικά σινιόν μέχρι μοντέρνα ρομαντικά στυλ — ιδανικό για προετοιμασία γαμήλιας σεζόν.",
        date: "2026-06-10",
        time: "10:00 - 14:00",
        location: "salon",
        image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=600&h=400&fit=crop",
        price: "€120",
        spots: 8,
    },
];

const Events = () => {
    const { t, lang } = useLang();
    const [selectedEvent, setSelectedEvent] = useState(null);

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString(lang === 'el' ? 'el-GR' : 'en-US', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    return (
        <>
        <section id="events" className="py-24 bg-background-dark text-white relative overflow-hidden">
            {/* Background decoration */}
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
                    {upcomingEvents.map((event) => (
                        <div
                            key={event.id}
                            className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-[2rem] overflow-hidden hover:bg-white/10 hover:border-white/20 transition-all duration-500 hover:-translate-y-2"
                        >
                            {/* Image */}
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={event.image}
                                    alt={lang === 'el' ? event.titleEl : event.titleEn}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-background-dark to-transparent"></div>

                                {/* Price badge */}
                                <div className="absolute top-4 right-4 bg-gold-accent text-black px-4 py-1.5 rounded-full font-bold text-sm shadow-lg">
                                    {event.price}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 space-y-4">
                                <h3 className="text-xl font-display font-bold text-white group-hover:text-primary transition-colors">
                                    {lang === 'el' ? event.titleEl : event.titleEn}
                                </h3>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    {lang === 'el' ? event.descEl : event.descEn}
                                </p>

                                {/* Details */}
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

                                {/* Limited spots */}
                                <div className="flex items-center gap-2 text-xs text-gold-accent font-bold uppercase tracking-wider pt-2">
                                    <span className="material-symbols-outlined text-sm">group</span>
                                    {t('events.limitedSpots')} — {event.spots} {lang === 'el' ? 'θέσεις' : 'spots'}
                                </div>

                                {/* CTA */}
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
