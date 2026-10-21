import { dsaSource as source } from '@/lib/source';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import LessonPage from '@/components/shared/LessonPage';
import { Practice, TopicBadges, TopicDemo } from '@/components/dsa/TopicExtras';
import { SORTS } from '@/components/dsa/sortFrames';
import site from '@/generated/dsa.json';
import { trackIndex } from '@/lib/trackIndex';

const index = trackIndex<(typeof site.topics)[keyof typeof site.topics]>(site);
const sortAlgo = (slug?: string[]) => Object.keys(SORTS).find((k) => slug?.at(-1)?.endsWith(k));

export default async function Page(props: PageProps<'/dsa/docs/[[...slug]]'>) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const topic = index.topicAt(page.url);
  const patterns = site.patterns.filter((p) => (topic?.patterns as string[] | undefined)?.includes(p.id));
  const next = index.nextAfter(page.url);

  return (
    <LessonPage
      source={source}
      page={page}
      topicId={topic?.id}
      description={page.data.description}
      next={next && { url: next.url, title: next.title }}
      badges={topic && <TopicBadges level={topic.level} patterns={patterns} />}
      before={topic && <TopicDemo demo={'demo' in topic ? topic.demo : undefined} sortAlgo={sortAlgo(page.slugs)} pattern={topic.kind !== 'Fundamentals' ? patterns[0] : undefined} />}
      after={topic && <Practice patterns={patterns} />}
    />
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(props: PageProps<'/dsa/docs/[[...slug]]'>): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
  };
}
