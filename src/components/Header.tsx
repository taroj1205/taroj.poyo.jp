import React from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { FaHome, FaInfoCircle, FaComments, FaGithub, FaTwitter, FaPencilAlt } from 'react-icons/fa';

const Header = () => {
    const { user, error, isLoading } = useUser();
    return (
        <header className="sticky top-0 left-0 z-100 w-full bg-black-300 transition-all duration-350 ease">
            <nav className="container flex items-center justify-between max-w-7xl px-5 py-4 mx-auto">
                <div className="flex items-center space-x-6">
                    <a
                        href="/"
                        className="flex items-center text-white text-lg hover:text-blue-600"
                    >
                        <FaHome className="mr-2 text-xl" />
                        Home
                    </a>
                    <a
                        href="/about"
                        className="flex items-center text-white text-lg hover:text-blue-600"
                    >
                        <FaInfoCircle className="mr-2 text-xl" />
                        About
                    </a>
                    <a
                        href="/chat"
                        className="flex items-center text-white text-lg hover:text-blue-600"
                    >
                        <FaComments className="mr-2 text-xl" />
                        Chat
                    </a>
                </div>
                <div className="relative block cursor-pointer order-1 z-10 w-7 h-4 md:hidden burger">
                    <span className="absolute right-0 w-full h-px bg-white"></span>
                    <span className="absolute right-0 w-full h-px bg-white mt-1"></span>
                    <span className="absolute right-0 w-full h-px bg-white mt-2"></span>
                </div>
                <div className="hidden md:flex md:items-center md:space-x-2">
                    <a
                        className="flex items-center font-medium text-white hover:shadow-md hover:bg-blue-600 transition duration-300 ease-in-out py-2 px-3 rounded-lg menu-block"
                        href="https://github.com/taroj1205"
                    >
                        <FaGithub className="mr-1 text-xl" /> GitHub
                    </a>
                    <a
                        className="flex items-center font-medium text-white hover:shadow-md hover:bg-blue-600 transition duration-300 ease-in-out py-2 px-3 rounded-lg menu-block"
                        href="https://twitter.com/taroj1205"
                    >
                        <FaTwitter className="mr-1 text-xl" /> Twitter
                    </a>
                    <a
                        className="flex items-center font-medium text-white hover:shadow-md hover:bg-blue-600 transition duration-300 ease-in-out py-2 px-3 rounded-lg menu-block"
                        href="https://taroj1205.hatenablog.com"
                    >
                        <FaPencilAlt className="mr-1 text-xl" /> Blog
                    </a>
                </div>
                <div className="flex items-center space-x-2">
                    {user ? (
                        <a
                            className="font-medium text-white hover:shadow-md hover:bg-blue-600 transition duration-300 ease-in-out py-2 px-3 rounded-lg menu-block"
                            href="/api/auth/logout"
                        >
                            Log out
                        </a>
                    ) : (
                        <a
                            className="font-medium text-white hover:shadow-md hover:bg-blue-600 transition duration-300 ease-in-out py-2 px-3 rounded-lg menu-block"
                            href="/api/auth/login"
                        >
                            Log in
                        </a>
                    )}
                </div>
            </nav>
        </header>
    );
};

export default Header;
