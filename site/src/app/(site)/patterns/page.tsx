import { PatternsIndex } from '@/components/dsa/Patterns';
import site from '@/generated/site.json';

export const metadata = { title: 'Problem patterns' };

export default function PatternsPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 md:px-8">
      <PatternsIndex patterns={site.patterns} groups={site.groups} />
    </div>
  );
}
