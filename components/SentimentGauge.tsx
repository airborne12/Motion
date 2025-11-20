import React from 'react';
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { SentimentType } from '../types';

interface SentimentGaugeProps {
  score: number;
  sentiment: SentimentType;
}

export const SentimentGauge: React.FC<SentimentGaugeProps> = ({ score, sentiment }) => {
  
  const getColor = (s: number) => {
    if (s >= 60) return '#22c55e'; // Green-500
    if (s <= 40) return '#ef4444'; // Red-500
    return '#eab308'; // Yellow-500
  };

  const color = getColor(score);

  // Ensure visual balance for the gauge
  const data = [
    {
      name: 'Score',
      value: score,
      fill: color,
    },
  ];

  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative">
      <h3 className="absolute top-0 text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">Sentiment Score</h3>
      
      <div className="w-full h-[180px] -mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart 
            innerRadius="85%" 
            outerRadius="100%" 
            barSize={12} 
            data={data} 
            startAngle={180} 
            endAngle={0}
            cy="65%"
          >
            <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
            <RadialBar
              background={{ fill: '#1e293b' }}
              dataKey="value"
              cornerRadius={10}
            />
          </RadialBarChart>
        </ResponsiveContainer>
      </div>

      <div className="absolute top-[60%] flex flex-col items-center transform -translate-y-1/2">
        <span className="text-6xl font-bold tracking-tight" style={{ color }}>{score}</span>
        <span className="text-base font-medium text-white mt-1">{sentiment}</span>
      </div>
    </div>
  );
};