import { Library } from '@/components/ai/Directory';
import ai from '@/generated/ai.json';

export const metadata = { title: 'Resource library' };

export default function LibraryPage() {
  return <Library library={ai.library} />;
}
