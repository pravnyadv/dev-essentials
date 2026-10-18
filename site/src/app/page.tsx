import TrackPicker from '@/components/shared/TrackPicker';
import ai from '@/generated/ai.json';
import dsa from '@/generated/dsa.json';

const lessons = Object.values(ai.topics) as { minutes: number }[];
const hours = Math.round(lessons.reduce((n, t) => n + t.minutes, 0) / 60);

export default function Home() {
  const tracks = [
    {
      href: '/dsa',
      title: 'Data Structures & Algorithms',
      blurb: 'Arrays to graphs, with visual step-through lessons and problem patterns.',
      tags: ['JavaScript', `${Object.keys(dsa.topics).length} topics`, `${dsa.patterns.length} patterns`],
      ids: Object.keys(dsa.topics),
    },
    {
      href: '/ai',
      title: 'AI Engineering',
      blurb: 'History, math, LLMs, agents, retrieval, evals and tooling. Built to be updated.',
      tags: [`${Object.keys(ai.topics).length} lessons`, `about ${hours} hours`, `no experience needed`],
      ids: Object.keys(ai.topics),
    },
  ];
  return <TrackPicker tracks={tracks} />;
}
