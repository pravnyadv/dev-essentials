import { dsaSource as source } from '@/lib/source';
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from 'fumadocs-ui/layouts/docs/page';
import { notFound } from 'next/navigation';
import { getMDXComponents } from '@/components/mdx';
import type { Metadata } from 'next';
import { createRelativeLink } from 'fumadocs-ui/mdx';
import { StatusButton } from '@/components/dsa/progress';
import { MarkDone, Practice, TopicBadges, TopicDemo } from '@/components/dsa/TopicExtras';
import { SORTS } from '@/components/dsa/sortFrames';
import site from '@/generated/dsa.json';

const sortAlgo = (slug?: string[]) => Object.keys(SORTS).find((k) => slug?.at(-1)?.endsWith(k));

export default async function Page(props: PageProps<'/dsa/docs/[[...slug]]'>) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const MDX = page.data.body;
  const url = `/dsa/docs/${page.slugs.join('/')}`;
  const byUrl = Object.fromEntries(Object.values(site.topics).map((t) => [t.url, t]));
  const topic = byUrl[url];
  const patterns = site.patterns.filter((p) => (topic?.patterns as string[] | undefined)?.includes(p.id));
  const next = byUrl[site.order[site.order.indexOf(url) + 1]];

  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription className="mb-0">{page.data.description}</DocsDescription>
      <div className="flex flex-row gap-2 items-center border-b pb-6">
        {topic && <StatusButton id={topic.id} />}
      </div>
      {topic && <TopicBadges level={topic.level} patterns={patterns} />}
      {topic && (
        <TopicDemo
          sortAlgo={sortAlgo(page.slugs)}
          pattern={topic.kind !== 'Fundamentals' ? patterns[0] : undefined}
        />
      )}
      <DocsBody>
        <MDX components={getMDXComponents({ a: createRelativeLink(source, page) })} />
      </DocsBody>
      {topic && <Practice patterns={patterns} />}
      {topic && <MarkDone id={topic.id} next={next && { url: next.url, title: next.title }} />}
    </DocsPage>
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
