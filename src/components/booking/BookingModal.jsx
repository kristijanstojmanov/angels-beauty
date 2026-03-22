import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { useLang } from '../../lib/LanguageContext';

const timeSlots = ["09:00", "10:00", "11:30", "13:00", "14:30", "16:00", "17:30"];

const BookingModal = ({ isOpen, onClose }) => {
    const { t, lang } = useLang();
    const [step, setStep] = useState(1);
    const [selectedService, setSelectedService] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [services, setServices] = useState([]);

    const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', phone: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const [currentMonth, setCurrentMonth] = useState(new Date());
    const onCloseRef = useRef(onClose);

    useEffect(() => { onCloseRef.current = onClose; }, [onClose]);

    useEffect(() => {
        if (isOpen) {
            setStep(1);
            setIsSuccess(false);
            setFormData({ firstName: '', lastName: '', email: '', phone: '' });
            setSelectedService(null);
            setSelectedDate(null);
            setSelectedTime(null);
            fetchServices();

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

    const fetchServices = async () => {
        const { data } = await supabase.from('services').select('*').order('created_at', { ascending: true });
        if (data) setServices(data);
    };

    if (!isOpen) return null;

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const days = [];
        for (let i = 0; i < firstDayOfMonth; i++) days.push(null);
        for (let i = 1; i <= daysInMonth; i++) days.push(new Date(year, month, i));
        return days;
    };

    const calendarDays = getDaysInMonth(currentMonth);

    const monthNames = lang === 'el'
        ? ["Ιανουάριος", "Φεβρουάριος", "Μάρτιος", "Απρίλιος", "Μάιος", "Ιούνιος", "Ιούλιος", "Αύγουστος", "Σεπτέμβριος", "Οκτώβριος", "Νοέμβριος", "Δεκέμβριος"]
        : ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const dayLabels = lang === 'el'
        ? ['Κυ', 'Δε', 'Τρ', 'Τε', 'Πε', 'Πα', 'Σα']
        : ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const isDateSelectable = (date) => date && date >= today;
    const isSelected = (date) => {
        if (!date || !selectedDate) return false;
        return date.getDate() === selectedDate.getDate() && date.getMonth() === selectedDate.getMonth() && date.getFullYear() === selectedDate.getFullYear();
    };

    const changeMonth = (offset) => {
        const newMonth = new Date(currentMonth);
        newMonth.setMonth(newMonth.getMonth() + offset);
        setCurrentMonth(newMonth);
    };

    const handleNext = () => {
        if (step === 1 && selectedService) setStep(2);
        if (step === 2 && selectedDate && selectedTime) setStep(3);
    };

    const handleBack = () => { if (step > 1) setStep(step - 1); };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const appointmentData = {
            service_id: selectedService.id,
            service_name: selectedService.title || selectedService.name,
            service_price: selectedService.price,
            customer_name: `${formData.firstName} ${formData.lastName}`,
            customer_email: formData.email,
            customer_phone: formData.phone,
            appointment_date: selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }),
            appointment_time: selectedTime,
            status: 'pending'
        };

        const { error } = await supabase.from('appointments').insert([appointmentData]);

        setIsSubmitting(false);
        if (error) {
            alert('Error creating booking: ' + error.message);
        } else {
            setIsSuccess(true);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose}></div>

            <div className="bg-white dark:bg-zinc-900 w-full max-w-5xl h-[85vh] rounded-[2.5rem] overflow-hidden shadow-2xl relative flex flex-col md:flex-row animate-fade-in-up border border-white/20">

                {/* Left Side */}
                <div className="hidden md:flex bg-[#f0f0f0] dark:bg-black/40 md:w-1/3 p-8 flex-col justify-between relative overflow-hidden">
                    <div className="relative z-10">
                        <h2 className="text-2xl md:text-3xl font-display font-medium text-primary mb-2">{t('booking.title')}</h2>
                        <p className="text-gray-500 text-sm">{t('booking.step')} {isSuccess ? t('booking.confirmed') : step} {t('booking.of')} 3</p>

                        {!isSuccess && (
                            <div className="flex gap-2 mt-4 md:mt-6">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className={`h-1 flex-1 rounded-full transition-colors duration-500 ${step >= i ? 'bg-primary' : 'bg-gray-300'}`}></div>
                                ))}
                            </div>
                        )}
                    </div>

                    {!isSuccess && (
                        <div className="relative z-10 space-y-4">
                            {selectedService && (
                                <div className="bg-white p-3 md:p-4 rounded-xl shadow-sm animate-fade-in">
                                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">{t('booking.service')}</p>
                                    <p className="font-display font-bold text-base md:text-lg">{selectedService.title || selectedService.name}</p>
                                    <div className="flex justify-between mt-2 text-sm">
                                        <span className="text-gray-500">{selectedService.duration || selectedService.time}</span>
                                        <span className="text-gold-accent font-bold">{selectedService.price}</span>
                                    </div>
                                </div>
                            )}
                            {(selectedDate || selectedTime) && (
                                <div className="bg-white p-4 rounded-xl shadow-sm animate-fade-in">
                                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">{t('booking.dateTime')}</p>
                                    <div className="font-display font-bold text-lg">
                                        {selectedDate ? <span className="block text-primary">{selectedDate.toLocaleDateString(lang === 'el' ? 'el-GR' : 'en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span> : <span className="text-gray-300">{t('booking.selectDate')}</span>}
                                        {selectedTime ? <span className="block mt-1">at {selectedTime}</span> : <span className="text-gray-300 text-sm font-sans font-normal">{t('booking.selectTime')}</span>}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="hidden md:block absolute -bottom-20 -right-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
                </div>

                {/* Right Side */}
                <div className="flex-1 p-5 md:p-12 overflow-y-auto bg-white relative">
                    <button onClick={onClose} className="absolute top-4 right-4 md:top-8 md:right-8 w-10 h-10 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center transition-all z-20">
                        <span className="material-symbols-outlined">close</span>
                    </button>

                    {/* Step 1: Services */}
                    {step === 1 && !isSuccess && (
                        <div className="space-y-6 animate-fade-in">
                            <h3 className="text-2xl font-bold font-display">{t('booking.selectTreatment')}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {services.map(service => (
                                    <div key={service.id} onClick={() => { setSelectedService(service); setStep(2); }}
                                        className={`p-5 rounded-xl border-2 cursor-pointer transition-all duration-200 flex justify-between items-center group ${selectedService?.id === service.id ? 'border-primary bg-primary/5' : 'border-gray-100 hover:border-primary/30'}`}>
                                        <div>
                                            <h4 className="font-bold text-gray-900 group-hover:text-primary transition-colors">{service.title || service.name}</h4>
                                            <p className="text-sm text-gray-500 mt-1">{service.duration || service.time}</p>
                                        </div>
                                        <p className="font-bold text-gold-accent">{service.price}</p>
                                    </div>
                                ))}
                                {services.length === 0 && <p className="text-gray-500">{t('booking.loadingServices')}</p>}
                            </div>
                        </div>
                    )}

                    {/* Step 2: Date & Time */}
                    {step === 2 && !isSuccess && (
                        <div className="space-y-8 animate-fade-in">
                            <div className="flex items-center gap-4 mb-2">
                                <button onClick={handleBack} className="text-gray-400 hover:text-black hover:bg-gray-100 p-2 rounded-full transition-all">
                                    <span className="material-symbols-outlined">arrow_back</span>
                                </button>
                                <h3 className="text-2xl font-bold font-display">{t('booking.whenWorks')}</h3>
                            </div>

                            <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
                                <div className="flex-1">
                                    <h4 className="font-bold text-gray-400 uppercase text-xs tracking-wider mb-2 md:mb-4">{t('booking.selectDate')}</h4>
                                    <div className="bg-gray-50 p-4 md:p-6 rounded-2xl">
                                        <div className="flex justify-between items-center mb-6">
                                            <h5 className="font-bold text-lg font-display">{monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}</h5>
                                            <div className="flex gap-2">
                                                <button onClick={() => changeMonth(-1)} className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:bg-gray-100 transition-colors">
                                                    <span className="material-symbols-outlined text-sm">chevron_left</span>
                                                </button>
                                                <button onClick={() => changeMonth(1)} className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:bg-gray-100 transition-colors">
                                                    <span className="material-symbols-outlined text-sm">chevron_right</span>
                                                </button>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-7 mb-2 text-center">
                                            {dayLabels.map(d => (
                                                <span key={d} className="text-xs font-bold text-gray-400 uppercase">{d}</span>
                                            ))}
                                        </div>

                                        <div className="grid grid-cols-7 gap-y-2 gap-x-1">
                                            {calendarDays.map((date, idx) => {
                                                if (!date) return <div key={idx}></div>;
                                                const selectable = isDateSelectable(date);
                                                const selected = isSelected(date);
                                                return (
                                                    <button key={idx} onClick={() => selectable && setSelectedDate(date)} disabled={!selectable}
                                                        className={`h-10 w-10 mx-auto rounded-full flex items-center justify-center text-sm font-bold transition-all
                                                            ${selected ? 'bg-primary text-white shadow-md scale-110' : ''}
                                                            ${!selected && selectable ? 'hover:bg-gray-200 text-gray-700' : ''}
                                                            ${!selectable ? 'text-gray-300 cursor-not-allowed' : ''}`}>
                                                        {date.getDate()}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex-1 lg:max-w-[200px] w-full">
                                    <h4 className="font-bold text-gray-400 uppercase text-xs tracking-wider mb-2 md:mb-4">{t('booking.selectTime')}</h4>
                                    <div className="grid grid-cols-3 gap-2 md:flex md:flex-col md:gap-3 md:h-[320px] md:overflow-y-auto md:pr-2 md:scrollbar-hide">
                                        {timeSlots.map(time => (
                                            <button key={time} onClick={() => setSelectedTime(time)}
                                                className={`py-2 md:py-3 rounded-lg font-bold text-sm md:text-lg border-2 transition-all ${selectedTime === time ? 'border-primary bg-primary text-white shadow-lg' : 'border-gray-100 text-gray-600 hover:border-primary/50 bg-white'}`}>
                                                {time}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Details */}
                    {step === 3 && !isSuccess && (
                        <div className="space-y-6 animate-fade-in">
                            <div className="flex items-center gap-4 mb-4">
                                <button onClick={handleBack} className="text-gray-400 hover:text-black hover:bg-gray-100 p-2 rounded-full transition-all">
                                    <span className="material-symbols-outlined">arrow_back</span>
                                </button>
                                <h3 className="text-2xl font-bold font-display">{t('booking.yourDetails')}</h3>
                            </div>

                            <form className="space-y-4" onSubmit={handleSubmit}>
                                <div className="grid grid-cols-2 gap-4">
                                    <input type="text" placeholder={t('booking.firstName')} className="w-full p-4 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-primary border-2 outline-none transition-all" value={formData.firstName} onChange={e => setFormData({ ...formData, firstName: e.target.value })} required />
                                    <input type="text" placeholder={t('booking.lastName')} className="w-full p-4 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-primary border-2 outline-none transition-all" value={formData.lastName} onChange={e => setFormData({ ...formData, lastName: e.target.value })} required />
                                </div>
                                <input type="email" placeholder={t('booking.emailAddress')} className="w-full p-4 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-primary border-2 outline-none transition-all" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required />
                                <input type="tel" placeholder={t('booking.phoneNumber')} className="w-full p-4 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-primary border-2 outline-none transition-all" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} required />

                                <button type="submit" disabled={isSubmitting} className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-4 rounded-xl shadow-xl shadow-primary/30 mt-4 transition-all hover:scale-[1.02] disabled:opacity-50">
                                    {isSubmitting ? t('booking.confirming') : t('booking.confirmAppointment')}
                                </button>
                            </form>
                        </div>
                    )}

                    {/* Success */}
                    {isSuccess && (
                        <div className="flex flex-col items-center justify-center h-full text-center animate-fade-in space-y-6">
                            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                <span className="material-symbols-outlined text-5xl text-green-600">check_circle</span>
                            </div>
                            <h3 className="text-3xl font-display font-bold text-gray-900">{t('booking.bookingConfirmed')}</h3>
                            <p className="text-gray-500 max-w-md">
                                {t('booking.thankYou')} <strong>{formData.firstName}</strong>. {t('booking.appointmentFor')} <strong>{selectedService?.title || selectedService?.name}</strong> {t('booking.on')} <strong>{selectedDate?.toLocaleDateString()} {selectedTime}</strong> {t('booking.hasBeenReceived')}
                            </p>
                            <p className="text-sm text-gray-400">{t('booking.confirmationEmail')} {formData.email} {t('booking.shortly')}</p>

                            <button onClick={onClose} className="px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-hover shadow-lg transition-all mt-4">
                                {t('booking.done')}
                            </button>
                        </div>
                    )}

                    {/* Continue Button */}
                    {step < 3 && !isSuccess && (
                        <div className="mt-8 flex justify-end">
                            <button onClick={handleNext} disabled={step === 1 ? !selectedService : (!selectedTime || !selectedDate)}
                                className={`px-8 py-3 rounded-full font-bold flex items-center gap-2 transition-all ${(step === 1 && !selectedService) || (step === 2 && (!selectedTime || !selectedDate))
                                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    : 'bg-black text-white hover:bg-gray-800 shadow-lg'}`}>
                                {t('booking.continue')} <span className="material-symbols-outlined">arrow_forward</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BookingModal;
