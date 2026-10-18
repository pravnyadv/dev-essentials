// Clones the upstream content repo into ../vendor if absent (vendor/ is gitignored).
import { existsSync } from 'node:fs'
import { execFileSync } from 'node:child_process'

const dest = new URL('../../vendor/javascript-algorithms', import.meta.url).pathname
if (!existsSync(dest + '/src')) {
  execFileSync('git', ['clone', '--depth', '1', 'https://github.com/trekhleb/javascript-algorithms.git', dest], { stdio: 'inherit' })
}
