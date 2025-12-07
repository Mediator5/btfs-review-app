// src/pages/CreateLoadPage.jsx (New Component)
import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import toast from 'react-hot-toast';
import supabase from '../services/supabase';

// 1. Fetch broker details using the ID from the URL param
const fetchBrokerDetails = async (brokerId) => {
    const { data, error } = await supabase
        .from('brokers')
        .select('id, name')
        .eq('id', brokerId)
        .single();
    if (error) throw new Error(`Broker not found: ${error.message}`);
    return data;
};

// 2. The create load API call
const createLoad = async (loadData) => {
    // loadData includes assignedBrokerId, loadIdName, dates
    const { data, error } = await supabase
        .from('loads')
        .insert([loadData])
        .select()
        .single();
    if (error) throw new Error(`Could not create load: ${error.message}`);
    return data;
};


export default function CreateLoadPage() {
    const [searchParams] = useSearchParams();
    const brokerId = searchParams.get('brokerId'); // Get the brokerId from the URL
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    // Fetch existing broker data for display purposes
    const { data: broker, isLoading: isLoadingBroker } = useQuery({
        queryKey: ['brokerDetails', brokerId],
        queryFn: () => fetchBrokerDetails(brokerId),
        enabled: !!brokerId, // Only run if we have an ID
    });

    // Mutation for creating the load
    const { mutate, isPending: isCreatingLoad } = useMutation({
        mutationFn: createLoad,
        onSuccess: (newLoadData) => {
            toast.success(`Load ${newLoadData.loadIdName} created successfully.`);
            queryClient.invalidateQueries({ queryKey: ['loads'] }); // Invalidate the main loads list cache
            // Optional: Log the link that should be sent to the broker
            console.log(`Send this link to the broker: /submit-review?loadUuid=${newLoadData.id}`);
            navigate('/admin/loads'); // Navigate back to the loads list (assuming you create one next)
        },
        onError: (err) => toast.error(err.message),
    });

    const onSubmit = (data) => {
        // We inject the brokerId from the URL params into the submission data
        mutate({ ...data, assignedBrokerId: brokerId, status: 'Dispatched' });
    };

    if (isLoadingBroker) return <div className="text-center mt-10">Loading form...</div>;
    if (!broker) return <div className="text-center mt-10">Invalid broker selected.</div>;

    return (
        <div className="max-w-md mx-auto my-10 p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Create New Load</h2>
            <p className="mb-6">Assigned Broker: **{broker.name}**</p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label htmlFor="loadIdName" className="block text-sm font-medium text-gray-700">Load ID Name</label>
                    <input type="text" id="loadIdName" {...register('loadIdName', { required: true })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2" />
                    {errors.loadIdName && <span className="text-red-500 text-xs mt-1 block">Load ID is required.</span>}
                </div>

                <div>
                    <label htmlFor="pickupDate" className="block text-sm font-medium text-gray-700">Pickup Date</label>
                    <input type="date" id="pickupDate" {...register('pickupDate', { required: true })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2" />
                </div>

                <div>
                    <label htmlFor="deliveryDate" className="block text-sm font-medium text-gray-700">Delivery Date</label>
                    <input type="date" id="deliveryDate" {...register('deliveryDate', { required: true })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2" />
                </div>

                <button
                    type="submit"
                    disabled={isCreatingLoad}
                    className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teald-600 hover:bg-teald-700 disabled:opacity-50"
                >
                    {isCreatingLoad ? 'Creating Load...' : 'Create Load'}
                </button>
            </form>
        </div>
    );
}
