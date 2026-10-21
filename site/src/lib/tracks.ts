import ai from '@/generated/ai.json';
import dsa from '@/generated/dsa.json';
import sd from '@/generated/sd.json';

const hours = (topics: Record<string, { minutes: number }>) => `~${Math.round(Object.values(topics).reduce((n, t) => n + t.minutes, 0) / 60)}h`;

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
    stats: [[Object.keys(ai.topics).length, 'lessons'], [hours(ai.topics), 'to finish'], ['0', 'prior experience']],
    ids: Object.keys(ai.topics),
  },
  {
    href: '/sd',
    art: 'servers',
    title: 'System Design',
    blurb: 'Scaling, storage, caching, queues, reliability, cloud patterns and worked designs, with the numbers behind each choice.',
    stats: [[Object.keys(sd.topics).length, 'lessons'], [hours(sd.topics), 'to finish'], [sd.chapters.length, 'chapters']],
    ids: Object.keys(sd.topics),
  },
];
