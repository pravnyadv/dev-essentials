import Dashboard from '@/components/shared/Dashboard';
import site from '@/generated/dsa.json';

export default function DsaHome() {
  return (
    <Dashboard
      tiers={site.tiers}
      chapters={site.chapters}
      eyebrow={`JavaScript · {n} topics · ${site.patterns.length} patterns`}
      title="Learn data structures & algorithms, one visual lesson at a time"
      links={[{ href: '/dsa/patterns', label: 'Browse problem patterns' }]}
    />
  );
}
