import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import StudentDashboard from './pages/StudentDashboard';
import StaffDashboard from './pages/StaffDashboard';
import Landing from './pages/Landing';
import Register from './pages/Register';

function App() {
  const [user, setUser] = useState(null);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login setUser={setUser} />} />

          <Route path="/admin" element={
            user && user.role === 'admin' ?
              <AdminDashboard user={user} setUser={setUser} /> : <Navigate to="/login" />
          } />

          <Route path="/student" element={
            user && user.role === 'student' ?
              <StudentDashboard user={user} setUser={setUser} /> : <Navigate to="/login" />
          } />

          <Route path="/staff" element={
            user && ['faculty', 'hod', 'warden', 'principal', 'exam_cell', 'office_staff'].includes(user.role) ?
              <StaffDashboard user={user} setUser={setUser} /> : <Navigate to="/login" />
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
