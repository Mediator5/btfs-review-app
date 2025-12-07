// src/pages/ReviewsTable.jsx
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Star, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import supabase from '../services/supabase';

// Function to fetch all reviews (admin view)
const fetchAllReviews = async () => {
    // We join both the loads and brokers tables
    const { data, error } = await supabase
        .from('reviews')
        .select(`
            *,
            brokers ( name ),
            loads ( loadIdName )
        `)
        .order('createdAt', { ascending: false });

    if (error) throw new Error(error.message);
    return data;
};

// Function to toggle visibility on the public wall
const toggleReviewVisibility = async ({ id, showOnSite }) => {
    const { data, error } = await supabase
        .from('reviews')
        .update({ showOnSite: !showOnSite })
        .eq('id', id)
        .select()
        .single();

    if (error) throw new Error(`Could not update visibility: ${error.message}`);
    return data;
};


export default function ReviewsTable() {
    const queryClient = useQueryClient();

    // Fetching Logic (Admin view fetches ALL reviews)
    const { data: reviews, isLoading, isError, error } = useQuery({
        queryKey: ['adminReviews'],
        queryFn: fetchAllReviews,
    });

    // Mutation for toggling visibility
    const { mutate: toggleVisibility, isPending: isUpdatingVisibility } = useMutation({
        mutationFn: toggleReviewVisibility,
        onSuccess: () => {
            // Invalidate the admin review list and the public wall cache
            queryClient.invalidateQueries({ queryKey: ['adminReviews'] });
            queryClient.invalidateQueries({ queryKey: ['reviews'] });
            toast.success('Review visibility updated.');
        },
        onError: (err) => {
            toast.error(err.message);
        },
    });

    if (isLoading) return <div className="text-center mt-10">Loading reviews...</div>;
    if (isError) return <div className="text-center mt-10 text-red-500">Error: {error.message}</div>;

    return (
        <div className="max-w-6xl mx-auto my-10 p-6">
            <h1 className="text-2xl font-bold mb-6">Manage All Reviews</h1>

            <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Load ID</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Broker</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comment</th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Public?</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {reviews.map((review) => (
                            <tr key={review.id}>
                                <td className="px-4 py-4 whitespace-nowrap">{review.loads?.loadIdName || 'N/A'}</td>
                                <td className="px-4 py-4 whitespace-nowrap">{review.brokers?.name || 'N/A'}</td>
                                <td className="px-4 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-1" />
                                        {review.communicationRating}/5
                                    </div>
                                </td>
                                <td className="px-4 py-4 max-w-xs truncate">{review.comment || 'N/A'}</td>
                                <td className="px-4 py-4 whitespace-nowrap text-center">
                                    <button
                                        onClick={() => toggleVisibility({ id: review.id, showOnSite: review.showOnSite })}
                                        disabled={isUpdatingVisibility}
                                        className={`p-2 rounded-full transition ${review.showOnSite
                                            ? 'text-green-600 hover:bg-green-100'
                                            : 'text-red-600 hover:bg-red-100'
                                            }`}
                                        title={review.showOnSite ? "Click to hide from public wall" : "Click to show on public wall"}
                                    >
                                        {review.showOnSite ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
