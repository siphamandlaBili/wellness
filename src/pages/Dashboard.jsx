import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { assets } from '../assets/assets';
import Navbar from '../components/Navbar';

const Dashboard = () => {
    return (
        <div className='min-h-screen'>
            {/* Navbar for recruiter panel */}
            <Navbar />

            {/* Sidebar with navigation links */}
            <div className='flex items-start'>
                {/* Left sidebar */}
                <div className='inline-block min-h-screen border-3 border-[#eeeeee]'>
                    <ul className='flex flex-col items-start pt-5 text-gray-800'>
                        {['profile', 'view-applications', 'past-events'].map((item) => (
                            <NavLink 
                                key={item}
                                className={({ isActive }) => `relative flex items-center p-3 sm:px-6 gap-2 w-full hover:bg-gray-100 ${isActive ? 'bg-[#f2d9eb] border-r-4 border-[#992787]' : ''}`} 
                                to={`/admin/${item}`} // Updated path to match routing structure
                            >
                                <img 
                                    className='min-w-4' 
                                    src={
                                        item === 'profile' ? assets.person_tick_icon :
                                        item === 'past-events' ? assets.home_icon :
                                        assets.add_icon
                                    } 
                                    alt="" 
                                />
                                <p className='max-sm:hidden'>
                                    {item === 'profile' ? 'Profile' :
                                     item === 'past-events' ? 'Past Events' :
                                     'View Applications'}
                                </p>
                            </NavLink>
                        ))}
                    </ul>
                </div>
                
                {/* Right-side content */}
                <div className="flex-1 p-5">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
