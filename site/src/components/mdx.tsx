import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import Formula from '@/components/shared/Formula';
import Term from '@/components/shared/Term';

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    Formula,
    Term,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
