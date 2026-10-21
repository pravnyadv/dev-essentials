// Turns authored/ai/*.md into Fumadocs pages under content/ai plus src/generated/ai.json (see lib-authored.mjs).
// Data that changes over time lives in authored/ai/data (models, radar, stars, meta, articles).
import { existsSync } from 'node:fs'
import * as curation from './ai-curation.mjs'
import { importGuide } from './import-guide.mjs'
import { loadTrack } from './lib-authored.mjs'

const track = loadTrack('ai', curation, { imported: importGuide })
const { errors, data, slugs, urlOf, titleOf } = track

const models = data('models.json'), radar = data('radar.json'), meta = data('meta.json')
for (const m of models.groups.flatMap(g => g.models)) if (m.topic && !slugs.includes(m.topic)) errors.push(`model ${m.name} -> unknown topic ${m.topic}`)
for (const r of radar) if (r.topic && !slugs.includes(r.topic)) errors.push(`radar ${r.title} -> unknown topic ${r.topic}`)
for (const m of models.groups.flatMap(g => g.models)) if (m.topic) m.topicUrl = urlOf[m.topic]
for (const r of radar) if (r.topic) { r.topicUrl = urlOf[r.topic]; r.topicTitle = titleOf[r.topic] }

// Hand-picked free reading list (data/articles.json). Each entry pairs with one lesson.
const ARTICLE_TOPICS = ['how-llms-work', 'prompting', 'agents', 'retrieval', 'evals', 'safety', 'building', 'coding', 'history', 'critical']
const articles = existsSync(new URL('../authored/ai/data/articles.json', import.meta.url)) ? data('articles.json') : []
const seenArticle = new Set()
for (const a of articles) {
  if (!ARTICLE_TOPICS.includes(a.topic)) errors.push(`article ${a.title}: bad topic ${a.topic}`)
  if (![1, 2, 3].includes(a.level)) errors.push(`article ${a.title}: bad level ${a.level}`)
  if (!slugs.includes(a.lesson)) errors.push(`article ${a.title}: unknown lesson ${a.lesson}`)
  if (seenArticle.has(a.url)) errors.push(`duplicate article url: ${a.url}`)
  seenArticle.add(a.url)
  a.lessonUrl = urlOf[a.lesson]
  a.lessonTitle = titleOf[a.lesson]
}

const library = track.emit({
  reference: ['[Model atlas](/ai/models)', '[Resource library](/ai/library)', '[Free articles](/ai/articles)', '[Glossary](/ai/glossary)'],
  extra: { models, radar, meta, articles },
})
console.log(`ai: ${Object.keys(track.topics).length} topics, ${track.chapters.length} chapters, ${library.length} unique resources, ${track.glossary.length} terms, ${articles.length} articles`)
