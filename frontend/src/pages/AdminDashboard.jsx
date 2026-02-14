import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserRegistrationForm from '../components/UserRegistrationForm';

const AdminDashboard = () => {
    const [view, setView] = useState('add'); // 'add' or 'list'
    const [userType, setUserType] = useState('student');
    const [users, setUsers] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        regno: '',
        dob: '', // Password for student
        password: '', // Password for staff
        role: 'student',
        gender: '',
        year: '',
        department: '',
        hostel_name: ''
    });
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (view === 'list') {
            fetchUsers();
        }
    }, [view]);

    const fetchUsers = async () => {
        try {
            const res = await axios.get('http://127.0.0.1:5000/api/admin/users');
            setUsers(res.data);
        } catch (err) {
            console.error("Failed to fetch users");
        }
    };

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
            hostel_name: ''
        }));
    };

    const [editingId, setEditingId] = useState(null); // ID of user being edited

    const handleEdit = (user) => {
        setEditingId(user.id);
        setUserType(user.role === 'student' ? 'student' : 'staff');
        setFormData({
            name: user.name,
            regno: user.regno,
            dob: user.dob || '',
            password: '', // Don't populate password for security, only update if changed
            role: user.role,
            gender: user.gender || '',
            year: user.year || '',
            department: user.department || '',
            hostel_name: user.hostel_name || '',
            room_number: user.room_number || '',
            is_hosteller: user.is_hosteller || false
        });
        setView('add');
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
            } else if (role === 'warden') {
                delete payload.dob;
                delete payload.year;
                delete payload.department;
            } else {
                // Faculty, HOD, Principal
                delete payload.dob;
                delete payload.year;
                delete payload.hostel_name;
            }

            if (editingId) {
                const res = await axios.put(`http://127.0.0.1:5000/api/admin/users/${editingId}`, payload);
                setMessage(`✅ ${res.data.message}`);
                setEditingId(null);
            } else {
                const res = await axios.post('http://127.0.0.1:5000/api/admin/add-user', payload);
                setMessage(`✅ ${res.data.message}`);
            }

            setFormData({
                name: '', regno: '', dob: '', password: '',
                role: userType === 'student' ? 'student' : 'faculty',
                gender: '',
                year: '', department: '', hostel_name: '', room_number: '', is_hosteller: false
            });
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            setMessage(`❌ ${err.response?.data?.error || 'Operation failed'}`);
        }
    };

    const [stats, setStats] = useState({ total: 0, pending: 0, forwarded: 0 });

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await axios.get('http://127.0.0.1:5000/api/grievances/all');
            const data = res.data;
            const total = data.length;
            const pending = data.filter(g => g.status !== 'Resolved').length;
            const forwarded = data.filter(g => g.escalation_level !== 'Initial').length;
            setStats({ total, pending, forwarded });
        } catch (err) {
            console.error("Failed to fetch stats");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;
        try {
            await axios.delete(`http://127.0.0.1:5000/api/admin/users/${id}`);
            setMessage('✅ User deleted successfully');
            fetchUsers(); // Refresh list
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            setMessage(`❌ ${err.response?.data?.error || 'Failed to delete user'}`);
        }
    };

    return (
        <div className="p-6 min-h-screen bg-gray-50 text-gray-800">
            <header className="flex justify-between items-center mb-8 border-b border-gray-200 pb-4">
                <h1 className="text-3xl font-extrabold text-blue-600 tracking-tight">TPGIT <span className="text-gray-400 font-light">| Admin</span></h1>
                <nav className="flex gap-4">
                    <button
                        onClick={() => setView('add')}
                        className={`px-4 py-2 rounded font-medium uppercase text-sm transition-colors ${view === 'add' ? 'bg-blue-900 text-white shadow-sm' : 'text-gray-500 hover:text-blue-900 hover:bg-gray-100'}`}
                    >
                        New Registration
                    </button>
                    <button
                        onClick={() => setView('list')}
                        className={`px-4 py-2 rounded font-medium uppercase text-sm transition-colors ${view === 'list' ? 'bg-blue-900 text-white shadow-sm' : 'text-gray-500 hover:text-blue-900 hover:bg-gray-100'}`}
                    >
                        User Directory
                    </button>
                    <button
                        onClick={() => window.location.href = '/'}
                        className="px-4 py-2 rounded font-medium uppercase text-sm text-red-500 hover:bg-red-50 transition-colors"
                    >
                        Logout
                    </button>
                </nav>
            </header>

            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
                    <h3 className="text-gray-500 text-sm font-bold uppercase mb-1">Total Complaints</h3>
                    <p className="text-3xl font-extrabold text-gray-800">{stats.total}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
                    <h3 className="text-gray-500 text-sm font-bold uppercase mb-1">Pending Complaints</h3>
                    <p className="text-3xl font-extrabold text-gray-800">{stats.pending}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
                    <h3 className="text-gray-500 text-sm font-bold uppercase mb-1">Forwarded Complaints</h3>
                    <p className="text-3xl font-extrabold text-gray-800">{stats.forwarded}</p>
                </div>
            </div>

            {view === 'add' && (
                <UserRegistrationForm
                    initialData={editingId ? { ...formData, id: editingId } : null}
                    isEditing={!!editingId}
                    onSuccess={() => {
                        setMessage(`✅ User ${editingId ? 'updated' : 'created'} successfully`);
                        setEditingId(null);
                        setFormData({
                            name: '', regno: '', dob: '', password: '',
                            role: 'student',
                            gender: '',
                            year: '', department: '', hostel_name: '', room_number: '', is_hosteller: false
                        });
                        setTimeout(() => setMessage(''), 3000);
                    }}
                    allowedRoles={['student', 'faculty', 'hod', 'warden', 'principal']}
                />
            )}

            {view === 'list' && (
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                    <h2 className="text-xl font-bold mb-6 text-gray-700 border-l-4 border-blue-900 pl-3">Registered Users</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-xs uppercase tracking-wider">
                                    <th className="p-3 font-bold">ID</th>
                                    <th className="p-3 font-bold">Name</th>
                                    <th className="p-3 font-bold">Role</th>
                                    <th className="p-3 font-bold">Details</th>
                                    <th className="p-3 font-bold">Credentials</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {users.map((u) => (
                                    <tr key={u.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                        <td className="p-3 font-semibold text-blue-900">{u.regno}</td>
                                        <td className="p-3 font-medium">{u.name}</td>
                                        <td className="p-3">
                                            <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${u.role === 'admin' ? 'bg-red-100 text-red-700' :
                                                u.role === 'student' ? 'bg-green-100 text-green-700' :
                                                    'bg-blue-100 text-blue-700'
                                                }`}>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="p-3 text-gray-500">
                                            {u.department && <span className="mr-2">Dept: {u.department}</span>}
                                            {u.year && <span className="mr-2">Yr: {u.year}</span>}
                                            {u.hostel_name && <span>Hostel: {u.hostel_name} ({u.room_number})</span>}
                                            <button
                                                onClick={() => handleEdit(u)}
                                                className="ml-4 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 uppercase font-bold"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(u.id)}
                                                className="ml-2 text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200 uppercase font-bold"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                        <td className="p-3 text-gray-500">
                                            {u.role === 'student' ? (
                                                <span>DOB: {u.dob}</span>
                                            ) : (
                                                <span>PWD: {u.password}</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
