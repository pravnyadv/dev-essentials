# design-framework | A Framework for Any Design | 1 | 12
Every design question, in an interview or at work, goes faster with the same four steps: pin down what you are building, sketch the boxes, dig into the hard parts, then find the bottleneck and fix it. This lesson also covers how to spend 45 minutes, how to state assumptions, and how a real design document differs from an interview answer.

## The four steps
The System Design Primer, a popular open-source study guide, describes an interview as an open-ended conversation that you are expected to lead. It gives four steps. Each one builds on the earlier lessons in this track.

1. Outline use cases, constraints and assumptions. Ask who uses the system, how they use it, how many users there are, what goes in and out, how much data there is, how many requests per second, and the read to write ratio.
2. Create a high level design. Sketch the main components and the connections between them, and justify each one.
3. Design the core components. Go deep on the two or three parts that are hard for this problem. For a URL shortener that means generating keys and mapping a short key back to the long URL.
4. Scale the design. Find the bottlenecks given your numbers, then fix them with the tools from earlier chapters.

```mermaid The four steps run in order, and a bottleneck found in step 4 sends you back to step 2 or 3
flowchart TD
  A[Use cases and numbers] --> B[High level design]
  B --> C[Core components]
  C --> D[Scale and fix]
  D -.-> B
```

Step 1 is where most weak answers fail. If you draw boxes before you know the numbers, you cannot tell whether one database is enough or whether you need [sharding](/sd/docs/data/sharding).

## Requirements and assumptions
Split requirements in two. Functional requirements are what the system does: "a user posts a message and followers see it". Non-functional requirements are how well it does it: fast reads, high availability, no lost messages, tolerate some stale data.

Then make assumptions out loud and attach a number to each. "Assume 10 million new items a month" is something the interviewer can accept or correct. "Assume lots of traffic" is not. Label every number as an assumption so nobody mistakes it for a fact. If you are unsure, ask a question first and assume only when the answer is "your call".

A good first question is which features are out of scope. Cutting logins, search or editing early frees time for the interesting parts. Palantir's interview guide says the solution matters less than the thought process behind your choices, and that candidates are expected to steer the conversation.

## Time budget
A typical slot is 45 minutes. One split that works:

| Minutes | Step |
| --- | --- |
| 0 to 5 | Use cases, scope, questions |
| 5 to 10 | Estimates (see [back-of-the-envelope](/sd/docs/foundations/back-of-envelope)) |
| 10 to 20 | High level design and the API |
| 20 to 35 | Deep dives on two or three hard parts |
| 35 to 43 | Bottlenecks, scaling, failure cases |
| 43 to 45 | Summary and open risks |

The split is a guide. If the interviewer pulls you into one area, follow them, because they are telling you what they care about. State that you will come back to the rest.

## How real design docs differ
At work you rarely have 45 minutes and a stranger. You have days, real data and teammates who know the old system. Malte Ubl's post on design docs at Google lists a common structure: context and scope, goals and non-goals, the actual design, alternatives considered, and cross-cutting concerns such as security, privacy and observability. Non-goals matter as much as goals. They are things you could reasonably do but chose not to, such as full ACID transactions for a new store.

Ubl suggests the sweet spot for a large project is about 10 to 20 pages. He also warns against pasting full schemas or API definitions, because they go stale. Describe only the parts that drive trade-offs. The doc is also reviewed by other people, which catches missed concerns early when changes are still cheap.

So the interview is a compressed version. You skip the alternatives that nobody will read, but the habit is the same: state goals, make trade-offs visible, and say why you rejected the other option.

## A worked example: estimating before drawing
Invented prompt: design a photo-sharing service. You ask questions and the interviewer says: 20 million users, 10 percent upload one photo a day, each photo averages 2 MB, and each user views 50 photos a day.

1. Uploads per day: 20 million times 10 percent is 2 million. Per second, divide by about 100,000 (a day has 86,400 seconds, so 100,000 is a handy round number): about 20 uploads per second.
2. Storage per day: 2 million photos times 2 MB is 4 TB. Per year that is about 1.5 PB.
3. Views per day: 20 million times 50 is 1 billion. That is about 10,000 views per second.
4. Read to write ratio: 10,000 to 20, so about 500 to 1.

Now the design nearly writes itself. 20 uploads per second is easy for a few servers. The 1.5 PB a year says photos go in an object store, not a database. The 10,000 reads per second at a 500 to 1 ratio says a [CDN](/sd/docs/scaling/cdn-and-edge) and caching do most of the work. Four lines of arithmetic told you where to spend the time.

## What goes wrong: designing without numbers
A candidate hears "design a chat app" and starts with a database choice and microservices. Twenty minutes in, the interviewer asks how many users. The answer is 50,000, and the whole design is far bigger than needed. The symptom is a diagram with many boxes and no figure next to any of them. At work the same thing produces a system that costs ten times what it should. You confirm it by asking, for each box, which number made you add it. If you cannot name one, remove the box.

## When the framework is the wrong tool
The framework fits open-ended greenfield questions. It is the wrong tool when the problem is already constrained. If you must add a feature to a legacy system, the work is reading the existing system, finding what cannot change, and choosing the smallest safe step. Ubl calls this the degree of constraint. A design from a blank page and a design inside a tangle of old decisions need different documents. Debugging an outage is also not a design exercise. Follow the evidence first.

## Common mistake
Spending 30 minutes on a perfect diagram of the easy parts and never reaching the hard part of the problem.

