// src/pages/EditBrokerPage.jsx (New Component)
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import toast from 'react-hot-toast';
import supabase from '../services/supabase';


// 1. Fetch a single broker's data
const fetchBrokerById = async (brokerId) => {
    const { data, error } = await supabase
        .from('brokers')
        .select('*')
        .eq('id', brokerId)
        .single();
    if (error) throw new Error(`Broker not found: ${error.message}`);
    return data;
};

// 2. The update API call
const updateBroker = async ({ id, name, email }) => {
    const { data, error } = await supabase
        .from('brokers')
        .update({ name, email })
        .eq('id', id)
        .select()
        .single();
    if (error) throw new Error(`Could not update broker: ${error.message}`);
    return data;
};


export default function EditBrokerPage() {
    const { id } = useParams(); // Get the ID from the URL
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    // Fetch existing data for pre-filling the form
    const { data: brokerData, isLoading: isLoadingBroker } = useQuery({
        queryKey: ['broker', id],
        queryFn: () => fetchBrokerById(id),
    });

    // Mutation for updating data
    const { mutate, isPending: isUpdating } = useMutation({
        mutationFn: updateBroker,
        onSuccess: (updatedData) => {
            toast.success(`Successfully updated broker: ${updatedData.name}.`);
            queryClient.invalidateQueries({ queryKey: ['brokers'] }); // Invalidate the list table cache
            queryClient.invalidateQueries({ queryKey: ['broker', id] }); // Invalidate this specific broker's cache
            navigate('/admin/brokers'); // Go back to the list
        },
        onError: (err) => toast.error(err.message),
    });

    // Use useEffect to reset the form once data is loaded
    useEffect(() => {
        if (brokerData) {
            reset(brokerData); // Pre-fills the form with fetched data
        }
    }, [brokerData, reset]);

    const onSubmit = (data) => {
        mutate({ id, ...data }); // Pass the ID along with the form data
    };

    if (isLoadingBroker) return <div className="text-center mt-10">Loading broker details...</div>;
    if (!brokerData) return <div className="text-center mt-10">Broker not found.</div>;

    return (
        <div className="max-w-md mx-auto my-10 p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold mb-6">Edit Broker: {brokerData.name}</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Broker Name</label>
                    <input type="text" id="name" {...register('name', { required: true })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2" />
                    {errors.name && <span className="text-red-500 text-xs mt-1 block">Name is required.</span>}
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Broker Email</label>
                    <input type="email" id="email" {...register('email', { required: true, pattern: /^\S+@\S+$/i })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2" />
                    {errors.email && <span className="text-red-500 text-xs mt-1 block">A valid email is required.</span>}
                </div>
                <button
                    type="submit"
                    disabled={isUpdating}
                    className="cursor-pointer w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teald-600 hover:bg-teald-700 disabled:opacity-50"
                >
                    {isUpdating ? 'Saving Changes...' : 'Save Changes'}
                </button>
            </form>
        </div>
    );
}
