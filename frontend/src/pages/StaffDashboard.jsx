import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserRegistrationForm from '../components/UserRegistrationForm';

const StaffDashboard = ({ user }) => {
    const [view, setView] = useState('grievances'); // 'grievances' or 'members'
    const [grievances, setGrievances] = useState([]);
    const [activeResolution, setActiveResolution] = useState(null); // ID of grievance being resolved
    const [resolutionNote, setResolutionNote] = useState('');
    const [responseFile, setResponseFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    // ...

    const handleResolve = async (id, status) => {
        try {
            let responseUrl = '';
            if (responseFile) {
                setUploading(true);
                const formData = new FormData();
                formData.append('file', responseFile);

                try {
                    const uploadRes = await axios.post('http://127.0.0.1:5000/api/upload', formData, {
                        headers: { 'Content-Type': 'multipart/form-data' }
                    });
                    responseUrl = uploadRes.data.url;
                } catch (uErr) {
                    console.error("Upload failed", uErr);
                    alert("Failed to upload response file.");
                    setUploading(false);
                    return;
                }
                setUploading(false);
            }

            await axios.put(`http://127.0.0.1:5000/api/grievances/resolve/${id}`, {
                status: status,
                resolution_note: resolutionNote,
                response_attachment_url: responseUrl
            });
            fetchGrievances();
            setActiveResolution(null);
            setResolutionNote('');
            setResponseFile(null);
        } catch (err) {
            console.error(err);
            setUploading(false);
        }
    };

    return (
        <div className="p-6 min-h-screen bg-gray-50 text-gray-800">
            <header className="flex justify-between items-center mb-8 border-b border-gray-200 pb-4 bg-white/50 backdrop-blur-sm p-4 rounded-xl">
                <h1 className="text-3xl font-extrabold text-blue-600 tracking-tight">TPGIT <span className="text-gray-400 font-light">| {user?.role === 'principal' ? 'Principal' : user?.role === 'warden' ? 'Warden' : 'Staff'}</span></h1>
                <div className="flex items-center gap-4 text-sm">
                    <span className="font-semibold text-gray-600">{user?.name}</span>
                    <div className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-bold text-xs uppercase">{user?.role}</div>
                </div>
            </header>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 max-w-5xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex gap-4">
                        <button
                            onClick={() => setView('grievances')}
                            className={`text-lg font-bold border-l-4 border-blue-900 pl-3 ${view === 'grievances' ? 'text-gray-700' : 'text-gray-400'}`}
                        >
                            Assigned Grievances
                        </button>
                        {['hod', 'principal'].includes(user?.role) && (
                            <button
                                onClick={() => setView('members')}
                                className={`text-lg font-bold border-l-4 border-purple-900 pl-3 ${view === 'members' ? 'text-gray-700' : 'text-gray-400'}`}
                            >
                                Manage Members
                            </button>
                        )}
                    </div>
                    {view === 'grievances' && (
                        <button onClick={fetchGrievances} className="text-xs text-blue-600 hover:text-blue-800 font-bold uppercase">Refresh List</button>
                    )}
                </div>

                {view === 'members' ? (
                    <UserRegistrationForm
                        allowedRoles={['student', 'faculty']}
                        defaultRole="student"
                    />
                ) : (
                    <div className="space-y-4">
                        {grievances.length === 0 ? (
                            <div className="text-center py-10 text-gray-400 italic">No pending grievances.</div>
                        ) : (
                            grievances.map((g) => (
                                <div key={g.id} className="bg-white border border-gray-200 p-5 rounded-lg hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-3">
                                            <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${g.status === 'Resolved'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {g.status}
                                            </span>
                                            <span className="text-gray-400 text-xs font-mono">{new Date(g.created_at).toLocaleDateString()}</span>
                                            {g.is_anonymous && (
                                                <span className="bg-gray-200 text-gray-600 text-xs px-2 py-0.5 rounded font-bold">Anonymous</span>
                                            )}
                                            {/* Escalation Tag */}
                                            {g.escalation_level !== 'Initial' && g.status !== 'Resolved' && (
                                                <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded font-bold animate-pulse">
                                                    Escalated to: {g.escalation_level}
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-right">
                                            <span className="text-xs text-blue-900 font-bold block uppercase tracking-wide">{g.category}</span>
                                            <span className="text-xs text-gray-500 block">From: {g.user_name}</span>
                                        </div>
                                    </div>

                                    <p className="text-sm text-gray-700 mb-4 pl-2 border-l-2 border-gray-100">{g.description}</p>

                                    {g.attachment_url && (
                                        <div className="mb-4 pl-2">
                                            <p className="text-xs text-gray-500 font-bold uppercase mb-1">Student Attachment:</p>
                                            {g.attachment_url.endsWith('.mp4') || g.attachment_url.endsWith('.mov') ? (
                                                <video controls src={`http://127.0.0.1:5000${g.attachment_url}`} className="max-w-full h-48 rounded border border-gray-200" />
                                            ) : (
                                                <img src={`http://127.0.0.1:5000${g.attachment_url}`} alt="Student Attachment" className="max-w-full h-48 object-cover rounded border border-gray-200" />
                                            )}
                                        </div>
                                    )}

                                    {activeResolution === g.id ? (
                                        <div className="mt-4 bg-gray-50 p-4 rounded border border-blue-100">
                                            <textarea
                                                placeholder="Write your resolution details..."
                                                className="w-full bg-white p-3 text-sm rounded border border-gray-300 focus:border-blue-500 outline-none h-24 mb-3 transition-colors"
                                                value={resolutionNote}
                                                onChange={(e) => setResolutionNote(e.target.value)}
                                            />
                                            <div className="mb-3">
                                                <label className="text-xs uppercase font-bold text-gray-500 mb-1 block">Attach Proof/Response (Optional)</label>
                                                <input
                                                    type="file"
                                                    onChange={(e) => setResponseFile(e.target.files[0])}
                                                    className="block w-full text-xs text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                                />
                                            </div>
                                            <div className="flex gap-3 justify-end">
                                                <button
                                                    onClick={() => { setActiveResolution(null); setResolutionNote(''); }}
                                                    className="px-4 py-2 text-xs font-semibold uppercase text-gray-500 hover:text-gray-700"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={() => handleResolve(g.id, 'Resolved')}
                                                    className="px-6 py-2 bg-green-600 text-white text-xs font-bold uppercase rounded shadow-sm hover:bg-green-700 transition-colors"
                                                >
                                                    Mark Resolved
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex gap-2 justify-end mt-4 pt-4 border-t border-gray-100">
                                            {g.status !== 'Resolved' && (
                                                <button
                                                    onClick={() => setActiveResolution(g.id)}
                                                    className="px-5 py-2 bg-blue-900 text-white text-xs font-bold uppercase rounded hover:bg-blue-800 transition-colors shadow-sm"
                                                >
                                                    Resolve Grievance
                                                </button>
                                            )}
                                            {g.status === 'Resolved' && (
                                                <span className="text-green-600 text-xs font-bold flex items-center gap-1">
                                                    ✓ Resolution Complete
                                                </span>
                                            )}
                                        </div>
                                    )}

                                    {g.resolution_note && g.status === 'Resolved' && (
                                        <div className="mt-4 bg-gray-50 p-3 rounded text-sm text-gray-600 italic border border-gray-100">
                                            <span className="font-bold text-gray-700 not-italic">Note:</span> {g.resolution_note}
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default StaffDashboard;
