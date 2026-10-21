# scale-to-millions | Scale to Millions of Users | 2 | 15
Start with one server and grow the design one measured bottleneck at a time, until it serves tens of millions of users. This lesson walks the whole path and shows what each step buys and what it costs.

## Try it first
Before reading on, answer these on paper. What breaks first on a single box that runs the web server and the database? Which part can you copy easily, and which part is hard to copy? What would you measure to decide the next step? Then compare your answers with the steps below.

## Requirements and estimates
The Primer scopes this as: a user makes a read or write request, the service processes it and stores the data, the service grows from a few users to millions, and it stays highly available. Assume traffic is uneven and the data is relational.

The Primer's assumed numbers: 10 million users, 1 billion writes per month, 100 billion reads per month (a 100 to 1 read to write ratio), and 1 KB per write. Use the handy fact that a month has about 2.5 million seconds (see [back-of-envelope](/sd/docs/foundations/back-of-envelope)).

| Quantity | Calculation | Result |
| --- | --- | --- |
| New data per month | 1 KB times 1 billion writes | 1 TB |
| New data in 3 years | 1 TB times 36 months | 36 TB |
| Writes per second | 1 billion divided by 2.5 million | about 400 |
| Reads per second | 100 billion divided by 2.5 million | about 40,000 |

There is no API to design here, since the exercise is about the shape of the system. The data model is one relational database with user content in it.

## The loop and the first box
The Primer repeats four moves: load test, profile for the bottleneck, fix that bottleneck while weighing alternatives, repeat. Never add a component before a measurement says it is needed.

Step zero is one machine. It runs the web server and a MySQL database and holds user files. Give it a fixed public address (an AWS Elastic IP) so a reboot does not change it, and point a domain at it with a DNS service (AWS Route 53). Open only ports 80 (HTTP) and 443 (HTTPS) to the world, and port 22 (SSH) only for your own addresses. Watch CPU, memory, disk input and output, and network. When one runs out, buy a bigger box. This is [vertical scaling](/sd/docs/scaling/vertical-vs-horizontal). It is simple, but it gets expensive and a failure takes everything down.

## The growth steps
Each step starts from a measured symptom.

| Stage | Measured symptom | Change |
| --- | --- | --- |
| Users+ | Database eats memory and CPU, files fill the disk, and web and database cannot scale separately | Move files to an object store (AWS S3). Move the database to a managed relational database (AWS RDS) |
| Users++ | One web server is slow at peak and its failure is an outage | Add a load balancer (AWS ELB) and several web servers across availability zones, which are separate data centers in one region. Add a standby database. Add a CDN (AWS CloudFront) |
| Users+++ | Reads are 100 to 1 and the database struggles | Add an in-memory cache (AWS ElastiCache), move sessions into it, add read replicas |
| Users++++ | Traffic follows office hours and servers idle at night | Add autoscaling and automate deployment |
| Users+++++ | Data and write rate outgrow one primary | Old data to a data warehouse, sharding, a NoSQL store, queues and workers |

Details worth knowing. The Primer splits web servers (which terminate connections and act as [reverse proxies](/sd/docs/scaling/reverse-proxies-and-gateways)) from application servers, so each tier scales alone. A [load balancer](/sd/docs/scaling/load-balancing) can also end HTTPS so the servers do less work. Moving sessions out of the web servers makes them [stateless](/sd/docs/scaling/stateless-services), which is what allows adding and removing them freely. A [CDN](/sd/docs/scaling/cdn-and-edge) serves static files from near the user.

On the database side, RDS Multi-AZ keeps a standby in another zone for failover. In its one-standby form, AWS documents that the standby does not serve read traffic, so read replicas are a separate feature. See [replication](/sd/docs/data/replication) and [caching basics](/sd/docs/caching/caching-basics).

Autoscaling groups have a minimum, a maximum and a desired size, and policies move the count inside those limits (AWS documents this). Scaling on a schedule fits predictable loads. Metrics such as CPU or latency fit unpredictable ones.

The last stage uses [sharding](/sd/docs/data/sharding), [SQL vs NoSQL](/sd/docs/data/sql-vs-nosql) and [message queues](/sd/docs/async/message-queues). In the Primer's photo example, the app server puts a thumbnail job on a queue and a worker creates the thumbnail, updates the database and stores the file.

```mermaid The design after the growth steps: CDN and balancer in front, cache and replicas behind
flowchart TD
  U[Users] --> CDN[CDN]
  U --> LB[Load balancer]
  CDN -.-> OS[(Object store)]
  LB --> WS[Web servers]
  WS --> C[(Memory cache)]
  WS --> P[(Primary database)]
  WS --> RR[(Read replicas)]
  P -.->|copies writes| RR
  WS --> Q[Queue]
  Q --> WK[Workers]
```

## A worked example: what the cache buys
Use the Primer's 40,000 reads per second. Assume a replica can serve 2,000 reads per second (an invented figure).

Without a cache, all 40,000 reads reach the database. That needs 40,000 divided by 2,000 = 20 replicas, and replicas must copy every write, which costs more as you add them.

With a cache that answers 95 percent of reads, only 5 percent reach the database. That is 0.05 times 40,000 = 2,000 reads per second, which is one replica, plus a second for failover. The cache is the cheapest way to remove eighteen of those twenty replicas.

```mermaid With a 95 percent hit ratio, 40,000 reads a second become 2,000 at the database
flowchart TD
  R[40,000 reads per second] --> C[Cache]
  C -->|38,000 hits| H[Answered from memory]
  C -->|2,000 misses| DB[(Read replica)]
```

For autoscaling, say a group has minimum 4, maximum 12, and each server handles 1,000 requests per second (also invented). A peak of 9,000 needs 9 servers, so the group sits at 9 and drops back to 4 at night. You pay for about 9 only during the peak.

