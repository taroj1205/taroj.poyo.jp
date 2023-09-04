import React, { ReactNode, useEffect, useState } from 'react';
import Header from './Header';

type LayoutProps = {
    children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
    const [height, setHeight] = useState('calc(100vh-40px)');
    useEffect(() => {
        const setVisualViewport = () => {
            setHeight(`${window.innerHeight - 40}px`);
        }
        setVisualViewport();

        if (window.visualViewport) {
            window.visualViewport.addEventListener('resize', setVisualViewport);
        }

        return () => {
            if (window.visualViewport) {
                window.visualViewport.removeEventListener(
                    'resize',
                    setVisualViewport
                );
            }
        };
    }, []);
    return (
        <>
            <Header />
            <div className='flex flex-col flex-grow min-h-0'>
                <div style={{ height }} className='w-full content absolute'>
                    <main>{children}</main>
                </div>
            </div>
        </>
    );
};

export default Layout;
