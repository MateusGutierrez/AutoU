import { EmailClassificationForm } from '@/components/form/EmailClassificationForm';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/quickStart')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex-1 items-center justify-center p-2 py-20">
      <EmailClassificationForm />
    </div>
  );
}
