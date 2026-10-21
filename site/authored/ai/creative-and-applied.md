# ai-motion-design | Motion design with Claude and Remotion | 2 | 15
Video can be written as code. That makes it something a coding agent can build, preview and revise.

## What it is
Remotion is a React framework where each video frame is a component rendered at a point in time. Animation is a function of the current frame number. Because it is code, an agent can write a scene, render a still, look at it, fix the layout and re-render. Agent skills for Remotion teach the agent the framework's conventions such as how to time sequences, so you get fewer broken first drafts.

## A workable loop
Write a short brief with the story beats, the style and the length. Ask the agent to build one scene at a time. Render stills at key frames and check them, since the agent can view images. Keep assets and timing constants in one file so changes are cheap. The skill is directing: the agent handles syntax, you handle taste and pacing.

```mermaid Build one scene at a time and look at a rendered still before moving on.
flowchart TD
  B[Brief: beats, style, length] --> S[Agent builds one scene]
  S --> R[Render a still]
  R --> L[Agent looks at the image]
  L --> K{Layout right?}
  K -->|No| S
  K -->|Yes| N[Next scene, then the full render]
  class N good
```

## A worked example: a scene as code
A scene is a function of the frame number. Frames 0 to 30: a title fades in (opacity = frame / 30). Frames 30 to 90: a bar chart grows (height = value × progress). Because it is plain code, the agent can change a number, re-render and compare. Timing constants live in one file so you can retime the whole video in a minute.

## Step by step: a 10-second video
Start with arithmetic, since everything in the code runs on frame numbers.
1. Choose a frame rate. At 30 frames per second, 10 seconds is 300 frames.
2. Split the story into three scenes: 90, 120 and 90 frames. That is 3, 4 and 3 seconds, and the total is 300.
3. Put these numbers in one constants file, so retiming means editing one place.
4. Ask the agent to build scene one only. Remotion's Sequence component places a scene at a start frame, and its interpolate helper turns a frame number into a value.
5. Render one frame as an image, near the middle of the scene. Check the layout, then ask for fixes.
6. Repeat for scenes two and three, then render the whole video.

The table turns the three scenes into frame numbers at 30 frames per second.

| Scene | Start frame | End frame | Seconds |
|---|---|---|---|
| 1 | 0 | 90 | 3 |
| 2 | 90 | 210 | 4 |
| 3 | 210 | 300 | 3 |

## How the timing math works
A progress value runs from 0 to 1 across a range of frames. A bar chart grows between frame 30 and frame 90, a span of 60 frames. At frame 60, progress is (60 - 30) / 60 = 0.5. If the final bar height is 80 pixels, the bar is 40 pixels tall at that moment. A title that fades in over frames 0 to 30 has opacity 0.5 at frame 15. Easing changes the curve, but the idea stays the same: the picture is a pure function of the frame number.

```mermaid The bar grows in a straight line from frame 30 to frame 90 and is 40 pixels tall at frame 60, halfway
xychart-beta
  x-axis "frame" [30, 45, 60, 75, 90]
  y-axis "bar height in pixels" 0 --> 80
  line "height" [0, 20, 40, 60, 80]
```

## What goes wrong: a preview that flickers
Preview looks fine, but the final render has parts that jump or flicker. A common cause is timing that does not come from the frame number, such as CSS transitions, a timer, or random values. Rendering draws frames in separate browser tabs, in parallel, and does not wait for real time to pass.

```mermaid A frame computed only from its number always renders the same image, while a clock or random value makes frames differ.
flowchart LR
  F[Frame number] --> S[Scene code]
  S --> I[Image of that frame]
  X[Clock, timer or random value] -.-> S
  class X bad
  class F good
```

To confirm, render the same frame twice, then compare the two images. A correct scene produces identical stills. If they differ, find the code that reads the clock or a random number, and replace it with a value computed from the frame.

## When code video is the wrong tool
Cutting footage you filmed, or tuning a short logo animation by dragging keyframes, is faster in an editor with a timeline. Code video suits scenes made of text, charts and shapes, and videos you want to regenerate from changing data.

## Giving feedback the agent can act on
Vague notes get vague fixes. "Make it punchier" could mean ten things. Name the frame, the element and the change. Compare:
1. Weak: "The title feels slow."
2. Strong: "In scene one the title fades in over 30 frames. Make it 15, and hold it on screen for 45 frames before the chart starts."

The strong note maps to two constants, so the agent edits two numbers and you compare a new still. If a change makes things worse, undo it by restoring the old numbers. This is why keeping timing in one file matters.

## Common mistake
Asking for a whole video in one prompt. Build and check scene by scene.

```resources
docs | Remotion: AI skills | https://www.remotion.dev/docs/ai/skills | Remotion | Official skills for coding agents.
repo | Remotion | https://github.com/remotion-dev/remotion | Remotion | Make videos programmatically with React.
repo | HyperFrames | https://github.com/heygen-com/hyperframes | HeyGen | Open-source framework for agent-driven video from HTML.
repo | awesome-claude-5-5-videos | https://github.com/athemeroy/awesome-claude-5-5-videos | athemeroy | A list of videos made with Claude.
```

```quiz
Why is code-based video good for agents? | Rendered video needs no review before sharing ; The agent can render, look and fix in a loop ; Code files are always smaller than video files | 1 | Verification by rendering closes the loop.
What stays with you in this workflow? | Rendering every frame by hand ; Typing out every line of syntax ; Taste, pacing and direction | 2 | The agent handles mechanics. You decide what is good.
An agent's scene has text overlapping an image. What is the quickest fix loop? | Render a still and ask for a layout fix ; Rewrite the whole video in one new prompt ; Add more scenes to cover up the overlap | 0 | Checking rendered stills scene by scene catches layout problems early.
```

