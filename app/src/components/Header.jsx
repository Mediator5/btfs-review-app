
// Header.jsx
import React from 'react';
import { Bars3Icon } from '@heroicons/react/24/outline';



export default function Header({ setIsSidebarOpen }) {
 return (
    <header className="flex items-center justify-between h-16 bg-white shadow-md p-4">
      {/* Mobile menu button (only visible on small/medium screens) */}
      <button 
        className="text-gray-500 hover:text-gray-700 focus:outline-none lg:hidden"
        onClick={() => setIsSidebarOpen(true)}
      >
        <Bars3Icon className="h-6 w-6" />
      </button>

      {/* Header Title / Breadcrumbs (visible on desktop) */}
      <h1 className="text-xl font-semibold text-gray-800 hidden lg:block">Home</h1>

      {/* User Profile Info */}
      <div className="flex items-center space-x-4">
        <span className="text-gray-600">Welcome, Admin</span>
        <button className="flex items-center space-x-2 focus:outline-none">
          {/* Placeholder for user avatar or icon */}
          <div className="h-10 w-10 bg-teald-800 rounded-full flex items-center justify-center text-white font-semibold">
            AD
          </div>
        </button>
      </div>
    </header>
  );
}