## What goes wrong: scaling up too slowly
A news link sends traffic from 3,000 to 12,000 requests per second in two minutes. A policy on average CPU typically reacts after a few minutes of data, then needs time to boot servers. The Primer warns that a system may take a while to scale up. Meanwhile the four running servers are overloaded and latency climbs. If the load balancer's health checks then mark overloaded servers unhealthy, the rest take even more load (a common pattern, not something the Primer states).

The symptom is a latency wall for several minutes that clears by itself. Confirm it by lining up the autoscaling activity history with the latency graph. If scale-up events start after the latency spike, the policy is too slow. Fixes include a higher minimum before known events, scaling on a faster metric, and [load shedding](/sd/docs/reliability/rate-limiting).

## Alternatives considered
The simplest alternative is to stay on one machine and buy a bigger one. Most products never reach 40,000 reads per second, and a single server with a managed database and daily backups serves thousands of users well. Every step above adds cost, moving parts and security surface. The Primer itself says that after profiling you may need only one or two of these techniques.

For read load there are two routes. Twenty replicas could carry 40,000 reads a second, but replicas must copy every write. A cache that answers 95 percent of reads needs one replica plus one for failover, so the cache wins. If the real bottleneck is a missing [index](/sd/docs/data/indexes), neither helps, because replicas hide the problem and charge you for it. At the last stage, sharding keeps SQL but splits the data by key, while NoSQL changes the data model. Pick the one that matches what hurts, write volume or query shape.

```card Scale to Millions of Users
Requirements | Serve reads and writes for users who grow from a few to millions, keep their data safe and stay highly available.
Scale | The Primer's assumptions give 10 million users, about 400 writes and 40,000 reads per second, and 36 TB of data in three years.
Key decision | Measure, fix the worst bottleneck and repeat: separate tiers first, then a cache and replicas, then sharding only when one primary cannot keep up.
Main risk | Scaling up too slowly for a sudden spike, or adding machines that hide a slow query.
```

## Common mistake
Adding machines before measuring, so the real bottleneck (a slow query, a single hot row) stays and the bill grows.

```resources
article | Design a system that scales to millions of users on AWS (solution) | https://github.com/donnemartin/system-design-primer/blob/master/solutions/system_design/scaling_aws/README.md | Donne Martin | The step-by-step design this lesson adapts, with its numbers and assumptions.
docs | What is Amazon EC2 Auto Scaling? | https://docs.aws.amazon.com/autoscaling/ec2/userguide/what-is-amazon-ec2-auto-scaling.html | AWS | Defines groups with minimum, maximum and desired size, scaling policies and health checks.
docs | Multi-AZ deployments for Amazon RDS | https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZ.html | AWS | Explains the standby deployments and that a one-standby instance deployment does not serve read traffic.
article | Scaling Websites for Millions of Users | https://bytebytego.com/guides/how-to-scale-a-website-to-support-millions-of-users/ | ByteByteGo | A short six-step picture of the same growth path, useful as a second view.
```

```quiz
In the Primer's numbers, why do 100 billion reads a month become about 40,000 per second? | 100 billion divided by 2.5 million ; 100 billion divided by 86,400 seconds ; 100 billion divided by 60 seconds | 0 | A month has about 2.5 million seconds, so the division gives about 40,000.
A cache answers 95 percent of 40,000 reads per second. How many reads reach the database? | 38,000 per second ; 2,000 per second ; 200 per second | 1 | Five percent of 40,000 is 2,000.
Your database CPU is high because of one slow query. What should you do first? | Add more read replicas right now ; Move to a NoSQL database now ; Profile and fix the query | 2 | Measure first, since replicas and rewrites hide a cheap fix.
```

```story
A small app gets a mention on a popular site and traffic triples in ten minutes. The single server hits 100 percent CPU and the checkout page times out. The team that had a load balancer, a cache and autoscaling watches the graphs and barely notices. The team without them spends the night rebooting.
```

```adapted
The System Design Primer | https://github.com/donnemartin/system-design-primer | CC BY 4.0
```

# query-cache | Design a Query Cache for a Search Engine | 3 | 12
A search engine can answer popular queries from memory instead of searching its index again. This lesson builds that cache with a hash map and a doubly linked list, then spreads it over many machines.

## Try it first
Answer these before reading on. Which queries deserve a cache slot when memory is limited? What data structure finds an entry in constant time and also finds the oldest entry in constant time? If the cache spans ten machines, which machine holds a given query?

## Requirements and estimates
The Primer's use cases: a search that hits the cache, a search that misses it, and high availability. Traffic is uneven, so popular queries should almost always be cached. Lookups must be fast, machines are close together, and memory is limited, so the cache must decide what to drop. Assume 10 million users and 10 billion queries a month.

The cache maps a query (about 50 bytes) to a list of results, which the Primer sizes at a title (20 bytes) and a snippet (200 bytes). That is 270 bytes per entry.

| Quantity | Calculation | Result |
| --- | --- | --- |
| Requests per second | 10 billion divided by 2.5 million | about 4,000 |
| Data if every query were unique | 270 bytes times 10 billion | 2.7 TB per month |

The second number says that you cannot keep everything. Because traffic is uneven, a small fraction of queries covers most of the load. A real results page holds more than one result, so real entries are larger.

## API and data model
Users call `GET /search?q=running+shoes`. Inside, the query service asks the cache first. The key is the normalized query and the value is the ordered result list. Normalizing means removing markup, splitting into terms, fixing typos and lowercasing, so that "Running Shoes" and "running  shoes" share one entry.

## High-level design
In words: client, then web server acting as a reverse proxy, then the query API server. The query API checks the memory cache (Redis or Memcached). On a hit it returns the stored results. On a miss it asks the reverse index service for matching documents (it returns the top ranked), asks the document service for titles and snippets, stores the answer in the cache, and returns it. This is the [cache-aside pattern](/sd/docs/caching/cache-patterns).

```mermaid The query API tries the cache first, and only a miss reaches the index and document services
flowchart TD
  C[Client] --> WS[Web server]
  WS --> Q[Query API]
  Q --> M[(Memory cache)]
  Q -.->|on a miss| RI[Reverse Index Service]
  Q -.->|on a miss| DS[Document Service]
```

