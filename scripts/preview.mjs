/**
 * Serve ./out under the production basePath, so the deployed paths are what
 * gets checked rather than a root-relative approximation. Verify with this
 * before pushing (CLAUDE.md, deployment).
 */
import { createServer } from 'node:http'
import { createReadStream, existsSync, statSync } from 'node:fs'
import { extname, join, normalize } from 'node:path'

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '/periodic-lens'
const root = join(process.cwd(), 'out')
const port = Number(process.env.PORT ?? 4321)

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
}

createServer((request, response) => {
  const url = new URL(request.url ?? '/', `http://localhost:${port}`)
  let path = decodeURIComponent(url.pathname)
  if (path === basePath) path = `${basePath}/`
  if (!path.startsWith(`${basePath}/`)) {
    response.writeHead(302, { location: `${basePath}/` })
    response.end()
    return
  }
  path = path.slice(basePath.length)
  let file = normalize(join(root, path))
  if (!file.startsWith(root)) {
    response.writeHead(403).end('forbidden')
    return
  }
  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html')
  if (!existsSync(file) && existsSync(`${file}.html`)) file = `${file}.html`
  if (!existsSync(file)) {
    response.writeHead(404, { 'content-type': 'text/plain' }).end('404')
    return
  }
  response.writeHead(200, { 'content-type': TYPES[extname(file)] ?? 'application/octet-stream' })
  createReadStream(file).pipe(response)
}).listen(port, () => {
  console.log(`preview — http://localhost:${port}${basePath}/`)
})
