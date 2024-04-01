import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './statistics.css';
import { PieChart, Pie, ResponsiveContainer, Cell } from 'recharts'; // Import Text component
import { Text as MText, Card, Group } from '@mantine/core';

const iconMap = {
  Running: '#882255',
  Cycling: '#024059',
  Gym: '#4B0092',
  Swimming: '#0072B2',
  Walking: '#00412A',
  Other: '#112D6E'
};

const Statistics = ({ currentUser }) => {
  const [exercisesData, setExercisesData] = useState([]);
  const [activeDurationIndex, setActiveDurationIndex] = useState(0);
  const [activeDistanceIndex, setActiveDistanceIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGraphQLData = async () => {
      try {
        const payload = {
          query: `
          query OverallStatistics {
            stats: statsByUsername(username: "${currentUser}") { 
              exercises { 
                exerciseType 
                totalDuration 
                totalDistance
                averagePace
                averageSpeed
                topSpeed
              }
            }
          }`
        };
        const response = await axios.post(`/stats/graphql`, payload);
        setExercisesData(response.data.data.stats[0].exercises);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchGraphQLData();
  }, [currentUser]);

  const onDurationPieEnter = (_, index) => {
    setActiveDurationIndex(index);
  };

  const onDistancePieEnter = (_, index) => {
    setActiveDistanceIndex(index);
  };

  return (
    <div className="stats-container">
      <h4>Well done, {currentUser}! This is your overall effort:</h4>
      <hr />
      {loading ? (
        <p>Loading...</p>
      ) : exercisesData.length > 0 ? (
        <div className="charts-container">
          <ResponsiveContainer width="50%" height={400}>
            <PieChart>
              <Pie
                data-testid="duration-pie" // Add data-testid for duration pie chart
                activeIndex={activeDurationIndex}
                data={exercisesData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={125}
                fill="#8884d8"
                dataKey="totalDuration"
                onMouseEnter={onDurationPieEnter}
              >
                {exercisesData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={iconMap[entry.exerciseType]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <ResponsiveContainer width="50%" height={400}>
            <PieChart>
              <Pie
                data-testid="distance-pie" // Add data-testid for distance pie chart
                activeIndex={activeDistanceIndex}
                data={exercisesData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={125}
                fill="#82ca9d"
                dataKey="totalDistance"
                onMouseEnter={onDistancePieEnter}
              >
                {exercisesData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={iconMap[entry.exerciseType]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p className="no-data-message">No data available</p>
      )}
      <div className="card-container">
        {exercisesData.map((entry, index) => (
          // Render card for Running, Cycling, Swimming and Walking exercises only for now
          entry.exerciseType === "Running" || entry.exerciseType === "Cycling" || entry.exerciseType === "Swimming" || entry.exerciseType === "Walking" ? (
            <Card key={index} shadow='md' p="xl" radius="md" className='card'>
              <div className='inner'>
                <div>
                  <MText fz="xl" className='label'>
                    {entry.exerciseType}
                  </MText>
                  <div>
                    <MText className='lead' mt={30}>
                      {entry.topSpeed !== null ?
                        <span>{entry.topSpeed} <span className="unit">km/hr</span></span>
                        : 'N/A'}
                    </MText>
                    <MText fz="xs" c="dimmed">
                      Top Speed
                    </MText>
                  </div>
                  <Group mt="lg" >
                    <div >
                      <MText className='label'>{entry.averagePace != null ?
                        <span>{entry.averagePace.toFixed(2)} <span className="unit">min/km</span></span>
                        : 'N/A'}
                      </MText>
                      <MText size="xs" c="dimmed">
                        Average Pace
                      </MText>
                    </div>
                    <div className="average-speed">
                      <MText className='label'>{entry.averageSpeed != null ?
                        <span>{entry.averageSpeed.toFixed(2)} <span className="unit">km/hr</span></span>
                        : 'N/A'}
                      </MText>
                      <MText size="xs" c="dimmed">
                        Average Speed
                      </MText>
                    </div>
                  </Group>
                </div>
              </div>

            </Card>
          ) : null
        ))}
      </div>
    </div>
  );
};

export default Statistics;
