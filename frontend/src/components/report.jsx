import React, { useMemo, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip } from 'chart.js';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import AppHeader from './appheader';
import GamesPanel from './gamespanel';
import Chat from './aicomponent';
import { questions, scaleInfo, severityLevels } from '../data/questions';
import { loadResult } from '../session';
import './../css/report.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

const levelCopy = {
  Normal: 'In the typical range for the past week.',
  Mild: 'A little higher than typical. Worth keeping an eye on.',
  Moderate: 'Noticeably higher than typical. Talking to someone you trust could help.',
  Severe: 'Much higher than typical. Please talk to a counselor, doctor or trusted adult soon.',
  'Extremely Severe': 'Much higher than typical. Please reach out to a counselor, doctor or trusted adult today.',
};

const tabs = [
  { id: 'results', label: 'Results' },
  { id: 'time', label: 'Response times' },
  { id: 'unwind', label: 'Unwind' },
  { id: 'talk', label: 'Talk it through' },
];

const SLOW_FACTOR = 1.5;
const css = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

const SeverityMeter = ({ level }) => {
  const index = severityLevels.indexOf(level);
  return (
    <div className="meter">
      <div className="meter-track" aria-hidden="true">
        {severityLevels.map((name, i) => (
          <span
            key={name}
            className={`meter-step${i <= index ? ' is-filled' : ''}${i === index ? ' is-current' : ''}`}
            style={i <= index ? { '--step-color': `var(--sev-${i})` } : undefined}
          />
        ))}
      </div>
      <div className="meter-labels" aria-hidden="true">
        {severityLevels.map((name, i) => (
          <span key={name} className={i === index ? 'is-current' : ''}>
            {name === 'Extremely Severe' ? 'Extremely severe' : name}
          </span>
        ))}
      </div>
    </div>
  );
};

