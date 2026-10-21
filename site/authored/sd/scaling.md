# vertical-vs-horizontal | Vertical vs Horizontal Scaling | 1 | 10
When one server cannot keep up, you can buy a bigger one or add more of them. Each choice has a price curve, a ceiling and a set of changes it forces on your code.

## Two ways to add capacity
Scaling vertically (also called scaling up) means moving to a bigger machine: more CPU cores, more memory, faster disks. Scaling horizontally (scaling out) means running the same program on several ordinary machines and splitting the traffic between them.

Vertical scaling is the easy first move. Nothing in your code changes. You stop the server, resize it, and start it again. The trouble shows up later. Prices tend to rise faster than power at the top end: the biggest machines carry a steep premium over a few mid-sized ones. There is also a hard ceiling, because no vendor sells a machine with ten thousand cores. And one big machine is still one machine, so if it dies or needs a reboot, your service is down.

Horizontal scaling removes the ceiling and the single point of failure. It also fits the cloud well, where you can rent commodity machines by the hour. Scaling out with ordinary machines is usually cheaper than scaling up one special one, and it is easier to hire people who know the setup. The price is complexity. You now have many copies of your program, and several new problems appear.

```mermaid Scaling up makes one box bigger, scaling out adds interchangeable boxes behind a balancer
flowchart LR
  subgraph Up[Scale up]
    Big[One bigger server]
  end
  subgraph Out[Scale out]
    LB[Load balancer] --> W1[Server]
    LB --> W2[Server]
    LB --> W3[Server]
  end
  W1 --> Store[(Shared sessions and data)]
  W2 --> Store
  W3 --> Store
```

## What horizontal scaling demands
Copies of your server must be interchangeable. That requires three things.

1. A [load balancer](/sd/docs/scaling/load-balancing) in front, so clients see one address while requests spread across the copies.
2. [Stateless servers](/sd/docs/scaling/stateless-services). A server should not keep user sessions or uploaded files on its own disk, because the next request may land on a different copy.
3. Shared data. Sessions go in a database or a cache such as Redis, and files go in object storage. All copies read the same place.

There is a side effect too. When you add web servers, the database and cache behind them see more simultaneous connections. Scaling the front often just moves the bottleneck one layer back. The database tier has its own tools, covered in the [data chapter](/sd/docs/data/replication).

## How a system usually grows
Real systems tend to follow a repeating loop: load test, profile to find the bottleneck, fix that one thing, repeat. The Primer walks through this for an imaginary service growing to millions of users, and our [practice lesson](/sd/docs/practice/scale-to-millions) follows it in full. In short:

1. One box runs the web server and the database. Scale up when needed.
2. Split the database onto its own machine and move static files to object storage.
3. Add a load balancer and several web servers, ideally across data centers or availability zones (separate buildings in one region).
4. Add a cache, read replicas for the database, and a CDN.
5. Add autoscaling, which adds and removes servers based on load.

You do not jump to step 5 on day one. Each step costs money and attention, so you take it when measurements say so.

## A worked example: when one box runs out
All numbers here are invented. A web server has 4 CPU cores. Each request needs 20 ms of CPU time. One core handles 1 / 0.02 = 50 requests per second, so four cores top out at 200 requests per second.

Running at 100 percent is dangerous because queues explode, so assume a safe target of 60 percent. That gives 120 requests per second per server.

Your peak traffic is 500 requests per second. Scaling up: a 16-core machine reaches 4 x 120 = 480, which is still short. Counting cores, you need about 17 (500 / 30 per core), and since machines come in fixed sizes that means the next one up, 32 cores. Scaling out: 500 / 120 = 4.17, so 5 servers. Add one more so the service survives losing a server, and you run 6 four-core machines.

If a 32-core machine costs, say, 10 times what a 4-core one does (price curves vary by vendor, so treat this as an example), the vertical option costs 10 units against 6 for the horizontal one, and it dies all at once. The vertical option wins only while its price is low and your traffic is small, which is why it is the right start.

## What goes wrong: the shared bottleneck
A team adds a second and third web server. Page loads get slower, not faster. The symptom is that web server CPU stays low while database CPU sits at 100 percent and the connection limit is hit. Each new server brought its own pool of database connections, so the database is now overloaded. You confirm it by comparing CPU on each tier and checking active database connections against the configured maximum. The fix is at the database tier: caching, read replicas, or smaller connection pools.

```mermaid More web servers push the same load onto one database, so the bottleneck only moves
flowchart TD
  LB[Load balancer] --> A[Web server, CPU low]
  LB --> B[Web server, CPU low]
  LB --> C[Web server, CPU low]
  A --> DB[(Database, CPU 100 percent)]
  B --> DB
  C --> DB
  class DB bad
```

## When horizontal scaling is the wrong tool
If traffic is small and steady, extra machines add cost and moving parts for no gain. A single database often scales vertically much further than people expect, and splitting it across machines (sharding) is hard to undo. Some work also cannot be split easily, such as a single-writer database or a job that needs one huge shared memory. Scale up first, measure, and scale out when the curve or the failure risk demands it.

## Common mistake
Adding servers before profiling. If the real limit is a slow query or a lock, ten servers all wait on it together.

