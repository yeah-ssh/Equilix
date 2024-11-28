import React, { useState } from 'react';
import axios from 'axios';
import "../css/aicomponent.css";

const AIComponent = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');

  
  const allowedKeywords = ['depression', 'stress', 'anxiety', 'mental health', 'well-being','depressed','stressed','low','health','mind','suicide','exercise',];

  
  const generateAnswer = async () => {
    
    const isValidQuestion = allowedKeywords.some(keyword => 
      question.toLowerCase().includes(keyword)
    );

    if (!isValidQuestion) {
      setError(`Please ask questions related to depression,stress,anxiety`);
      setAnswer(''); 
      return;
    }

    setError(''); 
    setAnswer("loading..");
    try {
      const response = await axios({
        url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyALZBwgtDCTEroLm53oa2lyG4h2j0fDBes",
        method: "post",
        data: {
          contents: [{ parts: [{ text: question }] }],
        }
      });

      setAnswer(response["data"]["candidates"][0]["content"]["parts"][0]["text"]);
    } catch (error) {
      setAnswer("Error fetching the answer. Please try again later.");
      console.error("Error fetching the response:", error);
    }
  };

  
  const handleInputChange = (e) => {
    setQuestion(e.target.value);
    setError(''); 
  };

 
  return (
    <div className="aicomponent-container">
      <h2>Ask Your Question</h2>
      <div className="input-container">
        <textarea
          value={question}
          onChange={handleInputChange}
          placeholder="Ask a question related to depression, stress, anxiety..."
        />
        <button onClick={generateAnswer} disabled={!question}>
          {answer === 'loading..' ? 'Loading...' : 'Send'}
        </button>
      </div>
      {error && <div className="error-message">{error}</div>}
      <div className="response-container">
        {answer === 'loading..' ? (
          <div className="loading-text">Loading...</div>
        ) : (
          <div className="response-text">{answer}</div>
        )}
      </div>
    </div>
  );
};

export default AIComponent;
