import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const StudentDashboard = ({ user, setUser }) => {
    const navigate = useNavigate();
    const [grievance, setGrievance] = useState({
        user_id: user?.id,
        category: 'academic',
        target_role: '',
        target_staff_id: '',
        description: '',
        is_anonymous: false
    });
    const [uploading, setUploading] = useState(false);
    const [status, setStatus] = useState([]);
    const [staffList, setStaffList] = useState([]);
    const [submitError, setSubmitError] = useState('');

    // ... (inside component)

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        setUploading(true);
        try {
            const res = await axios.post('http://127.0.0.1:5000/api/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setGrievance(prev => ({ ...prev, attachment_url: res.data.url }));
        } catch (err) {
            console.error("Upload failed", err);
            alert("File upload failed. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitError('');
        try {
            await axios.post('http://127.0.0.1:5000/api/grievances/submit', { ...grievance, user_id: user.id });
            setGrievance({ ...grievance, description: '', target_staff_id: '', attachment_url: '' }); // Clear URL
            fetchGrievances();
        } catch (err) {
            setSubmitError(err.response?.data?.error || 'Failed to submit grievance. Please try again.');
        }
    };

    useEffect(() => {
        if (user) {
            setGrievance(prev => ({ ...prev, user_id: user.id }));
            fetchGrievances();
        }
        fetchStaff();
    }, [user]);

    const fetchStaff = async () => {
        try {
            const res = await axios.get('http://127.0.0.1:5000/api/users/staff');
            setStaffList(res.data);
        } catch (err) {
            console.error("Failed to fetch staff");
        }
    };

    const fetchGrievances = async () => {
        try {
            const res = await axios.get(`http://127.0.0.1:5000/api/grievances/my?user_id=${user.id}`);
            setStatus(res.data);
        } catch (err) {
            console.error(err);
        }
    };



    return (
        <div className="p-6 min-h-screen bg-gray-50 text-gray-800">
            <header className="flex justify-between items-center mb-8 border-b border-gray-200 pb-4 bg-white/50 backdrop-blur-sm p-4 rounded-xl">
                <h1 className="text-3xl font-extrabold text-blue-600 tracking-tight">TPGIT <span className="text-gray-400 font-light">| Student</span></h1>
                <div className="flex items-center gap-4 text-sm">
                    <span className="font-semibold text-gray-600">{user?.name}</span>
                    <span className="text-gray-400">|</span>
                    <span className="font-mono text-gray-500">{user?.regno}</span>
                    <button onClick={() => { setUser?.(null); navigate('/'); }} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition">Logout</button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Submit Form */}
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                    <h2 className="text-lg font-bold mb-6 text-gray-700 border-l-4 border-blue-900 pl-3">
                        Submit New Grievance
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {submitError && (
                            <div className="bg-red-50 text-red-700 text-sm p-3 rounded border border-red-200">{submitError}</div>
                        )}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs uppercase font-bold text-gray-500 mb-1">Category</label>
                                <select
                                    className="input-field"
                                    value={grievance.category}
                                    onChange={(e) => setGrievance({ ...grievance, category: e.target.value })}
                                >
                                    <option value="academic">Academic</option>
                                    <option value="administrative">Administrative</option>
                                    <option value="examination">Examination</option>
                                    <option value="hostel">Hostel</option>
                                    <option value="indoor">Indoor</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            {grievance.category === 'academic' && (
                                <div>
                                    <label className="block text-xs uppercase font-bold text-gray-500 mb-1">Select Faculty (Optional)</label>
                                    <select
                                        className="input-field border-blue-300 ring-1 ring-blue-100"
                                        value={grievance.target_staff_id}
                                        onChange={(e) => setGrievance({ ...grievance, target_staff_id: e.target.value })}
                                    >
                                        <option value="">-- General Department Grievance --</option>
                                        {staffList.filter(s => ['faculty', 'hod', 'principal'].includes(s.role)).map(s => (
                                            <option key={s.id} value={s.id}>{s.name} ({s.role}{s.department ? `, ${s.department}` : ''})</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {grievance.category === 'hostel' && (
                                <div>
                                    <label className="block text-xs uppercase font-bold text-gray-500 mb-1">Select Warden (Optional)</label>
                                    <select
                                        className="input-field border-blue-300 ring-1 ring-blue-100"
                                        value={grievance.target_staff_id}
                                        onChange={(e) => setGrievance({ ...grievance, target_staff_id: e.target.value })}
                                    >
                                        <option value="">-- General Hostel Grievance --</option>
                                        {staffList.filter(s => s.role === 'warden' || s.role === 'principal').map(s => (
                                            <option key={s.id} value={s.id}>{s.name} ({s.hostel_name || s.role})</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {grievance.category === 'administrative' && (
                                <div>
                                    <label className="block text-xs uppercase font-bold text-gray-500 mb-1">Select Office Staff (Optional)</label>
                                    <select
                                        className="input-field border-blue-300 ring-1 ring-blue-100"
                                        value={grievance.target_staff_id}
                                        onChange={(e) => setGrievance({ ...grievance, target_staff_id: e.target.value })}
                                    >
                                        <option value="">-- General Administrative Grievance --</option>
                                        {staffList.filter(s => ['office_staff', 'principal'].includes(s.role)).map(s => (
                                            <option key={s.id} value={s.id}>{s.name} ({s.role})</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {grievance.category === 'examination' && (
                                <div>
                                    <label className="block text-xs uppercase font-bold text-gray-500 mb-1">Select Exam Cell Officer (Optional)</label>
                                    <select
                                        className="input-field border-blue-300 ring-1 ring-blue-100"
                                        value={grievance.target_staff_id}
                                        onChange={(e) => setGrievance({ ...grievance, target_staff_id: e.target.value })}
                                    >
                                        <option value="">-- General Examination Grievance --</option>
                                        {staffList.filter(s => s.role === 'exam_cell').map(s => (
                                            <option key={s.id} value={s.id}>{s.name} ({s.role})</option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs uppercase font-bold text-gray-500 mb-1">Description</label>
                            <textarea
                                placeholder="Describe your issue in detail..."
                                className="input-field h-32"
                                value={grievance.description}
                                onChange={(e) => setGrievance({ ...grievance, description: e.target.value })}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs uppercase font-bold text-gray-500 mb-1">Attachment (Image/Video) - Optional</label>
                            <input
                                type="file"
                                onChange={handleFileChange}
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                accept="image/*,video/*"
                            />
                            {uploading && <p className="text-xs text-blue-500 mt-1">Uploading...</p>}
                            {grievance.attachment_url && <p className="text-xs text-green-600 mt-1">✅ File attached successfully</p>}
                        </div>

                        <div className="flex items-center gap-2 mb-4 bg-gray-50 p-2 rounded w-fit border border-gray-200">
                            <input
                                type="checkbox"
                                id="anon"
                                className="w-4 h-4 cursor-pointer text-blue-900 focus:ring-blue-900"
                                checked={grievance.is_anonymous}
                                onChange={(e) => setGrievance({ ...grievance, is_anonymous: e.target.checked })}
                            />
                            <label htmlFor="anon" className="text-sm font-semibold text-gray-700 cursor-pointer select-none">Submit Anonymously</label>
                        </div>

                        <button type="submit" className="w-full bg-blue-900 text-white py-2.5 rounded font-bold shadow-sm hover:bg-blue-800 transition-colors">
                            Submit Grievance
                        </button>
                    </form>
                </div>

                {/* Status Tracking */}
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 max-h-[800px] overflow-y-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-bold text-gray-700 border-l-4 border-blue-900 pl-3">
                            Track Grievances
                        </h2>
                        <button onClick={fetchGrievances} className="text-xs text-blue-600 hover:text-blue-800 font-bold uppercase">Refresh</button>
                    </div>

                    <div className="space-y-6">
                        {status.length === 0 ? (
                            <div className="text-center py-10 text-gray-400 italic">No grievances submitted yet.</div>
                        ) : (
                            status.map((g) => (
                                <div key={g.id} className="bg-gray-50 border border-gray-200 p-5 rounded-lg hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex flex-col">
                                            <span className={`w-fit px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider mb-1 ${g.status === 'Resolved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {g.status}
                                            </span>
                                            <span className="text-xs text-gray-500 font-mono">ID: #{g.id} • {new Date(g.created_at).toLocaleDateString()}</span>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-xs text-blue-900 font-bold block uppercase">{g.category}</span>
                                        </div>
                                    </div>

                                    <p className="text-sm text-gray-700 mb-4">{g.description}</p>

                                    {/* Attachment Display */}
                                    {g.attachment_url && (
                                        <div className="mb-4">
                                            {g.attachment_url.endsWith('.mp4') || g.attachment_url.endsWith('.mov') || g.attachment_url.endsWith('.avi') ? (
                                                <video controls src={`http://127.0.0.1:5000${g.attachment_url}`} className="max-w-full h-48 rounded border border-gray-200" />
                                            ) : (
                                                <img src={`http://127.0.0.1:5000${g.attachment_url}`} alt="Attachment" className="max-w-full h-48 object-cover rounded border border-gray-200" />
                                            )}
                                        </div>
                                    )}

                                    {/* Escalation Tracker */}
                                    {g.status !== 'Resolved' && (
                                        <div className="mt-4 mb-4">
                                            <div className="text-xs font-bold text-gray-500 uppercase mb-2">Escalation Status</div>
                                            <div className="flex items-center relative">
                                                <div className={`flex-1 h-1 ${['Initial', 'HOD', 'Principal'].includes(g.escalation_level) ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
                                                <div className={`flex-1 h-1 ${['HOD', 'Principal'].includes(g.escalation_level) ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
                                                <div className={`flex-1 h-1 ${['Principal'].includes(g.escalation_level) ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
                                            </div>
                                            <div className="flex justify-between text-[10px] text-gray-500 font-bold mt-1 uppercase">
                                                <span className={g.escalation_level === 'Initial' ? 'text-blue-600' : ''}>Logged</span>
                                                <span className={g.escalation_level === 'HOD' ? 'text-blue-600' : ''}>HOD</span>
                                                <span className={g.escalation_level === 'Principal' ? 'text-blue-600' : ''}>Principal</span>
                                            </div>
                                        </div>
                                    )}

                                    {g.resolution_note && (
                                        <div className="mt-3 bg-white p-3 rounded border border-l-4 border-l-green-500 border-gray-200 shadow-sm">
                                            <p className="text-xs text-green-700 font-bold uppercase mb-1">Response:</p>
                                            <p className="text-sm text-gray-600 italic">"{g.resolution_note}"</p>

                                            {g.response_attachment_url && (
                                                <div className="mt-2">
                                                    {g.response_attachment_url.endsWith('.mp4') || g.response_attachment_url.endsWith('.mov') ? (
                                                        <video controls src={`http://127.0.0.1:5000${g.response_attachment_url}`} className="max-w-full h-32 rounded border border-gray-200" />
                                                    ) : (
                                                        <img src={`http://127.0.0.1:5000${g.response_attachment_url}`} alt="Response Attachment" className="max-w-full h-32 object-cover rounded border border-gray-200" />
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
