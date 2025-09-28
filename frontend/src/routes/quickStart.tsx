import { EmailClassificationForm } from '@/components/form/EmailClassificationForm';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/quickStart')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <div className="mt-4 flex flex-col gap-2">
        <h1 className="scroll-m-20 text-start text-2xl font-extrabold tracking-tight text-balance">
          Classificação Inteligente de Email
        </h1>
        <p>
          Use nossa tecnologia avançada de inteligência artificial para classificar automaticamente seus e-mails e obter sugestões de respostas personalizadas de forma rápida e eficiente.
        </p>
      </div>
      <div className="flex-1 items-center justify-center p-2 py-16">
        <EmailClassificationForm />
      </div>
    </>
  );
}
