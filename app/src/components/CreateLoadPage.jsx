// src/pages/CreateLoadPage.jsx (New Component)
import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import toast from 'react-hot-toast';
import supabase from '../services/supabase';

const usStates = [
    "Alabama",
    "Alaska",
    "Arizona",
    "Arkansas",
    "California",
    "Colorado",
    "Connecticut",
    "Delaware",
    "Florida",
    "Georgia",
    "Hawaii",
    "Idaho",
    "Illinois",
    "Indiana",
    "Iowa",
    "Kansas",
    "Kentucky",
    "Louisiana",
    "Maine",
    "Maryland",
    "Massachusetts",
    "Michigan",
    "Minnesota",
    "Mississippi",
    "Missouri",
    "Montana",
    "Nebraska",
    "Nevada",
    "New Hampshire",
    "New Jersey",
    "New Mexico",
    "New York",
    "North Carolina",
    "North Dakota",
    "Ohio",
    "Oklahoma",
    "Oregon",
    "Pennsylvania",
    "Rhode Island",
    "South Carolina",
    "South Dakota",
    "Tennessee",
    "Texas",
    "Utah",
    "Vermont",
    "Virginia",
    "Washington",
    "West Virginia",
    "Wisconsin",
    "Wyoming"
];


// 1. Fetch broker details using the ID from the URL param
const fetchBrokerDetails = async (brokerId) => {
    const { data, error } = await supabase
        .from('brokers')
        .select('id, name, email')
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
    const brokerEmailAddress = broker?.email


    // Mutation for creating the load
    const { mutate, isPending: isCreatingLoad } = useMutation({
        mutationFn: createLoad,
        onSuccess: async (newLoadData) => {
            toast.success(`Load ${newLoadData.loadIdName} created successfully.`);
            queryClient.invalidateQueries({ queryKey: ['loads'] }); // Invalidate the main loads list cache
            // Optional: Log the link that should be sent to the broker

            const loadReviewLink = `https://btfs-review-app.vercel.app/submit-review?loadUuid=${newLoadData.id}`
            console.log(`Send this link to the broker: ${loadReviewLink} `);


            await fetch("https://email-server-iota-teal.vercel.app/api/send-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    to: broker.email,
                    subject: "Quick 2-sec favor from your box truck people 🚚✨",
                    html: `
      <p>Gonna keep this short because we both live in controlled chaos.</p>
      <p>As a small carrier, our name and reputation is literally all we’ve got. We’re sending out a quick review link so brokers who actually work with us can tell the truth about how we move freight.</p>
      <p>If you could take two seconds out of the logistics madness and drop an honest review, it would seriously mean the world to us. Good, bad, or “could be better” — we want the real thing.</p>
      <p>Review Link: <a href="${loadReviewLink}">Click here to leave a review</a></p>
      <p>Thank you for rocking with us and trusting Box Truck Freight Services with your loads.</p>
      <p>Much respect,<br/>
      BTFS Team<br/>
      Co-Owner, Box Truck Freight Services, LLC<br/>
      operations@boxtruckfs.com | (312) 278-2355</p>
    `
                }),
            });


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

                <div>
                    <label className="block font-medium text-gray-700">Origin State</label>
                    <select {...register('originState')} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2">
                        {usStates.map((state) => (
                            <option key={state} value={state}>{state}</option>
                        ))}

                    </select>
                </div>
                <div>
                    <label className="block font-medium text-gray-700">Destination State</label>
                    <select {...register('destinationState')} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2">
                        {usStates.map((state) => (
                            <option key={state} value={state}>{state}</option>
                        ))}

                    </select>
                </div>

                <button
                    type="submit"
                    disabled={isCreatingLoad}
                    className="cursor-pointer w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teald-600 hover:bg-teald-700 disabled:opacity-50"
                >
                    {isCreatingLoad ? 'Creating Load...' : 'Create Load'}
                </button>
            </form>
        </div>
    );
}
