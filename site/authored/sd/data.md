# sql-vs-nosql | Relational vs NoSQL | 1 | 12
A relational database stores data in tables and gives you strong guarantees. NoSQL databases trade some of that for flexibility or scale, and come in four families. You choose by looking at how your application reads and writes, before looking at the brand names.

## The relational model
A relational database (also called RDBMS or SQL database) keeps data in tables of rows and columns. Tables link to each other with keys, and you combine them with a join. A query language, SQL, lets you ask for almost any combination of that data.

Relational databases promise a set of properties called ACID for each transaction, which is a group of changes treated as one unit.

1. Atomicity: a transaction is all or nothing.
2. Consistency: a transaction moves the database from one valid state to another, and rules you have declared, like "balance cannot be negative", are never broken by a committed transaction.
3. Isolation: running transactions at the same time gives the same result as running them one by one.
4. Durability: once a transaction is committed, it stays committed, even after a crash.

The last lesson in this chapter, [Transactions and Isolation](/sd/docs/data/transactions-and-isolation), shows what these promises cost and where they bend.

## The four NoSQL families
NoSQL is a loose label for databases that are not relational tables. Data is usually denormalized, which means copies of facts are stored together so that you rarely need joins. Joins, when you need them, happen in application code. Many NoSQL stores skip full ACID transactions, or limit them to a single record. Some, like MongoDB and DynamoDB, now offer transactions across records, usually at a cost in speed. Most lean toward eventual consistency, where all copies agree after a short delay. This is a different meaning from the C in ACID, which is about rules, not about copies agreeing. A common summary is BASE: basically available, soft state, eventually consistent. See [CAP and PACELC](/sd/docs/distributed/cap-and-pacelc) for why.

| Family | Mental model | Real example | Good fit |
| --- | --- | --- | --- |
| Key-value | A giant hash table | Redis | Caches, sessions, counters |
| Document | Key-value where the value is a JSON-like document you can query inside | MongoDB | Product catalogs, user profiles |
| Wide-column | Rows with a key, and columns grouped into families, kept sorted by key | Cassandra, Bigtable | Huge write-heavy data, time series |
| Graph | Nodes and the relationships between them | Neo4j | Social networks, recommendations |

Key-value stores give very fast reads and writes by key and little else. If you need more, the application must supply it. Document stores keep everything about one object in one place, and different documents may have different fields. Wide-column stores such as Bigtable and HBase keep keys in order, so range reads are efficient, and Cassandra sorts rows inside each partition. Graph databases make "friends of friends" cheap, where a relational database would need many self-joins.

The lines blur. DynamoDB handles both key-value and document data, and many key-value stores can look inside values.

```mermaid One question, two shapes: a cart read joins three tables in SQL and is one lookup as a document
flowchart LR
  subgraph SQL
    Q1[Cart query] --> J[Join] --> T1[(carts)]
    J --> T2[(cart_items)]
    J --> T3[(products)]
  end
  subgraph Document
    Q2[Cart query] --> D[(cart:42 document)]
  end
```

## Reasons to pick each
These lists are adapted from the System Design Primer.

Reasons for SQL: structured data, a strict schema, relational data, a need for complex joins, transactions, clear patterns for scaling, a large community and many tools, and very fast lookups by index.

Reasons for NoSQL: semi-structured data, a flexible schema, non-relational data, no need for complex joins, many terabytes or petabytes of data, a very data-intensive workload, and very high throughput for I/O operations per second.

NoSQL fits well for rapid intake of clickstream and log data, leaderboards and scores, temporary data like a shopping cart, hot tables that are read constantly, and metadata or lookup tables.

The honest tie-breaker is the access pattern: the list of queries your app runs, and how often. Write that list first. Then ask which database answers each query with one lookup.

## A worked example: a shopping cart both ways
Feature: show a user their cart. Invented load: 5,000 cart reads per second, 500 writes per second, carts that expire after 30 days.

Relational model, three tables: `users`, `carts` (one per user) and `cart_items` (cart_id, product_id, quantity). Showing a cart is a join of `carts`, `cart_items` and `products` to get names and prices. That is one SQL query, and ACID keeps the stock count and cart in step when the user checks out. Cost: every read does a join and several index lookups.

Document model: one document per user in a store like MongoDB, keyed by user id. It holds the item list with product name and price copied in. Showing a cart is one lookup by key, with no join. Cost: if a product's price changes, the copies inside carts are stale until you update them. For a cart that is acceptable. For an invoice it would not be.

Key-value model: key `cart:42`, value a JSON string, with a 30 day expiry set by the store. This is the cheapest and fastest, and expiry comes for free. Cost: you cannot ask "which carts contain product 9" without scanning everything.

Pick by access pattern. Only ever read a cart by user id? Key-value or document wins. Need reports across carts and orders in the same system? Relational wins.

The cart example on the same points.

| | Relational | Document | Key-value |
| --- | --- | --- | --- |
| Show the cart | Join carts, cart_items and products | One lookup by user id | One lookup of cart:42 |
| Strength | ACID keeps stock and cart in step, and reports across carts and orders work | No join, one read | Cheapest and fastest, 30 day expiry comes free |
| Cost | Every read does a join and several index lookups | Copied prices go stale until updated | Cannot ask which carts hold product 9 without scanning everything |

## What goes wrong: a join-heavy report on a store with no joins
```mermaid The report loops over every order and asks the other collection once per row
sequenceDiagram
  participant Job as Report job
  participant O as Orders store
  participant P as Products store
  Job->>O: fetch all orders
  O-->>Job: every order
  loop each order
    Job->>P: category of product 9
    P-->>Job: category
  end
  Note over Job,P: One extra query per order, and no join to save them
```

A team moves orders to a document store because "it scales". Months later finance asks for revenue by product category by week. Orders hold product ids, and categories live in another collection. This store has no join (or only a slow, limited one), so the code fetches every order and asks for the category one order at a time. The symptom is a report job that takes hours and grows with data size. You confirm it by looking at the query log: one query per order, thousands of them. The fix is a pre-computed summary, a second database for analytics, or going back to SQL for this data.

## When NoSQL is the wrong tool
Skip it when your data is relational and you need transactions across several rows, like money moving between accounts. Skip it when requirements are still unknown, because ad hoc SQL queries are the cheapest way to explore. Skip it when your data fits on one machine. A single PostgreSQL or MySQL server handles more than many products ever need, and it is simpler to run. Measure your own load before assuming you have outgrown it.

