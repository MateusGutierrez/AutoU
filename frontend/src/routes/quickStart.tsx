import { EmailClassificationForm } from '@/components/form/EmailClassificationForm';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/quickStart')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="p-2 flex-1 items-center justify-center py-20">
      <EmailClassificationForm />
    </div>
  );
}
