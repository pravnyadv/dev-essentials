# sources-to-follow | Sources worth following | 1 | 10
New releases arrive weekly. A short list of reliable sources beats a feed of everything.

## How to keep up without drowning
Pick three to five sources and ignore the rest. Prefer people who build and show evidence over accounts that repost excitement. Treat viral threads as pointers: find the primary source (the paper, the docs, the repo) and read that. Check the date, since advice from a year ago may be outdated. When something claims a big win, ask what was measured and on what.

## A starter set
Lab engineering blogs for how things are built. A practitioner blog with daily links and notes. One weekly newsletter for research. One paper aggregator. A community for local models.

## A worked example: a weekly routine
Monday, 20 minutes: skim one newsletter for the week's research. Wednesday, 10 minutes: read one engineering blog post fully. Friday, 15 minutes: check the model release tracker and the radar page here. Total under an hour. Anything bigger gets a deeper read, from the primary source.

## Tracing a claim to its source
A thread says: "New model beats the old one by 20 percent." Follow these steps.
1. Look for a link. If there is none, search the lab's blog or model card for the release.
2. Find the table behind the claim and note which test it uses and the settings.
3. Check who ran it: the lab itself, or an independent group.
4. Check the date, in case the claim describes an older version.

Suppose the table shows 10 points before and 12 points after. That is a 20 percent relative gain, since 2 divided by 10 is 0.2. It is only a 2 point absolute gain. Both numbers are true, and only the first makes a good headline.

## What goes wrong: five sources that are really one
Your five newsletters all report the same new result in nearly the same words, with the same number. It feels like strong confirmation. It is often five summaries of one post.

To confirm, follow each link backward. If all of them end at the same page, you have one source, repeated. Count independent sources, not mentions. The lesson is to read the page they all point to.