## Common mistake
Choosing NoSQL because it sounds more scalable, without writing down the queries. Relational databases scale with the tools in the next lessons, and a wrong choice here is expensive to undo.

```resources
article | System Design Primer: SQL or NoSQL | https://github.com/donnemartin/system-design-primer#sql-or-nosql | Donne Martin | The reasons-for lists and the four NoSQL families that this lesson adapts.
article | System Design Primer: NoSQL | https://github.com/donnemartin/system-design-primer#nosql | Donne Martin | Describes key-value, document, wide-column and graph stores and BASE.
docs | MongoDB data modeling introduction | https://www.mongodb.com/docs/manual/core/data-modeling-introduction/ | MongoDB | States that the flexible schema lets you map the data model directly to objects in your code.
paper | Dynamo: Amazon's Highly Available Key-value Store | https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf | DeCandia et al. | The paper that shaped many key-value and wide-column designs.
```

```quiz
Your app only ever reads a shopping cart by user id and carts expire after 30 days. Which fits best? | A key-value store with an expiry on each key ; A graph database with a node for each cart ; A relational database that joins tables on every cart read | 0 | A lookup by one key with a built-in expiry matches the whole access pattern. A relational cart works but pays for a join on every read that this access pattern never needed.
Which need is the strongest reason to stay relational? | Storing petabytes of clickstream logs quickly ; Keeping a leaderboard of scores in memory ; Moving money between two accounts atomically | 2 | Multi-row transactions with ACID are the classic strength of a relational database.
In the cart example, a product price changes. What happens with the document model? | Copies inside existing carts stay stale until updated ; The database rewrites every cart on its own ; Every read automatically joins to the product | 0 | Denormalized copies are not kept in sync for you.
```

```story
A team picks a document store because a blog post said it scales better. Six months later finance asks for revenue by category, and there are no joins to answer it. An engineer writes a loop that fetches every order, and it runs all night. Writing down the ten queries the app would run, before picking a database, would have shown that in an hour.
```

```adapted
The System Design Primer | https://github.com/donnemartin/system-design-primer | CC BY 4.0
```

# indexes | Indexes | 2 | 10
An index is an extra sorted structure that lets a database find rows without reading the whole table. It makes reads fast and writes slower, and the order of columns in it matters.

## What an index is
Without an index, the database reads a table row by row until it finds matches. This is a full table scan. The PostgreSQL manual compares an index to the alphabetic index at the back of a non-fiction book: you look the term up and flip to the right page.

The index is a separate structure that stores the indexed values in sorted order, with a pointer to each row. The author of Use The Index, Luke calls it pure redundancy: it takes its own disk space and holds a copy of some table data. Creating it does not change the table. The database keeps it up to date automatically when rows are inserted, updated or deleted.

Indexes are usually B-trees. A B-tree is a balanced tree with many keys in each node, so it is wide and shallow, and every leaf sits at the same depth. This is the default index type in PostgreSQL. Lookups, inserts and deletes all take a number of page reads that grows with the logarithm of the row count.

## How a B-tree lookup works
The database reads data in fixed-size blocks called pages (often 8 KB), and each node of the tree is one page. Take `SELECT * FROM users WHERE id = 8123456`, in a table of 10 million rows.

1. The database reads the root node, a page holding many keys (this lesson uses 100 to keep the maths easy). It finds the range that contains the id and follows that pointer.
2. It reads a branch node one level down and repeats.
3. It repeats until it reaches a leaf node. Leaves hold the sorted keys and pointers to table rows. They are linked in a list, so range queries just walk along them.
4. It follows the pointer to the row in the table and reads it.

```mermaid A B-tree lookup reads one page per level, 4 levels for 10 million rows, then one table row
flowchart TD
  R[Root page: 100 key ranges] -->|follow range| B1[Branch page: 100 key ranges]
  B1 -->|follow range| B2[Branch page: 100 key ranges]
  B2 -->|follow range| L[Leaf page: sorted keys and row pointers]
  L -->|row pointer| T[(Table row for id 8123456)]
  class L focus
```

Each level multiplies the reach by the fanout, the number of keys per node. So the depth is about the log of the row count, base fanout.

$$ \text{depth} \approx \lceil \log_{f}(n) \rceil $$

## Composite indexes and column order
An index on several columns is called composite or concatenated. It sorts by the first column, then by the second inside ties, like a phone book sorted by last name and then first name. A phone book does not help you find everyone named "Anna", and an index barely narrows a query on only the second column: the database still has to walk most of the index.

The PostgreSQL manual says a multicolumn B-tree is most efficient with constraints on the leading columns. Put equality columns first, then the range column. PostgreSQL 18 added an optimization called skip scan that can sometimes help, but the planner generally picks it only when the first column has few distinct values. Do not count on it.

Which queries an index on (country, created_at) can use.

| Query | Uses the sorted order? |
| --- | --- |
| WHERE country = 'IN' | Yes, the leading column is fixed |
| WHERE country = 'IN' AND created_at > '2026-01-01' | Yes, the best case: equality first, then a range |
| WHERE created_at > '2026-01-01' | No, the leading column is missing, so usually a full scan |
| ORDER BY created_at with no filter | No, the index is sorted by country first |

## Covering indexes
A normal index lookup also fetches the row from the table, often a random read far from the index entries. If the index holds every column the query needs, the database can answer from the index alone. PostgreSQL calls this an index-only scan, and B-tree indexes support it. A query that selects a column not in the index cannot use it. In PostgreSQL the table must also be mostly unchanged since its last cleanup, so rarely changed tables benefit most.

## The write cost
Every insert and delete must update every index, and so must any update that changes an indexed column. A table with five indexes means each insert changes six structures. The Primer's SQL tuning advice says the same: indexes need extra space, may slow writes, and when bulk loading it can be faster to drop indexes, load, and rebuild. Add an index for a query you actually run, and remove ones nobody uses. Before and after, benchmark and profile, for example with the slow query log, instead of guessing.

## A worked example: 10 million rows
Table `orders` has 10,000,000 rows. Query: find the order with a given `order_id`. Invented figure: a node holds 100 keys. Real 8 KB pages often hold a few hundred entries, so real trees are often one level shallower.

Without an index: the database scans the table. On average a unique match is found halfway, so about 5,000,000 rows read, and 10,000,000 if the id does not exist.

