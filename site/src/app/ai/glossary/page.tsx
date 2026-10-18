import { Glossary } from '@/components/ai/Directory';
import ai from '@/generated/ai.json';

export const metadata = { title: 'Glossary' };

export default function GlossaryPage() {
  return <Glossary glossary={ai.glossary} />;
}
