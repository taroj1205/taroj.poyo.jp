import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import { useAuth } from '../../components/AuthContext';

const Logout: React.FC = () => {
    const router = useRouter();
    const {setUser, setToken} = useAuth() || {};

    useEffect(() => {
        // Clear the token cookie
        Cookies.remove('token');
        localStorage.removeItem('userProfileData');

        // Reload the page after clearing the cookie
        setUser?.(null);
        setToken?.('');
        router.back();
    }, [router]);

    return <div>Logging out...</div>;
};

export default Logout;
