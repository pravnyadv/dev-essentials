'use client'
import { FanoutDemo, QuorumDemo } from './DataDemos.jsx'
import { BucketDemo, CacheDemo, PercentilesDemo, RingDemo } from './Demos.jsx'
import { AvailabilityDemo, BacklogDemo, BreakerDemo, RetryDemo } from './FailureDemos.jsx'

// Keys match EXPLAINERS in scripts/sd-curation.mjs.
const DEMOS = {
  percentiles: PercentilesDemo, ring: RingDemo, cache: CacheDemo, bucket: BucketDemo,
  availability: AvailabilityDemo, retries: RetryDemo, breaker: BreakerDemo, backlog: BacklogDemo, quorum: QuorumDemo, fanout: FanoutDemo,
}

export default function Explainer({ name }) {
  const Demo = DEMOS[name]
  return Demo ? <Demo /> : null
}