## How to tell your set is working
At the end of each month, write down three things you learned and where each came from. Mark each one as primary (paper, docs, repo) or secondary (someone's summary). Replace a source if:
1. You cannot recall learning anything from it.
2. It never links to primary sources.
3. You skim it without reading.

A set that passes keeps you able to say, in one sentence, what changed and what evidence shows it.

## Common mistake
Following everything. Sources you do not read are noise.

```resources
article | Anthropic Engineering | https://www.anthropic.com/engineering | Anthropic | How Claude features and agents are built.
article | Simon Willison's Weblog | https://simonwillison.net/ | Simon Willison | Daily, careful notes on tools and models.
article | Latent Space | https://www.latent.space/ | swyx and Alessio | Podcast and newsletter for AI engineers.
article | Ahead of AI | https://magazine.sebastianraschka.com/ | Sebastian Raschka | Clear research explainers and architecture comparisons.
article | Interconnects | https://www.interconnects.ai/ | Nathan Lambert | Post-training, open models and policy.
article | Import AI | https://importai.substack.com/ | Jack Clark | Weekly research summary.
tool | Hugging Face Papers | https://huggingface.co/papers | Hugging Face | Daily trending papers.
```

```quiz
A viral thread claims a huge result. Best next step? | Share it, since many others already have ; Find the original source and check the claim ; Wait for a famous account to confirm it | 1 | Threads are pointers. The paper or docs hold the evidence.
How many sources should you follow closely? | One source, to avoid conflicting views ; Every source you can find on the topic ; A few sources you trust and read well | 2 | Depth on a few beats skimming everything.
A post says "this changes everything" but links nothing. What does that suggest? | Treat it as a lead and look for evidence ; The author must be an expert in the field ; It is probably true, so act on it right away | 0 | A claim without a source is a lead, not evidence.
```

```story
A viral post says a new model is "insane". A careful practitioner posts a test the same day: it improved on one benchmark by two points and got worse on another. The person who follows five trusted sources knows the real picture by lunchtime. The person who follows five hundred accounts knows only that something happened.
```

# awesome-lists | Curated lists and roadmaps | 1 | 10
Other people have already organized this field. Use their lists as a map and check what is current.

## How to use a list
Other people have already sorted this field into lists. A good list saves you weeks. A bad one is a pile of bookmarks. Judge a list in a minute with four checks:

When was the last update? A list untouched for a year is probably stale.
Does each entry say why it is worth reading, or is it just a link?
Is it maintained by one person or many?
Are paid items marked?

## A worked example: judging a list
Open the repository and look at the commit history. If the last change was eleven months ago, treat the links as hints and check each one. Look at ten entries. If seven of them have a sentence about what you will learn, the list is curated. If none do, it is a dump. Pick the best two or three entries in the section you need and ignore the rest.

## Which list for which goal
You are new and want an order to follow: the path on this site, then the beginner guides below. You want to build agents: the agentic engineering lists. You want to study the research: the model internals chapter and the papers it cites. You want to keep up weekly: the sources in the previous lesson.

## Use this site's library
The Resource library page lists every link cited in these lessons, with a sentence on what each one is good for, filterable by type. It is smaller than a giant list and every entry is annotated.

## What goes wrong: link rot and repeats
Open ten random entries on a list. If three lead to an error page, a changed address, or a site that no longer covers the topic, the list is not being maintained. This is link rot, and it grows with age.

A second problem is repetition. Open three lists on the same topic and you often see the same ten resources in each. The real count is not 500 links across three lists. It may be closer to 40 unique ones. To confirm, copy the titles into one document and remove duplicates. The number left is the size of the topic.

## Turning a list into a plan
A list becomes useful when you add a goal and a limit.
1. Write one goal, such as "build a small agent that calls two tools".
2. Find the section of the list that matches and copy five entries into a notes file.
3. Next to each, write one line on why you picked it.
4. Spend 15 minutes on each. Cross out any that repeat what you already learned.
5. Keep the best two and do them this week.

Five entries become two in about an hour and a quarter. Expect to end with fewer items than you started with. That is the point.

## Common mistake
Saving lists you never open. Pick one, take three items, and read them this week.

```resources
repo | Awesome Agentic Engineering Resources | https://github.com/EthicalML/awesome-agentic-engineering-resources | EthicalML | Articles, courses, papers and benchmarks, with monthly updates.
repo | Agentic Engineering Handbook | https://github.com/keyuchen21/agentic-engineering-handbook | keyuchen21 | A phased roadmap of 200+ resources.
repo | Awesome Agentic Engineering | https://github.com/fatihkc/awesome-agentic-engineering | fatihkc | Focused on directing coding agents.
repo | Learn how to build, deploy, evaluate agents | https://github.com/Machine-Learning-Tokyo/agent-resources | Machine Learning Tokyo | Ten free resources ranked by quality.
repo | Start AI Engineering in 2026 | https://github.com/louisfb01/start-ai-engineering | Louis-François Bouchard | A guide for beginners organized by learning style.
repo | mlabonne/llm-course | https://github.com/mlabonne/llm-course | Maxime Labonne | Roadmaps for LLM scientists and engineers with notebooks.
repo | Generative AI for Beginners | https://github.com/microsoft/generative-ai-for-beginners | Microsoft | Structured lessons with code.
tool | roadmap.sh AI Engineer | https://roadmap.sh/ai-engineer | roadmap.sh | Community map of skills.
```

```quiz
What makes a list entry more useful? | A catchy title and a link only ; Why it matters and a date ; A long list of tags per entry | 1 | Context tells you whether to read it.
What does a list of 500 links give you? | A guarantee of quality ; A ready-made study plan ; A reference to dip into | 2 | A curated order is what turns links into a path.
A list was last updated 14 months ago. What should you do? | Treat the links as hints and check each one ; Throw it away and never trust lists again ; Trust it fully since it is so popular | 0 | Lists age quickly in this field, so check recency.
```

```story
A beginner opens a list titled "500 AI resources" and closes it ten minutes later more confused. Long lists are libraries, not courses. Pairing a list with a path that says "read these five first" is what turns links into learning.
```

# reading-benchmarks | How to read benchmarks and leaderboards | 2 | 12
A benchmark is a fixed test with a score. It is useful and easy to misread.

## What to check
Is the test saturated, with top models all near 100 percent so differences are noise? Could the model have seen the answers in training (contamination)? Does the task look like yours? Was the score measured by the vendor or independently? How many runs, and what was the spread? Human preference arenas measure style and helpfulness in chat, which is not the same as correctness on your task. Benchmarks for agents depend heavily on the harness used, so a score is for a model plus a harness.

## How to use them
Use leaderboards to shortlist, then run your own examples. Track a small number of benchmarks that resemble your work. Be suspicious of any single headline number.

## A worked example: is the gap real?
Model A scores 87.3 and model B 86.9 on a test with 500 questions. With that many questions the typical sampling error is about 1.5 points (about 3 points at 95 percent confidence), so a gap of 0.4 is within noise. Treat them as equal until a larger or different test separates them.

## How the noise estimate works
A score on n questions is a sample. The typical sampling error is sqrt(p(1 - p) / n). For p = 0.87 and n = 500 that is sqrt(0.87 × 0.13 / 500), about 0.015, or 1.5 points.

A gap between two scores is noisier than either score alone, because both carry error. Treating them as independent, the gap error is about 1.5 times the square root of 2, or about 2.1 points. About 95 percent of the time the true gap sits within roughly twice that. A 0.4 gap is far inside it. Models tested on the same questions have a tighter gap in practice, but 0.4 still tells you very little.

## What goes wrong: a model that has seen the test
Contamination means test questions appeared in the training data. The symptom is a high public score that does not carry over. A model scores 90 on a famous test, then does much worse on questions you wrote in the same style.

To check, write 20 fresh questions of the same type and compare. A large drop suggests memorization. It does not prove it, since your questions may also be harder.

## When a public benchmark is the wrong tool
You summarize legal contracts. A coding leaderboard tells you almost nothing about that. Build your own test:
1. Collect 30 real inputs from your work.
2. Write the answer you want for each, or a short rubric (a checklist for grading).
3. Run each candidate model three times on all 30.
4. Record the average and the spread between runs.

If a model's three runs vary by more than the gap between models, you cannot separate them yet. Add more examples.

## Common mistake
Quoting a single number without its context.

```resources
tool | LMArena | https://lmarena.ai/ | LMArena | Human preference rankings.
tool | Artificial Analysis | https://artificialanalysis.ai/ | Artificial Analysis | Independent quality, speed and price.
tool | SWE-bench | https://www.swebench.com/ | Princeton NLP | Coding agent benchmark.
tool | Epoch AI Benchmarking Hub | https://epoch.ai/benchmarks | Epoch AI | Independent runs across many benchmarks.
article | AI Snake Oil | https://www.aisnakeoil.com/ | Narayanan and Kapoor | Critical reading of AI claims.
```

```quiz
All top models score 97 to 99 percent. What does that tell you? | Pick the one with the highest score ; The test no longer tells them apart ; They were all trained on the same data | 1 | Small differences near the ceiling are mostly noise.
An agent benchmark score reflects what? | Only how hard the test is ; Only the model's weights ; Model plus its harness | 2 | Harness choices change results significantly.
Model A scores 87.3 and B scores 86.9 on 500 questions. Which conclusion is fair? | The gap is small noise, so call it a tie ; B is worse, since it lost on 500 questions ; A is better, since 87.3 is higher than 86.9 | 0 | With 500 questions, a 0.4 gap is smaller than typical sampling error.
```

```story
A new model tops a leaderboard by half a point. A team switches to it and finds it does worse on their documents. The leaderboard measured something real, but not their task. Benchmarks are a starting list, not a verdict.
```

