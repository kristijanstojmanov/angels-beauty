import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './lib/LanguageContext';
import Home from './pages/Home';

import Login from './pages/admin/Login';

import AdminLayout from './components/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import ServicesManager from './pages/admin/ServicesManager';
import ProductsManager from './pages/admin/ProductsManager';
import GalleryManager from './pages/admin/GalleryManager';
import BookingsManager from './pages/admin/BookingsManager';
import EventsManager from './pages/admin/EventsManager';
import BrandsManager from './pages/admin/BrandsManager';
import ReviewsManager from './pages/admin/ReviewsManager';
import FAQManager from './pages/admin/FAQManager';
import StylistManager from './pages/admin/StylistManager';
import SettingsManager from './pages/admin/SettingsManager';


function App() {
    return (
        <LanguageProvider>
        <Router>
            <div className="bg-background-light dark:bg-background-dark min-h-screen text-text-main-light dark:text-text-main-dark font-sans transition-colors duration-300">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/admin/login" element={<Login />} />

                    {/* Protected Admin Routes */}
                    <Route path="/admin" element={<AdminLayout />}>
                        <Route index element={<Navigate to="dashboard" replace />} />
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="services" element={<ServicesManager />} />
                        <Route path="products" element={<ProductsManager />} />
                        <Route path="gallery" element={<GalleryManager />} />
                        <Route path="bookings" element={<BookingsManager />} />
                        <Route path="events" element={<EventsManager />} />
                        <Route path="brands" element={<BrandsManager />} />
                        <Route path="reviews" element={<ReviewsManager />} />
                        <Route path="faq" element={<FAQManager />} />
                        <Route path="stylist" element={<StylistManager />} />
                        <Route path="settings" element={<SettingsManager />} />
                    </Route>
                </Routes>
            </div>
        </Router>
        </LanguageProvider>
    )
}

export default App
