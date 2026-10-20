import ai from '@/generated/ai.json';
import dsa from '@/generated/dsa.json';

const lessons = Object.values(ai.topics) as { minutes: number }[];
const hours = Math.round(lessons.reduce((n, t) => n + t.minutes, 0) / 60);

// Every learning track on the landing page. To add one: generate its page tree and topic ids like the others,
// add an entry here, and pick an `art` key from TrackPicker (or add a drawing).
export const tracks = [
  {
    href: '/dsa',
    art: 'array',
    title: 'Data Structures & Algorithms',
    blurb: 'Arrays to graphs, with visual step-through lessons and problem patterns.',
    stats: [[Object.keys(dsa.topics).length, 'topics'], [dsa.patterns.length, 'patterns'], ['JS', 'language']],
    ids: Object.keys(dsa.topics),
  },
  {
    href: '/ai',
    art: 'network',
    title: 'AI Engineering',
    blurb: 'History, math, LLMs, agents, retrieval, evals and tooling. Built to be updated.',
    stats: [[Object.keys(ai.topics).length, 'lessons'], [`~${hours}h`, 'to finish'], ['0', 'prior experience']],
    ids: Object.keys(ai.topics),
  },
];
