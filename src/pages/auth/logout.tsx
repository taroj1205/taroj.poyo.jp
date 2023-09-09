import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import { useAuth } from '../../components/AuthContext';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseUrl, supabaseAnonKey, { auth: { persistSession: false } });

const Logout: React.FC = () => {
    const router = useRouter();
    const { setUser, setToken } = useAuth() || {};

    useEffect(() => {
        // Clear the token cookie
        Cookies.remove('token');
        localStorage.clear();

        // Logout from Supabase
        supabase.auth.signOut();

        // Reload the page after clearing the cookie
        setUser?.(null);
        setToken?.('');
        router.back();
    }, [router]);

    return <div>Logging out...</div>;
};

export default Logout;