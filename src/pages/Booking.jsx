import React from 'react';
import Navbar from '../components/layout/Navbar';

const Booking = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow container mx-auto px-6 py-12">
                <h1 className="text-4xl text-primary font-bold text-center">Booking Page</h1>
                <p className="text-center mt-4">Coming soon...</p>
            </main>
        </div>
    );
};

export default Booking;
