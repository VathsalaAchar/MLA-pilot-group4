import React, { useState } from 'react';
import { Button, Form, Alert } from 'react-bootstrap';
import axios from 'axios';
import { Link } from 'react-router-dom';
import config from '../config';
import logo from '../img/CFG_logo.png';
import '../App.css'

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${config.apiUrl}/auth/login`, {
        username,
        password,
      });

      if (response.status === 200) {
        onLogin(username);
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      setError('Failed to login');
    }
  };

  return (
    <div className="login-container" data-testid="login-container">
      <div className="appTitleLogin">
        <header>
          <img src={logo} alt="CFG Fitness App Logo" id="appLogo" data-testid="app-logo" />
          <h1 data-testid="app-title">MLA Fitness App</h1>
        </header>
      </div>

      {error && <Alert variant="danger" data-testid="error-alert">{error}</Alert>}

      <Form onSubmit={handleLogin}>
        <Form.Group controlId="formUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            data-testid="username-input"
          />
        </Form.Group>

        <Form.Group controlId="formPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            data-testid="password-input"
          />
        </Form.Group>

        <Button variant="primary" type="submit" style={{ marginTop: '20px' }} data-testid="login-button">
          Login
        </Button>
      </Form>

      <p className="mt-3">
        Don't have an account? <Link to="/signup" data-testid="signup-link">Sign up</Link>
      </p>
    </div>
  );
};

export default Login;