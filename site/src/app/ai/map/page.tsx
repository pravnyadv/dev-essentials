import LearningMap from '@/components/shared/LearningMap';
import PageContainer from '@/components/shared/PageContainer';
import ai from '@/generated/ai.json';

export const metadata = { title: 'Learning map' };

export default function MapPage() {
  return (
    <PageContainer width="wide">
      <LearningMap chapters={ai.chapters} stages={ai.stages} goals={ai.goals} />
    </PageContainer>
  );
}
