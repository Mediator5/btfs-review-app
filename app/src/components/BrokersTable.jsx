// src/pages/BrokersTable.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { MoreVertical, Edit2, Trash2, FilePlus2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import supabase from '../services/supabase';





export default function BrokersTable() {
    // State to manage which broker's popup is currently open (stores the ID)
    const [openPopupId, setOpenPopupId] = useState(null);
    const popupRef = useRef(null);

    const navigate = useNavigate()

    const queryClient = useQueryClient(); // Initialize the query client

    async function fetchBrokers() {
        const { data, error } = await supabase
            .from('brokers')
            .select('*')
            .order('name', { ascending: true });

        if (error) throw new Error(error.message);

        return data;


    }

    async function deleteBroker(brokerId) {
        // The .eq() specifies which row to delete based on the ID
        const { error } = await supabase
            .from('brokers')
            .delete()
            .eq('id', brokerId);

        if (error) {
            throw new Error(`Could not delete broker: ${error.message}`);
        }

        // We don't need to return data for a delete operation
        return null;
    }


    // use query fetching logic

    const { data: brokers, isLoading, isError, error } = useQuery({
        queryKey: ['brokers'],
        queryFn: fetchBrokers,
    });

    // Delete Mutation Logic
    const { mutate: mutateDelete, isPending: isDeleting } = useMutation({
        mutationFn: deleteBroker,
        onSuccess: () => {
            toast.success('Broker deleted successfully.');
            // Invalidate and refetch the brokers list to update the UI
            queryClient.invalidateQueries({ queryKey: ['brokers'] });
            setOpenPopupId(null); // Close the popup after deletion
        },
        onError: (err) => {
            toast.error(err.message);
        },
    });

    // Close the popup when clicking outside of it
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

    // Placeholder functions (will be implemented later)
    const handleEdit = (brokerId) => {
        setOpenPopupId(null); // Close the popup menu
        navigate(`/admin/brokers/edit/${brokerId}`); // Navigate to the edit URL
    };
    const handleDelete = (brokerId) => {
        mutateDelete(brokerId)
    };
    const handleAddLoad = (brokerId) => {
        setOpenPopupId(null); // Close the popup menu
        // Navigate to the create load page, passing the brokerId as a search parameter
        navigate(`/admin/loads/create?brokerId=${brokerId}`);
    }

    if (isLoading) return <div className="text-center mt-10">Loading brokers...</div>;
    if (isError) return <div className="text-center mt-10 text-red-500">Error: {error.message}</div>;
    if (isDeleting) return <div className='text-center mt-10'> Deleting broker</div>

    return (
        <div className="max-w-4xl mx-auto my-10 p-6">
            <div className='flex justify-between mb-6'>
                <h1 className="text-2xl font-bold ">Manage Brokers</h1>
                <Link to={'/admin/create-broker'} className='bg-teald-600 text-white py-3 px-6 rounded-md cursor-pointer hover:bg-teald-700' >Add Broker</Link>
            </div>


            <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {brokers.map((broker) => (
                            <tr key={broker.id}>
                                <td className="px-6 py-4 whitespace-nowrap">{broker.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{broker.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="relative inline-block text-left" ref={openPopupId === broker.id ? popupRef : null}>
                                        <button
                                            onClick={() => togglePopup(broker.id)}
                                            className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                                            aria-label="Broker Actions"
                                        >
                                            <MoreVertical className="h-5 w-5" />
                                        </button>

                                        {/* Popup Menu */}
                                        {openPopupId === broker.id && (
                                            <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                                                <div className="py-1">
                                                    <button
                                                        onClick={() => handleAddLoad(broker.id)}
                                                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                                    >
                                                        <FilePlus2 className="mr-3 h-4 w-4" />
                                                        Add Load
                                                    </button>
                                                    <button
                                                        onClick={() => handleEdit(broker.id)}
                                                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                                    >
                                                        <Edit2 className="mr-3 h-4 w-4" />
                                                        Edit Broker
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(broker.id)}
                                                        className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                                                    >
                                                        <Trash2 className="mr-3 h-4 w-4" />
                                                        Delete Broker
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
