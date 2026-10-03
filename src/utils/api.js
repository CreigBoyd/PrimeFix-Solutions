import { SITE } from '../config/site'

// Where the PHP endpoints live. Local dev: "/api" (proxied by Vite).
// Production: set VITE_API_BASE at build time (see README).
export const API_BASE = (import.meta.env.VITE_API_BASE || '/api').replace(/\/+$/, '')

const FALLBACK_ERROR = `Sorry, we couldn't send that. Please call or text us at ${SITE.phoneDisplay}.`

/**
 * POST JSON to one of the PHP endpoints (e.g. "send-mail.php").
 * Resolves with the parsed { ok: true } payload, or throws an Error whose
 * message is safe to show to the visitor. Never silently "succeeds".
 */
export async function postJSON(endpoint, payload, { timeoutMs = 15000 } = {}) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)

  let res
  try {
    res = await fetch(`${API_BASE}/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    })
  } catch (err) {
    throw new Error(
      err.name === 'AbortError'
        ? `That took too long. Please try again, or call us at ${SITE.phoneDisplay}.`
        : `We couldn't reach the server. Check your connection, or call us at ${SITE.phoneDisplay}.`
    )
  } finally {
    clearTimeout(timer)
  }

  const isJson = (res.headers.get('content-type') || '').includes('application/json')
  const data = isJson ? await res.json().catch(() => null) : null

  if (!data || !res.ok || !data.ok) {
    throw new Error((data && data.error) || FALLBACK_ERROR)
  }
  return data
}
