import React, { createContext, useContext, useState, Dispatch, SetStateAction, useEffect } from 'react';
import { useRouter } from 'next/router';

interface ActiveLinkContextType {
    activeLink: string;
    setActiveLink: Dispatch<SetStateAction<string>>;
}

export const ActiveLinkContext = createContext<ActiveLinkContextType>({ activeLink: '/', setActiveLink: () => { } });

export const ActiveLinkProvider = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();
    const [activeLink, setActiveLink] = useState(router.pathname); // Set initial value as needed

    useEffect(() => {
        const handleRouteChange = () => {
            setActiveLink(router.pathname);
        };

        router.events.on('routeChangeComplete', handleRouteChange);

        return () => {
            router.events.off('routeChangeComplete', handleRouteChange);
        };
    }, [router]);

    return (
        <ActiveLinkContext.Provider value={{ activeLink, setActiveLink }}>
            {children}
        </ActiveLinkContext.Provider>
    );
};

export const useActiveLink = () => {
    return useContext(ActiveLinkContext);
};
