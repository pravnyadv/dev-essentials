import type { ReactNode } from 'react';
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from 'fumadocs-ui/layouts/docs/page';
import { createRelativeLink } from 'fumadocs-ui/mdx';
import { getMDXComponents } from '@/components/mdx';
import type { dsaSource } from '@/lib/source';
import MarkDone from './MarkDone';
import { StatusButton } from './progress';

type Source = typeof dsaSource;

interface LessonPageProps {
  source: Source;
  page: NonNullable<ReturnType<Source['getPage']>>;
  topicId?: string;
  description?: string;
  next?: { url: string; title: string };
  badges?: ReactNode;
  before?: ReactNode;
  after?: ReactNode;
}

// The lesson template both tracks share. Each track fills the slots: `badges` under the title,
// `before` and `after` around the text. Status and Mark done show only for topics tracked in progress.
export default function LessonPage({ source, page, topicId, description, next, badges, before, after }: LessonPageProps) {
  const MDX = page.data.body;
  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <DocsTitle>{page.data.title}</DocsTitle>
      {description && <DocsDescription className="mb-0">{description}</DocsDescription>}
      <div className="flex flex-row items-center gap-2 border-b pb-6">{topicId && <StatusButton id={topicId} />}</div>
      {badges}
      {before}
      <DocsBody>
        <MDX components={getMDXComponents({ a: createRelativeLink(source, page) })} />
      </DocsBody>
      {after}
      {topicId && <MarkDone id={topicId} next={next} />}
    </DocsPage>
  );
}
