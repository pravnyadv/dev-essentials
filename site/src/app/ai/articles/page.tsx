import { Articles } from '@/components/ai/Directory';
import ai from '@/generated/ai.json';

export const metadata = { title: 'Free articles' };

export default function ArticlesPage() {
  return <Articles articles={ai.articles} />;
}
