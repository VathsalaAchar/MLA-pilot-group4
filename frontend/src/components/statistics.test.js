import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Statistics from './statistics.js';
import { MantineProvider } from '@mantine/core';

global.ResizeObserver = jest.fn().mockImplementation(() => {
    return {
        observe: jest.fn(),
        disconnect: jest.fn(),
        unobserve: jest.fn()
    }
})
const mockAxios = new MockAdapter(axios);

describe('Statistics component', () => {
    beforeEach(() => {
        delete window.ResizeObserver;
        window.ResizeObserver = jest.fn().mockImplementation(() => ({
          observe: jest.fn(),
          unobserve: jest.fn(),
          disconnect: jest.fn()
        }));
      
      });
      
      afterEach(() => {
        window.ResizeObserver = ResizeObserver;
        jest.restoreAllMocks();
      });

    it('fetches and renders data correctly', async () => {
        const mockResponse = {
            data: {
                stats: [
                    {
                        exercises: [
                            { exerciseType: 'Running', totalDuration: 120, totalDistance: 10, averagePace: 6, averageSpeed: 10, topSpeed: 15 },
                            { exerciseType: 'Cycling', totalDuration: 90, totalDistance: 20, averagePace: 5, averageSpeed: 15, topSpeed: 20 },
                        ],
                    },
                ],
            },
        };

        mockAxios.onPost('/stats/graphql').reply(200, mockResponse);

        render(<MantineProvider><Statistics currentUser="testUser" /></MantineProvider>);

        await waitFor(() => {
            expect(screen.queryByText('Loading...')).toBeNull();

            expect(screen.getByText('Running')).toBeInTheDocument();
            expect(screen.getByText('Cycling')).toBeInTheDocument();
        });
    });

    it('displays no data available message when there is no data', async () => {
        const mockData = {
            stats: [
                {
                    exercises: [],
                },
            ],
        };

        mockAxios.onPost('/stats/graphql').reply(200, mockData);

        render(<MantineProvider><Statistics currentUser="testUser" /></MantineProvider>);

        expect(screen.getByText('Loading...')).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByText('No data available')).toBeInTheDocument();
        });
    });
});
