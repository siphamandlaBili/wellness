import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { User, Briefcase, Users, Settings } from 'lucide-react'; // Alternative icons

const SuperAdminDashboard = () => {
    return (
        <div className='min-h-screen'>
            {/* Navbar for Super Admin */}
            <Navbar isSuperAdmin={true} />

            {/* Sidebar */}
            <div className='flex items-start'>
                <div className='inline-block min-h-screen border-3 border-gray-200 w-64 bg-gray-100 p-5'>
                    <ul className='flex flex-col text-gray-800'>
                        {[
                            { name: 'Manage Admins', path: 'manage-admins', icon: <User size={20} /> },
                            { name: 'Manage Nurses', path: 'manage-nurses', icon: <Briefcase size={20} /> },
                            { name: 'View Reports', path: 'reports', icon: <Users size={20} /> },
                            { name: 'Settings', path: 'settings', icon: <Settings size={20} /> }
                        ].map((item) => (
                            <NavLink 
                                key={item.path}
                                to={`/superadmin/${item.path}`}
                                className={({ isActive }) => `flex items-center p-3 gap-2 w-full hover:bg-gray-200 ${isActive ? 'bg-purple-200 border-r-4 border-purple-700' : ''}`}
                            >
                                {item.icon}
                                <span>{item.name}</span>
                            </NavLink>
                        ))}
                    </ul>
                </div>
                
                {/* Main Content */}
                <div className='flex-1 p-5'>
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default SuperAdminDashboard;
