import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import supabase from '../services/supabase';
import usStates from '../services/UsStates';




export default function CreateLoadDeliveryPage() {

    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // 1. Initialize Form
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

    // 2. Define Mutation
    const mutation = useMutation({
        mutationFn: async (newLoad) => {
            const { data, error } = await supabase
                .from('deliveryLoads')
                .insert([{ ...newLoad, loadCompleted: false }])
                .select();
            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['deliveryLoads']);
            toast.success('Load created successfully!');
            // 3. Navigate to the loads page on success
            navigate('/admin/loadsCompletion');
        },
        onError: (error) => {
            toast.error(`Error: ${error.message}`);
        },
    });

    const onSubmit = (data) => mutation.mutate(data);

    return (
        <div className="min-h-screen flex items-center justify-center p-6">
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
                <header className="mb-8">
                    <h1 className="text-3xl font-extrabold text-slate-800">Add New Load</h1>
                    <p className="text-slate-500 mt-2">Enter the broker and route details to start tracking.</p>
                </header>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Broker Name */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Broker Name</label>
                        <input
                            {...register('brokerName', { required: 'Broker name is required' })}
                            placeholder="e.g. TQL, C.H. Robinson"
                            className={`w-full px-4 py-3 rounded-lg border outline-none transition-all ${errors.brokerName ? 'border-red-500 focus:ring-red-200' : 'border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100'
                                }`}
                        />
                        {errors.brokerName && <p className="text-red-500 text-xs mt-1">{errors.brokerName.message}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Pickup Date */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Pickup Date</label>
                            <input
                                type="date"
                                {...register('pickupDate', { required: 'Date is required' })}
                                className="w-full px-4 py-3 rounded-lg border border-slate-300 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                            />
                        </div>

                        {/* Total Miles */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Total Miles</label>
                            <input
                                type="number"
                                step="0.01"
                                {...register('totalMiles', { required: 'Miles required', min: 1 })}
                                placeholder="0.00"
                                className="w-full px-4 py-3 rounded-lg border border-slate-300 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        {/* Pickup State */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Pickup State</label>
                            {/* <input
                                {...register('pickupState', { required: true, maxLength: 2 })}
                                placeholder="CA"
                                className="w-full px-4 py-3 rounded-lg border border-slate-300 uppercase focus:border-blue-500 outline-none transition-all"
                            /> */}
                            <select {...register('pickupState')} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm px-4 py-3 focus:border-blue-500 outline-none transition-all">
                                {usStates.map((state) => (
                                    <option key={state} value={state}>{state}</option>
                                ))}

                            </select>
                        </div>

                        {/* Delivery State */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Delivery State</label>
                            {/* <input
                                {...register('delivery_state', { required: true, maxLength: 2 })}
                                placeholder="NY"
                                className="w-full px-4 py-3 rounded-lg border border-slate-300 uppercase focus:border-blue-500 outline-none transition-all"
                            /> */}
                            <select {...register('deliveryState')} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm px-4 py-3 focus:border-blue-500 outline-none transition-all">
                                {usStates.map((state) => (
                                    <option key={state} value={state}>{state}</option>
                                ))}

                            </select>
                        </div>
                    </div>

                    <div className="pt-4 flex gap-4">
                        <button
                            type="button"
                            onClick={() => navigate('/admin/loadsCompletion')}
                            className="flex-1 px-6 py-3 rounded-lg font-bold border border-slate-300 text-slate-600 hover:bg-slate-50 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || mutation.isPending}
                            className="flex-1 px-6 py-3 rounded-lg font-bold bg-teald-600 text-white shadow-lg shadow-teald-200 hover:bg-teald-700 transition-all disabled:opacity-50"
                        >
                            {mutation.isPending ? 'Saving...' : 'Create Load'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

