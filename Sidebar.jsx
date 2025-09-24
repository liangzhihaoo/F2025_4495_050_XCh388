import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = ({ open = true, onClose }) => {
    return (
        <aside className={`fixed md:static inset-y-0 left-0 z-40 w-64 bg-[#13121A] border-r border-[#2A2740] transform transition-transform ${open ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
            <div className="h-16 border-b border-[#2A2740] flex items-center justify-between px-4 md:hidden">
                <span className="text-white/80 text-base">Menu</span>
                <button className="p-2 rounded hover:bg-white/5 cursor-pointer" onClick={onClose} aria-label="Close sidebar">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            <nav className="py-3">
                <NavLink to="/admin" className={({ isActive }) => `block px-4 py-2 text-sm ${isActive ? 'text-white bg-[#1B1A24]' : 'text-white/80 hover:bg-white/5'} cursor-pointer`} end>
                    Dashboard
                </NavLink>
                <NavLink to="/admin/users" className={({ isActive }) => `block px-4 py-2 text-sm ${isActive ? 'text-white bg-[#1B1A24]' : 'text-white/80 hover:bg-white/5'} cursor-pointer`}>
                    Users
                </NavLink>
                <NavLink to="/admin/roles" className={({ isActive }) => `block px-4 py-2 text-sm ${isActive ? 'text-white bg-[#1B1A24]' : 'text-white/80 hover:bg-white/5'} cursor-pointer`}>
                    Roles & Permissions
                </NavLink>
                <NavLink to="/admin/audit" className={({ isActive }) => `block px-4 py-2 text-sm ${isActive ? 'text-white bg-[#1B1A24]' : 'text-white/80 hover:bg-white/5'} cursor-pointer`}>
                    Audit Logs
                </NavLink>
                <NavLink to="/admin/settings" className={({ isActive }) => `block px-4 py-2 text-sm ${isActive ? 'text-white bg-[#1B1A24]' : 'text-white/80 hover:bg-white/5'} cursor-pointer`}>
                    Settings
                </NavLink>
            </nav>
        </aside>
    );
};

export default Sidebar;