```resources
article | How to approach a system design interview question | https://github.com/donnemartin/system-design-primer#how-to-approach-a-system-design-interview-question | Donne Martin | The four steps this lesson adapts, with the questions to ask in step 1.
article | Design Docs at Google | https://www.industrialempathy.com/posts/design-docs-at-google/ | Malte Ubl | Explains the usual sections of a design doc, goals versus non-goals, and why 10 to 20 pages is the sweet spot.
article | How to rock a systems design interview | https://web.archive.org/web/20210505130322/https://www.palantir.com/2011/10/how-to-rock-a-systems-design-interview/ | Palantir | A hiring team says the thought process matters more than the final design and that you steer the conversation.
article | Google Pro Tip: Use Back-of-the-Envelope Calculations to Choose the Best Design | http://highscalability.com/blog/2011/1/26/google-pro-tip-use-back-of-the-envelope-calculations-to-choo.html | High Scalability | Shows why estimating before building tells you which design can work.
```

```quiz
Why does the framework put use cases and numbers before any drawing? | Numbers decide which components are needed at all ; Interviewers always grade the drawing last ; Diagrams are hard to draw without a ruler | 0 | Without numbers you cannot tell whether one database is enough or you need sharding.
In the photo example, 4 TB of new photos per day mostly tells you to use what? | A relational database with a big disk ; An object store for the photo files ; A larger application server fleet | 1 | Petabytes of binary files belong in an object store, not in database rows.
Which section of a design doc lists things you could do but chose not to? | Non-goals ; Alternatives considered ; Context and scope | 0 | Ubl defines non-goals as reasonable goals that are explicitly dropped, such as ACID compliance.
```

```story
A candidate is asked to design a ride-hailing app and starts drawing Kafka and ten services at minute two. At minute twenty the interviewer asks how many rides per second. Nobody has worked it out. It is 40, which one server and one database could handle, and the whole diagram is wrong for the problem.
```

```adapted
The System Design Primer | https://github.com/donnemartin/system-design-primer | CC BY 4.0
```

# url-shortener | Design a URL Shortener | 2 | 15
A URL shortener turns a long link into a short key and redirects anyone who visits the key. The hard parts are generating unique keys, serving a lot of reads fast, and deciding what the redirect means for analytics.

## Use cases and constraints
This design follows the Primer's "Design Pastebin.com (or Bit.ly)" solution. A pastebin stores text contents; a shortener stores the original URL instead. The structure is the same, so we write it for the shortener.

Functional requirements, in scope:

1. A user submits a long URL and gets a short link. They may set an expiry. The default is never.
2. A user opens the short link and is sent to the long URL.
3. The service tracks monthly visit counts per link. These do not need to be realtime.
4. The service deletes expired links.

Out of scope: accounts, editing links, and custom short names. Non-functional: following a short link must be fast, traffic is uneven, and the service should be highly available.

## Estimates
The Primer assumes 10 million users, 10 million writes a month and 100 million reads a month, so reads outnumber writes 10 to 1. Each record is about 1.27 KB in the Primer's pastebin (1 KB of content plus a 7 byte key and some metadata). For a shortener the stored URL is smaller, but we keep its numbers.

1. New data: 1.27 KB times 10 million is 12.7 GB a month, or about 450 GB in three years.
2. Keys: 10 million a month for 36 months is 360 million short links.
3. Writes per second: 10 million divided by about 2.5 million seconds in a month is 4.
4. Reads per second: 100 million divided by 2.5 million is 40.

Those are averages. Peaks can be several times higher, so plan for a few hundred reads a second. This is small. A single well-run database could serve it, which is why the design leans on one idea: a cache plus replicas for reads. See [back-of-the-envelope](/sd/docs/foundations/back-of-envelope) for the habit.

## API and data model
The Primer uses a public REST API (see [API design](/sd/docs/foundations/api-design)):

```
POST /api/v1/paste   { "expiration_length_in_minutes": 60, "paste_contents": "Hello World!" }
response:            { "shortlink": "foobar" }
GET  /api/v1/paste?shortlink=foobar
```

For a shortener, the POST body carries `url` instead of contents and the GET is the redirect itself. The table is one row per link:

| Column | Notes |
| --- | --- |
| shortlink | 7 characters, primary key, which creates an index that also enforces uniqueness |
| expiration_length_in_minutes | integer |
| created_at | datetime |
| original_url or paste_path | the long URL, or in the pastebin a pointer to an object store file |

The Primer treats the [relational database](/sd/docs/data/sql-vs-nosql) as a large hash table from key to value and notes a key-value NoSQL store is an alternative.

## High level design
In words: the client reaches a web server acting as a reverse proxy. Writes go to a Write API, which creates a key and saves the row. Reads go to a Read API, which looks up the key, using a memory cache first and a SQL read replica on a miss, and returns the redirect. A separate analytics job reads the web server logs. A cleanup job deletes expired rows.

```mermaid Writes create a key and save a row; reads try the cache before a replica
flowchart TD
  C[Client] --> W[Web server]
  W -->|create| WA[Write API]
  W -->|redirect| RA[Read API]
  WA --> DB[(SQL primary)]
  DB -.->|copies| R[(SQL replica)]
  RA --> M[Memory cache]
  M -.->|miss| R
  W -.->|logs| A[Analytics job]
  CJ[Cleanup job] --> DB
```

## Generating the key
Primer approach: take the MD5 hash of the user's IP address plus a timestamp, base62 encode it, and keep the first 7 characters. Base62 means the digits 0 to 9 and the letters a to z and A to Z, so 62 symbols that are safe in a URL. Base64 adds `+` and `/`, which need escaping. Seven characters give 62 to the power of 7, about 3.5 trillion keys.

Three ways to get keys, and what each costs:

| Method | Good | Bad |
| --- | --- | --- |
| Hash and truncate | No coordination, stateless | Collisions, must check and retry |
| Counter, then base62 encode | No collisions, short keys | Guessable order, one counter to scale |
| Pre-generated key blocks | Fast writes, no check | A key service to run |

A counter hands out 1, 2, 3 and so on, and base62 encoding turns the number into a short string. To avoid one hot counter, each Write API server asks a small key service for a block, for example 1,000 numbers at a time, and hands them out locally. If a server crashes it loses at most the rest of its block, which is fine because the key space is huge. Guessable keys leak how many links exist. If that matters, shuffle the number with a keyed permutation before encoding.

