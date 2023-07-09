import React, { ReactNode } from 'react';
import Header from './Header';

type LayoutProps = {
    children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
    return (
        <div>
            <Header />
            <main>{children}</main>
            <footer>{/* Footer content */}</footer>
        </div>
    );
};

export default Layout;
