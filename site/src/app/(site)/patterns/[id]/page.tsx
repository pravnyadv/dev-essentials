import { PatternDetail } from '@/components/dsa/Patterns';
import site from '@/generated/site.json';
import { notFound } from 'next/navigation';

export function generateStaticParams() {
  return site.patterns.map((p) => ({ id: p.id }));
}

export async function generateMetadata(props: PageProps<'/patterns/[id]'>) {
  const { id } = await props.params;
  return { title: site.patterns.find((p) => p.id === id)?.name };
}

export default async function PatternPage(props: PageProps<'/patterns/[id]'>) {
  const { id } = await props.params;
  const pattern = site.patterns.find((p) => p.id === id);
  if (!pattern) notFound();
  const byId = Object.fromEntries(Object.values(site.topics).map((t) => [t.id, { title: t.title, url: t.url }]));
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 md:px-8">
      <PatternDetail p={pattern} byId={byId} />
    </div>
  );
}
