// src/components/SiteReviewCard.jsx (Assuming this is for the public view)
import { useQuery } from "@tanstack/react-query";
import { Star } from 'lucide-react';
import supabase from "../services/supabase";


async function fetchPublicReviews() {
    const { data, error } = await supabase
        .from('reviews')
        .select(`
    *,
    brokers (
      name
    ),
    loads(
    loadIdName
    )
  `).eq('showOnSite', true)

    if (error) throw new Error

    return data

}


export default function SiteReviewCard() {

    const { data: allReviews, error, isLoading } = useQuery({
        queryKey: ['reviews'], // Use the public key here
        queryFn: fetchPublicReviews // Use the filtered function
    });

    if (isLoading) {
        return (
            <div className="text-center mt-10">
                <h4>Loading reviews...</h4>
            </div>
        );
    }

    if (error) {
        console.log(error)
        return (
            <div className="text-center mt-10 text-red-500">
                <h4>{error.message}.</h4>
            </div>
        );
    }

    if (!allReviews || allReviews.length === 0) {
        return (
            <div className="text-center mt-10 text-gray-500">
                <h4>No public reviews available yet.</h4>
            </div>
        );
    }

    return (
        <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-10">
                    What Our Brokers Say
                </h2>

                {/* The Grid Container */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

                    {allReviews.map((review) => (
                        // Individual Review Card
                        <div key={review.id} className="bg-white p-6 rounded-xl shadow-lg flex flex-col h-full transform transition duration-300 hover:scale-105">

                            {/* Stars */}
                            <div className="flex items-center mb-4">
                                {[...Array(review.communicationRating || 5)].map((_, i) => (
                                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                                ))}
                            </div>

                            {/* Review Comment (Quote) */}
                            <p className="text-gray-700 italic mb-6 flex-grow">
                                "{review.comment || 'N/A'}"
                            </p>

                            {/* Broker Name and Load ID */}
                            <div className="flex justify-between items-center text-sm font-semibold text-gray-600">
                                {/* Using Optional Chaining (?) for safe access to joined table names */}
                                <span>{review.brokers?.name || 'Unknown Broker'}</span>
                                <span>Load: {review.loads?.loadIdName || 'N/A'}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
