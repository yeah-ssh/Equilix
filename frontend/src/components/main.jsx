import React, { useState } from 'react';
import './../css/main.css';
import { useNavigate } from 'react-router-dom'; 
import SkipNextOutlinedIcon from '@mui/icons-material/SkipNextOutlined';
import SkipPreviousOutlinedIcon from '@mui/icons-material/SkipPreviousOutlined';
import CancelPresentationIcon from '@mui/icons-material/CancelPresentation';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import PermContactCalendarOutlinedIcon from '@mui/icons-material/PermContactCalendarOutlined';
import axios from 'axios';

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

const options = [
  { value: 0, label: 'Never' }, 
  { value: 1, label: 'Sometimes' }, 
  { value: 2, label: 'Often' }, 
  { value: 3, label: 'Almost Always'} 
];

const Main = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());
  const navigate = useNavigate();

  const openModal = () => {
    setIsModalOpen(true);
  };
  
  const closeModal = () => setIsModalOpen(false);

  const handleResponseChange = (questionId, value) => {
    const timeTaken = Date.now() - startTime;
    setResponses(prevResponses => ({
      ...prevResponses,
      [questionId]: { answer: value, time: timeTaken }
    }));
    setStartTime(Date.now());

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];

  const handleReportRedirect = async () => {
    const depressionQuestions = [3, 5, 10, 13, 16, 17, 21];
    const anxietyQuestions = [2, 4, 7, 9, 15, 19, 20];
    const stressQuestions = [1, 6, 8, 11, 12, 14, 18];
    
    const formattedResponses = {
      depression: depressionQuestions.map(id => responses[id]?.answer || 0),
      anxiety: anxietyQuestions.map(id => responses[id]?.answer || 0),
      stress: stressQuestions.map(id => responses[id]?.answer || 0)
    };
    
    try {
      const result = await axios.post('http://localhost:5000/predict', { responses: formattedResponses });
      const { depression, stress, anxiety } = result.data;
      navigate('/report', { state: { depression, stress, anxiety, responses } });
    } catch (error) {
      console.error('Error fetching predictions:', error);
    }
  };

  const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="main-container">
      <div className="hero-section">
        <video autoPlay muted loop className="background-video">
          <source src={require('./../images/background.mp4')} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="hero-content">
          <h1 className="main-title">Supporting Teen Mental Health</h1>
          <p className="sub-title">
            Equilix helps teens detect early signs of depression and provides the resources they need for recovery.
          </p>
          <div className="cta-buttons">
            <button className="cta-button" onClick={openModal}><PermContactCalendarOutlinedIcon/>&ensp;Give A Test</button>
            <button className="cta-button" onClick={handleReportRedirect}><AssessmentOutlinedIcon/>&ensp;Report</button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-content">
              <button onClick={closeModal} className="close-button"><CancelPresentationIcon/></button>
              <h2 id="heading">Answer the Questions</h2>
              {isCompleted ? (
                <div className="completion-message">
                  <h3>Thank you for answering all the questions!</h3>
                  <p>Now go to the <strong>Report</strong> section to view your results.</p>
                  <button className="cta-button" onClick={handleReportRedirect}>Go to Report</button>
                </div>
              ) : (
                <div className="question-block visible">
                  <div className="progress-bar-container">
                    <div className="progress-bar" style={{ width: `${progressPercentage}%` }} />
                  </div>
                  <p id="question">{currentQuestion.text}</p>
                  <div className="radio-group">
                    {options.map((option) => (
                      <label key={option.value} className="radio-label">
                        <input
                          type="radio" 
                          name={`question-${currentQuestion.id}`}
                          value={option.value}
                          checked={responses[currentQuestion.id]?.answer === option.value}
                          onChange={() => handleResponseChange(currentQuestion.id, option.value)}
                          className="radio-button"
                        />
                        {option.label}
                      </label>
                    ))}
                  </div>
                  <div className="modal-navigation">
                    {currentQuestionIndex > 0 && (
                      <button onClick={handlePrevious} className="nav-button"><SkipPreviousOutlinedIcon/></button>
                    )}
                    <button onClick={handleNext} className="nav-button"><SkipNextOutlinedIcon/></button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <footer className="footer">
        <p>© 2024 Equilix. All rights reserved. | Privacy Policy | Terms of Service</p>
      </footer>
    </div>
  ); 
};

export default Main;   
