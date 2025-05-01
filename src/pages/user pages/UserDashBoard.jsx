import React, { useEffect } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { assets } from '../../assets/assets';
import Navbar from '../../components/Navbar';
import { CgProfile } from "react-icons/cg";
import axios from 'axios';

const UserDashboard = () => {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (location.pathname.startsWith('/user-dashboard')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [location]);

    const handleLogout = async (e) => {
        e.preventDefault();
        try {
            await axios.post(
                'https://wellness-backend-ntls.onrender.com/api/v1/logout',
                {},
                { withCredentials: true }
            );
            // Clear any cached data
            localStorage.removeItem('eventsCache');
            localStorage.removeItem('user');
            // Redirect to home page
            navigate('/');
        } catch (error) {
            console.error('Logout failed:', error);
            navigate('/');
        }
    };

    return (
        <div className='min-h-screen'>
            <Navbar />

            <div className='flex items-start dark:bg-gray-900 min-h-screen'>
                <div className='min-h-[90vh] border-3 border-r-[#eeeeee] border-b-transparent border-l-transparent border-t-transparent flex flex-col justify-between dark:border-gray-700 bg-white dark:bg-gray-800'>
                    <ul className='flex flex-col items-start pt-5 text-gray-800 dark:text-gray-300'>
                        {['profile','applications', 'apply-for-event', 'reports','analytics'].map((item) => (
                            <NavLink
                                key={item}
                                className={({ isActive }) => `relative flex items-center p-3 sm:px-6 gap-2 w-full dark:hover:bg-gray-700 hover:bg-gray-100 ${isActive ? 'bg-[#f2d9eb] border-r-4 dark:bg-purple-900 dark:border-purple-400 border-[#992787]' : ''}`}
                                to={`/user-dashboard/${item}`}
                            >
                                <img
                                    className='min-w-4 dark:invert'
                                    src={
                                        item === 'profile' ? "https://img.icons8.com/?size=28&id=H101gtpJBVoh&format=png&color=000000" :
                                        item === 'apply-for-event' ? "https://img.icons8.com/?size=28&id=bG85sXmXRhPG&format=png&color=000000" :
                                        item === 'applications'?"https://img.icons8.com/?size=30&id=RYcCGyq4E6Bv&format=png&color=000000" :
                                        item === 'reports'? "https://img.icons8.com/?size=28&id=123822&format=png&color=000000":
                                        "https://img.icons8.com/?size=28&id=rjMOGEY1NKlC&format=png&color=000000"
                                    }
                                    alt={item}
                                />
                                <p className='max-sm:hidden'>
                                    {item === 'profile' ? 'Profile' :
                                        item==='apply-for-event'?'Apply for Event':
                                        item === 'applications' ? 'View Applications' :
                                        item === 'reports'? 'Reports':
                                        'Analytics'
                                        }
                                </p>
                            </NavLink>
                        ))}
                    </ul>

                    {/* Updated Logout with onClick handler */}
                    <button
                        onClick={handleLogout}
                        className="relative dark:hover:bg-gray-700 flex items-center p-3 sm:px-6 gap-2 w-full hover:bg-gray-100 mb-10 text-gray-800 dark:text-gray-300"
                    >
                        <img 
                            className='min-w-4 dark:invert' 
                            src="https://img.icons8.com/?size=28&id=gH60rKrZnbX9&format=png&color=000000" 
                            alt="Logout"
                        />
                        <p className='max-sm:hidden'>
                            Logout
                        </p>
                    </button>
                </div>

                <div className="flex-1 p-5 dark:bg-gray-900 dark:text-gray-100 max-h-[90vh] overflow-y-auto">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;