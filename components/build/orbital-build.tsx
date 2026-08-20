'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { AUFBAU_EXCEPTIONS, blockOf } from '@/lib/elements/aufbau'
import {
  BUILD_DURATION_MS,
  SUBSHELL_STEPS,
  TOTAL_STEPS,
  stepAt,
} from '@/lib/elements/build'
import { ELEMENTS } from '@/lib/elements/data'
import { FillingRule } from '@/components/build/filling-rule'
import { LensLegend } from '@/components/legend/lens-legend'
import { tokenFor } from '@/lib/elements/lens'
import { extent, position } from '@/lib/elements/layout'
import { type Locale, t, term } from '@/lib/i18n'

/**
 * The table assembling itself from the filling rule, and then the rule's
 * failures.
 *
 * The exception toggle SWAPS the fill rather than layering on top of it —
 * invariant 1 holds here as much as on the table page. With it on, the cells
 * are coloured by whether the published configuration follows the rule; with
 * it off, by block. Two questions, two colourings, never both at once.
 *
 * Reduced motion gets the stepped sequence (DESIGN.md §5): the same
 * annotations, advanced one subshell at a time, complete rather than degraded.
 */
export function OrbitalBuild({ locale }: { locale: Locale }) {
  const [placed, setPlaced] = useState(TOTAL_STEPS)
  const [playing, setPlaying] = useState(false)
  const [exceptions, setExceptions] = useState(false)
  const [reduced, setReduced] = useState(false)
  const frame = useRef<number | undefined>(undefined)
  const started = useRef<number | undefined>(undefined)

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const apply = () => setReduced(query.matches)
    apply()
    query.addEventListener('change', apply)
    return () => query.removeEventListener('change', apply)
  }, [])

  useEffect(() => {
    if (!playing || reduced) return
    const from = placed >= TOTAL_STEPS ? 0 : placed
    started.current = undefined
    const tick = (now: number) => {
      if (started.current === undefined) started.current = now
      const elapsed = now - started.current
      const next = from + Math.round((elapsed / BUILD_DURATION_MS) * TOTAL_STEPS)
      if (next >= TOTAL_STEPS) {
        setPlaced(TOTAL_STEPS)
        setPlaying(false)
        return
      }
      setPlaced(next)
      frame.current = requestAnimationFrame(tick)
    }
    frame.current = requestAnimationFrame(tick)
    return () => {
      if (frame.current !== undefined) cancelAnimationFrame(frame.current)
    }
    // `placed` is read once to resume from where the scrubber was left.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, reduced])

  const stepForward = useCallback(() => {
    setPlaced((current) => {
      const next = SUBSHELL_STEPS.find((step) => step.placed > current)
      return next ? next.placed : TOTAL_STEPS
    })
  }, [])

  const step = stepAt(Math.max(placed, 1))
  const box = extent('standard')

  return (
    <div className="flex flex-col gap-16">
      <FillingRule current={step ? `${step.n}${step.l}` : undefined} locale={locale} />
      <div className="overflow-x-auto">
        <div
          className="relative"
          style={{
            width: `calc(${box.width} * var(--cell))`,
            height: `calc(${box.height} * var(--cell))`,
          }}
        >
          {ELEMENTS.map((element) => {
            const point = position('standard', element.z)
            const revealed = element.z <= placed
            const anomalous = AUFBAU_EXCEPTIONS.includes(element.z)
            /*
             * The exception view has its own two tokens. Borrowing the
             * category palette here painted chromium — a transition metal —
             * with the alkali-metal colour, which said something false to any
             * reader who had learned the category lens.
             */
            const token = exceptions
              ? anomalous
                ? '--aufbau-exception'
                : '--aufbau-follows'
              : tokenFor('block', blockOf(element.z))
            return (
              <div
                key={element.z}
                className="absolute left-0 top-0"
                style={{
                  transform: `translate(calc(${point.x} * var(--cell)), calc(${point.y} * var(--cell)))`,
                }}
              >
                <div
                  className="cell-morph rounded hairline relative"
                  style={{
                    width: 'var(--cell)',
                    height: 'var(--cell)',
                    backgroundColor: revealed ? `var(${token})` : 'transparent',
                    borderStyle: revealed ? 'solid' : 'dashed',
                    opacity: revealed ? 1 : 0.35,
                  }}
                >
                  {revealed ? (
                    <>
                      <span
                        className="absolute font-mono tabular text-ink"
                        style={{
                          left: 'var(--cell-pad)',
                          top: 'calc(var(--cell-pad) / 2)',
                          fontSize: 'var(--cell-type-z)',
                        }}
                      >
                        {element.z}
                      </span>
                      <span
                        className="absolute inset-x-0 text-center font-display font-semibold leading-none"
                        style={{ top: 'var(--cell-symbol-top)', fontSize: 'var(--cell-type-symbol)' }}
                      >
                        {element.symbol}
                      </span>
                      {exceptions && anomalous ? (
                        <span
                          className="absolute text-center font-mono text-ink truncate"
                          style={{
                            left: 'calc(var(--cell-pad) / 2)',
                            right: 'calc(var(--cell-pad) / 2)',
                            bottom: 'calc(var(--cell-pad) / 2)',
                            fontSize: 'var(--cell-type-name)',
                          }}
                        >
                          {element.configuration.notation}
                        </span>
                      ) : null}
                    </>
                  ) : null}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-12">
        {reduced ? (
          <button
            type="button"
            onClick={stepForward}
            className="rounded hairline px-12 py-4 text-body hover:border-ink"
          >
            {t(locale, 'build.step')}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setPlaying((current) => !current)}
            className="rounded hairline px-12 py-4 text-body hover:border-ink"
          >
            {playing ? t(locale, 'build.pause') : t(locale, 'build.play')}
          </button>
        )}
        <button
          type="button"
          onClick={() => {
            setPlaying(false)
            setPlaced(0)
          }}
          className="rounded hairline px-12 py-4 text-body hover:border-ink"
        >
          {t(locale, 'build.replay')}
        </button>
        <label className="flex items-center gap-8 text-body">
          <input
            type="checkbox"
            checked={exceptions}
            onChange={(event) => setExceptions(event.target.checked)}
          />
          {t(locale, 'build.exceptions')}
        </label>
      </div>

      {/*
       * DESIGN.md §8 — a colour with no key is not shippable, and this page
       * had none at all. While the toggle is off the cells are block
       * coloured, so the block legend is the key; while it is on they are
       * answering a different question and carry their own.
       */}
      {exceptions ? (
        <ul className="flex flex-wrap items-center gap-x-24 gap-y-8 text-micro">
          <li className="flex items-center gap-8">
            <span
              aria-hidden
              className="inline-block h-16 w-16 shrink-0 rounded hairline"
              style={{ backgroundColor: 'var(--aufbau-exception)' }}
            />
            {t(locale, 'build.keyException')}
          </li>
          <li className="flex items-center gap-8">
            <span
              aria-hidden
              className="inline-block h-16 w-16 shrink-0 rounded hairline"
              style={{ backgroundColor: 'var(--aufbau-follows)' }}
            />
            {t(locale, 'build.keyFollows')}
          </li>
        </ul>
      ) : (
        <LensLegend lens="block" locale={locale} />
      )}

      <label className="flex flex-col gap-4">
        <span className="sr-only">{t(locale, 'build.filling')}</span>
        <input
          type="range"
          min={0}
          max={TOTAL_STEPS}
          value={placed}
          onChange={(event) => {
            setPlaying(false)
            setPlaced(Number(event.target.value))
          }}
          className="w-full"
        />
      </label>

      <p className="font-mono text-body tabular">
        {t(locale, 'build.filling')}{' '}
        <span className="font-semibold">
          {step ? `${step.n}${step.l}` : '—'}
          {step ? ` (${step.within}/${step.capacity})` : ''}
        </span>{' '}
        · {placed} {t(locale, 'build.placed')}
        {step ? ` · ${term(locale, step.l)}` : ''}
      </p>

      {reduced ? <p className="text-micro text-muted">{t(locale, 'build.reduced')}</p> : null}
    </div>
  )
}
