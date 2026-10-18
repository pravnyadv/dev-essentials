import { loader } from 'fumadocs-core/source';
import { defineDocs } from 'fumadocs-mdx/macro';
import { metaSchema, pageSchema } from 'fumadocs-core/source/schema';
import StatusDot from '@/components/dsa/StatusDot';
import ai from '@/generated/ai.json';
import dsa from '@/generated/dsa.json';

// The macro only accepts a literal call as a top-level const, so each track spells it out.
const dsaDocs = defineDocs({ dir: 'content/dsa', docs: { schema: pageSchema }, meta: { schema: metaSchema } });
const aiDocs = defineDocs({ dir: 'content/ai', docs: { schema: pageSchema }, meta: { schema: metaSchema } });

// Each track is its own page tree. The sidebar dot shows the topic's progress.
const track = (baseUrl: string, source: typeof dsaDocs, topics: Record<string, { id: string; url: string }>) => {
  const idByUrl = Object.fromEntries(Object.values(topics).map((t) => [t.url, t.id]));
  return loader({
    baseUrl,
    source: source.toFumadocsSource(),
    plugins: [
      {
        name: 'status-dot',
        transformPageTree: {
          file(node) {
            const id = idByUrl[node.url];
            if (id) node.icon = <StatusDot key={id} id={id} />;
            return node;
          },
        },
      },
    ],
  });
};

export const dsaSource = track('/dsa/docs', dsaDocs, dsa.topics);
export const aiSource = track('/ai/docs', aiDocs, ai.topics);
