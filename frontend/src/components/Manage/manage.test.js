import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom'
import axios from 'axios';
import { MemoryRouter } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import Manage from './manage';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => jest.fn()
}));

jest.mock('axios');

const mockExercises = [
    {
        _id: 'exercise1',
        date: '2024-03-29',
        exerciseType: 'Running',
        duration: 30,
        distance: 5,
        pace: '6:00',
        speed: 10
    },
    {
        _id: 'exercise2',
        date: '2024-03-28',
        exerciseType: 'Cycling',
        duration: 45,
        distance: 20,
        pace: '2:15',
        speed: 15
    }
];

describe('Manage Component', () => {
    beforeEach(() => {
        axios.get.mockResolvedValue({ data: mockExercises });
    });

    it('renders without crashing', async () => {
        render(
            <MemoryRouter>
                <MantineProvider>
                    <Manage currentUser="user123" />
                </MantineProvider>
            </MemoryRouter>
        );

        expect(screen.getByTestId('sort-date')).toBeInTheDocument();
        expect(screen.getByTestId('sort-exercise-type')).toBeInTheDocument();
        expect(screen.getByTestId('sort-duration')).toBeInTheDocument();
        expect(screen.getByTestId('sort-distance')).toBeInTheDocument();
        expect(screen.getByTestId('sort-pace')).toBeInTheDocument();
        expect(screen.getByTestId('sort-speed')).toBeInTheDocument();
    });

});