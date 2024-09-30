import React from 'react';
import { useLocation } from 'react-router-dom';
import './../css/report.css'; 

const Report = () => {
  const location = useLocation();
  const { responses } = location.state || { responses: {} }; 

  return (
    <div className="report-container">
      <h2>Quiz Report</h2>
      <h4>Time Taken for Each Question:</h4>
      <ul>
        {Object.keys(responses).map((questionId) => (
          <li key={questionId}>
            Question {questionId}: {responses[questionId].time} ms
          </li>
        ))}
      </ul>
      <p>Thank you for participating!</p>
    </div>
  );
};

export default Report;
