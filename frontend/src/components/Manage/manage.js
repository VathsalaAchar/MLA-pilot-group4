import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import { Table, Text, rem, ActionIcon, Flex, Tooltip } from '@mantine/core';
import { IconChevronDown, IconChevronUp, IconEdit, IconTrash } from '@tabler/icons-react';
import moment from 'moment';
import './manage.css';
import config from '../../config';

const Manage = ({ currentUser }) => {
  const [exercises, setExercises] = useState([]);
  const [sortedExercises, setSortedExercises] = useState([]);
  const [sortBy, setSortBy] = useState(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setSortedExercises(exercises);
  }, [exercises]);

  useEffect(() => {
    getExercises();
  }, []);

  const getExercises = async () => {
    try {
      const url = `${config.apiUrl}/exercises/user/${currentUser}`;
      const response = await axios.get(url);
      if (response.data) {
        setExercises(response.data);
      } else {
        console.error('Failed to fetch data:', response.data);
        setExercises([]);
      }
    } catch (error) {
      console.error('Failed to fetch exercises:', error);
      setExercises([]);
    }
  };

  const handleDeleteExercise = async (id) => {
    try {
      await axios.delete(`${config.apiUrl}/exercises/${id}`);
      getExercises();
    } catch (error) {
      console.error('Failed to delete exercise:', error);
    }
  };

  const handleEditExercise = async (id) => {
    try {
      const response = await axios.get(`${config.apiUrl}/exercises/${id}`);
      navigate(`/trackExercise/`, {
        state: response.data
      });
    } catch (error) {
      console.error('Failed to fetch exercise for editing:', error);
    }
  };

  const handleSort = (field) => {
    setSortBy(field);
    setReverseSortDirection((prevReverseSortDirection) =>
      field === sortBy ? !prevReverseSortDirection : false
    );
    filterAndSortExercises(field);
  };

  const filterAndSortExercises = (sortByField) => {
    const sortedExercisesCopy = [...exercises];

    sortedExercisesCopy.sort((a, b) => {
      if (sortByField === 'date') {
        return moment(a.date).valueOf() - moment(b.date).valueOf();
      }

      if (sortByField === 'duration') {
        return a.duration - b.duration;
      }

      if (sortByField === 'distance' || sortByField === 'pace' || sortByField === 'speed') {
        return a[sortByField] - b[sortByField];
      }

      return a[sortByField].localeCompare(b[sortByField]);
    });

    if (reverseSortDirection) {
      sortedExercisesCopy.reverse();
    }

    setSortedExercises(sortedExercisesCopy);
  };

  const exerciseRows = sortedExercises.map((exercise, index) => (
    <Table.Tr key={index} className="exercise-journal-data">
      <Table.Td style={{ textAlign: 'center' }}>{moment(exercise.date).format('MMM DD, YYYY')}</Table.Td>
      <Table.Td style={{ textAlign: 'center' }}>{exercise.exerciseType}</Table.Td>
      <Table.Td style={{ textAlign: 'center' }}>{exercise.duration} mins</Table.Td>
      <Table.Td style={{ textAlign: 'center' }}>{exercise.distance !== 0 ? `${exercise.distance} km` : '-'}</Table.Td>
      <Table.Td style={{ textAlign: 'center' }}>{exercise.pace !== 0 ? `${exercise.pace} min/km` : '-'}</Table.Td>
      <Table.Td style={{ textAlign: 'center' }}>{exercise.speed !== 0 ? `${exercise.speed} km/hr` : '-'}</Table.Td>
      <Table.Td style={{ textAlign: 'center' }}>
        <Flex gap="md" style={{ justifyContent: 'center' }}>
          <Tooltip label="Edit">
            <ActionIcon size={25} color='#0072B2' onClick={() => handleEditExercise(exercise._id)} aria-label={`Edit exercise ${index}`}>
              <IconEdit style={{ width: rem(20), height: rem(20) }} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Delete">
            <ActionIcon size={25} color="#882255" onClick={() => handleDeleteExercise(exercise._id)} aria-label={`Delete exercise ${index}`}>
              <IconTrash style={{ width: rem(20), height: rem(20) }} />
            </ActionIcon>
          </Tooltip>
        </Flex>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <div className='manageContainer' data-testid="manage-container">
      <h4>Manage Exercise</h4>
      <hr/>
      <Table horizontalSpacing="md" verticalSpacing="md" miw={700} layout="fixed">
        <Table.Thead>
          <Table.Tr>
            <Th sorted={sortBy === 'date'} reverseSortDirection={reverseSortDirection} onSort={() => handleSort('date')} data-testid="sort-date">Date</Th>
            <Th sorted={sortBy === 'exerciseType'} reverseSortDirection={reverseSortDirection} onSort={() => handleSort('exerciseType')} data-testid="sort-exercise-type">Exercise Type</Th>
            <Th sorted={sortBy === 'duration'} reverseSortDirection={reverseSortDirection} onSort={() => handleSort('duration')} data-testid="sort-duration">Duration</Th>
            <Th sorted={sortBy === 'distance'} reverseSortDirection={reverseSortDirection} onSort={() => handleSort('distance')} data-testid="sort-distance">Distance</Th>
            <Th sorted={sortBy === 'pace'} reverseSortDirection={reverseSortDirection} onSort={() => handleSort('pace')} data-testid="sort-pace">Pace</Th>
            <Th sorted={sortBy === 'speed'} reverseSortDirection={reverseSortDirection} onSort={() => handleSort('speed')} data-testid="sort-speed">Speed</Th>
            <Th>Actions</Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {exerciseRows.length > 0 ? (
            exerciseRows
          ) : (
            <Table.Tr>
              <Table.Td colSpan={7}>
                <Text fw={500} ta="center">No exercises found.</Text>
              </Table.Td>
            </Table.Tr>
          )}
        </Table.Tbody>
      </Table>
    </div>
  );
};

const Th = ({ children, sorted, reverseSortDirection, onSort, ...props }) => {
  const Icon = sorted ? (reverseSortDirection ? IconChevronUp : IconChevronDown) : null;

  return (
    <Table.Th onClick={onSort} className="th" style={{ fontWeight: 'bold', fontSize: '1.1rem', textAlign: 'center' }} {...props}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div>{children}</div>
        {Icon && <Icon className="icon" style={{ width: rem(16), height: rem(16), marginLeft: '0.25rem' }} />}
      </div>
    </Table.Th>
  );
};

export default Manage;
