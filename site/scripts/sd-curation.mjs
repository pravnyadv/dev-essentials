// The System Design track's learning order. Each chapter is a file in authored/sd/<id>.md; topic order is the order inside the file.
// Same format and fields as ai-curation.mjs: `stage` places a chapter on the learning map, `after` lists what it builds on, `goals` the routes that include it.

export const TIERS = [
  { id: 1, title: 'Must Know', blurb: 'How requests travel, how to scale, store, cache and decouple, how to survive failure, and how to put it together in a design. Work through this in order.' },
  { id: 2, title: 'Advanced', blurb: 'More worked designs, the named patterns and antipatterns of the cloud design catalog, and what changes when data lives on many machines.' },
]

export const STAGES = [
  { id: 1, title: 'Foundations', blurb: 'How a request travels, how fast it is and how to estimate load' },
  { id: 2, title: 'Scale the basics', blurb: 'More servers, the right database and a cache in front' },
  { id: 3, title: 'Decouple and survive', blurb: 'Queues, retries and limits that keep a system up, plus the named patterns and antipatterns around them' },
  { id: 4, title: 'Put it together', blurb: 'Worked designs, architecture patterns and the distributed-systems rules underneath them' },
]

export const GOALS = [
  { id: 'web', title: 'Understand the web', blurb: 'What happens behind a page load, without building anything.' },
  { id: 'build', title: 'Build at work', blurb: 'Scale, store, cache and keep a real service up.' },
  { id: 'interview', title: 'Pass the interview', blurb: 'The core building blocks plus worked designs.' },
  { id: 'deep', title: 'Go deep', blurb: 'Consistency, consensus and clocks.' },
]