```resources
article | System Design Primer: Horizontal scaling | https://github.com/donnemartin/system-design-primer#horizontal-scaling | Donne Martin | Short summary of scaling out with commodity machines and the need for stateless servers.
article | Design a system that scales to millions of users on AWS | https://github.com/donnemartin/system-design-primer/blob/master/solutions/system_design/scaling_aws/README.md | Donne Martin | Step by step evolution from one box to a load-balanced, cached, autoscaled system.
article | Introduction to architecting systems for scale | https://lethain.com/introduction-to-architecting-systems-for-scale/ | Will Larson | Defines horizontal scalability as capacity growing linearly with added machines and failures costing only that much capacity.
article | Scaling Websites for Millions of Users | https://bytebytego.com/guides/how-to-scale-a-website-to-support-millions-of-users/ | ByteByteGo | A one-page diagram of a site moving from one server to separate services.
```

```quiz
A server tops out at 120 safe requests per second. Peak is 500. How many servers do you need without a spare? | 4 servers ; 5 servers ; 6 or more servers | 1 | 500 divided by 120 is 4.17, which rounds up to 5.
Which change is required before copies of a server can be interchangeable? | Buying faster disks for every server ; Giving each server its own domain name ; Moving sessions off a server's disk | 2 | A request can land on any copy, so no copy may hold data only it knows.
You add web servers and pages get slower while web CPU is low. Where do you look first? | The database load ; The network cable between racks ; The browser cache settings and cookies | 0 | New servers often push the bottleneck to the shared database.
```

```story
A small shop's single server handles Friday sales fine, until a newsletter goes out and the checkout page hangs. The owner resizes the machine in ten minutes and the site comes back. Two months later the resize costs a fortune and a reboot still takes everything down. That is the moment horizontal scaling starts to make sense.
```

```adapted
The System Design Primer | https://github.com/donnemartin/system-design-primer | CC BY 4.0
```

# load-balancing | Load Balancers | 2 | 12
A load balancer sits in front of several servers and decides which one handles each request. It spreads work, skips unhealthy servers and gives clients one stable address.

## What a load balancer does
A load balancer takes incoming client requests and distributes them across computing resources such as application servers or databases. It returns the server's response to the right client. Done well, it stops requests going to unhealthy servers, stops any one server being overloaded, and removes a single point of failure from the server tier.

It can be hardware (expensive) or software such as HAProxy or NGINX. Many also do SSL termination, which means decrypting HTTPS at the balancer so backends do not need certificates or the CPU cost. Some support session persistence, issuing a cookie so one client keeps hitting the same server when the app is not stateless. We cover that trade in [stateless services](/sd/docs/scaling/stateless-services).

```mermaid Clients see one address, the balancer picks a server and probes each one
flowchart LR
  C1[Client] --> LB[Load balancer]
  C2[Client] --> LB
  LB --> S1[Server 1]
  LB --> S2[Server 2]
  LB --> S3[Server 3]
  LB -.->|health probes| S1
  LB -.-> S2
  LB -.-> S3
```

## Layer 4 and layer 7
Network traffic is described in layers. Layer 4 is the transport layer: TCP or UDP ports, together with the IP addresses. Layer 7 is the application layer: the HTTP message itself.

A layer 4 balancer decides from addresses and ports and never reads the contents. It passes the traffic on to the chosen server, often by network address translation (rewriting addresses on the packets). This needs less time and computing power. A layer 7 balancer ends the client connection, reads the request (headers, path, cookies), picks a server, then opens a connection to it. That allows rules like sending `/video` to video servers and billing traffic to hardened servers. The cost is more work per request, though on modern hardware the difference can be small.

## Algorithms
The balancer needs a rule for choosing.

1. Round robin: servers take turns in order. Weighted round robin gives bigger machines more turns.
2. Least connections: send the next request to the server with the fewest active connections. NGINX documents this as the way to share load more fairly when some requests take longer than others.
3. Hashing on a key: hash the client IP or a user id so the same key goes to the same server. Plain hashing reshuffles most keys when a server is added, so caches use [consistent hashing](/sd/docs/data/consistent-hashing).
4. Random, or least response time, which some balancers offer.

## Health checks and failover
The balancer probes each server, usually an HTTP request to a path like `/health` every few seconds. After a set number of failures it stops sending traffic there, and after successes it resumes. A weak check that only tests an open port can report "healthy" for a broken app. Better checks touch the real dependencies, but carefully: a check that fails whenever the database is slow can drain every server at once.

The balancer itself must not be a single point of failure. In an active-passive pair, one balancer serves traffic while a standby watches it with heartbeats and takes over its address on failure. In an active-active pair both serve traffic, and DNS lists both addresses. Active-passive wastes a machine but is simpler. Active-active uses everything but must tolerate losing half its capacity.

For how to design the probe endpoint itself, see [Health Endpoint Monitoring](/sd/docs/cloud-architecture/bulkhead-throttling-health), which covers what a good health check should and should not test.

## A worked example: least connections vs round robin
Invented numbers. Two servers, A and B. Requests arrive every 100 ms, alternating: heavy (takes 1,000 ms) and light (takes 100 ms). Over one second that is 5 heavy and 5 light requests, or 5 x 1,000 + 5 x 100 = 5,500 ms of work. A fair split is 2,750 ms each.

