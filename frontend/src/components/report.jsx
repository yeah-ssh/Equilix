import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import './../css/report.css';
import MemoryGame from './memorygame';
import WhackAMole from './whackamole';
import AIComponent from './aicomponent';
import SummarizeOutlinedIcon from '@mui/icons-material/SummarizeOutlined';
import HourglassBottomOutlinedIcon from '@mui/icons-material/HourglassBottomOutlined';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import PsychologyOutlinedIcon from '@mui/icons-material/PsychologyOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import MazeGame from './mazegame';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const questions = [   
  { id: 1, text: 'I had trouble calming down' },
  { id: 2, text: 'I noticed my mouth felt dry' },
  { id: 3, text: 'I struggled to feel happy or enjoy things' },
  { id: 4, text: 'I had trouble breathing, even when I wasn’t exercising' },
  { id: 5, text: 'I found it hard to get started on things' },
  { id: 6, text: 'I felt like I overreacted to situations' },
  { id: 7, text: 'My hands shook, even when I wasn’t nervous' },
  { id: 8, text: 'I felt like I was using up a lot of energy being anxious or nervous' },
  { id: 9, text: 'I worried about embarrassing myself in certain situations' },
  { id: 10, text: 'I felt like I had nothing exciting to look forward to' },
  { id: 11, text: 'I got frustrated or irritated easily' },
  { id: 12, text: 'I found it hard to relax' },
  { id: 13, text: 'I felt sad or down most of the time' },
  { id: 14, text: 'I got annoyed when something interrupted what I was doing' },
  { id: 15, text: 'I felt like I was about to panic' },
  { id: 16, text: 'I couldn’t get excited about anything' },
  { id: 17, text: 'I didn’t feel good about myself' },
  { id: 18, text: 'I felt easily annoyed by others' },
  { id: 19, text: 'I noticed my heart beating fast, even when I wasn’t active' },
  { id: 20, text: 'I felt scared or nervous for no reason' },
  { id: 21, text: 'I felt like life didn’t have much meaning' }
];

const Report = () => {
  const location = useLocation();
  const { depression = {}, anxiety = {}, stress = {}, responses = {} } = location.state || {};

  const [activeSection, setActiveSection] = useState(null); // Initialize to null to show buttons only
  const [activeGame, setActiveGame] = useState(null);
  const [expandedQuestionId, setExpandedQuestionId] = useState(null);

  const timeData = Object.values(responses).map((response) => response.time / 1000);
  const averageTime = timeData.length ? timeData.reduce((sum, time) => sum + time, 0) / timeData.length : 0;
  const threshold = averageTime * 1.5;

  const data = {
    labels: Object.keys(responses),
    datasets: [
      {
        label: 'Time Taken (seconds)',
        data: timeData,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Time Taken for Each Question',
      },
    },
  };

  const handleQuestionClick = (questionId) => {
    setExpandedQuestionId(prevId => (prevId === questionId ? null : questionId));
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Report', 20, 10);
  
    
    doc.setFontSize(12);
    let yOffset = 20;
    if (location.state?.email) {
      doc.text(`Email: ${location.state.email}`, 20, yOffset);
      yOffset += 10;
    }
  
    
    doc.text(`Depression Level: ${depression}`, 20, yOffset);
    yOffset += 10; 
    doc.text(`Anxiety Level: ${anxiety}`, 20, yOffset);
    yOffset += 10; 
    doc.text(`Stress Level: ${stress}`, 20, yOffset);
  
    
    doc.autoTable({
      startY: yOffset + 10, 
      head: [['Question', 'Response Time (seconds)', 'Question Text']],
      body: Object.entries(responses).map(([questionId, response]) => {
        const questionText = questions.find(q => q.id === parseInt(questionId, 10))?.text || '';
        return [`Question ${questionId}`, (response.time / 1000).toFixed(2), questionText];
      }),
    });
  
    
    doc.save('your_report.pdf');
  };

  return (
    <div class="background-overlay">
       <video autoPlay muted loop className="background-video">
          <source src={require('./../images/11.mp4')} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
    <div className="report-container">
      
      <div className="button-container">
        <button className="toggle-button" onClick={() => setActiveSection('results')}><SummarizeOutlinedIcon/>&ensp;Results</button>
        <button className="toggle-button" onClick={() => setActiveSection('timeData')}><HourglassBottomOutlinedIcon/>Time Data</button>
        <button className="toggle-button" onClick={() => setActiveSection('games')}><SmartToyOutlinedIcon/>&ensp;Games</button>
        <button className="toggle-button" onClick={() => setActiveSection('gpt')}><PsychologyOutlinedIcon/>&ensp;Talk to AI</button>
        <button className="toggle-button" onClick={generatePDF}><FileDownloadOutlinedIcon/>Download PDF</button>
       
      </div>

      <div className="content">
        {activeSection === 'results' && (
          <div className="results">
            <h2>Level of Severity</h2>
            <p id="depression-level">Depression: {depression}</p>
            <p id="stress-level">Stress: {stress}</p>
            <p id="anxiety-level">Anxiety: {anxiety}</p>
          </div>
        )}

        {activeSection === 'timeData' && (
          <div className="time-data">
            <h2>Time Taken for Each Question</h2>
            <ul className="time-list">
              {Object.entries(responses).map(([questionId, response]) => {
                const time = response.time / 1000;
                const isExceeding = time > threshold;
                const isExpanded = expandedQuestionId === parseInt(questionId, 10);

                return (
                  <li key={questionId} className={isExceeding ? 'highlight' : ''}>
                    <span onClick={() => handleQuestionClick(parseInt(questionId, 10))} style={{ cursor: 'pointer', color: '#007bff' }}>
                      {`Question ${questionId}: ${time.toFixed(2)} seconds`}
                    </span>
                    {isExpanded && (
                      <p>{questions.find(q => q.id === parseInt(questionId, 10)).text}</p>
                    )}
                  </li>
                );
              })}
            </ul>
            <p><strong>Average Time Taken:</strong> {averageTime.toFixed(2)} seconds</p>

            <div className="chart-container">
              <Bar options={options} data={data} />
            </div>
          </div>
        )}

        {activeSection === 'games' && (
          <div className="games">
            <div className="game-buttons">
              <button className={`game-button ${activeGame === 'memory' ? 'active' : ''}`} onClick={() => setActiveGame('memory')}>Memory Cards</button>
              <button className={`game-button ${activeGame === 'whack' ? 'active' : ''}`} onClick={() => setActiveGame('whack')}>Whack A Mole</button>
              <button className={`game-button ${activeGame === 'maze' ? 'active' : ''}`} onClick={() => setActiveGame('maze')}>Cat & Mouse</button>

            </div>
            <div className="game-area">
              {activeGame === 'memory' && <MemoryGame />}
              {activeGame === 'whack' && <WhackAMole />}
              {activeGame==='maze'&& <MazeGame/>}
            </div>
          </div>
        )}

        {activeSection === 'gpt' && (
        <div classname="gpt-area">
          <AIComponent/>
          </div>
          
        )}
      </div>

      <footer className="footer-report">
        <p>© 2024 Equilix. All rights reserved. | Privacy Policy | Terms of Service</p>
      </footer>
      </div>
    </div>
  );
};

export default Report;
