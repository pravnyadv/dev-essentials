import { PatternsIndex } from '@/components/dsa/Patterns';
import PageContainer from '@/components/shared/PageContainer';
import site from '@/generated/dsa.json';

export const metadata = { title: 'Problem patterns' };

export default function PatternsPage() {
  return (
    <PageContainer width="wide">
      <PatternsIndex patterns={site.patterns} groups={site.groups} />
    </PageContainer>
  );
}
