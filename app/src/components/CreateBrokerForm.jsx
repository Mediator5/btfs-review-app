// src/components/CreateBrokerForm.jsx (Refactored with react-hook-form)

import { useMutation, useQueryClient } from '@tanstack/react-query'; // Import useQueryClient

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import supabase from '../services/supabase';


export default function CreateBrokerForm() {

    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    const navigate = useNavigate()

    const queryClient = useQueryClient(); // Initialize the query client

    async function createBroker(data) {
        const { error, data: newBrokerData } = await supabase
            .from('brokers')
            .insert([data]) // 'data' object from useForm matches our Supabase columns (name, email)
            .select()
            .single();

        if (error) {
            throw new Error(error)

        }

        return data


    }


    // useMutation

    const { isPending, error, mutate, } = useMutation(

        {
            mutationFn: createBroker,
            onSuccess: (newBrokerData) => {
                const brokerName = newBrokerData?.name || 'Unknown Broker'

                toast.success(`Successfully added a new broker: ${brokerName}.`);
                // !!! Invalidate the cache for the 'brokers' query !!!
                queryClient.invalidateQueries({ queryKey: ['brokers'] });
                reset();
                navigate('/admin/brokers')



            },

            onError: (error) => {
                toast.error(error.message);

            },
        }


    )



    // This function runs only if react-hook-form validation passes
    const onSubmit = async (data) => {



        mutate(data)

    };

    // Function to close the modal (navigate away)
    const handleClose = () => {
        navigate('/admin/brokers');
    };

    return (

        <div className="max-w-md w-1xl sm:w-2xl mx-auto my-10 p-6 bg-white shadow-lg rounded-lg">


            <h2 className="text-2xl font-bold mb-6">Create New Broker</h2>



            {/* Use RHF's handleSubmit wrapper around our onSubmit logic */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Broker Name</label>
                    <input
                        type="text"
                        id="name"
                        // Register the input field with RHF, add validation rules
                        {...register('name', { required: true, minLength: 2 })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                    />
                    {errors.name && <span className="text-red-500 text-xs mt-1 block">Broker name is required (min 2 chars).</span>}
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Broker Email</label>
                    <input
                        type="email"
                        id="email"
                        // Register the email field with RHF, add pattern validation for email
                        {...register('email', {
                            required: true,
                            pattern: /^\S+@\S+$/i
                        })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                    />
                    {errors.email && <span className="text-red-500 text-xs mt-1 block">A valid email address is required.</span>}
                </div>
                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teald-600 hover:bg-teald-700 disabled:opacity-50"
                >
                    {isPending ? 'Adding Broker...' : 'Add Broker'}
                </button>
            </form>
        </div>

    );
}
