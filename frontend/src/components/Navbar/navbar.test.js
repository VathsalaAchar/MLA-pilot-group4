import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom'
import { MemoryRouter } from 'react-router-dom'; 
import NavbarComponent from './navbar.js';

describe('NavbarComponent', () => {
  test('renders navbar with links', () => {
    const { getByTestId, getByText } = render(
      <MemoryRouter>
        <NavbarComponent />
      </MemoryRouter>
    );

    expect(getByTestId('navbar')).toBeInTheDocument();
    expect(getByTestId('app-logo')).toBeInTheDocument();
    expect(getByTestId('app-title')).toBeInTheDocument();
    expect(getByTestId('nav-link-0')).toBeInTheDocument();
    expect(getByTestId('nav-link-1')).toBeInTheDocument();
    expect(getByTestId('nav-link-2')).toBeInTheDocument();
    expect(getByTestId('nav-link-3')).toBeInTheDocument();
    expect(getByTestId('logout-button')).toBeInTheDocument();
  });

  test('calls onLogout when logout link is clicked', () => {
    const mockLogout = jest.fn();
    const { getByTestId } = render(
      <MemoryRouter>
        <NavbarComponent onLogout={mockLogout} />
      </MemoryRouter>
    );

    fireEvent.click(getByTestId('logout-button'));

    expect(mockLogout).toHaveBeenCalledTimes(1);
  });
});