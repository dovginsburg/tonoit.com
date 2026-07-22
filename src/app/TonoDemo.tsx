// TonoDemo — the working paste → rewrite demo on the landing page.
//
// Replaces the static phone-frame screenshot with a real, client-side
// rewrite tool. Hits POST /api/analyze (which proxies through the
// Supabase edge to api.tonoit.com → FastAPI). Anonymous calls are
// permitted; the API returns 4 tones (warmer/clearer/funnier/safer)
// and a risk assessment.
//
// Brand voice (lowercase, dry, no exclamation):
//   - empty:  "paste any text. four rewrites in two seconds."
//   - loading:"thinking…"
//   - error:  "couldn't reach tono. check your connection and try again."
//
// Launch-UX wave (2026-07-22, kanban t_49028efe) — addresses
// launch-audit GAP-23 (offline / network-loss UX) and GAP-24
// (load / skeleton / disabled state) and an explicit rate-limit
// countdown. Adds:
//   • localStorage autosave of the composer draft (key: tono:draft:v1).
//   • online/offline banner mirroring `navigator.onLine` events.
//   • 429-specific countdown parsed from the proxy's Retry-After
//     header, with the button disabled and a visible retry-in-N-seconds
//     affordance.
//   • 5xx-specific message + retry CTA while keeping the draft and
//     the textarea focus intact.
//   • Skeleton tiles + a "thinking…" status that appear within the
//     same animation frame as the click (<100ms perceived feedback).
//
// All colors come through tone-* utility classes from globals.css —
// no hex literals in JSX.

'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

type Axis = 'warmer' | 'clearer' | 'funnier' | 'safer'

type Suggestion = {
  axis: Axis
  text: string
}

type AnalyzeResponse = {
  perception?: string
  suggestions?: Suggestion[]
  message?: string
  used_today?: number
  daily_limit?: number
  error?: string
}

// ──────────────────────────────────────────────────────────────────────
// Draft persistence (GAP-23)
// ──────────────────────────────────────────────────────────────────────
// localStorage key — versioned so we can invalidate a stale payload
// without trampling future, named versions (e.g. tono:draft:v2 once
// we add richer metadata).
const DRAFT_KEY = 'tono:draft:v1'
const DRAFT_SAVE_DEBOUNCE_MS = 250

function loadDraft(): string {
  if (typeof window === 'undefined') return ''
  try {
    return window.localStorage.getItem(DRAFT_KEY) ?? ''
  } catch {
    // Safari private mode / disabled storage — fall back to in-memory only.
    return ''
  }
}

function saveDraft(text: string) {
  if (typeof window === 'undefined') return
  try {
    if (text) {
      window.localStorage.setItem(DRAFT_KEY, text)
    } else {
      window.localStorage.removeItem(DRAFT_KEY)
    }
  } catch {
    // Storage quota or private mode — silent fallback; in-memory state
    // still reflects the draft for the current session.
  }
}

// ──────────────────────────────────────────────────────────────────────
// Rate-limit parsing (429)
// ──────────────────────────────────────────────────────────────────────
// /api/analyze forwards the backend's Retry-After header (seconds);
// we accept either an integer-second form or an HTTP-date form.
function parseRetryAfter(header: string | null): number | null {
  if (!header) return null
  const trimmed = header.trim()
  if (/^\d+$/.test(trimmed)) {
    const seconds = parseInt(trimmed, 10)
    return Number.isFinite(seconds) && seconds >= 0 ? seconds : null
  }
  const dateMs = Date.parse(trimmed)
  if (Number.isFinite(dateMs)) {
    const seconds = Math.max(0, Math.ceil((dateMs - Date.now()) / 1000))
    return seconds
  }
  return null
}

function formatRemaining(seconds: number): string {
  if (seconds <= 0) return 'now'
  if (seconds < 60) return `${seconds}s`
  const minutes = Math.floor(seconds / 60)
  const remainder = seconds % 60
  if (minutes < 60) {
    return remainder === 0 ? `${minutes}m` : `${minutes}m ${remainder}s`
  }
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return mins === 0 ? `${hours}h` : `${hours}h ${mins}m`
}

