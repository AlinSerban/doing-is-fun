import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import { useState } from 'react';
import './App.css';
import Register from './components/Register';
import Login from './components/Login';
import Navbar from './components/Navbar';
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Profile from "./pages/Profile";

function App() {
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  return (
    <>
      <Router>
        <Navbar onRegisterClick={() => setShowRegister(true)} onLoginClick={() => setShowLogin(true)} />
        <Register showModal={showRegister} setShowModal={setShowRegister} />
        <Login showModal={showLogin} setShowModal={setShowLogin} />
        <Routes>
          <Route path="/" element={<div className="text-white text-center mt-20">Home Page</div>} />
          <Route path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
          <Route path="*" element={<Navigate to="/" />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </>

  )
}

export default App
