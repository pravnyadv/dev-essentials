import Dashboard from '@/components/shared/Dashboard';
import sd from '@/generated/sd.json';

export default function SdHome() {
  return (
    <Dashboard
      tiers={sd.tiers}
      chapters={sd.chapters}
      eyebrow={`{n} lessons · ${sd.library.length} resources`}
      title="Design systems that scale, from one server to many"
      links={[
        { href: '/sd/map', label: 'Learning map' },
        { href: '/sd/library', label: 'Resource library' },
        { href: '/sd/glossary', label: 'Glossary' },
      ]}
    />
  );
}
