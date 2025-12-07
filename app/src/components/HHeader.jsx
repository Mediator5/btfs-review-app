import React, { useState } from 'react';
import { Phone, Menu, X, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';


export default function HHeader() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navItems = [
        { name: 'Our Mission', href: '#mission' },
        { name: 'Gallery', href: '#gallery' },
        { name: 'Contact Us', href: '#contact' },
        // Add links to public performance wall here if needed
        // { name: 'Performance', href: '/performance-wall' },
    ];
    return (
        <header className="bg-white shadow-md sticky top-0 z-50">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-24">

                    {/* Logo & Brand Name */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link to="/" className="flex items-center">
                            {/* <Truck className="h-8 w-8 text-blue-600 mr-2" />
                            <span className="text-2xl font-bold text-gray-800">BTFS</span>
                            <span className="hidden sm:inline ml-2 text-gray-600">Freight Services</span> */}
                            <img src="https://dev-mportfolio5.pantheonsite.io/wp-content/uploads/2025/12/qtq_95.webp" alt="" className='w-20 h-20' />
                        </Link>
                    </div>

                    {/* Desktop Menu Links, Phone Number, and CTA Button */}
                    <div className="hidden md:flex items-center space-x-8">

                        {/* Nav Links */}
                        {navItems.map((item) => (
                            <a
                                key={item.name}
                                href={item.href}
                                className="text-gray-600 hover:text-blue-600 transition duration-200 font-medium"
                            >
                                {item.name}
                            </a>
                        ))}

                        {/* Phone Number */}
                        <div className="flex items-center space-x-2">
                            <Phone className="w-4 h-4 text-blue-600" />
                            <a href="tel:3122782355" className="text-gray-800 font-semibold">(312) 278-2355</a>
                        </div>

                        {/* Get a Quote Button */}
                        <a href="#contact" className=" bg-teald-500 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-200">
                            Get a Quote
                        </a>
                    </div>

                    {/* Mobile Menu Button (visible on mobile/tablet) */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                        >
                            {isMobileMenuOpen ? (
                                <X className="block h-6 w-6" />
                            ) : (
                                <Menu className="block h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Dropdown (Toggle visibility based on state) */}
            {isMobileMenuOpen && (
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {navItems.map((item) => (
                            <a
                                key={item.name}
                                href={item.href}
                                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                                onClick={() => setIsMobileMenuOpen(false)} // Close menu on click
                            >
                                {item.name}
                            </a>
                        ))}
                        <a href="tel:3122782355" className="block px-3 py-2 text-base font-medium text-blue-600">
                            Call Us: (312) 278-2355
                        </a>
                        <a href="#contact" className="block w-full text-center mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg">
                            Get a Quote
                        </a>
                    </div>
                </div>
            )}
        </header>
    );
}