## The LRU cache
LRU means least recently used. Every hit moves the entry to the front, and when the cache is full the entry at the back is dropped. You need two things at constant cost: find an entry by key, and move or remove an entry from a list. A hash table gives the first. A doubly linked list gives the second, because each node knows both neighbors. Each hash entry points at its list node.

```python
class Node:
    def __init__(self, key=None):
        self.key, self.value = key, None
        self.prev = self.next = None

class LRUCache:
    def __init__(self, capacity):
        self.capacity, self.lookup = capacity, {}
        self.head, self.tail = Node(), Node()  # sentinels
        self.head.next, self.tail.prev = self.tail, self.head

    def _unlink(self, n):
        n.prev.next, n.next.prev = n.next, n.prev

    def _push_front(self, n):
        n.prev, n.next = self.head, self.head.next
        self.head.next.prev = n
        self.head.next = n
```

```python
    def get(self, key):
        node = self.lookup.get(key)
        if node is None:
            return None
        self._unlink(node)
        self._push_front(node)
        return node.value

    def set(self, key, value):
        node = self.lookup.get(key)
        if node is not None:
            self._unlink(node)
        else:
            if len(self.lookup) == self.capacity:
                oldest = self.tail.prev
                self._unlink(oldest)
                del self.lookup[oldest.key]
            node = self.lookup[key] = Node(key)
        node.value = value
        self._push_front(node)
```

The Primer shows this with the list methods left blank. Its sketch reads `self.lookup[query]` directly, which raises an error for a missing key in real Python, so the version above uses `.get`. In everyday Python, `collections.OrderedDict` with `move_to_end` and `popitem(last=False)` does the same job in a few lines.

## Scaling the cache across machines
The Primer lists three options for a cluster. Each machine could keep its own cache: simple, but the hit rate stays low because a repeat query lands on a machine that has not seen it. Each machine could hold a full copy: simple, but memory is wasted N times. Or the cache can be sharded, and the machine is chosen as `hash(query)` with [consistent hashing](/sd/docs/data/consistent-hashing). That is more work and the best option.

```mermaid Hashing the query picks the cache machine, so a repeat query lands where it was stored
flowchart LR
  Q[Query API] -->|hash of the query| H{Pick machine}
  H --> C1[(Cache 1)]
  H --> C2[(Cache 2)]
  H --> C3[(Cache 3)]
```

Invalidation: results go stale when a page changes, is removed or added, or its rank changes. The straightforward answer is a time to live (TTL), a maximum age after which an entry is refetched. See [cache invalidation](/sd/docs/caching/cache-invalidation).

## A worked example: losing the cache by resharding
Four cache machines hold entries placed by `hash mod 4`. Traffic is 4,000 requests per second with a 90 percent hit ratio, so 400 per second reach the index.

Add a fifth machine and switch to `hash mod 5`. A key keeps its machine only if its hash gives the same remainder mod 4 and mod 5. Over every 20 hash values, that holds for 4 of them (0, 1, 2 and 3). So 20 percent of entries stay put and 80 percent are now on the wrong machine.

The hit ratio drops to about 0.9 times 0.2 = 18 percent. Misses are 82 percent of 4,000, which is 3,280 per second, about 8 times the 400 before. The reverse index gets an eightfold load spike. With consistent hashing, adding the fifth machine moves only about 1 in 5 keys.

## What goes wrong: the thundering herd
A very popular query expires. Within the same second, thousands of requests miss together and all go to the index. The Facebook memcache paper describes this herd and a fix: a server hands out one lease token per key about every 10 seconds, and other clients wait briefly and retry, so one client refills the entry. The paper reports a peak database rate of 17,000 queries per second for the affected keys without leases and 1,300 with them. The symptom in your system is a sawtooth: the miss rate and index latency spike on a regular beat. Confirm it by checking hit and miss counters. Redis exposes `keyspace_hits` and `keyspace_misses` in `INFO`.

## Alternatives considered
The first alternative is no cache and a faster index. If most queries are unique (a long tail), almost every lookup misses and the cache costs memory for nothing. Personalized results need the user in the key, so sharing disappears. Live data, like scores updated every second, expires before it is reused. In those cases make the index itself faster, or cache a smaller shared piece such as the document snippets.

When caching does pay, the choice is how to spread it. A cache per machine is simple but has a low hit rate. A full copy on every machine wastes memory. The sharded cache is more work, but the worked example shows what it protects: a plain `hash mod N` reshuffle sent eight times the load to the index. We pay for sharding with consistent hashing.

```card Query Cache
Requirements | Answer popular searches from memory, fall back to the index on a miss, drop old entries when memory is full and stay highly available.
Scale | The Primer's assumptions give 10 million users, 10 billion queries a month (about 4,000 per second) and 270 bytes per cached entry.
Key decision | An LRU cache (hash table plus doubly linked list) sharded across machines with consistent hashing, and entries that expire by TTL.
Main risk | A hot entry expiring sends a herd of identical misses to the index, and resharding with hash mod N throws most of the cache away.
```

## Common mistake
Forgetting to normalize the query before it becomes a key, so one search is stored as five different entries.

```resources
article | Design a key-value cache to save the results of the most recent web server queries (solution) | https://github.com/donnemartin/system-design-primer/blob/master/solutions/system_design/query_cache/README.md | Donne Martin | The design this lesson adapts: LRU with a hash table and linked list, and the three ways to spread a cache.
paper | Scaling Memcache at Facebook | https://www.usenix.org/system/files/conference/nsdi13/nsdi13-final170_update.pdf | Nishtala et al. | Describes consistent hashing across memcached servers and leases for stale sets and thundering herds.
docs | Redis key eviction | https://redis.io/docs/latest/develop/reference/eviction/ | Redis | Lists the eviction policies and recommends allkeys-lru as a good default when some keys are hot.
article | Top 8 Cache Eviction Strategies | https://bytebytego.com/guides/top-8-cache-eviction-strategies/ | ByteByteGo | A quick comparison of LRU, LFU and other policies.
```

