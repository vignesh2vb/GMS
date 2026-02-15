
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserRegistrationForm = ({ onSuccess, defaultRole = 'student', allowedRoles = ['student', 'faculty', 'hod', 'warden', 'principal'], initialData = null, isEditing = false }) => {
    const [userType, setUserType] = useState(defaultRole === 'student' ? 'student' : 'staff');
    const [formData, setFormData] = useState({
        name: '',
        regno: '',
        dob: '',
        password: '',
        role: defaultRole,
        gender: '',
        year: '',
        department: '',
        hostel_name: '',
        room_number: '',
        is_hosteller: false
    });

    useEffect(() => {
        if (initialData) {
            setUserType(initialData.role === 'student' ? 'student' : 'staff');
            setFormData({
                ...initialData,
                password: '', // Do not populate password
                dob: initialData.dob || '',
                is_hosteller: initialData.is_hosteller || false,
                hostel_name: initialData.hostel_name || '',
                room_number: initialData.room_number || ''
            });
        }
    }, [initialData]);

    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleTypeChange = (type) => {
        setUserType(type);
        setFormData(prev => ({
            ...prev,
            role: type === 'student' ? 'student' : 'faculty',
            gender: '',
            year: '',
            department: '',
            hostel_name: '',
            room_number: '',
            is_hosteller: false
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const role = userType === 'student' ? 'student' : formData.role;
            const payload = { ...formData, role };

            // Cleanup payload based on role
            if (role === 'student') {
                delete payload.password;
                if (!payload.is_hosteller) {
                    delete payload.hostel_name;
                    delete payload.room_number;
                }
            } else {
                // Staff roles
                if (role === 'warden') {
                    delete payload.dob;
                    delete payload.year;
                    delete payload.department;
                } else {
                    // Faculty, HOD, Principal
                    delete payload.dob;
                    delete payload.year;
                    delete payload.hostel_name;
                }
            }

            if (isEditing) {
                const res = await axios.put(`http://127.0.0.1:5000/api/admin/users/${initialData.id}`, payload);
                setMessage(`✅ ${res.data.message}`);
            } else {
                const res = await axios.post('http://127.0.0.1:5000/api/admin/add-user', payload);
                setMessage(`✅ ${res.data.message}`);
            }

            if (!isEditing) {
                setFormData({
                    name: '', regno: '', dob: '', password: '',
                    role: userType === 'student' ? 'student' : 'faculty',
                    gender: '',
                    year: '', department: '', hostel_name: '', room_number: '', is_hosteller: false
                });
            }
            setTimeout(() => setMessage(''), 3000);
            if (onSuccess) onSuccess();
        } catch (err) {
            console.error(err);
            setMessage(`❌ ${err.response?.data?.error || 'Operation failed'}`);
        }
    };

    return (
        <div className="bg-white p-8 rounded-lg shadow-md max-w-3xl mx-auto border border-gray-200">
            <h2 className="text-xl font-bold mb-6 text-gray-700 border-l-4 border-blue-900 pl-3">{isEditing ? 'Edit Member Details' : 'Register New Member'}</h2>


            <div className="flex gap-4 mb-6 bg-gray-100 p-1.5 rounded-md">
                <button
                    type="button"
                    onClick={() => handleTypeChange('student')}
                    className={`flex-1 py-2 rounded text-sm font-semibold transition-all ${userType === 'student' ? 'bg-white text-blue-900 shadow-sm border border-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    STUDENT
                </button>
                <button
                    type="button"
                    onClick={() => handleTypeChange('staff')}
                    className={`flex-1 py-2 rounded text-sm font-semibold transition-all ${userType === 'staff' ? 'bg-white text-blue-900 shadow-sm border border-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
                    disabled={!allowedRoles.some(r => ['faculty', 'hod', 'warden', 'principal', 'exam_cell', 'office_staff'].includes(r))}
                    style={{ opacity: allowedRoles.some(r => ['faculty', 'hod', 'warden', 'principal', 'exam_cell', 'office_staff'].includes(r)) ? 1 : 0.5 }}
                >
                    STAFF
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-5">
                    <input
                        name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required
                        className="input-field"
                    />
                    <input
                        name="regno" placeholder="ID / RegNo" value={formData.regno} onChange={handleChange} required
                        className="input-field"
                    />
                </div>

                <div className="grid grid-cols-1 mb-4">
                    <select name="gender" value={formData.gender} onChange={handleChange} className="input-field" required>
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                {userType === 'student' ? (
                    <>
                        <div className="grid grid-cols-2 gap-5">
                            <select name="year" value={formData.year} onChange={handleChange} className="input-field" required>
                                <option value="">Select Year</option>
                                <option value="First">First Year</option>
                                <option value="Second">Second Year</option>
                                <option value="Third">Third Year</option>
                                <option value="Fourth">Fourth Year</option>
                            </select>
                            <select name="department" value={formData.department} onChange={handleChange} className="input-field" required>
                                <option value="">Select Department</option>
                                <option value="CSE">CSE</option>
                                <option value="ECE">ECE</option>
                                <option value="EEE">EEE</option>
                                <option value="MECH">MECH</option>
                                <option value="CIVIL">CIVIL</option>
                            </select>
                        </div>

                        <div className="flex items-center gap-6 bg-white p-3 rounded border border-gray-200">
                            <span className="text-sm font-bold text-gray-600 uppercase">Residency:</span>
                            <div className="flex items-center gap-2">
                                <input
                                    type="radio" name="is_hosteller" id="day_scholar"
                                    checked={!formData.is_hosteller}
                                    onChange={() => setFormData({ ...formData, is_hosteller: false, hostel_name: '', room_number: '' })}
                                />
                                <label htmlFor="day_scholar" className="text-sm text-gray-700 cursor-pointer">Day Scholar</label>
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="radio" name="is_hosteller" id="hosteller"
                                    checked={formData.is_hosteller}
                                    onChange={() => setFormData({ ...formData, is_hosteller: true })}
                                />
                                <label htmlFor="hosteller" className="text-sm text-gray-700 cursor-pointer">Hosteller</label>
                            </div>
                        </div>

                        {formData.is_hosteller && (
                            <div className="grid grid-cols-2 gap-5 animate-fade-in">
                                <select name="hostel_name" value={formData.hostel_name} onChange={handleChange} className="input-field" required>
                                    <option value="">Select Hostel</option>
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
                                {formData.gender && (
                                    <input
                                        name="room_number"
                                        type="number"
                                        placeholder="Room No (1-50)"
                                        min="1" max="50"
                                        value={formData.room_number}
                                        onChange={handleChange}
                                        className="input-field"
                                        required
                                    />
                                )}
                                {!formData.gender && <p className="text-xs text-red-500 col-span-2">Select gender first.</p>}
                            </div>
                        )}

                        <div className="grid grid-cols-1">
                            <label className="text-xs uppercase font-bold text-gray-500 mb-1 ml-1">Date of Birth (Password)</label>
                            <input
                                name="dob" type="date" value={formData.dob} onChange={handleChange} required
                                className="input-field"
                            />
                        </div>
                    </>
                ) : (
                    <div className="grid grid-cols-1 gap-5">
                        <div className="grid grid-cols-2 gap-5">
                            <select name="role" value={formData.role} onChange={handleChange} className="input-field font-bold text-blue-900">
                                {allowedRoles.filter(r => r !== 'student').map(r => (
                                    <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
                                ))}
                            </select>
                            <input
                                name="password" type="password" placeholder="Assign Password" value={formData.password} onChange={handleChange} required
                                className="input-field"
                            />
                        </div>

                        {['faculty', 'hod'].includes(formData.role) && (
                            <select name="department" value={formData.department} onChange={handleChange} className="input-field" required>
                                <option value="">Select Department</option>
                                <option value="CSE">CSE</option>
                                <option value="ECE">ECE</option>
                                <option value="EEE">EEE</option>
                                <option value="MECH">MECH</option>
                                <option value="CIVIL">CIVIL</option>
                            </select>
                        )}

                        {formData.role === 'warden' && (
                            <select name="hostel_name" value={formData.hostel_name} onChange={handleChange} className="input-field" required>
                                <option value="">Assign Hostel</option>
                                <option value="B1">Boys Hostel 1 (B1)</option>
                                <option value="B2">Boys Hostel 2 (B2)</option>
                                <option value="B3">Boys Hostel 3 (B3)</option>
                                <option value="G1">Girls Hostel 1 (G1)</option>
                                <option value="G2">Girls Hostel 2 (G2)</option>
                                <option value="G3">Girls Hostel 3 (G3)</option>
                            </select>
                        )}
                    </div>
                )}
                <button type="submit" className="w-full bg-blue-900 text-white py-3 rounded-md font-bold shadow-sm hover:bg-blue-800 transition-colors mt-4">
                    {isEditing ? 'Update Member' : 'Create Member'}
                </button>
                {message && <div className={`text-center mt-4 p-2 rounded text-sm ${message.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{message}</div>}
            </form>
        </div>
    );
};

export default UserRegistrationForm;
