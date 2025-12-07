// src/components/ProtectedRoute.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import supabase from '../services/supabase';
import Loader from './Loader';



export default function ProtectedRoute() {
    const navigate = useNavigate();
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check the initial session status
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setLoading(false);
        });

        // Listen for auth state changes (login/logout events)
        // The data object returned here has the unsubscribe function
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setSession(session);
                setLoading(false);
            }
        );

        // Cleanup the listener using the 'subscription' object
        return () => {
            if (subscription) {
                subscription.unsubscribe(); // This is the correct method now
            }
        };
    }, []);

    if (loading) {
        return <Loader />; // Show a full-page loader while checking auth status
    }

    if (!session) {
        // If no session, redirect to the login page
        navigate('/login', { replace: true });
        return null;
    }

    // If authenticated, render the child routes (via Outlet)
    return <Outlet />;
}
