import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import './../css/report.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Report = () => {
  const location = useLocation();
  const { responses } = location.state || { responses: {} };
  
  const [showTime, setShowTime] = useState(false);

  const handleShowTime = () => {
    setShowTime(true);
  };

  const times = Object.keys(responses).map(questionId => responses[questionId].time);
  
  const total = times.reduce((sum, time) => sum + time, 0);
  const averageTime = total / times.length;
  const threshold = averageTime * 2.0;

  const chartData = {
    labels: Object.keys(responses).map(questionId => `Question ${questionId}`),
    datasets: [
      {
        label: 'Time Taken (ms)',
        data: times,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Time Taken for Each Question',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="report-container">
      <h2>Quiz Report</h2>

      {!showTime && (
        <button className="cta-button-report" onClick={handleShowTime}>
          Show Time Taken
        </button>
      )}

      {showTime && (
        <>
          <h4>Time Taken for Each Question:</h4>
          <ul>
            {Object.keys(responses).map((questionId) => {
              const time = responses[questionId].time;
              const isHighlighted = time > threshold;
              return (
                <li 
                  key={questionId}
                  className={isHighlighted ? 'highlight' : ''}
                >
                  Question {questionId}: {time} ms {isHighlighted && <strong>(Above Average)</strong>}
                </li>
              );
            })}
          </ul>
          <p>Average Time Taken: {averageTime.toFixed(2)} ms</p>

          {/* Bar Chart */}
          <div className="chart-container">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </>
      )}

      <p>Thank you for participating!</p>
    </div>
  );
};

export default Report;
