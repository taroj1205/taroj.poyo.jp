import Cookies from 'js-cookie';
import { createContext, useState, useContext, useEffect } from 'react';

interface AuthContextValue {
    token: string;
    setToken: React.Dispatch<React.SetStateAction<string>>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [token, setToken] = useState('');
    
    useEffect(() => {
        setToken(Cookies.get('token') || '');
    }, []);

    return (
        <AuthContext.Provider value={{ token, setToken }}>
            {children}
        </AuthContext.Provider>
    );
};
