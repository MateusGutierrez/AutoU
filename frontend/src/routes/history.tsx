import History from '@/components/history'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/history')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div className='p-2'>
    <History/>
  </div>
}
