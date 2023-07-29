import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

const Logout: React.FC = () => {
    const router = useRouter();

    useEffect(() => {
        // Clear the token cookie
        Cookies.remove('token');
        localStorage.removeItem('userProfileData');

        // Reload the page after clearing the cookie
        window.location.href = '/';
    }, [router]);

    return <div>Logging out...</div>;
};

export default Logout;
