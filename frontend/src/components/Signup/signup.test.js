import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom'
import axios from 'axios';
import { MemoryRouter } from 'react-router-dom'; 
import Signup from './signup';

jest.mock('axios');

describe('Signup component', () => {
  test('renders signup form', () => {
    const { getByTestId } = render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );

    expect(getByTestId('signup-container')).toBeInTheDocument();
    expect(getByTestId('app-logo')).toBeInTheDocument();
    expect(getByTestId('app-title')).toBeInTheDocument();
    expect(getByTestId('username-input')).toBeInTheDocument();
    expect(getByTestId('password-input')).toBeInTheDocument();
    expect(getByTestId('signup-button')).toBeInTheDocument();
    expect(getByTestId('login-link')).toBeInTheDocument();
  });

  test('submits form with valid data', async () => {
    axios.post.mockResolvedValueOnce({ data: 'User registered successfully!' });

    const { getByTestId, getByLabelText } = render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );

    fireEvent.change(getByTestId('username-input'), { target: { value: 'testuser' } });
    fireEvent.change(getByTestId('password-input'), { target: { value: 'Password123!' } });
    fireEvent.click(getByTestId('signup-button'));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledTimes(1);
      expect(axios.post).toHaveBeenCalledWith(expect.stringContaining('/auth/signup'), {
        username: 'testuser',
        password: 'Password123!',
      });
    });
  });

  test('displays error message on failed signup', async () => {
    axios.post.mockRejectedValueOnce(new Error('An error occurred during registration. Please try again.'));

    const { getByTestId, getByText } = render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );

    fireEvent.change(getByTestId('username-input'), { target: { value: 'existinguser' } });
    fireEvent.change(getByTestId('password-input'), { target: { value: 'Password123!' } });
    fireEvent.click(getByTestId('signup-button'));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledTimes(1);
      expect(getByTestId('error-alert')).toHaveTextContent('An error occurred during registration. Please try again.');
    });
  });
});