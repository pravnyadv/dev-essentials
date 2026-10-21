import type { ComponentProps, ReactNode } from 'react';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';
import OverallProgress from './OverallProgress';
import SectionSeparator from './SectionSeparator';

interface TrackLayoutProps {
  tree: ComponentProps<typeof DocsLayout>['tree'];
  home: string;
  title: string;
  topicIds: string[];
  children: ReactNode;
}

// The shell every track shares: sidebar tree with bold section titles, header links, and a progress bar in the sidebar footer.
export default function TrackLayout({ tree, home, title, topicIds, children }: TrackLayoutProps) {
  return (
    <DocsLayout tree={tree} sidebar={{ footer: <OverallProgress key="progress" ids={topicIds} />, components: { Separator: SectionSeparator } }} {...baseOptions(home, title)}>
      {children}
    </DocsLayout>
  );
}
