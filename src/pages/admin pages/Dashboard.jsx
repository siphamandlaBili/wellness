import React, { useEffect } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { assets } from '../../assets/assets';
import Navbar from '../../components/Navbar';
import { UserContext } from '../../../context/authContext';

const Dashboard = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = React.useContext(UserContext);

    // Authentication and scroll control
     React.useEffect(() => {
    const timer = setTimeout(() => {
        if (user?.role !== 'admin') {
            navigate('/'); // Redirect after 1.5 seconds
        }
    }, 500); // 1500 milliseconds = 1.5 seconds

    return () => clearTimeout(timer); // Cleanup on unmount
}, [user, navigate]);

    // Show loading spinner while checking auth status
    if (!user || user?.role !== 'admin') {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    return (
        <div className='min-h-screen'>
            <Navbar />

            <div className='flex items-start min-h-screen overflow-hidden dark:bg-gray-900'>
                {/* Left sidebar */}
                <div className='flex flex-col justify-between min-h-[90vh] border-3 border-[#eeeeee] dark:border-gray-700 bg-white dark:bg-gray-800'>
                    <ul className='flex flex-col items-start pt-5 text-gray-800 dark:text-gray-300'>
                        {['profile', 'view-applications', 'past-events', 'assign-event', 'analytics'].map((item) => (
                            <NavLink
                                key={item}
                                className={({ isActive }) =>
                                    `relative flex items-center p-3 sm:px-6 gap-2 w-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                                        isActive 
                                            ? 'bg-[#f2d9eb] dark:bg-purple-900 border-r-4 border-[#992787] dark:border-purple-400' 
                                            : ''
                                    }`
                                }
                                to={`/admin/${item}`}
                            >
                                <img
                                    className='min-w-4 h-6 dark:invert'
                                    src={
                                        item === 'profile' ? "https://img.icons8.com/?size=28&id=H101gtpJBVoh&format=png&color=000000" :
                                        item === 'past-events' ? "https://img.icons8.com/?size=28&id=nGCq83WiIaj1&format=png&color=000000" :
                                        item === 'assign-event' ? "https://img.icons8.com/?size=100&id=rCVDCgFrMyRJ&format=png&color=000000":
                                        item === 'analytics' ? "https://img.icons8.com/?size=100&id=rjMOGEY1NKlC&format=png&color=000000" :
                                        "https://img.icons8.com/?size=28&id=RYcCGyq4E6Bv&format=png&color=000000"
                                    }
                                    alt={item + " icon"}
                                />
                                <p className='max-sm:hidden dark:text-gray-200'>
                                    {item === 'profile' && 'Profile'}
                                    {item === 'past-events' && 'Past Events'}
                                    {item === 'view-applications' && 'View Applications'}
                                    {item === 'assign-event' && 'Assign Event'}
                                    {item === 'reports' && 'Reports'}
                                </p>
                            </NavLink>
                        ))}
                    </ul>

                    <NavLink
                        className={({ isActive }) =>
                            `relative flex items-center p-3 sm:px-6 gap-2 w-full hover:bg-gray-100 dark:hover:bg-gray-700 mb-10 transition-colors ${
                                isActive 
                                    ? 'bg-[#f2d9eb] dark:bg-purple-900 border-r-4 border-[#992787] dark:border-purple-400' 
                                    : ''
                            }`
                        }
                        to={'/'}
                    >
                        <img 
                            className='min-w-4 h-6 dark:invert' 
                            src={assets.person_tick_icon} 
                            alt="Logout" 
                        />
                        <p className='max-sm:hidden dark:text-gray-200'>Logout</p>
                    </NavLink>
                </div>

                {/* Right-side content */}
                <div className="flex-1 p-6 overflow-y-auto max-h-[90vh] bg-gray-50 dark:bg-gray-900 dark:text-gray-100">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;