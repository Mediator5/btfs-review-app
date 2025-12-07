// src/components/HeroSectionPublic.jsx
import React from 'react';
import { Truck, CheckCircle } from 'lucide-react';

export default function HHero() {

    return (
        // Section uses a dark background to emphasize the brand colors
        <section className="bg-teald-500 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
                <div className="flex flex-col md:flex-row items-center justify-between gap-12">

                    {/* Left Column: Text Content and CTA */}
                    <div className="md:w-1/2 lg:pr-10 text-center md:text-left">

                        {/* Top Info (DOT/MC Numbers) */}
                        <div className="flex justify-center md:justify-start space-x-6 mb-4 text-sm font-medium text-gray-400">
                            <span>DOT: 4339170</span>
                            <span>MC: 1695191</span>
                        </div>

                        <h1 className="text-5xl font-extrabold sm:text-6xl leading-tight">
                            Reliable Freight Solutions from Logistic Professionals
                        </h1>
                        <p className="mt-6 text-xl text-gray-300">
                            We are dedicated to providing reliable and efficient freight services using our Box Trucks. Your cargo is handled with care and delivered on time.
                        </p>

                        {/* Call-to-Action Button */}
                        <div className="mt-10 flex justify-center md:justify-start">
                            <a
                                href="#contact"
                                className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-semibold rounded-lg shadow-lg text-gray-900 bg-amber-400 hover:bg-amber-500 transition duration-200 transform hover:scale-105"
                            >
                                Get a Quote
                            </a>
                        </div>

                        {/* Value Propositions */}
                        <div className="mt-8 flex flex-col sm:flex-row justify-center md:justify-start gap-4 text-white">
                            <span className="flex items-center">
                                <CheckCircle className="w-4 h-4 mr-2 text-green-400" /> All trucks equipped with liftgates
                            </span>
                            <span className="flex items-center">
                                <CheckCircle className="w-4 h-4 mr-2 text-green-400" /> Straps & load bars included
                            </span>
                        </div>

                    </div>

                    {/* Right Column: Visual/Image Placeholder */}
                    <div className="md:w-1/2 mt-10 md:mt-0">
                        {/* Using an image that reflects the service offered */}
                        <img
                            className="w-full h-auto object-cover rounded-xl shadow-2xl"
                            src="https://images.unsplash.com/photo-1711942179703-fce59b6afac6?q=80&w=1121&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                            alt="A white box truck driving on a highway beside green trees"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
