import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            {/* Navbar */}
            <nav className="bg-white shadow-md p-4 sticky top-0 z-50 border-b border-gray-100">
                <div className="container mx-auto flex justify-between items-center max-w-6xl">
                    <div className="text-xl md:text-2xl font-bold text-blue-900 tracking-tight">TPGIT Grievance</div>
                    <div className="flex items-center gap-3">
                        <Link to="/" className="text-gray-600 hover:text-blue-600 font-medium">Home</Link>
                        <Link to="/register" className="text-gray-600 hover:text-blue-600 font-medium">Register</Link>
                        <Link to="/login" className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition font-semibold">Login</Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="bg-gradient-to-br from-blue-900 to-blue-700 text-white py-20 text-center px-4">
                <h1 className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight">Thanthai Periyar Government Institute of Technology</h1>
                <p className="text-lg md:text-xl mb-2 opacity-95">Grievance Redressal Portal</p>
                <p className="text-base md:text-lg mb-8 max-w-2xl mx-auto opacity-90">A streamlined platform to voice your concerns and get them resolved efficiently.</p>
                <div className="flex justify-center gap-4 flex-wrap">
                    <Link to="/login" className="px-8 py-3 bg-white text-blue-900 font-bold rounded-lg hover:bg-gray-100 transition shadow-md">Login</Link>
                    <Link to="/register" className="px-8 py-3 border-2 border-white text-white font-bold rounded-lg hover:bg-white/10 transition">Register</Link>
                </div>
            </header>

            {/* Features Section */}
            <section className="py-16 container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">How We Help</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Feature 1 */}
                    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition text-center group">
                        <div className="h-48 mb-4 overflow-hidden rounded-lg bg-blue-100 flex items-center justify-center">
                            <span className="text-4xl">🤝</span>
                        </div>
                        <h3 className="text-xl font-bold mb-2 text-blue-600">Helping Hand</h3>
                        <p className="text-gray-600">We are here to support you through every step of your academic journey.</p>
                    </div>

                    {/* Feature 2 */}
                    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition text-center group">
                        <div className="h-48 mb-4 overflow-hidden rounded-lg bg-green-100 flex items-center justify-center">
                            <span className="text-4xl">📥</span>
                        </div>
                        <h3 className="text-xl font-bold mb-2 text-blue-600">Easy Submission</h3>
                        <p className="text-gray-600">Submit your grievances easily through our user-friendly interface.</p>
                    </div>

                    {/* Feature 3 */}
                    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition text-center group">
                        <div className="h-48 mb-4 overflow-hidden rounded-lg bg-yellow-100 flex items-center justify-center">
                            <span className="text-4xl">📂</span>
                        </div>
                        <h3 className="text-xl font-bold mb-2 text-blue-600">Track Progress</h3>
                        <p className="text-gray-600">Monitor the status of your complaints in real-time with full transparency.</p>
                    </div>

                    {/* Feature 4 */}
                    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition text-center group">
                        <div className="h-48 mb-4 overflow-hidden rounded-lg bg-purple-100 flex items-center justify-center">
                            <span className="text-4xl">✅</span>
                        </div>
                        <h3 className="text-xl font-bold mb-2 text-blue-600">Quick Resolution</h3>
                        <p className="text-gray-600">Our dedicated team works hard to resolve your issues as fast as possible.</p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-800 text-white py-8 text-center mt-auto">
                <p className="text-sm">&copy; {new Date().getFullYear()} TPGIT Grievance Redressal Portal. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Landing;