Round robin deals requests out alternately, so server A receives every heavy request and server B every light one. A gets 5,000 ms of work and B gets 500 ms. At time 0.9 seconds, A holds 5 active requests and B holds none or one. A's queue grows, and users on A wait.

Least connections looks at the live count. After A takes a heavy request, its count is 1 while B's is 0, so the next request goes to B. A server stuck on heavy work keeps a high count and is skipped. Over time the split ends up much closer to even. The lesson: round robin is fine when requests cost about the same, and falls apart when they do not.

## What goes wrong: the check that lies
A server runs out of memory and returns 500 errors on every request, but its port still accepts connections. The balancer's TCP check passes. The symptom is that one in N user requests fails, steadily, while the dashboard shows all servers healthy. Confirm it by comparing error rates per backend in the balancer logs. The fix is an HTTP health check that exercises the app, plus the balancer retrying a failed request on another server.

```mermaid A port check passes while the app returns 500, so the balancer keeps sending traffic
sequenceDiagram
  participant LB as Balancer
  participant S as Server out of memory
  LB->>S: TCP connect check
  S-->>LB: connection accepted
  Note over LB: Marked healthy
  LB->>S: user request
  S-->>LB: 500 error
  Note over LB,S: An HTTP check on /health would have failed
```

## When a load balancer is the wrong tool
With a single server you do not need one, though a [reverse proxy](/sd/docs/scaling/reverse-proxies-and-gateways) still helps. A balancer can also become a bottleneck if it lacks resources or is badly configured, and a single one is itself a single point of failure. Pairing them adds complexity. For traffic spread across continents, DNS-based routing or a [CDN](/sd/docs/scaling/cdn-and-edge) comes first.

## Common mistake
Using round robin by default when request costs vary a lot, then blaming the servers for uneven load.

```resources
article | System Design Primer: Load balancer | https://github.com/donnemartin/system-design-primer#load-balancer | Donne Martin | Covers layer 4 and 7, algorithms, active-passive and active-active pairs and the drawbacks.
docs | Using nginx as HTTP load balancer | https://nginx.org/en/docs/http/load_balancing.html | NGINX | Documents round robin, least connected, ip-hash and weights, and says least-connected helps when some requests run longer.
article | HAProxy architecture guide | https://www.haproxy.org/download/1.2/doc/architecture.txt | Willy Tarreau | Classic guide to load balancer setups and health checks, including the warning that TCP checks can be fooled by firewalls.
article | Top 6 Load Balancing Algorithms | https://bytebytego.com/guides/top-6-load-balancing-algorithms/ | ByteByteGo | Quick visual list of static and dynamic algorithms.
```

```quiz
Requests alternate heavy and light. Which algorithm piles all heavy ones on one of two servers? | Round robin ; Least connections ; Weighted least response time | 0 | Strict alternation sends every second request to the same server.
A layer 7 balancer can route by URL path because it | Only sees IP addresses and ports ; Reads the request headers and path ; Runs inside the client's browser app | 1 | Layer 7 ends the connection and inspects headers and paths.
Dashboard shows all servers healthy but 25 percent of requests fail with 500. What is a likely cause? | The balancer was given too many servers ; DNS records have expired for all clients ; A weak health check on one server | 2 | An open port can pass a TCP check while the app returns errors.
```

```story
An online store runs three servers behind a round robin balancer. One URL runs a heavy report, and by chance most reports land on server two. That server crawls while the others idle, and customers on it see timeouts. Switching to least connections spreads the heavy work, and the timeouts stop.
```

```adapted
The System Design Primer | https://github.com/donnemartin/system-design-primer | CC BY 4.0
```

# reverse-proxies-and-gateways | Reverse Proxies and API Gateways | 2 | 10
A reverse proxy is a front-line server that answers the internet on behalf of your own servers. An API gateway is a reverse proxy with extra duties for APIs, such as authentication and rate limits.

## What a reverse proxy is
A forward proxy acts for clients, such as an office network's gateway to the web. A reverse proxy acts for servers. Clients send requests to it, it forwards each to a server that can answer, and it returns the response. Clients only see the proxy's address.

That single front door gives you several benefits.

1. Security. Hide details about the backend servers, block bad IP addresses, limit connections per client.
2. Flexibility. Because clients only know the proxy, you can add servers or change their setup behind it.
3. SSL termination. The proxy handles HTTPS encryption so backends skip that CPU work and keep no certificates.
4. Compression. The proxy compresses responses before sending them.
5. Caching. It can return a stored copy of a response.
6. Static content. It serves files like HTML, CSS, JS and photos directly, leaving the application servers to run code.

```mermaid Clients only know the proxy, which hides the servers and does shared chores once
flowchart LR
  C[Client] -->|HTTPS| P[Reverse proxy]
  P -->|plain HTTP| A[App server 1]
  P --> B[App server 2]
  P -.-> F[(Cached copy)]
```

## Load balancer or reverse proxy
The two overlap, and tools such as NGINX and HAProxy do both. The usual distinction is the situation. A [load balancer](/sd/docs/scaling/load-balancing) is most useful when you have several servers doing the same job. A reverse proxy is useful even with one web server, because the benefits above still apply. Think of load balancing as one job a reverse proxy can do.