With a B-tree index on `order_id`: depth is $\lceil \log_{100}(10{,}000{,}000) \rceil$. Since $100^3 = 1{,}000{,}000$ is too small and $100^4 = 100{,}000{,}000$ is enough, the depth is 4. That is 4 index page reads plus 1 table read, so 5 reads instead of up to 10 million. Real systems keep the top levels in memory, so often only the last one or two reads touch disk.

Growth: at 100 million rows the tree is still about 4 levels deep, but the scan is 10 times longer. That is why a query that is fast in development can be slow in production.

```mermaid Every 100 times more rows adds one level to the tree (100 keys per node, as in the example)
xychart-beta
  x-axis [100 rows, 10 thousand, 1 million, 100 million, 10 billion]
  y-axis "index levels read" 0 --> 6
  bar [1, 2, 3, 4, 5]
```

## What goes wrong: the index that is never used
```mermaid An index that starts with country cannot narrow a query on created_at, so the scan reads every row
flowchart TD
  Q["WHERE created_at > 2026-01-01"] --> P{Planner}
  P -->|index starts with country| S[Full scan]
  P -.->|only if an index starts with created_at| I[Index range scan]
  class S bad
  class I good
```

A team has an index on `(country, created_at)`. The slow query is `WHERE created_at > '2026-01-01'`. The index starts with `country`, so the query cannot narrow the scan by date. Dev data is small, so nothing was noticed. In production, the report takes seconds to load. To confirm, run `EXPLAIN` on the query and look for a sequential scan instead of an index scan. The fix is a second index starting with `created_at`, or reordering to match the real query.

## When an index is the wrong tool
A table with a few hundred rows is faster to scan. A query that returns most of the table is faster with a full scan, because reading blocks in order beats following many pointers. Columns with very few distinct values, like a yes or no flag, help little. Write-heavy tables with many indexes pay a lot for each one. For search over text, use a search engine or a text index type instead.

## Common mistake
Adding an index on every column "just in case". Each one slows every write and uses memory, and a composite index in the wrong order often cannot narrow the search, so the planner skips it.

```resources
article | System Design Primer: SQL tuning | https://github.com/donnemartin/system-design-primer#sql-tuning | Donne Martin | Lists using good indices and their costs: more space, slower writes.
docs | PostgreSQL manual: Indexes, Introduction | https://www.postgresql.org/docs/current/indexes-intro.html | PostgreSQL Global Development Group | Explains an index with the book index analogy and that the system updates it on table changes.
docs | PostgreSQL manual: Multicolumn Indexes | https://www.postgresql.org/docs/current/indexes-multicolumn.html | PostgreSQL Global Development Group | States a multicolumn B-tree is most efficient with constraints on the leftmost columns.
article | Use The Index, Luke: Anatomy of an Index | https://use-the-index-luke.com/sql/anatomy | Markus Winand | Explains the linked leaf nodes and the balanced tree, with traversal figures.
docs | PostgreSQL manual: Index-Only Scans and Covering Indexes | https://www.postgresql.org/docs/current/indexes-index-only-scans.html | PostgreSQL Global Development Group | Describes when a query can be answered from the index without the table.
```

```quiz
A table has 10 million rows and a B-tree with 100 keys per node. About how many index levels does a lookup read? | 4 ; 5 ; 7 | 0 | 100 cubed is one million, 100 to the fourth is 100 million, so four levels cover 10 million.
You have an index on (country, created_at). Which query can use it well? | WHERE created_at is in the last week ; WHERE country is one value and created_at is recent ; ORDER BY created_at with no filter | 1 | The leading column must be constrained first for the sorted order to narrow the search.
What is the main cost of adding more indexes to a table? | Reads on columns without an index get much slower ; Lookups on the indexed column itself get slower over time ; Every insert and delete touches each index, and so do updates to indexed columns | 2 | Each write that changes indexed data must keep every affected index in sorted order.
```

```story
A report page loads in 40 milliseconds on a developer laptop with 5,000 rows. After launch, the table grows to 20 million rows and the same page takes eleven seconds. The query filters on a column with no index, so each load reads the whole table. One CREATE INDEX line brings it back to milliseconds, and teaches the team to run EXPLAIN before shipping.
```

```adapted
The System Design Primer | https://github.com/donnemartin/system-design-primer | CC BY 4.0
```

# replication | Replication | 2 | 12
Replication keeps copies of the same data on several machines. It spreads reads across copies and lets the system survive a machine failure, at the price of copies that can lag behind each other.

## Leader and followers
In leader-follower replication (the Primer calls it master-slave), one database is the leader. It takes all writes and sends each change to one or more followers, which serve reads only. The leader records every change in an ordered log and ships that log to followers. A position is a place in that log, like a page number. Followers can in turn feed other followers in a tree. If the leader goes offline, the system can run in read-only mode until a follower is promoted or a new leader is provisioned.

```mermaid Leader-follower: all writes go to the leader, which ships changes to followers that serve reads
flowchart LR
  W[Writes] --> L[(Leader)]
  L -->|change log| F1[(Follower A)]
  L -->|change log| F2[(Follower B)]
  F1 --> R1[Reads]
  F2 --> R2[Reads]
```

Benefits: read traffic spreads over many followers, and you have warm copies if the leader dies. Costs: you need logic to promote a follower. If many writes arrive, followers must replay them and can get bogged down, which slows their reads. The more followers, the more the leader must ship, which can increase lag.

## Multi-leader
In multi-leader replication (master-master), several nodes accept writes and coordinate with each other. If one fails, the others keep serving reads and writes. This suits setups with a data center in each region.

The Primer lists the downsides. You need a load balancer or application logic to choose where to write. Most multi-leader systems are loosely consistent, which violates ACID, or have extra write latency from synchronization. Conflict resolution becomes harder as write nodes and latency grow. Two users editing the same row on two leaders at once is a conflict somebody must resolve, by last write wins, merge rules, or asking a human.

The two topologies compared.

| | Leader-follower | Multi-leader |
| --- | --- | --- |
| Who takes writes | One leader | Several nodes |
| If a write node fails | Read-only until a follower is promoted | The others keep reading and writing |
| Main cost | Promotion logic and follower lag | Conflicts when two nodes edit the same row, and write routing |
| Fits | Read-heavy workloads | A data center in each region |

