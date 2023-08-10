import Cookies from 'js-cookie';
import { createContext, useState, useContext, useEffect } from 'react';

interface AuthContextValue {
    token: string;
    setToken: React.Dispatch<React.SetStateAction<string>>;
    user: ProfileData;
    setUser: React.Dispatch<React.SetStateAction<ProfileData>>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const useAuth = () => {
    return useContext(AuthContext);
};


interface ProfileData {
    email: string;
    username: string;
    picture: string;
    name: string;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [token, setToken] = useState('');

    const [user, setUser] = useState<ProfileData>({
        email: '',
        username: '',
        picture: '',
        name: '',
    })
    
    useEffect(() => {
        setToken(Cookies.get('token') || '');
    }, []);


    const fetchUserProfileData = async () => {
        try {
            const token = Cookies.get('token');
            const userProfileData = localStorage.getItem('userProfileData');
            console.log(token);
            if (token && !userProfileData) {
                const response = await fetch(`/api/profile?token=${encodeURIComponent(token)}`, {
                    method: 'GET'
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch user profile data.');
                }

                const data = await response.json();

                // Store the data in localStorage
                localStorage.setItem('userProfileData', JSON.stringify(data));
                setUser(data);
                console.log(user);
            }
        } catch (error) {
            console.error('Error fetching user profile data:', error);
        }
    };

    useEffect(() => {
        fetchUserProfileData();
    }, []);

    return (
        <AuthContext.Provider value={{ token, setToken, user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};