```quiz
Why does an LRU cache pair a hash table with a doubly linked list? | The table finds a key fast and the list reorders it fast ; The table sorts the keys and the list hashes them ; The list stores the data and the table stores the TTL | 0 | Lookup needs the table, while moving and removing nodes in constant time needs a list with two-way links.
Four cache machines become five and placement changes from hash mod 4 to hash mod 5. About what share of entries stay on their machine? | 80 percent ; 50 percent ; 20 percent | 2 | Only 4 of every 20 hash values give the same remainder, so 20 percent stay.
A hot cached query expires and the index is flooded for a second. What helps most? | Shrink the cache so entries expire sooner ; Let one client refill while others wait ; Double the TTL of every entry in the cache | 1 | A lease or request coalescing lets one request refill the entry and stops the herd.
```

```story
At 9 a.m. a celebrity name starts trending and every user searches it. The first request misses, the index starts working, and ten thousand more requests miss before it answers. A cache that lets one request refill the entry turns ten thousand index calls into one.
```

```adapted
The System Design Primer | https://github.com/donnemartin/system-design-primer | CC BY 4.0
```

# sales-rank | Design Sales Rank by Category | 3 | 12
A store wants a "best sellers this week" list for every category, refreshed every hour. Reads vastly outnumber writes, so the design computes the ranking in a batch job and serves it from a small, cached table.

## Try it first
Answer these before reading on. How would you count units sold per product and category over the last seven days? Does a ranking page need to be exact to the second? Where should the work happen, at read time or in a background job?

## Requirements and estimates
The Primer scopes only the ranking part of an e-commerce site. The service calculates the past week's most popular products by category, and users view them. Assumptions: results update hourly (popular products may need more often), 10 million products, 1,000 categories, 1 billion transactions per month, 100 billion reads per month. An item can be in several categories but cannot change category, and there are no subcategories.

A transaction record holds a time (5 bytes), product id (8), category id (4), seller id (8), buyer id (8), quantity (4) and total price (5). That is about 40 bytes.

| Quantity | Calculation | Result |
| --- | --- | --- |
| New log data per month | 40 bytes times 1 billion | 40 GB |
| In 3 years | 40 GB times 36 | 1.44 TB |
| Writes per second | 1 billion divided by 2.5 million | about 400 |
| Reads per second | 100 billion divided by 2.5 million | about 40,000 |

One more number: a week is about 1 billion times 7/30, so roughly 233 million transactions, or about 9 GB. Keep that in mind for the "wrong tool" section.

## API and data model
Reading: `GET /v1/popular?category_id=1234` returns a list of products with `product_id` and `total_sold`, best first. The Primer stores results in a `sales_rank` table with `id`, `category_id`, `total_sold` and `product_id`, indexed so a lookup by category does not scan the whole table. A tighter design stores only the top 100 per category: 1,000 categories times 100 is 100,000 rows. That table fits in memory many times over.

## High-level design
In words: the Sales API writes each sale as a log line to an object store (AWS S3). Every hour the Sales Rank Service runs a MapReduce job over the log files and writes a fresh `sales_rank` table in a SQL database. Readers go client, then web server, then Read API, then a memory cache, then the table. Splitting the slow batch path from the fast read path is the key idea. See [message queues](/sd/docs/async/message-queues) and [event streams](/sd/docs/async/event-streams) for the live alternative.

```mermaid Sales are logged, an hourly batch job builds the rank table, and reads come from a cache
flowchart TD
  S[Sales API] -->|log lines| OS[(Object store)]
  OS --> MR[Sales Rank Service]
  MR -->|hourly| T[(sales_rank table)]
  U[User] --> R[Read API]
  R --> C[(Memory cache)]
  C -.->|on a miss| T
```

## How the batch job works
MapReduce splits work into a map step that turns each input line into key and value pairs, and a reduce step that combines all values for one key. In between, the framework moves pairs so equal keys meet on one machine (the shuffle) and sorts them. Google's MapReduce paper notes that keys are divided between reduce tasks with a function like `hash(key) mod R`, and each reduce task sees its keys in sorted order.

The Primer uses two steps. Step one maps each line within the past week to `(category, product), quantity` and reduces by summing. Step two flips the key to `(category, total)` so the framework's sort orders products inside each category.

```python
import time
from mrjob.job import MRJob, MRStep

WEEK = 7 * 24 * 3600

class SalesRanker(MRJob):
    def mapper(self, _, line):
        ts, product, category, qty = line.split('\t')[:4]
        if time.time() - int(ts) <= WEEK:
            yield (category, product), int(qty)

    def reducer(self, key, values):
        yield key, sum(values)

    def mapper_sort(self, key, total):
        category, product = key
        yield (category, total), product

    def reducer_identity(self, key, products):
        for product in products:
            yield key, product

    def steps(self):
        return [MRStep(mapper=self.mapper, reducer=self.reducer),
                MRStep(mapper=self.mapper_sort, reducer=self.reducer_identity)]
```

The Primer's own sample code has small slips (a syntax error, an undefined helper, and `self.mr`, which current versions of the mrjob library no longer have), so this version is rewritten for current mrjob. The worked example below traces it by hand on six sample lines. `reducer_identity` passes pairs through unchanged. The `time` field is assumed to be epoch seconds.

One trap in the second step. The framework sorts keys only inside each reduce task, and it chooses the task by hashing the whole key. With the key `(category, total)`, rows of one category can land on different tasks, so the output is sorted per task, not per category: with two reduce tasks, rows of c1 can come out split around rows of c2. For a true per-category order, partition on the category alone with a custom partitioner so one category goes to one task. Also, text-based setups compare keys as text, where 10 sorts before 9, so use numbers or zero-padded totals.