## What an API gateway adds
An API gateway is a reverse proxy aimed at API traffic, often for many backend services. Typical duties:

1. Authentication and authorization: check a token before a request reaches any service.
2. Rate limiting: reject clients that send too many requests (see [rate limiting](/sd/docs/reliability/rate-limiting)).
3. Routing: send `/orders` to the orders service and `/users` to the users service.
4. Aggregation: combine several backend calls into one response for a mobile app.
5. Monitoring and versioning: log traffic and manage API versions.

AWS describes its API Gateway service as a front door for applications, handling traffic management, authorization and access control, monitoring and API version management. Gateway products differ, so check which of these a given one does.

For the individual gateway jobs as patterns, see [Gateway Routing, Offloading and Aggregation](/sd/docs/cloud-architecture/gateways-and-bff), which also covers backends built for one kind of client.

```mermaid A gateway checks the token once, then routes each path to the service that owns it
flowchart LR
  C[Mobile app] --> G[API gateway]
  G -->|check token| Auth[Auth]
  G -->|/orders| O[Orders service]
  G -->|/users| U[Users service]
  G -->|/search| S[Search service]
```

## A worked example: bytes saved at the proxy
Invented numbers. An API returns a 200 KB JSON response at 1,000 requests per second. That is 200 MB per second, about 1.6 gigabits per second out of the data center. Text compresses well. If gzip shrinks it to 40 KB (a plausible ratio for JSON, but measure yours), the proxy sends 40 MB per second, or 0.32 gigabits per second. Compression costs some CPU on the proxy, and in exchange the backends do no compression work and the network bill drops by 80 percent. The same logic applies to TLS: terminating it once at the proxy means ten backends need no certificate and no handshake work.

## What goes wrong: the gateway becomes the bottleneck
Every request now passes through one place. If the gateway is slow, everything is slow, and if it is down, everything is down. Imagine a gateway pod with a small connection limit. A traffic spike hits, and requests queue at the gateway while the backends sit idle. The symptom is rising latency at the edge with low CPU on every service behind it. Confirm by comparing gateway latency with backend latency in your metrics. The fix is running several gateways behind a balancer, tuning limits, and keeping the gateway's job small.

A second failure is slow creep. Teams add business rules to the gateway because it is convenient: data reshaping, pricing logic, special cases per customer. Soon the gateway is a god-object (one component that knows and does too much), every release touches it, and one team owns everyone's changes. Keep gateways to cross-cutting concerns such as authentication, limits, routing and logging.

## When a gateway or proxy is the wrong tool
A single service with a handful of clients rarely needs a gateway. A framework's own middleware, or a plain NGINX in front, is enough. A single proxy is also a single point of failure, so a failover pair adds complexity you must be ready to run. Heavy request-specific logic belongs in the services themselves.

## Common mistake
Putting business logic in the gateway because it sees every request.

```resources
article | System Design Primer: Reverse proxy (web server) | https://github.com/donnemartin/system-design-primer#reverse-proxy-web-server | Donne Martin | Lists the benefits of a reverse proxy and compares it with a load balancer.
article | NGINX: Reverse proxy vs load balancer | https://www.nginx.com/resources/glossary/reverse-proxy-vs-load-balancer/ | F5 NGINX | Explains that both sit between clients and servers, a reverse proxy can direct requests by many parameters, and load balancing is a common job.
docs | What is Amazon API Gateway? | https://docs.aws.amazon.com/apigateway/latest/developerguide/welcome.html | AWS | Describes a managed gateway handling traffic management, authorization, monitoring and version management.
article | Reverse Proxy vs. API Gateway vs. Load Balancer | https://bytebytego.com/guides/reverse-proxy-vs-api-gateway-vs-load-balancer/ | ByteByteGo | Short visual comparison of the three roles.
```

```quiz
Which fits a reverse proxy even when you run only one web server? | Spreading load across many servers ; Electing a new database primary ; Terminating TLS and compression | 2 | Those benefits need only one server behind the proxy.
A JSON response shrinks from 200 KB to 40 KB at 1,000 requests per second. What outbound rate remains? | 40 MB per second ; 200 MB per second ; 8 MB per second | 0 | 40 KB times 1,000 requests is 40,000 KB, or 40 MB.
Gateway latency is high while every backend CPU is idle. What does this suggest? | The databases behind it are slow ; The gateway is saturated ; Clients have slow phones | 1 | Requests are queueing at the shared front door before reaching any service.
```

```story
A mobile team calls six backend services to draw one home screen, and each call needs its own login check. The company adds a gateway that checks the token once and combines the six calls into one. The app gets faster. A year later the gateway contains pricing rules, and nobody dares deploy it on a Friday.
```

```adapted
The System Design Primer | https://github.com/donnemartin/system-design-primer | CC BY 4.0
```

# stateless-services | Stateless Services and Sessions | 2 | 10
State is anything a server remembers between requests. If any copy of your server can answer any request, you can add, remove and replace servers freely.

## What state is, and where it can live
Every login, shopping cart and half-finished upload is state. HTTP itself keeps none: each request stands alone. Applications add state with cookies, which are small values the browser sends back with each request. The server uses the cookie to work out who is asking.

A stateless server keeps no user-specific data in its own memory or disk between requests. Everything it needs arrives with the request or sits in a shared store. Then any server can handle any request, which is exactly what a [load balancer](/sd/docs/scaling/load-balancing) wants.

