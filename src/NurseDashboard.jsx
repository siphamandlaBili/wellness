import React, { useEffect } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import { User, Briefcase, Users, BarChart2 } from 'lucide-react';

const NurseDashboard = () => {
    const location = useLocation();

    useEffect(() => {
        // Disable body scroll on `/nurse` routes
        if (location.pathname.startsWith('/nurse')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = ''; // Reset on unmount
        };
    }, [location]);

    return (
        <div className="min-h-screen">
            {/* Navbar */}
            <Navbar isSuperAdmin={true} />

            {/* Main Layout */}
            <div className="flex items-start overflow-hidden min-h-[calc(100vh-64px)]">
                {/* Sidebar */}
                <div className="flex dark:bg-gray-900 flex-col justify-between min-h-[90vh] border-r border-[#eeeeee]">
                    <ul className="flex  dark:text-gray-300 flex-col items-start pt-5 text-gray-800">
                        {[
                            { name: 'Event', path: 'events', icon: "https://img.icons8.com/?size=28&id=nGCq83WiIaj1&format=png&color=000000" },
                            { name: 'Patients', path: 'patients', icon: "https://img.icons8.com/?size=28&id=nFyiWLVR8Zrt&format=png&color=000000" },
                            { name: 'Event', path: 'events', icon: "https://img.icons8.com/?size=28&id=nGCq83WiIaj1&format=png&color=000000" },
                            { name: 'Referrals', path: 'referrals', icon: "https://img.icons8.com/?size=28&id=gf7HkPc5t1hF&format=png&color=000000" },
                            { name: 'Report', path: 'reports', icon: "https://img.icons8.com/?size=28&id=nGCq83WiIaj1&format=png&color=000000" },
                            { name: 'Analytics', path: 'analytics', icon: "https://img.icons8.com/?size=28&id=123822&format=png&color=000000" }
                        ].map((item) => (
                            <NavLink
                                key={item.path}
                                to={`/nurse/${item.path}`}
                                className={({ isActive }) =>
                                    `relative flex items-center dark:hover:bg-gray-700 p-3 sm:px-6 gap-2 w-full hover:bg-gray-100 ${isActive ? 'bg-[#f2d9eb] dark:bg-purple-900 dark:border-purple-400 border-r-4 border-[#992787]' : ''
                                    }`
                                }
                            >
                                <img className='min-w-4 dark:invert' src={item.icon} alt="icon" />
                                <p className="max-sm:hidden">{item.name}</p>
                            </NavLink>
                        ))}
                    </ul>

                    {/* Logout Link */}
                    <NavLink
                        className={({ isActive }) =>
                            `relative flex items-center p-3 dark:hover:bg-gray-700 sm:px-6 gap-2 w-full hover:bg-gray-100 mb-10 ${isActive ? 'bg-[#f2d9eb]  dark:bg-purple-900 dark:border-purple-400 border-r-4 border-[#992787]' : ''
                            }`
                        }
                        to={`/`}
                    >
                        <div className="min-w-4 dark:invert">
                            <img src="https://img.icons8.com/?size=28&id=gH60rKrZnbX9&format=png&color=000000" alt="" />
                        </div>
                        <p className="max-sm:hidden">Logout</p>
                    </NavLink>
                </div>

                {/* Main Content */}
                <div className="flex-1 max-h-[calc(100vh-64px)] overflow-y-auto p-5 md:p-2">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default NurseDashboard;