## A worked example: six log lines
Take the Primer's tab-separated sample, written as product, category, quantity: p1 c1 2, p1 c2 2, p1 c2 1, p2 c1 3, p3 c2 7, p4 c1 1.

1. Map and sum by (category, product): (c1,p1)=2, (c2,p1)=3, (c1,p2)=3, (c2,p3)=7, (c1,p4)=1.
2. Flip keys to (category, total): (c1,2) p1, (c2,3) p1, (c1,3) p2, (c2,7) p3, (c1,1) p4.
3. Sort: (c1,1) p4, (c1,2) p1, (c1,3) p2, (c2,3) p1, (c2,7) p3.

Read each category from the end. Category c1's best seller is p2 with 3 units, then p1 with 2. Category c2's best is p3 with 7. Product p1 appears in both categories with different totals, which is why the category is part of the key. At full scale the same steps run in parallel on many machines, although at this lesson's numbers (about 9 GB a week) one machine would do, as the last section notes.

```mermaid Two MapReduce steps turn the six log lines into ordered totals per category
flowchart TD
  L[Six log lines] --> M1[Sum by category and product]
  M1 --> M2[Flip key to category and total]
  M2 --> SO[Shuffle sorts the keys]
  SO --> O[Totals in order per category]
```

## Serving reads and freshness
Forty thousand reads per second against 100,000 ranking rows is a perfect cache workload. Put the lists in a memory cache with a TTL near the refresh period, and even a CDN can hold them. A SQL read replica handles misses. Writes are only the hourly job, so write scaling is easy, but the raw log still grows, so keep recent data hot and archive older files in the object store or a data warehouse such as AWS Redshift or Google BigQuery. The Primer's 400 writes per second to the transaction store may strain one primary, so it lists [sharding](/sd/docs/data/sharding) and NoSQL.

Freshness is a trade-off. Hourly is cheap and good enough for a "this week" list. For hot products, a stream of sale events can keep live counters, and the batch job remains the source of truth that corrects them.

## What goes wrong: overlapping runs
Logs grow and the hourly job starts taking 70 minutes. The next run starts while the last is still writing. Two jobs write into one table: some rows come from run A, some from B, and pages show a ranking that never existed. A reader may even see an empty category in the middle of a rewrite.

The symptom is odd lists and a `computed_at` timestamp that falls behind. Confirm it by comparing job durations with the schedule. The fix is to write into a new table (or version number) and switch readers over in one step when it is complete, and to refuse to start a run while another is active. MapReduce also copes with slow machines: the paper describes backup tasks that rerun the last few stragglers.

## Alternatives considered
About 9 GB of one week's log fits on one machine, and a warehouse can answer `SUM(quantity) ... GROUP BY category_id, product_id` over the last seven days with one query. At this lesson's numbers that is the simpler choice. Reach for MapReduce style jobs when data is far larger than one machine, or when you already run such a cluster.

If you need the rank within seconds of each sale, stream processing is the right tool and the batch design is wrong. A middle road keeps live counters for hot products and lets the batch job correct them.

```card Sales Rank
Requirements | Show each category's best sellers of the past week, refreshed hourly, to many readers, and stay highly available.
Scale | The Primer's assumptions give 1 billion transactions a month (400 writes per second), 40,000 reads per second and 40 GB of new log a month.
Key decision | Count in an hourly batch job and serve the top 100 products per category from a cached table.
Main risk | A run that takes longer than the hour overlaps the next one, and readers see a half-written ranking.
```

## Common mistake
Ranking by total on the read path with `ORDER BY` over the whole transaction table for every request, instead of precomputing it.

```resources
article | Design Amazon's sales rank by category (solution) | https://github.com/donnemartin/system-design-primer/blob/master/solutions/system_design/sales_rank/README.md | Donne Martin | The design this lesson adapts: log files, a two-step MapReduce, the sales_rank table and the scaling notes.
paper | MapReduce: Simplified Data Processing on Large Clusters | https://research.google.com/archive/mapreduce-osdi04.pdf | Dean and Ghemawat | Explains map, reduce, hash partitioning, sorted reduce input, combiners and backup tasks for stragglers.
article | Cache Systems Every Developer Should Know | https://bytebytego.com/guides/cache-systems-every-developer-should-know/ | ByteByteGo | A broad picture of where caches sit, which helps with the read side of this design.
```

```quiz
Why does the Primer's second step flip the key to (category, total)? | The reducer needs numeric keys in order to add values ; Sorting by key orders totals inside each category ; It compresses the log before it is stored | 1 | The shuffle sorts by key, so putting the total in the key gives a free distributed sort.
Log lines are p1 c1 5, p1 c1 2, p2 c1 4. Which product leads category c1? | Both are tied at 5 ; p2, with 4 units ; p1, with 7 units | 2 | The first step sums p1 to 7, which beats p2's 4.
The hourly job now takes 70 minutes. What is the best fix? | Write to a new table, then switch ; Run the job twice as often to catch up ; Remove the cache so readers see fresh rows | 0 | Versioned output with a single switch stops readers from seeing mixed or half-written rankings.
```

```story
A shop shows "Top sellers" on its home page, and the first version sorted a billion-row table on every page view. The database fell over on Black Friday. Moving the counting to an hourly background job turned each page view into one cheap lookup.
```

```adapted
The System Design Primer | https://github.com/donnemartin/system-design-primer | CC BY 4.0
```

# social-graph | Design the Data Structures for a Social Graph | 3 | 12
A social network can find the shortest chain of friends between two people with a breadth-first search. When the graph is too big for one machine, the people are sharded and every hop becomes a network call, so the design is about cutting hops.

## Try it first
Answer these before reading on. How would you find the shortest friend chain between two people? How many people might you touch? If the friend lists live on different machines, what does each step of your search cost?

## Requirements and estimates
The Primer's use case: a user searches for someone and sees the shortest path to that person, with high availability. Traffic is uneven, since some searches are popular and many run once. The graph does not fit on one machine, edges are unweighted (every friendship counts as one hop), and the Primer says to use traditional systems, not a graph database. Assume 100 million users, 50 friends each, and 1 billion searches a month.

