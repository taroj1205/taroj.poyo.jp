import React from 'react';
import styled from 'styled-components';

// Styled components for the Banner

const BannerLinks = styled.div`
    position: fixed;
    top: 30%;
    right: 1.5rem;
    display: grid;
    justify-items: center;
    row-gap: 0.5rem;
    opacity: 0;
    visibility: hidden;
    float: right;

    @media only screen and (min-width: 1200px) {
        opacity: 1;
        visibility: visible;
    }
`;

const BannerLink = styled.a`
    font-size: 1.25rem;
    line-height: 1.25;
    color: var(--color-white-100);
`;

const Banner = () => {
    return (
        <BannerLinks className="banner-links">
            <BannerLink href="https://facebook.com/taroj1205" title="">
                <i className="bx bxl-facebook"></i>
            </BannerLink>
            <BannerLink href="https://instagram.com/taroj1205" title="">
                <i className="bx bxl-instagram"></i>
            </BannerLink>
            <BannerLink href="https://taroj1205.twitter.com" title="">
                <i className="bx bxl-twitter"></i>
            </BannerLink>
            <BannerLink
                href="https://www.youtube.com/@user-le6xc5nx5k"
                title=""
            >
                <i className="bx bxl-youtube"></i>
            </BannerLink>
        </BannerLinks>
    );
};

export default Banner;
