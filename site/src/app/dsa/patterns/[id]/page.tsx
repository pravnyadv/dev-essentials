import { PatternDetail } from '@/components/dsa/Patterns';
import PageContainer from '@/components/shared/PageContainer';
import site from '@/generated/dsa.json';
import { notFound } from 'next/navigation';

const byId = Object.fromEntries(Object.values(site.topics).map((t) => [t.id, { title: t.title, url: t.url }]));

export function generateStaticParams() {
  return site.patterns.map((p) => ({ id: p.id }));
}

export async function generateMetadata(props: PageProps<'/dsa/patterns/[id]'>) {
  const { id } = await props.params;
  return { title: site.patterns.find((p) => p.id === id)?.name };
}

export default async function PatternPage(props: PageProps<'/dsa/patterns/[id]'>) {
  const { id } = await props.params;
  const pattern = site.patterns.find((p) => p.id === id);
  if (!pattern) notFound();
  return (
    <PageContainer>
      <PatternDetail p={pattern} byId={byId} />
    </PageContainer>
  );
}
