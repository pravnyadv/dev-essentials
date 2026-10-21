import { Library } from '@/components/shared/Reference';
import ai from '@/generated/ai.json';

export const metadata = { title: 'Resource library' };

export default function LibraryPage() {
  return <Library library={ai.library} chapters={ai.chapters.map((c) => ({ id: c.id, title: c.title }))} />;
}
