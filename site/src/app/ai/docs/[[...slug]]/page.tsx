import { aiSource as source } from '@/lib/source';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import LessonPage from '@/components/shared/LessonPage';
import { LevelBadge, Pill } from '@/components/shared/ui';
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

  const url = `/ai/docs/${page.slugs.join('/')}`;
  const topic = byUrl[url];
  const next = byUrl[ai.order[ai.order.indexOf(url) + 1]];
  const chapterNo = ai.chapters.findIndex((c) => c.title === topic?.chapter) + 1;
  const chapter = ai.chapters[chapterNo - 1];
  const lessonNo = (chapter?.topics.findIndex((t) => t.url === url) ?? 0) + 1;
  const lessonCount = chapter?.topics.length ?? 0;

  return (
    <LessonPage
      source={source}
      page={page}
      topicId={topic?.id}
      description={topic && !topic.source ? topic.summary : page.data.description}
      next={next && { url: next.url, title: next.title }}
      badges={
        topic && (
          <div className="mb-4 flex flex-wrap items-center gap-2 text-sm">
            <Pill>Chapter {chapterNo}: {topic.chapter}</Pill>
            <Pill>Lesson {lessonNo} of {lessonCount}</Pill>
            <LevelBadge level={topic.level} />
            <Pill>About {topic.minutes} min</Pill>
          </div>
        )
      }
      before={
        topic && (
          <>
            <Story text={topic.story} />
            {topic.explainer && <Explainer name={topic.explainer} />}
            <Terms terms={topic.terms} />
          </>
        )
      }
      after={
        topic && (
          <>
            <SourceNote source={topic.source} />
            <CheckYourself quiz={topic.quiz} />
            <Resources resources={topic.resources} />
          </>
        )
      }
    />
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