export const CHAPTERS = [
  { id: 'foundations', style: 'concept', tier: 1, stage: 1, goals: ['web', 'build', 'interview', 'deep'], after: [], title: 'How Systems Talk', blurb: 'Clients, servers, DNS, APIs, latency and quick estimates.',
    outcome: 'Trace a request from browser to database and back, and estimate how much load a feature creates.',
    story: 'You tap "buy" in a shopping app and see "Order placed" a fifth of a second later. In that time your phone found a server, opened a connection, sent a request, and the server talked to a database. Every design in this track is a variation on that trip.' },
  { id: 'scaling', style: 'concept', tier: 1, stage: 2, goals: ['web', 'build', 'interview'], after: ['foundations'], title: 'Scaling Out', blurb: 'Bigger machines, more machines, load balancers, proxies, stateless services, CDNs and microservices.',
    outcome: 'Grow a service from one server to many without losing users or sessions.',
    story: 'A ticket site runs fine on one server until a concert goes on sale and 50,000 people arrive in a minute. The fix is not a faster server. It is many ordinary servers, and something that spreads people across them.' },
  { id: 'data', style: 'concept', tier: 1, stage: 2, goals: ['build', 'interview', 'deep'], after: ['foundations'], title: 'Storing Data', blurb: 'SQL or NoSQL, indexes, replication, sharding, consistent hashing and transactions.',
    outcome: 'Pick a database for a workload and grow it with indexes, replicas and shards.',
    story: 'A photo app keeps everything in one database. Queries slow down as it reaches a billion rows, and one disk failure would lose every user\'s photos. The answers (an index, a replica, a shard) each fix one of those problems and bring a new one.' },
  { id: 'caching', style: 'concept', tier: 1, stage: 2, goals: ['web', 'build', 'interview'], after: ['data'], title: 'Caching', blurb: 'Why caches work, where to put them and how to keep them honest.',
    outcome: 'Add a cache that makes reads fast without serving stale or wrong data.',
    story: 'A news site\'s home page is read a million times an hour and changes every few minutes. Building it from the database each time is wasteful. Keeping a copy for 30 seconds cuts database work to almost nothing. Deciding when that copy is too old is the hard part.' },
  { id: 'async', style: 'concept', tier: 1, stage: 3, goals: ['build', 'interview'], after: ['scaling', 'data'], title: 'Queues and Events', blurb: 'Message queues, event streams, delivery guarantees, back pressure and background jobs.',
    outcome: 'Move slow or bursty work off the request path, and handle the duplicates that come with it.',
    story: 'A video site makes uploaders wait while their video is converted into five sizes. With a queue, the upload finishes in seconds, a worker converts it in the background, and the uploader gets a "ready" email. Nobody waits for work they do not need to see.' },
  { id: 'reliability', style: 'concept', tier: 1, stage: 3, goals: ['build', 'interview'], after: ['scaling'], title: 'Reliability and Security', blurb: 'Failure, redundancy, timeouts, retries, rate limits, circuit breakers, observability and security.',
    outcome: 'Keep a service up when parts of it fail, and see what is going wrong when they do.',
    story: 'A payments service calls a slow fraud checker. Without a timeout, every request waits, threads run out and the whole checkout goes down. One slow dependency took out a healthy service. This chapter is about stopping that chain.' },
  { id: 'case-studies', style: 'design', tier: 1, stage: 4, goals: ['interview', 'build'], after: ['caching', 'async', 'reliability'], title: 'Case Studies', blurb: 'A framework for any design, then a URL shortener, a news feed, a chat system and a web crawler.',
    outcome: 'Run a design from requirements to bottlenecks, and defend each choice with numbers.',
    story: 'An interviewer says "design a URL shortener" and waits. One candidate draws boxes at once. Another asks how many links a day, how long they live and whether they can be edited, then sizes the system before drawing anything. The second one is doing system design.' },
  { id: 'cloud-messaging', style: 'pattern', tier: 2, stage: 3, goals: ['build', 'interview'], after: ['async'], title: 'Messaging and Data Patterns', blurb: 'Named patterns from the cloud design catalog: competing consumers, load leveling, priority, claim check, pipes and filters, choreography, sagas, event sourcing, CQRS and read models.',
    outcome: 'Recognise the standard messaging and data patterns, know the problem each solves, and pick between them.',
    story: 'A team reinvents a queue that hands slow jobs to whichever worker is free, then a way to send big files through a queue that only takes small messages. Both problems have names and known answers: competing consumers and claim check. Knowing the names saves the weeks.' },
  { id: 'antipatterns', style: 'antipattern', tier: 2, stage: 3, goals: ['build'], after: ['data', 'caching', 'reliability'], title: 'Performance Antipatterns', blurb: 'Ten common ways systems get slow: busy database, busy front end, chatty I/O, extraneous fetching, synchronous I/O, improper instantiation, noisy neighbor, monolithic persistence, retry storm and no caching.',
    outcome: 'Spot the usual causes of a slow system from their symptoms, confirm them with measurements, and fix them.',
    story: 'An app is fast in testing and crawls in production. The profiler shows one page making 300 small database calls, each quick on its own. Nothing is broken. The design is chatty, and the fix is one query instead of three hundred.' },
  { id: 'practice', style: 'design', tier: 2, stage: 4, goals: ['interview', 'build'], after: ['case-studies'], title: 'Practice Designs', blurb: 'Five more worked designs from the System Design Primer: scaling to millions, a query cache, sales rank, a social graph and a finance app.',
    outcome: 'Work through a design on your own first, then compare it with a full worked answer.',
    story: 'Reading one solved design teaches you a design. Solving five, each stressing a different part (traffic growth, a hot cache, a batch job, a huge graph, private money data), teaches you the method. These are the reps.' },
  { id: 'cloud-architecture', style: 'pattern', tier: 2, stage: 4, goals: ['build', 'interview'], after: ['scaling', 'reliability'], title: 'Architecture and Resilience Patterns', blurb: 'Gateways and BFF, sidecar and ambassador, strangler fig and messaging bridge, resiliency patterns such as bulkheads and health endpoints, deployment stamps, geodes, external config and security patterns.',
    outcome: 'Choose the architecture pattern that fits a migration, a multi-region rollout or a shared-infrastructure problem, and know its cost.',
    story: 'A company must replace a 15-year-old billing system without a big-bang cutover. It routes one feature at a time to the new service behind a facade, and the old system shrinks until it can be switched off. That plan has a name: the strangler fig.' },
  { id: 'distributed', style: 'concept', tier: 2, stage: 4, goals: ['deep', 'interview'], after: ['data'], title: 'Distributed Systems', blurb: 'CAP, consistency models, consensus and clocks.',
    outcome: 'Explain what a distributed database can promise during a network failure, and how machines agree on anything.',
    story: 'Two data centres lose the link between them. A customer in each one tries to buy the last seat on a flight. Either both sales go through and one must be cancelled, or one data centre refuses to sell until the link is back. No design avoids that choice.' },
]

