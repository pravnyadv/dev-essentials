// Labels the build scripts validate against and the UI shows. Plain ESM with no imports, so Node can load it too.

// 'Stretch' avoids clashing with the Advanced tier name.
export const LEVELS = { 1: 'Starter', 2: 'Core', 3: 'Stretch' }

// The `kind` of a ```resources line.
export const RESOURCE_KINDS = { article: 'Article', video: 'Video', course: 'Course', repo: 'Repo', paper: 'Paper', docs: 'Docs', tool: 'Tool', book: 'Book' }

// The `topic` of an entry in authored/ai/data/articles.json.
export const ARTICLE_TOPICS = { 'how-llms-work': 'How LLMs work', prompting: 'Prompting', agents: 'Agents', retrieval: 'Retrieval', evals: 'Evals', safety: 'Safety', building: 'Building', coding: 'Coding with AI', history: 'History', critical: 'Critical views' }
