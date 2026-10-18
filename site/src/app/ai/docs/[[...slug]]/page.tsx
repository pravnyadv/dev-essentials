import { aiSource as source } from '@/lib/source';
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from 'fumadocs-ui/layouts/docs/page';
import { notFound } from 'next/navigation';
import { getMDXComponents } from '@/components/mdx';
import type { Metadata } from 'next';
import { createRelativeLink } from 'fumadocs-ui/mdx';
import { StatusButton } from '@/components/dsa/progress';
import { MarkDone } from '@/components/dsa/TopicExtras';
import { LevelBadge, Pill } from '@/components/dsa/ui';
import Explainer from '@/components/ai/Explainers';
import { CheckYourself, Resources, SourceNote, Story, Terms } from '@/components/ai/LessonParts';
import ai from '@/generated/ai.json';

type Topic = {
  id: string;
  url: string;
  title: string;
  summary: string;
  level: number;
  minutes: number;
  chapter: string;
  explainer?: string;
  story?: string;
  source?: { name: string; url: string; license: string };
  terms: { term: string; def: string }[];
  quiz: { q: string; options: string[]; answer: number; why: string }[];
  resources: { kind: string; title: string; url: string; by?: string; why: string; stars?: number }[];
};
const byUrl: Record<string, Topic> = Object.fromEntries(Object.values(ai.topics as Record<string, Topic>).map((t) => [t.url, t]));

export default async function Page(props: PageProps<'/ai/docs/[[...slug]]'>) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const MDX = page.data.body;
  const url = `/ai/docs/${page.slugs.join('/')}`;
  const topic = byUrl[url];
  const next = byUrl[ai.order[ai.order.indexOf(url) + 1]];

  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <DocsTitle>{page.data.title}</DocsTitle>
      {topic && !topic.source && <DocsDescription className="mb-0">{topic.summary}</DocsDescription>}
      <div className="flex flex-row gap-2 items-center border-b pb-6">{topic && <StatusButton id={topic.id} />}</div>
      {topic && (
        <div className="mb-4 flex flex-wrap items-center gap-2 text-sm">
          <LevelBadge level={topic.level} />
          <Pill>{topic.minutes} min</Pill>
          <Pill>{topic.chapter}</Pill>
        </div>
      )}
      {topic?.story && <Story text={topic.story} />}
      {topic?.explainer && <Explainer name={topic.explainer} />}
      {topic && <Terms terms={topic.terms} />}
      {topic && <SourceNote source={topic.source} />}
      <DocsBody>
        <MDX components={getMDXComponents({ a: createRelativeLink(source, page) })} />
      </DocsBody>
      {topic && <CheckYourself quiz={topic.quiz} />}
      {topic && <Resources resources={topic.resources} />}
      {topic && <MarkDone id={topic.id} next={next && { url: next.url, title: next.title }} />}
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(props: PageProps<'/ai/docs/[[...slug]]'>): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();
  return { title: page.data.title, description: page.data.description };
}