## Synchronous or asynchronous
Replication can be synchronous, where the leader waits for the follower to confirm before telling the client the write succeeded. It can be asynchronous, where the leader confirms right away and ships the change later.

| | Synchronous | Asynchronous |
| --- | --- | --- |
| Write latency | Higher, waits for follower | Low |
| If leader dies | No acknowledged write is lost as long as the synchronous follower survives | Recent writes may be lost |
| If follower is down | Writes can stall | Writes continue |

PostgreSQL's streaming replication is asynchronous by default, and the manual says the amount of data lost at failover is proportional to the replication delay at that moment. Many teams use one synchronous follower and the rest asynchronous.

## Replication lag and read-your-writes
Replication lag is the delay between a write on the leader and its arrival on a follower. Normally it is milliseconds. Under load or a network problem it can reach seconds or minutes.

Because of lag, a user may not see their own write. Read-your-writes consistency means a user always sees their own changes. Common fixes: read from the leader for a short time after that user writes, or read from the leader for data the user owns, or remember the log position of the user's last write and only read from followers that have reached that position. See [consistency models](/sd/docs/distributed/consistency-models) for a wider view.

## Failover
Failover means promoting a follower to leader when the old one fails. The steps are to detect the failure, choose the most up-to-date follower, point clients to it, and make the old leader rejoin as a follower. Hazards: with asynchronous replication, the chosen follower may be missing the last writes. And if the old leader comes back believing it is still the leader, you get two leaders, a split brain. Replication adds hardware and complexity, as the Primer puts it. Failover is the part that goes wrong most often, so rehearse it before you need it.

## A worked example: a user edits a profile and reads a stale replica
Invented setup: one leader, two followers. Writes go to the leader. Reads go to a random follower. Replication lag is 800 milliseconds right now.

1. At 0 ms, Priya changes her display name from "Pri" to "Priya" on the leader.
2. The leader confirms the write at 10 ms. The page redirects to her profile.
3. At 300 ms the profile page reads from follower B, which has not yet received the change.
4. Follower B returns "Pri". Priya thinks the save failed and edits again.
5. At 800 ms follower B catches up. Anyone reloading now sees "Priya".

```mermaid Replication lag: Priya reads from follower B at 300 ms and sees the old name
sequenceDiagram
  participant P as Priya
  participant L as Leader
  participant B as Follower B
  P->>L: set name Priya (0 ms)
  L-->>P: ok (10 ms)
  P->>B: read profile (300 ms)
  B-->>P: Pri (stale)
  L->>B: change arrives (800 ms)
  Note over L,B: Until 800 ms, B is behind
```

Fix: after a write, send that user's reads to the leader for the next 5 seconds (more than the lag you normally see). Cost: the leader gets a slice of read traffic from recent writers only. If 2 percent of users wrote in the last 5 seconds, the leader serves 2 percent of reads, which is fine. A fixed window only works while lag stays below it. If lag grows past 5 seconds, Priya is back to stale reads, which is why the position-based fix is safer.

## What goes wrong: lag grows without anyone noticing
A bulk job writes millions of rows to the leader. In many setups followers replay writes with little parallelism, so they fall minutes behind. Customers see old order statuses, and support tickets arrive. The symptom is data that is right on the leader and wrong on replicas. Confirm it by measuring lag: in PostgreSQL, compare the leader's current log position with the position the follower last received, as the manual describes. Alert on lag, and throttle bulk jobs.

## When replication is the wrong tool
Replication helps reads and availability. It does not help when writes are the bottleneck, because every follower must still apply every write. For that you need [sharding](/sd/docs/data/sharding). It is also not a backup: a bad DELETE replicates to every copy, usually within seconds and often much faster. Keep real backups too.

## Common mistake
Sending every read to followers, including right after a write, and treating lag as a rare edge case. Design for read-your-writes from the start.

```resources
article | System Design Primer: Master-slave replication | https://github.com/donnemartin/system-design-primer#master-slave-replication | Donne Martin | Base text for leader-follower and the multi-leader section that follows it.
article | System Design Primer: Master-master replication | https://github.com/donnemartin/system-design-primer#master-master-replication | Donne Martin | Lists the downsides of multi-leader: routing, loose consistency and conflict resolution.
docs | PostgreSQL manual: Log-Shipping Standby Servers | https://www.postgresql.org/docs/current/warm-standby.html | PostgreSQL Global Development Group | Says streaming replication is asynchronous by default and that data loss at failover is proportional to the delay.
article | Scalability, availability, stability, patterns | http://www.slideshare.net/jboner/scalability-availability-stability-patterns/ | Jonas Boner | The slide deck the Primer takes its replication diagrams from.
```

```quiz
Priya saves a profile on the leader and the next page shows the old name. What is the most likely cause? | The follower that served the read had not caught up yet ; The leader rejected the write silently ; The index on the name column was stale | 0 | Asynchronous followers can lag behind by the replication delay.
Reads from a user go to the leader for 5 seconds after that user writes. Whose reads still go to followers? | Reads from users who wrote in the last 5 seconds ; Reads from users who have not written recently ; Reads from a user who wrote 2 seconds ago | 1 | Only recent writers need the leader, so everyone else keeps using followers.
Why is replication a poor fix for a write-bound database? | It makes each write cheaper on the leader ; Each follower must still apply every write ; It blocks reads from reaching followers | 1 | Writes are copied to all nodes, so the total write load does not fall.
```

```story
A shop's checkout page confirms an order, then redirects to "My orders", which reads from a follower. For a few hundred customers each day, the new order is missing, and they place it again. The charge happens twice. The fix is to read from the leader right after a write, and nothing about the database itself had to change.
```

```adapted
The System Design Primer | https://github.com/donnemartin/system-design-primer | CC BY 4.0
```

# sharding | Sharding, Federation and Denormalization | 2 | 12
When one database server cannot hold the data or handle the writes, you split the data. Federation splits by feature, sharding splits rows across machines, and denormalization avoids joins that would cross those splits.

## Federation
Federation (functional partitioning) splits databases by function. Instead of one monolithic database you might run three: forums, users and products. Each gets less read and write traffic, so there is less replication lag. Smaller databases fit more data in memory, which means more cache hits. With no single leader serializing all writes, writes happen in parallel and throughput rises.

Downsides: it does not help if one function needs a huge table. The application must know which database to use for what. Joining data across two databases is harder. It also adds hardware and complexity.

