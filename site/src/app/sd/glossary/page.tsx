import { Glossary } from '@/components/shared/Reference';
import sd from '@/generated/sd.json';

export const metadata = { title: 'Glossary' };

export default function GlossaryPage() {
  return <Glossary glossary={sd.glossary} />;
}
