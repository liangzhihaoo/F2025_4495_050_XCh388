import React from 'react';
import { assets } from '../../assets/assets';

const Header = ({ title = 'Admin', onMenuClick }) => {
    return (
        <header className="w-screen h-16 bg-[#18161F] border-b border-[#2A2740] flex items-center justify-between px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12 fixed top-0 left-0 right-0 z-50">
            <div className="flex items-center gap-2 sm:gap-3">
                <button
                    className="lg:hidden p-1.5 sm:p-2 rounded hover:bg-white/5 focus:outline-none cursor-pointer transition-colors"
                    onClick={onMenuClick}
                    aria-label="Toggle sidebar"
                >
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
                <img src={assets.gluu_logo} alt="Gluu" className="h-6 sm:h-7 w-auto" />
                <span className="text-white/80 text-xs sm:text-sm md:text-base font-medium hidden xs:block">{title}</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
                <div className="hidden sm:flex items-center gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded bg-[#232336] min-w-0 flex-1 max-w-xs lg:max-w-sm">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white/70 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
                    </svg>
                    <input
                        className="bg-transparent outline-none text-white/90 text-xs sm:text-sm placeholder:text-white/50 w-full min-w-0"
                        placeholder="Search users..."
                    />
                </div>
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#232336] flex items-center justify-center flex-shrink-0">
                    <span className="text-white/80 text-xs font-medium">AD</span>
                </div>
            </div>
        </header>
    );
};

export default Header;