```mermaid Each Write API server takes a block of numbers once, then hands them out with no network call
sequenceDiagram
  participant S as Write API
  participant K as Key service
  participant DB as Database
  S->>K: give me a block
  K-->>S: numbers 5001 to 6000
  Note over S: hand out 5001, 5002 and so on locally
  S->>DB: save the row under base62 of 5001
  Note over S,K: if S crashes, its unused numbers are only skipped
```

## 301 or 302
A redirect needs a status code. A 301 means the resource has a new permanent URI and later references ought to use it, and browsers and caches may remember it. A 302 means the move is temporary, so the client should keep using the original link next time. If you use 301, repeat visits may never reach you, so your visit counts undercount. If you need analytics or the ability to change a destination, use 302. If you want less load and the link never changes, 301 saves requests. The HTTP specification (RFC 9110) defines both.

## Expiry and analytics
The Primer's cleanup is a scan for rows whose expiry is older than now, deleting or marking them. Reads should also check the expiry, so an expired link never redirects while it waits for cleanup. Analytics follow the Primer: realtime counts are not required, so run a MapReduce job (a batch job that counts in parallel) over the web server logs, producing pairs like (2016-01, url0) with a total. A data warehouse such as BigQuery can store results.

## A worked example: collisions and cache
Collisions with truncated hashes. The space has about 3.5 trillion keys and the design holds 360 million. When a new link is created at the end, the chance that its random key is already taken is 360 million divided by 3.5 trillion, about 0.01 percent. That is 1 in 10,000, so a check and one retry is rare and cheap. Across all inserts over three years, roughly 18,000 retries happen. That is not a problem, only a reason you must check the database for a duplicate, as the Primer does.

Cache sizing (invented hit rate). Say peak is 400 reads per second. If the cache serves 90 percent, the database sees 40 per second. To hold the hottest data, cache 1 million links at about 500 bytes each. That is 500 MB, easily one Redis node. See [caching basics](/sd/docs/caching/caching-basics).

## What goes wrong: a hot key on a viral link
One link is shared by a celebrity and gets 20,000 reads a second. The cache entry is hot, and if it expires, thousands of requests miss at once and hit the database for the same row. The symptom is database latency spikes that line up with one key's expiry. Confirm by logging the top keys per minute. The fix is to refresh that key before it expires, coalesce concurrent misses so only one goes to the database, and let a [CDN](/sd/docs/scaling/cdn-and-edge) hold the redirect if you use 301 or a short cache lifetime. See [cache invalidation](/sd/docs/caching/cache-invalidation).

## Scaling the design
The Primer says not to jump to the final design. Load test, profile, fix the worst bottleneck and repeat. Here the order is: a memory cache for popular links, read replicas for misses, an object store for large content, and a [load balancer](/sd/docs/scaling/load-balancing) with several web and API servers. 4 writes per second fit one write master with a standby. If writes grow far past that, add [sharding](/sd/docs/data/sharding) by key, or move to a key-value store.

## Alternatives considered
Three choices could have gone another way. A key-value store fits the table well, since the only lookup is by key, and it shards easily. At 4 writes a second we keep SQL, which most teams already run, and would move to a key-value store only if writes outgrew one primary. Hashing and truncating needs no key service, but it needs a duplicate check on every write. Counter blocks cost one small service and need no check.

The third choice is no cache. At the average of 40 reads per second a database alone would cope, and the cache earns its place only through peaks of a few hundred a second and hot links. At 40,000 reads a second, going without one is the wrong tool, because every redirect becomes a query for data that almost never changes. Counting visits with a database update per click is also wrong, since it turns the read path into a write path. Log the click and aggregate later.

```card URL Shortener
Requirements | Create short links with an optional expiry, redirect fast, count visits monthly, delete expired links and stay highly available.
Scale | The Primer's assumptions give about 4 writes and 40 reads per second, 360 million links and roughly 450 GB in three years.
Key decision | Counter blocks encoded in base62 for keys, a memory cache and read replicas in front of one SQL primary, and a 302 redirect when you need visit counts.
Main risk | One viral link expiring from the cache sends thousands of identical queries to the database at once.
```

## Common mistake
Using 301 and then wondering why click counts are far below the real traffic.

```resources
article | Design Pastebin.com (or Bit.ly) | https://github.com/donnemartin/system-design-primer/tree/master/solutions/system_design/pastebin | Donne Martin | The solution this lesson adapts, with the same assumptions, key generation, schema and scaling notes.
article | Shortening Strings (URLs) using Base 62 Encoding | https://www.kerstner.at/2012/07/shortening-strings-using-base-62-encoding/ | Matthias Kerstner | Explains base62 as a two-way mapping between a string and a short hash, linked from the Primer.
docs | RFC 9110, HTTP Semantics: 301 and 302 | https://www.rfc-editor.org/rfc/rfc9110 | IETF | Defines 301 as a permanent move that clients should use from then on, and 302 as a temporary one.
```

```quiz
A site needs click analytics and the right to change a link's target later. Which redirect fits? | 302, so requests keep coming to you ; 301, so browsers remember the target ; Neither, because redirects cannot be used | 0 | A 302 is temporary, so clients come back and you can count clicks and change the target.
The key space is 3.5 trillion and 360 million are used. About what share of new random keys collide? | 0.01 percent ; 10 percent ; Exactly zero | 0 | 360 million divided by 3.5 trillion is about 0.0001, so one in 10,000.
Why hand each API server a block of 1,000 counter values? | It makes keys impossible to guess for users ; It shortens every key by a character ; It avoids asking one central counter on every write | 2 | Local blocks remove the single counter from the write path, and a crash only wastes some unused numbers.
```

```story
A founder shares a short link on a podcast with two million listeners. Every listener opens it within an hour, the link's cache entry expires mid-spike, and the database falls over under identical requests. The link shortener had been fine for a year at 40 reads a second. One hot key broke it.
```

