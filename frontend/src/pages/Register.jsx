import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        role: 'student',
        name: '',
        email: '',
        regno: '', // Using as username as well
        password: '',
        gender: '',
        // Optional fields based on role
        department: '',
        year: '',
        hostel_name: ''
    });

    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('http://localhost:5000/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                alert('Registration successful! Please login.');
                navigate('/login');
            } else {
                setError(data.error || 'Registration failed');
            }
        } catch (err) {
            setError('Server error');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Create Account</h2>

                {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 mb-1">Select Role</label>
                        <select name="role" value={formData.role} onChange={handleChange} className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none">
                            <option value="student">Student</option>
                            <option value="faculty">Faculty</option>
                            <option value="hod">HOD</option>
                            <option value="principal">Principal</option>
                            <option value="hostel warden">Hostel Warden</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-1">Full Name</label>
                        <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Enter Full Name" />
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-1">Email</label>
                        <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Enter Email" />
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-1">Reg Number / Username</label>
                        <input type="text" name="regno" required value={formData.regno} onChange={handleChange} className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Enter Reg No (Username)" />
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-1">Password</label>
                        <input type="password" name="password" required value={formData.password} onChange={handleChange} className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Set Password" />
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-1">Gender</label>
                        <select name="gender" value={formData.gender} onChange={handleChange} className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none" required>
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    {formData.role === 'student' && (
                        <>
                            <div>
                                <label className="block text-gray-700 mb-1">Department</label>
                                <input type="text" name="department" value={formData.department} onChange={handleChange} className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. CSE" />
                            </div>
                            <div>
                                <label className="block text-gray-700 mb-1">Year</label>
                                <select name="year" value={formData.year} onChange={handleChange} className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none">
                                    <option value="">Select Year</option>
                                    <option value="First">First</option>
                                    <option value="Second">Second</option>
                                    <option value="Third">Third</option>
                                    <option value="Fourth">Fourth</option>
                                </select>
                            </div>

                            <div className="flex items-center gap-6 mt-2">
                                <span className="text-gray-700 font-medium">Residency:</span>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="residency"
                                        checked={!formData.hostel_name && formData.role === 'student'} // Logic check - if day scholar
                                        onChange={() => setFormData({ ...formData, hostel_name: '' })}
                                    />
                                    Day Scholar
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="residency"
                                        checked={formData.hostel_name || formData.hostel_name === ''} // Just to toggle UI, actual logic handled by select
                                        onChange={() => { }} // Controlled by UI state below
                                    />
                                    Hosteller
                                </label>
                            </div>

                            {/* Hosteller Logic - Simplified: Show Hostel Dropdown always if 'Hosteller' is intended, 
                                 but here we can just show the dropdown and if they select a hostel, they are a hosteller. 
                                 Let's make it explicit based on the request "click day scholar / hosteller".
                                 We'll use a local state or just check if they want to select a hostel.
                             */}

                            <div className="mt-2">
                                <p className="text-sm text-gray-500 mb-1">If Hosteller, select hostel:</p>
                                <select name="hostel_name" value={formData.hostel_name} onChange={handleChange} className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none">
                                    <option value="">Not a Hosteller / Select Hostel</option>
                                    {formData.gender === 'Male' && (
                                        <>
                                            <option value="B1">Boys Hostel 1 (B1)</option>
                                            <option value="B2">Boys Hostel 2 (B2)</option>
                                            <option value="B3">Boys Hostel 3 (B3)</option>
                                        </>
                                    )}
                                    {formData.gender === 'Female' && (
                                        <>
                                            <option value="G1">Girls Hostel 1 (G1)</option>
                                            <option value="G2">Girls Hostel 2 (G2)</option>
                                        </>
                                    )}
                                </select>
                                {!formData.gender && <p className="text-xs text-red-500 mt-1">Please select gender first to see hostel options.</p>}
                            </div>
                        </>
                    )}

                    {formData.role === 'hostel warden' && (
                        <div>
                            <label className="block text-gray-700 mb-1">Hostel Name</label>
                            <select name="hostel_name" value={formData.hostel_name} onChange={handleChange} className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none">
                                <option value="">Select Managed Hostel</option>
                                <option value="B1">Boys Hostel 1 (B1)</option>
                                <option value="B2">Boys Hostel 2 (B2)</option>
                                <option value="B3">Boys Hostel 3 (B3)</option>
                                <option value="G1">Girls Hostel 1 (G1)</option>
                                <option value="G2">Girls Hostel 2 (G2)</option>
                            </select>
                        </div>
                    )}


                    <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-700 transition duration-300">Register</button>
                </form>

                <p className="mt-4 text-center text-gray-600">
                    Already registered? <Link to="/login" className="text-blue-600 hover:underline">Login here</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