| Quantity | Calculation | Result |
| --- | --- | --- |
| Friend relationships | 100 million times 50 | 5 billion entries |
| Searches per second | 1 billion divided by 2.5 million | about 400 |

Honest check: friend ids alone at 8 bytes each are 5 billion times 8 = 40 GB. That is borderline for one large machine. Add names and profile data, replicas for availability, and the larger networks real companies have, and one machine stops being enough. The exercise states it as a given.

## API and data model
Search is `GET /v1/friend_search?person_id=1234`, returning the people on the path in order, each with `person_id`, `name` and a profile link. Each person is stored as `id`, `name` and a list `friend_ids` (an adjacency list, meaning each node stores its neighbors). Person servers hold shards of these records.

## High-level design
In words: client, web server, Search API, then the User Graph Service. For each person it needs, it asks the Lookup Service which Person Server holds that id (the Lookup Service is a map from person id to server). It then fetches the friend ids from that Person Server, and repeats. Person ids are placed by [sharding](/sd/docs/data/sharding). Facebook's TAO paper gives a real version: each object id contains a shard id, and an association (a friendship edge) is stored on the shard of its first id, so a query for one person's friends is served by one server.

```mermaid A search asks the lookup service which person server holds each id, then fetches that person's friends
flowchart TD
  C[Client] --> WS[Web server]
  WS --> SA[Search API]
  SA --> UG[User Graph Service]
  UG --> LS[Lookup Service]
  UG --> P1[(Person server 1)]
  UG --> P2[(Person server 2)]
```

## Breadth-first search
BFS explores in rings: you, then your friends, then friends of friends. A queue holds the people to visit. A `prev` map records who we came from and doubles as the visited set. The first time we reach the target, we have a shortest path, because we visit people in order of distance.

```python
from collections import deque

def shortest_path(friends_of, source, dest):
    if source == dest:
        return [source]
    prev = {source: None}
    queue = deque([source])
    while queue:
        person = queue.popleft()
        for friend in friends_of(person):
            if friend in prev:
                continue
            prev[friend] = person
            if friend == dest:
                path = [dest]
                while prev[path[-1]] is not None:
                    path.append(prev[path[-1]])
                return path[::-1]
            queue.append(friend)
    return None
```

On one machine `friends_of` reads memory. In the distributed design it asks the Lookup Service and a Person Server, so each call is a network round trip.

```mermaid One ring of the search: group the ids by server, then make one call per server
sequenceDiagram
  participant U as User Graph Service
  participant L as Lookup Service
  participant P1 as Person server 1
  participant P2 as Person server 2
  U->>L: which server holds each id in this ring
  L-->>U: ids 4 and 9 on server 1, id 7 on server 2
  U->>P1: friends of 4 and 9
  U->>P2: friends of 7
  P1-->>U: friend ids
  P2-->>U: friend ids
  Note over U: next ring is these ids minus visited
```

## A worked example: how many people we touch
With 50 friends per person, the number of people at each ring is at most: 50, then 2,500, then 125,000, then 6.25 million, then 312 million. Overlap among friends makes real counts smaller, but the growth is the point. In 2016 Facebook reported an average distance of 4.57 steps among 1.59 billion active users (3.57 people in between), so typical searches go four or five rings deep.

A one-sided search to depth 4 may touch 50 + 2,500 + 125,000 + 6,250,000 = about 6.4 million people. Each is a possible network call.

Now search from both ends at once, two rings from each side, and stop when the sets meet. Each side touches 1 + 50 + 2,500 = 2,551 people, so about 5,100 in total. That finds the same paths of length 4 with about 1,250 times less work. This is the Primer's "two BFS searches at the same time" idea.

## Cutting hops and scaling
The Primer lists several optimizations. Cache person data in Redis or Memcached, which helps people who search repeatedly and well-connected people ([caching basics](/sd/docs/caching/caching-basics)). Cache full or partial BFS results, or compute them offline and store them in a NoSQL database. Batch friend lookups so one call per Person Server fetches all friends hosted there (explore a whole ring at once, grouped by server). Start from people with many friends, since they shorten paths. Set a limit on time or hops and ask the user whether to keep searching. And with no constraint against it, a graph database such as Neo4j.

## What goes wrong: the celebrity node
One account has 20 million friends. A search that reaches that person adds 20 million people to the next ring. The batches fan out to every Person Server, and one search can hold shared servers for seconds. Other users see slow responses, and p99 latency spikes only for searches that pass through well-known people.

Confirm it by logging the frontier size per ring and server calls per request, then looking at the slowest requests. Mitigations are a hop or time budget, skipping extreme nodes in the first pass, and caching their adjacency lists separately.

## Alternatives considered
The Primer asks for traditional systems, but a graph database such as Neo4j is built for this and is the first alternative to weigh if you run many graph queries of many shapes. If you only need friends of friends (two hops), an indexed table and a join is simpler. If edges have weights, such as travel time, BFS is wrong and you need Dijkstra's algorithm. For whole-graph analytics, such as computing every distance, use a batch graph processing job instead of live queries.

Inside our design, a one-sided search to depth 4 may touch 6.4 million people, while searching from both ends touches about 5,100. That is why we search from both ends.

```card Social Graph
Requirements | Find the shortest friend chain between two people, show the people on the path and stay highly available.
Scale | The Primer's assumptions give 100 million users with 50 friends each (5 billion entries) and about 400 searches per second.
Key decision | Person records sharded across servers with a lookup service, searched by breadth-first search from both ends with batched lookups.
Main risk | A search that reaches an account with millions of friends floods the next ring and slows everyone who shares those servers.
```

## Common mistake
Skipping the visited set. Friendship goes both ways, so A leads to B leads back to A, and the search loops forever.