```adapted
The System Design Primer | https://github.com/donnemartin/system-design-primer | CC BY 4.0
```

# news-feed | Design a News Feed | 3 | 15
A news feed shows each user the recent posts from the people they follow. The central question is when to do the work: when someone posts (fan-out on write) or when someone reads (fan-out on read).

## Use cases and constraints
This follows the Primer's "Design the Twitter timeline and search (or Facebook feed and search)" solution. In scope: a user posts a message, a user views their home timeline (posts from people they follow), a user views their own timeline, a user searches by keyword, and the service sends push notifications to followers and has high availability. Analytics are out of scope.

Assumptions from the Primer: traffic is uneven, posting should be fast (fanning out should be fast unless the poster has millions of followers), viewing the timeline should be fast, reads outnumber writes, and so we optimize reads.

## Estimates
The Primer assumes:

| Quantity | Value |
| --- | --- |
| Active users | 100 million |
| Posts per day | 500 million (15 billion a month) |
| Average fan-out | 10 deliveries per post |
| Deliveries per day | 5 billion (150 billion a month) |
| Read requests | 250 billion a month |
| Searches | 10 billion a month |
| Size per post | about 10 KB with media |

Using 400 requests per second for every 1 billion requests a month:

1. New content: 10 KB times 500 million times 30 days is 150 TB a month, about 5.4 PB in three years.
2. Reads: 250 billion a month is about 100,000 per second.
3. Posts: 15 billion a month is about 6,000 per second.
4. Fan-out deliveries: 150 billion a month is about 60,000 per second.
5. Searches: 4,000 per second.

Notice that one post becomes 10 deliveries on average. Writes are amplified, and reads dominate anyway.

## API and data model
Following the Primer's REST style:

```
POST /api/v1/tweet          { user_id, auth_token, status, media_ids }
GET  /api/v1/home_timeline?user_id=123
GET  /api/v1/search?query=hello+world
```

A user's own posts live in a [relational database](/sd/docs/data/sql-vs-nosql). Media goes to an object store. The home timeline for each user lives in a memory cache. In Redis it is a list, newest first, whose entries hold a post id (8 bytes), a user id (8 bytes) and 1 byte of metadata. Redis lists can be capped so only the newest N items are kept, which is what a timeline needs.

## High level design
Posting: the client calls the web server, which forwards to a Write API. The Write API stores the post in the author's timeline in SQL, then calls a Fan Out Service. The fan-out service asks the User Graph Service for the follower list, inserts the post id into each follower's cached home timeline (1,000 followers means 1,000 inserts), sends the post to a search index, stores media, and queues push notifications.

Reading: the client calls a Read API, which asks a Timeline Service. It reads the timeline entry list from the cache, which holds only ids. It then fetches the post bodies and user details with multiget calls (one request for many keys) to the Tweet Info and User Info services. See [caching patterns](/sd/docs/caching/cache-patterns) and [message queues](/sd/docs/async/message-queues).

```mermaid Posting writes once and fans out into cached timelines; reading is one cache lookup
flowchart TD
  C[Client] --> WA[Write API]
  WA --> SQL[(Posts in SQL)]
  WA --> FO[Fan Out Service]
  FO -->|who follows| UG[User Graph Service]
  FO -->|insert post id| TC[(Timeline cache)]
  FO --> SI[Search index]
  FO --> N[Notification queue]
  C --> RA[Read API]
  RA --> TS[Timeline Service]
  TS --> TC
```

## Fan-out on write or on read
Fan-out on write, which the Primer chooses, does the work at post time. Reading is one cache lookup. The cost is write amplification, and wasted work for followers who never log in.

Fan-out on read keeps one list of posts per author. When you open the feed, the service fetches recent posts from everyone you follow and merges them. Posting is cheap, but a read touches hundreds of authors, which is slow when reads are 100,000 a second.

## The celebrity problem and the hybrid
The Primer notes the fan-out service becomes a bottleneck. A user with millions of followers can take several minutes to fan out, which can reorder replies relative to the post, which can be mitigated by re-ordering at serve time. The Primer's remedy is to skip fan-out for highly followed users. At read time, fetch their recent posts, merge them with the cached timeline and sort. That is the hybrid: push for normal accounts, pull for celebrities. The cutoff (say 100,000 followers) is a tuning knob.

```mermaid Hybrid read: the cached timeline is merged with recent posts from the celebrities the reader follows
sequenceDiagram
  participant R as Reader
  participant T as Timeline Service
  participant C as Timeline cache
  participant P as Post store
  R->>T: open home timeline
  T->>C: get cached post ids
  C-->>T: ids from normal accounts
  T->>P: recent posts of followed celebrities
  P-->>T: celebrity posts
  Note over T: merge and sort by time
  T-->>R: one ordered page
```

## Pagination and ranking
Do not paginate with `offset=20`. New posts arrive constantly, so page 2 repeats items from page 1. Use a cursor: return the post id (or time and id) of the last item, and ask for items older than it. The result is stable while the feed grows. Ranking can start as newest first. Real feeds score posts by signals such as relationship and engagement, but a simple, explainable order is the right first version.

## A worked example: the celebrity post
Use the Primer's rate of 60,000 fan-out deliveries a second for the whole service. An account with 10 million followers posts.

1. Deliveries needed: 10 million cache inserts.
2. Time at full capacity: 10 million divided by 60,000 is about 170 seconds, nearly 3 minutes.
3. In practice the fan-out service is shared, so it takes longer, and everyone else's posts queue behind it.

With the hybrid, that post costs one insert into the author's own list. A reader who follows 5 celebrities does 5 extra lookups and a merge of a few hundred items, which is milliseconds.

Try these numbers in the demo above.

Cache size (our estimate, cap of 300 entries): 300 times 17 bytes is about 5 KB per user. For 100 million users that is 510 GB, so keep only active users in the cache, as the Primer suggests.

