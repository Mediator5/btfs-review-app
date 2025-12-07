// src/pages/LoadsTable.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';

import { MoreVertical, Edit2, Trash2, Link as LinkIcon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import supabase from '../services/supabase';


async function fetchLoads() {
    // We join the brokers table to display the assigned broker's name
    const { data, error } = await supabase
        .from('loads')
        .select(`
            *,
            brokers ( name ) 
        `)
        .order('pickupDate', { ascending: false });

    if (error) throw new Error(error.message);
    console.log(data)
    return data;

}

// Placeholder for deleteLoad (implement later if needed)
async function deleteLoad(loadId) {
    // ... Supabase delete logic ...
    const { error } = await supabase
        .from('loads')
        .delete()
        .eq('id', loadId);

    if (error) throw new Error(error.message);
    return null;
}


export default function LoadsTable() {
    const [openPopupId, setOpenPopupId] = useState(null);
    const popupRef = useRef(null);
    const queryClient = useQueryClient();
    const navigate = useNavigate();



    // Fetching Logic
    const { data: loads, isLoading, isError, error } = useQuery({
        queryKey: ['loads'],
        queryFn: fetchLoads,
    });

    // Delete Mutation Logic (same structure as broker delete)
    const { mutate: mutateDelete, isPending: isDeleting } = useMutation({
        mutationFn: deleteLoad,
        onSuccess: () => {
            toast.success('Load deleted successfully.');
            queryClient.invalidateQueries({ queryKey: ['loads'] });
            setOpenPopupId(null);
        },
        onError: (err) => {
            toast.error(err.message);
        },
    });

    // Close popup logic (same as before)
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                setOpenPopupId(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const togglePopup = (id) => {
        setOpenPopupId(openPopupId === id ? null : id);
    };

    const handleDeleteClick = (loadId, loadName) => {
        setOpenPopupId(null);
        if (window.confirm(`Are you sure you want to delete Load ${loadName}? This will delete associated reviews.`)) {
            mutateDelete(loadId);
        }
    };

    // Placeholder actions
    const handleEdit = (loadId) => {

        setOpenPopupId(null); // Close the popup menu
        // Navigate to the edit page URL
        navigate(`/admin/loads/edit/${loadId}`);
    };

    const handleShareLink = (loadId) => {
        const reviewUrl = `${window.location.origin}/submit-review?loadUuid=${loadId}`;
        navigator.clipboard.writeText(reviewUrl);
        toast.success('Review link copied to clipboard!');
        setOpenPopupId(null);
    };


    if (isLoading) return <div className="text-center mt-10">Loading loads...</div>;
    if (isError) return <div className="text-center mt-10 text-red-500">Error: {error.message}</div>;

    return (
        <div className="max-w-6xl mx-auto my-10 p-6">
            <div className='flex justify-between mb-6'>
                <h1 className="text-2xl font-bold ">Manage Loads</h1>
                {/* Link to the CreateLoadPage, no brokerId needed here as it's selected in the form */}
                {/* <Link to={'/admin/loads/create'} className='bg-amber-600 text-white py-3 px-6 rounded-md cursor-pointer' >Add Load</Link> */}
            </div>

            {isDeleting && <div className="p-3 bg-blue-100 text-blue-700 rounded-lg mb-4">Deleting load...</div>}

            <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Load ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Broker</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pickup Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delivery Date</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {loads.map((load) => (
                            <tr key={load.id}>
                                <td className="px-6 py-4 whitespace-nowrap">{load.loadIdName}</td>
                                {/* Access the joined broker name */}
                                <td className="px-6 py-4 whitespace-nowrap">{load.brokers?.name || 'N/A'}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{load.pickupDate}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{load.deliveryDate}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="relative inline-block text-left" ref={openPopupId === load.id ? popupRef : null}>
                                        <button
                                            onClick={() => togglePopup(load.id)}
                                            className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                                            aria-label="Load Actions"
                                            disabled={isDeleting}
                                        >
                                            <MoreVertical className="h-5 w-5" />
                                        </button>

                                        {openPopupId === load.id && (
                                            <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                                                <div className="py-1">
                                                    <button
                                                        onClick={() => handleShareLink(load.id)}
                                                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                                    >
                                                        <LinkIcon className="mr-3 h-4 w-4" />
                                                        Copy Review Link
                                                    </button>
                                                    <button
                                                        onClick={() => handleEdit(load.id)}
                                                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                                    >
                                                        <Edit2 className="mr-3 h-4 w-4" />
                                                        Edit Load
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteClick(load.id, load.loadIdName)}
                                                        className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                                                        disabled={isDeleting}
                                                    >
                                                        <Trash2 className="mr-3 h-4 w-4" />
                                                        Delete Load
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
