import React, { useState } from 'react';
import {
    FaChevronUp,
    FaChevronDown,
    FaFacebook,
    FaInstagram,
    FaYoutube,
    FaGithub,
    FaTwitter,
    FaLinkedin,
    FaPencilAlt,
} from 'react-icons/fa';
import { Tooltip } from 'react-tooltip';

const FloatingBanner = () => {
    const [isExpanded, setExpanded] = useState(false);

    const handleToggle = () => {
        setExpanded(!isExpanded);
    };

    return (
        <>
            {!isExpanded && (
                <button
                    className="fixed bottom-5 right-5 z-10 bg-gray-800 text-white rounded-full p-3 shadow-md hover:bg-gray-700 transition-colors duration-300"
                    onClick={handleToggle}
                >
                    <FaChevronUp className="text-xl" />
                </button>
            )}

            {isExpanded && (
                <div className="flex flex-col items-center justify-end fixed bottom-5 right-5 space-y-3 z-10 transition-colors duration-300">
                    <div className="flex items-center font-medium">
                        <a
                            className="text-lg flex items-center text-blue-600"
                            data-tooltip-content="Facebook"
                            data-tooltip-place="top"
                            data-tooltip-id="Facebook"
                            href="https://facebook.com/taroj1205"
                        >
                            <FaFacebook className="mr-1 text-xl hover:text-blue-600" />
                        </a>
                        <Tooltip id="Facebook" />
                    </div>
                    <div className="flex items-center font-medium">
                        <a
                            className="text-lg flex items-center text-pink-600"
                            data-tooltip-content="Instagram"
                            data-tooltip-place="top"
                            data-tooltip-id="Instagram"
                            href="https://instagram.com/taroj1205"
                        >
                            <FaInstagram className="mr-1 text-xl hover:text-pink-600 transition-colors duration-300" />
                        </a>
                        <Tooltip id="Instagram" />
                    </div>
                    <div className="flex items-center font-medium">
                        <a
                            className="text-lg flex items-center text-red-600"
                            data-tooltip-content="YouTube"
                            data-tooltip-place="top"
                            data-tooltip-id="YouTube"
                            href="https://www.youtube.com/@user-le6xc5nx5k"
                        >
                            <FaYoutube className="mr-1 text-xl hover:text-red-600 transition-colors duration-300" />
                        </a>
                        <Tooltip id="YouTube" />
                    </div>
                    <div className="flex items-center font-medium">
                        <a
                            className="text-lg flex items-center text-white"
                            data-tooltip-content="GitHub"
                            data-tooltip-place="top"
                            data-tooltip-id="GitHub"
                            href="https://github.com/taroj1205"
                        >
                            <FaGithub className="mr-1 text-xl hover:text-white transition-colors duration-300" />
                        </a>
                        <Tooltip id="GitHub" />
                    </div>
                    <div className="flex items-center font-medium">
                        <a
                            className="text-lg flex items-center text-blue-400"
                            data-tooltip-content="Twitter"
                            data-tooltip-place="top"
                            data-tooltip-id="Twitter"
                            href="https://twitter.com/taroj1205"
                        >
                            <FaTwitter className="mr-1 text-xl hover:text-blue-400 transition-colors duration-300" />
                        </a>
                        <Tooltip id="Twitter" />
                    </div>
                    <div className="flex items-center font-medium">
                        <a
                            className="text-lg flex items-center text-indigo-600"
                            data-tooltip-content="LinkedIn"
                            data-tooltip-place="top"
                            data-tooltip-id="LinkedIn"
                            href="https://www.linkedin.com/in/taroj1205/"
                        >
                            <FaLinkedin className="mr-1 text-xl hover:text-indigo-600 transition-colors duration-300" />
                        </a>
                        <Tooltip id="LinkedIn" />
                    </div>
                    <div className="flex items-center font-medium">
                        <a
                            className="text-lg flex items-center text-orange-600"
                            data-tooltip-content="Blog"
                            data-tooltip-place="top"
                            data-tooltip-id="Blog"
                            href="https://taroj1205.hatenablog.com"
                        >
                            <FaPencilAlt className="mr-1 text-xl hover:text-orange-600 transition-colors duration-300" />
                        </a>
                        <Tooltip id="Blog" />
                    </div>
                    <button
                        aria-label="toggle the menu"
                        className="bg-gray-800 text-white rounded-full p-3 shadow-md hover:bg-gray-700 transition-colors duration-300"
                        onClick={handleToggle}
                    >
                        <FaChevronDown className="text-xl" />
                    </button>
                </div>
            )}
        </>
    );
};

export default FloatingBanner;
