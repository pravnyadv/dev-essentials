// Imports the technique pages of dair-ai/Prompt-Engineering-Guide (MIT) as a reference chapter.
// Their MDX uses Next components, so images become markdown images and promo blocks are dropped.
import { cpSync, existsSync, mkdirSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'

const here = new URL('.', import.meta.url).pathname
const repo = join(here, '../../vendor/prompt-engineering-guide')
const SITE = 'https://www.promptingguide.ai'
const GITHUB = 'https://github.com/dair-ai/Prompt-Engineering-Guide'
// [file, level] in teaching order. The other ten pages in the guide are research variants that are rarely used or overlap other lessons.
const PAGES = [['zeroshot', 1], ['fewshot', 1], ['cot', 2], ['consistency', 2], ['prompt_chaining', 2], ['react', 2], ['tot', 3], ['reflexion', 3]]

// Our own story and check-yourself questions for each imported page.
const EXTRAS = {
  zeroshot: {
    story: 'Someone pastes a customer review into a chatbot and types only: "Is this positive or negative?" There are no examples and no format, and it answers correctly. That is zero-shot prompting: relying on what the model already learned in training. Most everyday prompts are zero-shot.',
    quiz: [
      { q: 'You ask a model to label a review as positive or negative and give it no examples. What is this called?', options: ['Zero-shot prompting', 'Few-shot prompting', 'Fine-tuning a model'], answer: 0, why: 'No examples in the prompt means zero-shot. The model relies on what it already knows.' },
      { q: 'Your zero-shot prompt keeps returning the answer in the wrong format. What should you try next?', options: ['Raise the temperature for more variety', 'Add two or three examples of the format', 'Shorten the question to one sentence'], answer: 1, why: 'Examples show a format better than a description does, and that is the next technique.' },
    ],
  },
  fewshot: {
    story: 'A teacher shows one worked example, then three more when students still struggle. Few-shot prompting does the same for a model: you put a few input and output pairs in the prompt and it picks up the pattern, even a made-up one. The examples teach the format, not new facts.',
    quiz: [
      { q: 'What do few-shot examples mostly teach the model?', options: ['New facts about the topic', 'The format of the task', 'How to call external tools'], answer: 1, why: 'The examples show the pattern to follow. They do not add knowledge.' },
      { q: 'Which set of three examples is the better choice?', options: ['Three easy cases that all look alike', 'Varied cases, one of them tricky', 'One clear case repeated three times'], answer: 1, why: 'Varied examples, with a hard one, show the range. Identical ones make the model copy the pattern too narrowly.' },
    ],
  },
  cot: {
    story: 'Ask someone "what is 17 times 24?" and demand an instant answer, and they may blurt a wrong one. Ask them to show their steps and they usually get it right. Chain-of-thought prompting asks the model to write its reasoning first, and its accuracy on multi-step problems rises.',
    quiz: [
      { q: 'Why does asking for step-by-step reasoning improve answers on multi-step problems?', options: ['It unlocks a hidden reasoning mode in the model', 'Written steps become context for the answer', 'It makes the model spend longer on the GPU'], answer: 1, why: 'The model predicts one token at a time, so earlier written steps help it produce the later answer.' },
      { q: 'When is chain-of-thought least useful?', options: ['A multi-step math problem with several stages', 'A simple lookup or a model that reasons', 'A logic puzzle that needs several deductions'], answer: 1, why: 'For simple questions it only adds tokens. Reasoning models already do it internally, and prescribing steps can hurt.' },
    ],
  },
  consistency: {
    story: 'Three friends solve the same puzzle separately and two of them get 41. You trust 41 more than the single answer of one person. Self-consistency does this with a model: sample several reasoning paths and take the most common final answer.',
    quiz: [
      { q: 'How does self-consistency pick its final answer?', options: ['It asks the model to rate its own confidence', 'It votes on the most common sampled answer', 'It lowers the temperature to 0 and reruns once'], answer: 1, why: 'Different samples can reach the same answer by different routes, and the majority is usually more reliable.' },
      { q: 'What is the main cost of self-consistency?', options: ['A longer prompt for every question', 'Several model calls per question', 'A drop in accuracy on easy questions'], answer: 1, why: 'You pay for every sampled path, so it costs several times a single answer.' },
    ],
  },
  prompt_chaining: {
    story: 'A newsroom has an assembly line: a reporter drafts, an editor checks facts, a copy editor polishes. Prompt chaining builds that line from model calls. Each prompt does one small job and passes its output on, so mistakes are caught early and each step is easy to test.',
    quiz: [
      { q: 'What is a good reason to split a task into a chain of prompts?', options: ['Each step is small and easy to check', 'It always costs less than a single prompt', 'Models cannot read prompts that are long'], answer: 0, why: 'Small steps can be checked and fixed one at a time, though a chain usually costs more calls.' },
      { q: 'In a chain that drafts and then fact-checks, where would you add a check?', options: ['Between the steps, on each output', 'Only at the very end, on the final text', 'Nowhere, since the model checks itself'], answer: 0, why: 'Checking between steps stops one wrong output from flowing into the next step.' },
    ],
  },
  react: {
    story: 'A detective thinks, then acts, then looks at what they found, then thinks again. ReAct prompts a model to alternate in exactly that way: write a thought, call a tool, read the result, and continue. It is the direct ancestor of the agent loop.',
    quiz: [
      { q: 'What does a ReAct prompt alternate between?', options: ['Questions, answers and follow-up questions', 'Thoughts, tool actions and observations', 'Drafts, edits and a final polished copy'], answer: 1, why: 'Thought, action and observation repeat until the model can answer.' },
      { q: 'Which part of today\'s agents is ReAct the ancestor of?', options: ['The agent loop that calls tools', 'Embeddings that turn text into numbers', 'Quantization that shrinks the weights'], answer: 0, why: 'The loop of reasoning, calling a tool and reading the result is the same shape.' },
    ],
  },
  tot: {
    story: 'A chess player does not play the first idea. They consider a few moves, look ahead, drop the bad branches and pursue the promising ones. Tree of thoughts lets a model explore several lines of reasoning, score them and backtrack, which helps on puzzles where the first guess is often wrong.',
    quiz: [
      { q: 'How is tree of thoughts different from a single chain of thought?', options: ['It tries several branches, can backtrack', 'It uses far fewer tokens than one chain does', 'It asks the model to be more creative in tone'], answer: 0, why: 'It keeps several partial solutions, evaluates them and drops weak ones.' },
      { q: 'What is the price of exploring many branches?', options: ['More calls and tokens per question', 'A less accurate result on hard puzzles', 'A longer system prompt and nothing else'], answer: 0, why: 'Every branch and every evaluation is another model call.' },
    ],
  },
  reflexion: {
    story: 'After a failed exam, a good student writes down what went wrong and tries again with that note. Reflexion has an agent do the same: after a failed attempt it writes a short reflection, keeps it in memory and uses it on the next try, improving without any retraining.',
    quiz: [
      { q: 'How does a Reflexion agent improve between attempts?', options: ['It is retrained overnight on its mistakes', 'It keeps a written note on the failure', 'It lowers its temperature after each miss'], answer: 1, why: 'The written note goes back into the context, so the next attempt can avoid the same mistake.' },
      { q: 'What does Reflexion need in order to work well?', options: ['A signal for whether an attempt failed', 'A much larger context window than usual', 'Image input alongside the text prompt'], answer: 0, why: 'It needs feedback such as a failing test or a score to know what to reflect on.' },
    ],
  },
}

function clean(md, file) {
  const images = {}
  md = md.replace(/^import\s+(\w+)\s+from\s+'[^']*?img\/([^']+)'.*$/gm, (_, name, path) => ((images[name] = path), ''))
  md = md.replace(/^import .*$/gm, '')
  md = md.replace(/\]\((\/[^)]*)\)/g, (_, p) => `](${SITE}${p})`)
  const copyImage = path => {
    const to = join(here, '../public/content/ai-ref', path)
    mkdirSync(dirname(to), { recursive: true })
    cpSync(join(repo, 'img', path), to)
    return `/content/ai-ref/${path}`
  }
  md = md.replace(/<Screenshot\s+src=\{(\w+)\}\s+alt="([^"]*)"\s*\/>/g, (_, name, alt) => {
    if (!images[name]) throw new Error(`${file}: image ${name} not imported`)
    return `![${alt}](${copyImage(images[name])})`
  })
  md = md.replace(/\]\((?:\.\.\/)+img\/([^)]+)\)/g, (_, path) => `](${copyImage(path)})`)
  md = md.replace(/<CoursesSection[\s\S]*?<\/CoursesSection>/g, '').replace(/<CoursePromo[\s\S]*?\/>/g, '')
  md = md.replace(/<iframe[\s\S]*?<\/iframe>/g, '').replace(/<Cards>[\s\S]*?<\/Cards>/g, '')
  const outsideFences = md.split(/^```[\s\S]*?^```/m).join('')
  const leftover = outsideFences.match(/<[A-Z][A-Za-z]*/)
  if (leftover) throw new Error(`${file}: unhandled component ${leftover[0]}`)
  return md.replace(/\n{3,}/g, '\n\n').trim()
}

