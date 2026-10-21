# competing-consumers | Competing Consumers and Queue-Based Load Leveling | 2 | 12
Queue-Based Load Leveling puts a queue between a bursty sender and a service so the service works at its own pace. Competing Consumers then lets many workers pull from that same queue so the backlog clears faster.

## Queue-Based Load Leveling

```card Queue-Based Load Leveling
Problem | A service gets bursts of requests, and too many concurrent calls make it slow, crash or time out its callers.
Solution | Put a queue between the callers and the service. The service pulls messages at a rate it can sustain, however fast they arrive.
Use when | Spikes would overwhelm a downstream service and the caller does not need an instant answer.
Avoid when | The caller needs the result in the same request, or arrivals stay above the service rate for long.
```

The problem: a service gets traffic in bursts. Many tasks call it at once, and the number of requests at any moment is hard to predict. Too many concurrent calls can make the service slow or crash, and callers time out.

How it works:
1. A task puts a message with the data the service needs onto a queue, then moves on.
2. The queue stores the message durably until the service asks for it.
3. The service pulls messages at a rate it can sustain, however fast they arrived.
4. If the service is down for a while, tasks keep posting and nothing is lost, as long as the queue stores messages durably.

```mermaid Queue-Based Load Leveling: a burst goes in fast and the service takes it out at its own pace
flowchart TD
  T[Many tasks] -->|burst of 800 per second| Q[(Queue)]
  Q -->|steady 200 per second| S[Service]
  S --> D[(Database)]
  class Q warn
```

A queue is one-way. If the task needs a reply, use [Asynchronous Request-Reply](/sd/docs/cloud-messaging/claim-check-and-async-reply) or another channel for results.

The service no longer has to be sized for the peak, only for the average load plus an acceptable delay. Use it when spikes would overwhelm a downstream service and the caller does not need an instant answer. The [message queues lesson](/sd/docs/async/message-queues) covers the queue itself.

## Competing Consumers

```card Competing Consumers
Problem | One consumer cannot keep up with the queue, but each message must be handled by only one worker.
Solution | Run several identical consumers on one queue. The broker gives each message to a single consumer and hides it from the rest while it is processed.
Use when | Tasks are independent and can run in parallel, and you want to add or remove workers as the backlog changes.
Avoid when | Tasks must run in a fixed order, or the consumers are not safe to run twice on one message.
```

The problem: one consumer cannot keep up, and some messages take much longer than others. You need several consumers, but each message must go to only one of them, and no consumer should become a bottleneck.

How it works:
1. The application posts requests as messages on one queue.
2. Several identical consumer instances read from that queue.
3. The broker hands each message to a single consumer and hides it from the others for a set time, the visibility timeout.
4. A consumer that finishes sends an acknowledgement. If the timeout runs out with no acknowledgement, because the consumer crashed or was just too slow, the message becomes visible again and another consumer takes it.

Delivery is at least once. At any moment only one consumer holds a message, but if its acknowledgement is lost or arrives after the visibility timeout, the same message is handed out again. That is why the consumers must be idempotent.

```mermaid Competing Consumers: the second consumer takes over when the first crashes without an ack
sequenceDiagram
  participant Q as Queue
  participant A as Consumer A
  participant B as Consumer B
  Q->>A: message 1
  Q->>B: message 2
  B-->>Q: ack 2
  Note over Q,A: A crashes, no ack for message 1, the hide timer runs out
  Q->>B: message 1 again
  B-->>Q: ack 1
```

Because any healthy instance can take any message, a failed instance does not block the producer. You can add or remove instances as the queue length changes. This differs from publish/subscribe, where every subscriber gets every message, covered in [event streams](/sd/docs/async/event-streams). Use it when tasks are independent and can run in parallel. Do not use it when tasks must run in a fixed order, since the order consumers receive messages is not guaranteed.

| | Queue-Based Load Leveling | Competing Consumers |
| --- | --- | --- |
| Problem solved | Bursts overload a service | One consumer is too slow |
| Mechanism | A buffer in between | Many workers on one queue |
| Typical risk | Backlog grows without limit | Duplicates and no ordering |

## A worked example: a sale-day spike (invented numbers)
A database safely handles 200 writes per second. Each consumer takes 100 ms per message, so it finishes 10 per second. Twenty consumers make 200 per second, exactly the database's limit.

Orders normally arrive at 50 per second. For 60 seconds during a sale they arrive at 800 per second.
1. Without a queue, 800 - 200 = 600 writes per second are refused or time out.
2. With a queue, the backlog grows by 800 - 200 = 600 per second for 60 seconds, so it reaches 36,000 messages.
3. After the spike, arrivals fall to 50 per second. The queue drains at 200 - 50 = 150 per second.
4. Emptying 36,000 messages takes 36,000 / 150 = 240 seconds, 4 minutes.
5. The last order of the spike had 36,000 messages ahead of it and is served at 200 per second, so it waits 180 seconds.

```mermaid Queue backlog during and after the 60 second spike: it grows by 600 a second, then drains by 150 a second
xychart-beta
  x-axis "seconds since the spike began" [0, 60, 120, 180, 240, 300]
  y-axis "messages in queue" 0 --> 40000
  line "backlog" [0, 36000, 27000, 18000, 9000, 0]
```

Now someone turns on autoscaling and the pool grows to 40 consumers. They can now push 400 writes per second into a database that handles 200. The queue drains faster, but the database is overloaded again. The queue only helps if the total consumer rate stays within what the downstream system can take.

## What goes wrong: the poison message
One message has a malformed field and crashes any consumer that reads it. The crash means no acknowledgement, so once the visibility timeout runs out the message reappears and another consumer picks it up and crashes too. The symptom is consumers restarting in a loop and a queue that never shrinks even though traffic is low. Confirm it by looking for the same message id with a rising delivery count in the logs. The fix is a maximum delivery count, after which the broker moves the message to a [dead-letter queue](/sd/docs/async/background-jobs) for a human to inspect. Alarm on that queue.

## When a queue is the wrong tool
If the caller needs the answer in the same request, such as a price quote, a queue adds delay and nothing else. If work must happen in strict order, many competing consumers will break it, so use the [Sequential Convoy](/sd/docs/cloud-messaging/priority-and-ordering). If the average arrival rate is above the average service rate for long, a queue only delays the failure. The backlog grows until messages are too old to matter, which is the case [back pressure](/sd/docs/async/back-pressure) exists for. Also make consumers [idempotent](/sd/docs/async/delivery-guarantees), because redelivery is part of the design.

## Common mistake
Autoscaling consumers on queue depth with no upper limit. The queue looks healthy because it drains, while the database behind it is overloaded.

```resources
docs | Competing Consumers pattern | https://learn.microsoft.com/en-us/azure/architecture/patterns/competing-consumers | Azure Architecture Center | Covers the problem, one-message-one-consumer delivery, poison messages and ordering caveats.
docs | Queue-Based Load Leveling pattern | https://learn.microsoft.com/en-us/azure/architecture/patterns/queue-based-load-leveling | Azure Architecture Center | Explains the buffer, and warns that autoscaling without bounding downstream rate only moves the overload.
article | System Design Primer: Asynchronism | https://github.com/donnemartin/system-design-primer#asynchronism | Donne Martin | Short treatment of queues, workers and back pressure.
article | Avoiding insurmountable queue backlogs | https://aws.amazon.com/builders-library/avoiding-insurmountable-queue-backlogs/ | Amazon Builders' Library (now on AWS Builder Center) | Discusses how backlogs form and how Amazon systems use back pressure and prioritization to drain them.
```

```quiz
After a 60 second spike a queue holds 36,000 messages. Consumers do 200 per second and 50 arrive per second. How long to drain it? | 240 seconds ; About 180 seconds ; About 12 minutes | 0 | The queue drains at 200 minus 50 which is 150 per second, and 36,000 divided by 150 is 240.
A consumer takes a message, then its server loses power before it finishes. What happens to the message? | It is lost, since the broker already delivered it ; It stays hidden until the visibility timeout ends, then another consumer gets it ; The broker at once gives it to every other consumer | 1 | The broker only counts a message as done when it gets an ack. With none, the message reappears after the timeout and one other consumer gets it.
Your consumers write to a database that handles 200 writes per second. Why can scaling consumers to 40 hurt? | The queue stops accepting any new messages from producers ; Each consumer then reads fewer messages from the queue ; They can push 400 writes per second into it | 2 | Consumers can push more load than the downstream service can take, which moves the overload.
```

```story
A ticket site sells out in four minutes. Before launch day, its order service fell over every time a big show went on sale. Now orders go onto a queue and twenty workers feed the database at the speed it can take. Buyers see "we got your order" straight away and get the confirmation a few minutes later, instead of an error page.
```

```adapted
Azure Architecture Center (Microsoft) | https://learn.microsoft.com/en-us/azure/architecture/patterns/ | CC BY 4.0
```

