import React, { useEffect } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { assets } from '../../assets/assets';
import Navbar from '../../components/Navbar';
import { CgProfile } from "react-icons/cg";
const UserDashboard = () => {
    const location = useLocation();

    // UseEffect to disable scrolling on the body when on /user-dashboard path
    useEffect(() => {
        if (location.pathname.startsWith('/user-dashboard')) {
            document.body.style.overflow = 'hidden'; // Disable body scroll
        } else {
            document.body.style.overflow = ''; // Reset body scroll on other routes
        }

        // Cleanup to reset when leaving the route
        return () => {
            document.body.style.overflow = ''; // Ensure scroll is re-enabled when component unmounts
        };
    }, [location]);

    return (
        <div className='min-h-screen'>
            {/* Navbar for recruiter panel */}
            <Navbar />

            {/* Sidebar with navigation links */}
            <div className='flex items-start dark:bg-gray-900 min-h-screen'>
                {/* Left sidebar */}
                <div className='min-h-[90vh] border-3 border-r-[#eeeeee] border-b-transparent border-l-transparent border-t-transparent flex flex-col justify-between dark:border-gray-700 bg-white dark:bg-gray-800'>
                    <ul className='flex flex-col items-start pt-5 text-gray-800 dark:text-gray-300'>
                        {['profile', 'applications', 'apply-for-event'].map((item) => (
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
                                        "https://img.icons8.com/?size=30&id=RYcCGyq4E6Bv&format=png&color=000000"
                                    }
                                    alt={item}
                                />
                                <p className='max-sm:hidden'>
                                    {item === 'profile' ? 'Profile' :
                                        item === 'applications' ? 'View Applications' :
                                        'Apply for Event'}
                                </p>
                            </NavLink>
                        ))}
                    </ul>

                    {/* Logout at the bottom */}
                    <NavLink
                        className={({ isActive }) => `relative  dark:hover:bg-gray-700 flex items-center p-3 sm:px-6 gap-2 w-full hover:bg-gray-100 mb-10 ${isActive ? 'bg-[#f2d9eb] dark:bg-purple-900 border-r-4  dark:border-purple-400 border-[#992787]' : ''}`}
                        to={`/`}
                    >
                        <img className='min-w-4 dark:invert' src="https://img.icons8.com/?size=28&id=gH60rKrZnbX9&format=png&color=000000" />
                        <p className='max-sm:hidden dark:text-gray-200'>
                            Logout
                        </p>
                    </NavLink>
                </div>

                {/* Right-side content */}
                <div className="flex-1 p-5 dark:bg-gray-900 dark:text-gray-100 max-h-[90vh] overflow-y-auto">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