// What each chapter `style` requires of its lessons (checked by the build). Every styled lesson also needs a diagram or a demo.
const CORE = [/worked example/i, /goes wrong/i, /wrong tool/i, /common mistake/i]
export const STYLES = {
  concept: { sections: CORE },
  pattern: { sections: CORE, card: 'pattern', diagramPerCard: true },
  antipattern: { sections: [/worked example/i, /spot it in production/i, /wrong tool/i, /common mistake/i], card: 'antipattern' },
  design: { sections: [/estimates/i, /worked example/i, /goes wrong/i, /alternatives considered/i, /common mistake/i], card: 'design' },
}

// Lessons that differ from their chapter's style: the design framework teaches the method, it is not a design.
export const LESSON_STYLES = { 'design-framework': 'concept' }

// The cloud design catalog's patterns and the performance antipatterns, by their catalog names. Each needs a card in the
// lesson that teaches it; the pattern catalog page is built from those cards.
export const CATALOG = {
  pattern: ['Ambassador', 'Anti-Corruption Layer', 'Asynchronous Request-Reply', 'Backends for Frontends', 'Bulkhead', 'Cache-Aside', 'Choreography', 'Circuit Breaker', 'Claim Check', 'Compensating Transaction', 'Competing Consumers', 'Compute Resource Consolidation', 'CQRS', 'Deployment Stamps', 'Event Sourcing', 'External Configuration Store', 'Federated Identity', 'Gatekeeper', 'Gateway Aggregation', 'Gateway Offloading', 'Gateway Routing', 'Geode', 'Health Endpoint Monitoring', 'Idempotent Consumer', 'Index Table', 'Leader Election', 'Materialized View', 'Messaging Bridge', 'Pipes and Filters', 'Priority Queue', 'Publisher-Subscriber', 'Quarantine', 'Queue-Based Load Leveling', 'Rate Limiting', 'Retry', 'Saga', 'Scheduler Agent Supervisor', 'Sequential Convoy', 'Sharding', 'Sidecar', 'Static Content Hosting', 'Strangler Fig', 'Throttling', 'Valet Key'],
  antipattern: ['Busy Database', 'Busy Front End', 'Chatty I/O', 'Extraneous Fetching', 'Improper Instantiation', 'Monolithic Persistence', 'No Caching', 'Noisy Neighbor', 'Retry Storm', 'Synchronous I/O'],
}

// Topic slug -> interactive demo shown above the lesson.
export const EXPLAINERS = {
  'latency-and-throughput': 'percentiles',
  'consistent-hashing': 'ring',
  'caching-basics': 'cache',
  'rate-limiting': 'bucket',
  'availability-and-redundancy': 'availability',
  'timeouts-and-retries': 'retries',
  'circuit-breakers': 'breaker',
  'back-pressure': 'backlog',
  'consistency-models': 'quorum',
  'news-feed': 'fanout',
  'sharding': 'shardkey',
  'clocks-and-ordering': 'clocks',
  'transactions-and-isolation': 'isolation',
}
