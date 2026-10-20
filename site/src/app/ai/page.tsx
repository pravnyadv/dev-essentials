import Dashboard from '@/components/shared/Dashboard';
import { Radar } from '@/components/ai/Directory';
import ai from '@/generated/ai.json';

export default function AiHome() {
  return (
    <Dashboard
      tiers={ai.tiers}
      chapters={ai.chapters}
      eyebrow={`{n} lessons · ${ai.library.length} resources · updated ${ai.meta.lastUpdated}`}
      title="Learn AI from the first neuron to production agents"
      links={[
        { href: '/ai/map', label: 'Learning map' },
        { href: '/ai/models', label: 'Model atlas' },
        { href: '/ai/library', label: 'Resource library' },
        { href: '/ai/articles', label: 'Free articles' },
        { href: '/ai/glossary', label: 'Glossary' },
      ]}
    >
      <Radar items={ai.radar} updated={ai.meta.lastUpdated} />
    </Dashboard>
  );
}
