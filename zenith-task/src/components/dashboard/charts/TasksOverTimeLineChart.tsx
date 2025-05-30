"use client";

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area } from 'recharts';

const sampleData = [
  { date: 'Mon', tasks: 5, id: 'day-mon' },
  { date: 'Tue', tasks: 8, id: 'day-tue' },
  { date: 'Wed', tasks: 6, id: 'day-wed' },
  { date: 'Thu', tasks: 10, id: 'day-thu' },
  { date: 'Fri', tasks: 7, id: 'day-fri' },
  { date: 'Sat', tasks: 12, id: 'day-sat' },
  { date: 'Sun', tasks: 9, id: 'day-sun' },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900/80 backdrop-blur-sm text-white p-3 rounded-lg border border-gray-700 shadow-xl">
        <p className="font-bold text-sm mb-1">{`Day: ${label}`}</p>
        <p className="text-xs">
          {`Tasks Completed: ${payload[0].value}`}
        </p>
      </div>
    );
  }
  return null;
};

const TasksOverTimeLineChart: React.FC = () => {
  const handleChartClick = (event: any) => {
    // event can be null if clicking on empty space, check activePayload
    if (event && event.activePayload && event.activePayload.length > 0) {
      const dataPoint = event.activePayload[0].payload;
      console.log(`Chart element clicked: Day ${dataPoint.date}, Tasks: ${dataPoint.tasks}, ID: ${dataPoint.id}`);
      // Future: Navigate or show detailed modal
    }
  };
  
  return (
    <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 shadow-sm">
      <h3 className="text-lg font-semibold text-foreground mb-6">Recent Activity (Tasks Completed)</h3>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <LineChart
            data={sampleData}
            margin={{
              top: 5,
              right: 5, 
              left: -25, 
              bottom: 5,
            }}
            onClick={handleChartClick} // Add click handler to the chart overall
            style={{ cursor: 'pointer' }} // Change cursor for the whole chart area
          >
            <defs>
              <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3DDC97" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#3DDC97" stopOpacity={0.05}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" vertical={false} />
            <XAxis 
              dataKey="date" 
              tick={{ fill: '#A0A0A0', fontSize: 12 }} 
              stroke="#A0A0A0"
              axisLine={{ stroke: "#A0A0A0" }}
            />
            <YAxis 
              tick={{ fill: '#A0A0A0', fontSize: 12 }} 
              stroke="#A0A0A0"
              axisLine={{ stroke: "#A0A0A0" }}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#BB86FC', strokeWidth: 1, strokeDasharray: '3 3' }} />
            <Area 
              type="monotone" 
              dataKey="tasks" 
              stroke={false} 
              fill="url(#lineGradient)" 
              // activeDot={{ r: 6, style: { cursor: 'pointer' } }} // Can make dots interactive
            />
            <Line 
              type="monotone" 
              dataKey="tasks" 
              stroke="#3DDC97"
              strokeWidth={2} 
              dot={{ r: 4, fill: '#3DDC97', stroke: '#121212', strokeWidth: 2, cursor: 'pointer' }} 
              activeDot={{ r: 6, fill: '#3DDC97', stroke: '#121212', strokeWidth: 2, cursor: 'pointer' }}
              // onClick={(props, event) => { /* This onClick on <Line> is tricky due to SVG structure */ }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TasksOverTimeLineChart;
