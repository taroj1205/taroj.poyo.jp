import React from 'react';
import Profile from '../components/Profile';

const HomePage = () => {
    return (
        <main className="container mx-auto py-10 max-w-6xl">
            <h2 className="text-4xl">Welcome to my home page!</h2>
            <Profile />
        </main>
    );
};

export default HomePage;
