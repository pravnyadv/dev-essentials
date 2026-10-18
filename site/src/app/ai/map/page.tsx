import LearningMap from '@/components/ai/LearningMap';
import ai from '@/generated/ai.json';

export const metadata = { title: 'Learning map' };

export default function MapPage() {
  return (
    <div className="[grid-area:main] min-w-0 mx-auto w-full max-w-6xl px-4 py-8 md:px-8">
      <LearningMap chapters={ai.chapters} stages={ai.stages} goals={ai.goals} />
    </div>
  );
}