const Report = () => {
  const location = useLocation();
  const result = location.state?.responses ? location.state : loadResult();
  const [activeTab, setActiveTab] = useState('results');
  const tabRefs = useRef({});

  const times = useMemo(() => {
    if (!result) return [];
    return questions
      .filter((q) => result.responses[q.id])
      .map((q) => ({ id: q.id, text: q.text, seconds: result.responses[q.id].time / 1000 }));
  }, [result]);

  if (!result) {
    return (
      <div className="report horizon">
        <AppHeader />
        <main className="report-empty">
          <h1>No results yet</h1>
          <p>Take the check-in and your results will show up here.</p>
          <Link to="/main" className="btn btn-primary">Take the check-in</Link>
        </main>
      </div>
    );
  }

  const { depression, anxiety, stress, email, takenAt } = result;
  const levels = { depression, anxiety, stress };
  const needsSupport = Object.values(levels).some((l) => l === 'Severe' || l === 'Extremely Severe');
  const average = times.reduce((sum, t) => sum + t.seconds, 0) / (times.length || 1);
  const slow = times.filter((t) => t.seconds > average * SLOW_FACTOR).sort((a, b) => b.seconds - a.seconds);
  const dateLabel = new Date(takenAt || Date.now()).toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const seaglass = css('--seaglass');
  const firstlight = css('--firstlight');
  const chartData = {
    labels: times.map((t) => `Q${t.id}`),
    datasets: [
      {
        label: 'Seconds to answer',
        data: times.map((t) => Number(t.seconds.toFixed(1))),
        backgroundColor: times.map((t) => (t.seconds > average * SLOW_FACTOR ? firstlight : seaglass)),
        hoverBackgroundColor: times.map((t) => (t.seconds > average * SLOW_FACTOR ? '#fff1c9' : '#a8f2db')),
        borderRadius: { topLeft: 4, topRight: 4 },
        borderSkipped: 'bottom',
        maxBarThickness: 28,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 500 },
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: css('--dusk'),
        borderColor: css('--tide-strong'),
        borderWidth: 1,
        titleColor: css('--cloud'),
        bodyColor: css('--mist'),
        padding: 12,
        displayColors: false,
        titleFont: { family: 'Atkinson Hyperlegible Next', weight: '700' },
        bodyFont: { family: 'Atkinson Hyperlegible Next' },
        callbacks: {
          title: (items) => times[items[0].dataIndex].text,
          label: (item) => `Question ${times[item.dataIndex].id}: ${item.raw} s`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        border: { color: css('--tide-strong') },
        ticks: { color: css('--haze'), font: { family: 'Atkinson Hyperlegible Next', size: 12 } },
      },
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(238, 243, 250, 0.07)' },
        border: { display: false },
        ticks: {
          color: css('--haze'),
          font: { family: 'Atkinson Hyperlegible Next', size: 12 },
          callback: (v) => `${v}s`,
        },
      },
    },
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const navy = [13, 27, 46];
    doc.setFillColor(...navy);
    doc.rect(0, 0, 210, 34, 'F');
    doc.setTextColor(238, 243, 250);
    doc.setFont('times', 'normal');
    doc.setFontSize(22);
    doc.text('Equilix check-in results', 16, 20);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text([email, dateLabel].filter(Boolean).join('   '), 16, 28);

    doc.setTextColor(...navy);
    doc.autoTable({
      startY: 44,
      head: [['Area', 'Level', 'What it means']],
      body: Object.entries(levels).map(([key, level]) => [scaleInfo[key].name, level, levelCopy[level] || '']),
      theme: 'grid',
      headStyles: { fillColor: [34, 56, 94], textColor: 255 },
      styles: { fontSize: 10, cellPadding: 3 },
      columnStyles: { 0: { cellWidth: 30 }, 1: { cellWidth: 34, fontStyle: 'bold' } },
    });

    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 10,
      head: [['#', 'Question', 'Seconds']],
      body: times.map((t) => [t.id, t.text, t.seconds.toFixed(1)]),
      theme: 'striped',
      headStyles: { fillColor: [34, 56, 94], textColor: 255 },
      styles: { fontSize: 9, cellPadding: 2.5 },
      columnStyles: { 0: { cellWidth: 10 }, 2: { cellWidth: 20, halign: 'right' } },
    });

    doc.setFontSize(8);
    doc.setTextColor(110);
    doc.text(
      'Equilix is a self-check, not a diagnosis. If you are thinking about harming yourself, call or text 988 (US) or visit findahelpline.com.',
      16,
      doc.lastAutoTable.finalY + 10,
      { maxWidth: 178 }
    );
    doc.save(`equilix-results-${new Date(takenAt || Date.now()).toISOString().slice(0, 10)}.pdf`);
  };

  const handleTabKey = (e, i) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const next = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
    setActiveTab(next.id);
    tabRefs.current[next.id]?.focus();
  };

  return (
    <div className="report horizon">
      <AppHeader />

      <main className="report-main">
        <div className="report-head">
          <div>
            <h1 className="report-title">Your results</h1>
            <p className="report-date">Check-in from {dateLabel}</p>
          </div>
          <div className="report-head-actions">
            <button type="button" className="btn btn-quiet" onClick={generatePDF}>
              <FileDownloadOutlinedIcon /> Download PDF
            </button>
            <Link to="/main" className="btn btn-text">Take it again</Link>
          </div>
        </div>

        <div className="report-tabs" role="tablist" aria-label="Results sections">
          {tabs.map((tab, i) => (
            <button
              key={tab.id}
              ref={(el) => (tabRefs.current[tab.id] = el)}
              type="button"
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={activeTab === tab.id}
              aria-controls={`panel-${tab.id}`}
              tabIndex={activeTab === tab.id ? 0 : -1}
              className={activeTab === tab.id ? 'is-active' : ''}
              onClick={() => setActiveTab(tab.id)}
              onKeyDown={(e) => handleTabKey(e, i)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <section className="report-panel" role="tabpanel" id={`panel-${activeTab}`} aria-labelledby={`tab-${activeTab}`} key={activeTab}>
          {activeTab === 'results' && (
            <>
              <ul className="results-list">
                {Object.entries(levels).map(([key, level]) => (
                  <li className="result-row" key={key}>
                    <div className="result-name">
                      <h2>{scaleInfo[key].name}</h2>
                      <p>{scaleInfo[key].about}</p>
                    </div>
                    <div className="result-reading">
                      <p className="result-level">{level === 'Extremely Severe' ? 'Extremely severe' : level}</p>
                      <SeverityMeter level={level} />
                      <p className="result-meaning">{levelCopy[level]}</p>
                    </div>
                  </li>
                ))}
              </ul>

              {needsSupport && (
                <aside className="support-panel" aria-labelledby="support-title">
                  <h2 id="support-title">You don’t have to handle this alone</h2>
                  <p>
                    Results like these are a good reason to talk with someone: a school counselor, a
                    doctor, or an adult you trust. If things feel urgent, you can call or text{' '}
                    <strong>988</strong> (US) any time, or find a free helpline in your country at{' '}
                    <a href="https://findahelpline.com" target="_blank" rel="noreferrer">findahelpline.com</a>.
                  </p>
                </aside>
              )}

              <p className="report-disclaimer support-note">
                These results come from the DASS-21 questionnaire and a model trained on its answers. They
                describe the past week and aren’t a diagnosis.
              </p>
            </>
          )}

          {activeTab === 'time' && (
            <div className="time-panel">
              <div className="time-summary">
                <p>
                  You took <strong>{average.toFixed(1)} seconds</strong> per question on average.
                  {slow.length > 0
                    ? ` ${slow.length === 1 ? 'One question' : `${slow.length} questions`} took noticeably longer. Questions that make us pause are sometimes the ones that matter most.`
                    : ' Your pace was steady all the way through.'}
                </p>
              </div>

              <figure className="time-chart">
                <figcaption className="time-legend">
                  <span><i style={{ background: seaglass }} /> Seconds to answer</span>
                  <span><i style={{ background: firstlight }} /> More than 1.5× your average</span>
                </figcaption>
                <div className="time-chart-canvas">
                  <Bar data={chartData} options={chartOptions} aria-label="Bar chart of seconds taken to answer each question" role="img" />
                </div>
              </figure>

              {slow.length > 0 && (
                <div className="time-slow">
                  <h2>Where you paused</h2>
                  <ul>
                    {slow.map((t) => (
                      <li key={t.id}>
                        <span className="time-slow-text">{t.text}</span>
                        <span className="time-slow-value">{t.seconds.toFixed(1)} s</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <details className="time-table">
                <summary>Show every question as a table</summary>
                <table>
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Question</th>
                      <th scope="col">Seconds</th>
                    </tr>
                  </thead>
                  <tbody>
                    {times.map((t) => (
                      <tr key={t.id}>
                        <td>{t.id}</td>
                        <td>{t.text}</td>
                        <td>{t.seconds.toFixed(1)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </details>
            </div>
          )}

          {activeTab === 'unwind' && <GamesPanel />}

          {activeTab === 'talk' && <Chat />}
        </section>
      </main>
    </div>
  );
};

export default Report;
