import { Suspense } from 'react'
import ViewPeopleContent from './ViewPeopleContent'

export const dynamic = 'force-dynamic'

export default function ViewPeoplePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">載入中...</div>}>
      <ViewPeopleContent />
    </Suspense>
  )
}
