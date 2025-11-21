import { Suspense } from 'react'
import ViewPageContent from './ViewPageContent'

export const dynamic = 'force-dynamic'

export default function ViewPage() {
  return (
    <Suspense fallback={<div className="p-4 text-center">載入中...</div>}>
      <ViewPageContent />
    </Suspense>
  )
}
