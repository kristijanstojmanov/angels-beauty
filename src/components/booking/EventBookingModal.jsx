import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { useLang } from '../../lib/LanguageContext';

const EventBookingModal = ({ isOpen, onClose, event }) => {
    const { t, lang } = useLang();
    const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', phone: '', tickets: 1, notes: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const onCloseRef = useRef(onClose);

    // Keep ref current to avoid stale closure in popstate handler
    useEffect(() => { onCloseRef.current = onClose; }, [onClose]);

    useEffect(() => {
        if (isOpen) {
            setIsSuccess(false);
            setFormData({ firstName: '', lastName: '', email: '', phone: '', tickets: 1, notes: '' });

            window.history.pushState({ modalOpen: true }, '');
            const handlePopState = () => { onCloseRef.current(); };
            window.addEventListener('popstate', handlePopState);
            return () => {
                window.removeEventListener('popstate', handlePopState);
                if (window.history.state?.modalOpen) {
                    window.history.back();
                }
            };
        }
    }, [isOpen]);

    if (!isOpen || !event) return null;

    const eventTitle = lang === 'el' ? (event.title_el || event.title_en) : event.title_en;
    const eventDesc = lang === 'el' ? (event.description_el || event.description_en) : event.description_en;
    const eventPrice = Number(event.price) || 0;
    const priceDisplay = eventPrice === 0 ? t('events.free') : `€${eventPrice}`;

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString(lang === 'el' ? 'el-GR' : 'en-US', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const registrationData = {
            service_name: eventTitle,
            service_price: priceDisplay,
            customer_name: `${formData.firstName} ${formData.lastName}`,
            customer_email: formData.email,
            customer_phone: formData.phone,
            appointment_date: event.date,
            appointment_time: event.time,
            status: 'pending',
            notes: `Event Registration | Tickets: ${formData.tickets}${formData.notes ? ' | Notes: ' + formData.notes : ''}`,
        };

        const { error } = await supabase.from('appointments').insert([registrationData]);

        setIsSubmitting(false);
        if (error) {
            alert('Error: ' + error.message);
        } else {
            setIsSuccess(true);
        }
    };

    const handleChange = (field) => (e) => setFormData(prev => ({ ...prev, [field]: e.target.value }));

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose}></div>

            <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-[2.5rem] overflow-hidden shadow-2xl relative flex flex-col animate-fade-in-up">
                {/* Event Header with Image */}
                <div className="relative h-48 md:h-56 overflow-hidden flex-shrink-0">
                    <img
                        src={event.image_url}
                        alt={eventTitle}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40 flex items-center justify-center transition-all z-20"
                    >
                        <span className="material-symbols-outlined text-white">close</span>
                    </button>

                    <div className="absolute bottom-6 left-6 right-6 text-white">
                        <div className="inline-block bg-gold-accent text-black px-3 py-1 rounded-full font-bold text-xs mb-2">
                            {priceDisplay}
                        </div>
                        <h2 className="text-2xl md:text-3xl font-display font-bold">{eventTitle}</h2>
                        <p className="text-white/70 text-sm mt-1">{eventDesc}</p>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 md:p-8">
                    {!isSuccess ? (
                        <div className="space-y-6">
                            {/* Event Details */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                                    <span className="material-symbols-outlined text-primary">calendar_today</span>
                                    <div>
                                        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">{t('eventBooking.dateTime')}</p>
                                        <p className="text-sm font-bold text-gray-800">{formatDate(event.date)}</p>
                                        <p className="text-xs text-gray-500">{event.time}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                                    <span className="material-symbols-outlined text-primary">location_on</span>
                                    <div>
                                        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">{t('events.location')}</p>
                                        <p className="text-sm font-bold text-gray-800">{t('events.atSalon')}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                                    <span className="material-symbols-outlined text-primary">group</span>
                                    <div>
                                        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">{t('events.limitedSpots')}</p>
                                        <p className="text-sm font-bold text-gray-800">{event.spots} {t('eventBooking.spotsLeft')}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Registration Form */}
                            <div>
                                <h3 className="text-lg font-display font-bold text-gray-900 mb-4">{t('eventBooking.yourDetails')}</h3>
                                <form className="space-y-3" onSubmit={handleSubmit}>
                                    <div className="grid grid-cols-2 gap-3">
                                        <input
                                            type="text"
                                            placeholder={t('eventBooking.firstName')}
                                            className="w-full p-3.5 rounded-xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-primary outline-none transition-all text-sm"
                                            value={formData.firstName}
                                            onChange={handleChange('firstName')}
                                            required
                                        />
                                        <input
                                            type="text"
                                            placeholder={t('eventBooking.lastName')}
                                            className="w-full p-3.5 rounded-xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-primary outline-none transition-all text-sm"
                                            value={formData.lastName}
                                            onChange={handleChange('lastName')}
                                            required
                                        />
                                    </div>
                                    <input
                                        type="email"
                                        placeholder={t('eventBooking.emailAddress')}
                                        className="w-full p-3.5 rounded-xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-primary outline-none transition-all text-sm"
                                        value={formData.email}
                                        onChange={handleChange('email')}
                                        required
                                    />
                                    <input
                                        type="tel"
                                        placeholder={t('eventBooking.phoneNumber')}
                                        className="w-full p-3.5 rounded-xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-primary outline-none transition-all text-sm"
                                        value={formData.phone}
                                        onChange={handleChange('phone')}
                                        required
                                    />

                                    <div>
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">{t('eventBooking.numberOfTickets')}</label>
                                        <div className="flex items-center gap-3">
                                            <button
                                                type="button"
                                                onClick={() => setFormData(prev => ({ ...prev, tickets: Math.max(1, prev.tickets - 1) }))}
                                                className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all"
                                            >
                                                <span className="material-symbols-outlined text-sm">remove</span>
                                            </button>
                                            <span className="text-xl font-bold w-8 text-center">{formData.tickets}</span>
                                            <button
                                                type="button"
                                                onClick={() => setFormData(prev => ({ ...prev, tickets: Math.min(event.spots, prev.tickets + 1) }))}
                                                className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all"
                                            >
                                                <span className="material-symbols-outlined text-sm">add</span>
                                            </button>
                                            <span className="text-sm text-gray-400">
                                                {formData.tickets === 1 ? t('eventBooking.ticket') : t('eventBooking.tickets')}
                                            </span>
                                        </div>
                                    </div>

                                    <textarea
                                        placeholder={t('eventBooking.specialRequirements')}
                                        className="w-full p-3.5 rounded-xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-primary outline-none transition-all text-sm resize-none h-20"
                                        value={formData.notes}
                                        onChange={handleChange('notes')}
                                    />

                                    {/* Total */}
                                    <div className="flex justify-between items-center bg-primary/5 rounded-xl p-4">
                                        <span className="font-bold text-gray-600">{t('eventBooking.price')}</span>
                                        <span className="text-2xl font-display font-bold text-primary">
                                            {eventPrice === 0 ? t('events.free') : `€${eventPrice * formData.tickets}`}
                                        </span>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-4 rounded-xl shadow-xl shadow-primary/30 transition-all hover:scale-[1.02] disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        <span className="material-symbols-outlined">event_available</span>
                                        {isSubmitting ? t('eventBooking.registering') : t('eventBooking.registerNow')}
                                    </button>
                                </form>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center text-center py-8 space-y-5">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                                <span className="material-symbols-outlined text-4xl text-green-600">celebration</span>
                            </div>
                            <h3 className="text-2xl font-display font-bold text-gray-900">{t('eventBooking.registrationConfirmed')}</h3>
                            <p className="text-gray-500 max-w-sm">
                                {t('eventBooking.thankYou')} <strong>{formData.firstName}</strong>! {t('eventBooking.yourSpotFor')} <strong>{eventTitle}</strong> {t('eventBooking.hasBeenReserved')}
                            </p>
                            <p className="text-sm text-gray-400">{t('eventBooking.confirmationSentTo')} {formData.email}</p>
                            <button
                                onClick={onClose}
                                className="px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-hover shadow-lg transition-all"
                            >
                                {t('eventBooking.done')}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EventBookingModal;