State still exists, but it lives elsewhere.

1. Databases for durable records such as accounts and orders.
2. A cache such as Redis or Memcached for sessions and hot data.
3. Object storage for files and images.
4. The client, for things like a signed token.

## Three ways to handle sessions
A session ties a series of requests to one logged-in user. There are three common designs.

Sticky sessions. The balancer pins each user to one server, using a cookie or hashing the client IP. The app can keep the session in local memory. It is the quickest to build, but if that server dies or is replaced, its users lose their sessions. Load also becomes uneven, because a few heavy users can stay on one box.

A shared session store. The cookie holds only a random session id. Servers look the id up in Redis or a database. Any server can serve any user, and you can revoke a session by deleting the entry. The cost is an extra network call per request, and the store becomes a critical dependency you must keep available.

Signed tokens. The server gives the client a token containing claims such as the user id, plus a signature. A JSON Web Token (JWT) is one standard format: a compact, URL-safe way to carry claims that can be digitally signed. Servers verify the signature and need no lookup. The catch is revocation: a valid token stays valid until it expires, unless you add a deny list, which brings back a shared lookup. Tokens also grow larger than an id, and the payload is readable unless you encrypt it.

```mermaid The cookie holds only an id, and any server can look the session up in the shared store
sequenceDiagram
  participant B as Browser
  participant S as Any server
  participant R as Session store
  B->>S: GET /cart, cookie sid=ab12
  S->>R: get ab12
  R-->>S: user 42, cart items
  S-->>B: cart page
```

## Why stateless pays off
With no local state, autoscaling is easy: new servers start serving at once and old ones can be killed any time. Deploys become simple, because you can replace servers one at a time with no one losing a session. Failure is cheap too, since losing a server loses capacity, not data. This is why the Primer says servers should not hold user data such as sessions or profile pictures, and suggests a database or persistent cache for sessions.

## A worked example: a sticky server dies
Invented numbers. Four servers each hold the sessions of 5,000 logged-in users, 20,000 in total. One server crashes. Its 5,000 users are now logged out, and each must sign in again. Say a password check costs 100 ms of CPU, which is deliberate, since slow hashing resists password cracking. Total login work is 5,000 x 0.1 s = 500 CPU seconds. Three servers with 4 cores each have 12 cores, so even if every user returns at once, that is 500 / 12, about 42 seconds of fully busy CPU, which delays everyone else's normal requests. Some users also lose a half-filled cart.

With a shared session store, the same crash costs nothing. The balancer sends those users to other servers, which look up the session id. Storage is small: 20,000 sessions of about 1 KB each is 20 MB, which fits comfortably in one Redis instance.

```mermaid With sticky sessions the crashed server takes its 5,000 sessions with it
flowchart TD
  LB[Balancer] --> A[Server A, crashed]
  LB --> B[Server B, 5,000 sessions]
  LB --> C[Server C, 5,000 sessions]
  A -.-> X[5,000 users logged out]
  class A bad
  class X bad
```

## What goes wrong: the session store fails
You move sessions to Redis. One night Redis restarts without persistence and every session vanishes. The symptom is every user logged out at once and a surge of login traffic. Confirm it by checking the Redis uptime and key count against the time of the complaints. Mitigate with replicas and persistence, and make login cheap enough to survive a burst. A signed token design avoids this failure but brings the revocation cost described above.

## When stateless is the wrong tool
Some things really are stateful: a game server holding a live match, a WebSocket connection, an in-memory model that takes minutes to load. These need sticky routing or careful handoff. A tiny internal tool with ten users does not need a Redis cluster either. Pick the lightest option that survives a server restart.

## Common mistake
Writing uploads or sessions to local disk "just for now" and finding out when the second server goes live.

```resources
article | System Design Primer: Horizontal scaling | https://github.com/donnemartin/system-design-primer#horizontal-scaling | Donne Martin | States that servers should be stateless and sessions kept in a shared database or persistent cache.
docs | Using HTTP cookies | https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Cookies | MDN | Explains that HTTP is stateless by default, how cookies carry state, and the HttpOnly and SameSite attributes.
paper | RFC 7519: JSON Web Token (JWT) | https://datatracker.ietf.org/doc/html/rfc7519 | IETF | The standard that defines JWT as a compact way to carry signed claims.
article | Cookies vs Sessions vs JWT vs PASETO | https://bytebytego.com/guides/cookies-vs-sessions-vs-jwt-vs-paseto/ | ByteByteGo | Side-by-side overview of the main authentication state choices.
```

```quiz
Sticky sessions have one clear weakness. What is it? | Cookies cannot be used at all ; Sessions die with that server ; Requests cannot be encrypted | 1 | The session lives only in one server's memory.
Four servers hold 5,000 users each and one dies. Users must log in again at 100 ms CPU each. How much CPU work is that? | 500 CPU seconds ; 50 CPU seconds ; 5,000 CPU seconds | 0 | 5,000 logins times 0.1 second is 500 seconds.
What is the main cost of a signed token design? | Every request needs a database call ; Servers must share local disks ; Early revocation is hard | 2 | The server does not look anything up, so it cannot easily cancel a token before it expires.
```

