import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast, { Toaster } from 'react-hot-toast';

import supabase from '../services/supabase';
import { Link } from 'react-router-dom';
import { Trash } from 'lucide-react';


// Replace with your actual Supabase credentials
export default function DeliveryLoadManager() {

    const queryClient = useQueryClient();

    // Fetch data from Supabase
    const { data: loads, isLoading, isError } = useQuery({
        queryKey: ['deliveryLoads'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('deliveryLoads')
                .select('*')
                .order('created_at', { ascending: false });
            if (error) throw error;
            return data;
        },
    });

    // Toggle mutation logic
    const toggleMutation = useMutation({
        mutationFn: async ({ id, currentStatus }) => {
            const { data, error } = await supabase
                .from('deliveryLoads')
                .update({ loadCompleted: !currentStatus })
                .eq('id', id);
            if (error) throw error;
            return data;
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries(['deliveryLoads']);
            // Trigger success notification with check mark if marked as completed
            if (!variables.currentStatus) {
                toast.success('Successful delivery!', {
                    icon: '✅',
                    className: 'bg-green-50 text-green-900 border border-green-200 font-medium px-6 py-4 shadow-lg rounded-xl',
                });
            }
        },
        onError: () => toast.error('Failed to update status'),
    });

    // Delete mutation logic
    const deleteMutation = useMutation({
        mutationFn: async ({ id }) => {
            const { data, error } = await supabase
                .from('deliveryLoads')
                .delete()
                .eq('id', id)
                .select()
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries(['deliveryLoads']);
            // Trigger success notification with check mark if marked as completed

            toast.success('deleted', {
                icon: '✅',
                className: 'bg-green-50 text-green-900 border border-green-200 font-medium px-6 py-4 shadow-lg rounded-xl',
            });

        },
        onError: () => toast.error('Failed to delete'),
    });

    if (isLoading) return <div className="p-8 text-slate-500 animate-pulse">Loading tracking data...</div>;
    if (isError) return <div className="p-8 text-red-600 font-bold">Error connecting to database.</div>;

    return (
        <div className="min-h-screen bg-slate-50 p-6 md:p-10 font-sans text-slate-900">

            {/* <header className="mb-8">
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-800">
                    Delivery Load Management
                </h1>
                <p className="mt-2 text-slate-500">Track and manage broker load completion status in real-time.</p>
            </header> */}

            <div className='flex justify-between mb-6'>
                <h1 className="text-2xl font-bold ">Delivery Load Management</h1>
                <Link to={'/admin/loadsCompletion/create'} className='bg-teald-600 text-white py-3 px-6 rounded-md cursor-pointer hover:bg-teald-700' >Add Load Delivery</Link>
            </div>

            <div className=" bg-white shadow-sm ring-1 ring-slate-200 rounded-xl overflow-x-scroll xl:overflow-hidden">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Broker Name</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Pickup Date</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Route (Origin/Dest)</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Total Miles</th>
                            <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Status</th>
                            <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        {loads?.map((load) => (
                            <tr
                                key={load.id}
                                className={`transition-colors duration-200 ${load.loadCompleted ? 'bg-green-50/70 hover:bg-green-100/70' : 'hover:bg-slate-50'
                                    }`}
                            >
                                <td className="whitespace-nowrap px-6 py-4 font-medium text-slate-800">{load.brokerName}</td>
                                <td className="whitespace-nowrap px-6 py-4 text-slate-600">{new Date(load.pickupDate).toLocaleDateString()}</td>
                                <td className="whitespace-nowrap px-6 py-4 text-slate-600">
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-800 mr-2">
                                        {load.pickupState}
                                    </span>
                                    →
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-800 ml-2">
                                        {load.deliveryState}
                                    </span>
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-slate-600">{load.totalMiles.toLocaleString()} mi</td>
                                <td className="whitespace-nowrap px-6 py-4 text-right">
                                    <button
                                        onClick={() => toggleMutation.mutate({ id: load.id, currentStatus: load.loadCompleted })}
                                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all active:scale-95 cursor-pointer ${load.loadCompleted
                                            ? 'bg-green-600 text-white shadow-sm'
                                            : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
                                            }`}
                                    >
                                        {load.loadCompleted ? (
                                            <><span className="text-lg">✓</span> Completed</>
                                        ) : (
                                            'Mark Delivered'
                                        )}
                                    </button>
                                </td>
                                <td><button onClick={() => deleteMutation.mutate({ id: load.id })}><Trash className='cursor-pointer hover:text-red-800' /></button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};


