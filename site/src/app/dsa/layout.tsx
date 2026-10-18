import type { Metadata } from 'next';
import { dsaSource } from '@/lib/source';
import TrackLayout from '@/components/shared/TrackLayout';
import dsa from '@/generated/dsa.json';

export const metadata: Metadata = { title: { default: 'DSA in JavaScript', template: '%s | DSA in JavaScript' } };

export default function Layout({ children }: LayoutProps<'/dsa'>) {
  return (
    <TrackLayout tree={dsaSource.getPageTree()} home="/dsa" title="DSA in JavaScript" topicIds={Object.keys(dsa.topics)}>
      {children}
    </TrackLayout>
  );
}
