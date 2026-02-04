
import React from 'react';

const Dashboard = () => {
    return (
        <div>
            <h1 className="text-3xl font-display font-bold text-gray-900 mb-8">Dashboard Overview</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Stat Cards Placeholder */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h3 className="text-gray-500 font-medium mb-2">Total Bookings</h3>
                    <p className="text-3xl font-bold text-primary">24</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h3 className="text-gray-500 font-medium mb-2">Active Services</h3>
                    <p className="text-3xl font-bold text-primary">12</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h3 className="text-gray-500 font-medium mb-2">Products</h3>
                    <p className="text-3xl font-bold text-primary">8</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center py-24">
                <span className="material-symbols-outlined text-6xl text-gray-200 mb-4">construction</span>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Admin Panel Under Construction</h3>
                <p className="text-gray-500">Select a section from the sidebar to verify data connection.</p>
            </div>
        </div>
    );
};

export default Dashboard;