# priority-and-ordering | Priority Queue and Sequential Convoy | 2 | 10
A Priority Queue lets urgent work jump the line. A Sequential Convoy does the opposite for related messages: it keeps them in strict order, one at a time, while unrelated groups run in parallel.

## Priority Queue

```card Priority Queue
Problem | Most queues are first in, first out, so a rush job waits behind a thousand routine ones.
Solution | Give each message a priority and let consumers take higher priorities first, using one sorted queue, several queues, or separate worker pools.
Use when | Different kinds of work have different latency targets, such as premium versus standard customers.
Avoid when | All work matters equally, or top-priority spikes could starve everything else for good.
```

The problem: most queues are first in, first out, so a rush job waits behind a thousand routine ones. If you promise faster service to some customers, FIFO cannot keep that promise.

The producer attaches a priority to each message, and consumers handle higher priorities first. There are three common ways to build it.
1. One queue ordered by priority. The broker sorts the messages. RabbitMQ classic queues support this, and its documentation recommends a low single-digit number of priority levels because each level costs memory and CPU.
2. Several queues with one shared pool of consumers. Consumers always check the high-priority queue first and only move down when it is empty. High priority always wins, so low priority can be delayed forever.
3. Several queues, each with its own consumer pool. Premium work gets more or faster workers. Pools are isolated, so trouble in one queue cannot spread, but idle capacity in one pool is not shared.

```mermaid Priority Queue: workers drain the high queue first and only take low work when it is empty
flowchart TD
  P[Producers] -->|high| H[(High queue)]
  P -->|low| L[(Low queue)]
  H -->|always first| W[Worker pool]
  L -.->|only when high is empty| W
  class L warn
```

Use it when different kinds of work need different latency targets, such as premium versus standard customers. Do not use it when all work matters equally and plain order is more important. A common fix for starvation is to raise the priority of old messages over time, called aging.

## Sequential Convoy

```card Sequential Convoy
Problem | Related messages must be handled in order, but one consumer cannot scale and many plain consumers can swap the order.
Solution | Give every message a category key such as the order id. A consumer takes a whole group and has it to itself until done, while other groups run in parallel.
Use when | Order matters within a group, such as the events of one order, and not across groups.
Avoid when | Order does not matter, or one key carries so much traffic that a single consumer cannot keep up.
```

The problem: related messages must be handled in order, but you still want many workers. Take an order system that receives create, add item, edit and cancel events. For one order, the order of events matters. Across different orders it does not. A single consumer keeps the order but cannot scale. Many competing consumers scale, but two of them can take consecutive messages for the same order and apply them in the wrong sequence.

The solution: give every message a category key, such as the order id. The broker groups messages by key, and a consumer that takes a group gets exclusive use of it until it is done. Within a group, the broker hands messages to the consumer in the order it received them. Different groups go to different consumers at once. Amazon SQS FIFO queues call the key a message group id and process messages in a group one at a time, in strict order. Other brokers use the term session, or partition keys as described in [event streams](/sd/docs/async/event-streams).

```mermaid Sequential Convoy: each order id is one group, handled in order by one consumer at a time
flowchart LR
  M[Messages with order id] --> G1[Group order 17]
  M --> G2[Group order 18]
  G1 -->|in order| C1[Consumer A]
  G2 -->|in order| C2[Consumer B]
```

Trace of five messages through two consumers, where each consumer owns one order group at a time:

| Time slot | Consumer A (owns order 17) | Consumer B (owns order 18) |
| --- | --- | --- |
| 1 | order 17 create | order 18 create |
| 2 | order 17 add item | order 18 add item |
| 3 | order 17 cancel | idle |

Once the broker has the messages, order 17 is handled in sequence, because only A touches it. Orders 17 and 18 still run side by side.

Choose the key carefully. It is the unit of parallelism. A key that is too coarse, like one customer id for all orders, limits parallel work. Within a group, throughput is limited to one message per processing time. Producers must also set the key correctly, since a wrong key puts a message in the wrong group.

## A worked example: a backlog under priority, and a hot key (invented numbers)
Twelve workers take 2 seconds per job, so the pool completes 12 / 2 = 6 jobs per second. Premium jobs arrive at 4 per second and standard jobs at 3 per second, a total of 7. That is above capacity. With plain first-in, first-out order the backlog would grow by 1 job per second too, shared by everyone. Strict priority moves all of that growth onto standard jobs.

With one shared pool and strict priority, premium takes 4 of the 6 slots. Standard gets the remaining 2 per second, but 3 arrive. The standard backlog grows by 1 per second. After 10 minutes (600 seconds) it holds 600 jobs, and a new standard job waits 600 / 2 = 300 seconds and rising. Nothing is broken, yet standard users see growing delays. If premium alone arrived at 6 per second, standard would get 0 slots, and that is true starvation.

```mermaid Standard backlog under strict priority when 3 standard jobs arrive and only 2 slots are left each second
xychart-beta
  x-axis "seconds" [0, 100, 200, 300, 400, 500, 600]
  y-axis "standard jobs waiting" 0 --> 600
  line "standard backlog" [0, 100, 200, 300, 400, 500, 600]
```

For the convoy, say processing one message takes 50 ms, so one group handles 1 / 0.05 = 20 messages per second. Ten consumers can then handle 10 x 20 = 200 messages per second across many groups. One very busy order that produces 100 messages per second is still served by one consumer at a time, so it falls behind by 100 - 20 = 80 messages per second.

## What goes wrong: a poison message in a convoy
Inside a group, one message that always fails blocks every message behind it, because order must be kept. The symptom is one key whose lag grows while every other key is fine. Confirm it by listing per-group backlog and looking for a group whose oldest message keeps its delivery count rising (the number of times the broker has handed it out and had it fail). The fix is a retry limit that sends the message to a dead-letter queue so the group can continue. That breaks strict order for that one message, so decide ahead of time what the business wants. Messages can also arrive out of order before the broker sees them, so when order is critical, add a sequence number to each message in a group, so the consumer can spot a gap or a late arrival and wait for the missing one.

## When these patterns are the wrong tool
If every job is equally important, a priority queue adds rules for no gain. If you use priorities, check that spikes in top-priority work cannot starve everything else. If ordering is not required, plain [Competing Consumers](/sd/docs/cloud-messaging/competing-consumers) are simpler and scale better. Amazon's article on queue backlogs also notes that by the time a backlog has built up, it can be too late to prioritize, and describes separate queues per customer or workload as one option. And if you need strict order across everything at very high volume, rethink whether you really need global order.

## Common mistake
Making everything high priority. When most messages carry the top priority, the feature has no effect and the lower levels are starved.

```resources
docs | Priority Queue pattern | https://learn.microsoft.com/en-us/azure/architecture/patterns/priority-queue | Azure Architecture Center | Describes single queue, multiple queues, and shared or separate consumer pools, and the risk of starving low priority.
docs | Sequential Convoy pattern | https://learn.microsoft.com/en-us/azure/architecture/patterns/sequential-convoy | Azure Architecture Center | Explains category keys, session locks, poison messages and hot keys.
docs | RabbitMQ priority queues | https://www.rabbitmq.com/docs/priority | RabbitMQ | Explains how priority queues work and recommends a small number of priority levels.
docs | Using the message group ID with Amazon SQS FIFO queues | https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/using-messagegroupid-property.html | AWS | States that messages in one group are processed one at a time in strict order.
```

```quiz
Capacity is 6 jobs per second. Premium arrives at 4 per second, standard at 3, strict priority. How fast does the standard backlog grow? | About 3 per second ; 1 per second ; Exactly 2 per second | 1 | Standard gets 6 minus 4 which is 2 per second, and 3 arrive, so the backlog grows by 1.
A chat app with group chats must show each conversation's messages in order, while different conversations run in parallel. What is the best key? | The sender's id ; The conversation id ; The message length | 1 | The key defines the group that is processed one message at a time, so it must be the thing whose messages need order. Many senders share one conversation.
One group in a convoy has a message that always fails, and no retry limit is set. What happens to the rest of that group? | They wait behind it ; They skip it and carry on as normal without it ; They are moved over to the other groups | 0 | Strict order means nothing after the failing message in that group can proceed. With a retry limit and a dead-letter queue, the message would be moved aside and the group could continue.
```

```story
A support platform gives paying customers a 10 second response promise. Their tickets sat behind a flood of free-tier imports for a full hour. A second queue for paid tickets, with its own workers, brought the wait back under 10 seconds, and the free imports simply took a little longer.
```

```adapted
Azure Architecture Center (Microsoft) | https://learn.microsoft.com/en-us/azure/architecture/patterns/ | CC BY 4.0
```

