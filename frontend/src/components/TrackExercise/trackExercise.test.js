import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import { MantineProvider } from '@mantine/core'; 
import TrackExercise from './trackExercise.js';

import { trackExercise } from '../../api.js';
jest.mock('../../api', () => ({
  trackExercise: jest.fn(),
}));

describe('TrackExercise', () => {
    test('renders correctly', () => {
        render(
            <MemoryRouter>
                <MantineProvider> 
                    <TrackExercise currentUser="testUser" />
                </MantineProvider>
            </MemoryRouter>
        );

        expect(screen.getByTestId('track-exercise-container')).toBeInTheDocument();
        expect(screen.getByTestId('track-exercise-heading')).toBeInTheDocument();
        expect(screen.getByTestId('track-exercise-form')).toBeInTheDocument();
    });

    test('displays error message when submitting without required fields', async () => {
        render(
            <MemoryRouter>
                <MantineProvider> 
                    <TrackExercise currentUser="testUser" />
                </MantineProvider>
            </MemoryRouter>
        );
        const submitButton = screen.getByTestId('submit-button');

        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText('Please enter valid duration')).toBeInTheDocument();
        });
    });

    test('submits form data correctly', async () => {
        render(
          <MemoryRouter>
            <MantineProvider>
              <TrackExercise currentUser="testUser" />
            </MantineProvider>
          </MemoryRouter>
        );
        const runningButton = screen.getByText('Running');
        fireEvent.click(runningButton);
    
        const durationInput = screen.getByLabelText('Duration (in minutes):');
        const distanceInput = screen.getByLabelText('Distance (in km):');
        const submitButton = screen.getByText('Save activity');
    
        fireEvent.change(durationInput, { target: { value: '30' } });
        fireEvent.change(distanceInput, { target: { value: '5' } });
    
    
        fireEvent.click(submitButton);
    
        await waitFor(() => {
          expect(trackExercise).toHaveBeenCalledWith(expect.objectContaining({
            username: 'testUser',
            duration: '30',
            distance: '5',
            exerciseType: 'Running',
          }));
        });
      });
});