import React, { useState, useEffect, useRef } from 'react';
import { FaUser, FaSignOutAlt } from 'react-icons/fa';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';

const Profile = () => {
    const { user, error, isLoading } = useUser();
    const { t } = useTranslation();
    const router = useRouter();

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const toggleDropdown = () => {
        setIsDropdownOpen((prevState) => !prevState);
    };
    const handleLink = (url: string) => {
        router.push(url);
        setIsDropdownOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsDropdownOpen(false);
            }
        };

        const timeout = setTimeout(() => {
            setIsDropdownOpen(false);
        }, 2000);

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            clearTimeout(timeout);
        };
    }, []);
    return (
        <div className="md:ml-4 flex items-center relative" ref={dropdownRef}>
            <button
                aria-label="profile picture"
                className="focus:outline-none"
                onClick={toggleDropdown}
            >
                <img
                    className="w-8 h-8 m-1 rounded-full"
                    src={user?.picture ?? ''}
                    alt="Profile picture"
                />
            </button>
            {isDropdownOpen && (
                <div className="absolute top-8 right-2 mt-2 w-48 bg-white rounded-md shadow-lg">
                    <div className="py-1">
                        <button
                            aria-label="go to profile"
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => handleLink('/profile')}
                        >
                            <FaUser className="mr-2 inline" />
                            {t('profile')}
                        </button>
                        <button
                            aria-label="logout"
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => handleLink('/api/auth/logout')}
                        >
                            <FaSignOutAlt className="mr-2 inline" />
                            {t('logout')}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
