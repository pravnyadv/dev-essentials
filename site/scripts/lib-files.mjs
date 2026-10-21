// Writing generated files without touching unchanged ones, so a running dev server only recompiles what changed.
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'

export function writeIfChanged(path, text) {
  if (existsSync(path) && readFileSync(path, 'utf8') === text) return
  mkdirSync(dirname(path), { recursive: true })
  writeFileSync(path, text)
}

// A generated folder: write() each file of this run, then finish() deletes the files a previous run left behind.
export function generatedDir(root) {
  const kept = new Set()
  return {
    write(path, text) { kept.add(path); writeIfChanged(path, text) },
    finish() {
      if (!existsSync(root)) return
      for (const f of readdirSync(root, { recursive: true })) {
        const p = join(root, f)
        if (statSync(p).isFile() && !kept.has(p)) rmSync(p)
      }
    },
  }
}