# claim-check-and-async-reply | Claim Check and Asynchronous Request-Reply | 2 | 12
Claim Check keeps a large payload out of the message broker by storing it elsewhere and sending only a reference. Asynchronous Request-Reply lets a client start slow work, get an immediate receipt, and collect the result later.

## Claim Check

```card Claim Check
Problem | Message systems cap message size and are built for many small messages, so a large payload is slow, costly or rejected.
Solution | Save the payload in an external store, then send a small message that holds a reference to it. The receiver fetches the payload with that reference.
Use when | Payloads are large, such as files or documents, or near the broker's size limit.
Avoid when | Payloads fit comfortably in a message, since the pattern adds a second system and an extra trip.
```

The problem: message systems are built for many small messages and often cap message size. Amazon SQS, for example, allows at most 1 MiB per message. Big messages can be rejected, use broker memory and disk that other messages need, slow every producer and consumer, and cost more on services that charge by size.

How it works:
1. The sender creates the payload, such as a video or a large document.
2. The sender saves it in an external store, such as object storage.
3. Only after the save succeeds, the sender publishes a small message holding a reference (the claim check) to the stored payload.
4. The receiver reads the message and takes the reference.
5. The receiver fetches the payload from the store and processes it.

```mermaid Claim Check: the payload goes to the store and only a small reference goes through the broker
sequenceDiagram
  participant S as Sender
  participant St as Store
  participant B as Broker
  participant R as Receiver
  S->>St: save large payload
  St-->>S: reference
  S->>B: small message with reference
  B->>R: deliver message
  R->>St: fetch payload by reference
  St-->>R: payload
```

The name comes from a coat check: you hand over the coat and get a ticket, and later the ticket gets the coat back. The reference is the ticket. The broker never sees the payload. The store also controls who may read it and when it expires. Do not put secrets in the reference, and let the store check access. If the receiver must verify the payload, put a content hash in the message. The store must stay available as long as any message can still be read. Libraries do some of this for you, such as the Amazon SQS Extended Client Library, which sends larger messages through S3.

## Asynchronous Request-Reply

```card Asynchronous Request-Reply
Problem | Slow work cannot be done inside one HTTP request without timeouts, yet the client still needs the outcome.
Solution | The API starts the work and answers 202 Accepted with a status address. The client polls that address and fetches the result when the work is done.
Use when | The work takes seconds or minutes and the client cannot hold a connection open.
Avoid when | The work takes about 100 ms, or the server can push the result by WebSocket or webhook.
```

The problem: a user clicks "export my data" and the work takes 45 seconds. Holding an HTTP request open that long invites timeouts. Yet the client still needs to know when the work finishes.

How it works over HTTP, using polling:
1. The client sends the request. The API checks it, so a bad request gets an immediate 400.
2. The API starts the work, often by putting a message on a queue, and replies with 202 Accepted. The 202 carries a Location header with the address of a status endpoint, and often a Retry-After header saying how long to wait.
3. The client asks the status endpoint. While the work runs it answers 200 with a status such as Pending or Running.
4. When the work is done, the client fetches the result. The status endpoint may answer 303 See Other pointing to the result, or the resource named in Location may simply return 200. If the work failed, the client gets an error status with details. A 303 means "the result is at a different address, fetch it with a GET", and clients follow it automatically.

```mermaid Asynchronous Request-Reply: 202 with a status address, then polling until the work is done
sequenceDiagram
  participant C as Client
  participant A as API
  participant Q as Queue
  participant W as Worker
  C->>A: start export
  A->>Q: job message
  A-->>C: 202 Accepted, Location, Retry-After
  Q->>W: job
  C->>A: GET status
  A-->>C: 200 Running
  W-->>A: result stored
  C->>A: GET status
  A-->>C: 303 See Other, result address
  C->>A: GET result address
  A-->>C: 200 result
```

Some designs skip the status endpoint. The client polls the final address and gets 404 until the result exists.

Good status responses include the state, when it was created and last updated, and a structured error if it failed. A DELETE on the status resource can cancel the work, and a cancelled job ends in a Canceled state. An idempotency key on the first request stops a retried request from starting the job twice. Delete old status records after a retention period.

```mermaid A status resource moves from accepted to running to a final state, and the client reads it by polling
stateDiagram-v2
  [*] --> Accepted: 202 returned
  Accepted --> Running: worker takes the job
  Running --> Succeeded: result stored
  Running --> Failed: error recorded
  Accepted --> Canceled: DELETE on the status resource
  Running --> Canceled: DELETE on the status resource
  Succeeded --> [*]
  Failed --> [*]
  Canceled --> [*]
```

## A worked example: payload size and polling (invented numbers)
A service sends 10,000 uploads a day, each 40 MiB. Inline, the broker carries 10,000 x 40 = 400,000 MiB, which is about 390 GiB a day. A 40 MiB message is also forty times above the 1 MiB SQS limit, so inline sending is impossible there. With claim checks, each message is about 200 bytes, so the broker carries 10,000 x 200 bytes = 2 MB a day. The 390 GiB still moves, but through the object store that is built for it.

Now polling. A thousand clients wait for a report. If each polls every 2 seconds, the status endpoint sees 1,000 / 2 = 500 requests per second. If the server sends Retry-After: 10 and clients obey, it sees 1,000 / 10 = 100 per second, one fifth of the load. The 45 second job needs about 5 polls instead of 23.

```mermaid Status requests per second from 1,000 waiting clients, by how often each one polls
xychart-beta
  x-axis [Every 2 seconds, Retry-After 10 seconds]
  y-axis "requests per second" 0 --> 500
  bar [500, 100]
```

## What goes wrong: orphans and dead references
The payload store and the broker are two systems, so there is no single transaction across them. A sender saves the payload, then crashes before publishing. The payload stays in the store with no message pointing at it, and costs money until a lifecycle rule or a cleanup job removes it. The reverse is worse: if the message were sent before the save finished, the receiver would hold a reference to nothing. Another trap is a lifecycle rule that deletes payloads after 7 days while messages can wait in a queue for 14, so valid messages point at deleted data. Symptoms are growing storage bills and consumers failing with "not found". Confirm by comparing payload count to message count and checking retention settings on both sides. Publish only after the save, give payloads a retention longer than message retention, and make consumers [idempotent](/sd/docs/async/delivery-guarantees).

## When these patterns are the wrong tool
If payloads fit comfortably inside the broker limit, send them inline. The pattern adds a second system and an extra network trip. Compressing the message or splitting it into chunks are alternatives. Asynchronous Request-Reply is also wrong when the work takes 100 ms, since a plain response is simpler. When the server can push, such as with WebSockets or webhooks, you may not need polling. For live streams of updates, Server-Sent Events (a one-way connection where the server keeps sending updates to the browser) fit better.

## Common mistake
Returning 202 with no Location header, so the client has no address to check. It cannot learn the outcome, so it guesses or resubmits and the job runs twice.

```resources
docs | Claim Check pattern | https://learn.microsoft.com/en-us/azure/architecture/patterns/claim-check | Azure Architecture Center | Lists the six steps and the lifecycle, security and consistency issues of storing a payload separately.
docs | Asynchronous Request-Reply pattern | https://learn.microsoft.com/en-us/azure/architecture/patterns/asynchronous-request-reply | Azure Architecture Center | Describes the 202, Location, Retry-After and 303 flow and what a status response should hold.
article | Claim Check | https://www.enterpriseintegrationpatterns.com/patterns/messaging/StoreInLibrary.html | Hohpe and Woolf | The original pattern write-up from Enterprise Integration Patterns.
docs | Amazon SQS message quotas | https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/quotas-messages.html | AWS | States the 1 MiB maximum message size and points to extended client libraries for larger payloads.
```

```quiz
A claim-check sender publishes the message before the payload save finishes. What can happen? | The broker rejects the small message as invalid ; The receiver may point at nothing ; The payload gets saved twice by mistake | 1 | A token that points at data not yet stored cannot be resolved.
2,000 clients poll every 5 seconds. The server starts sending Retry-After: 20 and clients obey. How many status requests per second now? | 100 ; 400 ; 40 | 0 | 2,000 clients divided by a 20 second interval is 100 per second, down from 2,000 / 5 = 400.
An export takes about 45 seconds. What should the API do on the first request? | Wait 45 seconds, then reply 200 with the file ; Reply 201 Created and tell the client to retry the same POST later ; Reply 202 Accepted with a Location to poll | 2 | 202 means accepted for processing, and Location points to where to check progress.
```

```story
A medical app lets clinics upload scans of up to 200 MB. The team first tried to push each scan through its message queue, which refused them. They now save the scan to object storage and send a 200 byte message. The clinic gets a receipt right away and a link to the processed result later.
```

```adapted
Azure Architecture Center (Microsoft) | https://learn.microsoft.com/en-us/azure/architecture/patterns/ | CC BY 4.0
```

