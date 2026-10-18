import type { Metadata } from 'next';
import { aiSource } from '@/lib/source';
import TrackLayout from '@/components/shared/TrackLayout';
import ai from '@/generated/ai.json';

export const metadata: Metadata = { title: { default: 'AI Engineering', template: '%s | AI Engineering' } };

export default function Layout({ children }: LayoutProps<'/ai'>) {
  return (
    <TrackLayout tree={aiSource.getPageTree()} home="/ai" title="AI Engineering" topicIds={Object.keys(ai.topics)}>
      {children}
    </TrackLayout>
  );
}
