import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

const BookingsManager = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchBookings = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('appointments')
            .select('*')
            .order('created_at', { ascending: false });

        if (data) setBookings(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const updateStatus = async (id, newStatus) => {
        const { error } = await supabase
            .from('appointments')
            .update({ status: newStatus })
            .eq('id', id);

        if (!error) fetchBookings();
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this appointment?')) {
            const { error } = await supabase.from('appointments').delete().eq('id', id);
            if (!error) fetchBookings();
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'confirmed': return 'bg-green-100 text-green-800';
            case 'completed': return 'bg-gray-100 text-gray-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-yellow-100 text-yellow-800';
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-display font-bold text-gray-900">Bookings</h1>
                <button
                    onClick={fetchBookings}
                    className="text-gray-500 hover:text-primary transition-colors flex items-center gap-2"
                >
                    <span className="material-symbols-outlined">refresh</span>
                    Refresh
                </button>
            </div>

            {loading ? (
                <div className="text-center py-12">Loading bookings...</div>
            ) : (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="p-6 font-bold text-gray-700">Customer</th>
                                <th className="p-6 font-bold text-gray-700">Service</th>
                                <th className="p-6 font-bold text-gray-700">Date & Time</th>
                                <th className="p-6 font-bold text-gray-700">Status</th>
                                <th className="p-6 font-bold text-gray-700 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {bookings.map((booking) => (
                                <tr key={booking.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="p-6">
                                        <div className="font-bold text-gray-900">{booking.customer_name}</div>
                                        <div className="text-sm text-gray-500">{booking.customer_email}</div>
                                        <div className="text-sm text-gray-500">{booking.customer_phone}</div>
                                    </td>
                                    <td className="p-6">
                                        <div className="font-medium text-gray-900">{booking.service_name}</div>
                                        <div className="text-sm text-gray-500">{booking.service_price}</div>
                                    </td>
                                    <td className="p-6">
                                        <div className="font-medium text-gray-900">{booking.appointment_date}</div>
                                        <div className="text-sm text-blue-600 font-bold">{booking.appointment_time}</div>
                                    </td>
                                    <td className="p-6">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(booking.status)}`}>
                                            {booking.status}
                                        </span>
                                    </td>
                                    <td className="p-6 text-right space-x-2">
                                        {booking.status === 'pending' && (
                                            <button
                                                onClick={() => updateStatus(booking.id, 'confirmed')}
                                                className="text-green-600 hover:bg-green-50 p-2 rounded-lg transition-colors"
                                                title="Confirm"
                                            >
                                                <span className="material-symbols-outlined text-[20px]">check_circle</span>
                                            </button>
                                        )}
                                        {booking.status !== 'cancelled' && (
                                            <button
                                                onClick={() => updateStatus(booking.id, 'cancelled')}
                                                className="text-orange-500 hover:bg-orange-50 p-2 rounded-lg transition-colors"
                                                title="Cancel"
                                            >
                                                <span className="material-symbols-outlined text-[20px]">cancel</span>
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleDelete(booking.id)}
                                            className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                                            title="Delete"
                                        >
                                            <span className="material-symbols-outlined text-[20px]">delete</span>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {bookings.length === 0 && (
                        <div className="p-12 text-center text-gray-500">
                            No bookings found.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default BookingsManager;
