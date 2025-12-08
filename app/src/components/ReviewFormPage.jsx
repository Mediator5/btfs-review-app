// src/pages/ReviewFormPage.jsx 
import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import PageNotFound from './PageNotFound';
import supabase from '../services/supabase';
import AlreadyReviewedMessage from './AlreadyReviewedMessage';

// functions to fetch reveiews

async function fetchReviews(id) {
    const { data, error } = await supabase
        .from('reviews')
        .select(`*`)
        .eq('loadUuid', id)
    // .single()

    if (error) {
        throw new Error(error)

    }

    return data

}



// Function to fetch load details along with broker name via join

async function submitReview(reviewData) {
    // reviewData includes loadUuid, brokerId, ratings, comments, etc.
    const { data, error } = await supabase
        .from('reviews')
        .insert([reviewData])
        .select()
        .single();

    if (error) throw new Error(`Could not submit review: ${error.message}`);
    return data;
}
const fetchLoadAndBroker = async (loadUuid) => {
    const { data, error } = await supabase
        .from('loads')
        .select(`
            id,
            loadIdName,
            pickupDate,
            deliveryDate,
            assignedBrokerId,
            brokers ( name )
        `)
        .eq('id', loadUuid)
        .single();

    if (error) throw new Error(`Load ID not found or invalid: ${error.message}`);
    return data;
};

export default function ReviewFormPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [isSubmitted, setIsSubmitted] = useState(false);

    // Get the UUID for the load from the URL (e.g., /submit-review?loadUuid=...)
    const loadUuid = searchParams.get('loadUuid');

    // Fetch details using React Query
    const { data: loadData, isLoading: isLoadingDetails, isError } = useQuery({
        queryKey: ['reviewLoadDetails', loadUuid],
        queryFn: () => fetchLoadAndBroker(loadUuid),
        enabled: !!loadUuid,
    });

    // Mutation hook for submitting the review
    const { mutate, isPending: isSubmitting } = useMutation({
        mutationFn: submitReview,
        onSuccess: (data) => {
            toast.success('Review submitted successfully! Thank you for your feedback.');
            queryClient.invalidateQueries({ queryKey: ['reviews'] }); // Update the public wall cache
            setIsSubmitted(true);
        },
        onError: (err) => {
            toast.error(err.message);
        },
    });

    // fectching reveiws by load id to check if reveiw has been dropped for a load

    // 
    const { data: loadedReviews, isLoading, isError: loadingError, error } = useQuery({
        queryKey: ['loadreviews'],
        queryFn: () => fetchReviews(loadUuid),
    });

    // Handle form submission
    const onSubmit = (formData) => {
        if (!loadData) return;

        const submissionData = {
            // Foreign Keys
            loadUuid: loadData.id,
            brokerId: loadData.assignedBrokerId,
            // Form Data
            ...formData,
            communicationRating: parseInt(formData.communicationRating),
            performanceRating: parseInt(formData.performanceRating),
            // Default visibility
            // showOnSite: true,
        };

        mutate(submissionData);
    };



    const comment = loadedReviews?.[0]?.comment

    if (comment) {
        return <AlreadyReviewedMessage />;

    }

    if (isLoadingDetails) return <div className="text-center mt-10">Loading load details...</div>;
    if (isError || !loadUuid || !loadData) return <PageNotFound />;

    if (isSubmitted) {
        return (
            <div className="max-w-xl mx-auto mt-10 p-8 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                <h2 className="text-2xl font-bold mb-4">Thank You!</h2>
                <p>Your review for Load ID **{loadData.loadIdName}** has been recorded.</p>
                <button onClick={() => navigate('https://boxtruckfs.com/')} className="mt-4 text-blue-600 hover:underline">Return Home</button>
            </div>
        );
    }

    return (
        <div className="max-w-xl mx-auto mt-10 p-8 bg-white shadow-lg rounded-lg">
            <h1 className="text-2xl font-bold mb-4">Performance Review Form</h1>
            <p className="mb-6 text-gray-600">
                Load: **{loadData.loadIdName}** | Broker: **{loadData.brokers?.name || 'N/A'}** |
                Pickup: {loadData.pickupDate} | Delivery: {loadData.deliveryDate}
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                <div>
                    <label className="block font-medium text-gray-700">On-time pickup?</label>
                    <select {...register('onTimePickup')} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2">
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                    </select>
                </div>

                <div>
                    <label className="block font-medium text-gray-700">On-time delivery?</label>
                    <select {...register('onTimeDelivery')} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2">
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                    </select>
                </div>

                <div>
                    <label className="block font-medium text-gray-700">Whould you use btfs again?</label>
                    <select {...register('useBtfsAgain')} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2">
                        <option value="YES">Yes</option>
                        <option value="MAYBE">Maybe</option>
                        <option value="NO">No</option>
                    </select>
                </div>

                <div>
                    <label className="block font-medium text-gray-700">Communication Rating (1-5)</label>
                    <select {...register('communicationRating')} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2">
                        <option value="5">5 (Excellent)</option>
                        <option value="4">4 (Good)</option>
                        <option value="3">3 (Okay)</option>
                        <option value="2">2 (Poor)</option>
                        <option value="1">1 (Very Poor)</option>

                    </select>

                </div>

                <div>
                    <label className="block font-medium text-gray-700">Performance Rating (1-5)</label>
                    <select {...register('performanceRating')} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2">
                        <option value="5">5 (Excellent)</option>
                        <option value="4">4 (Good)</option>
                        <option value="3">3 (Okay)</option>
                        <option value="2">2 (Poor)</option>
                        <option value="1">1 (Very Poor)</option>

                    </select>

                </div>

                <div>
                    <label className="block font-medium text-gray-700">Show on Site?</label>
                    <select {...register('showOnSite')} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2">
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="comment" className="block font-medium text-gray-700">Comment</label>
                    <textarea id="comment" {...register('comment')} rows={4} required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2" />
                </div>

                <button type="submit" disabled={isSubmitting} className=" cursor-pointer w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teald-600 hover:bg-teald-700 disabled:opacity-50">
                    {isSubmitting ? 'Submitting...' : 'Submit Review'}
                </button>
            </form>
        </div>
    );
}
