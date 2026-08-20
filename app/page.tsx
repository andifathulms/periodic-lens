import { redirect } from 'next/navigation'
import { DEFAULT_LOCALE } from '@/lib/i18n'

/** English primary. PRD.md §2. */
export default function Root() {
  redirect(`/${DEFAULT_LOCALE}/table`)
}
