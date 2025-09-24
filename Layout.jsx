import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

const Layout = ({ children, title }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[#0E0E12] text-white">
            <Header title={title} onMenuClick={() => setSidebarOpen(true)} />
            <div className="flex">
                <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                <main className="flex-1 min-w-0 p-4 md:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;


