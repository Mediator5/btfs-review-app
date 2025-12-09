// src/components/PageNotFound.jsx
import React from 'react';
import { Home, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';





export default function LoadNotFound() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="text-center p-8 md:p-12">

                {/* The 404 Visual */}
                <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
                    404 Error
                </p>
                <h1 className="mt-4 text-5xl font-extrabold text-gray-900 sm:text-6xl">
                    Load does not exist
                </h1>

                {/* Message */}
                <p className="mt-6 text-xl text-gray-500 max-w-md mx-auto">
                    Sorry, we couldn't find the Load you are looking for.
                </p>

                {/* Navigation Buttons */}
                <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">

                    {/* Go Home Button */}
                    <Link
                        to="https://boxtruckfs.com/"
                        className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-teald-600 hover:bg-teald-700 transition duration-200"
                    >
                        <Home className="w-4 h-4 mr-2" />
                        Go back home
                    </Link>

                    {/* Contact Support Button (assuming you have a contact route) */}
                    <Link
                        to="https://boxtruckfs.com/"
                        className="cursor-pointer inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-100 transition duration-200"
                    >
                        Contact Support
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                </div>
            </div>
        </div>
    );
};

