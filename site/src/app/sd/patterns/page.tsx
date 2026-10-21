import PatternCatalog from '@/components/sd/PatternCatalog';
import sd from '@/generated/sd.json';

export const metadata = { title: 'Pattern catalog' };

export default function PatternsPage() {
  return <PatternCatalog patterns={sd.patterns} chapters={sd.chapters.map((c) => c.title)} />;
}