```story
A shop runs two web servers with sticky sessions. During a deploy the first server restarts and half the customers lose their carts mid-checkout. Support gets a flood of angry emails. Moving carts into a shared store means the next deploy is invisible to shoppers.
```

```adapted
The System Design Primer | https://github.com/donnemartin/system-design-primer | CC BY 4.0
```

# cdn-and-edge | CDNs and the Edge | 1 | 10
A content delivery network keeps copies of your files in many cities, so users download from a nearby server and your own servers do less work.

## What a CDN does
A CDN is a globally distributed network of proxy servers that serve content from locations closer to the user. Usually it serves static files such as HTML, CSS, JavaScript, photos and video. Some CDNs, such as Amazon CloudFront, also handle dynamic content. DNS tells each client which CDN server to contact.

It helps in two ways. Users get content from a data center near them, which cuts round-trip time (see [latency and throughput](/sd/docs/foundations/latency-and-throughput)). And your servers never see the requests the CDN answers.

## Push and pull
Push CDN: you upload content to the CDN yourself whenever it changes and rewrite your URLs to point at it. You control expiry and updates. Content is uploaded only when new or changed, which minimizes traffic but uses more storage. This suits sites with little traffic or content that rarely changes.

Pull CDN: you leave files on your own server and point URLs at the CDN. The first user to request a file makes the CDN fetch it from your origin, which makes that first request slower. After that it is cached. A time-to-live (TTL) decides how long. Pull CDNs use less storage but can create redundant traffic if files expire before they actually change. They suit high-traffic sites, since only recently requested content stays cached.

```mermaid A pull CDN fetches from the origin on the first request, then answers from its cache
sequenceDiagram
  participant U as User
  participant E as Edge server
  participant O as Origin
  U->>E: GET /logo.png
  E->>O: miss, fetch /logo.png
  O-->>E: file, max-age 86400
  E-->>U: file (slow, first request)
  U->>E: GET /logo.png
  E-->>U: file from cache (fast)
```

## Cache keys, TTLs and headers
A cache key is what the CDN uses to decide two requests want the same thing. By default it is the URL, and the HTTP `Vary` header can add request headers (for example language) to the key. Include something irrelevant, like a tracking parameter, and you get many copies of one file and a poor hit ratio.

Your origin controls caching with the `Cache-Control` header. `max-age=604800` marks a response fresh for one week. A shared cache such as a CDN can follow `s-maxage` instead, as RFC 9111 describes. `no-store` tells caches not to keep it at all, and `private` keeps personalized responses out of shared caches.

For files that never change at one URL, use cache busting: put a content hash in the filename (`app.3f9a1c.js`) and send a long `max-age` with `immutable`. A change makes a new URL, so nothing needs purging. For things without versioned URLs, you either wait for the TTL or ask the CDN to purge, which usually takes some seconds to spread across all edge servers.

Many CDNs now also run small pieces of your code at the edge (the CDN server nearest the user) for things like redirects, header rewrites and A/B tests. Keep that code short and stateless.

## Static Content Hosting
```card Static Content Hosting
Problem | Web servers burn compute on images, style sheets, scripts and downloads that are the same for every user.
Solution | Put those files in a storage service that serves them directly over HTTP, usually much cheaper than compute, and put a CDN in front of it.
Use when | A site has static files you want to serve cheaply, from many regions, or from apps hosted elsewhere, and you want their cost and bandwidth tracked apart.
Avoid when | The files need processing before delivery, or there are so few that fetching from separate storage costs more than it saves.
```

The Static Content Hosting pattern moves files that never change per user out of your web servers. A storage service answers requests for them directly. Its cost is typically much lower than running compute instances, and the web servers keep their cycles for pages that need code. Amazon S3 can host a whole static website, for example.

```mermaid Static Content Hosting: storage serves the files, the app serves only pages that need code
flowchart TD
  U[User] --> CDN[CDN]
  CDN -->|miss| St[(Object storage)]
  U -->|dynamic pages| App[App servers]
  App -.->|page links to| CDN
```

How it works, step by step:

1. Upload images, scripts, style sheets and downloads to a storage container with public read access.
2. Point your pages at the storage URL (or at a CDN in front of it), so browsers fetch files from there.
3. Keep the app servers for dynamic pages only.

Watch the details. Public read access is needed, but public write access must be off, or strangers can upload content. When some content sits in storage and the rest on your servers, deploys get harder, so version code and content together. Pages must use the storage URL, since some services do not support custom domain names. When files move, keep old links working with URL rewriting or a redirect at the CDN. For private files, use a [valet key](/sd/docs/cloud-architecture/security-patterns), a short-lived signed link, instead of making them public. A CDN caches the files near users, and a separate storage account makes bandwidth and cost easy to measure apart from your compute bill.

## A worked example: an image-heavy page
Invented numbers. A page has 40 images of 150 KB each, so 6 MB. It gets 1 million views per day. That is 40 million image requests per day, or about 463 per second on average.

Without a CDN, your origin serves 463 requests per second and 6 TB per day (1 million x 6 MB).

With a CDN at a 95 percent hit ratio, only 5 percent of requests reach the origin: 2 million per day, about 23 per second, and 300 GB per day (2 million x 150 KB). The origin load drops by 95 percent.