## What goes wrong: a stampede of cold timelines
After a cache outage or a launch, millions of users open the app and their timelines are not cached. Each one triggers a rebuild: find followed accounts, query SQL for their posts, merge and write back. The database falls over. Symptoms are low cache hit rate, SQL read latency climbing and timeouts. Confirm by watching hit rate and the rebuild rate. The Primer's answer for inactive users is to rebuild from SQL on demand. Add a limit on concurrent rebuilds, warm the cache for active users first, and use [timeouts and retries](/sd/docs/reliability/timeouts-and-retries) with backoff so retries do not pile up.

## Scaling the design
The Primer's list: keep only a few hundred posts per timeline, keep only active users' timelines in cache (if a user was inactive for 30 days, rebuild from SQL), store only a month of posts in the Tweet Info service, and keep the search cluster in memory. One SQL master cannot take the write volume, so use read replicas, [sharding](/sd/docs/data/sharding), and a move of some data to NoSQL. The fan-out itself should run behind a queue so a slow follower list never blocks posting. For a related design problem see the [social graph](/sd/docs/practice/social-graph) practice lesson.

## Alternatives considered
| Design | Cost of a post | Cost of a read | Fits when |
| --- | --- | --- | --- |
| Fan-out on write for everyone | One insert per follower | One cache lookup | Follower counts are modest |
| Fan-out on read for everyone | One insert | A merge across every followed author | Reads are rare or the user base is small |
| Hybrid (chosen) | Inserts for normal accounts only | One lookup plus a few celebrity merges | Reads dominate and a few accounts are huge |

Fan-out on read at 100,000 reads a second, each touching about 300 authors, means 30 million author lookups a second, so it loses here. Pure fan-out on write loses to the celebrity post in the worked example. A small system can skip all of this and run a simple join query. Feeds ranked by real-time signals resist precomputation, because the order changes on each read. For those, fetch candidates and rank at read time.

```card News Feed
Requirements | Post a message, view the home timeline and your own, search by keyword, send push notifications and stay highly available.
Scale | The Primer's assumptions give about 6,000 posts, 60,000 fan-out deliveries and 100,000 reads per second, and 5.4 PB of new content in three years.
Key decision | Fan out on write into cached id lists for normal accounts, and merge celebrity posts at read time.
Main risk | A cold or lost cache makes millions of timelines rebuild from SQL at once, and one celebrity post can clog the fan-out queue.
```

## Common mistake
Choosing fan-out on write for everyone and forgetting that one account with ten million followers turns a single post into ten million writes.

```resources
article | Design the Twitter timeline and search (or Facebook feed and search) | https://github.com/donnemartin/system-design-primer/tree/master/solutions/system_design/twitter | Donne Martin | The solution this lesson adapts: numbers, fan-out service, home timeline cache and scaling notes.
docs | Redis lists, capped lists | https://redis.io/docs/latest/develop/data-types/lists/ | Redis | Shows how LTRIM keeps only the latest N items, the basis of a timeline cache.
```

```quiz
A user with 10 million followers posts. The fan-out service does 60,000 deliveries a second. About how long does the fan-out take? | About one second, since writes are in memory ; About three hours, because queues are slow ; About three minutes | 2 | 10 million divided by 60,000 is about 170 seconds.
Why use a cursor instead of an offset to paginate a feed? | Cursors use less memory in the browser app ; Offsets repeat items when new posts arrive ; Offsets cannot be used with SQL databases at all | 1 | New posts shift offsets, so page 2 repeats page 1 items, while a cursor marks a fixed position.
What does the hybrid design do for accounts with huge follower counts? | Writes their posts to every follower cache early on ; Blocks them from posting at the busiest times of day ; Skips fan-out and merges at read time | 2 | Pull for celebrities avoids millions of writes per post, at the cost of a small merge on each read.
```

```story
A pop star with 30 million followers posts a photo. The fan-out workers begin 30 million cache writes, and for ten minutes every other user's new posts wait in the same queue. Friends see each other's updates a quarter of an hour late, and the on-call engineer sees queue depth climb. The team switches celebrities to fan-out on read.
```

```adapted
The System Design Primer | https://github.com/donnemartin/system-design-primer | CC BY 4.0
```

# chat-system | Design a Chat System | 3 | 15
A chat system delivers messages between people in near real time, keeps history, and copes with people being offline. The hard parts are keeping many open connections, finding which server holds the recipient, ordering messages, and never losing one.

## Requirements
Functional: send one-to-one messages, send to groups, see sent, delivered and read status, receive messages that arrived while offline (with a push notification), see who is online. Non-functional: low delay for online users, no lost messages, ordered messages within a conversation, and high availability.

## Estimates (all invented)
Assume 50 million daily users, each sending 40 messages a day, and 20 million connected at the busiest moment.

1. Messages per day: 50 million times 40 is 2 billion.
2. Per second: 2 billion divided by about 100,000 is 20,000, so plan for 60,000 at peak.
3. Storage: about 200 bytes each including metadata is 400 GB a day, about 146 TB a year.
4. Connection servers: if one server holds about 100,000 open connections (depends on memory and tuning), 20 million needs 200 servers.

Connections, not requests, are the unusual part here. See [back-of-the-envelope](/sd/docs/foundations/back-of-envelope).

## API: why not plain HTTP
With plain HTTP the client asks and the server answers, so the server cannot push a message. Options:

| Technique | How it works | Cost |
| --- | --- | --- |
| Short polling | Client asks every few seconds | Many empty requests, delay up to the interval |
| Long polling | Server holds the request until data arrives | One request per message, reconnect each time |
| WebSocket | One persistent two-way connection | Server must hold state per connection |

WebSocket (RFC 6455) is the usual choice for chat because either side can send at any time over the same connection. Server-sent events let only the server push. Sending messages can still use ordinary HTTP while receiving uses the socket. Keep an HTTP fallback for networks that block sockets.

