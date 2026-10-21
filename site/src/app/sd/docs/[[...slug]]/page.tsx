import { sdSource } from '@/lib/source';
import { authoredLessonRoute } from '@/components/shared/AuthoredLesson';
import Explainer from '@/components/sd/Explainers';
import sd from '@/generated/sd.json';

const route = authoredLessonRoute({ base: '/sd', source: sdSource, data: sd, Explainer });

export default route.Page;
export const { generateStaticParams, generateMetadata } = route;
