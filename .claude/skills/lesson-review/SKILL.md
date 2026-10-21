---
name: lesson-review
description: Judges the teaching quality of authored lessons in this repo (AI track site/authored/ai, System Design track site/authored/sd) and writes a findings report. Checks facts and worked numbers against the lesson's own linked sources, reads it as a newcomer to find where they would get lost, tests whether each quiz question has exactly one defensible answer, and checks that the story, diagrams and demo show what the text says. Use it whenever someone asks to review, judge, audit, fact-check, beginner-test or sanity-check a lesson, a chapter or a whole track, asks "is this lesson any good", or wants a quality pass after writing or editing lessons, even if they do not say "review". Not for code review, UI checks or the mechanical lint (npm run lint:ai covers readability numbers).
---

# Lesson review

The mechanical checks already exist: `npm run lint:ai` / `lint:sd` score readability and length, the build rejects malformed quizzes and resources, `npm run links` finds dead URLs. This skill does what they cannot: decide whether a lesson is *right* and whether it *teaches*. Do not repeat what the lint already reports (word counts, grade level, a missing story).

The reader is a newcomer: someone who has read the earlier lessons of the chapter and nothing else. A lesson fails them when it states something false, skips a step, uses a word it never explains, or asks a quiz question whose "wrong" answer is defensible.

## Pick the scope

- One lesson: its slug, e.g. `similarity-metrics`.
- A chapter or track: `node .claude/skills/lesson-review/scripts/lesson.mjs --list <ai|sd> [chapter]` lists `track chapter slug` lines.
- "What changed": `git diff --name-only origin/main -- site/authored` and review the lessons whose sections changed.

For more than about three lessons, fan out: one sub-agent per chapter on the `sonnet` model (never let it inherit a larger model), each following this file for its chapter and writing its part of the report. Then merge the parts and put a short summary at the top: counts per severity, and the lessons that need work first.

## Review one lesson

Start with `node .claude/skills/lesson-review/scripts/lesson.mjs <slug>`. It prints where the lesson sits (chapter, earlier lessons, its demo), the body, the story, each resource with the line the lesson claims about it, and the quiz with the key marked `*`. Read the raw file it names too if you need the exact text around a passage. Then do a quick first read, then the four checks.

### First read: what a careful editor would circle

Before going deep on any one thing, read the whole lesson once and mark three kinds of sentence. The deep checks below tend to tunnel into the numbers and the quiz, and these are what they miss:

- **Absolutes.** "never", "always", "nothing", "every", "guaranteed", "only". Each is either true or an overstatement a newcomer will take literally. Check each one against the lesson's own mechanism (does anything in the system undo it? is there an exception the lesson mentions elsewhere?).
- **Vague attributions.** "Government reports", "researchers predicted", "studies show", "experts agree". Either name the source (which report, who, when) or hedge the claim.
- **A term used two ways.** The same word defined or used with two different meanings in one lesson (common when a lesson quotes a paper that uses a word differently). The reader cannot tell which meaning a later sentence uses.

### 1. Accuracy

- Recompute every number in worked examples, tables and quiz explanations. Arithmetic slips are the most common real error and the easiest to prove.
- For each factual claim that matters to the lesson (dates, who did what, how a system behaves, what a default is), check it against the lesson's linked resources first: fetch the page with WebFetch and find the passage. If the resources do not cover it, use what you know, and say so.
- Open every resource, not just the ones you suspect, and check two things. Does the page say what the claimed line and the body say it says? And do the title, author and publisher the lesson gives (in the resource line and in any body sentence that cites it, such as "the AWS Builders' Library says") match what the page itself shows in its header or byline? A page that loads but is about something else, or is credited to the wrong source, is a finding: the repo's rule is never to claim a resource says what we have not read. Quote the page's own byline in the evidence, and copy the source's real name into your fix.
- PDFs (papers, specs) will not read through WebFetch. Download one with `curl -sL -o <scratchpad>/<name>.pdf <url>`, then run `pdftotext -layout <file> -` and search the text for the section the lesson cites (the Read tool can also open PDFs, using the same poppler install). If `pdftotext` is missing, do not write your own extractor: papers use embedded font encodings and hand-rolled stream decoding returns garbage. List the PDF under "Could not verify" with "install poppler (`brew install poppler`) to check it", and mark the claims that rest on it inferred.
- A page you cannot fetch is not, by itself, a broken link. Publishers and PDF hosts often refuse scripted requests (403, 429, 503, a login wall) while opening fine in a browser. If WebFetch fails, try `curl -sIL -A 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/605.1.15 Version/17.0 Safari/605.1.15' <url>`. Only a 404 or 410, a dead domain, or a redirect to an unrelated page counts as **wrong**. Anything else goes in the report's "Could not verify" list with the claims that depended on it, and those claims are marked inferred.
- Mark each accuracy finding **proven** (you found the source passage or recomputed the number, and you quote it) or **inferred** (from your own knowledge, the source was silent). Never present an inferred error as proven. If you could not settle a claim, say what would settle it.

