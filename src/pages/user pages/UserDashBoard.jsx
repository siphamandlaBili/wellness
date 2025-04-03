import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { assets } from '../../assets/assets';
import Navbar from '../../components/Navbar';

const UserDashboard = () => {
    return (
        <div className='min-h-screen'>
            {/* Navbar for recruiter panel */}
            <Navbar />

            {/* Sidebar with navigation links */}
            <div className='flex items-start min-h-screen'>
                {/* Left sidebar */}
                <div className=' min-h-[90vh] border-3 border-r-[#eeeeee] border-b-transparent border-l-transparent border-t-transparent flex flex-col justify-between'>
                    <ul className='flex flex-col items-start pt-5 text-gray-800'>
                        {['profile', 'applications', 'apply-for-event'].map((item) => (
                            <NavLink
                                key={item}
                                className={({ isActive }) => `relative flex items-center p-3 sm:px-6 gap-2 w-full hover:bg-gray-100 ${isActive ? 'bg-[#f2d9eb] border-r-4 border-[#992787]' : ''}`}
                                to={`/user-dashboard/${item}`} // Updated path to match routing structure
                            >
                                <img
                                    className='min-w-4'
                                    src={
                                        item === 'profile' ? assets.person_tick_icon :
                                        item === 'apply-for-event' ? assets.home_icon :
                                        assets.add_icon
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
                        className={({ isActive }) => `relative flex items-center p-3 sm:px-6 gap-2 w-full hover:bg-gray-100 mb-10 ${isActive ? 'bg-[#f2d9eb] border-r-4 border-[#992787]' : ''}`}
                        to={`/`}
                    >
                        <img className='min-w-4' src={assets.person_tick_icon} />
                        <p className='max-sm:hidden'>
                            Logout
                        </p>
                    </NavLink>
                </div>

                {/* Right-side content */}
                <div className="flex-1 p-5">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
