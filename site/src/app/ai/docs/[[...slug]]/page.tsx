import { aiSource } from '@/lib/source';
import { authoredLessonRoute } from '@/components/shared/AuthoredLesson';
import Explainer from '@/components/ai/Explainers';
import ai from '@/generated/ai.json';

const route = authoredLessonRoute({ base: '/ai', source: aiSource, data: ai, Explainer });

export default route.Page;
export const { generateStaticParams, generateMetadata } = route;
