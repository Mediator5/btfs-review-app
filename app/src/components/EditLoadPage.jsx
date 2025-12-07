// src/pages/EditLoadPage.jsx (New Component)
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import toast from 'react-hot-toast';

import supabase from '../services/supabase';

// 1. Fetch a single load's data
const fetchLoadById = async (loadId) => {
    const { data, error } = await supabase
        .from('loads')
        .select('*')
        .eq('id', loadId)
        .single();
    if (error) throw new Error(`Load not found: ${error.message}`);
    return data;
};

// 2. The update API call
const updateLoad = async (loadData) => {
    // We expect { id, loadIdName, pickupDate, deliveryDate, assignedBrokerId, status }
    const { id, ...updates } = loadData;

    const { data, error } = await supabase
        .from('loads')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    if (error) throw new Error(`Could not update load: ${error.message}`);
    return data;
};


export default function EditLoadPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    // Fetch existing load data for pre-filling the form
    const { data: loadData, isLoading: isLoadingLoad } = useQuery({
        queryKey: ['load', id],
        queryFn: () => fetchLoadById(id),
    });

    // Fetch the list of all brokers for the dropdown select input
    const { data: brokers, isLoading: isLoadingBrokers } = useQuery({
        queryKey: ['brokers'],
        queryFn: fetchBrokers,
    });


    // Mutation for updating data
    const { mutate, isPending: isUpdating } = useMutation({
        mutationFn: updateLoad,
        onSuccess: (updatedData) => {
            toast.success(`Successfully updated load: ${updatedData.loadIdName}.`);
            queryClient.invalidateQueries({ queryKey: ['loads'] }); // Invalidate the list table cache
            queryClient.invalidateQueries({ queryKey: ['load', id] }); // Invalidate this specific load's cache
            navigate('/admin/loads'); // Go back to the list
        },
        onError: (err) => toast.error(err.message),
    });

    // Use useEffect to reset the form once the load data is loaded
    useEffect(() => {
        if (loadData) {
            // Note: date inputs require YYYY-MM-DD format strings for default values
            reset({
                ...loadData,
                pickupDate: loadData.pickupDate ? loadData.pickupDate.split('T')[0] : '',
                deliveryDate: loadData.deliveryDate ? loadData.deliveryDate.split('T')[0] : '',
            });
        }
    }, [loadData, reset]);

    const onSubmit = (data) => {
        mutate({ id, ...data }); // Pass the ID along with the form data
    };

    if (isLoadingLoad || isLoadingBrokers) return <div className="text-center mt-10">Loading details...</div>;
    if (!loadData || !brokers) return <div className="text-center mt-10">Load or Brokers not found.</div>;

    return (
        <div className="max-w-md mx-auto my-10 p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold mb-6">Edit Load: {loadData.loadIdName}</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label htmlFor="loadIdName" className="block text-sm font-medium text-gray-700">Load ID Name</label>
                    <input type="text" id="loadIdName" {...register('loadIdName', { required: true })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2" />
                </div>

                <div>
                    <label htmlFor="assignedBrokerId" className="block text-sm font-medium text-gray-700">Assigned Broker</label>
                    <select id="assignedBrokerId" {...register('assignedBrokerId', { required: true })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2">
                        {brokers.map(broker => (
                            <option key={broker.id} value={broker.id}>{broker.name}</option>
                        ))}
                    </select>
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

                <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                    <select id="status" {...register('status', { required: true })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2">
                        <option value="Dispatched">Dispatched</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Invoiced">Invoiced</option>
                    </select>
                </div>


                <button
                    type="submit"
                    disabled={isUpdating}
                    className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teald-600 hover:bg-teald-700 disabled:opacity-50"
                >
                    {isUpdating ? 'Saving Changes...' : 'Save Changes'}
                </button>
            </form>
        </div>
    );
}