# pipes-and-filters | Pipes and Filters | 2 | 10
Pipes and Filters splits a complex job into small independent steps, called filters, joined by channels, called pipes. Each step can then be reused, replaced, reordered and scaled on its own.

## The idea

```card Pipes and Filters
Problem | One big processing step is hard to reuse, hard to test and must be scaled as large as its most demanding part.
Solution | Split the job into independent filters that each do one task, joined by pipes such as queues. Filters can be reordered, replaced and scaled on their own.
Use when | Steps differ in scaling needs, can run in parallel, or are worth reusing in other pipelines.
Avoid when | Steps share a lot of in-memory state, take microseconds, or must succeed or fail together.
```

Picture one big function that decodes an upload, scans it, resizes it and stores it. It works, but it is a lump. Another pipeline that needs the same scan step must copy it. A change to one step forces a retest of everything. Every copy of the program must be as large as the most demanding step.

Pipes and Filters breaks the lump apart. A filter does one task. It reads from an inbound pipe, does its work and writes to an outbound pipe. A pipe is a channel such as a queue, or a stream of items read in order. The idea is old: the Unix shell's `|` joins programs the same way.

Filters know only their input and output formats. So you can reorder them or insert a new one, as long as one filter's output matches the next filter's input. A filter should not assume how it was invoked, so each message must carry what the filter needs. For the resize filter that is the image (or a pointer to it) and the target size, not a hope that an earlier step left it somewhere.

## Running it with queues
The pattern works inside one program, but it earns its keep when the pipes are queues and each filter is its own service.
1. A message enters the first queue.
2. The first filter takes it, does its step and posts the result to the next queue.
3. Each later filter does the same, until the last one stores the final result.
4. A slow filter can run several instances that read from the same queue, which is [Competing Consumers](/sd/docs/cloud-messaging/competing-consumers) at one stage.

```mermaid Pipes and Filters: each filter reads from one queue and writes to the next
flowchart TD
  In[(Upload queue)] --> F1[Decode]
  F1 --> Q1[(Queue)]
  Q1 --> F2[Virus scan]
  F2 --> Q2[(Queue)]
  Q2 --> F3[Resize]
  F3 --> Out[(Image store)]
  class F2 warn
```

Throughput is set by the stage with the least total capacity, which is its instances times its per-instance rate. An unscaled slow filter is the usual bottleneck, which is why you run more instances of it. One image's total time is the sum of all stages, so a slow filter also adds to latency. Filters can run on different hardware. A heavy one can use powerful machines while a light one uses cheap machines.

Filters should ignore fields they do not understand and pass them along unchanged. That tolerance lets you add a field for a later stage without touching the earlier ones.

## A worked example: an image pipeline (invented numbers)
Target: 40 images per second. One instance of each filter handles this many per second.

| Filter | Time per image | One instance handles | Instances for 40 per second |
| --- | --- | --- | --- |
| Decode | 20 ms | 50 per second | 1 |
| Virus scan | 200 ms | 5 per second | 8 |
| Resize | 100 ms | 10 per second | 4 |
| Store | 10 ms | 100 per second | 1 |

The slowest stage is the scan, at 5 per second per instance, so it needs 40 / 5 = 8 instances. Resize needs 40 / 10 = 4. Total instances: 1 + 8 + 4 + 1 = 14.

Suppose resize needs a large machine at $0.40 per hour, and the others run on small ones at $0.05 per hour. As a pipeline: 10 small instances x $0.05 + 4 large x $0.40 = $0.50 + $1.60 = $2.10 per hour. As a monolith, each instance does all four steps, so every instance must be large. One instance takes 330 ms per image, about 3 per second, so 40 / 3.03 is about 14 instances at $0.40, which is $5.60 per hour. The pipeline costs 62.5 percent less, because only the stage that needs big machines gets them. The monolith needs the same instance count here, so the saving is in cost and flexibility, not in raw speed. The $2.10 leaves out the three queues and the extra time each hop adds to every image, so the real saving is smaller. It stays large only because one stage needs a much bigger machine than the rest.

```mermaid Hourly cost for 40 images per second in invented prices, pipeline against monolith
xychart-beta
  x-axis [Pipeline, Monolith]
  y-axis "dollars per hour" 0 --> 6
  bar [2.1, 5.6]
```

## What goes wrong: repeated messages
The resize filter posts its result to the next queue, then crashes before acknowledging its input. The queue redelivers the input to another instance, which processes it and posts a second result. The store filter now gets the same image twice. The symptom is duplicate rows or double charges downstream. Confirm it by finding the same message id arriving at a stage more than once. Fixes: make each filter [idempotent](/sd/docs/async/delivery-guarantees), carry a stable id so a stage can drop duplicates, and use the outbox pattern from that lesson when a filter updates a database and publishes a message.

```mermaid A crash before the ack makes the queue redeliver, so the store filter gets the image twice
sequenceDiagram
  participant Q as Resize queue
  participant R1 as Resize instance 1
  participant N as Store queue
  participant R2 as Resize instance 2
  Q->>R1: image 7
  R1->>N: resized image 7
  Note over R1: crashes before the ack
  Q->>R2: image 7 again
  R2->>N: resized image 7 again
```

## When pipes and filters is the wrong tool
If the steps share a lot of in-memory state, or each takes microseconds, the queue hops cost more than the work. Use a plain chain of function calls. If the steps must succeed or fail together, a pipeline of independent services does not give you that. The Microsoft page notes that a pipeline is often still one unit: a failure in any filter can fail the whole run, and a change needs an end to end test. For multi-step work that needs recovery logic, look at the [Scheduler Agent Supervisor](/sd/docs/cloud-messaging/choreography-and-supervision).

## Common mistake
Splitting into too many tiny filters. Every extra pipe adds a hop, a queue to monitor and another place to lose a message. Split where steps differ in scaling needs or are worth reusing.

```resources
docs | Pipes and Filters pattern | https://learn.microsoft.com/en-us/azure/architecture/patterns/pipes-and-filters | Azure Architecture Center | Explains filters, pipes and the idempotency and repeated message issues when filters fail.
article | Pipes and Filters | https://www.enterpriseintegrationpatterns.com/patterns/messaging/PipesAndFilters.html | Hohpe and Woolf | The original pattern write-up from Enterprise Integration Patterns.
article | Top 6 Cloud Messaging Patterns | https://bytebytego.com/guides/top-6-cloud-messaging-patterns | ByteByteGo | A short overview of six neighbouring messaging patterns (Competing Consumers, Claim Check, Priority Queue and others). It does not cover Pipes and Filters itself.
```

```quiz
In the image pipeline, the scan takes 200 ms. How many scan instances serve 40 images per second? | 4 ; 40 ; 8 | 2 | One instance does 5 per second, and 40 divided by 5 is 8.
Every filter has one instance and the pipeline is too slow. Where do you add instances first? | The last filter in line ; The filter with the lowest rate ; The filter with the fastest rate | 1 | Throughput is capped by the stage with the least capacity, so adding capacity anywhere else changes nothing.
A filter crashes after posting its result but before acknowledging its input. What is the risk? | The next stage gets a copy ; The pipe is deleted by the broker ; Later filters will never start again | 0 | The input is redelivered, so the work and its output can repeat.
```

```story
A news site resizes photos, strips location data and adds a watermark in one big job. When the watermark rules change, the whole job is retested and redeployed, and the heavy resize step needs expensive machines for everything. Splitting the steps lets the team change the watermark alone and scale only resizing.
```

```adapted
Azure Architecture Center (Microsoft) | https://learn.microsoft.com/en-us/azure/architecture/patterns/ | CC BY 4.0
```

# choreography-and-supervision | Choreography and Scheduler Agent Supervisor | 3 | 12
A multi-step business process needs someone in charge of order and recovery. Choreography spreads that job across the services using events. Scheduler Agent Supervisor keeps it in one place and adds a watchdog that repairs steps that stall.

## Orchestration and Choreography

```card Choreography
Problem | A central orchestrator must know every service, so adding a service means changing it, and it can become a bottleneck or single point of failure.
Solution | Remove the central caller. Each service reacts to events on a message broker, does its job and publishes a success or failure event for the next service.
Use when | Steps are independent and teams change their services often.
Avoid when | The workflow is long or branching, or you must report one clear status.
```

An order needs payment, stock reservation and shipping, each in a different service. The usual approach is orchestration: a central service calls each one in turn and tracks the overall state. It is easy to follow. It also knows every service, so adding one means changing it, and it can become a bottleneck or a single point of failure.

The Choreography pattern removes the central caller. Each service decides when and how to act, usually by reacting to events on a message broker.
1. A client request becomes a message on the broker.
2. Services that care about that message pick it up.
3. Each does its job and publishes a success or failure event.
4. On success, the next service reacts to that event. On failure, services that subscribed to the failure event run compensating actions, which undo earlier work. Those are covered in [compensating transactions](/sd/docs/cloud-messaging/compensating-transactions).