// Moves each quiz key to a rotating position so the answer cannot be guessed from where it sits.
let turn = 0
const rotate = quiz => quiz.map(q => {
  const to = turn++ % q.options.length, options = q.options.filter((_, i) => i !== q.answer)
  options.splice(to, 0, q.options[q.answer])
  return { ...q, options, answer: to }
})

export function importGuide(chapter, termsIn) {
  turn = 0
  if (!existsSync(join(repo, 'pages/techniques'))) throw new Error('vendor/prompt-engineering-guide missing: run scripts/ensure-source.mjs')
  return PAGES.map(([file, level]) => {
    const raw = readFileSync(join(repo, 'pages/techniques', `${file}.en.mdx`), 'utf8')
    const [, title] = raw.match(/^# (.+)$/m)
    let body = clean(raw.replace(/^# .+$/m, ''), file)
    body = body.replace(/^## [^\n]+\n+/, h => (h.toLowerCase().includes(title.toLowerCase().split(' ')[0]) ? '' : h)) // a first heading that repeats the page title
    const slug = file === 'rag' ? 'rag-prompting' : file.replaceAll('_', '-') // `rag` is taken by the authored lesson
    const summary = body.split('\n\n').find(p => p.length > 80 && /^[A-Z]/.test(p) && !p.startsWith('Image')) ?? title
    const url = `${SITE}/techniques/${file}`
    return {
      id: `ai/${chapter.id}/${slug}`, slug, title, level, minutes: Math.max(3, Math.round(body.split(/\s+/).length / 180)), summary: summary.replace(/\s+/g, ' ').slice(0, 280),
      kind: 'Reference', chapter: chapter.title, url: `/ai/docs/${chapter.id}/${slug}`,
      resources: [{ kind: 'docs', title: `${title} on promptingguide.ai`, url, by: 'DAIR.AI', why: 'The original page, with the latest edits and translations.' }],
      quiz: rotate(EXTRAS[file].quiz), story: EXTRAS[file].story, terms: termsIn(body), body,
      source: { name: 'DAIR.AI Prompt Engineering Guide', url: `${GITHUB}/blob/main/pages/techniques/${file}.en.mdx`, license: 'MIT' },
    }
  })
}
