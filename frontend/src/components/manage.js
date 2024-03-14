import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from 'react-bootstrap';
import moment from 'moment';
import './journal.css';
import config from '../config';

const Manage = ({ currentUser }) => {
  const [exercises, setExercises] = useState([]);

  useEffect(() => {
    const url = `${config.apiUrl}/exercises/${currentUser}`;

    axios.get(url)
      .then(response => {
        setExercises(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the data!', error);
      });
  }, [currentUser]);

  return (
    <div className="journal-container">
      <h4>All Exercises</h4>
      <br></br>
      <ul>
        {exercises && exercises.length > 0 ? (
          exercises.map((exercise, index) => (
            <li key={index} className="exercise-journal-data">
              {exercise.exerciseType} for {exercise.duration} mins on {moment(exercise.date).format('MMM DD, YYYY')}
            </li>
          ))
        ) : (
          <li>No exercises found for this period.</li>
        )}
      </ul>
    </div>
  );
};

export default Manage;