## High level design
Boxes: client apps, a load balancer, connection servers that hold WebSockets, a session store mapping user to connection server, a chat service that validates and stores messages, a message store, a queue between services, a push service, and a presence service.

Sending, step by step:

1. Alice's client sends a message over her WebSocket to her connection server.
2. The chat service assigns an id, checks she may post to this conversation, and writes the message to the message store.
3. It acknowledges to Alice, which shows one tick (sent).
4. It looks up Bob in the session store. If he is online it forwards the message to his connection server, which pushes it on his socket.
5. If Bob is offline it sends a push notification through the phone platform's service and leaves the message stored.
6. Bob's client acknowledges, which becomes the delivered tick. Opening the chat sends a read receipt.

The key rule is to store first, then deliver. If delivery fails, the message still exists and Bob syncs when he returns. Routing needs the session store: when a client connects, the connection server writes `user to server` with a short lifetime and refreshes it while the socket lives.

```mermaid Connection servers hold the sockets, and the session store says which one holds the recipient
flowchart TD
  A[Alice app] --> LB[Load balancer]
  LB --> CS1[Connection server A]
  CS1 --> CH[Chat service]
  CS1 -.->|registers user| SS
  CS1 -.->|heartbeat| PR[Presence service]
  CH --> MS[(Message store)]
  CH --> SS[(Session store)]
  CH --> CS2[Connection server B]
  CS2 --> B[Bob app]
  CH --> PS[Push service]
```

## IDs and ordering
Order matters within one conversation, not across all of them. The message id should sort by time and be unique without a global lock. A common pattern is a Snowflake-style id: a timestamp in the high bits, then a machine id, then a counter. Discord says all of its ids are Snowflakes, which are chronologically sortable, and it uses the message id to order rows within a channel.

Another way is a per-conversation counter owned by whichever server handles that conversation. That gives gap-free numbers that make missing messages easy to detect, but needs one owner per conversation. Clients sync with "give me messages after id X".

## Storage
Chat is write-heavy and queried by conversation and time. Discord's post "How Discord Stores Billions of Messages" describes moving from MongoDB, where data and index no longer fit in memory at 100 million messages, to Cassandra. The partition key was the channel and the clustering key was the message id. When partitions grew past 100 MB and caused trouble, they added a time bucket of about 10 days, so the key became channel plus bucket. A later post says that by early 2022 the cluster had 177 nodes and trillions of messages, then moved to ScyllaDB. The lesson is to partition by conversation and bound partition size. See [sharding](/sd/docs/data/sharding).

## Groups and presence
Small groups: write one message, then deliver to each member's connection, or add it to each member's inbox. For large groups, store once per group and let each member read from the group log using their own last-seen id. This is the fan-out choice from the [news feed](/sd/docs/case-studies/news-feed) again.

Presence: clients send a heartbeat every 30 seconds, and the presence service marks someone online with a lifetime of about 60 seconds. If heartbeats stop, the key expires and they go offline. Do not broadcast every change to every contact. Send presence only to people who currently have that user's chat open or list visible.

## A worked example: finding Bob
Alice and Bob are on different servers out of 200. Bob's key in the session store says server 137.

1. Alice's server writes the message and gets id 8841 for conversation C.
2. It reads `session:bob`, which returns 137. One lookup, about a millisecond.
3. It sends the message to server 137 on an internal call.
4. Server 137 pushes on Bob's socket. Total added delay is a few milliseconds.

If the lookup returns nothing, Bob is offline. The push notification fires and the message waits. When Bob reconnects, his app sends "last id I have: 8830", and the server returns 8831 onward.

```mermaid Store first, then deliver: an offline user gets a push and syncs on return
sequenceDiagram
  participant A as Alice
  participant C as Chat service
  participant M as Message store
  participant S as Session store
  participant P as Push service
  participant B as Bob
  A->>C: message over WebSocket
  C->>M: save as id 8841
  C-->>A: one tick, sent
  C->>S: where is Bob
  S-->>C: nothing, Bob is offline
  C->>P: send push notification
  Note over B: later, Bob reconnects
  B->>C: last id I have is 8830
  C-->>B: messages 8831 onward
```

## What goes wrong: a reconnect storm
A connection server crashes or a deploy restarts it, and its 100,000 clients reconnect at the same moment. Every client re-authenticates and syncs history, which overloads the other servers and the database. The symptoms are a spike in new connections per second, then cascading failures. Confirm by graphing connect rate and CPU per server. The fix is client retry with random backoff (see [timeouts and retries](/sd/docs/reliability/timeouts-and-retries)), connection limits per server, and rolling deploys that drain a server slowly.

## Alternatives considered
Polling is far simpler, but look at the cost. If 20 million clients asked every 5 seconds (invented), the servers would face 4 million requests a second, nearly all of them empty. WebSockets turn that into 20 million mostly idle sockets, which the 200 servers above can hold. The price is memory per user and servers that keep state, so deploys and load balancing need care. See [stateless services](/sd/docs/scaling/stateless-services) for why that matters.

Other transports win in other cases. If updates are rare, such as an order status that changes a few times, polling every 30 seconds is much simpler. If only the server pushes, as with a live score, server-sent events are lighter.

For ordering we pick Snowflake-style ids, because they need no coordination between servers. Per-conversation counters give gap-free numbers but need one owner per conversation.

```card Chat System
Requirements | Deliver one-to-one and group messages in near real time, keep history, handle offline users and show sent, delivered and read status and presence.
Scale | Invented numbers: 50 million daily users, 20,000 messages per second (60,000 at peak), 400 GB a day and 20 million open connections.
Key decision | Persistent WebSocket connections with a session store for routing, and the message is stored before it is delivered.
Main risk | A restart of connection servers makes every client reconnect at once and overloads the servers and database that remain.
```

## Common mistake
Delivering to the recipient first and saving the message later, so a crash between the two loses it.

