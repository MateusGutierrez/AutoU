import History from '@/components/history';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/history')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
        <>
          <div className='flex flex-col gap-2 mt-4'>
            <h1 className="scroll-m-20 text-start text-2xl font-extrabold tracking-tight text-balance">
          Email Classification History
        </h1>
        <p>
          View the complete history of your classified emails with detailed analysis including 
    status, urgency level, confidence scores, and content type for better email management.
        </p>
          </div>
            <div className="flex-1 items-center justify-center p-2 py-16">
              <History />
            </div>
        </>
  );
}
