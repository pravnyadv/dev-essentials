import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import DiagramFigure from '@/components/shared/DiagramFigure';
import Formula from '@/components/shared/Formula';
import LessonCard from '@/components/shared/LessonCard';
import Term from '@/components/shared/Term';

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    DiagramFigure,
    Formula,
    LessonCard,
    Term,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