```mermaid Choreography: each service reacts to an event and publishes the next one
sequenceDiagram
  participant O as Order
  participant B as Broker
  participant P as Payment
  participant S as Stock
  O->>B: OrderPlaced
  B->>P: OrderPlaced
  P->>B: PaymentTaken
  B->>S: PaymentTaken
  S->>B: StockReserved
  B->>O: StockReserved
```

No service holds the whole picture. That is the strength and the weakness. It suits independent steps and teams that change their services often. It struggles with sequences like "D starts only after B and C both succeed". It needs idempotent consumers, because delivery is at least once, and an [outbox](/sd/docs/async/delivery-guarantees) so a state change and its event are saved together. It also needs correlation ids and [tracing](/sd/docs/reliability/observability), because no single place shows an order's progress. Many services read the same events, so changing an event's shape can break consumers you do not own.

## Scheduler Agent Supervisor

```card Scheduler Agent Supervisor
Problem | A multi-step task calls remote services that can fail, and the process running it can crash, leaving steps half done.
Solution | A Scheduler runs the steps and records their state, Agents wrap each remote call, and a Supervisor scans for steps past their deadline and asks for a retry or an undo.
Use when | A task spans several remote services and needs automatic recovery from stalled or failed steps.
Avoid when | There is one remote call, where retry with a circuit breaker is enough.
```

This pattern covers a different problem: a multi-step task calls remote services that can fail, and the process itself can crash. It uses three roles.
1. The Scheduler runs the steps in order. It records each step's state in a durable state store, such as not started, running or completed, plus a complete-by time.
2. An Agent wraps the call to one remote service. It does the call and its own retries, within the Scheduler's deadline, and passes a stable id so the other side can drop duplicates.
3. The Supervisor wakes up periodically and scans the state store. It looks for steps still marked running whose complete-by time has passed. It cannot tell a slow step from a failed one, and does not need to.
4. For such a step it asks the Scheduler to retry it or, after too many tries, to undo the whole task with compensating actions.

```mermaid Scheduler Agent Supervisor: the Supervisor reads the state store and asks the Scheduler to recover
flowchart TD
  Sch[Scheduler] -->|run step| Ag[Agent]
  Ag -->|call with stable id| Rem[Remote service]
  Sch -->|record state and deadline| St[(State store)]
  Sup[Supervisor] -->|scan for late steps| St
  Sup -.->|request retry or undo| Sch
```

The Supervisor only requests recovery. The Scheduler and Agents carry it out. Retries at several layers multiply calls to a failing service. Say each of 3 layers retries 3 times: one step can then make 4 x 4 x 4 = 64 calls. So let the Scheduler hold the one total retry budget, and give the Agent only a small retry allowance (or none) inside it. Retrying means each step must be [idempotent](/sd/docs/async/delivery-guarantees).

| | Orchestration | Choreography | Scheduler Agent Supervisor |
| --- | --- | --- | --- |
| Who knows the whole flow | One central service | Nobody, it emerges | Scheduler, with a watchdog |
| Adding a step | Change the orchestrator | Subscribe a new service | Change the workflow |
| Failure handling | Central logic | Failure events, compensation | Timeouts, retry, undo |
| Seeing progress | Ask the orchestrator | Needs tracing | Read the state store |
| Main risk | Bottleneck, single point of failure | Event loops, hidden flow | Supervisor tuning |

## A worked example: how long until a stuck step is noticed (invented numbers)
A step has a complete-by time of 30 seconds. The Supervisor runs every 60 seconds. The maximum retries are 3, so there are 4 attempts in all.

A step that hangs right after starting reaches its deadline at second 30. The Supervisor may scan just before that and miss it, and the next scan comes up to 60 seconds later. So one failed attempt can go unnoticed for up to 30 + 60 = 90 seconds.

Trace of one hung step with a 30 second deadline and a Supervisor scan every 60 seconds, in the worst case where a scan lands just before the deadline:

| Second | Event |
| --- | --- |
| 0 | Step starts and is marked running with a complete-by time of 30 |
| 29 | Supervisor scans, the deadline has not passed, nothing is flagged |
| 30 | Deadline passes, the step is still running |
| 89 | Next scan finds the late step and asks the Scheduler to retry it |

The step was late for 59 seconds before anyone noticed, and about 89 seconds passed since it started.

With 4 attempts, the worst case before giving up and compensating is 90 + 3 x 60 = 270 seconds, about 4.5 minutes. Only the first attempt can wait the full 30 + 60 = 90 seconds. A retry starts at a scan, so the next scan comes 60 seconds later. A simple safe bound is attempts x (deadline + scan interval), here 4 x 90 = 360 seconds. If the business needs a decision within 2 minutes, tighten the numbers: a 15 second deadline and a 15 second scan give at most 4 x 30 = 120 seconds. Shorter intervals find faults sooner but cost more scans and risk retrying slow steps that were about to finish.

## What goes wrong: an order nobody can find
In a choreographed system, the payment service emits PaymentTaken but the stock service is down and its queue is full. Support asks where order 5521 is. No service owns the order, and logs are in four places. Symptom: orders that stay "processing" for hours. Confirm by searching for the order's correlation id across services and checking each queue. Mitigations are a correlation id on every message, a status table, built by listening to every event, that shows each order's last event, an alarm on orders older than their expected time, and dead-letter queues. Also guard against event loops, where two services keep reacting to each other's events. Consumer concurrency limits and filters help.

## When these patterns are the wrong tool
Choreography is the wrong tool for a long, branching workflow with many conditions, or when you must report one clear status. A central orchestrator is easier there. Scheduler Agent Supervisor is hard to build and needs fault-injection testing, and it is too heavy for one remote call, where [retry with a circuit breaker](/sd/docs/reliability/timeouts-and-retries) is enough. Both patterns assume steps can be retried or undone. If a step cannot be undone, such as sending a letter, put it last.

## Common mistake
Picking choreography to dodge one coordinator, then letting a dozen services each react to the others until a stuck order takes a day of log reading to explain. If the flow has more than a few steps or must be debugged often, an explicit orchestrator is usually cheaper.

```resources
docs | Choreography pattern | https://learn.microsoft.com/en-us/azure/architecture/patterns/choreography | Azure Architecture Center | Contrasts choreography with an orchestrator and lists issues such as tracing, ordering and event storms.
docs | Scheduler Agent Supervisor pattern | https://learn.microsoft.com/en-us/azure/architecture/patterns/scheduler-agent-supervisor | Azure Architecture Center | Defines the Scheduler, Agent and Supervisor roles, the state store and complete-by times.
article | Orchestration vs. Choreography in Microservices | https://bytebytego.com/guides/orchestration-vs-choreography-microservices | ByteByteGo | A short side by side comparison of the two styles with a diagram.
article | Process Manager | https://www.enterpriseintegrationpatterns.com/patterns/messaging/ProcessManager.html | Hohpe and Woolf | A central unit that keeps the state of a multi-step flow, which the Microsoft page compares to the Scheduler role.
```

```quiz
A step has a 30 second deadline, scans run every 60 seconds, and there are 4 attempts. What is the worst case before compensation, counting that a retry starts at a scan? | 90 seconds ; 270 seconds ; 360 seconds | 1 | Only the first attempt can wait 30 plus 60 which is 90 seconds. Each of the 3 retries starts at a scan and is noticed within 60 more, so 90 plus 3 times 60 is 270.
What is the Supervisor's job? | Detect stalled steps, request recovery ; Run each step of the workflow in order ; Call the remote service itself directly | 0 | It detects steps past their deadline and requests recovery, while the Scheduler and Agents act.
Support asks where order 5521 is. Payment logged PaymentTaken, but nobody knows what happened next. What lets you find out? | Ask the Payment service to replay the event ; Restart the broker and wait for redelivery ; Search every service's logs for the order's correlation id | 2 | No service owns the whole flow, so the id on every message is how you find where an order stopped.
```

```story
An online store lets each team add a reaction to the OrderPlaced event: loyalty points, fraud checks, warehouse picks. It is easy to extend. Then a customer asks where her order is, and four teams each check their own logs. A shared order id on every event turns an hour of searching into one query.
```

```adapted
Azure Architecture Center (Microsoft) | https://learn.microsoft.com/en-us/azure/architecture/patterns/ | CC BY 4.0
```

# compensating-transactions | Sagas and Compensating Transaction | 3 | 12
A saga is a business operation that spans several services as a chain of local transactions. When a step fails, the saga runs compensating transactions, which are new actions that undo the business effect of earlier steps.

