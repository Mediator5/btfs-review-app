// src/components/Login.jsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import supabase from '../services/supabase';

export default function Login() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        const { email, password } = data;

        try {
            // Use Supabase signInWithPassword method (V2 syntax)
            const { error, data: authData } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                // Specific handling for common auth errors
                if (error.status === 400 || error.status === 401) {
                    toast.error("Invalid email or password.");
                } else {
                    toast.error(`Login failed: ${error.message}`);
                }
            } else if (authData.user) {
                // Success: Redirect to the admin dashboard
                toast.success("Login successful!");
                navigate('/admin', { replace: true });
            }
        } catch (error) {
            toast.error("An unexpected error occurred during login.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="max-w-md w-full p-8 bg-white shadow-xl rounded-lg">
                <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Admin Login</h1>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            {...register('email', { required: true, pattern: /^\S+@\S+$/i })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-3 focus:border-blue-500 focus:ring-blue-500"
                        />
                        {errors.email && <span className="text-red-500 text-xs mt-1 block">A valid email is required.</span>}
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            id="password"
                            {...register('password', { required: true, minLength: 6 })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-3 focus:border-blue-500 focus:ring-blue-500"
                        />
                        {errors.password && <span className="text-red-500 text-xs mt-1 block">Password is required (min 6 chars).</span>}
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="cursor-pointer w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-teald-600 hover:bg-teald-700 disabled:opacity-50 transition duration-150"
                    >
                        {isSubmitting ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>

                {/* <p className="mt-4 text-center text-sm text-gray-600">
                    <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                        Forgot your password?
                    </a>
                </p> */}
            </div>
        </div>
    );
}




