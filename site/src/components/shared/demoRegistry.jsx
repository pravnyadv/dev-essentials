'use client'

// A track's demos as one component, picked by the name its curation file gives a topic.
// An unknown name throws, so a typo there fails the static build instead of shipping a lesson without its demo.
export const demoRegistry = demos =>
  function Explainer({ name }) {
    const Demo = demos[name]
    if (!Demo) throw new Error(`Unknown demo "${name}". Known demos: ${Object.keys(demos).join(', ')}`)
    return <Demo />
  }
