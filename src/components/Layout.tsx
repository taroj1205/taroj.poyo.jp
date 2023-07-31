import React, { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import { useRouter } from 'next/router';

type LayoutProps = {
    children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
    const router = useRouter();
    const { pathname } = router;

    // const shouldRenderHeaderAndBanner =
    //     pathname !== '/chat';
    const shouldRenderFooter = pathname === '/' || pathname === '/about'
    
    return (
        <>
            <Header />
            <main>{children}</main>
            {shouldRenderFooter && <Footer />}
        </>
    );
};

export default Layout;
