# ai-motion-design | Motion design with Claude and Remotion | 2 | 15
Video can be written as code. That makes it something a coding agent can build, preview and revise.

## What it is
Remotion is a React framework where each video frame is a component rendered at a point in time. Animation is a function of the current frame number. Because it is code, an agent can write a scene, render a still, look at it, fix the layout and re-render. Agent skills for Remotion teach the agent the framework's conventions such as how to time sequences, so you get fewer broken first drafts.

## A workable loop
Write a short brief with the story beats, the style and the length. Ask the agent to build one scene at a time. Render stills at key frames and check them, since the agent can view images. Keep assets and timing constants in one file so changes are cheap. The skill is directing: the agent handles syntax, you handle taste and pacing.

## A worked example: a scene as code
A scene is a function of the frame number. Frames 0 to 30: a title fades in (opacity = frame / 30). Frames 30 to 90: a bar chart grows (height = value × progress). Because it is plain code, the agent can change a number, re-render and compare. Timing constants live in one file so you can retime the whole video in a minute.

## Directing well
Write the story beats and style first. Ask for one scene at a time. Look at rendered stills before moving on. Keep the brand colors and fonts in one place.

## Common mistake
Asking for a whole video in one prompt. Build and check scene by scene.

```resources
docs | Remotion: AI skills | https://www.remotion.dev/docs/ai/skills | Remotion | Official skills for coding agents.
repo | Remotion | https://github.com/remotion-dev/remotion | Remotion | Make videos programmatically with React.
repo | HyperFrames | https://github.com/heygen-com/hyperframes | HeyGen | Open-source framework for agent-driven video from HTML.
repo | awesome-claude-5-5-videos | https://github.com/athemeroy/awesome-claude-5-5-videos | athemeroy | A list of videos made with Claude.
```

```quiz
Why is code-based video good for agents? | It is smaller ; The agent can write, render, look and fix in a loop ; It needs no preview | 1 | Verification by rendering closes the loop.
What stays with you in this workflow? | Syntax ; Taste, pacing and direction ; Rendering | 1 | The agent handles mechanics. You decide what is good.
```

```story
A teacher who cannot animate wants a 15-second explainer about how a bill becomes law. She describes four scenes in plain words. An agent writes the animation code, renders a still of each scene, spots that the text overlaps the image, fixes it and renders again. She chooses the colors and pacing. The craft shifted from clicking in an editor to describing and directing.
```

# deep-research | Deep research workflows | 2 | 12
A research question is a fan-out job: search many angles, read sources, cross-check, then write.

## How it works
A deep research system plans sub-questions, runs searches in parallel, fetches and reads pages, extracts claims with their sources, checks claims against each other and writes a cited report. In Claude Code, the built-in /deep-research workflow follows this shape and runs verifier agents that vote on each claim, filtering ones that fail cross-checking. The structure matters more than the brand: parallel gathering, independent verification, citations.

## Using it well
Ask a specific question with a scope and time frame. Check the citations of any claim you will rely on, since a citation proves a source exists, not that it says what the report claims. Prefer primary sources. Expect cost in tokens to be many times a single chat answer.

## A worked example: reading a research report
Claim: "Filings fell 8 percent in 2024 [3]." Click source 3. Does the page really say 8 percent, and for which group? Often it says something close but narrower. Verify the three claims your decision depends on. A citation shows where the model got it, not that it understood it.

## Writing a good question
Specific scope, time frame and what counts as evidence. "Compare 2023 and 2024 filing counts using government statistics" is better than "is the tax rule working?"

## Common mistake
Treating a long cited report as proof. Check the sources that matter.

```resources
docs | Dynamic workflows and /deep-research | https://code.claude.com/docs/en/workflows | Anthropic | How the bundled research workflow is run and watched.
article | How we built our multi-agent research system | https://www.anthropic.com/engineering/multi-agent-research-system | Anthropic | The design behind multi-agent research.
```

```quiz
What does a citation prove? | The claim is true ; That a source exists, not necessarily that it says that ; Nothing | 1 | Always check important claims against the source.
Why run verifier agents? | To cross-check claims independently ; To save tokens ; For speed | 0 | Independent checking filters unsupported claims.
```

```story
You ask "has the 2024 change to the tax rule actually reduced filings?" A normal chat gives a confident paragraph with no sources. A research workflow splits the question into angles, fetches reports from several sites, makes agents try to refute each other's claims and returns a report where every claim has a source and the shaky ones are removed.
```

