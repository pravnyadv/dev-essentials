import type { ComponentType } from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import type { aiSource } from '@/lib/source';
import { trackIndex } from '@/lib/trackIndex';
import LessonPage from './LessonPage';
import { LevelBadge, Pill } from './ui';
import { AdaptedNote, CheckYourself, Resources, SourceNote, Story, Terms } from './LessonParts';

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
  adapted?: { name: string; url: string; license: string }[];
  terms: { term: string; def: string }[];
  quiz: { q: string; options: string[]; answer: number; why: string }[];
  resources: { kind: string; title: string; url: string; by?: string; why: string; stars?: number }[];
};

// What a track's generated JSON (src/generated/<track>.json) must provide for its lesson pages.
export interface AuthoredTrack {
  source: typeof aiSource;
  data: Parameters<typeof trackIndex>[0];
  Explainer: ComponentType<{ name: string }>;
}

type Props = { params: Promise<{ slug?: string[] }> };

// The docs route of an authored track (lessons from authored/<track>/*.md): page, static params and metadata.
export function authoredLessonRoute({ source, data, Explainer }: AuthoredTrack) {
  const index = trackIndex<Topic>(data);
  const pageOf = async (props: Props) => source.getPage((await props.params).slug) ?? notFound();

  async function Page(props: Props) {
    const page = await pageOf(props);
    const topic = index.topicAt(page.url);
    const next = index.nextAfter(page.url);
    const { chapterNo, lessonNo, lessonCount } = index.position(page.url);

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
              <AdaptedNote adapted={topic.adapted} />
              <CheckYourself quiz={topic.quiz} />
              <Resources resources={topic.resources} />
            </>
          )
        }
      />
    );
  }

  return {
    Page,
    generateStaticParams: async () => source.generateParams(),
    generateMetadata: async (props: Props): Promise<Metadata> => {
      const page = await pageOf(props);
      return { title: page.data.title, description: page.data.description };
    },
  };
}