```story
A teacher who cannot animate wants a 15-second explainer about how a bill becomes law. She describes four scenes in plain words. An agent writes the animation code, renders a still of each scene, spots that the text overlaps the image, fixes it and renders again. She chooses the colors and pacing. The craft shifted from clicking in an editor to describing and directing.
```

# deep-research | Deep research workflows | 2 | 12
A research question is a fan-out job: search many angles, read sources, cross-check, then write.

## How it works
A deep research system plans sub-questions, runs searches in parallel, fetches and reads pages, extracts claims with their sources, checks claims against each other and writes a cited report. In Claude Code, the built-in /deep-research workflow follows this shape and runs verifier agents that vote on each claim, filtering ones that fail cross-checking. The structure matters more than the brand: parallel gathering, independent verification, citations.

```mermaid Deep research plans sub-questions first, searches them in parallel, then checks claims before writing.
flowchart TD
  Q[Question] --> P[Plan sub-questions]
  P --> S[Parallel searches]
  S --> R[Read pages, extract claims with sources]
  R --> C[Check claims against each other]
  C --> W[Write a cited report]
  class C focus
```

## Using it well
Ask a specific question with a scope and time frame. Check the citations of any claim you will rely on, since a citation proves a source exists, not that it says what the report claims. Prefer primary sources. Expect cost in tokens to be many times a single chat answer.

## A worked example: reading a research report
Claim: "Filings fell 8 percent in 2024 [3]." Click source 3. Does the page really say 8 percent, and for which group? Often it says something close but narrower. Verify the three claims your decision depends on. A citation shows where the model got it, not that it understood it.

## Writing a good question
Specific scope, time frame and what counts as evidence. "Compare 2023 and 2024 filing counts using government statistics" is better than "is the tax rule working?"

## How verification voting works
A verifier is a separate agent that checks one claim. Take the claim "Filings fell 8 percent in 2024." Three verifiers each search for support on their own. One rule, an invented policy, keeps a claim only if at least 2 of 3 find a source that states it. Here two find it and one finds a figure of 6 percent for a smaller group. The claim stays, perhaps with the dispute noted.

```mermaid Three verifiers check one claim on their own, and the claim stays only if enough of them find a source.
flowchart TD
  C[Claim] --> V1[Verifier 1]
  C --> V2[Verifier 2]
  C --> V3[Verifier 3]
  V1 --> D{2 of 3 found a source?}
  V2 --> D
  V3 --> D
  D -->|Yes| K[Keep the claim]
  D -->|No| X[Drop the claim]
  class K good
  class X bad
```

The weakness: votes are only independent if the sources are. If all three verifiers land on the same blog post, three votes are really one.

## Step by step: running a question you can trust
1. Write the question with a scope, a period and the kind of evidence you accept.
2. Ask for the plan of sub-questions first. Add any angle that is missing.
3. Run the research.
4. Mark the three claims your decision depends on.
5. Open each cited page and search it for the exact figure and group.
6. For any that fail, ask for a re-run that uses primary sources only.

## What goes wrong: citations that trace to one origin
Sources 2, 3 and 5 all state the same figure in similar words. They look like three confirmations. Often two of them quote the third, and that one quotes an old press release. To confirm, open each source and follow its own citation backward. If the trail ends at one page, you have one source. Also check dates: a page from 2022 cannot support a claim about 2024.

## When deep research is the wrong tool
A single fact, such as a city's population, needs one search. A question whose answer lives in your own private files needs retrieval over those files, because the web has nothing on it. A decision due in five minutes cannot wait for a run that costs many times a normal answer. Use it for open questions where several sources must agree.

## What the cost looks like
Parallel gathering reads a lot. Invented numbers: 5 sub-questions, 10 pages each, about 3,000 tokens a page. That is 5 x 10 x 3,000 = 150,000 tokens of reading, before the verifiers fetch pages of their own. A normal chat answer might read 5,000 tokens and write 1,000. You pay for breadth, so a narrower question is both cheaper and easier to check. Cutting the scope from five sub-questions to two cuts the reading to 60,000 tokens.

```mermaid Reading cost scales with the number of sub-questions, against a normal chat answer (invented numbers, verifier reading not counted)
xychart-beta
  x-axis [Chat answer, Two sub-questions, Five sub-questions]
  y-axis "tokens read" 0 --> 160000
  bar [5000, 60000, 150000]
```

## Common mistake
Treating a long cited report as proof. Check the sources that matter.

```resources
docs | Dynamic workflows and /deep-research | https://code.claude.com/docs/en/workflows | Anthropic | How the bundled research workflow is run and watched.
article | How we built our multi-agent research system | https://www.anthropic.com/engineering/multi-agent-research-system | Anthropic | The design behind multi-agent research.
```

```quiz
What does a citation prove? | That the claim is current and up to date ; That a source exists, not that it backs it ; That the claim was checked by an editor | 1 | Always check important claims against the source.
Why run verifier agents? | To make the final report shorter ; To save tokens in the later steps ; To check claims independently | 2 | Independent checking filters unsupported claims.
A report claims "filings fell 8 percent [3]". What should you do before relying on it? | Open source 3 and check the figure ; Trust it, since a source is cited ; Ask the report to repeat the number | 0 | A cited figure can be close but narrower or different, so check the source.
```

```story
You ask "has the 2024 change to the tax rule actually reduced filings?" A normal chat gives a confident paragraph with no sources. A research workflow splits the question into angles, fetches reports from several sites, makes agents try to refute each other's claims and returns a report where every claim has a source and the shaky ones are removed.
```

