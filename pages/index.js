import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
    padding: 20px;
`;

const Header = styled.header`
    background-color: #333;
    padding: 10px;
`;

const Nav = styled.nav``;

const NavList = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
`;

const NavItem = styled.li`
    margin-right: 10px;
`;

const NavLink = styled.a`
    color: #fff;
    text-decoration: none;

    &:hover {
        text-decoration: underline;
    }
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
            <Header>
                <Nav>
                    <NavList>
                        <NavItem>
                            <NavLink href="/">Home</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink href="/chat">Chat</NavLink>
                        </NavItem>
                    </NavList>
                </Nav>
            </Header>
            <Title>Welcome to taroj.poyo.jp</Title>
            <Paragraph>This is the home page of taroj.poyo.jp.</Paragraph>
        </Container>
    );
};

export default HomePage;
