import { aiSource } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';
import OverallProgress from '@/components/dsa/OverallProgress';
import ai from '@/generated/ai.json';

export default function Layout({ children }: LayoutProps<'/ai'>) {
  return (
    <DocsLayout
      tree={aiSource.getPageTree()}
      sidebar={{ footer: <OverallProgress ids={Object.keys(ai.topics)} /> }}
      {...baseOptions('/ai', 'AI Engineering')}
    >
      {children}
    </DocsLayout>
  );
}
