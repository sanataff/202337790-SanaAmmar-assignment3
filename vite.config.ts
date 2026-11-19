import { resolve } from 'node:path'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { pathToFileURL } from 'node:url'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { defineConfig, loadEnv, type Plugin } from 'vite'

/**
 * The books endpoint is a Netlify Function in production. Vite does not run
 * Netlify Functions, so this middleware loads the same function module and
 * calls its exported `fetchBooks` helper. It is used by `npm run dev` and
 * `npm run preview` so both work without the Netlify CLI.
 */
function booksMiddleware(mode: string) {
  return (req: IncomingMessage, res: ServerResponse) => {
    if (req.method !== 'GET') {
      res.statusCode = 405
      res.setHeader('Allow', 'GET')
      res.end('Method Not Allowed')
      return
    }

    void (async () => {
      try {
        const env = loadEnv(mode, process.cwd(), '')
        const modulePath = pathToFileURL(
          resolve(process.cwd(), 'netlify/functions/books.mjs'),
        ).href
        const { fetchBooks } = (await import(modulePath)) as {
          fetchBooks: (env: Record<string, string>) => Promise<unknown>
        }

        const payload = await fetchBooks(env)
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json; charset=utf-8')
        res.setHeader('Cache-Control', 'no-store')
        res.end(JSON.stringify(payload))
      } catch (error) {
        console.error('[books dev] Failed to load Notion books:', error)
        res.statusCode = 500
        res.setHeader('Content-Type', 'application/json; charset=utf-8')
        res.end(
          JSON.stringify({
            error: 'Failed to load books from Notion.',
            code: 'notion_error',
          }),
        )
      }
    })()
  }
}

function booksApi(): Plugin {
  return {
    name: 'books-api',
    configureServer(server) {
      server.middlewares.use('/api/books', booksMiddleware(server.config.mode))
    },
    configurePreviewServer(server) {
      server.middlewares.use('/api/books', booksMiddleware(server.config.mode))
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), babel({ presets: [reactCompilerPreset()] }), booksApi()],
})