Latency: a visitor in Mumbai, origin in Virginia, with a round trip of roughly 200 ms. Setting up a connection and asking for the first byte takes about three round trips (TCP, TLS 1.3, then the request, as in the [HTTP lesson](/sd/docs/foundations/client-server-http)), so around 600 ms before data arrives. An edge server 20 ms away needs about 60 ms. The exact count varies with protocol and connection reuse, but the ratio of distances holds.

## What goes wrong: stale content
You fix a typo in `logo.png`, but users still see the old logo. The file has `max-age` of one year and the same URL. The symptom is different users seeing different versions depending on when their cache filled. Confirm by checking response headers for `Age` and `Cache-Control`, and compare the origin's copy with the edge copy using `curl -I`. The fix is to purge the CDN. That does not reach browsers that already cached the file for a year, so in future use hashed filenames.

```mermaid A content hash in the filename makes each version a new URL, so nothing needs purging
flowchart TD
  H[index.html] -->|links to| J1[app.3f9a1c.js]
  H2[index.html after a deploy] -->|links to| J2[app.b72e08.js]
  J1 -.->|old URL stays cached, unused| E[Edge cache]
  J2 -->|new URL, first miss| E
  class J2 good
```

A second failure is caching a personalized page by mistake. A CDN stores a response with a user's name in it and serves it to others. Mark such responses `private` or `no-store`.

## When a CDN is the wrong tool
Highly personalized or constantly changing data gets little benefit, since each response is unique. If all your users sit in one city near your servers, the latency gain is small. CDN bills can be significant with heavy traffic, though you should weigh them against the cost of serving that traffic yourself. Pages need URLs that point at the CDN, which is extra setup.

## Common mistake
A long TTL on files whose URLs never change.

```resources
article | System Design Primer: Content delivery network | https://github.com/donnemartin/system-design-primer#content-delivery-network | Donne Martin | Explains push and pull CDNs, TTLs and the drawbacks of cost and stale content.
docs | HTTP caching | https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Caching | MDN | Covers private and shared caches, max-age, Vary, cache busting and the immutable directive.
paper | RFC 9111: HTTP Caching | https://www.rfc-editor.org/rfc/rfc9111.html | IETF | The standard behind Cache-Control, including shared-cache rules such as s-maxage.
docs | Static Content Hosting pattern | https://learn.microsoft.com/en-us/azure/architecture/patterns/static-content-hosting | Azure Architecture Center | Explains serving static files from storage, with CDN, URL and access control considerations.
docs | Hosting a static website using Amazon S3 | https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html | AWS | Shows object storage hosting a static website, and recommends a managed CDN-backed host (Amplify Hosting) for it.
```

```quiz
A page is 100 KB of HTML plus 1 MB of static files. Moving the static files cuts server traffic by about how much? | About 10 percent ; About 50 percent ; 91 percent | 2 | The server then sends 0.1 MB instead of 1.1 MB, a drop of about 91 percent.
A page makes 40 million image requests a day at a 95 percent hit ratio. How many reach the origin? | 20 million ; 2 million ; 38 million | 1 | 5 percent of 40 million is 2 million.
You fix a typo in an image but users still see the old one. Best long-term fix? | Hash the filename ; Lower the server's CPU usage by half ; Turn off HTTPS on the CDN | 0 | A new URL for each version means no purge is needed.
```

```story
A photo site is slow for readers in Asia, because every image crosses an ocean from the one data center in Europe. The team puts a CDN in front of the images. Pages load in a fraction of the time, and the origin's bandwidth bill falls sharply. The one new job is learning to name files by their content hash.
```

```adapted
The System Design Primer | https://github.com/donnemartin/system-design-primer | CC BY 4.0
Azure Architecture Center (Microsoft) | https://learn.microsoft.com/en-us/azure/architecture/patterns/ | CC BY 4.0
```

# microservices | Microservices and Service Discovery | 3 | 12
Microservices split an application into small services that are deployed on their own and talk over the network. They solve team and scaling problems, and create new ones, so most teams should start with a monolith.

## Application layer and microservices
Separating the web layer from the application layer (sometimes called the platform layer) lets you scale and configure each independently. A new API means adding application servers, not necessarily more web servers. The single responsibility principle says services should be small and autonomous, and small teams with small services can plan more aggressively for fast growth. Workers in the application layer also enable asynchronous work (see [message queues](/sd/docs/async/message-queues)).

Microservices are a suite of small, independently deployable services. Each runs its own process and communicates through a well-defined, lightweight mechanism to serve one business goal. Pinterest could have services for user profile, followers, feed, search and photo upload.

A monolith is the opposite: one codebase, deployed as one unit. It is not primitive. Calls between modules are plain function calls, a transaction can span all the data, and one deploy ships everything.

```mermaid Each service owns its data and is reached through one front door
flowchart TD
  C[Client] --> G[Gateway]
  G --> O[Orders]
  G --> U[Users]
  G --> P[Payments]
  O --> ODB[(Orders data)]
  U --> UDB[(Users data)]
  P --> PDB[(Payments data)]
```

## What you pay for
1. Network calls replace function calls. They are slower and can fail, time out or arrive twice (see [timeouts and retries](/sd/docs/reliability/timeouts-and-retries)).
2. Failures chain. If a request needs several services, it succeeds only when they all do.
3. Data ownership. Each service should own its data. You lose joins and easy transactions across services.
4. Operations. More deployments, dashboards, pipelines and on-call rotations.
5. Testing a whole flow needs many services running together.

