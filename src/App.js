import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import axios from 'axios'; // Import Axios for making API calls
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import ContactUs from './pages/ContactUs';
import AdminSignUp from './pages/AdminSignUp';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Category from './pages/Category';
import Admin from './pages/admin';
import DocumentsRequired from './pages/DocumentsRequired';
import CategoryDetail from './pages/CategoryDetail';
import SchemeDetail from './pages/Schemedetail';
import { AuthProvider } from './components/AuthContext'; 
import SchemeForm from './pages/SchemeForm';
import AppliedSchemes from './pages/AppliedSchemes';
import AdminNav from './components/adminNav';
import ApprovedSchemes from './pages/ApprovedSchemes';
import RevertedSchemes from './pages/RevertedSchemes';
import Dashboard from './pages/Dashboard';
import UserSchemes from './pages/UserSchemes';
import Profile from './pages/profile';

const MainApp = () => {
  const location = useLocation(); // Now this is inside Router context
  const isAdminPage = location.pathname.includes('/adminhome');
  const hideNavbarRoutes = ['/adminhome'];

  return (
    <div>
      {/* Show the appropriate Navbar depending on the route */}
      {!hideNavbarRoutes.includes(location.pathname) && (
        isAdminPage ? <AdminNav /> : <Navbar />
      )}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/category" element={<Category />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/admin-signup" element={<AdminSignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/adminhome" element={<Admin />} />
        <Route path="/documents-required" element={<DocumentsRequired />} />
        <Route path="/category/:category" element={<CategoryDetail />} />
        <Route path='/schemedetail' element={<SchemeDetail/>}/>
        <Route path='/schemeform' element={<SchemeForm/>}/>
        <Route path="/adminhome/appliedschemes" element={<AppliedSchemes />} />
        <Route path="/adminhome/approvedschemes" element={<ApprovedSchemes/>} />
        <Route path="/adminhome/revertedschemes" element={<RevertedSchemes/>} />
        <Route path="/adminhome/dashboard" element={<Dashboard />} />
        <Route path="/myapplications" element={<UserSchemes/>}/>
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <MainApp /> {/* Use the MainApp component inside Router */}
      </Router>
    </AuthProvider>
  );
}

export default App;