## Sharding
```card Sharding
Problem | One database server cannot hold all the data or take all the writes, and a bigger server stops being affordable or possible.
Solution | Split the rows across several databases called shards. A shard key decides which shard owns each row, and the application or a router sends each query to the right one.
Use when | The data or write load outgrows one machine even after indexes, caching, read replicas and a bigger server.
Avoid when | One server still copes, or your queries and transactions constantly span many rows that would land on different shards.
```

Sharding distributes data across several databases, called shards, so each holds only a subset. As users grow, you add shards. Like federation, sharding gives less traffic, less replication and more cache hits per shard, and smaller indexes, which usually speeds queries. If one shard goes down the others still work, though you want replication to avoid data loss ([replication](/sd/docs/data/replication) and sharding are combined in practice).

Downsides: application logic must work with shards, and queries get complex. Data can become lopsided. Rebalancing is hard. Joining data across shards is complex. It adds hardware and complexity. Adding shards means moving rows; the worked example below shows how logical shards keep that move small.

## Choosing a shard key
The shard key is the column that decides which shard holds a row. There are three common schemes.

| Scheme | How it works | Good | Bad |
| --- | --- | --- | --- |
| Range | Rows with keys A to F on shard 1, G to M on shard 2 | Range queries that fall inside one slice stay on one shard | Hot spots: one range may get most traffic |
| Hash | shard = hash(key) mod number of shards | Even spread | Range queries hit all shards, and resizing moves data (see [consistent hashing](/sd/docs/data/consistent-hashing)) |
| Directory | A lookup table maps each key to a shard | Fully flexible | The table is an extra component and a bottleneck |

The Primer's examples are last-name initial or geographic location. Both can skew. A good key spreads rows evenly and keeps the data one query touches on one shard. Notion's engineers described picking workspace ID for their Postgres shards, because users mostly query inside one workspace, which avoids most cross-shard joins.

```mermaid Shard routing: the router hashes the key and sends the query to one shard
flowchart LR
  A[App] --> R[Router: hash of user id mod 3]
  R -->|0| S0[(Shard 0)]
  R -->|1| S1[(Shard 1)]
  R -->|2| S2[(Shard 2)]
```

## Hot spots
A hot spot is one shard with much more load than others. The famous case is the celebrity problem: if you shard a social network by user, the shard holding a celebrity is hammered by their followers. Power users on one shard have the same effect. Fixes include splitting hot keys over several shards, caching their reads ([caching basics](/sd/docs/caching/caching-basics)), or giving them a dedicated shard.

## Cross-shard queries and resharding
A query that needs data from several shards must ask all of them and merge the answers. A transaction across shards needs extra machinery and is much slower, so most designs keep transactions inside one shard. Resharding means changing the shard count and moving data while the service runs. It is slow and risky, which is why sizing matters from the start.

## Denormalization
Denormalization improves read speed at the cost of some write speed. You store redundant copies of data in several tables to avoid expensive joins. Some databases, including PostgreSQL and Oracle, offer materialized views, which store the result of a query as a table. PostgreSQL does not update one by itself when the base tables change. You refresh it on a schedule or on demand. Once data is split across shards, joins across them get much harder, and denormalization can remove the need for them. In most systems reads outnumber writes by a lot, so paying on writes is often worth it.

Downsides: data is duplicated, keeping copies in sync is more design work, and under heavy writes a denormalized database can perform worse than a normalized one.