## Service discovery
Instances come and go as services scale and restart, so addresses change. Service discovery tracks which instances exist. Systems like Consul, etcd and ZooKeeper keep a registry of names, addresses and ports, and health checks (often an HTTP endpoint) verify an instance still works. Consul and etcd also include a key-value store for config.

The flow is short. An instance registers its address on startup. The registry watches its health and drops instances that fail. With Consul, callers look up a service by name using DNS and receive addresses of healthy instances.

Two styles exist. In client-side discovery the caller asks the registry for the list and picks an instance itself, so each client carries balancing logic. In server-side discovery the caller sends to a fixed address (a [load balancer](/sd/docs/scaling/load-balancing) or proxy) that consults the registry. Server-side keeps clients simple but adds a hop and one more component to keep alive.

Moving shared chores such as discovery, retries and TLS out of each service and into a helper process is the idea behind the [Sidecar and service mesh](/sd/docs/cloud-architecture/sidecar-and-ambassador) lesson.

```mermaid Instances register themselves, the registry drops dead ones, callers look names up
sequenceDiagram
  participant I as Orders instance
  participant R as Registry
  participant C as Caller
  I->>R: register 10.0.0.7:8080
  R->>I: health check
  I-->>R: ok
  C->>R: where is orders?
  R-->>C: 10.0.0.7:8080
  Note over R: Instance stops answering, so it is removed
```

## A worked example: availability of a chain
Invented numbers. A request calls 5 services in sequence. Each is available 99.9 percent of the time, which allows about 43 minutes of downtime per 30-day month.

If failures are independent, the request succeeds with probability $0.999^5$, about 0.995. That is 99.5 percent, roughly 216 minutes of failed requests per month, five times worse than any single service. With 10 services in the chain it falls to about 99.0 percent, or about 430 minutes. Latency compounds too: if each hop adds 5 ms, 10 hops add 50 ms before any real work. Retries, caching and fewer hops all help, but the arithmetic shows why each extra service has a cost.

## What goes wrong: the pipeline that drowned its team
Engineers at Twilio Segment described this in "Goodbye Microservices". Their pipeline sent customer events on to many third-party destination APIs, over 140 by the end. A single shared queue caused head-of-line blocking: when one destination slowed, retries flooded the queue and delayed everyone. They split into a service and queue per destination, which fixed that. Then came new costs. Each destination got its own repository. Shared libraries drifted apart, because updating them meant deploying dozens of services. Each service had a different load pattern, so auto-scaling was hard to tune. Their operational overhead rose with every destination added, and by the end they say 3 full-time engineers were spending most of their time keeping the system alive. They consolidated over 140 services into one service and one repository.

The symptoms to watch for: small changes needing many deploys, engineers afraid to update shared code, and on-call alerts from services nobody understands. You confirm it by counting how many services a typical change touches.

## When microservices are the wrong tool
For a small team, a new product or unclear domain boundaries, start with a well-structured monolith. You can split later, along seams you have actually seen. Latency-sensitive systems such as trading engines also dislike extra network hops. Microservices pay off when many teams need to ship independently or when parts have very different scaling needs. Segment's own conclusion was that microservices worked well in some parts of their infrastructure and hurt in others.

## Common mistake
Splitting by technical layer or by guesswork on day one, then discovering that every feature needs changes in six services.

```resources
article | System Design Primer: Application layer | https://github.com/donnemartin/system-design-primer#application-layer | Donne Martin | Covers microservices, service discovery with Consul, etcd and ZooKeeper, and the added operational complexity.
article | Goodbye Microservices: From 100s of problem children to 1 superstar | https://segment.com/blog/goodbye-microservices/ | Alexandra Noonan, Twilio Segment | First-hand account of moving over 140 services back into a monolith.
docs | Service discovery explained | https://developer.hashicorp.com/consul/docs/concepts/service-discovery | HashiCorp | Describes a service catalog, registration, health checks and DNS lookups in Consul.
article | Is Microservice Architecture the Silver Bullet? | https://bytebytego.com/guides/is-microservice-architecture-the-silver-bullet/ | ByteByteGo | Short list of applications that suit a monolith better.
```

```quiz
Five services in a chain are each 99.9 percent available. What is the chain's availability, roughly? | 99.5 percent ; 99.9 percent, same as one ; 99.0 percent or lower | 0 | 0.999 to the fifth power is about 0.995.
In client-side service discovery, who picks the instance? | The load balancer in front of the service ; The DNS root servers ; The caller, after asking the registry | 2 | The client queries the registry and chooses for itself.
Why did Segment's per-destination services become a burden? | Queues were too fast to monitor ; Each new one added more work ; Customers stopped sending events | 1 | More destinations meant more repos, queues and services to run.
```

```story
A five-person startup splits its new app into twelve services because a conference talk said so. Every feature now needs three pull requests, a local setup takes an hour, and one outage takes a day to trace across services. They merge the code back into one app and ship twice as fast.
```

```adapted
The System Design Primer | https://github.com/donnemartin/system-design-primer | CC BY 4.0
```
