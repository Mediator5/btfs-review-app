// src/pages/DashboardPage.jsx (or src/components/DashboardPage.jsx as per your App.js)
import React from 'react';
import { useQueries } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Users, FileText, Star, Plus } from 'lucide-react';

import supabase from '../services/supabase';


export default function DashboardPage() {

    async function countBrokers() {
        const { count, error } = await supabase
            .from('brokers')
            .select('*', { count: 'exact', head: true });
        if (error) throw new Error(error.message);
        return count;
    }

    async function countLoads() {
        const { count, error } = await supabase
            .from('loads')
            .select('*', { count: 'exact', head: true });
        if (error) throw new Error(error.message);
        return count;
    }

    async function countReviews() {
        const { count, error } = await supabase
            .from('reviews')
            .select('*', { count: 'exact', head: true });
        if (error) throw new Error(error.message);
        return count;
    }

    // Use useQueries to run all 3 fetch functions in parallel
    const results = useQueries({
        queries: [
            { queryKey: ['countBrokers'], queryFn: countBrokers },
            { queryKey: ['countLoads'], queryFn: countLoads },
            { queryKey: ['countReviews'], queryFn: countReviews },
        ],
    });

    // Check loading/error states
    const isLoading = results.some(result => result.isLoading);
    const isError = results.some(result => result.isError);

    if (isLoading) return <div className="text-center mt-10">Loading dashboard metrics...</div>;
    if (isError) return <div className="text-center mt-10 text-red-500">Error loading metrics.</div>;

    // Destructure the data (counts) from the results array
    const [brokerCount, loadCount, reviewCount] = results.map(result => result.data);

    // Data for the stats cards
    const stats = [
        { name: 'Total Brokers', stat: brokerCount, icon: Users, href: '/admin/brokers' },
        { name: 'Total Loads', stat: loadCount, icon: FileText, href: '/admin/loads' },
        { name: 'Total Reviews', stat: reviewCount, icon: Star, href: '/admin/reviews' },
    ];

    return (
        <div className="mx-auto my-10 p-6">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>

                {/* Option to Add new broker */}
                <Link to={'/admin/create-broker'} className='bg-teald-600 text-white py-2 px-4 rounded-md flex items-center hover:bg-teald-700 transition' >
                    <Plus className='w-5 h-5 mr-2' />
                    Add Broker
                </Link>
            </div>

            {/* Stats Cards Section */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                {stats.map((item) => (
                    <div key={item.name} className="bg-white p-5 shadow-lg rounded-lg overflow-hidden">
                        <Link to={item.href} className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500 truncate">{item.name}</p>
                                <p className="mt-1 text-3xl font-semibold text-gray-900">{item.stat}</p>
                            </div>
                            <item.icon className="h-10 w-10 text-gray-400" />
                        </Link>
                    </div>
                ))}
            </div>

            {/* You can add charts or recent activity tables here later */}
        </div>
    );
}
