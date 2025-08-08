import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import { useState } from 'react';
import './App.css';
import Register from './components/Register';
import Login from './components/Login';
import Navbar from './components/Navbar';
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Profile from "./pages/Profile";
import { LevelUpModal } from "./components/ui/LevelUpModal";
import XpBar from "./components/XpBar";
import { BadgeModal } from "./components/ui/BadgeModal";

function App() {
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  return (
    <>
      <LevelUpModal />
      <BadgeModal />
      <Router>
        <Navbar onRegisterClick={() => setShowRegister(true)} onLoginClick={() => setShowLogin(true)} />
        <XpBar />
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
