import React, { ReactNode } from 'react';
import Header from './Header';
import { useRouter } from 'next/router';

type LayoutProps = {
    children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
    return (
        <>
            <Header />
            <div className='flex flex-col flex-grow min-h-0'>
                <div className='h-screen w-full overflow-y-auto content absolute'>
                    <main className='h-screen'>{children}</main>
                </div>
            </div>
        </>
    );
};

export default Layout;