### 2. Beginner test

Read as the newcomer described above. Note:

- A technical word used before it is explained, unless an earlier lesson in the chapter explains it or it is in the track glossary (`grep -i '^<word>' <glossary path>`; the glossary turns it into a popover).
- A step the text skips: a formula with no worked number, a jump from "what it is" to "how to tune it", a "so" that does not follow.
- Math without a worked example with real numbers.
- A paragraph whose point you can only get if you already knew it.

### 3. Quiz

For each question, using only the lesson's own text:

- Is the keyed answer clearly right, and is every other option clearly wrong? A distractor that the lesson's own words make defensible (an edge case the lesson itself mentions, a "usually" the question ignores) is the most important quiz finding.
- Does it test understanding, or just recall of a phrase? Prefer questions that make the learner apply the idea.
- Can it be answered without reading the lesson (the key is the only sensible-sounding option, or visibly longer and more specific)?
- Is the `why` correct and does it explain, not restate?

### 4. Fit

- Story: does the scenario actually map onto the concept, or only share a keyword with it? A story that would make a newcomer expect the wrong behaviour is a real finding.
- Diagrams (```mermaid fences, caption on the fence line): does the drawing show what the caption and the surrounding text say?
- Demo: if the lesson has one, skim the component in `site/src/components/<track>/` that `Explainers.jsx` maps it to. Does it demonstrate this lesson's idea with the same terms?
- "Common mistake" and "What goes wrong": is it a mistake people really make, specific enough to recognise in your own work?

## Severity

- **wrong**: false, a miscalculation, a dead or mismatched resource, a quiz with a wrong or ambiguous key. Fix before anything else.
- **confusing**: a newcomer would likely get lost or take away the wrong idea.
- **weak**: correct and followable, but a concrete change would teach noticeably better.

Leave out matters of taste. Five real findings beat twenty nits; a lesson with no findings is a valid result, so say so plainly rather than inventing some.

## Report

Write Markdown to the path you were given, or else `lesson-review-<YYYY-MM-DD>.md` in the scratchpad directory, and tell the user the path. One section per lesson:

```markdown
## <track>/<chapter>/<slug>: <title>
Verdict: <one sentence: ship as is, fix the wrong items, or rework>

1. **wrong** (accuracy, proven) "<exact quote from the lesson>"
   Problem: <what is wrong, in one or two sentences>
   Evidence: <the recomputation, or the source URL and the passage that contradicts it>
   Fix: <the replacement text, written in the lesson's own plain style>

Checked and fine: <numbers recomputed, sources read, claims confirmed, one line each>
Could not verify: <sources that would not load, with the claims that rest on them; omit if none>
```

The "Checked and fine" line matters as much as the findings: it tells the author what no longer needs a look. Quote the lesson exactly so the finding can be located with a search. Write the fix as text that could be pasted in, not advice like "clarify this". Follow the repo's writing rules in the fix and the report: plain words, no em dashes, define any term on first use.

Do not edit lesson files. The report is for the author to triage; apply fixes only when asked, and then run `npm run verify` from `site/`.
