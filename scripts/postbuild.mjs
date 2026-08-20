/**
 * GitHub Pages serves through Jekyll unless told not to, and Jekyll drops
 * directories beginning with an underscore — which is where Next puts every
 * chunk. PRD.md §15: .nojekyll must exist in the output root.
 */
import { writeFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const out = join(process.cwd(), 'out')
if (!existsSync(out)) {
  console.error('postbuild: ./out does not exist — did next build run?')
  process.exit(1)
}
writeFileSync(join(out, '.nojekyll'), '')
console.log('postbuild — .nojekyll written to out/')
