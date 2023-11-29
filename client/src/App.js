import './App.css';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Area from './components/Area';
import About from './components/About';
import Home from './components/Home';
import AreaState from './context/AreaState';
import Slots from './components/Slots';
import Login from './components/Login';
import Signup from './components/Signup';
import UserProfile from './components/UserProfile';
import Reviews from './components/Reviews';
import Admin from './components/Admin';
import AdminAreas from './components/AdminAreas';
import AdminUsers from './components/AdminUsers';
import AdminRevenue from './components/AdminRevenue';
import Device from './components/Device';

function App() {
  return (
    <>
    <AreaState>
        <Router>
            <Navbar />
            <div className="container">
            <Routes>
                <Route exact path="/" element={<Home />} />
                <Route exact path="/areas" element={<Area/>} />
                <Route exact path="/about" element={<About />} />
                <Route exact path="/areas/slots" element={<Slots />} />
                <Route exact path="/areas/reviews" element={<Reviews />} />
                <Route exact path="/login" element={<Login/>} />
                <Route exact path="/signup" element={<Signup />} />
                <Route exact path="/profile" element={<UserProfile />} />
                <Route exact path="/admin" element={<Admin />} />
                <Route exact path="/admin/areas" element={<AdminAreas />} />
                <Route exact path="/admin/users" element={<AdminUsers />} />
                <Route exact path="/admin/revenue" element={<AdminRevenue />} />
                <Route exact path="/admin/device" element={<Device/>} />
                {/* <Route index element={<div>Default Page Content</div>}/> */}
            </Routes>
            </div>
        </Router>
    </AreaState>
    </>
  );
}

export default App;
