import type { ComponentProps, ReactNode } from 'react';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';
import OverallProgress from './OverallProgress';

interface TrackLayoutProps {
  tree: ComponentProps<typeof DocsLayout>['tree'];
  home: string;
  title: string;
  topicIds: string[];
  children: ReactNode;
}

// The shell both tracks share: sidebar tree, header links, and a progress bar in the sidebar footer.
export default function TrackLayout({ tree, home, title, topicIds, children }: TrackLayoutProps) {
  return (
    <DocsLayout tree={tree} sidebar={{ footer: <OverallProgress ids={topicIds} /> }} {...baseOptions(home, title)}>
      {children}
    </DocsLayout>
  );
}
