import React, { useState, useEffect } from 'react';
import { Grid, Card, RingProgress, Text, Center, Modal, TextInput, Tooltip } from '@mantine/core';
import { IconRun, IconBike, IconSwimming, IconBarbell, IconHelpOctagon } from '@tabler/icons-react';
import { Button } from 'react-bootstrap';
import moment from 'moment';
import './journal.css';
import axios from 'axios';
import config from '../config';

const iconMap = {
  Running: { icon: IconRun, color: '#882255' },
  Cycling: { icon: IconBike, color: '#785EF0' },
  Gym: { icon: IconBarbell, color: '#4B0092' },
  Swimming: { icon: IconSwimming, color: '#0072B2' },
  Other: { icon: IconHelpOctagon, color: '#117733' }
};

const Journal = ({ currentUser }) => {
  const [startDate, setStartDate] = useState(moment().startOf('week'));
  const [endDate, setEndDate] = useState(moment().endOf('week'));
  const [exerciseTargets, setExerciseTargets] = useState({});
  const [updatedTargets, setUpdatedTargets] = useState({});
  const [exercises, setExercises] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isCurrentWeek, setIsCurrentWeek] = useState(true);

  const fetchGraphQLExercises = async () => {
    try {
      const payload = {
        query: `
        query WeeklyExerciseStats {
          stats: statsAggregatedByWeek(
            username: "${currentUser}"
            startdate: "${moment(startDate).format('YYYY-MM-DD')}"
            enddate: "${moment(endDate).format('YYYY-MM-DD')}"
          ) {
            exerciseType
            totalDuration
            totalDistance
            averagePace
            averageSpeed
            topSpeed
          }
        }`
      };
      const response = await axios.post(`${config.apiUrl}/stats/graphql`, payload);
      console.log('API Response:', response.data);
      if (response.data.data.stats && Array.isArray(response.data.data.stats)) {
        const sortedExercises = response.data.data.stats.sort((a, b) => a.id - b.id);
        setExercises(sortedExercises);
      } else {
        console.error('Unexpected response structure:', response.data);
        setExerciseTargets({
          Running: 0,
          Cycling: 0,
          Gym: 0,
          Swimming: 0,
          Other: 0
        });
      }
    } catch (error) {
      console.error('Failed to fetch exercises', error);
    }
  };

  useEffect(() => {
    fetchGraphQLExercises();
  }, [currentUser, startDate, endDate]);

  const fetchWeeklyTargets = async () => {
    try {
      const response = await axios.get(`${config.apiUrl}/targets`);
      const data = response.data;
      const currentWeekTargets = data.find(target => moment(target.weekStartDate).isSame(startDate, 'week'));
      if (currentWeekTargets) {
        setExerciseTargets({
          Running: currentWeekTargets.runningTarget,
          Cycling: currentWeekTargets.cyclingTarget,
          Gym: currentWeekTargets.gymTarget,
          Swimming: currentWeekTargets.swimmingTarget,
          Other: currentWeekTargets.otherTarget
        });
      } else {
        setExerciseTargets({
          Running: 0,
          Cycling: 0,
          Gym: 0,
          Swimming: 0,
          Other: 0
        });
      }
      setIsCurrentWeek(moment().isSame(startDate, 'week'));
    } catch (error) {
      console.error('Error fetching weekly targets:', error);
    }
  };

  useEffect(() => {
    fetchWeeklyTargets();
  }, [startDate]);

  const goToPreviousWeek = () => {
    setStartDate(moment(startDate).subtract(1, 'weeks').startOf('week'));
    setEndDate(moment(endDate).subtract(1, 'weeks').endOf('week'));
  };

  const goToNextWeek = () => {
    setStartDate(moment(startDate).add(1, 'weeks').startOf('week'));
    setEndDate(moment(endDate).add(1, 'weeks').endOf('week'));
  };

  const handleEditTargets = async () => {
    try {
      const response = await axios.get(`${config.apiUrl}/targets`);
      const data = response.data;
      const currentWeekTargets = data.find(target => moment(target.weekStartDate).isSame(startDate, 'week'));
      if (currentWeekTargets) {
        setUpdatedTargets({
          Running: currentWeekTargets.runningTarget,
          Cycling: currentWeekTargets.cyclingTarget,
          Gym: currentWeekTargets.gymTarget,
          Swimming: currentWeekTargets.swimmingTarget,
          Other: currentWeekTargets.otherTarget
        });
      } else {
        setUpdatedTargets({
          Running: exerciseTargets.Running || 0,
          Cycling: exerciseTargets.Cycling || 0,
          Gym: exerciseTargets.Gym || 0,
          Swimming: exerciseTargets.Swimming || 0,
          Other: exerciseTargets.Other || 0
        });
      }
      setShowEditModal(true);
    } catch (error) {
      console.error('Error fetching weekly targets:', error);
    }
  };

  const handleCloseModal = () => {
    setShowEditModal(false);
  };

  const handleSaveTargets = async () => {
    try {
      const maxWeeklyTarget = 10080;
      const isInvalid = Object.values(exerciseTargets).some(value => isNaN(value) || value < 0 || value > maxWeeklyTarget);
      if (isInvalid) {
        alert(`Invalid input! Please enter a value between 0 and ${maxWeeklyTarget}.`);
        return;
      }
      const isTargetSetForFirstTime = Object.values(exerciseTargets).every(value => value === 0);
      console.log(isTargetSetForFirstTime)
      if (isTargetSetForFirstTime || !Object.keys(exerciseTargets).length) {
        const response = await axios.post(`${config.apiUrl}/targets/add`, {
          username: currentUser,
          runningTarget: updatedTargets.Running,
          cyclingTarget: updatedTargets.Cycling,
          gymTarget: updatedTargets.Gym,
          swimmingTarget: updatedTargets.Swimming,
          otherTarget: updatedTargets.Other,
          weekStartDate: startDate.toDate()
        });
        if (response.status === 201) {
          setExerciseTargets(updatedTargets);
          fetchGraphQLExercises();
        } else {
          console.error('Failed to save targets:', response.statusText);
        }
      } else {
        const response = await axios.patch(`${config.apiUrl}/targets/update`, {
          username: currentUser,
          runningTarget: updatedTargets.Running,
          cyclingTarget: updatedTargets.Cycling,
          gymTarget: updatedTargets.Gym,
          swimmingTarget: updatedTargets.Swimming,
          otherTarget: updatedTargets.Other,
          weekStartDate: startDate.toDate()
        });
        if (response.status === 200) {
          setExerciseTargets(updatedTargets);
          fetchGraphQLExercises();
        } else {
          console.error('Failed to update targets:', response.statusText);
        }
      }

      setShowEditModal(false);
      setUpdatedTargets({});
    } catch (error) {
      console.error('Error saving targets:', error);
    }
  };

  return (
    <div className="journal-container">
      <h4>Weekly Exercise Journal</h4>
      <hr />
      <div className="date-range">
        <Button className="button-small" onClick={goToPreviousWeek}>&larr; Previous</Button>
        <span>{startDate.format('MMM DD, YYYY')} - {endDate.format('MMM DD, YYYY')}</span>
        {!isCurrentWeek && <Button className="button-small" onClick={goToNextWeek}>Next &rarr;</Button>}
      </div>

      <div className="weekly-target" onClick={handleEditTargets} style={{ cursor: 'pointer' }}>
        <Text style={{ fontSize: '18px', fontWeight: 'bold' }}>Edit Weekly Target</Text>
      </div>

      {showEditModal && (
        <Modal opened={showEditModal} onClose={handleCloseModal} title="Edit Weekly Targets" size="sm">
          <Grid gutter="sm">
            {Object.keys(iconMap).map((exerciseType, index) => (
              <Grid.Col key={index} span={12}>
                <TextInput
                  label={exerciseType}
                  value={updatedTargets[exerciseType] || ''}
                  onChange={(event) => {
                    const inputValue = event.target.value.trim();
                    const value = inputValue === '' ? '' : parseInt(inputValue, 10);
                    if (inputValue === '' || (!isNaN(value) && value >= 0)) {
                      setUpdatedTargets(prevState => ({ ...prevState, [exerciseType]: value }));
                    }
                  }}
                  type="number"
                  min={0}
                  max={10080}
                  disabled={!isCurrentWeek}
                />
              </Grid.Col>
            ))}
          </Grid>
          {!isCurrentWeek && (
            <Text style={{ marginTop: '10px', color: 'red' }}>
              Editing for previous weeks is not allowed.
            </Text>
          )}
          <div style={{ textAlign: 'right', marginTop: '16px' }}>
            <Button onClick={handleSaveTargets} variant="primary" disabled={!isCurrentWeek}>
              Save
            </Button>
          </div>
        </Modal>
      )}

      <Grid gutter="md" justify="center">
        {exercises.map((exercise, index) => {
          const { icon: Icon, color } = iconMap[exercise.exerciseType];
          const progress = (exercise.totalDuration / exerciseTargets[exercise.exerciseType]) * 100;
          return (
            <Grid.Col key={exercise.id} span={{ xs: 12, sm: 6, md: 4 }}>
              <Card shadow="xs" className="mantine-card">
                <div style={{ position: 'relative', height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <RingProgress size={80} roundCaps thickness={8} sections={[{ value: progress, color }]} />
                  <Center style={{ position: 'absolute' }}>
                    <Icon size={20} style={{ zIndex: 1 }} />
                  </Center>
                </div>
                <div style={{ textAlign: 'center', marginTop: 10 }}>
                  <Text className="exercise-type" c="dimmed" size="xs" tt="uppercase" fw={700}>
                    {exercise.exerciseType}
                  </Text>
                  <Text className="exercise-time" fw={700} size="l">
                    {exerciseTargets[exercise.exerciseType] ? (
                      `${exercise.totalDuration} out of ${exerciseTargets[exercise.exerciseType]} mins`
                    ) : (
                      `${exercise.totalDuration} mins`
                    )}
                  </Text>
                </div>
              </Card>
            </Grid.Col>
          );
        })}
      </Grid>
    </div>
  );
};

export default Journal;
