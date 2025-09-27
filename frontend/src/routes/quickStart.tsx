import { EmailClassificationForm } from '@/components/form/EmailClassificationForm';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/quickStart')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <div className="flex flex-col gap-2 mt-4">
        <h1 className="scroll-m-20 text-start text-2xl font-extrabold tracking-tight text-balance">
          Intelligent Email Classification
        </h1>
        <p>
          Use our advanced artificial intelligence technology to automatically classify your emails
          and get personalized response suggestions quickly and efficiently.
        </p>
      </div>
      <div className="flex-1 items-center justify-center p-2 py-16">
        <EmailClassificationForm />
      </div>
    </>
  );
}