```resources
article | How Discord Stores Billions of Messages | https://discord.com/blog/how-discord-stores-billions-of-messages | Discord | Describes the move from MongoDB to Cassandra, Snowflake ids as clustering keys and bucketing by time to bound partition size.
article | How Discord Stores Trillions of Messages | https://discord.com/blog/how-discord-stores-trillions-of-messages | Discord | Follow-up on growing to 177 nodes, hot partitions, request coalescing and the move to ScyllaDB.
article | Designing a Chat Application | https://bytebytego.com/guides/how-do-we-design-a-chat-application-like-whatsapp-facebook-messenger-or-discord | ByteByteGo | A short 1-to-1 chat walkthrough covering login, presence, sequencing, sync queue and push for offline users.
article | Short/long polling, SSE, WebSocket | https://bytebytego.com/guides/shortlong-polling-sse-websocket | ByteByteGo | Compares four ways to get real-time updates and notes SSE is one-way while WebSocket is two-way.
```

```quiz
Bob is offline when Alice sends a message. What should happen? | The message is stored and a push is sent ; The message is dropped and Alice must retry later ; The server holds the socket open until Bob comes back | 0 | Store first means the message survives, and a push notification tells Bob to reconnect and sync.
Your design has 20 million connections and each server holds 100,000. How many connection servers are needed at least? | 20 ; 200 ; 2,000 | 1 | 20 million divided by 100,000 is 200.
Why does Discord add a time bucket to the partition key? | To make message ids shorter and easier to read ; To spread one channel across all nodes evenly ; To keep each partition from growing forever | 2 | A channel lives for years, and partitions over about 100 MB caused trouble, so buckets of about 10 days bound the size.
```

```story
At 9am a company deploys a new chat server version and restarts all 200 connection servers at once. Twenty million phones reconnect within seconds, and each asks for its history. The database hits its limit, the retries make it worse, and chat is down for twenty minutes. A staggered deploy with random reconnect delays would have taken a quiet minute.
```

# web-crawler | Design a Web Crawler | 3 | 15
A web crawler starts from a list of URLs, downloads each page, finds the links inside, and repeats. The hard parts are staying polite to each website, never repeating work, and keeping the crawl fresh at a huge scale.

## Use cases and constraints
This follows the Primer's "Design a web crawler" solution. In scope: the service crawls a list of URLs and generates a reverse index (a map from words to the pages that contain them) of the words in those pages, and generates a title and snippet for each page, which are static and do not change with the query. A user searches and sees a list of pages with titles and snippets. The service has high availability.

Out of scope: search analytics, personalized results and page rank. Assumptions from the Primer: traffic is uneven (some searches are popular, others run once), generating results should be fast, and the crawler must not get stuck in an infinite loop. That happens when the link graph has a cycle. The Primer also says to practice with traditional components rather than reaching for Solr or Nutch.

## Estimates
The Primer assumes 1 billion links to crawl and a refresh about once a week, which gives 4 billion pages crawled a month. Average stored size is 500 KB per page, and there are 100 billion searches a month.

1. Storage: 500 KB times 4 billion is 2 PB a month, about 72 PB in three years.
2. Crawl writes: 4 billion a month is about 1,600 per second.
3. Searches: 100 billion a month is about 40,000 per second.

Our addition: 1,600 pages a second at 500 KB each is 800 MB a second, about 6.4 Gbit per second of download bandwidth. Crawling is bandwidth-bound, and the Primer's scaling notes say to make sure there is enough.

## Data model and components
The Primer keeps two tables. `links_to_crawl` holds URLs waiting, ranked by priority. It suggests Redis sorted sets to keep the ranking. `crawled_links` holds processed URLs with a page signature. Both can live in a key-value NoSQL database (see [SQL vs NoSQL](/sd/docs/data/sql-vs-nosql)). The classes are a `PagesDataStore` that wraps the database, a `Page` (url, contents, child urls, signature) and a `Crawler` that loops over them.

## The crawl loop
Each crawler worker does the following, as in the Primer.

1. Take the highest ranked link from `links_to_crawl`.
2. Check `crawled_links` for a page with a similar signature. If one exists, lower this link's priority, which prevents cycles, and move on.
3. Otherwise crawl the link. Queue a job for the Reverse Index Service and another for the Document Service, which makes the title and snippet.
4. Generate the page signature, remove the link from `links_to_crawl`, and insert it with its signature into `crawled_links`.

The Query API serves searches: parse the query (remove markup, split into terms, fix typos, lower-case, convert to boolean logic), ask the Reverse Index Service for ranked matches, and ask the Document Service for titles and snippets. The work between the crawler and those services runs through [queues](/sd/docs/async/message-queues).

```mermaid Workers pull from the link list, and queues feed the index and document services
flowchart TD
  F[Links to crawl] --> CW[Crawler workers]
  CW -->|check signature| CL[(Crawled links)]
  CW --> Q[Queues]
  Q --> RI[Reverse Index Service]
  Q --> DS[Document Service]
  U[User] --> QA[Query API]
  QA --> RI
  QA --> DS
```

## Politeness
The Primer mentions supporting robots.txt briefly. It deserves more. A crawler that sends 1,600 requests a second at one small site is an attack. Rules to build in:

