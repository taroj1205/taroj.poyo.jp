import Cookies from 'js-cookie';
import { createContext, useState, useContext, useEffect } from 'react';

export interface AuthContextValue {
    token: string;
    setToken: React.Dispatch<React.SetStateAction<string>>;
    user: ProfileData | null;
    setUser: React.Dispatch<React.SetStateAction<ProfileData | null>>;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const useAuth = () => {
    return useContext(AuthContext);
};


interface ProfileData {
    email?: string;
    user_metadata: {
        username: string;
        avatar: string;
    };
    picture: string;
    name?: string;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [token, setToken] = useState('');
    const [user, setUser] = useState<ProfileData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const userData = localStorage.getItem("userProfileData");
        if (userData) {
            const userDataObj = JSON.parse(userData);
            setUser(userDataObj);
            const userMetadata = userDataObj.user_metadata;
            console.log(userMetadata.username);
        }

        const userToken = Cookies.get('token');
        if (userToken) {
            setToken(userToken);
        }
    }, []);


    const fetchUserProfileData = async () => {
        try {
            const token = Cookies.get('token');
            const userProfileData = localStorage.getItem('userProfileData');
            console.log(token);
            if (token && token.length > 0 && !userProfileData) {
                setIsLoading(true);
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
            } else if (userProfileData && userProfileData.length > 0) {
                setUser(JSON.parse(userProfileData as string));
            }
            console.log(user);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching user profile data:', error);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUserProfileData();
    }, []);

    return (
        <AuthContext.Provider value={{ token, setToken, user, setUser, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};
