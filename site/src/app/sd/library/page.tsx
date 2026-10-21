import { Library } from '@/components/shared/Reference';
import sd from '@/generated/sd.json';

export const metadata = { title: 'Resource library' };

export default function LibraryPage() {
  return <Library library={sd.library} chapters={sd.chapters.map((c) => ({ id: c.id, title: c.title }))} />;
}
