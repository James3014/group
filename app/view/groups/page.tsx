import { Suspense } from 'react'
import ViewGroupsContent from './ViewGroupsContent'

export const dynamic = 'force-dynamic'

export default function ViewGroupsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">載入中...</div>}>
      <ViewGroupsContent />
    </Suspense>
  )
}
