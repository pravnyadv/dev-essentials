import { llms, loader } from 'fumadocs-core/source';
import StatusDot from '@/components/dsa/StatusDot';
import urls from '@/generated/urls.json';
import { docsContentRoute, docsImageRoute, docsRoute } from './shared';
import { defineDocs } from 'fumadocs-mdx/macro';
import { metaSchema, pageSchema } from 'fumadocs-core/source/schema';

const docs = defineDocs({
  dir: 'content/docs',
  docs: {
    schema: pageSchema,
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
  meta: {
    schema: metaSchema,
  },
});

// See https://fumadocs.dev/docs/headless/source-api for more info
export const source = loader({
  baseUrl: docsRoute,
  source: docs.toFumadocsSource(),
  plugins: [
    {
      name: 'status-dot',
      transformPageTree: {
        file(node) {
          const id = (urls as Record<string, string>)[node.url];
          if (id) node.icon = <StatusDot key={id} id={id} />;
          return node;
        },
      },
    },
  ],
});

export const docsLlms = llms(source, {
  renderPage: async (page) => `# ${page.data.title} (${page.url})

${await page.data.getText('processed')}`,
});