```resources
article | Design the data structures for a social network (solution) | https://github.com/donnemartin/system-design-primer/blob/master/solutions/system_design/social_graph/README.md | Donne Martin | The design this lesson adapts: person servers, a lookup service, BFS and the list of optimizations.
paper | TAO: Facebook's Distributed Data Store for the Social Graph | https://www.usenix.org/system/files/conference/atc13/atc13-bronson.pdf | Bronson et al. | Describes sharding with shard ids inside object ids, edges stored on the shard of their first id, and leader and follower cache tiers.
article | Three and a half degrees of separation | https://research.facebook.com/blog/2016/2/three-and-a-half-degrees-of-separation/ | Meta Research | Reports an average distance of 4.57 among 1.59 billion active people, which shows how shallow the searches are.
```

```quiz
Why does BFS find a shortest path in an unweighted graph? | It sorts friends by how many friends they have ; It always picks the friend closest to the target ; It visits people by distance from the source | 2 | Rings are explored in order, so the first time the target appears is at the minimum number of hops.
With 50 friends each, about how many people does a bidirectional search touch for a 4-hop path, searching 2 rings from each end? | About 5,100 ; About 125,000 ; About 6.4 million | 0 | Each side touches 1 + 50 + 2,500 = 2,551, so roughly 5,100 in total.
Searches that pass through one very popular account are slow. What is a sensible first fix? | Move every person to one big machine ; Cap the hops and cache its friends ; Remove the visited set so it moves faster | 1 | A budget limits the damage, and caching removes repeated fetches of the largest lists.
```

```story
Two strangers at a conference wonder how they are connected. The app answers in half a second: "You and Priya share a friend, who knows Arjun, who works with Meera." Behind that answer, a search spread across dozens of machines and stopped as soon as the two sides met in the middle.
```

```adapted
The System Design Primer | https://github.com/donnemartin/system-design-primer | CC BY 4.0
```

# personal-finance | Design a Personal Finance App | 3 | 15
A personal finance app links to a user's bank accounts, pulls new transactions every day, sorts them into categories and warns the user near a budget limit. The load is mostly writes, so it is a queue-and-worker pipeline, and it holds data that must be guarded very carefully.

## Try it first
Answer these before reading on. How will your app read someone's bank account without learning their bank password? What happens if the bank is slow, or sends the same transaction twice? Which part of the system, if leaked, hurts users most?

## Requirements and estimates
The Primer calls its version Mint.com. Intuit shut Mint down in March 2024 and moved its users to Credit Karma, but the design problem is the same for any budgeting app. Use cases: a user connects a financial account. The service extracts transactions, updating daily, and categorizes them (the user may override a category, and nothing is re-categorized automatically). It analyzes monthly spending by category. It recommends a budget, lets users set their own, and sends a notification when they approach or exceed it. It must be highly available.

Assumptions: daily updates only for users active in the past 30 days, accounts are rarely added or removed, and notifications need not be instant. There are 10 million users, 30 million financial accounts, 50,000 known sellers, 10 budget categories per user (100 million budget items), 5 billion transactions a month and 500 million reads a month. That is write-heavy, about 10 writes per read.

A transaction row holds user id (8 bytes), time (5), seller (32) and amount (5), about 50 bytes.

| Quantity | Calculation | Result |
| --- | --- | --- |
| New data per month | 50 bytes times 5 billion | 250 GB |
| In 3 years | 250 GB times 36 | 9 TB |
| Transactions per second | 5 billion divided by 2.5 million | about 2,000 |
| Reads per second | 500 million divided by 2.5 million | about 200 |

## API and data model
Linking: `POST /v1/account` with the user and a way to prove they authorized access. The Primer posts a login and password to this endpoint, and its `accounts` table stores a password hash. Both are weak for a bank link. A hash cannot be reversed to log in to the bank, so it would be useless, and handling raw bank passwords is dangerous. In practice you use an aggregator or a bank API with OAuth: the user signs in at the bank's own site or app, and your side ends up with a token that the user can revoke, not their password. With an aggregator such as Plaid, the aggregator holds the bank's authorization and your app gets Plaid's own access token. Plaid's documentation says OAuth lets users grant access without sharing credentials with the third party.

Tables: `accounts` (user, provider, encrypted token, last update), `transactions` (id, user, account, bank transaction id, time, seller, amount as a decimal, never a float), `monthly_spending` (user, month, category, amount) and `budget_overrides`. The Primer budgets with a template based on income tiers, for example 40 percent housing and 20 percent food, so only user overrides are stored, which avoids 100 million rows.

## The write pipeline
The Primer pulls transactions asynchronously through a queue, because a bank call can be slow. See [message queues](/sd/docs/async/message-queues) and [background jobs](/sd/docs/async/background-jobs).

1. A refresh job is queued when an account is first linked, when the user taps refresh, and daily for recently active users.
2. A Transaction Extraction worker pulls the job and fetches transactions from the bank, saving raw files to an object store.
3. The Category Service labels each transaction.
4. The Budget Service updates the month's totals and, through the Notification Service, warns if a limit is near or passed.
5. Workers write the `transactions` and `monthly_spending` rows, then a notification tells the user the refresh finished, sent through another queue.

Plaid offers a pull-by-cursor alternative: after you sync with a cursor, it sends a `SYNC_UPDATES_AVAILABLE` webhook (a call from their server to yours) when anything changes, and you fetch changes since your last cursor.

```mermaid Refresh jobs go through a queue, so slow bank calls never block a user
flowchart TD
  T[Refresh trigger] --> Q[Job queue]
  Q --> TE[Extraction workers]
  TE -->|fetch| BK[Bank or aggregator]
  TE --> OS[(Raw files)]
  TE --> CAT[Category Service]
  CAT --> BS[Budget Service]
  BS --> DB[(SQL database)]
  BS --> NQ[Notification queue]
```

Categorizing: seed a dictionary of seller to category for common sellers. 50,000 sellers at under 255 bytes each is about 12 MB, so it sits in memory. For new sellers, use the categories users chose manually, taking the most common choice. Budget alerts: compare the month total to the limit when totals change.

