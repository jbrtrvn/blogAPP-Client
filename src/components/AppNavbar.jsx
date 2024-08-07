import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCookieBite } from '@fortawesome/free-solid-svg-icons';
import AuthContext from '../AuthContext'; // Ensure correct path

const AppNavbar = () => {
  const { isLoggedIn, user, logout } = useContext(AuthContext);

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <div className="container-fluid">
        <Navbar.Brand as={Link} to="/">
          <FontAwesomeIcon icon={faCookieBite} style={{ marginRight: '8px' }} />
          BiteSizedBlog
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarSupportedContent" />
        <Navbar.Collapse id="navbarSupportedContent">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            {isLoggedIn && (
              <Nav.Link as={Link} to="/create-blog">Create Blog</Nav.Link>
            )}
          </Nav>
          <Nav className="ms-auto d-flex align-items-center">
            {isLoggedIn ? (
              <>
                <span className="navbar-text text-light ms-3">{user ? user.userName : 'Loading...'}</span>
                <Nav.Link as={Link} to="/logout" onClick={logout}>Logout</Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                <Nav.Link as={Link} to="/register">Register</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
};

export default AppNavbar;
