// DASS-21 items, reworded for teens. Each scale has 7 items.
export const questions = [
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
  { id: 21, text: 'I felt like life didn’t have much meaning' },
];

export const options = [
  { value: 0, label: 'Never' },
  { value: 1, label: 'Sometimes' },
  { value: 2, label: 'Often' },
  { value: 3, label: 'Almost always' },
];

export const scales = {
  depression: [3, 5, 10, 13, 16, 17, 21],
  anxiety: [2, 4, 7, 9, 15, 19, 20],
  stress: [1, 6, 8, 11, 12, 14, 18],
};

export const severityLevels = ['Normal', 'Mild', 'Moderate', 'Severe', 'Extremely Severe'];

export const scaleInfo = {
  depression: {
    name: 'Depression',
    about: 'Low mood, losing interest in things, and feeling hopeless or flat.',
  },
  anxiety: {
    name: 'Anxiety',
    about: 'Feeling on edge, panicky, or noticing physical signs like a racing heart.',
  },
  stress: {
    name: 'Stress',
    about: 'Finding it hard to relax, feeling tense, and getting irritated easily.',
  },
};
