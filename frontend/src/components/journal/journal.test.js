import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom'
import Journal from './journal';
import { MantineProvider } from '@mantine/core';

jest.mock('axios', () => ({
    get: jest.fn(() => Promise.resolve({ data: [] })),
    post: jest.fn(() => Promise.resolve({ data: {} })),
    patch: jest.fn(() => Promise.resolve({ data: {} }))
}));

describe('Journal component', () => {
    it('renders correctly', () => {
        const { getByTestId, getByText } = render(<MantineProvider>
            <Journal currentUser="testUser" />
        </MantineProvider>);

        expect(getByTestId('journal-container')).toBeInTheDocument();
        expect(getByText('Weekly Exercise Journal')).toBeInTheDocument();
        expect(getByTestId('previous-week-button')).toBeInTheDocument();
        expect(getByTestId('edit-weekly-target-text')).toBeInTheDocument();
    });
});