## A worked example: sizing shard count
Invented numbers. A users and posts dataset is 3 TB today and grows 50 percent per year. Operations says a table should stay under 500 GB and that shards should be at most 70 percent full, so the target is 70 percent of 500 GB, which is 350 GB per shard. (Notion's post sets 500 GB per table; we apply the same figure to a whole shard to keep the example simple.)

1. Plan 3 years ahead. Data is $3 \times 1.5^3 = 10.1$ TB, about 10,100 GB.
2. Shards for size: $10{,}100 / 350 = 28.9$, so 29 shards. Round up to 30 to leave a little headroom and to split into 120 logical shards evenly (4 per host).
3. Check writes. Peak is 60,000 writes per second and one host handles about 3,000. That needs 20 shards, fewer than 30, so size decides.
4. Pick logical shards. Create 120 logical shards (databases or schemas) and put 4 on each of the 30 hosts.

The logical layer is the trick. Later, to add hosts, you move whole logical shards between machines, and the shard function never changes. Notion's post describes 480 logical shards evenly spread across 32 physical databases, 15 per database, which uses the same idea.

```mermaid Shards needed to keep each at 350 GB while data grows 50 percent a year from 3 TB (invented numbers from the example, which rounds the year 3 figure of 29 up to 30)
xychart-beta
  x-axis [Today 3 TB, Year 1 4.5 TB, Year 2 6.75 TB, Year 3 10.1 TB]
  y-axis "shards of 350 GB" 0 --> 32
  bar [9, 13, 20, 29]
```

## What goes wrong: a hot shard that range sharding created
```mermaid Range sharding by month sends every new write to the current month's shard
flowchart LR
  W[All new orders] --> S12[(Shard: this month)]
  W -.->|idle| S1[(Older shards)]
  class S12 bad
```

A team shards orders by `created_at` month. All new writes go to the shard for the current month, so one shard takes all write traffic and the other eleven are idle. Symptom: one host at 95 percent CPU, others at 5. Confirm by graphing per-shard write rate. Fix: hash the order id, or combine customer id with time so writes spread out.

## When sharding is the wrong tool
Sharding is a large permanent cost. First try indexes, query tuning, caching, [read replicas](/sd/docs/data/replication), and a bigger machine. A single well-tuned database goes far, and splitting it too early costs you joins and transactions. Move to sharding when data or writes truly exceed one machine. For a walk through the stages, see the [scale to millions](/sd/docs/practice/scale-to-millions) practice design.

## Common mistake
Picking a shard key that matches the schema but not the queries, so most queries touch every shard.

```resources
article | System Design Primer: Federation | https://github.com/donnemartin/system-design-primer#federation | Donne Martin | Base text for splitting databases by function and its downsides.
article | System Design Primer: Sharding | https://github.com/donnemartin/system-design-primer#sharding | Donne Martin | Base text for sharding, lopsided data and rebalancing.
article | System Design Primer: Denormalization | https://github.com/donnemartin/system-design-primer#denormalization | Donne Martin | Base text for trading write speed for read speed with redundant copies.
article | Herding elephants: Lessons learned from sharding Postgres at Notion | https://www.notion.so/blog/sharding-postgres-at-notion | Garrett Fidalgo, Notion | Describes choosing workspace ID as the partition key, an upper bound of 500 GB per table, and 480 logical shards over 32 databases.
article | An Unorthodox Approach to Database Design: The Coming of the Shard | http://highscalability.com/blog/2009/8/6/an-unorthodox-approach-to-database-design-the-coming-of-the.html | Todd Hoff, High Scalability | Summarizes Dathan Pattishall's account of sharding at Flickr, plus Dan Pritchett's sharding lessons such as using math on shard counts.
```

```quiz
A team moves billing tables to their own database while users stay put. What is this? | Sharding ; Federation ; Replication | 1 | Federation splits by function, so each feature gets its own database.
Data is 3 TB growing 50 percent a year, 350 GB per shard target. About how many shards for 3 years of growth? | 10 ; 90 ; 30 | 2 | 3 x 1.5^3 is about 10.1 TB, and 10,100 GB divided by 350 is about 29. Rounding up a little for headroom gives 30.
You shard orders by month and one host is overloaded. What is the likely cause? | Orders are hashed by id, so the load is uneven ; Older months are queried more than the current one ; Every new write goes to the current month shard | 2 | Range keys that grow with time send all new writes to one shard.
```

```story
Imagine a social app that shards its posts by user id and everything looks balanced. Then a pop star with 30 million followers joins, and the shard that holds their account runs at 100 percent while the rest idle. Rebalancing that one shard means moving live data, so the team spends weeks on it. Planning for celebrity accounts from day one would have cost far less.
```

```adapted
The System Design Primer | https://github.com/donnemartin/system-design-primer | CC BY 4.0
```

# consistent-hashing | Consistent Hashing | 3 | 10
Consistent hashing places servers and keys on a ring so that adding or removing a server moves only a small share of the keys. Plain `hash mod N` moves almost all of them.

## The problem with hash mod N
The simplest way to spread keys across N servers is `server = hash(key) mod N`. Here `mod` means the remainder after division, so `17 mod 5 = 2`. A hash function turns any key into a whole number, and the same key always gives the same number. The scheme is even and cheap. But when N changes, because you add a server or one dies, nearly every key maps to a different server. Caches suddenly miss, databases must move most of their data, and the extra load can take the system down. Sharding schemes in [Sharding](/sd/docs/data/sharding) face exactly this.

## The ring
Consistent hashing was introduced in a 1997 paper by David Karger and five co-authors, written to relieve hot spots on web caches. Two of those authors, Tom Leighton and Daniel Lewin, went on to found the CDN company Akamai. The idea:

1. Treat the output range of a hash function as a circle, so the largest value wraps to the smallest. This is the ring.
2. Hash each server's name to a position on the ring.
3. Hash each key to a position as well.
4. A key belongs to the first server found by walking clockwise from the key's position.

```mermaid The ring: each key belongs to the first server clockwise from it (drawn as a line: the last arrow wraps back to the first server)
flowchart TD
  K1[key a] -->|clockwise| SA[Server A]
  K2[key b] -->|clockwise| SB[Server B]
  K3[key c] -->|clockwise| SB
  SA -->|next on ring| SB
  SB -->|next on ring| SC[Server C]
  SC -->|wraps around| SA
```

Each server owns the arc between it and its predecessor. When a server is added, it takes over part of one neighbor's arc, and only those keys move. When a server leaves, its keys go to the next server clockwise. No other keys move, though that neighbor now carries extra load (see the cascade below). The Dynamo paper states the advantage this way: the departure or arrival of a node only affects its immediate neighbors.

## Virtual nodes
With a few servers at random positions, arcs have uneven length, so some servers get much more data. The Dynamo paper also notes the basic algorithm ignores differences in machine power. The fix is virtual nodes: each physical server gets many positions on the ring (Dynamo calls them tokens). Load evens out because many small arcs average out. A bigger machine gets more virtual nodes. When a server dies, its many small arcs are picked up by many different neighbors, so no single server takes all the extra load. Cassandra also assigns each node tokens on a ring and walks the ring to find a key's owner.

The demo above lets you add and remove a server and watch which keys move, next to `hash mod N`.

## Where it is used
Dynamo, and Cassandra which follows its design, partition data this way. CDNs and caches use it to pick which cache holds a URL. Load balancers use it for sticky routing, so the same client or key keeps landing on the same backend ([load balancing](/sd/docs/scaling/load-balancing)). It is also used in sharded caches ([caching basics](/sd/docs/caching/caching-basics)).

## A worked example: going from 4 to 5 servers
Take keys whose hash is a whole number, spread evenly.

With `hash mod N`, a key stays in place only if `h mod 4 = h mod 5`. Look at hashes 0 to 19 (the pattern repeats every 20, because 20 is the least common multiple of 4 and 5):

| h | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| mod 4 | 0 | 1 | 2 | 3 | 0 | 1 | 2 | 3 | 0 | 1 |
| mod 5 | 0 | 1 | 2 | 3 | 4 | 0 | 1 | 2 | 3 | 4 |

| h | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| mod 4 | 2 | 3 | 0 | 1 | 2 | 3 | 0 | 1 | 2 | 3 |
| mod 5 | 0 | 1 | 2 | 3 | 4 | 0 | 1 | 2 | 3 | 4 |

Only h = 0, 1, 2 and 3 match, so 4 of 20 keys stay and 16 of 20 move. In general, going from N to N+1 servers keeps only 1 key in N+1 under hash mod N, so N out of N+1 keys move. For 4 to 5 servers that is 80 percent moving. With 1 million cached keys, 800,000 miss at once.

With a ring and one new server of five equal servers, the new server takes about one fifth of the ring from its neighbors. About 20 percent of keys move, 200,000 of 1 million, and all of them go to the new server. The expected share is $1/N$ for the new count N.

Since a key moves only to the new server, the other four servers keep their caches fully warm.

```mermaid Share of keys that move when one server is added: hash mod N moves most, a ring with balanced arcs moves 1 in N+1
xychart-beta
  x-axis [From 2 to 3, From 4 to 5, From 9 to 10, From 19 to 20]
  y-axis "percent of keys moved" 0 --> 100
  line "hash mod N" [67, 80, 90, 95]
  line "Ring" [33, 20, 10, 5]
```

## What goes wrong: uneven arcs and a cascade
```mermaid Cascade: the failed server's keys land on the next server, which then fails too
stateDiagram-v2
  [*] --> Balanced
  Balanced --> Hot: one server owns 45 percent
  Hot --> NextOverloaded: it fails, neighbor owns 70 percent
  NextOverloaded --> Cascade: the neighbor fails too
  class Hot warn
  class NextOverloaded bad
  class Cascade bad
```

A team runs 4 cache servers on a ring with one position each. By luck, one server owns 45 percent of the ring. It runs hot and falls over. Its keys fall to the next server clockwise, which already owned 25 percent and now owns 70 percent, so it also falls over. The symptom is servers failing one after another with a skewed key count. Confirm it by comparing keys per server. Use more virtual nodes per server so each arc is small. Systems differ: Cassandra's docs say its 2.x default was 256 tokens per node, and that later versions can use far fewer with a smarter token allocator.

## When consistent hashing is the wrong tool
If the server count never changes, `hash mod N` is simpler. If you need range queries over keys, hashing scrambles order, so a range-partitioned or ordered store fits better. If you need exact balance, a directory service that maps keys to servers lets you place data on purpose. Also, a ring decides where data lives. It does not copy it: you still need [replication](/sd/docs/data/replication) for failures.

## Common mistake
Thinking consistent hashing balances load by itself. With few servers and no virtual nodes it can be less balanced than plain modulo.

```resources
paper | Dynamo: Amazon's Highly Available Key-value Store, section 4.2 | https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf | DeCandia et al. | Defines the ring, tokens and virtual nodes, and the benefit that arrival or departure affects only immediate neighbors.
docs | Apache Cassandra: Dynamo architecture | https://cassandra.apache.org/doc/latest/cassandra/architecture/dynamo.html | Apache Cassandra | States Cassandra maps each node to one or more tokens on a hash ring and that consistent hashing only moves a small fraction of keys when nodes change.
paper | Consistent Hashing and Random Trees | https://cs.brown.edu/courses/csci2950-u/f09/papers/chash97stoc.pdf | Karger et al. (STOC 1997) | The original paper, which introduces consistent hashing for caching protocols that relieve web hot spots.
article | The Simple Magic of Consistent Hashing | http://www.paperplanes.de/2011/12/9/the-magic-of-consistent-hashing.html | Mathias Meyer | Source cited by the Primer, covers hot spots and practical use in databases and caches.
article | ByteByteGo: Consistent Hashing Explained | https://bytebytego.com/guides/consistent-hashing | ByteByteGo | Short illustrated guide that frames the hash mod N problem and the clockwise lookup on the ring.
```

```quiz
You grow a cache from 9 to 10 servers with hash mod N. About what share of keys move? | 10 percent ; 50 percent ; 90 percent | 2 | Only 1 key in 10 keeps its server, so 9 of 10 move.
You grow from 4 to 5 servers on a ring with balanced arcs. What share of keys move? | About 20 percent, all to the new server ; About 80 percent, spread over four servers ; None, if virtual nodes are used | 0 | The new server takes about one fifth of the ring and nothing else changes.
What do virtual nodes fix? | They stop one hot key overloading a server ; They even out load across servers ; They let range queries span servers | 1 | Many small arcs per server average out uneven random positions.
```

```story
A web cache farm has four servers and a hit rate of 95 percent. Traffic grows, so an engineer adds a fifth server on a Friday. The hit rate drops to about 20 percent, the origin database gets about sixteen times its normal load, and pages crawl for an hour. A ring would have moved a fifth of the keys instead of four fifths.
```

# transactions-and-isolation | Transactions and Isolation | 3 | 12
A transaction groups changes so they succeed or fail together. Isolation decides what two transactions running at the same time can see of each other, and weaker levels let real bugs through.

## ACID properly
ACID is a set of properties of relational transactions, adapted here from the Primer.

1. Atomicity: each transaction is all or nothing. A crash in the middle undoes the partial work.
2. Consistency: each transaction moves the database from one valid state to another. The database enforces its constraints, but your application defines what valid means.
3. Isolation: running transactions at once gives the same result as running them one at a time.
4. Durability: after commit, the data stays, even through a crash.

Isolation is the expensive one. Perfect isolation limits concurrency, so databases offer weaker levels that are faster, and these allow some anomalies.

## The anomalies
The first three are defined in the PostgreSQL manual. Lost update and write skew are names from the research literature, and Hermitage tests for them.

| Anomaly | What happens |
| --- | --- |
| Dirty read | You read data written by a transaction that has not committed yet |
| Non-repeatable read | You read a row twice and it changed between reads, because another transaction committed |
| Phantom read | You run the same query twice and the set of matching rows changes |
| Lost update | Two transactions read, then write, and one overwrites the other |
| Write skew | Two transactions read overlapping data and write different rows, breaking a rule that spans both |

A timeline for a lost update. A balance is 100.

1. T1 reads balance: 100.
2. T2 reads balance: 100.
3. T1 writes 150 (adds 50) and commits.
4. T2 writes 130 (adds 30) and commits.

Final balance is 130. It should be 180. T1's deposit vanished.

```mermaid Lost update: both transactions read 100, so the second write erases the first deposit
sequenceDiagram
  participant T1
  participant DB as Database
  participant T2
  T1->>DB: read balance
  DB-->>T1: 100
  T2->>DB: read balance
  DB-->>T2: 100
  T1->>DB: write 150, commit
  T2->>DB: write 130, commit
  Note over DB: Final 130, expected 180
```

A timeline for write skew. Rule: at least one doctor must be on call. Alice and Bob are both on call.

1. T1 (Alice) counts doctors on call: 2.
2. T2 (Bob) counts doctors on call: 2.
3. T1 sets Alice off call and commits.
4. T2 sets Bob off call and commits.

Nobody is on call. Each transaction saw a valid world and wrote a different row, so there is no direct write conflict to detect.

```mermaid Write skew: both transactions pass the check, then write different rows
sequenceDiagram
  participant T1 as T1 Alice
  participant DB as Database
  participant T2 as T2 Bob
  T1->>DB: count on call
  DB-->>T1: 2
  T2->>DB: count on call
  DB-->>T2: 2
  T1->>DB: Alice off call, commit
  T2->>DB: Bob off call, commit
  Note over DB: Zero doctors on call
```

## Isolation levels
The SQL standard defines four levels, from weakest to strongest: read uncommitted, read committed, repeatable read and serializable. Serializable means the result matches running the transactions one at a time in some order.

Many databases also offer snapshot isolation. Each transaction sees a consistent snapshot of the data from when it started, kept using multiple versions of each row. It stops dirty reads, non-repeatable reads and phantoms, but not write skew.

The PostgreSQL manual says it implements three distinct levels. Read uncommitted behaves like read committed, and its repeatable read is snapshot isolation. Its table says read committed allows non-repeatable reads, phantoms and serialization anomalies. Repeatable read still allows serialization anomalies. Only serializable prevents all of them. A serialization error is the database aborting a transaction because letting it commit would produce such a result.

What each PostgreSQL level allows. The first three columns come from the manual's table. Write skew is one kind of serialization anomaly (a result no one-at-a-time ordering could produce), and Hermitage's Postgres tests confirm which levels allow it.

| Level you ask for | Dirty read | Non-repeatable read | Phantom read | Write skew |
| --- | --- | --- | --- | --- |
| Read uncommitted (acts as read committed) | No | Yes | Yes | Yes |
| Read committed (the default) | No | Yes | Yes | Yes |
| Repeatable read | No | No | No | Yes |
| Serializable | No | No | No | No |

What does your database default to? PostgreSQL: read committed. MySQL with InnoDB: repeatable read, according to the MySQL manual. Hermitage is a test suite by Martin Kleppmann that documents what several databases really do under their isolation level names. It shows the same name can mean different behavior. For example, Hermitage finds PostgreSQL's repeatable read prevents lost updates, while MySQL InnoDB's repeatable read does not. In Hermitage, Postgres "repeatable read" does not prevent write skew, and "serializable" does, by aborting one transaction with a serialization error.

## Optimistic and pessimistic locking
Pessimistic locking assumes conflict. `SELECT ... FOR UPDATE` locks the rows you read so others wait. Safe, but slower, and it can deadlock (two transactions each hold a lock the other needs, so the database aborts one).

Optimistic locking assumes conflict is rare. Add a version column. Read the row and its version. When you write, include `WHERE version = 7` and set `version = 8`. If zero rows changed, someone else got there first, so retry. This fixes lost updates without holding locks. Under PostgreSQL repeatable read and serializable, the database does the same kind of check and raises an error, and your code must retry the whole transaction.

## A worked example: two ways to fix the lost update
Balance 100. T1 adds 50, T2 adds 30. Expected 180.

Fix 1, an atomic statement: `UPDATE accounts SET balance = balance + 50 WHERE id = 1`. The database applies the add to the current value under a row lock. T2's update waits, then applies +30 to 150. Result 180. No new isolation level needed.

Fix 2, optimistic version check. Both read (balance 100, version 7). T1 writes 150, version 8, one row changed. T2 tries `WHERE version = 7`, zero rows change. T2 re-reads (150, version 8), writes 180, version 9. Result 180, and the cost was one retry.

## What goes wrong: write skew in production
An on-call or seat booking feature checks a rule, then writes. Under read committed or snapshot isolation, two requests at once both pass the check. The symptom is data that breaks a rule your code checks, rarely, and only under load. Confirm it by querying for rows that already break the rule (for example, a shift with zero doctors on call) and comparing the commit times of the two writes that caused it. If they overlap, it is write skew. Fix: use serializable and retry on serialization errors; or select the on-call rows themselves with `FOR UPDATE` (not a `count`), so the second request waits and then sees the first one's change; or, where the rule fits one (a seat can be sold once), store it as a unique constraint the database enforces.

## When strong isolation is the wrong tool
Serializable costs throughput and causes retries. For read-heavy analytics or counters where an occasional skew is harmless, read committed is fine. Across several services or shards, a single database transaction cannot span them, so you need patterns from [message queues](/sd/docs/async/message-queues) and [delivery guarantees](/sd/docs/async/delivery-guarantees) instead.

## Common mistake
Assuming "repeatable read" or "serializable" means the same in every database. Read the docs and Hermitage for yours.

```resources
article | System Design Primer: Relational database management system (ACID) | https://github.com/donnemartin/system-design-primer#relational-database-management-system-rdbms | Donne Martin | The ACID list that this lesson adapts.
docs | PostgreSQL manual: Transaction Isolation | https://www.postgresql.org/docs/current/transaction-iso.html | PostgreSQL Global Development Group | Defines dirty read, non-repeatable read, phantom read and serialization anomaly, and says read committed is the default.
docs | MySQL manual: InnoDB Transaction Isolation Levels | https://dev.mysql.com/doc/refman/8.4/en/innodb-transaction-isolation-levels.html | Oracle | States that the default isolation level for InnoDB is REPEATABLE READ.
repo | Hermitage | https://github.com/ept/hermitage | Martin Kleppmann | Test suite showing what isolation levels in several databases really prevent, including write skew in Postgres repeatable read.
article | ByteByteGo: Database Isolation Levels | https://bytebytego.com/guides/what-are-database-isolation-levels | ByteByteGo | Short illustrated guide to the four levels and how MVCC supports them.
```

```quiz
Two requests add +50 and +30 to a balance of 100, but the final balance is 130. Which change gives 180 without raising the isolation level? | Read the balance twice before writing ; UPDATE accounts SET balance = balance + 30 ; Run a COUNT before the update | 1 | The add runs inside the database on the current value, so the second update builds on 150 instead of the stale 100.
Under PostgreSQL's default level, what can a transaction see on its second SELECT? | The same rows as the first SELECT, always ; Rows from uncommitted transactions ; Changes committed since the first SELECT | 2 | Read committed takes a new snapshot for each statement.
Alice and Bob each check that 2 doctors are on call, then each remove themselves. Which level stops this in PostgreSQL? | Read committed ; Serializable ; Repeatable read | 1 | Only serializable detects the pattern and aborts one transaction.
```

```story
Two support agents both see "2 engineers on call" and both tap "go off call" within a second. The rule says one must stay on. Each check passed, each write was legal, and at 3 a.m. nobody answers the pager. A serializable transaction, or a lock on the on-call rows, would have forced one of them to retry.
```

```adapted
The System Design Primer | https://github.com/donnemartin/system-design-primer | CC BY 4.0
```