## Why a single transaction is not available
Inside one database, a transaction is all or nothing (see [transactions and isolation](/sd/docs/data/transactions-and-isolation)). If a service owns its own data, as in [microservices](/sd/docs/scaling/microservices), one business action such as "place an order" touches several databases. Chris Richardson's example is an order that must not exceed a customer's credit limit. Orders and customers live in different services, so one local ACID transaction cannot cover both. His page lists a two-phase commit (2PC) across services as not an option, without giving the reason. The usual reason is that 2PC makes every participant hold its locks until a coordinator decides. PostgreSQL's documentation, for example, says a prepared transaction continues to hold its locks, that leaving one prepared for long is unwise, and that the feature is meant for an external transaction manager.

## Saga

```card Saga
Problem | One business action touches several services that each own their data, so no single transaction can cover it.
Solution | Run a chain of local transactions, each committed in its own service. If a step fails, run compensating transactions for the steps already done, usually in reverse order.
Use when | Data is split across services and the business can tolerate brief visible intermediate states.
Avoid when | Both pieces of data can live in one database, or no intermediate state may ever be seen.
```

Each service commits its own change, then triggers the next step by an event or command. If a step fails for a business reason, the saga compensates for the steps already done.

For an order in a shop:

1. Order service creates the order in state PENDING.
2. Payment service charges the card.
3. Stock service reserves the items. It finds none left, so this step fails.
4. The saga runs compensation for step 2: the payment service refunds the card.
5. The saga runs compensation for step 1: the order service marks the order REJECTED.

```mermaid Saga: the stock step fails, so the earlier steps are compensated in reverse order
sequenceDiagram
  participant O as Order
  participant P as Payment
  participant S as Stock
  O->>O: create order PENDING
  O->>P: charge card
  P-->>O: charged
  O->>S: reserve items
  S-->>O: none left, failed
  O->>P: refund card
  O->>O: mark order REJECTED
```

Richardson names two ways to coordinate a saga, choreography and orchestration. [Choreography and Scheduler Agent Supervisor](/sd/docs/cloud-messaging/choreography-and-supervision) compares them, so here the point is only that the compensation rules below apply to both.

## Compensating Transaction: not a rollback

```card Compensating Transaction
Problem | A multi-step operation fails after some steps committed, and a database rollback is no longer possible.
Solution | For each step, design a new forward action that undoes its business effect, such as a refund for a charge. Usually run these in reverse order, retry them until they succeed, and make them idempotent.
Use when | Work spans systems that are only eventually consistent, so earlier steps cannot simply be reversed.
Avoid when | A normal transaction can cover the work, or the step cannot be undone, such as a sent email.
```

```mermaid Compensation: each forward step has a new action that undoes its effect
flowchart TD
  A[Create order] --> B[Charge card]
  B --> C[Reserve stock]
  class C bad
  C -.->|fails, so run| D[Refund card]
  D -.-> E[Reject order]
  class D good
```

A rollback makes the database discard the change, and with normal isolation nobody else ever saw it. A compensation is a new, forward action, and the world already saw the first one. Say the payment service also emails a receipt. The customer got a "payment received" email. You cannot unsend it, so you send a refund and an apology. Compensations must be designed per step, and some steps cannot be undone at all, such as a sent email or a shipped parcel. Put steps that cannot be undone last, after every check that could reject the order. Steps after that point can no longer be compensated, so they must be safe to retry until they succeed. A saga also does not have to compensate on every failure. Offering the customer a different hotel may be better than cancelling, and for a decision like that a person should choose. Undoing usually runs in reverse order, but not always: if one data store is more sensitive to inconsistency than another, undo that one first.

Compensations must also be idempotent (safe to run twice) and retried, because a saga that stops halfway leaves money or stock locked. Retries can run out, though. Record how far the compensation got so it can resume, and alert a person when a step keeps failing. A saga step and its message must also be recorded together, usually with an outbox table, otherwise a crash can lose the event that starts the next step.

## Isolation: the missing letter in ACID
Sagas give up isolation. Between steps 2 and 5 above, other requests can see the card charged and the order pending. Richardson's page warns that concurrent sagas can cause data anomalies, so sagas need countermeasures (design techniques that restore some isolation), which his book describes. One is a semantic lock: set a flag such as `PENDING` on the order so other operations know it is mid-saga and wait or refuse. Others include commutative updates (order does not matter) and re-reading a value before you act on it. Choose the lightest one that makes your anomaly impossible.

```mermaid The PENDING flag is a semantic lock that tells other requests the order is mid-saga
stateDiagram-v2
  [*] --> PENDING: order created
  PENDING --> APPROVED: every step succeeded
  PENDING --> REJECTED: a step failed and was compensated
```

## A worked example: counting the damage
Invented numbers. A saga has 4 steps, and each can fail with chance 2 percent for business reasons. The chance that all four succeed is $0.98^4 = 0.922$, so about 7.8 percent of orders enter compensation. At 10,000 orders a day, that is 780 compensations, so compensation code is a main path, not an edge case.

```mermaid Share of sagas that need compensation as steps are added, when each step fails 2 percent of the time (invented rate)
xychart-beta
  x-axis "steps in the saga" [1, 2, 3, 4, 5, 6, 7, 8]
  y-axis "percent needing compensation" 0 --> 16
  line [2.0, 4.0, 5.9, 7.8, 9.6, 11.4, 13.2, 14.9]
```

Say every compensation includes one refund call that fails 1 percent of the time and is retried every minute. Each day about 780 x 0.01 = 8 refunds need at least one retry (invented, and it assumes the steps fail independently). Without idempotency keys, a retry after a timeout could refund twice. With an idempotency key such as the order id, the second call is a no-op.

## What goes wrong: the stuck saga
A saga stops between steps: the payment is taken, the stock service is down, and the saga waits. Customers see a pending order for hours, and their money is held. The symptom is a growing count of orders older than a few minutes in PENDING. Confirm it by querying saga state by age. Give every saga a timeout and a state record, alert on sagas that exceed it, and make the timeout path trigger compensation. A dashboard of saga state is also the first thing you need when debugging choreography.

## When a saga is the wrong tool
If both pieces of data can live in one database, use a normal transaction. A saga is a cost you pay for splitting data across services. If the business cannot tolerate even brief visible intermediate states, such as a bank transfer that must never show a missing balance, consider keeping the data together, or using a system that offers distributed transactions inside one product.

## Common mistake
Calling compensation "rollback" and forgetting that other users could already act on the first step's result.

```resources
article | Pattern: Saga | https://microservices.io/patterns/data/saga.html | Chris Richardson | Defines sagas, the choreography and orchestration styles, and lists the lack of automatic rollback and isolation as drawbacks.
docs | Saga design pattern | https://learn.microsoft.com/en-us/azure/architecture/patterns/saga | Azure Architecture Center | Explains coordinating local transactions with events and undoing completed steps with compensating transactions.
docs | Compensating Transaction pattern | https://learn.microsoft.com/en-us/azure/architecture/patterns/compensating-transaction | Azure Architecture Center | Covers undoing the work of a step in an eventually consistent operation.
repo | Sagas | https://github.com/karanpratapsingh/system-design#sagas | Karan Pratap Singh | Short summary of the pattern and the debugging difficulty it brings.
```

```quiz
A payment succeeded and a later step failed. Which fits a compensation, not a rollback? | Hold the payment until the saga ends ; Erase the payment row as if it never happened ; Issue a refund as a new payment | 2 | A compensation is a new forward action, since the earlier step was already committed and visible.
A saga has 20 steps, each failing 2 percent of the time. About what share need compensation? | About 40 percent ; About 33 percent ; About 2 percent | 1 | 1 minus 0.98 to the 20th power is about 0.33. Adding the rates would wrongly give 40.
What does a semantic lock do? | Flags a record as mid-saga ; Encrypts every saga message sent ; Blocks all other reads of the data | 0 | A flag like PENDING tells other operations the data is not final.
```

```story
A travel site books a flight, a hotel and a car in three services. The hotel fails after the flight is paid. The saga refunds the flight and marks the trip cancelled, and the customer gets an email explaining it. Nothing was rolled back. Each step was undone by a new action, and the customer saw both.
```

```adapted
Azure Architecture Center (Microsoft) | https://learn.microsoft.com/en-us/azure/architecture/patterns/ | CC BY 4.0
```

# event-sourcing-and-cqrs | Event Sourcing and CQRS | 3 | 13
Event Sourcing stores every change as an event instead of only the latest state. CQRS uses separate models for writing and reading. They often work together, and each has a real cost.

## Event Sourcing

```card Event Sourcing
Problem | Storing only the current state loses history, and many writers fighting over one row cause lock contention.
Solution | Append every change as an immutable event to a per-entity stream and rebuild the current state by replaying the events, with snapshots to keep replay short.
Use when | You need the full history, an audit trail, or the ability to rebuild state at any past point.
Avoid when | Plain CRUD is enough, or the data must be edited or deleted freely.
```

In an ordinary CRUD design you store the current state. An update overwrites the old value. History is lost unless you build an audit log, and many writers fighting over one row cause lock contention.

