// Sidebar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
supabase
import { HomeIcon, CurrencyDollarIcon, UsersIcon, CreditCardIcon, FireIcon, DocumentTextIcon, XMarkIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { LogOut } from 'lucide-react';
import { Home, Users, DollarSign, Star, FileText } from 'lucide-react';
import supabase from '../services/supabase';

const navItems = [
    { name: 'Dashboard', icon: Home, href: '' },
    { name: 'Brokers', icon: Users, href: 'brokers' },
    { name: 'Loads', icon: FileText, href: 'loads' }, // Changed '/transactions' to '/loads' for consistency
    { name: 'Reviews', icon: Star, href: 'reviews' }, // Used Star icon for reviews/ratings
];



export default function Sidebar({ isOpen, setIsOpen }) {
    const navigate = useNavigate();

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();

        if (error) {
            toast.error("Logout failed: " + error.message);
        } else {
            toast.success("Logged out successfully.");
            // Redirect to the login page after successful logout
            navigate('/login', { replace: true });
        }
    };
    return (
        <>
            {/* Mobile Overlay (visible when sidebar is open on small screens) */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black opacity-50 lg:hidden"
                    onClick={() => setIsOpen(false)}
                ></div>
            )}

            {/* Sidebar Container */}
            <div
                // Default hidden on mobile, fixed positioning when open via 'isOpen' state
                // On large screens (lg), it's static and always visible
                className={`
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          fixed inset-y-0 left-0 z-40 w-64 bg-teald-800 text-white 
          transform transition duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        `}
            >
                {/* Sidebar Header/Logo */}
                <div className="flex items-center justify-between p-4 border-b border-gray-700">
                    <div className="flex items-center">
                        {/* <span className="text-2xl font-bold">BTFS</span> */}
                        <img src="https://dev-mportfolio5.pantheonsite.io/wp-content/uploads/2025/12/qtq_95.webp" alt="logo" className='w-20 h-20'/>
                    </div>
                    {/* Close button for mobile view */}
                    <button className="lg:hidden" onClick={() => setIsOpen(false)}>
                        <XMarkIcon className="h-6 w-6 text-gray-400" />
                    </button>
                </div>

                {/* Navigation Links */}
                <nav className="mt-6">
                    {navItems.map((item) => (
                        <Link
                            key={item.name}
                            to={item.href}
                            className="flex items-center justify-between px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition duration-200"
                            onClick={() => setIsOpen(false)} // Close sidebar after navigation on mobile
                        >
                            <div className="flex items-center">
                                <item.icon className="h-5 w-5 mr-3" />
                                {item.name}
                            </div>
                            {item.badge && (
                                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${item.badge === 'New' ? 'bg-blue-500 text-white' : 'bg-green-500 text-white'}`}>
                                    {item.badge}
                                </span>
                            )}
                        </Link>
                    ))}
                    <button onClick={handleLogout}
                        className="flex items-center justify-between px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition duration-200">
                        <LogOut className="w-5 h-5 mr-3" />
                        Logout
                    </button>
                </nav>
            </div>
        </>
    );
}
