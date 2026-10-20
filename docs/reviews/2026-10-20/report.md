# AI track quality review, re-run 2026-10-20

Reviewer: Sonnet 5.5 subagent (127 tool calls), prompt in `docs/prompts/ai-track-quality-review.md`. The agent could not write this file, so this is a condensed copy of its report with the follow-up checks added. Screenshots are in `shots/` (desktop `d-`, mobile `m-`). Labels: **Proven** means seen in a file, measurement or fetched source. **Inferred** is a judgment.

## Scores

| Area | Score | Notes |
|---|---|---|
| Content | 3.4 of 5 | The 18 older chapters went from 3.17 to 3.39. No chapter scores 5. Nine score 4. |
| UX | 4 of 5 | Axe passed on 11 of 13 page types. The two failures were code-block colors, now fixed. |
| Components | 4 of 5 | 24 shared components, `check-ui` passes. |

Strongest chapters: Building Blocks, Embeddings & Retrieval, From Prompts to Harnesses. Weakest: Creative & Applied (2), The Tooling Landscape, Build Projects.

## What the first review found, and where it stands

Fixed: duplicate sections, term popovers, numbered steps, most numeric errors, keyboard stepper, library length, chapter numbering, goal filter on all tabs, lesson header, softmax demo, audience gaps (Everyday and Applied AI chapters), imported chapter cut from 18 to 8 lessons.

Still open: quiz answers guessable by length (the keyed option is the longest in 72 percent of 402 questions, key positions are balanced), no report-an-error link, two sticky bars on mobile, touch targets under 44 px in places, inline formulas in prose are plain text, no permissions lesson for coding agents.

No functional regressions.

## Findings and what was done

| # | Finding | Check | Result |
|---|---|---|---|
| 1 | Forecast example in `forecasting-and-fraud` used a day-1 baseline that does not exist | Recomputed: baseline errors on days 2 and 3 are 20 and 10, mean 15, model 5 and 10, mean 7.5 | **Fixed** |
| 2 | "Both skipped checking" was wrong for Amazon: Reuters reports the team found the bias and shut the project down | Agent used search summaries of republished Reuters copies. Reuters and CNBC fetches were blocked. | **Fixed** |
| 3 | FDA and FTC links return 404 and the link checker hides this | FDA loads in a real browser (it redirects to a new URL) and was updated to the final URL. FTC blocks bots in a browser too, so it is **unverified**. | FDA fixed. FTC still unverified. |
| 4 | Quiz answers are the longest option in 72 percent of questions | Agent script | **Open** |
| 5 | ChatGPT "100 million users" was a UBS estimate of monthly users. Hugging Face model count is stale. The open-models example ignores engineer time. | Read in files | **Fixed**: hedged, "well over a million", example reworded |
| 6 | Map detail panel is 1,100 px below the map with no scroll | Retested: clicking a chapter scrolls the panel to 137 px from the top of the window | **Disproved** |
| 7 | Adam EMA example said 0.206 "follows the trend" (raw mean 0.575) | Recomputed: 0.206 / (1 − 0.9^4) = 0.60 | **Fixed**: explains the start-at-zero correction |
| 8 | Code blocks fail contrast: orange 3.48:1 (light), comment grey 3.61:1 (dark) | Reproduced with axe | **Fixed** in `global.css`, 0 violations in both themes |
| 9 | Touch targets and sticky bars on mobile | Measured by agent | **Open** |
| 10 | Applied AI reuses filler resources, no demo, missing glossary terms | Read in files | **Open** |

## Applied AI stories

| Story | Confirmed by the agent | Changed |
|---|---|---|
| Netflix Prize | Dates, winner and the 2012 "did not justify the engineering effort" quote. "More than a hundred models" was not confirmed. | Now "a blend of many models" |
| Zillow Offers | Wind-down Nov 2021, $304M Q3 write-down, hundreds of millions of losses. "Model was good on past data" has no source. | Removed that sentence |
| Amazon recruiting tool | Reuters 2018, biased scoring, project shut down | Sentence rewritten (finding 2) |
| New York lawyers | Mata v. Avianca, June 2023, six fake cases, $5,000 sanction | Added "$5,000" and "and their firm" |
| Air Canada | Moffatt v. Air Canada, Feb 2024, chatbot gave wrong refund advice | Reworded to "ordered to pay a customer who relied on wrong refund advice" |

The primary Reuters, Netflix and SEC texts were not opened by the agent, so these are confirmed through secondary sources only.

## Code samples (checked by the maintainer, not the agent)

All 9 Python snippets ran against a fake Messages API with the real `anthropic` SDK. One failed: the MCP server used `FastMCP`, which `mcp` version 2 renamed to `MCPServer`. Fixed and run through a real MCP client. No live API call was made.

## Backlog still open

Quiz option lengths (large), touch targets and the second sticky bar, quiz card layout and a score line, a permissions and first-session lesson for coding agents, Applied AI demo and resources, project rubrics and honest durations, a report-an-error link, indexing stories in search (searching "zillow" finds nothing), new `check-ui` and lint rules (keyed option not the longest in more than half of a chapter's questions, `check-links` failing on any 404).

## Not done by the review

Lessons from only 6 of 20 chapters were opened in a browser. Axe was not run on mobile. Roadmap.sh was not reopened. Fewer than five fresh fact checks were made for chapters 1 to 4, 6, 9, 11, 12 and 15 to 20.
