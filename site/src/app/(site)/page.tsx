import Dashboard from '@/components/dsa/Dashboard';
import site from '@/generated/site.json';

export default function HomePage() {
  return <Dashboard tiers={site.tiers} chapters={site.chapters} patternCount={site.patterns.length} />;
}
