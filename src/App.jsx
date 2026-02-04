import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Booking from './pages/Booking';

function App() {
    return (
        <Router>
            <div className="bg-background-light dark:bg-background-dark min-h-screen text-text-main-light dark:text-text-main-dark font-sans transition-colors duration-300">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/booking" element={<Booking />} />
                </Routes>
            </div>
        </Router>
    )
}

export default App
