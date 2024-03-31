import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom'
import { BrowserRouter } from 'react-router-dom'
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import Login from './login';

jest.mock('axios');

describe('Login component', () => {
    test('renders login form', () => {
        const { getByTestId } = render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );

        expect(getByTestId('login-container')).toBeInTheDocument();
        expect(getByTestId('app-logo')).toBeInTheDocument();
        expect(getByTestId('app-title')).toBeInTheDocument();
        expect(getByTestId('username-input')).toBeInTheDocument();
        expect(getByTestId('password-input')).toBeInTheDocument();
        expect(getByTestId('login-button')).toBeInTheDocument();
        expect(getByTestId('signup-link')).toBeInTheDocument();
    });

    test('submits form with valid credentials', async () => {
        axios.post.mockResolvedValueOnce({ status: 200 }); 

        const onLoginMock = jest.fn();
        const { getByTestId, getByLabelText } = render(
            <MemoryRouter>
                <Login onLogin={onLoginMock} />
            </MemoryRouter>
        );

        fireEvent.change(getByTestId('username-input'), { target: { value: 'testuser' } });
        fireEvent.change(getByTestId('password-input'), { target: { value: 'password' } });
        fireEvent.click(getByTestId('login-button'));

        await waitFor(() => {
            expect(onLoginMock).toHaveBeenCalledTimes(1);
            expect(axios.post).toHaveBeenCalledWith(expect.stringContaining('/auth/login'), {
                username: 'testuser',
                password: 'password',
            });
        });
    });

    test('displays error message on failed login', async () => {
        axios.post.mockRejectedValueOnce(new Error('Failed to login'));

        const { getByTestId, getByLabelText, getByText } = render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );

        fireEvent.change(getByTestId('username-input'), { target: { value: 'invaliduser' } });
        fireEvent.change(getByTestId('password-input'), { target: { value: 'invalidpassword' } });
        fireEvent.click(getByTestId('login-button'));

        await waitFor(() => {
            expect(getByTestId('error-alert')).toHaveTextContent('Failed to login');
        });
    });
});
