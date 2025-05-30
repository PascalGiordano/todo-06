"use client";

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

const sampleData = [
  { name: 'Project Alpha', completed: 75, remaining: 25, total: 100 },
  { name: 'Project Beta', completed: 50, remaining: 50, total: 100 },
  { name: 'Project Gamma', completed: 80, remaining: 20, total: 100 },
  { name: 'Project Delta', completed: 30, remaining: 70, total: 100 },
];

// Define a color palette for the bars - can be expanded
const COLORS = ['#BB86FC', '#3DDC97', '#F4A261', '#E76F51'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900/80 backdrop-blur-sm text-white p-3 rounded-lg border border-gray-700 shadow-xl">
        <p className="font-bold text-sm mb-1">{label}</p>
        <p className="text-xs">
          {`Completed: ${payload[0].value}%`}
        </p>
         <p className="text-xs">
          {`Remaining: ${payload[0].payload.remaining}%`}
        </p>
      </div>
    );
  }
  return null;
};

const TaskCompletionBarChart: React.FC = () => {
  return (
    <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 shadow-sm">
      <h3 className="text-lg font-semibold text-foreground mb-6">Project Completion Status</h3>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <BarChart
            data={sampleData}
            margin={{
              top: 5,
              right: 0, // No right margin for XAxis labels to be fully visible
              left: -25, // Adjust left margin to make YAxis labels visible
              bottom: 5,
            }}
            barGap={10} // Gap between bars of the same category (not applicable here as one bar per category)
            barCategoryGap="20%" // Gap between categories (groups of bars)
          >
            <defs>
              <linearGradient id="barGradientPrimary" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#BB86FC" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#BB86FC" stopOpacity={0.3}/>
              </linearGradient>
               <linearGradient id="barGradientSecondary" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3DDC97" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3DDC97" stopOpacity={0.3}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" vertical={false} />
            <XAxis 
              dataKey="name" 
              tick={{ fill: '#A0A0A0', fontSize: 12 }} 
              stroke="#A0A0A0"
              axisLine={{ stroke: "#A0A0A0" }}
            />
            <YAxis 
              tick={{ fill: '#A0A0A0', fontSize: 12 }} 
              stroke="#A0A0A0"
              axisLine={{ stroke: "#A0A0A0" }}
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(187, 134, 252, 0.1)' }} />
            {/* <Legend wrapperStyle={{ fontSize: '14px', color: '#E0E0E0' }} /> */}
            <Bar dataKey="completed" name="Completed" radius={[4, 4, 0, 0]} fill="url(#barGradientPrimary)">
              {/* Apply different colors if needed, for now one gradient */}
              {/* {sampleData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))} */}
            </Bar>
            {/* If we wanted stacked bars for completed/remaining:
            <Bar dataKey="remaining" name="Remaining" stackId="a" fill="#4A5568" radius={[4, 4, 0, 0]} />
            */}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TaskCompletionBarChart;