```python
def categorize(seller, seeded, user_votes):
    if seller in seeded:
        return seeded[seller]
    votes = user_votes.get(seller)
    return max(votes, key=votes.get) if votes else None

def crossed(old_total, new_total, limit, steps=(0.8, 1.0)):
    return [s for s in steps if old_total < s * limit <= new_total]
```

## A worked example: sizing the workers
Suppose 30 percent of the 30 million accounts are active, so 9 million refreshes a day (invented). Spread over 24 hours that is 9,000,000 divided by 86,400 = about 104 jobs per second. Say each bank call takes 3 seconds (invented). By Little's law, in-flight jobs equal rate times time, so 104 times 3 = about 312 workers busy at once.

Each account sees about 6 new transactions a day (2,000 per second times 86,400 is 173 million a day, divided by 30 million accounts). Check the budget rule: limit 200, month total goes from 150 to 170. `crossed` tests 0.8 times 200 = 160, and 150 is below 160 and 160 is at most 170, so one alert fires. Later, 170 to 190 fires nothing, since the step was already passed. Then 190 to 210 crosses 200 and fires the second.

```mermaid A retry after a crash is harmless when a unique key rejects the repeated bank transaction ids
sequenceDiagram
  participant Q as Queue
  participant W as Worker
  participant DB as Database
  Q->>W: refresh account 17
  W->>DB: insert transactions
  Note over W: crash before the acknowledgement
  Q->>W: same job again
  W->>DB: insert the same transactions
  DB-->>W: duplicates ignored by the unique key
```

## Scaling the design
Reads are only 200 per second, so put session data, monthly totals and recent transactions in a memory cache and use cache-aside ([cache patterns](/sd/docs/caching/cache-patterns)). Keep about a month of transactions in the SQL database and older data in a data warehouse or the object store. SQL read replicas serve cache misses. The 2,000 writes per second at peak may strain one primary, so [shard](/sd/docs/data/sharding) by user id. Then all of one user's rows share a shard, and the budget queries stay on one machine. NoSQL is another option.

## What goes wrong: double counting
A worker crashes after writing transactions but before acknowledging the job. The queue delivers it again ([delivery guarantees](/sd/docs/async/delivery-guarantees)). The second run adds the same transactions to the monthly total. The user sees spending higher than the bank statement, and gets a false "over budget" alert.

Confirm it by summing one user's `transactions` for the month and comparing with `monthly_spending`. If they differ, a total was added twice. The fix is a unique key on account and bank transaction id so reruns do nothing, and totals computed from the transactions rather than incremented blindly. Also handle expired links: when a bank asks the user to sign in again, mark the account and ask them, rather than retrying forever.

## Security of financial data
Protect tokens and data in transit and at rest. OWASP recommends envelope encryption: a data key encrypts the data, and a separate key encryption key (kept on another system) encrypts the data key, so one stolen database is not enough. Keep tokens in their own store with narrow access, never log them, and audit every read. Financial rules differ by country, so check the ones that apply to you.

## Alternatives considered
A queue gives delay, which suits a daily refresh. It does not suit a card payment or a fraud check that must answer the user in the same request. Those need a synchronous call with a timeout. At a few thousand users, a cron job and one database are enough, and the queue is extra machinery.

For bank access, do not build login scraping yourself when an aggregator or bank API exists. For updates, polling every account daily is simple, while the webhook and cursor route fetches only what changed. For totals, incrementing a counter on every run is fast but breaks under retries. Computing totals from the unique transactions is safer.

```card Personal Finance App
Requirements | Link bank accounts, pull and categorize transactions daily, show monthly spending, set budgets and warn when a limit is near.
Scale | The Primer's assumptions give 10 million users, 5 billion transactions a month (about 2,000 per second) and 500 million reads a month.
Key decision | A queue and worker pipeline with bank access through OAuth tokens, and a unique key per bank transaction so reruns do nothing.
Main risk | Double counting after a retried job, and a leak of the stored bank tokens.
```

## Common mistake
Storing money as floating-point numbers, where 0.1 plus 0.2 is not exactly 0.3, so totals drift by cents.

```resources
article | Design Mint.com (solution) | https://github.com/donnemartin/system-design-primer/blob/master/solutions/system_design/mint/README.md | Donne Martin | The design this lesson adapts: the extraction queue, categorizer, budget service and scaling notes.
docs | Plaid Link OAuth guide | https://plaid.com/docs/link/oauth/ | Plaid | States that OAuth lets users grant access to their data without sharing credentials with the third party.
docs | Plaid Transactions webhooks | https://plaid.com/docs/transactions/webhooks/ | Plaid | Explains the update webhook and fetching changes with a cursor, plus forcing a refresh.
docs | Cryptographic Storage Cheat Sheet | https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html | OWASP | Describes data and key encryption keys and keeping them apart.
```

```quiz
Why does the Primer put transaction extraction behind a queue? | Bank calls are slow, so run them later ; The database cannot store raw bank files ; Users need to see results within one request | 0 | A queue lets the web request return quickly while workers fetch from the bank at their own pace.
About 104 refresh jobs start per second and each takes 3 seconds. How many workers are busy at once? | About 35 ; About 312 ; About 3,000 | 1 | In-flight work is rate times duration, 104 times 3.
A retried job double counts spending. Which fix is best? | Raise the budget limit for every user ; Lower the refresh frequency to weekly ; A unique key per bank transaction | 2 | The key makes a rerun a no-op, so totals stay correct under at-least-once delivery.
```

```story
A user links her bank on Monday and gets a message on Friday: "You have used 85 percent of your food budget." She had forgotten the weekend dinners. The alert came from a worker that pulled her transactions overnight, tagged each seller, and noticed that the total crossed 80 percent of her limit.
```

```adapted
The System Design Primer | https://github.com/donnemartin/system-design-primer | CC BY 4.0
```
