import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './statistics.css';
import config from '../config';
import { PieChart, Pie, ResponsiveContainer, Sector, Cell, Text } from 'recharts';

const iconMap = {
  Running: '#322142',
  Cycling: '#03A6A6',
  Gym: '#00563E',
  Swimming: '#CE466B',
  Other: '#F25757'
};

const renderActiveShape = (props) => {
  const RADIAN = Math.PI / 180;
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.exerciseType}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <Text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333" width={80} wrap>{`Duration: ${value} min`}</Text>
    </g>
  );
};

const Statistics = ({ currentUser }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const url = `${config.apiUrl}/stats/${currentUser}`;

    axios.get(url)
      .then(response => {
        setData(response.data.stats);
      })
      .catch(error => {
        console.error('There was an error fetching the data!', error);
      });
  }, [currentUser]);

  const currentUserData = data.find(item => item.username === currentUser);

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  return (
    <div className="stats-container">
      <h4>Well done, {currentUser}! This is your overall effort:</h4>
      {loading ? (
        <p>Loading...</p>
      ) : exercisesData.length > 0 ? (
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              activeIndex={activeIndex}
              activeShape={renderActiveShape}
              data={exercisesData}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={120}
              fill="#8884d8"
              dataKey="totalDuration"
              onMouseEnter={onPieEnter}
            >
              {exercisesData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={iconMap[entry.exerciseType]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <p>No data available</p>
      )}
    </div>
  );

};

export default Statistics;