Event Sourcing stores the facts. Each change is an immutable event, appended to an event store in order. Every entity, such as one bank account, has its own event stream. The current state is not stored as the truth. You get it by replaying the events from the start, called rehydration.
1. A command arrives, such as "withdraw 20".
2. A command handler loads the account's events and replays them to get the current state.
3. Business rules run against that state. If the withdrawal is allowed, a new event is raised.
4. The event is appended to the stream. Other handlers hear about it, often through a queue.

```mermaid Event Sourcing: replay the stream to get the state, then append a new event
sequenceDiagram
  participant C as Command handler
  participant E as Event store
  C->>E: load events for account A-3
  E-->>C: Opened, Deposited 100, Withdrew 30
  Note over C: replay gives balance 70, rules allow withdraw 20
  C->>E: append Withdrew 20
```

Events should record intent: "two seats reserved" says more than "seats left changed to 42". You do not edit an event. To fix a mistake you append a compensating event, such as ReservationCanceled. If the format of old events changes, the usual answer is an upcaster, a small function that converts old events to the new shape as they are read, so the stored events stay untouched. Rewriting stored events is a last resort because it destroys the audit trail. Streams can grow long, so a snapshot saves the state at some point, and replay starts from the latest snapshot. Keep a version number in each event, because the format will change. Two commands can arrive at once. Both load account A-7 with a balance of 100, and both try to withdraw 80. The store prevents this with a concurrency check: each append says which event number it expects to be next, and the store rejects the second one because the stream has grown. That handler reloads the events, sees a balance of 20 and refuses the withdrawal.

The store itself is a database with per-stream reads and concurrency checks. A message broker like Kafka distributes events well, but the Microsoft page says brokers typically lack per-stream reads and concurrency checks, so they are not a substitute for the store.

## CQRS

```card CQRS
Problem | One model for both reading and writing forces compromises, and reads and writes cannot scale or evolve separately.
Solution | Split the model in two: a write model that holds the business rules and a read model shaped for queries. With separate stores, the read side updates itself from events.
Use when | Read and write workloads differ a lot in shape or scale, and a short delay on reads is acceptable.
Avoid when | The domain is simple and one model works well, which is true for most systems.
```

CQRS stands for Command Query Responsibility Segregation. A command changes data. A query only reads it. CQRS splits the model into two: a write model with the business rules and a read model shaped for screens, with no business logic.

The two models can share one database, or use separate stores. With separate stores, the write side publishes events and the read side updates itself from them. Then reads and writes scale independently, and each store can use the technology that suits it. The price is that the read model is eventually consistent: for a short time after a write, a query may return old data. Fowler says he first heard it described by Greg Young, and his page is blunt that for most systems CQRS adds risky complexity.

```mermaid CQRS: commands change the write store, events feed a read store that queries use
flowchart TD
  Cmd[Command] --> WM[Write model]
  WM --> WS[(Write store)]
  WS -->|events| RM[Projection]
  RM --> RS[(Read store)]
  Q[Query] --> RS
```

The read store is usually a precomputed view. [Index Table and Materialized View](/sd/docs/cloud-messaging/index-table-and-materialized-view) covers how such views are built and kept fresh.

## A worked example: an account (invented numbers)
Events for account A-7: Opened, Deposited 100, Withdrew 30, Deposited 50, Withdrew 20. Replay: 0 + 100 - 30 + 50 - 20 = 100. A new "withdraw 150" is refused, since 150 is more than 100.

Replay of the stream, one event at a time:

| Event | Effect | Balance after |
| --- | --- | --- |
| Opened | start at 0 | 0 |
| Deposited 100 | add 100 | 100 |
| Withdrew 30 | subtract 30 | 70 |
| Deposited 50 | add 50 | 120 |
| Withdrew 20 | subtract 20 | 100 |
| Withdraw 150 (command) | refused, 150 is more than 100 | 100, no event appended |

Replay cost: a busy account has 10,000 events and each takes 0.05 ms to apply. A full replay takes 10,000 x 0.05 = 500 ms. With a snapshot every 1,000 events, at most 999 events are replayed, about 50 ms plus the snapshot load.

```mermaid Worst-case replay time for a stream of 10,000 events at 0.05 ms each, by how often snapshots are taken
xychart-beta
  x-axis [No snapshot, Every 5000, Every 1000, Every 100]
  y-axis "milliseconds" 0 --> 500
  bar [500, 250, 50, 5]
```

Read side: if the read model updates 200 ms after a write, a user who saves and instantly reloads may not see the change. A fix is to return the new state in the command's response.

## What goes wrong: a wrong event you cannot delete
A bug records deposits twice for 3 hours. You should not edit the store, because it is the source of truth and the audit trail. Balances look wrong and every view built from those events is wrong too. Confirm by finding pairs of events with the same account, amount and command id but different event ids, or a jump in event volume that starts at the deploy time. The repair is to append compensating events, fix the code, and rebuild the views by replay. Also plan for privacy law. If a user asks you to delete their data, immutable events are a problem. Keep personal data outside the events and reference it by id, or encrypt it with a per-person key and delete the key.

## When these patterns are the wrong tool
Most systems should stay with CRUD. Event Sourcing is hard to move to or away from and affects every part that uses it. Skip CQRS when the domain is simple and one model reads and writes well. If you only need fast reads of aggregated data, a [materialized view](/sd/docs/cloud-messaging/index-table-and-materialized-view) or a [read replica](/sd/docs/data/replication) is much less work. Consider [caching](/sd/docs/caching/cache-patterns) first. Use Event Sourcing when you truly need the full history, audit trail or the ability to rebuild state.

## Common mistake
Adopting Event Sourcing for the whole system because one part needs an audit trail. Apply it only where the history is the point.

```resources
docs | Event Sourcing pattern | https://learn.microsoft.com/en-us/azure/architecture/patterns/event-sourcing | Azure Architecture Center | Covers streams, snapshots, event versioning, ordering and the privacy tension, with a warning about complexity.
docs | CQRS pattern | https://learn.microsoft.com/en-us/azure/architecture/patterns/cqrs | Azure Architecture Center | Explains commands, queries, separate read and write models and the eventual consistency cost.
article | Event Sourcing | https://martinfowler.com/eaaDev/EventSourcing.html | Martin Fowler | Introduces storing all state changes as a sequence of events using a ship tracking example.
article | CQRS | https://martinfowler.com/bliki/CQRS.html | Martin Fowler | Explains the split and cautions that for most systems it adds risky complexity.
```

```quiz
Events: Opened, Deposited 40, Deposited 60, Withdrew 25. A command asks to withdraw 90. What happens? | Refused, the balance is 75 and no event is appended ; Appended, balance becomes -15 ; Appended as an overdraft event, balance 75 | 0 | Replay gives 40 + 60 - 25 = 75, and 90 is more than 75, so the command is refused and nothing is appended.
A stream has 5,000 events at 0.02 ms each and snapshots every 500. About how long is the worst replay? | About 100 ms ; About 10 ms ; About 1 ms | 1 | At most 499 events replay after the latest snapshot, and 499 x 0.02 is about 10 ms.
A bug wrote bad events to an event store. How do you fix it? | Edit the bad events in place in the store ; Delete the whole stream and start over again ; Append compensating events, then rebuild the views | 2 | Events are meant to stay as written, so corrections are new events and views are rebuilt by replay.
```

```story
A trading firm must show a regulator exactly how an account reached its balance on a past date. Its old table only held the latest number. After moving the ledger to events, the team replays the stream up to that date and gets the answer, with every step listed.
```

```adapted
Azure Architecture Center (Microsoft) | https://learn.microsoft.com/en-us/azure/architecture/patterns/ | CC BY 4.0
```

# index-table-and-materialized-view | Index Table and Materialized View | 2 | 11
An Index Table and a Materialized View are both read structures built from a main store and kept in step with it. Each makes one kind of query fast, and both can drift out of date.

## The shared idea
A main store is shaped for writes and for lookups by its key. Readers often want something else: records by another field, or a summary that needs a heavy join. Rather than bend the main store, you build a second structure just for reading.

Both patterns are derived data. You can throw either away and rebuild it from the main store. Both must be updated when the main data changes. Unless the update happens in the same transaction as the change, they are wrong for a short time between the change and the update. That gap is the central cost of this lesson.

| | Index Table | Materialized View |
| --- | --- | --- |
| Answers | Which records match this field? | What is the finished answer for this query? |
| Holds | Keys, or copies of records, ordered by another field | Precomputed rows, joins or totals |
| Kept in step by | Writing to both tables | A refresh job, or an event-driven update |
| Typical staleness | Seconds, if updates are queued | The refresh interval |

## Index Table

