import { dsaSource } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';
import OverallProgress from '@/components/dsa/OverallProgress';
import dsa from '@/generated/dsa.json';

export default function Layout({ children }: LayoutProps<'/dsa'>) {
  return (
    <DocsLayout
      tree={dsaSource.getPageTree()}
      sidebar={{ footer: <OverallProgress ids={Object.keys(dsa.topics)} /> }}
      {...baseOptions('/dsa', 'DSA in JavaScript')}
    >
      {children}
    </DocsLayout>
  );
}
