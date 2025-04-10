import React, { useEffect } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { assets } from '../assets/assets';
import Navbar from '../components/Navbar';

const Dashboard = () => {
    const location = useLocation();

    // UseEffect to disable scrolling on the body when on /admin path
    useEffect(() => {
        if (location.pathname.startsWith('/admin')) {
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
            <div className='flex items-start min-h-screen overflow-hidden'>
                {/* Left sidebar */}
                <div className='flex flex-col justify-between min-h-[90vh] border-3 border-[#eeeeee]'>
                    <ul className='flex flex-col items-start pt-5 text-gray-800'>
                        {['profile', 'view-applications', 'past-events', 'assign-event', 'analytics'].map((item) => (
                            <NavLink
                                key={item}
                                className={({ isActive }) =>
                                    `relative flex items-center p-3 sm:px-6 gap-2 w-full hover:bg-gray-100 ${isActive ? 'bg-[#f2d9eb] border-r-4 border-[#992787]' : ''}`
                                }
                                to={`/admin/${item}`}
                            >
                                <img
                                    className='min-w-4'
                                    src={
                                        item === 'profile' ? assets.person_tick_icon :
                                            item === 'past-events' ? assets.home_icon :
                                                item === 'assign-event' ? assets.add_icon :
                                                    item === 'analytics' ? assets.analytics_icon || assets.home_icon :
                                                        assets.add_icon
                                    }
                                    alt=""
                                />
                                <p className='max-sm:hidden'>
                                    {item === 'profile' ? 'Profile' :
                                        item === 'past-events' ? 'Past Events' :
                                            item === 'view-applications' ? 'View Applications' :
                                                item === 'assign-event' ? 'Assign Event to Nurse' :
                                                    item === 'analytics' ? 'Analytics' :
                                                        ''}
                                </p>
                            </NavLink>
                        ))}
                    </ul>

                    <NavLink
                        className={({ isActive }) =>
                            `relative flex items-center p-3 sm:px-6 gap-2 w-full hover:bg-gray-100 mb-10 ${isActive ? 'bg-[#f2d9eb] border-r-4 border-[#992787]' : ''}`
                        }
                        to={`/`}
                    >
                        <img className='min-w-4' src={assets.person_tick_icon} alt="Logout Icon" />
                        <p className='max-sm:hidden'>Logout</p>
                    </NavLink>
                </div>

                {/* Right-side content */}
                <div className="flex-1 p-0 overflow-y-auto max-h-[90vh]">
                    {/* Outlet that should be scrollable */}
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
