# Third-party material

The DSA track and one AI chapter are built from MIT-licensed projects. Their sources are not
committed here. `npm run content` clones them into `vendor/` and the build converts them.
The System Design track adapts text from two CC BY 4.0 projects; the adapted lessons are committed
in `site/authored/sd/`.

| Project | Used for | License |
| --- | --- | --- |
| [trekhleb/javascript-algorithms](https://github.com/trekhleb/javascript-algorithms) | DSA track topic text and code (Copyright (c) 2018 Oleksii Trekhleb) | MIT |
| [dair-ai/Prompt-Engineering-Guide](https://github.com/dair-ai/Prompt-Engineering-Guide) | AI chapter "Prompting Techniques Reference" (Copyright (c) 2022 DAIR.AI) | MIT |
| [donnemartin/system-design-primer](https://github.com/donnemartin/system-design-primer) | System Design lessons marked "adapted from The System Design Primer" (Copyright 2017 Donne Martin) | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) |
| [MicrosoftDocs/architecture-center](https://github.com/MicrosoftDocs/architecture-center) | System Design lessons marked "adapted from Azure Architecture Center (Microsoft)": cloud design patterns, performance antipatterns, monitoring and background jobs (Copyright Microsoft Corporation) | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) |

The MIT notice of each project applies to the material taken from it: permission to use, copy,
modify and distribute is granted provided the copyright and permission notice is included.

Microsoft's license covers its documentation text, not its names or trademarks; the lessons are vendor-neutral and
not endorsed by Microsoft. Adapted System Design lessons were rewritten, reorganised and extended (worked examples, failure cases,
quizzes and stories added). Each one says so under the lesson and links the source and license.
[ByteByteGo system-design-101](https://github.com/ByteByteGoHq/system-design-101) and
[karanpratapsingh/system-design](https://github.com/karanpratapsingh/system-design) are CC BY-NC-ND 4.0, and
[ashishps1/awesome-system-design-resources](https://github.com/ashishps1/awesome-system-design-resources) is GPL-3.0:
they were read for comparison and are linked as resources, but none of their text is copied.

The AI lessons, stories, quizzes and curated resource lists are original work covered by this
repository's [LICENSE](../LICENSE). Linked articles, videos, papers and courses belong to their authors.
[roadmap.sh](https://roadmap.sh/ai-engineer) is used only as a checklist of topics (`npm run coverage`).
None of its content is copied, because its license does not allow reuse.
