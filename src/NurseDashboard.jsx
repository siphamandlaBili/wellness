import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import { User, Briefcase, Users, BarChart2 } from 'lucide-react';

const NurseDashboard = () => {
    return (
        <div className="min-h-screen overflow-y-hidden">
            {/* Navbar */}
            <Navbar isSuperAdmin={true} />

            {/* Main Layout */}
            <div className="flex items-start overflow-hidden">
                {/* Sidebar */}
                <div className="flex flex-col justify-between min-h-[90vh] border-3 border-[#eeeeee]">
                    <ul className="flex flex-col items-start pt-5 text-gray-800">
                        {[
                            { name: 'Event', path: 'events', icon: <User size={20} /> },
                            { name: 'Patients', path: 'patients', icon: <Briefcase size={20} /> },
                            { name: 'Referrals', path: 'referrals', icon: <Users size={20} /> },
                            { name: 'Analytics', path: 'analytics', icon: <BarChart2 size={20} /> }
                        ].map((item) => (
                            <NavLink
                                key={item.path}
                                to={`/nurse/${item.path}`}
                                className={({ isActive }) =>
                                    `relative flex items-center p-3 sm:px-6 gap-2 w-full hover:bg-gray-100 ${
                                        isActive ? 'bg-[#f2d9eb] border-r-4 border-[#992787]' : ''
                                    }`
                                }
                            >
                                <div className="min-w-4">{item.icon}</div>
                                <p className="max-sm:hidden">{item.name}</p>
                            </NavLink>
                        ))}
                    </ul>

                    {/* Logout Link */}
                    <NavLink
                        className={({ isActive }) =>
                            `relative flex items-center p-3 sm:px-6 gap-2 w-full hover:bg-gray-100 mb-10 ${
                                isActive ? 'bg-[#f2d9eb] border-r-4 border-[#992787]' : ''
                            }`
                        }
                        to={`/`}
                    >
                        <div className="min-w-4">
                            <User size={20} />
                        </div>
                        <p className="max-sm:hidden">Logout</p>
                    </NavLink>
                </div>

                {/* Main Content */}
                <div className="flex-1 p-5 md:p-2">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default NurseDashboard;