const EXAMPLE_PLACEHOLDER =
  'paste any text. four rewrites in two seconds.'

const TONE_ORDER: Axis[] = ['warmer', 'clearer', 'funnier', 'safer']

// Network status — `online` | `offline` | null (unknown, SSR/initial).
type NetworkStatus = 'online' | 'offline'

// Demo status drives the inline status chip + skeleton visibility.
//   idle:    nothing loaded, nothing pending
//   pending: a request is in flight; show skeleton
//   rate_limited: a 429 was returned; show countdown + disable button
//   server_error: a 5xx was returned; show retry CTA + preserve draft
//   offline_no_request: offline and the last attempt failed on network
//   result: success — show the 4 result cards
type DemoStatus = 'idle' | 'pending' | 'rate_limited' | 'server_error' | 'result'

export default function TonoDemo() {
  const [draft, setDraft] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<AnalyzeResponse | null>(null)
  const [copied, setCopied] = useState<Axis | null>(null)
  const taRef = useRef<HTMLTextAreaElement | null>(null)
  // Track the latest in-flight request id so stale responses don't
  // overwrite a newer result if a user fires multiple pastes quickly.
  const reqIdRef = useRef(0)

  // Network + rate-limit state for the launch-UX wave.
  const [network, setNetwork] = useState<NetworkStatus>('online')
  const [status, setStatus] = useState<DemoStatus>('idle')
  const [retryInSec, setRetryInSec] = useState<number | null>(null)
  const retryTickRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // ──────────────────────────────────────────────────────────────────
  // Mount: hydrate draft from localStorage, subscribe to online/offline.
  // ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    const restored = loadDraft()
    if (restored) setDraft(restored)

    if (typeof navigator !== 'undefined' && typeof navigator.onLine === 'boolean') {
      setNetwork(navigator.onLine ? 'online' : 'offline')
    }
    const onOnline = () => setNetwork('online')
    const onOffline = () => setNetwork('offline')
    window.addEventListener('online', onOnline)
    window.addEventListener('offline', onOffline)
    return () => {
      window.removeEventListener('online', onOnline)
      window.removeEventListener('offline', onOffline)
    }
  }, [])

  // Debounced localStorage autosave (GAP-23 — drafts stay in your
  // browser). Skips the very first run because `draft` is empty.
  useEffect(() => {
    const handle = setTimeout(() => saveDraft(draft), DRAFT_SAVE_DEBOUNCE_MS)
    return () => clearTimeout(handle)
  }, [draft])

  // Auto-grow textarea up to a sensible max height so the demo
  // doesn't introduce a scroll bar on small screens.
  useEffect(() => {
    const el = taRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 220) + 'px'
  }, [draft])

  // Cleanup the retry countdown timer on unmount.
  useEffect(() => {
    return () => {
      if (retryTickRef.current) clearInterval(retryTickRef.current)
    }
  }, [])

  const startRetryCountdown = useCallback((seconds: number) => {
    setRetryInSec(seconds)
    if (retryTickRef.current) clearInterval(retryTickRef.current)
    retryTickRef.current = setInterval(() => {
      setRetryInSec((curr) => {
        if (curr === null) {
          if (retryTickRef.current) clearInterval(retryTickRef.current)
          return null
        }
        if (curr <= 1) {
          if (retryTickRef.current) clearInterval(retryTickRef.current)
          // When the countdown hits zero we lift the rate-limit
          // status and re-enable the button so the user can retry.
          setStatus((s) => (s === 'rate_limited' ? 'idle' : s))
          return null
        }
        return curr - 1
      })
    }, 1000)
  }, [])

  const submit = useCallback(async () => {
    const text = draft.trim()
    if (!text || loading) return
    if (status === 'rate_limited') return
    setLoading(true)
    setError(null)
    setResult(null)
    setStatus('pending')
    const myId = ++reqIdRef.current

    // Pre-flight offline check — catches the case where fetch() would
    // otherwise throw with a generic "TypeError: Failed to fetch"
    // instead of a useful UI message.
    if (typeof navigator !== 'undefined' && navigator.onLine === false) {
      setLoading(false)
      setStatus('server_error')
      setError(
        "you're offline. your draft is saved locally — rewrite will resume when you're back."
      )
      return
    }

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      })
      if (myId !== reqIdRef.current) return // a newer request superseded this one

      // 429 → count down + disable button. We honor the proxy's
      // Retry-After header (seconds) when present; fall back to the
      // payload's used_today/daily_limit message for context.
      if (res.status === 429) {
        const data = await res.json().catch(() => ({} as AnalyzeResponse))
        const retryAfter = parseRetryAfter(res.headers.get('Retry-After'))
        const fallbackSec = 30
        const seconds = retryAfter ?? fallbackSec
        startRetryCountdown(seconds)
        setLoading(false)
        setStatus('rate_limited')
        const used = typeof data.used_today === 'number' ? data.used_today : null
        const max = typeof data.daily_limit === 'number' ? data.daily_limit : null
        const usage = used !== null && max !== null ? ` (${used} of ${max} today)` : ''
        setError(
          data.message
            ? `daily limit reached${usage}. retry in ${formatRemaining(seconds)}.`
            : `daily limit reached. retry in ${formatRemaining(seconds)}.`
        )
        return
      }

      // 5xx → backend problem. Preserve the draft and offer a retry;
      // we intentionally keep the textarea live (focus + value) so
      // the user can re-fire without re-typing.
      if (res.status >= 500) {
        setLoading(false)
        setStatus('server_error')
        setError(
          "tono's rewrite service is busy. your draft is safe here — retry in a moment."
        )
        return
      }

      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        setLoading(false)
        setStatus('server_error')
        setError(j.error || `request failed (${res.status})`)
        return
      }

      const data = (await res.json()) as AnalyzeResponse
      if (myId !== reqIdRef.current) return
      setResult(data)
      setStatus('result')
    } catch (e) {
      if (myId !== reqIdRef.current) return
      setLoading(false)
      // Network failure (fetch threw) — distinct from a 5xx. Use the
      // navigator.onLine signal to disambiguate the copy.
      const offline = typeof navigator !== 'undefined' && navigator.onLine === false
      setStatus('server_error')
      setError(
        offline
          ? "you're offline. your draft is saved locally — rewrite will resume when you're back."
          : "couldn't reach tono. check your connection and try again."
      )
      setNetwork(offline ? 'offline' : 'online')
    } finally {
      if (myId === reqIdRef.current) setLoading(false)
    }
  }, [draft, loading, status, startRetryCountdown])

  const retry = useCallback(() => {
    // Clear the current error state and re-fire. Safe to call from
    // the rate-limit countdown path (it re-reads the disabled flag).
    setError(null)
    setStatus('idle')
    setRetryInSec(null)
    if (retryTickRef.current) {
      clearInterval(retryTickRef.current)
      retryTickRef.current = null
    }
    submit()
  }, [submit])

  const copy = useCallback(async (axis: Axis, text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(axis)
      setTimeout(() => setCopied((c) => (c === axis ? null : c)), 1600)
    } catch {
      // Clipboard denied — fall back to selecting the text so the
      // user can still manual-copy. Keep UX quiet; no error spam.
      const range = document.createRange()
      const el = document.querySelector<HTMLElement>(
        `[data-tone-result="${axis}"]`
      )
      if (el) {
        range.selectNodeContents(el)
        const sel = window.getSelection()
        sel?.removeAllRanges()
        sel?.addRange(range)
      }
    }
  }, [])

  // Skeleton visibility — show immediately on click so feedback
  // arrives within the same animation frame (sub-100ms even on a
  // saturated main thread). The result cards fade in only after
  // parsing the stream completes.
  const showSkeleton = loading && !result
  const isDisabled =
    !draft.trim() || loading || status === 'rate_limited'
  const buttonLabel = (() => {
    if (status === 'rate_limited' && retryInSec !== null) {
      return `wait ${formatRemaining(retryInSec)}`
    }
    if (loading) return 'rewriting…'
    return 'rewrite'
  })()

  return (
    <aside
      aria-label="try tono — paste a draft and get four rewrites"
      className="relative"
    >
      {/* soft glow behind the demo card */}
      <div
        aria-hidden="true"
        className="absolute -inset-6 rounded-[44px] bg-tono-accent/10 blur-2xl pointer-events-none"
      />
      <div className="relative rounded-[20px] bg-tono-bg-card border border-tono-border overflow-hidden">
        {/* header bar — mirrors the iOS "tono · draft" frame */}
        <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-tono-border">
          <div className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className={`w-1.5 h-1.5 rounded-full shadow-[0_0_8px_var(--accent-glow)] ${
                network === 'offline' ? 'bg-tono-tone-warmer' : 'bg-tono-accent'
              }`}
            />
            <span className="text-[10px] font-semibold tracking-[0.06em] text-tono-text uppercase">
              tono · try it
            </span>
          </div>
          <div className="flex items-center gap-2">
            {network === 'offline' ? (
              <span className="text-[10px] font-mono lowercase text-tono-tone-warmer">
                offline · drafts safe
              </span>
            ) : (
              <span className="text-[10px] font-mono lowercase text-tono-muted">
                free · no signup
              </span>
            )}
          </div>
        </div>

        {/* composer */}
        <div className="px-4 pt-3">
          <label htmlFor="tono-draft" className="sr-only">
            paste a draft to rewrite
          </label>
          <textarea
            id="tono-draft"
            ref={taRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              // Cmd/Ctrl+Enter triggers a rewrite from the keyboard.
              if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
                e.preventDefault()
                submit()
              }
            }}
            placeholder={EXAMPLE_PLACEHOLDER}
            rows={3}
            spellCheck={false}
            className="w-full resize-none bg-transparent text-[14px] text-tono-text-soft italic leading-[1.5] placeholder:text-tono-muted placeholder:not-italic placeholder:font-normal focus:outline-none"
          />
        </div>

        {/* action row */}
        <div className="flex items-center justify-between gap-3 px-4 py-3 border-t border-tono-border">
          <span className="text-[10px] font-mono lowercase text-tono-muted">
            {loading
              ? 'thinking…'
              : status === 'rate_limited'
              ? retryInSec !== null
                ? `wait ${formatRemaining(retryInSec)}`
                : 'wait one moment'
              : result
              ? 'pick one — copy, send'
              : 'enter text → rewrite'}
          </span>
          <button
            type="button"
            onClick={submit}
            disabled={isDisabled}
            aria-busy={loading || undefined}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-[10px] bg-tono-accent hover:bg-tono-accent-hover disabled:bg-tono-bg-elev disabled:text-tono-muted text-white font-semibold text-[13px] transition min-h-[40px]"
          >
            <span className="inline-flex items-center gap-2">
              {loading ? (
                <span
                  aria-hidden="true"
                  className="inline-block w-3 h-3 rounded-full border-2 border-white/30 border-t-white animate-spin"
                />
              ) : null}
              {buttonLabel}
            </span>
            {!loading && status !== 'rate_limited' ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            ) : null}
          </button>
        </div>

        {/* rate-limit countdown / error banner */}
        {error ? (
          <div className="mx-3 mt-3 mb-1 px-3 py-3 rounded-[10px] border border-tono-danger/40 bg-tono-danger/10 text-[12px] text-tono-text-soft flex items-start justify-between gap-3">
            <div role="alert" className="leading-[1.45] flex-1">
              <p>{error}</p>
              {status === 'server_error' || status === 'rate_limited' ? (
                <button
                  type="button"
                  onClick={retry}
                  className="mt-2 inline-flex items-center gap-1.5 text-[12px] font-semibold text-tono-accent-light hover:text-tono-accent transition"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M3 12a9 9 0 0 1 15.5-6.3L21 8" />
                    <path d="M21 3v5h-5" />
                  </svg>
                  {status === 'rate_limited' && retryInSec !== null
                    ? `retry in ${formatRemaining(retryInSec)}`
                    : 'retry now'}
                </button>
              ) : null}
            </div>
            <button
              type="button"
              onClick={() => {
                setError(null)
                if (status === 'rate_limited') {
                  setStatus('idle')
                  setRetryInSec(null)
                  if (retryTickRef.current) {
                    clearInterval(retryTickRef.current)
                    retryTickRef.current = null
                  }
                } else {
                  setStatus('idle')
                }
              }}
              aria-label="dismiss message"
              className="shrink-0 w-6 h-6 inline-flex items-center justify-center rounded-md text-tono-text-softer hover:text-tono-text hover:bg-tono-bg-card/60 transition"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M6 6l12 12M6 18L18 6" />
              </svg>
            </button>
          </div>
        ) : null}

        {/* results */}
        {(result?.suggestions?.length || showSkeleton) && (
          <div className="px-2.5 py-2 space-y-1.5 border-t border-tono-border bg-tono-bg-soft">
            {/* Skeleton — visible the moment a request is in flight so
                the user gets sub-100ms feedback. Uses animated gradient
                shimmer to indicate "still working". */}
            {showSkeleton ? (
              <>
                <div className="px-2 py-3 text-[12px] text-tono-text-softer italic">
                  rewarming the model…
                </div>
                {TONE_ORDER.map((axis) => (
                  <div
                    key={`skel-${axis}`}
                    className="bg-tono-bg-elev border border-tono-border rounded-[10px] p-2.5 tono-skel-pulse"
                    aria-hidden="true"
                  >
                    <div className="flex items-center gap-1.5 mb-2">
                      <span
                        className={`w-1.5 h-1.5 rounded-full tone-dot-sm-${axis}`}
                      />
                      <span
                        className={`text-[10px] font-semibold tracking-[0.04em] uppercase tone-text-${axis}`}
                      >
                        {axis}
                      </span>
                    </div>
                    <div className="h-2.5 rounded-md bg-tono-bg-card mb-1.5" style={{ width: '92%' }} />
                    <div className="h-2.5 rounded-md bg-tono-bg-card" style={{ width: '60%' }} />
                  </div>
                ))}
              </>
            ) : null}
            {result?.suggestions?.length
              ? TONE_ORDER.map((axis) => {
                  const s = result.suggestions!.find((x) => x.axis === axis)
                  if (!s) return null
                  const copiedFlag = copied === axis
                  return (
                    <div
                      key={axis}
                      className={`bg-tono-bg-elev border border-tono-border rounded-[10px] p-2.5 transition tone-rule-l-${axis}`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`w-1.5 h-1.5 rounded-full tone-dot-sm-${axis}`}
                            aria-hidden="true"
                          />
                          <span
                            className={`text-[10px] font-semibold tracking-[0.04em] uppercase tone-text-${axis}`}
                          >
                            {axis}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => copy(axis, s.text)}
                          aria-label={`copy ${axis} rewrite`}
                          className="text-[10px] font-mono lowercase text-tono-text-softer hover:text-tono-text-soft transition px-2 py-1 rounded-md hover:bg-tono-bg-card"
                        >
                          {copiedFlag ? 'copied' : 'copy'}
                        </button>
                      </div>
                      <p
                        data-tone-result={axis}
                        className="text-[12px] text-tono-text-soft leading-[1.45]"
                      >
                        {s.text}
                      </p>
                    </div>
                  )
                })
              : null}
          </div>
        )}

        {/* keyboard hint footer */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-tono-bg border-t border-tono-border">
          <span className="text-[10px] font-mono lowercase text-tono-muted">
            ⌘/ctrl + enter to rewrite
          </span>
          <span className="text-[10px] font-mono lowercase text-tono-accent-light">
            drafts stay in your browser
          </span>
        </div>
      </div>
    </aside>
  )
}
