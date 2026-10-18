import TrackPicker from '@/components/dsa/TrackPicker';
import ai from '@/generated/ai.json';
import dsa from '@/generated/dsa.json';

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
      tags: [`${Object.keys(ai.topics).length} lessons`, `${ai.library.length} resources`, 'Updated regularly'],
      ids: Object.keys(ai.topics),
    },
  ];
  return <TrackPicker tracks={tracks} />;
}
