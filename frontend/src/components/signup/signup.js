import React, { useState } from 'react';
import { Button, Form, Alert } from 'react-bootstrap';
import axios from 'axios';
import { Link } from 'react-router-dom';
import config from '../../config';
import logo from '../../img/CFG_logo.png';
import '../../App.css'

const Signup = ({ onSignup }) => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  //function to check if the password meets the criteria or not
  const isPasswordValid = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;
    return regex.test(password);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    const { username, password } = formData;

    //If password doesn't meet the criteria it shows the error message
    if (!isPasswordValid(password)) {
      setError('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character');
      return;
    }

    try {
        const response = await axios.post(`${config.apiUrl}/auth/signup`, formData);

        if (response.data === 'User registered successfully!') {
            console.log('User registered successfully');
            onSignup(formData.username); 
        } else {
            setError(response.data);
        }
    } catch (error) {
        console.error('Error during registration', error);
        setError(error.response?.data || 'An error occurred during registration. Please try again.');
    }
  };


  return (
    <div className="login-container" data-testid="signup-container">
      <div className="appTitleLogin">
        <header>
          <img src={logo} alt="CFG Fitness App Logo" id="appLogo" data-testid="app-logo" />
          <h1 data-testid="app-title">MLA Fitness App</h1>
        </header>
      </div>
      {error && <Alert variant="danger" data-testid="error-alert">{error}</Alert>}

      <Form onSubmit={handleSignup}>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            required
            data-testid="username-input"
          />
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
            data-testid="password-input"
          />
        </Form.Group>

        <Button variant="primary" type="submit" style={{ marginTop: '20px' }} data-testid="signup-button">
          Signup
        </Button>
      </Form>
      <p className="mt-3">
        Already have an account? <Link to="/login" data-testid="login-link">Login</Link>
      </p>
    </div>
  );
};

export default Signup;