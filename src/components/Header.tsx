import React from 'react';
import styled from 'styled-components';

const HeaderContainer = styled.header`
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

const Header = () => {
    return (
        <HeaderContainer>
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
        </HeaderContainer>
    );
};

export default Header;
