import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';
import OverallProgress from '@/components/dsa/OverallProgress';

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <DocsLayout tree={source.getPageTree()} sidebar={{ footer: <OverallProgress /> }} {...baseOptions()}>
      {children}
    </DocsLayout>
  );
}
