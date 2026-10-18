// The AI track's learning order. Each chapter is a file in authored/ai/<id>.md; topic order is the order inside the file.
// To add a topic, add a `# slug | Title | level | minutes` section to a chapter file. To add a chapter, add it here.
// `stage` places a chapter on the learning map, `after` lists the chapters it builds on, `goals` marks which routes include it.

export const TIERS = [
  { id: 1, title: 'Must Know', blurb: 'The history, how models work, how to use them well and how to build with them. Work through this in order, ending with the math that explains why it all works.' },
  { id: 2, title: 'Advanced', blurb: 'Training, serving, production and staying current. Pick what you need.' },
]

export const STAGES = [
  { id: 1, title: 'Foundations', blurb: 'The theory: where AI came from, how it works and what it can do' },
  { id: 2, title: 'Use AI well', blurb: 'Get dependable results from models and coding agents' },
  { id: 3, title: 'Build with AI', blurb: 'APIs, retrieval and agents' },
  { id: 4, title: 'Trust and ship', blurb: 'Test it, secure it and put it to work' },
  { id: 5, title: 'Go deeper', blurb: 'The math underneath, training, production and staying current' },
]

export const GOALS = [
  { id: 'understand', title: 'Understand AI', blurb: 'How it works and why, without building anything.' },
  { id: 'use', title: 'Use AI at work', blurb: 'Prompt well and direct coding agents.' },
  { id: 'build', title: 'Build AI apps', blurb: 'APIs, retrieval, agents, evals and shipping.' },
  { id: 'deep', title: 'Go deep', blurb: 'Training, internals and production.' },
]