```card Index Table
Problem | Many data stores find records fast only by primary key, so a query on another field means scanning everything.
Solution | Build a second table keyed by the field you search, holding either full copies, only the primary keys, or a few popular fields. Update it whenever the main table changes.
Use when | Queries on a non-key field are frequent and the store has no secondary index that fits.
Avoid when | The data changes faster than the index can follow, or the field has few distinct values.
```

A customer table keyed by customer id is quick for "get customer 42". "Find customers in Redmond" means scanning every row. Relational databases solve this with an [index](/sd/docs/data/indexes), but not every store offers one that fits.

There are three shapes.
1. Complete denormalization: each index table holds full copies of the records, organized by another key. One read gets everything. It costs the most space and write effort.
2. Normalized index: the index table holds only the field and the primary key. Lookups take two steps: find the ids, then fetch each record. It is the cheapest to store.
3. Partial denormalization: the index copies the few fields most queries need, and refers to the main table for the rest.

```mermaid Index Table: look up the town in the index, then fetch the matching customers by key
flowchart TD
  Q[Query town Redmond] --> IX[(Town index)]
  IX -->|customer ids| Main[(Customer table)]
  Main --> R[Matching customers]
  W[Write] --> Main
  W -.->|second write| IX
```

For queries on two fields, build a composite key, such as town plus last name, with a separator between the parts or a fixed length for each part. Without one, town "Red" with surname "mondSmith" and town "Redmond" with surname "Smith" both become "RedmondSmith" and collide. Index tables also help with [sharded](/sd/docs/data/sharding) data. If the shard key is a hash, a range query by town cannot find its shards, but an index sorted by town and storing the shard key can.

Writes now go to two places. Unless one transaction can cover both, the index is eventually consistent. Even native secondary indexes show this lag: DynamoDB's global secondary indexes are updated asynchronously and are eventually consistent. A hand-built index table behaves the same way, and you own the update code. Index updates can arrive twice or out of order, so make the updater idempotent and carry a version number.

## Materialized View

```card Materialized View
Problem | A query needs a join or an aggregate over a lot of data, and the source store is shaped for writes, not for that read.
Solution | Precompute the result into a read-only view, kept up to date by a refresh job or by events. The view can always be rebuilt from the source.
Use when | The same expensive query runs often and a slightly stale answer is acceptable.
Avoid when | Queries are many and varied, or every read must see the latest write.
```

A Materialized View is a precomputed, read-only copy of data shaped for one query. An example is a table of order totals per customer, so the page does not have to scan millions of order lines. Microsoft's page calls it a specialized cache. Consumers never write to it. A job, a data pipeline or the database engine maintains it.

You choose when it refreshes: on every change, on a schedule, or by hand. Refreshing on every change keeps it fresh but costs work when the source changes fast. A schedule is cheap but fixes the worst staleness at the interval. A refresh can rebuild everything or apply only the changes, and it may or may not block readers. PostgreSQL's REFRESH MATERIALIZED VIEW replaces the whole contents, and its CONCURRENTLY option avoids locking out readers.

```mermaid Materialized View: a refresh job reads the source and rewrites the view, queries only touch the view
flowchart LR
  Src[(Orders table)] -->|refresh job| MV[(Totals per customer)]
  Q[Dashboard query] --> MV
  class MV focus
```

If the refresh crashes midway, readers should keep seeing the last complete view. Build the new one aside and swap. In an event sourced system views are close to mandatory, because replaying events for every query is too slow. See [Event Sourcing and CQRS](/sd/docs/cloud-messaging/event-sourcing-and-cqrs).

## A worked example: a support screen (invented numbers)
Customer table: 10 million records of 1 KB, so 10 GB. Order table: 50 million rows. Support wants "customers in Redmond, with their total spend".

Without either structure, finding the town means scanning 10 GB. At 1 million records per second that is 10 seconds. Totals mean aggregating 50 million rows, about 8 seconds.

With an index table on town plus last name, a search matches 12 customers. Normalized, that is 1 index range read plus 12 fetches, 13 reads. Fully denormalized, it is 1 read. Space: a normalized entry of 50 bytes needs 10,000,000 x 50 bytes = 500 MB, about 5 percent of the table. A fully denormalized index duplicates 10 GB for each indexed field.

```mermaid Disk space for the customer table and the two ways to build the town index
xychart-beta
  x-axis [Customer table, Normalized index, Full copy index]
  y-axis "megabytes" 0 --> 10000
  bar [10000, 500, 10000]
```

With a materialized view of totals per customer, one row each, a lookup takes about 2 ms. The 12 customers cost 12 x 2 = 24 ms.

Now freshness. The index is updated from a queue, about 1 second behind. The view refreshes every 5 minutes. A customer who moved to Redmond 10 seconds ago appears in the search. If they also placed an order 10 seconds ago, that order is not in their spend row yet, which can be up to 5 minutes behind. The page is fast, and each half has its own lag. Decide for each field how old is acceptable.

```mermaid A customer moves and places an order: the town index catches up in about a second, the spend view only at its next refresh
sequenceDiagram
  participant C as Customer table
  participant I as Town index
  participant O as Orders table
  participant V as Spend view
  C->>I: move to Redmond, change queued
  Note over I: about 1 second later the customer shows in Redmond searches
  O->>O: new order saved
  Note over V: the order is not in the totals yet
  O->>V: next scheduled refresh, up to 5 minutes later
  Note over V: now the totals include the order
```

## What goes wrong: drift in either structure
A write to the customer table succeeds. The update to the town index fails or is lost. The customer is in the main table but invisible in a search by town. A support agent says "this customer does not exist", while the order system finds them by id. Confirm by counting rows in both tables, or by sampling ids from the main table and looking each up in the index.

A view fails more quietly. Its refresh job dies, and the view keeps serving the last result with no error. Microsoft's page warns that a lost refresh signal means silently stale results, so monitor the view's age and alert past the staleness you promised. For both structures, record each change durably in the same step as the write, for example with a change feed or an outbox table (a table that holds pending updates, saved in the same transaction as the write) that a worker reads, so the update cannot be lost. Then retry from that record, run a periodic repair job that compares the structure with the source, and add a [monitor](/sd/docs/reliability/observability) on lag.

## When these patterns are the wrong tool
An index table is the wrong tool when data changes faster than the index can update, since it stays out of date. Fields with few values, such as an active flag, or very skewed ones, such as 90 percent of rows sharing one value, give little benefit for the cost. If your database has secondary indexes that fit the query, use them.

A materialized view fits a few hot queries. If you have many different queries, you end up with a view for each and a refresh bill to match. If every reader must see the latest write, query the source or use a [cache](/sd/docs/caching/cache-patterns) with careful invalidation. If the problem is read load rather than one slow query, a [read replica](/sd/docs/data/replication) is often less work than a hand-built view. It will not make a heavy join cheaper.

## Common mistake
Building index tables and views for queries that might be needed someday. Each one adds storage, write or refresh cost and a freshness problem, and the unwatched ones go stale unnoticed. Build them for queries you run often, and watch their lag.

```resources
docs | Index Table pattern | https://learn.microsoft.com/en-us/azure/architecture/patterns/index-table | Azure Architecture Center | Describes denormalized, normalized and partial index tables, composite keys and consistency costs.
docs | Materialized View pattern | https://learn.microsoft.com/en-us/azure/architecture/patterns/materialized-view | Azure Architecture Center | Describes disposable precomputed views and the refresh, staleness and rebuild issues.
docs | Using global secondary indexes in DynamoDB | https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GSI.html | AWS | States that secondary indexes are updated asynchronously and are eventually consistent.
docs | REFRESH MATERIALIZED VIEW | https://www.postgresql.org/docs/current/sql-refreshmaterializedview.html | PostgreSQL | States that a refresh completely replaces the contents and that CONCURRENTLY avoids locking out readers.
```

```quiz
A normalized index holds 50 bytes per entry for 10 million customers. About how big is it? | About 5 GB ; About 50 MB ; 500 MB | 2 | 10,000,000 times 50 bytes is 500 million bytes, about 500 MB.
Which field is a poor choice for an index table? | An active flag ; A surname field with many distinct values ; A town name | 0 | An active flag has two values, so a lookup returns about half the table. That is almost as slow as scanning it, and you pay the write cost for nothing.
A materialized view refresh job dies for a day. What do readers see? | A clear error on every single query ; Old results and no warning ; An empty result set every time | 1 | The view keeps serving its last contents, so staleness is silent unless you monitor its age.
```

```story
A warehouse system stores parts by part number. Staff ask to look parts up by supplier, and each search scans two million rows. A small table keyed by supplier makes the search instant, and a nightly summary of stock value per supplier makes the report page quick too. The team must keep both in step with the main table, or the screens quietly show yesterday's truth.
```

```adapted
Azure Architecture Center (Microsoft) | https://learn.microsoft.com/en-us/azure/architecture/patterns/ | CC BY 4.0
```
