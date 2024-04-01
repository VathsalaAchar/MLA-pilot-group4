import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import { IconUser,IconHeartPlus, IconChartInfographic, IconNotebook, IconFilePencil, IconLogout } from '@tabler/icons-react';
import { Group } from '@mantine/core';
import logo from '../../img/CFG_logo.png';
import { MantineProvider } from '@mantine/core'; 

const NavbarComponent = ({ onLogout }) => {
  const data = [
    { link: '/trackExercise', label: 'Track New Exercise', icon: IconHeartPlus },
    { link: '/statistics', label: 'Statistics', icon: IconChartInfographic },
    { link: '/journal', label: 'Weekly Journal', icon: IconNotebook },
    { link: '/manage', label: 'Manage', icon: IconFilePencil },
    { link: '/userProfile', label: 'User Profile', icon: IconUser },
    { label: 'Logout', icon: IconLogout },
  ];

  const handleLogout = () => {
    onLogout();
  };

  return (
    <MantineProvider>
    <Navbar className="navbar" expand="lg" data-testid="navbar">
      <div className="navbarMain">
        <Group id="header" align="center">
          <img src={logo} alt="CFG Fitness App Logo" id="appLogo" data-testid="app-logo" />
          <h3 id="appTitle" data-testid="app-title">MLA Fitness App</h3>
        </Group>
        <Nav className="mr-auto flex-column navComponent">
          {data.map((item, index) => (
            item.label === 'Logout' ? (
              <Nav.Link key={index} id="navLink" onClick={handleLogout} data-testid="logout-link">
                <item.icon className="linkIcon" stroke={1.5} />
                <span>{item.label}</span>
              </Nav.Link>
            ) : (
              <Link key={index} id="navLink" to={item.link} data-testid={`nav-link-${index}`}>
                <item.icon className="linkIcon" stroke={1.5} />
                <span>{item.label}</span>
              </Link>
            )
          ))}
        </Nav>
      </div>
    </Navbar>
    </MantineProvider>
  );
};

export default NavbarComponent;
