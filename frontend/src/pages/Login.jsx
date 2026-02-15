import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import logo from './TPGIT_Logo.jpg';

const Login = ({ setUser }) => {
    const [role, setRole] = useState('student');
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState(''); // Served as DOB for students
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await axios.post('http://127.0.0.1:5000/api/login', {
                role,
                identifier,
                password
            });

            if (response.data.user) {
                setUser(response.data.user);
                if (role === 'admin') navigate('/admin');
                else if (role === 'student') navigate('/student');
                else navigate('/staff');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-800 p-4">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md border border-gray-200">
                <div className="flex flex-col items-center mb-6 text-center">
                    <img src={logo} alt="TPGIT Logo" className="w-32 h-32 mb-4 object-contain" />
                    <h1 className="text-xl md:text-2xl font-extrabold text-blue-900 tracking-tight uppercase leading-tight">
                        Thanthai Periyar Government <br /> Institute of Technology
                    </h1>
                    <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-2">
                        Grievance Redressal Portal
                    </h2>
                </div>

                <div className="flex justify-center mb-6 gap-2 bg-gray-100 p-1 rounded-md">
                    {['student', 'staff', 'admin'].map((r) => (
                        <button
                            key={r}
                            onClick={() => {
                                setRole(r === 'staff' ? 'faculty' : r); // Default to faculty if staff clicked
                                setIdentifier('');
                                setPassword('');
                                setError('');
                            }}
                            className={`flex-1 py-1.5 rounded text-sm font-medium transition-all duration-200 capitalize ${(r === 'staff' && ['faculty', 'hod', 'warden', 'principal', 'exam_cell', 'office_staff'].includes(role)) || role === r
                                ? 'bg-white text-blue-900 shadow-sm border border-gray-200 font-bold'
                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            {r}
                        </button>
                    ))}
                </div>

                {['faculty', 'hod', 'warden', 'principal', 'exam_cell', 'office_staff'].includes(role) && (
                    <div className="mb-4 animate-fade-in">
                        <label className="text-xs uppercase font-bold text-gray-500 mb-2 block text-center">Select Designation</label>
                        <div className="grid grid-cols-2 gap-2">
                            {[
                                { id: 'faculty', label: 'Faculty' },
                                { id: 'hod', label: 'HOD' },
                                { id: 'warden', label: 'Warden' },
                                { id: 'principal', label: 'Principal' },
                                { id: 'exam_cell', label: 'Exam Cell' },
                                { id: 'office_staff', label: 'Office Staff' }
                            ].map((type) => (
                                <button
                                    key={type.id}
                                    type="button"
                                    onClick={() => setRole(type.id)}
                                    className={`py-2 px-1 text-xs rounded border transition-colors ${role === type.id
                                        ? 'bg-blue-50 border-blue-200 text-blue-700 font-bold ring-1 ring-blue-200'
                                        : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    {type.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="text-xs uppercase font-bold text-gray-500 mb-1 block">
                            {role === 'admin' ? 'Username' : 'Register Number'}
                        </label>
                        <input
                            type="text"
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                            className="input-field"
                            placeholder={role === 'admin' ? 'Enter Username' : 'Enter RegNo'}
                            required
                        />
                    </div>

                    <div>
                        <label className="text-xs uppercase font-bold text-gray-500 mb-1 block">
                            {role === 'student' ? 'Date of Birth (YYYY-MM-DD)' : 'Password'}
                        </label>
                        <input
                            type={role === 'student' ? 'date' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input-field"
                            required
                        />
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-700 text-xs p-3 rounded border border-red-200 flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-blue-900 text-white py-2.5 rounded-md font-bold hover:bg-blue-800 transition-all shadow-sm mt-2"
                    >
                        Secure Login
                    </button>
                </form>

                <div className="mt-6 text-xs text-center text-gray-400 border-t border-gray-100 pt-4">
                    <p>Don&apos;t have an account? <Link to="/register" className="text-blue-600 hover:underline font-medium">Register</Link></p>
                    <p className="mt-2">&copy; {new Date().getFullYear()} TPGIT Vellore. All Rights Reserved.</p>
                    <div className="mt-2">
                        <button
                            type="button"
                            onClick={() => {
                                setRole('admin');
                                setIdentifier('aasif');
                                setPassword('aasif123');
                            }}
                            className="text-blue-500 hover:underline"
                        >
                            Quick Login as Admin
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
