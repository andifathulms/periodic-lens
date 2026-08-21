/**
 * The Tangga mark: three blocks in a growing staircase — 2, then wider, then
 * wider again — which is the periodic table's own silhouette, and the same
 * argument the whole app makes.
 *
 * Inlined rather than fetched. It is 362 bytes of geometry; an <img> would
 * cost a request and a layout reservation to save nothing, and inlining keeps
 * it legible before any network beyond the document.
 *
 * Colours are the brand kit's, not the app's tokens. They are near enough to
 * be indistinguishable — the two inks measure 1.02:1 against each other — and
 * the mark should stay the mark wherever it appears, including on surfaces
 * this app does not own.
 */
export function Mark({ size = 22 }: { size?: number }) {
  return (
    <svg
      aria-hidden
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className="shrink-0"
    >
      <rect x="0" y="0" width="100" height="100" rx="22" fill="#1C1A18" />
      <rect x="14" y="14" width="18" height="18" rx="3" fill="#F5F2EA" />
      <rect x="34" y="34" width="22" height="22" rx="3" fill="#E0879B" />
      <rect x="58" y="58" width="26" height="26" rx="3" fill="#7CA6D8" />
    </svg>
  )
}
