import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Statistics from './statistics.js';
import { MantineProvider } from '@mantine/core';

const mockAxios = new MockAdapter(axios);

describe('Statistics component', () => {
  beforeEach(() => {
    delete window.ResizeObserver;
    window.ResizeObserver = jest.fn().mockImplementation(() => ({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    }));
  });

  afterEach(() => {
    jest.restoreAllMocks();
    mockAxios.reset(); // Reset mock adapter after each test
  });

  it('fetches and renders data correctly', async () => {
    const mockResponse = {
      data: {
        stats: [
          {
            exercises: [
              { exerciseType: 'Running', totalDuration: 120, totalDistance: 10, averagePace: 6, averageSpeed: 10, topSpeed: 15 },
              { exerciseType: 'Cycling', totalDuration: 90, totalDistance: 20, averagePace: 5, averageSpeed: 15, topSpeed: 20 },
              { exerciseType: 'Swimming', totalDuration: 150, totalDistance: 2, averagePace: 4, averageSpeed: 5, topSpeed: 10 },
              { exerciseType: 'Walking', totalDuration: 180, totalDistance: 8, averagePace: 10, averageSpeed: 6, topSpeed: 8 },
            ],
          },
        ],
      },
    };
  
    mockAxios.onPost('http://localhost/stats/graphql').reply(200, mockResponse);
  
    render(
      <MantineProvider>
        <Statistics currentUser="testUser" />
      </MantineProvider>
    );
  
    // Assert that "Loading..." is initially present
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  
    // Wait for the loading indicator to disappear
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).toBeNull();
    });
  
    // Assert that each exercise type is present
    expect(screen.getByText('Running')).toBeInTheDocument();
    expect(screen.getByText('Cycling')).toBeInTheDocument();
    expect(screen.getByText('Swimming')).toBeInTheDocument();
    expect(screen.getByText('Walking')).toBeInTheDocument();
  });
  

  it('displays no data available message when there is no data', async () => {
    const mockData = {
      data: {
        stats: [
          {
            exercises: [],
          },
        ],
      },
    };

    mockAxios.onPost('http://localhost/stats/graphql').reply(200, mockData);

    render(
      <MantineProvider>
        <Statistics currentUser="testUser" />
      </MantineProvider>
    );

    // Assert that "Loading..." is initially present
    expect(screen.getByText('Loading...')).toBeInTheDocument();

    // Wait for the loading indicator to disappear
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).toBeNull();
    });

    // Assert that "No data available" message is present
    expect(screen.getByText('No data available')).toBeInTheDocument();

    // Assert that no exercise type is rendered
    expect(screen.queryByText('Running')).not.toBeInTheDocument();
    expect(screen.queryByText('Cycling')).not.toBeInTheDocument();
    expect(screen.queryByText('Gym')).not.toBeInTheDocument();
    expect(screen.queryByText('Swimming')).not.toBeInTheDocument();
    expect(screen.queryByText('Walking')).not.toBeInTheDocument();
  });
});
