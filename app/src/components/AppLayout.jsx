// AppLayout.jsx (Main Layout Component)
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';


export default function AppLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar Component */}
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header Component */}
                <Header setIsSidebarOpen={setIsSidebarOpen} />

                {/* Page Content (rendered by Outlet) */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-4">
                    <Outlet /> {/* This is where your different pages (Dashboard, Transactions, etc.) will load */}
                </main>
            </div>
        </div>
    );
}