export const CHAPTERS = [
  { id: 'history', tier: 1, stage: 1, goals: ['understand', 'use', 'build', 'deep'], after: [], title: 'How We Got Here', blurb: 'From the 1950s to ChatGPT: the ideas, the winters and what finally worked.',
    outcome: 'Explain how AI went from hand-written rules to learning from data, and why 2017 and 2022 changed everything.',
    story: 'In 1966 a program called ELIZA fooled some users into thinking it understood them. It was a few hundred lines of pattern matching. Knowing why that was not intelligence, and what finally was, is the story of this chapter.' },
  { id: 'how-llms-work', tier: 1, stage: 1, goals: ['understand', 'use', 'build', 'deep'], after: ['history'], title: 'How LLMs Work', blurb: 'Tokens, prediction, attention and training in plain language.',
    outcome: 'Describe what happens between pressing Enter and seeing an answer, and why models sometimes make things up.',
    story: 'You type "The capital of France is" and the model continues with "Paris". It does not look it up. It predicts the most likely next piece of text, over and over. Everything surprising about chatbots follows from that.' },
  { id: 'breakthroughs', tier: 1, stage: 1, goals: ['understand'], after: ['how-llms-work'], title: 'Breakthroughs Beyond Chat', blurb: 'Vision, games, proteins, speech, code and open models.',
    outcome: 'Name the big AI wins outside chat and say why each one worked.',
    story: 'A biologist once needed years of lab work to find the shape of one protein. A model now predicts it in minutes and has mapped hundreds of millions. Chat is only one corner of what this technology does.' },
  { id: 'prompting', tier: 1, stage: 2, goals: ['use', 'build'], after: ['how-llms-work'], title: 'Prompting & Context', blurb: 'Getting good answers, and controlling what the model sees.',
    outcome: 'Write prompts and manage context so results are reliable, not lucky.',
    story: 'Two people ask the same model to "write a product description". One gets generic fluff. The other states the audience, the length and one good example, and gets something usable. The model was the same. The context was not.' },
  { id: 'coding-agents', tier: 1, stage: 2, goals: ['use', 'build'], after: ['prompting'], title: 'Working with Coding Agents', blurb: 'A workflow for directing agents and verifying their work.',
    outcome: 'Direct a coding agent through explore, plan, build and verify, and know when to distrust it.',
    story: 'A developer asks an agent to fix a bug and goes to lunch. Without tests, they return to code that looks right and is not. With one failing test as the target, the agent fixes it and proves it. The difference is verification.' },
  { id: 'building', tier: 1, stage: 3, goals: ['build'], after: ['prompting'], title: 'Building with the API', blurb: 'Calling models, tools, MCP, errors and multimodal input.',
    outcome: 'Make your first API call, add tools, handle errors and connect MCP servers.',
    story: 'A small shop wants an assistant that can check order status. A model alone cannot see orders. Give it one tool that looks them up, and it can answer "where is my package?" with real data.' },
  { id: 'retrieval', tier: 1, stage: 3, goals: ['build'], after: ['building'], title: 'Embeddings & Retrieval', blurb: 'Embeddings, chunking, vector search and RAG, with how to measure each.',
    outcome: 'Make a model answer from your own documents, with sources, and measure whether it does it well.',
    story: 'A new employee asks the company chatbot about parental leave. A plain model guesses. A retrieval-backed one finds the policy page, quotes the paragraph and links it. Same model, but now it reads before it answers.' },
  { id: 'agents', tier: 1, stage: 3, goals: ['build'], after: ['building'], title: 'Agents', blurb: 'Loops, patterns, tools, memory and multi-agent systems.',
    outcome: 'Build and reason about agent loops, tool design, memory and when to use several agents.',
    story: 'You ask "is this open-source project well maintained?" An agent checks recent commits, open issues and the last release, and writes a verdict with numbers. Nobody scripted those steps. It chose them.' },
  { id: 'evolution', tier: 1, stage: 3, goals: ['understand', 'use', 'build'], after: ['agents'], title: 'From Prompts to Harnesses', blurb: 'How the craft changed, and which of the new words name something real.',
    outcome: 'Tell real engineering from buzzwords, from prompt engineering to harness engineering.',
    story: 'Every year brings a new word: prompt engineering, agents, context engineering, harness engineering. A founder hears each one as a revolution. This chapter shows which parts changed how the work is done and which are a new name for good practice.' },
  { id: 'evals-and-safety', tier: 1, stage: 4, goals: ['build', 'use'], after: ['building', 'retrieval', 'agents'], title: 'Evals, Observability & Safety', blurb: 'Knowing whether it works, seeing what happened and staying safe.',
    outcome: 'Test AI output, read traces, find your biggest failures and defend against prompt injection.',
    story: 'A support bot launches and users love the demo. Two weeks later a customer shows a screenshot of it promising a refund policy that does not exist. A test set of real questions would have caught it before launch.' },
  { id: 'tooling', tier: 1, stage: 4, goals: ['use', 'build'], after: ['evolution'], title: 'The Tooling Landscape', blurb: 'A map of the layers and the tools in each.',
    outcome: 'Place any new tool on the map and pick a sensible stack for a project.',
    story: 'A new framework launches every week, each claiming to replace the last. A developer who knows the layers can see in a minute that a "revolutionary" tool is a new wrapper around one layer, and skip it.' },
  { id: 'projects', tier: 1, stage: 4, goals: ['build'], after: ['agents', 'retrieval', 'building'], title: 'Build Projects', blurb: 'Five build-along projects that put each part of the path to work.',
    outcome: 'Finish five small projects, from a chat assistant to a shipped, tested app.',
    story: 'Reading about AI makes you informed. Building a chatbot that breaks on your tenth test question makes you good at it. The projects are designed to break in useful ways.' },
  { id: 'building-blocks', tier: 1, stage: 5, goals: ['understand', 'deep'], after: ['how-llms-work'], title: 'Building Blocks', blurb: 'The math underneath everything above, with worked numbers and small demos. This is where using AI becomes understanding it.',
    outcome: 'Read the math in any AI explainer: vectors, softmax, gradients and attention.',
    story: 'A streaming app suggests a song you love. Under the hood, your taste and the song are each a list of numbers, and "this fits you" is one multiplication. That one operation, the dot product, is the heart of this chapter.' },
  { id: 'model-internals', tier: 2, stage: 5, goals: ['deep', 'understand'], after: ['building-blocks', 'how-llms-work'], title: 'Models Under the Hood', blurb: 'Build a GPT, modern architecture, fine-tuning, RL and serving.',
    outcome: 'Build a small GPT, and explain fine-tuning, reinforcement learning and how models are served.',
    story: 'A 300-line program trained on a laptop writes text that sounds a little like Shakespeare. It is the same recipe as the giant models, just smaller. Building it removes the magic.' },
  { id: 'production', tier: 2, stage: 5, goals: ['deep', 'build'], after: ['evals-and-safety', 'projects'], title: 'Production', blurb: 'Advanced retrieval, cost, MLOps, protocols and human approval.',
    outcome: 'Run AI features with sensible cost, deployment, protocols and human approval.',
    story: 'A startup ships an agent and wakes up to a four-figure bill because a loop retried all night. A spend cap and an alert are cheap. This chapter is the list of cheap things that prevent expensive mornings.' },
  { id: 'creative-and-applied', tier: 2, stage: 5, goals: ['deep', 'use'], after: ['coding-agents'], title: 'Creative & Applied', blurb: 'Video as code and deep research workflows.',
    outcome: 'Make a video from code with an agent and run a cross-checked research workflow.',
    story: 'A designer who cannot code describes a 20-second animation. An agent writes the scene, renders a frame, looks at it and fixes the spacing. The human still decides what looks good.' },
  { id: 'prompting-reference', tier: 2, stage: 5, goals: ['deep', 'use'], after: ['prompting'], title: 'Prompting Techniques Reference', blurb: 'Eighteen named techniques with worked examples, imported from the MIT-licensed DAIR.AI guide.', imported: true,
    outcome: 'Look up any named prompting technique with a worked example.',
    story: 'Papers give techniques names like "self-consistency" and "tree of thoughts". This reference turns each name into a small example you can try in a minute.' },
  { id: 'keep-up', tier: 2, stage: 5, goals: ['understand', 'use', 'build', 'deep'], after: [], title: 'Keep Up', blurb: 'Sources, lists and how to read benchmarks.',
    outcome: 'Follow the field with a short, reliable list instead of drowning in it.',
    story: 'A viral post claims a model "just changed everything". Ten minutes later, a careful blog shows it improved one benchmark by two points. Knowing where to look is a skill you will use every month.' },
]

// Topic slug -> interactive demo shown above the lesson.
export const EXPLAINERS = {
  'ai-origins': 'timeline',
  'evolution-overview': 'eras',
  'vectors-and-similarity': 'dot',
  'probability-and-softmax': 'sampler',
  'next-token-prediction': 'sampler',
  'neurons-and-networks': 'neuron',
  'loss-and-gradient-descent': 'descent',
  'agent-loop': 'loop',
  'rag': 'rag',
  'what-are-embeddings': 'dot',
  'similarity-metrics': 'dot',
  'harness-engineering': 'harness',
  'tooling-map': 'stack',
}

export const KINDS = ['article', 'video', 'course', 'repo', 'paper', 'docs', 'tool', 'book']