1. Fetch and cache each host's robots.txt. RFC 9309 says crawlers should not use a cached copy for more than 24 hours unless the file is unreachable.
2. Obey Allow and Disallow rules. If robots.txt returns a 4xx, the crawler may access everything. If it returns a 5xx or the network fails, the crawler must assume complete disallow. If the file stays undefined for a long time (the RFC's example is 30 days), the crawler may treat it as unavailable.
3. Limit requests per host, for example one request per second, using a queue per host. A scheduler picks the host whose next allowed time has passed. See [rate limiting](/sd/docs/reliability/rate-limiting).

Politeness changes the architecture: the frontier is no longer one priority list. It is a priority layer that decides what is important, feeding a set of per-host queues that decide when.

```mermaid The frontier ranks links first, then per-host queues release them at a polite pace
flowchart TD
  P[Priority layer] --> H1[Queue host A]
  P --> H2[Queue host B]
  P --> H3[Queue host C]
  H1 & H2 & H3 --> S[Scheduler]
  S -->|next allowed time| W[Crawler workers]
  W -.->|new links| D{Seen before}
  D -->|no| P
```

## Duplicates
URLs: the Primer removes duplicates with `sort | unique` for small lists, and for 1 billion links a MapReduce job that outputs only entries with frequency 1. A faster online check is a Bloom filter, a compact structure that answers "definitely not seen" or "probably seen". ByteByteGo's guide explains it as a bit vector with several hash functions. It never gives a false negative but may give a false positive, so you may skip a few new URLs.

Content: two different URLs can show the same page. The Primer generates a signature from the content and compares signatures, with Jaccard index or cosine similarity for near matches. An exact hash catches identical pages. Normalize URLs first (lower-case host, remove fragments, sort query parameters).

## Recrawl
Each stored page has a timestamp. After a default period of one week the page is refreshed. Popular or frequently changing sites refresh sooner, and the Primer suggests mining past crawls for the mean time before a page changes and using it to schedule the next visit.

## A worked example: sizing the Bloom filter and the hosts
Bloom filter. For 1 billion URLs with a 1 percent false positive rate, the standard sizing formula gives about 9.6 bits per URL, which we round to 10. That is 10 billion bits, or 1.25 GB. It fits in memory on one machine, where a set of raw URLs would take 100 GB or more.

Hosts. Assume one request per second per host. To reach 1,600 pages a second the crawler needs at least 1,600 different hosts in flight at once. A frontier holding mostly one big site would stall, so the per-host queues must interleave many sites.

## What goes wrong: a crawler trap
A calendar page links to "next month" forever, or a site makes endless session-id URLs. Every link is new, so duplicate checks pass. The crawler spends days in one site. Symptoms are a growing share of crawled pages from one host, URLs getting longer, and low-value content. Confirm by counting pages per host per day. Fix with limits: a maximum URL length, a maximum depth, and a cap on pages per host that lowers priority as it grows.

## Scaling the design
The Primer says to cache popular searches in memory, since some queries are very popular and others run once. The Reverse Index and Document services will need heavy [sharding](/sd/docs/data/sharding) and federation. DNS lookups can be a bottleneck, so the crawler keeps its own DNS cache that refreshes periodically. Connection pooling keeps many connections open. Bandwidth must sustain the throughput. The Primer also suggests UDP could help. Page fetches use HTTP, which runs over TCP, so we would skip that idea unless a custom protocol is involved. For a related design see the [query cache](/sd/docs/practice/query-cache) practice lesson.

## Alternatives considered
If you need data from a few known sites, use their APIs or a scheduled script. A full crawler is justified only when you must discover pages at web scale. For search itself, running a ready-made engine such as Solr or Elasticsearch is the practical choice. The Primer builds one from parts as an exercise.

Inside the design there were choices too. A single priority list is simpler than priority plus per-host queues, but it cannot hold each site to one request a second. For seen URLs, a database check is exact but costs a lookup per link, and an in-memory set of 1 billion raw URLs would take 100 GB or more. The 1.25 GB Bloom filter fits one machine, at the price of wrongly skipping about 1 percent of new URLs.

```card Web Crawler
Requirements | Crawl a list of URLs, build a reverse index and a title and snippet per page, serve searches, never loop forever and stay highly available.
Scale | The Primer's assumptions give 1 billion links refreshed weekly, 4 billion pages a month (1,600 a second and 2 PB a month) and 40,000 searches per second.
Key decision | A frontier with a priority layer feeding per-host queues, a Bloom filter for seen URLs and content signatures for duplicate pages.
Main risk | A crawler trap, such as an endless calendar, burns the crawl budget on one site and gets the crawler blocked.
```

## Common mistake
Checking only URL duplicates and ignoring content duplicates, so mirrors and session-id pages fill the index.

```resources
article | Design a web crawler | https://github.com/donnemartin/system-design-primer/tree/master/solutions/system_design/web_crawler | Donne Martin | The solution this lesson adapts: assumptions, link tables, crawl loop, duplicates and scaling notes.
paper | RFC 9309, Robots Exclusion Protocol | https://www.rfc-editor.org/rfc/rfc9309 | IETF | Defines Allow and Disallow rules, caching robots.txt for at most 24 hours, and what to do on 4xx and 5xx responses.
article | How to Avoid Crawling Duplicate URLs at Google Scale | https://bytebytego.com/guides/how-to-avoid-crawling-duplicate-urls-at-google-scale | ByteByteGo | Compares a set, a database and a Bloom filter for deciding whether a URL was seen.
```

```quiz
A crawler must reach 1,600 pages a second and allows one request per second per host. How many hosts must be active? | At least 16 hosts at a time ; At least 1,600 hosts ; At least 160 hosts at a time | 1 | Each host contributes one request a second, so 1,600 pages a second needs 1,600 hosts.
robots.txt returns a 503 error. What does RFC 9309 tell the crawler to do? | Assume everything is allowed to be crawled ; Assume everything is disallowed ; Crawl, but only at half the normal speed | 1 | A server error makes the file undefined, so the crawler must assume complete disallow.
What is a possible result from a Bloom filter that says a URL was seen? | It definitely was seen ; It was never seen ; It was probably seen | 2 | Bloom filters never give false negatives but can give false positives.
```

```story
A new crawler is turned loose on a news site with a calendar widget. Every "next month" link is a fresh URL, so the duplicate check never fires. A week later 40 percent of the crawl budget has gone to the year 2400 of a single site, and the site's owner has blocked the crawler's address.
```

```adapted
The System Design Primer | https://github.com/donnemartin/system-design-primer | CC BY 4.0
```
