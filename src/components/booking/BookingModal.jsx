import React, { useState } from 'react';

const services = [
    { id: 1, name: "Precision Cut", time: "60m", price: "€85" },
    { id: 2, name: "Balayage", time: "180m", price: "€160" },
    { id: 3, name: "Root Touch-Up", time: "90m", price: "€90" },
    { id: 4, name: "Extension Install", time: "120m", price: "Consult" },
    { id: 5, name: "Signature Blowout", time: "45m", price: "€55" },
    { id: 6, name: "Keratin Treatment", time: "120m", price: "€120" },
];

const timeSlots = ["09:00", "10:00", "11:30", "13:00", "14:30", "16:00", "17:30"];

const BookingModal = ({ isOpen, onClose }) => {
    const [step, setStep] = useState(1);
    const [selectedService, setSelectedService] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);

    // Calendar State
    const [currentMonth, setCurrentMonth] = useState(new Date());

    if (!isOpen) return null;

    // --- Calendar Logic ---
    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Sun

        const days = [];
        // Empty slots for previous month
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(null);
        }
        // Actual days
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(new Date(year, month, i));
        }
        return days;
    };

    const calendarDays = getDaysInMonth(currentMonth);
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    // Check if dates are in past
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const isDateSelectable = (date) => {
        if (!date) return false;
        return date >= today;
    };

    const isSelected = (date) => {
        if (!date || !selectedDate) return false;
        return date.getDate() === selectedDate.getDate() &&
            date.getMonth() === selectedDate.getMonth() &&
            date.getFullYear() === selectedDate.getFullYear();
    };

    const changeMonth = (offset) => {
        const newMonth = new Date(currentMonth);
        newMonth.setMonth(newMonth.getMonth() + offset);
        setCurrentMonth(newMonth);
    };

    // --- Navigation Handlers ---
    const handleNext = () => {
        if (step === 1 && selectedService) setStep(2);
        if (step === 2 && selectedDate && selectedTime) setStep(3);
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose}></div>

            {/* Modal Container */}
            <div className="bg-white dark:bg-zinc-900 w-full max-w-5xl h-[85vh] rounded-[2.5rem] overflow-hidden shadow-2xl relative flex flex-col md:flex-row animate-fade-in-up border border-white/20">

                {/* Left Side: Summary / Visuals - Hidden on mobile as requested ("hard to operate") */}
                <div className="hidden md:flex bg-[#f0f0f0] dark:bg-black/40 md:w-1/3 p-8 flex-col justify-between relative overflow-hidden">
                    <div className="relative z-10">
                        <h2 className="text-2xl md:text-3xl font-display font-medium text-primary mb-2">Book Your Visit</h2>
                        <p className="text-gray-500 text-sm">Step {step} of 3</p>

                        {/* Progress Bar */}
                        <div className="flex gap-2 mt-4 md:mt-6">
                            {[1, 2, 3].map(i => (
                                <div key={i} className={`h-1 flex-1 rounded-full transition-colors duration-500 ${step >= i ? 'bg-primary' : 'bg-gray-300'}`}></div>
                            ))}
                        </div>
                    </div>

                    <div className="relative z-10 space-y-4">
                        {selectedService && (
                            <div className="bg-white p-3 md:p-4 rounded-xl shadow-sm animate-fade-in">
                                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Service</p>
                                <p className="font-display font-bold text-base md:text-lg">{selectedService.name}</p>
                                <div className="flex justify-between mt-2 text-sm">
                                    <span className="text-gray-500">{selectedService.time}</span>
                                    <span className="text-gold-accent font-bold">{selectedService.price}</span>
                                </div>
                            </div>
                        )}
                        {(selectedDate || selectedTime) && (
                            <div className="bg-white p-4 rounded-xl shadow-sm animate-fade-in">
                                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Date & Time</p>
                                <div className="font-display font-bold text-lg">
                                    {selectedDate ? <span className="block text-primary">{selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span> : <span className="text-gray-300">Select Date</span>}
                                    {selectedTime ? <span className="block mt-1">at {selectedTime}</span> : <span className="text-gray-300 text-sm font-sans font-normal">Select Time</span>}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Decorative Background Blob - Hidden on mobile to save space/performance */}
                    <div className="hidden md:block absolute -bottom-20 -right-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
                </div>

                {/* Right Side: Interactive Wizard */}
                <div className="flex-1 p-5 md:p-12 overflow-y-auto bg-white relative">
                    <button onClick={onClose} className="absolute top-4 right-4 md:top-8 md:right-8 w-10 h-10 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center transition-all z-20">
                        <span className="material-symbols-outlined">close</span>
                    </button>

                    {/* Step 1: Services */}
                    {step === 1 && (
                        <div className="space-y-6 animate-fade-in">
                            <h3 className="text-2xl font-bold font-display">Select a Treatment</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {services.map(service => (
                                    <div
                                        key={service.id}
                                        onClick={() => {
                                            setSelectedService(service);
                                            setStep(2); // Auto-advance
                                        }}
                                        className={`p-5 rounded-xl border-2 cursor-pointer transition-all duration-200 flex justify-between items-center group ${selectedService?.id === service.id ? 'border-primary bg-primary/5' : 'border-gray-100 hover:border-primary/30'}`}
                                    >
                                        <div>
                                            <h4 className="font-bold text-gray-900 group-hover:text-primary transition-colors">{service.name}</h4>
                                            <p className="text-sm text-gray-500 mt-1">{service.time}</p>
                                        </div>
                                        <p className="font-bold text-gold-accent">{service.price}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step 2: Date & Time (CALENDAR GRID) */}
                    {step === 2 && (
                        <div className="space-y-8 animate-fade-in">
                            <div className="flex items-center gap-4 mb-2">
                                <button onClick={handleBack} className="text-gray-400 hover:text-black hover:bg-gray-100 p-2 rounded-full transition-all">
                                    <span className="material-symbols-outlined">arrow_back</span>
                                </button>
                                <h3 className="text-2xl font-bold font-display">When works for you?</h3>
                            </div>

                            <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
                                {/* Calendar Grid */}
                                <div className="flex-1">
                                    <h4 className="font-bold text-gray-400 uppercase text-xs tracking-wider mb-2 md:mb-4">Select Date</h4>

                                    <div className="bg-gray-50 p-4 md:p-6 rounded-2xl">
                                        {/* Header */}
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

                                        {/* Days Header */}
                                        <div className="grid grid-cols-7 mb-2 text-center">
                                            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                                                <span key={d} className="text-xs font-bold text-gray-400 uppercase">{d}</span>
                                            ))}
                                        </div>

                                        {/* Days Grid */}
                                        <div className="grid grid-cols-7 gap-y-2 gap-x-1">
                                            {calendarDays.map((date, idx) => {
                                                if (!date) return <div key={idx}></div>;
                                                const selectable = isDateSelectable(date);
                                                const selected = isSelected(date);
                                                return (
                                                    <button
                                                        key={idx}
                                                        onClick={() => selectable && setSelectedDate(date)}
                                                        disabled={!selectable}
                                                        className={`h-10 w-10 mx-auto rounded-full flex items-center justify-center text-sm font-bold transition-all
                                                            ${selected ? 'bg-primary text-white shadow-md scale-110' : ''}
                                                            ${!selected && selectable ? 'hover:bg-gray-200 text-gray-700' : ''}
                                                            ${!selectable ? 'text-gray-300 cursor-not-allowed' : ''}
                                                        `}
                                                    >
                                                        {date.getDate()}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>

                                {/* Time Selection (Horizontal on mobile, List on desktop) */}
                                <div className="flex-1 lg:max-w-[200px] w-full">
                                    <h4 className="font-bold text-gray-400 uppercase text-xs tracking-wider mb-2 md:mb-4">Select Time</h4>

                                    {/* Desktop: Vertical List / Mobile: Grid */}
                                    <div className="grid grid-cols-3 gap-2 md:flex md:flex-col md:gap-3 md:h-[320px] md:overflow-y-auto md:pr-2 md:scrollbar-hide">
                                        {timeSlots.map(time => (
                                            <button
                                                key={time}
                                                onClick={() => setSelectedTime(time)}
                                                className={`py-2 md:py-3 rounded-lg font-bold text-sm md:text-lg border-2 transition-all ${selectedTime === time ? 'border-primary bg-primary text-white shadow-lg' : 'border-gray-100 text-gray-600 hover:border-primary/50 bg-white'}`}
                                            >
                                                {time}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Details */}
                    {step === 3 && (
                        <div className="space-y-6 animate-fade-in">
                            <div className="flex items-center gap-4 mb-4">
                                <button onClick={handleBack} className="text-gray-400 hover:text-black hover:bg-gray-100 p-2 rounded-full transition-all">
                                    <span className="material-symbols-outlined">arrow_back</span>
                                </button>
                                <h3 className="text-2xl font-bold font-display">Your Details</h3>
                            </div>

                            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                                <div className="grid grid-cols-2 gap-4">
                                    <input type="text" placeholder="First Name" className="w-full p-4 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-primary border-2 outline-none transition-all" />
                                    <input type="text" placeholder="Last Name" className="w-full p-4 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-primary border-2 outline-none transition-all" />
                                </div>
                                <input type="email" placeholder="Email Address" className="w-full p-4 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-primary border-2 outline-none transition-all" />
                                <input type="tel" placeholder="Phone Number" className="w-full p-4 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-primary border-2 outline-none transition-all" />

                                <button className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-4 rounded-xl shadow-xl shadow-primary/30 mt-4 transition-all hover:scale-[1.02]">
                                    Confirm Appointment
                                </button>
                            </form>
                        </div>
                    )}

                    {/* Next Button (Floating if step < 3) */}
                    {step < 3 && (
                        <div className="mt-8 flex justify-end">
                            <button
                                onClick={handleNext}
                                disabled={step === 1 ? !selectedService : (!selectedTime || !selectedDate)}
                                className={`px-8 py-3 rounded-full font-bold flex items-center gap-2 transition-all ${(step === 1 && !selectedService) || (step === 2 && (!selectedTime || !selectedDate))
                                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    : 'bg-black text-white hover:bg-gray-800 shadow-lg'
                                    }`}
                            >
                                Continue <span className="material-symbols-outlined">arrow_forward</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BookingModal;
