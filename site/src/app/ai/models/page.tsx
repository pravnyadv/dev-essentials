import { ModelAtlas } from '@/components/ai/Directory';
import ai from '@/generated/ai.json';

export const metadata = { title: 'Model atlas' };

export default function ModelsPage() {
  return <ModelAtlas atlas={ai.models} />;
}
