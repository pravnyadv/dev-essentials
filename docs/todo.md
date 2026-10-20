# To do

## Free AI articles section

Build a section that lists all the important free AI articles in one place, so a reader can browse the best free reading without opening a lesson first.

Notes for when this is picked up:

- The Resource library (`/ai/library`) already lists every link cited in the lessons, filterable by type and chapter. This section is a hand-picked reading list, not a duplicate of it.
- Decide how entries are stored. The existing pattern is a data file under `site/authored/ai/data/` that the build reads, so it can be updated without touching code.
- Each entry needs a title, author, link, a one-line reason to read it and the lesson it pairs with.
- Only free articles. Check that each link loads without a paywall or login (`npm run links` checks the URLs).
