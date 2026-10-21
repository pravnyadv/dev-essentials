import LearningMap from '@/components/shared/LearningMap';
import PageContainer from '@/components/shared/PageContainer';
import sd from '@/generated/sd.json';

export const metadata = { title: 'Learning map' };

export default function MapPage() {
  return (
    <PageContainer width="wide">
      <LearningMap chapters={sd.chapters} stages={sd.stages} goals={sd.goals} />
    </PageContainer>
  );
}
