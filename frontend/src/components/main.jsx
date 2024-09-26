import React, { useState } from 'react';
import './../css/main.css';

const questions = [
  { id: 1, text: 'I found it hard to wind down' },
  { id: 2, text: 'I was aware of dryness of my mouth' },
  { id: 3, text: "I couldn't seem to experience any positive feeling at all " },
  { id: 4, text: "I experienced breathing difficulty (eg, excessively rapid breathing, breathlessness in the absence of physical exertion)"},
  { id: 5, text: "I found it difficult to work up the initiative to do things"},
  { id: 6, text: "I tended to over-react to situations" },
  { id: 7, text: "I experienced trembling (eg, in the hands)" },
  { id: 8, text: "I felt that I was using a lot of nervous energy" },
  { id: 9, text: "I was worried about situations in which I might panic and make a fool of myself" },
  { id: 10, text: "I felt that I had nothing to look forward to"},
  { id: 11, text: "I found myself getting agitated" },
  { id: 12, text: "I found it difficult to relax" },
  { id: 13, text: "I felt down-hearted and blue " },
  { id: 14, text: "I was intolerant of anything that kept me from getting on with what I was doing" },
  { id: 15, text: "I felt I was close to panic" },
  { id: 16, text: "I was unable to become enthusiastic about anything" },
  { id: 17, text: "I felt I wasn’t worth much as a person " },
  { id: 18, text: "I felt that I was rather touchy" },
  { id: 19, text: "I was aware of the action of my heart in the absence o physical exertion (eg,sense of heart rate increase, heart missing a beat)" },
  { id: 20, text: "I felt scared without any good reason" },
  { id: 21, text: "I felt that life was meaningless " }
];

const options = [
  { value: 0, label: 'Not at all' },
  { value: 1, label: 'Several days' },
  { value: 2, label: 'More than half the days' },
  { value: 3, label: 'Nearly every day' }
];

const Main = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState({});
  const questionsPerPage = 3;

  // Handle opening and closing the modal
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Handle response change
  const handleResponseChange = (questionId, value) => {
    setResponses(prevResponses => ({
      ...prevResponses,
      [questionId]: value
    }));
  };

  // Handle next and previous question sets
  const handleNext = () => {
    if (currentQuestionIndex + questionsPerPage < questions.length) {
      const nextIndex = currentQuestionIndex + questionsPerPage;
      const allAnswered = currentQuestions.every(question => responses[question.id] !== undefined);

      if (allAnswered) {
        setCurrentQuestionIndex(nextIndex);
      } else {
        alert('Please answer all questions before proceeding.');
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex - questionsPerPage >= 0) {
      setCurrentQuestionIndex(currentQuestionIndex - questionsPerPage);
    }
  };

  // Get the current set of questions
  const currentQuestions = questions.slice(
    currentQuestionIndex,
    currentQuestionIndex + questionsPerPage
  );

  return (
    <div className="main-container">
      {/* Full-screen Hero Section with Video */}
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
            <button className="cta-button" onClick={openModal}>Give A Test</button>
            <button className="cta-button">Report</button>
          </div>
        </div>
      </div>

      {/* Modal Section */}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <button onClick={closeModal} className="close-button">Close</button>
            <h2 id="heading">Answer the Questions</h2>
            {currentQuestions.map((question) => (
              <div key={question.id} className="question-block">
                <p id= "question">{question.text}</p>
                {options.map((option) => (
                  <label key={option.value}>
                    <input id="options"
                      type="radio" 
                      name={`question-${question.id}`} 
                      value={option.value} 
                      checked={responses[question.id] === option.value} 
                      onChange={() => handleResponseChange(question.id, option.value)} 
                    />
                    {option.label}
                  </label>
                ))}
                <hr /> {/* Horizontal rule separating questions */}
              </div>
            ))}

            {/* Navigation Buttons */}
            <div className="modal-navigation">
              {currentQuestionIndex > 0 && (
                <button onClick={handlePrevious} className="nav-button">Previous</button>
              )}
              {currentQuestionIndex + questionsPerPage < questions.length && (
                <button onClick={handleNext} className="nav-button">Next</button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="footer">
        <p>© 2024 Equilix. All rights reserved. | Privacy Policy | Terms of Service</p>
      </footer>
    </div>
  );
};

export default Main;
