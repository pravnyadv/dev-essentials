'use client'
import { demoRegistry } from '../shared/demoRegistry.jsx'
import ClockDemo from './ClockDemo.jsx'
import { FanoutDemo, QuorumDemo } from './DataDemos.jsx'
import { BucketDemo, CacheDemo, PercentilesDemo, RingDemo } from './Demos.jsx'
import { AvailabilityDemo, BacklogDemo, BreakerDemo, RetryDemo } from './FailureDemos.jsx'
import IsolationDemo from './IsolationDemo.jsx'
import ShardKeyDemo from './ShardKeyDemo.jsx'

// Keys match EXPLAINERS in scripts/sd-curation.mjs.
const DEMOS = {
  percentiles: PercentilesDemo, ring: RingDemo, cache: CacheDemo, bucket: BucketDemo,
  availability: AvailabilityDemo, retries: RetryDemo, breaker: BreakerDemo, backlog: BacklogDemo, quorum: QuorumDemo, fanout: FanoutDemo,
  shardkey: ShardKeyDemo, clocks: ClockDemo, isolation: IsolationDemo,
}

export default demoRegistry(DEMOS)
