// Network check of every AI resource URL (not part of `verify`, which stays offline). Usage: node scripts/check-links.mjs
// YouTube is checked through oEmbed because watch pages answer 200 for any id. 401/403/429 are reported as "blocked", not broken.
import { readFileSync } from 'node:fs'

const { library } = JSON.parse(readFileSync(new URL('../src/generated/ai.json', import.meta.url), 'utf8'))
const UA = { 'user-agent': 'Mozilla/5.0 (link-check)' }
const check = async ({ url }) => {
  const target = /youtube\.com\/watch/.test(url) ? `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json` : url
  try {
    let r = await fetch(target, { headers: UA, redirect: 'follow', signal: AbortSignal.timeout(20000) })
    if (r.status === 405 || r.status === 400) r = await fetch(target, { headers: UA, redirect: 'follow', method: 'GET', signal: AbortSignal.timeout(20000) })
    return { url, status: r.status }
  } catch (e) { return { url, status: 'error ' + (e.cause?.code ?? e.name) } }
}
const queue = library.filter(r => r.url.startsWith('http')), results = []
await Promise.all(Array.from({ length: 12 }, async () => { while (queue.length) results.push(await check(queue.shift())) }))
// Some sites answer scripts with 404 or 403 while serving browsers; they are reported as unverified, not broken.
const BOT_BLOCKED = ['consumer.ftc.gov', 'academic.oup.com']
const isBlocked = r => [401, 403, 429].includes(r.status) || BOT_BLOCKED.some(h => r.url.includes(h))
const bad = results.filter(r => !(r.status >= 200 && r.status < 400) && !isBlocked(r))
const blocked = results.filter(r => isBlocked(r) && !(r.status >= 200 && r.status < 400))
for (const r of blocked) console.log('blocked', r.status, r.url)
for (const r of bad) console.log('BROKEN', r.status, r.url)
console.log(`${results.length} checked, ${bad.length} broken, ${blocked.length} blocked`)
process.exit(bad.length ? 1 : 0)
