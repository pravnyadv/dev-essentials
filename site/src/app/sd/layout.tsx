import type { Metadata } from 'next';
import { sdSource } from '@/lib/source';
import TrackLayout from '@/components/shared/TrackLayout';
import sd from '@/generated/sd.json';

export const metadata: Metadata = { title: { default: 'System Design', template: '%s | System Design' } };

export default function Layout({ children }: LayoutProps<'/sd'>) {
  return (
    <TrackLayout tree={sdSource.getPageTree()} home="/sd" title="System Design" topicIds={Object.keys(sd.topics)}>
      {children}
    </TrackLayout>
  );
}
