import React, { useCallback, useEffect, useRef, useState } from 'react';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import { questions, options } from '../data/questions';

// Full-screen check-in: one question at a time, answer with a tap or keys 1-4.
const Questionnaire = ({
  responses,
  onAnswer,
  index,
  onIndexChange,
  onClose,
  onFinish,
  isScoring,
  scoreError,
}) => {
  const [showSummary, setShowSummary] = useState(false);
  const shownAt = useRef(Date.now());
  const advanceTimer = useRef(null);
  const dialogRef = useRef(null);

  const question = questions[index];
  const answeredCount = Object.keys(responses).length;
  const allAnswered = answeredCount === questions.length;
  const current = responses[question.id]?.answer;

  useEffect(() => {
    shownAt.current = Date.now();
  }, [index]);

  useEffect(() => {
    dialogRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
      clearTimeout(advanceTimer.current);
    };
  }, []);

  const choose = useCallback(
    (value) => {
      onAnswer(question.id, value, Date.now() - shownAt.current);
      clearTimeout(advanceTimer.current);
      advanceTimer.current = setTimeout(() => {
        if (index < questions.length - 1) {
          onIndexChange(index + 1);
        } else {
          setShowSummary(true);
        }
      }, 240);
    },
    [index, onAnswer, onIndexChange, question.id]
  );

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (showSummary || e.metaKey || e.ctrlKey || e.altKey) return;
      const n = Number(e.key);
      if (n >= 1 && n <= options.length) {
        e.preventDefault();
        choose(options[n - 1].value);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [choose, onClose, showSummary]);

  const goBack = () => {
    if (showSummary) {
      setShowSummary(false);
      return;
    }
    if (index > 0) onIndexChange(index - 1);
  };

  const goNext = () => {
    if (index < questions.length - 1) {
      onIndexChange(index + 1);
    } else if (allAnswered) {
      setShowSummary(true);
    }
  };

  const firstUnanswered = questions.findIndex((q) => responses[q.id] === undefined);

  return (
    <div
      className="checkin"
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkin-title"
      ref={dialogRef}
      tabIndex={-1}
    >
      <div className="checkin-top">
        <p className="checkin-count" id="checkin-title">
          {showSummary ? 'Check-in complete' : `Question ${index + 1} of ${questions.length}`}
        </p>
        <button
          type="button"
          className="checkin-close"
          onClick={onClose}
          aria-label="Close check-in. Your answers are kept."
        >
          <CloseRoundedIcon />
        </button>
      </div>

      <ol className="checkin-progress" aria-hidden="true">
        {questions.map((q, i) => (
          <li
            key={q.id}
            className={[
              responses[q.id] !== undefined ? 'is-answered' : '',
              i === index && !showSummary ? 'is-current' : '',
            ].join(' ')}
          />
        ))}
      </ol>

      <div className="checkin-stage">
        {showSummary ? (
          <div className="checkin-body checkin-summary">
            <h2 className="checkin-question">That’s all 21.</h2>
            <p className="checkin-lede">
              Thanks for being honest with yourself. Your answers are only used to work out your results.
            </p>
            {scoreError && (
              <p className="form-error" role="alert">
                {scoreError}
              </p>
            )}
            <div className="checkin-summary-actions">
              <button type="button" className="btn btn-primary" onClick={onFinish} disabled={isScoring}>
                {isScoring ? 'Working out your results…' : 'See my results'}
              </button>
              <button type="button" className="btn btn-text" onClick={goBack}>
                Review my answers
              </button>
            </div>
          </div>
        ) : (
          <div className="checkin-body" key={question.id}>
            <p className="checkin-lede">Over the past week, how much did this apply to you?</p>
            <h2 className="checkin-question">{question.text}</h2>

            <div className="checkin-options" role="radiogroup" aria-label={question.text}>
              {options.map((option, i) => {
                const selected = current === option.value;
                return (
                  <button
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    key={option.value}
                    className={`checkin-option${selected ? ' is-selected' : ''}`}
                    onClick={() => choose(option.value)}
                  >
                    <span className="checkin-key" aria-hidden="true">
                      {selected ? <CheckRoundedIcon /> : i + 1}
                    </span>
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {!showSummary && (
          <div className="checkin-nav">
            <button type="button" className="btn btn-text" onClick={goBack} disabled={index === 0}>
              Back
            </button>
            <p className="checkin-hint">Press 1–4 to answer</p>
            {index === questions.length - 1 && !allAnswered && firstUnanswered !== -1 ? (
              <button type="button" className="btn btn-quiet" onClick={() => onIndexChange(firstUnanswered)}>
                Go to question {firstUnanswered + 1}
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-quiet"
                onClick={goNext}
                disabled={current === undefined}
              >
                Next
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Questionnaire;
