import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';

import Login from './pages/admin/Login';

import AdminLayout from './components/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import ServicesManager from './pages/admin/ServicesManager';
import ProductsManager from './pages/admin/ProductsManager';
import GalleryManager from './pages/admin/GalleryManager';
import BookingsManager from './pages/admin/BookingsManager';


function App() {
    return (
        <Router>
            <div className="bg-background-light dark:bg-background-dark min-h-screen text-text-main-light dark:text-text-main-dark font-sans transition-colors duration-300">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/admin/login" element={<Login />} />

                    {/* Protected Admin Routes */}
                    <Route path="/admin" element={<AdminLayout />}>
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="services" element={<ServicesManager />} />
                        <Route path="products" element={<ProductsManager />} />
                        <Route path="gallery" element={<GalleryManager />} />
                        <Route path="bookings" element={<BookingsManager />} />
                    </Route>
                </Routes>
            </div>
        </Router>
    )
}

export default App
