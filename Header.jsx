import React from 'react';
import { assets } from '../assets/assets';

const Header = ({ title = 'Admin', onMenuClick }) => {
    return (
        <header className="w-full h-16 bg-[#18161F] border-b border-[#2A2740] flex items-center justify-between px-4 md:px-6">
            <div className="flex items-center gap-3">
                <button
                    className="md:hidden p-2 rounded hover:bg-white/5 focus:outline-none cursor-pointer"
                    onClick={onMenuClick}
                    aria-label="Toggle sidebar"
                >
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
                <img src={assets.gluu_logo} alt="Gluu" className="h-7" />
                <span className="text-white/80 text-sm md:text-base">{title}</span>
            </div>
            <div className="flex items-center gap-3">
                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded bg-[#232336]">
                    <svg className="w-4 h-4 text-white/70" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
                    </svg>
                    <input
                        className="bg-transparent outline-none text-white/90 text-sm placeholder:text-white/50"
                        placeholder="Search users..."
                    />
                </div>
                <div className="w-8 h-8 rounded-full bg-[#232336] flex items-center justify-center">
                    <span className="text-white/80 text-xs">AD</span>
                </div>
            </div>
        </header>
    );
};

export default Header;


