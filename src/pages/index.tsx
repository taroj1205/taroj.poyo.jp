import React from 'react';
import styled from 'styled-components';
import Header from '../components/Header';
import Profile from '../components/Profile';

const Container = styled.div`
    padding: 20px;
`;

const Title = styled.h1`
    font-size: 24px;
    margin-top: 20px;
    color: #fff;
`;

const Paragraph = styled.p`
    margin-top: 10px;
    color: #666;
`;

const HomePage = () => {
    return (
        <Container>
            <Header />
            <Title>Welcome to taroj.poyo.jp</Title>
            <Paragraph>This is the home page of taroj.poyo.jp.</Paragraph>
            <Profile />
        </Container>
    );
};

export default HomePage;
